"use strict";
var rangeErreurSelectionne=false;
function jumpToRange(debut,fin){
    var zoneSource = dogid('txtar1');
    zoneSource.select();
    zoneSource.selectionStart=debut;
    zoneSource.selectionEnd=fin;
    var texteDebut = zoneSource.value.substr(0,debut);
    var texteFin = zoneSource.value.substr(debut);
    zoneSource.value=texteDebut;
    zoneSource.scrollTo(0,9999999);
    var nouveauScroll=zoneSource.scrollTop;
    zoneSource.value=texteDebut+texteFin;
    if(nouveauScroll > 50){
        zoneSource.scrollTo(0,(nouveauScroll+50));
    }else{
        zoneSource.scrollTo(0,0);
    }
    zoneSource.selectionStart=debut;
    zoneSource.selectionEnd=fin;
}
/*
var initElement = document.getElementsByTagName("html")[0];
var json = mapDOM(initElement, true);
console.log(json);

initElement = "<div><span style='color:red;'>text</span>Text2</div>";
json = mapDOM(initElement, true);
console.log(json);
*/
function mapDOM(element, json) {
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

function asthtml_logerreur(o){
    logerreur(o);
    if(rangeErreurSelectionne === false){
        if((o.hasOwnProperty('element')) && (o.element.hasOwnProperty('range'))){
            rangeErreurSelectionne=true;
            global_messages['ranges'].push(o.element.range);
        }
    }
    return o;
}

function traiteJsonDeHtml(element,niveau){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 var dernierEstTexte=false;
 var obj={dernierEstTexte:false};
 
 
 console.log('element=',element);
 if(element.type){
  t+='\n'+esp0+element.type.toLowerCase()+'(';
   if(element.attributes){
    for(var i in element.attributes){
     t+='('+i+',\''+element.attributes[i].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
    }
   }
  
  if(element.content && element.content.length>0){
   var count=0;
   for(var i=0;i<element.content.length;i++){
    
    count++;
    niveau++;
    obj=traiteJsonDeHtml(element.content[i],niveau);
    niveau--;
    if(obj.status===true){
     t+=obj.value;
    }else{
     return(asthtml_logerreur({status:false,'message':'erreur pour traiteJsonDeHtml 471 '+element.type}));
    }
   }
   if(obj && obj.dernierEstTexte){
    t+=')';
   }else{
    t+='\n'+esp0+')';
   }
  }else{
   t+=')';
  }
  
  
 }else{
  t+=element.replace(/\r/g,'').replace(/\n/g,'').trim();
  if(t!=''){
   dernierEstTexte=true;
  }else{
  }
 }

 
 return({status:true,value:t,'dernierEstTexte':dernierEstTexte});
}

function TransformHtmlEnRev(texteHtml,niveau){
    var t='';
    var elementsJson={};
    try{
     
     elementsJson=mapDOM(texteHtml,false);
     
     
     var obj=traiteJsonDeHtml(elementsJson,0);
     if(obj.status===true){
      t=obj.value;
     }else{
      t='<-- erreur 0103 -->';
     }
     return({status:true,value:t});
    }catch(e){
     return({status:false,message:'erreur 0098'});
    }
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if(objectEsprimaBody.length){
        var i=0;
        for(i=0;i < objectEsprimaBody.length;i=i+1){
            var element=objectEsprimaBody[i];
            if(i < objectEsprimaBody.length-1){
                positionDebutBlocSuivant=objectEsprimaBody[i+1].range[0];
            }
            positionDebutBloc=element.range[0];
            t+=ajouteCommentaireAvant(element,niveau);
            var bodyTrouve=false;
            if(t != ''){
                t+=',';
            }
            if(element.type == 'FunctionDeclaration'){
                t+='\n'+esp0+'fonction(';
                t+='\n'+esp0+esp1+'definition(';
                t+='\n'+esp0+esp1+esp1+'nom('+element.id.name+')';
                if((element.params) && (element.params.length > 0)){
                    t+=',';
                    var j=0;
                    for(j=0;j < element.params.length;j=j+1){
                        t+='\n'+esp0+esp1+esp1+'argument('+element.params[j].name+')';
                        if(j < element.params.length-1){
                            t+=',';
                        }
                    }
                }
                t+='\n'+esp0+esp1+'),';
                t+='\n'+esp0+esp1+'contenu(';
                var prop={};
                for(prop in element){
                    if(prop == 'body'){
                        bodyTrouve=true;
                        niveau=niveau+1;
                        var obj = TransformHtmlEnRev(element[prop],niveau);
                        niveau=niveau-1;
                        if(obj.status === true){
                            t+=obj.value;
                        }else{
                            return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 229 '+element.type,element:element}));
                        }
                    }
                }
                t+='\n'+esp0+esp1+')';
                t+='\n'+esp0+')';
            }else if(element.type == 'VariableDeclaration'){
                var objDecl = traiteDeclaration1(element,niveau);
                if(objDecl.status === true){
                    t+=objDecl.value;
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 471 '+element.type,element:element}));
                }
            }else if('IfStatement' === element.type){
                var objif = traiteIf1(element,niveau,'if');
                if(objif.status == true){
                    t+=objif.value;
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 261 '+element.type,element:element}));
                }
            }else if('ForInStatement' === element.type){
                var objFor = traiteForIn1(element,niveau);
                if(objFor.status == true){
                    t+=objFor.value;
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 466 '+element.type,element:element}));
                }
            }else if('ForStatement' === element.type){
                var objFor = traiteFor1(element,niveau);
                if(objFor.status == true){
                    t+=objFor.value;
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 466 '+element.type,element:element}));
                }
            }else if('ExpressionStatement' === element.type){
                var objexp1 = traiteExpression1(element,niveau);
                if(objexp1.status == true){
                    t+='\n'+esp0+objexp1.value;
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 1036 '+element.type,element:element}));
                }
            }else if('ReturnStatement' === element.type){
                if(element.argument === null){
                    t+='\n'+esp0+'revenir()';
                }else if((element.argument) && (element.argument.type == 'Identifier')){
                    t+='\n'+esp0+'revenir('+element.argument.name+')';
                }else if((element.argument) && (element.argument.type == 'CallExpression')){
                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{'sansLF':true});
                    if(obj1.status === true){
                        t+='\n'+esp0+'revenir('+obj1.value+')';
                    }else{
                        console.error('Dans TransformHtmlEnRev 1220 element=',element);
                        return(asthtml_logerreur({status:false,message:'erreur TransformHtmlEnRev 1221 ',element:element}));
                    }
                }else if((element.argument) && (element.argument.type == 'Literal')){
                    t+='\n'+esp0+'revenir('+element.argument.raw+')';
                }else if((element.argument) && (element.argument.type == 'ObjectExpression')){
                    var obj1 = traiteObjectExpression1(element.argument,niveau);
                    if(obj1.status === true){
                        t+='\n'+esp0+'revenir('+obj1.value+')';
                    }else{
                        return(asthtml_logerreur({status:false,message:'erreur dans traiteAssignmentExpress1 1027',element:element}));
                    }
                }else if((element.argument) && (element.argument.type == 'BinaryExpression')){
                    var obj1 = traiteBinaryExpress1(element.argument,niveau,false,false);
                    if(obj1.status === true){
                        t+='\n'+esp0+'revenir('+obj1.value+')';
                    }else{
                        return(asthtml_logerreur({'status':false,'message':'erreur dans traiteConditionalExpression1 94 ',element:element}));
                    }
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 1044 '+element.argument.type,element:element}));
                }
            }else if('TryStatement' === element.type){
                var objtry1 = traiteTry1(element,niveau);
                if(objtry1.status == true){
                    t+=objtry1.value;
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 1055 '+element.type,element:element}));
                }
            }else if('BreakStatement' === element.type){
                t+='\n'+esp0+'break()';
            }else if('DebuggerStatement' === element.type){
                t+='\n'+esp0+'debugger()';
            }else if('ContinueStatement' === element.type){
                t+='\n'+esp0+'continue()';
            }else if('ThrowStatement' === element.type){
                var obj1 = traiteCallExpression1(element.argument,niveau,element,{});
                if(obj1.status === true){
                    t+='\n'+esp0+'throw(new('+obj1.value+'))';
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour TransformHtmlEnRev 1994 '+element.type,element:element}));
                }
            }else{
                asthtml_logerreur({status:false,'message':'erreur922 pour '+element.type,element:element});
                console.error('non pris en compte element.type='+element.type,element);
                var prop={};
                for(prop in element){
                    if(prop == 'body'){
                        bodyTrouve=true;
                        var obj = TransformHtmlEnRev(element[prop],niveau);
                        if(obj.status === true){
                            t+=obj.value;
                        }else{
                            return(asthtml_logerreur({status:false,'message':'erreur pour '+element.type,element:element}));
                        }
                    }
                }
            }
        }
    }else{
        if(objectEsprimaBody.type === 'BlockStatement'){
            if(objectEsprimaBody.body){
                niveau=niveau+1;
                var obj = TransformHtmlEnRev(objectEsprimaBody.body,niveau);
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(asthtml_logerreur({status:false,'message':'erreur pour '+objectEsprimaBody,element:element}));
                }
                niveau=niveau-1;
            }else{
                console.log('Pas de body pour '+objectEsprimaBody.type);
            }
        }
    }
    return({status:true,value:t});
}
var tabComment=[];
function transform(){
    console.log('=========================\ndébut de transforme');
    document.getElementById('txtar2').value='';
    document.getElementById('resultat1').innerHTML='';
    clearMessages('zone_global_messages');
    var a = document.getElementById('txtar1');
    localStorage.setItem('fta_traitehtml_dernier_fichier_charge',a.value);
    var lines = mySplit(a.value , '\\r|\\r\\n|\\n');
    var count=lines.length;
    a.setAttribute('rows',(count+1));
    var obj = TransformHtmlEnRev(a.value,0);
    if(obj.status == true){
        document.getElementById('resultat1').innerHTML='<pre style="font-size:0.8em;">'+obj.value.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</pre>';
        document.getElementById('txtar2').value=obj.value;
        var obj1 = functionToArray(obj.value,true);
        if(obj.status === true){
            asthtml_logerreur({status:true,message:'pas d\'erreur pour le rev'});
        }else{
            asthtml_logerreur({status:false,message:'erreur pour le rev'});
        }
    }
    displayMessages('zone_global_messages');
    rangeErreurSelectionne=false;
}
function chargerSourceDeTest(){
    var t=`<a href="www.example.com"></a>`;
    dogid('txtar1').value=t;
}
function chargerLeDernierSource(){
    var fta_traitehtml_dernier_fichier_charge = localStorage.getItem('fta_traitehtml_dernier_fichier_charge');
    if(fta_traitehtml_dernier_fichier_charge !== null){
        dogid('txtar1').value=fta_traitehtml_dernier_fichier_charge;
    }
}
chargerLeDernierSource();
transform();