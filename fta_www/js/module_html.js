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
      function traiteAstDeHtml
      
      Construit texte html à partir d'un AST html qui ressemble à ça :
      {"type":"BODY",
        "content":[
          {"type":"DIV","content":["a"],"attributes":{"class":"a"}},
          {"type":"DIV","content":["b"],"attributes":{"class":"b"}},
          "\n"
         ]
      }
      
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
                      }else if(jsonDeHtml.attributes.type.toLowerCase()==='text/javascript' && jsonDeHtml.hasOwnProperty('content')){
                          /*
                           si il y a du contenu ( content existe ), 
                          */
                          t+='\n'+esp0+'javascriptDansHtml(';
                          type='javascriptDansHtml'
                      }else if(jsonDeHtml.attributes.type.toLowerCase()==='text/javascript' && !jsonDeHtml.hasOwnProperty('content')){
                          /*
                           c'est un tag script avec src=""
                          */

                          typeScriptNonTraite=false;
                          type='script';
                          t+='\n'+esp0+'script(';
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
                     if(type.toLowerCase()==='#text'){
                         t+='';
                     }else{
                         t+='\n'+esp0+type+'(';
                     }
                     
                 }
             }
         }
         
         if(jsonDeHtml.attributes){
             for(var attr in jsonDeHtml.attributes){
                 if(attributs!==''){
                  attributs+=','
                 }
                 attributs+='(\''+attr.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\',"'+jsonDeHtml.attributes[attr].replace(/"/g,'&quot;')+'")';
/*                 
                 for(var j in jsonDeHtml.attributes[attr]){
                     attributs+='(\''+j.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\',"'+jsonDeHtml.attributes[attr][j].replace(/"/g,'&quot;')+'")';
                 }
*/                 
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

             if(jsonDeHtml.content[0].content){
                 var chaineJsEquivalente='var a='+jsonDeHtml.content[0].content.replace(/&quot;/g,'"').replace(/\\\//g,'/')+';' // 
             }else{
                 var chaineJsEquivalente='var a='+jsonDeHtml.content[0].replace(/&quot;/g,'"').replace(/\\\//g,'/')+';' // 
             }
             var obj=convertit_source_javascript_en_rev(chaineJsEquivalente);
             if(obj.status===true){
                 t+=''+obj.value+'';
             }else{
                 return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0142 '+jsonDeHtml.type}));
             }
             t+='\n'+esp0+')';
             
         }else if(type.toLowerCase()==='javascriptdanshtml' && jsonDeHtml.content && jsonDeHtml.content.length>0){

             if(Array.isArray(jsonDeHtml.content)){
                 for(var i=0;i<jsonDeHtml.content.length;i++){
                   if(jsonDeHtml.content[i].type && jsonDeHtml.content[i].type==='#text' || jsonDeHtml.content[i].type==='#cdata-section' ){
                       var obj=convertit_source_javascript_en_rev(jsonDeHtml.content[i].content);
                       if(obj.status===true){
                           contenu+=obj.value;
                       }else{
                           return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0187 '+jsonDeHtml.type}));
                       }
                   }else if( !jsonDeHtml.content[i].hasOwnProperty('type') ){
                       /*
                          il n'y a pas la propriété type, on suppose que c'est un text/javascript
                       */
                       var obj=convertit_source_javascript_en_rev(jsonDeHtml.content[i]);
                       if(obj.status===true){
                           if(t.indexOf('text/javascript')>=0){
                               contenu+=obj.value;
                           }else{
                               contenu+='(\'type\' , "text/javascript")'+obj.value;
                           }
                       }else{
                           return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0187 '+jsonDeHtml.type}));
                       }

                   }else{
                       return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0190 '+jsonDeHtml.type}));
                   }
                 }
             }else{
                  var obj=convertit_source_javascript_en_rev(jsonDeHtml.content);
                  if(obj.status===true){
                      contenu+='<![CDATA['+obj.value+']]>';
                  }else{
                      return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0198 '+jsonDeHtml.type}));
                  }

             }
             t+='\n'+esp0+contenu+')';
             
         }else if(jsonDeHtml.content && jsonDeHtml.content.length>0){
             if(Array.isArray(jsonDeHtml.content)){
                 for(var i=0;i<jsonDeHtml.content.length;i++){
                     /*
                       =======================
                       entree dans le récursif
                       =======================
                     */
                     obj=this.traiteAstDeHtml(jsonDeHtml.content[i],niveau+1,retirerHtmlHeadEtBody,type);
                     if(obj.status===true){
                         if((attributs!=='' || contenu!=='') && obj.value!==''){
                          contenu+=',';
                         }
                         contenu+=obj.value;
                     }else{
                         return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0.129 '+jsonDeHtml.type}));
                     }
                 }
             }else{
                 contenu+=jsonDeHtml.content;
             }
             if(type.toLowerCase()==='#text'){
                 contenu=contenu.replace(/\n/g,' ').replace(/\r/g,' ').trim();
                 if(contenu!==''){
                     t+='\''+contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'';
                 }
             }else{
                 t+=contenu;
                 if(jsonDeHtml.type!==''){
                     if(obj && obj.dernierEstTexte){
                         t+=')';
                     }else{
                         if(contenu===''){
                             t+=')';
                         }else{
                             if(jsonDeHtml.type.toLowerCase()==='#comment'){
                                 t+=')';
                             }else{
                                 t+='\n'+esp0+')';
                             }
                         }
                     }
                 }
             }
         }else{
             if(type.toLowerCase()==='#text'){
             }else{
                 if(jsonDeHtml.type!==''){
                     t+=')';
                 }
             }
         }
      
     }else{
      
         if(typeParent==='#comment'){

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
             // debugger
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
                 if(jsonDeHtml.hasOwnProperty('content')){
                     if(typeof jsonDeHtml.content === 'string'){
                         contenu=jsonDeHtml.content.replace(/\r/g,' ').replace(/\n/g,' ').trim();
                     }else{
                         debugger
                     }
                 }else{
                     contenu=jsonDeHtml.replace(/\r/g,' ').replace(/\n/g,' ').trim();
                 }
             }catch(e){
                 /*
                 dans le cas où le jsonDeHtml n'existe pas
                 */
                 contenu='';
             }
             if(contenu.indexOf('&')>=0 || contenu.indexOf('>')>=0 || contenu.indexOf('<')>=0 || contenu.indexOf('"')>=0){
//                 contenu=contenu.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
             }
             if(contenu!=='' ){
                 //contenu='\''+contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'';
                 contenu='"'+contenu.replace(/"/g,'&quot;')+'"';
             }
             t+=contenu;
             if(contenu!=''){
                 dernierEstTexte=true;
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
            // console.log('matriceFonction.value=',JSON.stringify(matriceFonction.value).replace(/\],/g,'],\n'));

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
                                if(nouveauJsonDeHtml.status===true){
                                    var obj1=this.traiteAstDeHtml(nouveauJsonDeHtml.value,0,false,'');
                                    if(obj1.status===true){
                                     t=obj1.value;
                                    }else{
                                     return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0314 '}));
                                    }
                                }else{
                                    return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0317 '}));
                                }

                            }else{
                                var nouveauJsonDeHtml=this.mapMatriceVersJsonDeHtml(nouveauTableau2);
                                if(nouveauJsonDeHtml.status===true){
                                    var obj1=this.traiteAstDeHtml(nouveauJsonDeHtml.value,0,false,'');
                                    if(obj.status===true){
                                        t=obj.value;
                                    }else{
                                        return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
                                    }
                                }else{
                                    return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0317 '}));
                                }
                            }
                        }else{
                            var nouveauJsonDeHtml=this.mapMatriceVersJsonDeHtml(nouveauTableau2);
                            if(nouveauJsonDeHtml===true){
                                var obj1=this.traiteAstDeHtml(nouveauJsonDeHtml.value,0,false,'');
                                if(obj1.status===true){
                                    t=obj1.value;
                                }else{
                                    return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0340 '}));
                                }
                            }else{
                                return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0343 '}));
                            }
                        }
                    }else{
                           /*
                             la balise head contient des éléments, 
                           */
                           /* si la balise body ne contient rien, */
                           var body_est_vide=false;
                           for(var i=nouveauTableau1.length-1;i>=0 && body_est_vide===false ; i--){
                               if(nouveauTableau1[i][1].toLowerCase()==='body' && nouveauTableau1[i][2]==='f'  && nouveauTableau1[i][3]===0){
                                   body_est_vide=true;
                                   nouveauTableau1.splice(i,1);

                                   t='';
                                   for(var j=0;j<nouveauTableau1.length;j++){
                                       if(nouveauTableau1[j][7]===1){
                                           var obj=a2F1(nouveauTableau1,1,true,j,false);
//                                           var obj=this.tabToHtml0(nouveauTableau1,j,false,false,false,true,0);
                                           if(obj.status===true){
                                               t+=','+obj.value+'\n';
                                           }else{
                                               return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
                                           }
                                       }
                                   }
                                   if(t!==false){
                                    t=t.substr(1);
                                   }
                                   
                               }
                           }
                           if(body_est_vide===true){
                           }else{
                           
                               /*on reconstruit le source à partir de matriceFonction.value
                                 avec des retours de lignes et sans coloration
                               */
                               var nouveauJsonDeHtml=this.mapMatriceVersJsonDeHtml(nouveauTableau1);
                               var obj1=this.traiteAstDeHtml(nouveauJsonDeHtml.value,0,false,'');
                               
                               
                               if(obj1.status===true){
                                t=obj1.value;
                               }else{
                                return(logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 0217 '}));
                               }
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
     /*
     on retourne du html "pur"
     */
     return({status:true,value:t,'dernierEstTexte':dernierEstTexte});
    }
    /*
      =======================================================================================
      function mapDOM
      fonction trouvée sur le net ( désolé, j'ai perdu la référence )
      A partir d'un html, on reconstruit un équivalent "ast" ( abstract syntax tree )
      =======================================================================================
    */
    mapDOM(element){
        var treeObject={};
        if(typeof element === 'string'){
            var parser= new DOMParser();
            /*
              "application/xml"
              "image/svg+xml"
              "text/html"
            */
            var docNode = parser.parseFromString('<aaaaa>'+element+'</aaaaa>','application/xml'); // element.replace(/&nbsp;/g,'&amp;#160;')
            var elementNoeud=docNode.firstChild; // element
            if(docNode.getElementsByTagName('parsererror').length || element.indexOf('<')<0){
                /*
                  ce n'est pas un xml parfait
                */

                var docNode = parser.parseFromString(element.replace(/&/g,'&amp;'),'text/html');
                elementNoeud = docNode.firstChild;

                
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
                    if(element.attributes && element.attributes != null){
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

                treeHTML(elementNoeud,treeObject);
                return {status:true, value:treeObject,parfait:false};
                
                
                
            }else{
                /*
                  c'est un xml parfait, on retire la racine aaaaa et on le traite
                */
                elementNoeud = docNode.firstChild.childNodes;
                
                function treeXML(elements, objet , niveau){
                    try{
                        var les_contenus=[];
                        for(var i=0;i<elements.length;i++){
                            var le_noeud={}
                            var les_attributs={};
                            le_noeud['type']=elements[i].nodeName;
                            if(elements[i].attributes && elements[i].attributes.length>0){
                                for(var j=0;j<elements[i].attributes.length;j++){
//                                    var l_attribut={};
//                                    l_attribut[elements[i].attributes[j].name]=elements[i].attributes[j].value;
                                    les_attributs[elements[i].attributes[j].name]=elements[i].attributes[j].value;
//                                    les_attributs.push(l_attribut);
                                }
                                le_noeud['attributes']=les_attributs;
                            }
                            if(elements[i].childNodes && elements[i].childNodes.length>0){
                                treeXML(elements[i].childNodes,le_noeud);
                            }else{
                                if(elements[i].data){
                                    le_noeud.content=elements[i].data;
                                }else{
                                    le_noeud.content=null;
                                }
                            }
                            les_contenus.push(le_noeud);
                        }
                        objet.content=JSON.parse(JSON.stringify(les_contenus))
                    }catch(e){
                        debugger;
                    }
                    
                }
                treeObject['type']='';
                treeXML(elementNoeud,treeObject,0);
                return {status:true, value:treeObject,parfait:true};
                
            }
        }
        
    }


    /* 
      =======================================================================================
      function mapMatriceVersJsonDeHtml
      construit un ast à partir d'une matrice rev de html
      <div class="a">a</div><div class="b">b</div>
      [
       [0,""      ,"INIT" ,-1,0 ,0, 0,0,6,0,0, 0,0,""],
       [1,"div"   ,"f"    ,0 ,0,33,35,0,2,1,2,36,0,""],
       [2,""      ,"f"    ,1 ,0,33,35,1,2,1,1,37,0,""],
       [3,"class" ,"c"    ,2 ,0,38,42,2,0,1,0,37,0,""],
       [4,"a"     ,"c"    ,2 ,3,45,45,2,0,2,0,37,0,""],
       [5,"a"     ,"c"    ,1 ,3,50,50,1,0,2,0,37,0,""],
       [6,"div"   ,"f"    ,0 ,0,61,63,0,2,2,2,64,0,""],
       [7,""      ,"f"    ,1 ,0,61,63,6,2,1,1,65,0,""],
       [8,"class" ,"c"    ,2 ,0,66,70,7,0,1,0,65,0,""],
       [9,"b"     ,"c"    ,2 ,3,73,73,7,0,2,0,65,0,""],
       [10,"b"    ,"c"    ,1 ,3,78,78,6,0,2,0,65,0,""]
      ]
      {"type":"BODY",
        "content":[
          {"type":"DIV","content":["a"],"attributes":{"class":"a"}},
          {"type":"DIV","content":["b"],"attributes":{"class":"b"}},
          "\n"
         ]
      }
      =======================================================================================  
    */
    mapMatriceVersJsonDeHtml(matrice){
     
        // console.log('matrice=',JSON.stringify(matrice).replace(/\],/g,'],\n'));



        function reconstruit(tab,parentId){
            var l01=tab.length;
            var un_element={};
            var contenu=[];
            var attrib={};
            var indice=0;
            var i=0;
            var j=0;
            for(indice=parentId+1;indice<l01 && tab[indice][3]> tab[parentId][3];indice++){
                if(tab[indice][7]===parentId){

                    if(tab[indice][2]==='f' && tab[indice][1]!==''){

                        attrib={};
                        var a_des_attributs=false;
                        
                        // recherche des attributs éventuels
                        
                        for(var i=indice+1;i<l01;i++){
                            if(tab[i][7]===indice && tab[i][1]==='' && tab[i][2]==='f'){
                              if(tab[i][8]===1){
                                  attrib[tab[i+1][1]]=null;     
                                  a_des_attributs=true;
                              }else if(tab[i][8]===2){
                                  attrib[tab[i+1][1]]=tab[i+2][1];     
                                  a_des_attributs=true;
                              }else{
                                  return {status:false , message:'0547 nombre incorrect pour les attributs'};
                              }
                           }
                        }
                        if(a_des_attributs===true){
                            un_element['attributes']=JSON.parse(JSON.stringify(attrib));
                        }

                     
                        un_element['type']=tab[indice][1];
                        
                         
                            // si c'est une fonction non vide, on sait que c'est un tag
                            
                            // recherche des autres éléments
                            var le_contenu=[];
                            for(var i=indice+1;i<l01;i++){
                                if(tab[i][7]===indice && tab[i][1]!=='' ){
                                  if(tab[i][2]==='c'){
                                   le_contenu.push({content:tab[i][1]})
                                  }else{
                                   
                                   
                                      attrib={};
                                      var a_des_attributs=false;
                                      
                                      // recherche des attributs éventuels
                                      
                                      for(var j=i+1;j<l01 && tab[j][3]> tab[i][3];j++){
                                          if(tab[j][7]===i && tab[j][1]==='' && tab[j][2]==='f'){
                                            if(tab[j][8]===1){
                                                attrib[tab[j+1][1]]=null;     
                                                a_des_attributs=true;
                                            }else if(tab[j][8]===2){
                                                attrib[tab[j+1][1]]=tab[j+2][1];     
                                                a_des_attributs=true;
                                            }else{
                                                return {status:false , message:'0547 nombre incorrect pour les attributs'};
                                            }
                                         }
                                      }
                                      
                                      if(tab[tab[i][7]][1].toLowerCase()==='javascriptdanshtml'){

                                          
                                          var debut=indice+1;
                                          for( var j=indice+1;j<l01;j++){
                                           if(tab[j][7]===indice){
                                            if(tab[j][1]==='' && tab[j][2]==='f'){
                                            }else{
                                             debut=j;
                                             break;
                                            }
                                           }
                                          }


                                          var objContenuJs=parseJavascript0(tab,debut,0);

                                          if(objContenuJs.status===true){
                                              le_contenu.push(JSON.parse(JSON.stringify({type:'javascriptdanshtml',content:objContenuJs.value,attributes:attrib})));
                                          }else{
                                              return(asthtml_logerreur({status:false,message:'module_html erreur 0635 '}));
                                          }
                                          
                                          
                                      }else if(tab[parentId][1].toLowerCase()==='ldplusjsondanshtml'){

                                          var debut=indice+1;
                                          for( var j=indice+1;j<l01;j++){
                                           if(tab[j][7]===indice){
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
                                           le_contenu.push(JSON.parse(JSON.stringify({type:'ldplusjsondanshtml',content:contenu,attributes:attrib})));
                                           
                                           
                                           
                                          }else{
                                           return(asthtml_logerreur({status:false,message:'module_html erreur 0660 '}));
                                          }
                                          
                                          
                                          
                                          
                                      }else{
                                          var obj=reconstruit(tab,i);
                                          if(obj.status===true){
                                              if(a_des_attributs===true){
                                                  le_contenu.push(JSON.parse(JSON.stringify({type:tab[i][1],content:obj.content,attributes:attrib})));
                                                  attrib={};
                                              }else{
                                                  le_contenu.push(JSON.parse(JSON.stringify({type:tab[i][1],content:obj.content})));
                                              }
                                          }else{
                                              return {status:false , message:'0563 '};
                                          }
                                      }
                                  }
                               }
                            }
                            if(le_contenu.length>0){
                                un_element['content']=JSON.parse(JSON.stringify(le_contenu));
                            }
                            contenu.push(JSON.parse(JSON.stringify(un_element)))
                            un_element={}
                            
                            
                        
                    }else if(tab[indice][2]==='c'){
                        un_element['content']=tab[indice][1];
                        contenu.push(JSON.parse(JSON.stringify(un_element)))
                        un_element={}
                    }
                    
                }
            }

            if(parentId!==0){
              return {status:true,content:contenu};
            }else{

              return {status:true,content:{type:'',content:contenu}};
            }
        }

        /* 
         =======================================================================================
         On définit une fonction dans une fonction car elle sera appelée récursivement
         =======================================================================================  
        */
        function reconstruit2(tab,parentId){
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
              return(asthtml_logerreur({status:false,message:'module_html erreur 0477 '}));
             }


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
                   return(asthtml_logerreur({status:false,message:'module_html erreur 0503 '}));
               }
               console.log('objContenuJs=',objContenuJs);
             
           }else if(tab[parentId][1]==='@'){
            
             debugger
            
           }else if(tab[parentId][8]===0 && parentId>0){
            
               content.push('');
            
           }else{

               for(var indice=parentId+1;indice<l01;indice++){
                   var element={type:'',attributes:null,content:null};
                   if(tab[indice][7]===parentId){
                       
                       /*
                       */
                       
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

                                    var obj=reconstruit(tab,indice);
                                    if(obj.status===true){
                                      content.push(obj.value);
                                    }else{
                                      return(asthtml_logerreur({status:false,message:'module_html erreur 0541 '}));
                                    }
                               
                                    var max=l01-1;
                                    for( var j=indice+1;j<l01;j++){
                                     if(tab[j][3]<=tab[indice][3]){
                                      max=j-1;
                                      break;
                                     }
                                    }
                                    indice=max;

                               }else if('javascriptdanshtml'===tab[indice][1].toLowerCase()){

                                    var obj=reconstruit(tab,indice);
                                    if(obj.status===true){
                                      content.push(obj.value);
                                    }else{
                                      return(asthtml_logerreur({status:false,message:'module_html erreur 0559 '}));
                                    }

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
                                   var obj=reconstruit(tab,indice);
                                   if(obj.status===true){
                                     content.push(obj.value);
                                   }else{
                                     return(asthtml_logerreur({status:false,message:'module_html erreur 0559 '}));
                                   }
                                   
                                   var max=l01-1;
                                   for( var j=indice+1;j<l01;j++){
                                    if(tab[j][3]<=tab[indice][3]){
                                     max=j-1;
                                     break;
                                    }
                                   }
                                   indice=max;
                                   
                               }
                           }else{
                               var obj=reconstruit(tab,indice);
                               if(obj.status===true){
                                 content.push(obj.value);
                               }else{
                                 return(asthtml_logerreur({status:false,message:'module_html erreur 0559 '}));
                               }
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
           return({status:true,value:leJson});
        }
        /* 
         =======================================================================================
         L'appel récursif se fait ici
         =======================================================================================
        */
        
        var obj=reconstruit(matrice,0);
        if(obj.status===true){
            return {status:true,value:obj.content};
        }else{
            return(asthtml_logerreur({status:false,message:'module_html erreur 0606 '}));
        }
     
    }
    /* 
      ================================================================================================================
      function TransformHtmlEnRev
    */

    TransformHtmlEnRev(texteHtml,niveau){
        var t='';
        var esp0 = ' '.repeat(NBESPACESREV*(niveau));
        var esp1 = ' '.repeat(NBESPACESREV);
        var supprimer_le_tag_html_et_head=true;
        var doctype='';
        var elementsJson={};
        try{
            var position_doctype=texteHtml.toUpperCase().indexOf('<!DOCTYPE');
            if(position_doctype>=0){
                if(position_doctype===0){
                    var doctype
                    for(var i=1;i<texteHtml.length && doctype=='';i++){
                     if(texteHtml.substr(i,1)==='>'){
                      doctype=texteHtml.substr(0,i+1); //<!DOCTYPE html>
                      texteHtml=texteHtml.substr(i+1);
                     }
                    }
                }
            }
            
         
            elementsJson=this.mapDOM(texteHtml,false);
            if(elementsJson.status===true){
                if(elementsJson.parfait===true){
                    supprimer_le_tag_html_et_head=false;
                }else{
                    /*
                    */
                    var supprimer_le_tag_html_et_head=true;
                    if(texteHtml.indexOf('<html')>=0){
                        supprimer_le_tag_html_et_head=false;
                    }
                    
                }

                var obj=this.traiteAstDeHtml(elementsJson.value,0,supprimer_le_tag_html_et_head,'');
                if(obj.status===true){
                    if(obj.value.indexOf('html(')>=0){
                     if(doctype.toUpperCase()==='<!DOCTYPE HTML>'){
                        obj.value=obj.value.replace(/html\(/,'html((doctype)');
                     }else{
                        obj.value=obj.value.replace(/html\(/,'html(#(?? doctype pas html , normal="<!DOCTYPE html>" ?? )');
                     }
                    }
                    t=obj.value;
                }else{
                    return(asthtml_logerreur({status:false,message:'erreur module_html 0667 '}));
                }
                
                
            }
            return({status:true,value:t});

        }catch(e){
            console.log('e=',e);
            return(asthtml_logerreur({status:false,message:'erreur 0098 e='+e.message+'\ne.stack='+e.stack}));
        }
    }
    
    /* 
     ======================================================================================================================
     function insere_javascript_dans_html
    */
    insere_javascript_dans_html(tab , ind , niveau){
        var t='';
        var j=0;
        var l01=tab.length;

        /*
        dans ce cas, c'est un tag <script avec des propriétés 
        */
        var lesProprietes='';
        var indiceDebutJs=-1;
        for(j=ind+1;j<l01 && tab[j][3]>tab[ind][3];j++){
            if(tab[j][7]===ind){
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
            
            var ob=parseJavascript0(tab,indiceDebutJs,niveau+1);
            
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
                return logerreur({status:false,message:'erreur dans un javascript contenu dans un html par la fonction javascriptdanshtml 0700'});  
            }
         
        }
        return {status : true, value : t};
     
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
        temp+='<!-- -->';
       }else{
        var commentaire=traiteCommentaire2(tab[id][13],niveau,id);
        if(commentaire!==''){
         /* si le commentaire html n'est pas vide, on lui ajoute au besoin un espace avant et après */
         if(commentaire.substr(0,1)!==' '){
          commentaire=' '+commentaire;
         }
         if(commentaire.substr(commentaire.length-1,1)!==' '){
          commentaire=commentaire+' ';
         }
        }        
        temp+='<!--'+commentaire;
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
           
           
           var obj=this.insere_javascript_dans_html(tab,i,niveau);
           if(obj.status===true){
               t+=obj.value;
           }else{
               return logerreur({status:false,message:'erreur dans un javascript contenu dans un html par la fonction javascriptdanshtml 0943'});  
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
           t+=tab[i][1].replace(/&amp;gt;/g,'&gt;').replace(/&amp;lt;/g,'&lt;').replace(/&amp;amp;/g,'&amp;').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\').replace(/>/g,'&gt;').replace(/</g,'&lt;');
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
           t+='-->';
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