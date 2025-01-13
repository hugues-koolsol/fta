/*
  entête[
  ['id','id'                                 ,''], // 00
  ['val','__xva'                             ,''],
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
    /* function constructor */
    constructor(nom_de_la_variable){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    /* function nom_de_la_variable */
    get nom_de_la_variable(){
        return this.#nom_de_la_variable;
    }
    /* function tabToHtml1 */
    tabToHtml1(tab,id,noHead,niveau){
        var startId=id;
        for( var i=id ; i < tab.length ; i++ ){
            if(tab[i][1] == 'html' || tab[i][1] == 'html_dans_php'){
                startId=i;
                if(tab[i][1] == 'html_dans_php'){
                    niveau-=1;
                }
                break;
            }
        }
        var ob = this.tabToHtml0(tab,startId,false,false,false,noHead,false,false,niveau);
        if(ob.__xst === true){
            if(ob.__xva.substr(0,2) === CRLF){
                ob.__xva=ob.__xva.substr(2);
            }
        }
        return ob;
    }
    /*
      function #construit_cle
    */
    #construit_cle(length){
        let resultat='';
        /* on retire I("I" de [i]ncrément ) O("o" de [o]bjet) l("l" de laitue)  0(zéro) 1(un) */
        const lettres='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        const longueur=lettres.length;
        let counter=0;
        while(counter < length){
            resultat+=lettres.charAt(Math.floor(Math.random() * longueur));
            counter++;
        }
        return('_' + resultat);
    }
    /*#
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
    traiteAstDeHtml(jsonDeHtml,niveau,retirerHtmlHeadEtBody,typeParent,tableau_des_javascript_a_convertir){
        var i=0;
        var j=0;
        var k=0;
        var t='';
        var esp0 = ' '.repeat(NBESPACESREV * niveau);
        var esp1 = ' '.repeat(NBESPACESREV);
        var dernierEstTexte=false;
        var attributs='';
        var contenu='';
        var obj={"dernierEstTexte" : false};
        var type='';
        var typeScriptNonTraite=false;
        if(jsonDeHtml.type || jsonDeHtml.type === '' && jsonDeHtml.content && jsonDeHtml.content.length > 0){
            type=jsonDeHtml.type.toLowerCase();
            if(jsonDeHtml.type !== ''){
                if(type === 'script'){
                    if(jsonDeHtml.attributes && jsonDeHtml.attributes.type){
                        if(jsonDeHtml.attributes.type.toLowerCase() === 'application/ld+json'){
                            t+='\n' + esp0 + 'ldPlusJsonDansHtml(';
                            type='ldPlusJsonDansHtml';
                        }else if(jsonDeHtml.attributes.type.toLowerCase() === 'text/javascript' && jsonDeHtml.hasOwnProperty('content')){
                            /*
                              si il y a du contenu ( content existe ), 
                            */
                            t+='\n' + esp0 + 'javascriptDansHtml(';
                            type='javascriptDansHtml';
                        }else if(jsonDeHtml.attributes.type.toLowerCase() === 'text/javascript' && !(jsonDeHtml.hasOwnProperty('content'))){
                            /*
                              c'est un tag script avec src=""
                            */
                            typeScriptNonTraite=false;
                            type='script';
                            t+='\n' + esp0 + 'script(';
                        }else{
                            typeScriptNonTraite=true;
                            type='script';
                            t+='\n' + esp0 + 'script(';
                            logerreur({
                                    "__xst" : false ,
                                    "__xme" : 'module_html.js traiteJsonDeHtml 0073 attention, seuls "text/javascript" et "application/ld+json" sont traités et il existe un type de script non traité  "' + jsonDeHtml.attributes.type + '"'
                                });
                        }
                    }else{
                        /*
                          sans aucun type renseigné, c'est un javascript
                        */
                        t+='\n' + esp0 + 'javascriptDansHtml(';
                        type='javascriptDansHtml';
                    }
                }else{
                    if("#comment" === type){
                        t+='\n' + esp0 + '#(';
                    }else{
                        if(type.toLowerCase() === '#text'){
                            t+='';
                        }else{
                            t+='\n' + esp0 + type + '(';
                        }
                    }
                }
            }
            if(jsonDeHtml.attributes){
                for(var attr in jsonDeHtml.attributes){
                    if(attributs !== ''){
                        attributs+=',';
                    }
                    attributs+='(\'' + attr.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\',"' + jsonDeHtml.attributes[attr].replace(/"/g,'&quot;') + '")';
                }
            }
            /*
              ajout des attributs
            */
            t+=attributs;
            if(typeScriptNonTraite && jsonDeHtml.content && jsonDeHtml.content.length > 0){
                contenu=jsonDeHtml.content[0];
                contenu=contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'');
                if(attributs !== ''){
                    t+=',';
                }
                t+='@(' + contenu + ')';
                t+=')';
            }else if(type.toLowerCase() === 'ldplusjsondanshtml' && jsonDeHtml.content && jsonDeHtml.content.length > 0){
                if(jsonDeHtml.content[0].content){
                    var chaineJsEquivalente = 'var a=' + jsonDeHtml.content[0].content.replace(/&quot;/g,'"').replace(/\\\//g,'/') + ';';
                }else{
                    var chaineJsEquivalente = 'var a=' + jsonDeHtml.content[0].replace(/&quot;/g,'"').replace(/\\\//g,'/') + ';';
                }
                tableau_des_javascript_a_convertir.push({"type" : "ldplusjsondanshtml" ,"__xva" : chaineJsEquivalente ,"cas" : "ldjson"});
                var obj = convertit_source_javascript_en_rev(chaineJsEquivalente);
                if(obj.__xst === true){
                    t+='' + obj.__xva + '';
                }else{
                    return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0142 ' + jsonDeHtml.type}));
                }
                t+='\n' + esp0 + ')';
            }else if(type.toLowerCase() === 'javascriptdanshtml' && jsonDeHtml.content && jsonDeHtml.content.length > 0){
                if(Array.isArray(jsonDeHtml.content)){
                    for( var i=0 ; i < jsonDeHtml.content.length ; i++ ){
                        if(typeof jsonDeHtml.content[i] === 'string'
                         || jsonDeHtml.content[i].type
                         && (jsonDeHtml.content[i].type === '#text'
                         || jsonDeHtml.content[i].type === '#cdata-section')
                        ){
                            if(typeof jsonDeHtml.content[i] === 'string'){
                                var source_js=jsonDeHtml.content[i];
                            }else{
                                var source_js=jsonDeHtml.content[i].content;
                            }
                            if(!(source_js.trim() === '//' || source_js === '\n' || source_js === '')){
                                var cle = this.#construit_cle(10);
                                tableau_des_javascript_a_convertir.push({"type" : "javascriptdanshtml" ,"__xva" : source_js ,"cas" : "js1" ,"cle" : cle});
                                contenu+='#(cle_javascript_a_remplacer,' + cle + ')';
                            }
                            /*
                              bloc à commenter debut
                              la fonction convertit_source_javascript_en_rev 
                              fait un appel ajax synchrone, on la garde pour l'instant
                              
                              
                              var obj = convertit_source_javascript_en_rev(source_js);
                              if(obj.__xst === true){
                              contenu+=obj.__xva;
                              }else{
                              return(logerreur({"__xst" : false,"__xme" : 'erreur pour traiteJsonDeHtml 0187 ' + jsonDeHtml.type}));
                              }
                              
                              
                              bloc à commenter fin
                            */
                        }else if(!(jsonDeHtml.content[i].hasOwnProperty('type'))){
                            /*
                              il n'y a pas la propriété type, on suppose que c'est un text/javascript
                            */
                            var source_js = jsonDeHtml.content[i].replace(/&amp;/g,'&');
                            tableau_des_javascript_a_convertir.push({"type" : "javascriptdanshtml" ,"__xva" : source_js ,"cas" : "js2"});
                            var obj = convertit_source_javascript_en_rev(source_js);
                            if(obj.__xst === true){
                                if(t.indexOf('text/javascript') >= 0){
                                    contenu+=obj.__xva;
                                }else{
                                    contenu+='(\'type\' , "text/javascript")' + obj.__xva;
                                }
                            }else{
                                return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0187 ' + jsonDeHtml.type}));
                            }
                        }else{
                            return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0190 ' + jsonDeHtml.type}));
                        }
                    }
                }else{
                    tableau_des_javascript_a_convertir.push({"type" : "javascriptdanshtml" ,"__xva" : source_js ,"cas" : "js3"});
                    var obj = convertit_source_javascript_en_rev(jsonDeHtml.content);
                    if(obj.__xst === true){
                        contenu+='<![CDATA[' + obj.__xva + ']]>';
                    }else{
                        return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0198 ' + jsonDeHtml.type}));
                    }
                }
                t+='\n' + esp0 + contenu + ')';
            }else if(jsonDeHtml.content && jsonDeHtml.content.length > 0){
                if(Array.isArray(jsonDeHtml.content)){
                    for( var i=0 ; i < jsonDeHtml.content.length ; i++ ){
                        /*
                          =====================================================================
                          entree dans le récursif
                          =====================================================================
                        */
                        obj=this.traiteAstDeHtml(jsonDeHtml.content[i],niveau + 1,retirerHtmlHeadEtBody,type,tableau_des_javascript_a_convertir);
                        if(obj.__xst === true){
                            if((attributs !== '' || contenu !== '') && obj.__xva !== ''){
                                contenu+=',';
                            }
                            contenu+=obj.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0.129 ' + jsonDeHtml.type}));
                        }
                    }
                }else{
                    contenu+=jsonDeHtml.content;
                }
                if(type.toLowerCase() === '#text'){
                    if(typeParent === 'style'){
                        if(contenu !== ''){
                            contenu=contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'');
                            if(contenu.substr(0,1) !== '\n'){
                                debugger;
                                contenu='\n' + contenu;
                            }
                            /*
                              on supprime les espace en début de ligne
                            */
                            var contenuTab = contenu.split('\n');
                            k=9999;
                            for( i=1 ; i < contenuTab.length ; i++ ){
                                for( j=0 ; j < contenuTab[i].length ; j++ ){
                                    if(contenuTab[i].substr(j,1) !== ' '){
                                        if(j < k){
                                            k=j;
                                        }
                                        break;
                                    }
                                }
                            }
                            if(k < 999 && k > 0){
                                for( i=1 ; i < contenuTab.length ; i++ ){
                                    contenuTab[i]=contenuTab[i].substr(k);
                                }
                                contenu=contenuTab.join('\n');
                            }
                            t+='\'' + contenu + '\'';
                        }
                    }else if(typeParent === 'textarea' || typeParent === 'pre'){
                        /* on ne remplace pas les LF dans les textarea et les pre */
                        if(contenu !== ''){
                            t='`' + contenu.replace(/`/g,'\\`') + '`';
                        }
                    }else{
                        contenu=contenu.replace(/\n/g,' ').replace(/\r/g,' ').trim();
                        if(contenu !== ''){
                            t+='\'' + contenu.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'';
                        }
                    }
                }else{
                    t+=contenu;
                    if(jsonDeHtml.type !== ''){
                        if(obj && obj.dernierEstTexte){
                            t+=')';
                        }else{
                            if(contenu === ''){
                                t+=')';
                            }else{
                                if(jsonDeHtml.type.toLowerCase() === '#comment'){
                                    t+=')';
                                }else{
                                    t+='\n' + esp0 + ')';
                                }
                            }
                        }
                    }
                }
            }else{
                if(type.toLowerCase() === '#text'){
                }else{
                    if(jsonDeHtml.type !== ''){
                        t+=')';
                    }
                }
            }
        }else{
            if(typeParent === '#comment'){
                if(jsonDeHtml.length >= 2 && jsonDeHtml.substr(0,1) === ' ' && jsonDeHtml.substr(jsonDeHtml.length - 1,1) === ' '){
                    contenu=jsonDeHtml.substr(1,jsonDeHtml.length - 2);
                    t+=contenu;
                }else{
                    if(jsonDeHtml.length == 1 && jsonDeHtml.substr(0,1) === ' '){
                        /*
                          c'est un commentaire vide
                        */
                    }else{
                        contenu=jsonDeHtml;
                        t+=contenu;
                    }
                }
                dernierEstTexte=true;
            }else if(typeParent === '@'){
                contenu=jsonDeHtml;
                t+=contenu;
            }else if(typeParent === 'script'){
                tableau_des_javascript_a_convertir.push({"type" : "javascriptdanshtml" ,"__xva" : source_js ,"cas" : "js4"});
                var obj = convertit_source_javascript_en_rev(jsonDeHtml);
                if(obj.__xst === true){
                    t+='' + obj.__xva + '';
                }else{
                    t+='#(Erreur de conversion du javascript 0113 )';
                }
            }else{
                try{
                    if(jsonDeHtml.hasOwnProperty('content')){
                        if(typeof jsonDeHtml.content === 'string'){
                            if(typeParent === 'style'){
                                contenu=jsonDeHtml.content;
                            }else{
                                contenu=jsonDeHtml.content.replace(/\r/g,' ').replace(/\n/g,' ').trim();
                            }
                        }else{
                            debugger;
                        }
                    }else{
                        if(typeParent === 'style'){
                            contenu=jsonDeHtml;
                        }else if(typeParent === 'textarea' || typeParent === 'pre'){
                            contenu=jsonDeHtml;
                        }else{
                            contenu=jsonDeHtml.replace(/\r/g,' ').replace(/\n/g,' ').trim();
                        }
                    }
                }catch(e){
                    /*
                      dans le cas où le jsonDeHtml n'existe pas
                    */
                    contenu='';
                }
                if(contenu.indexOf('&') >= 0 || contenu.indexOf('>') >= 0 || contenu.indexOf('<') >= 0 || contenu.indexOf('"') >= 0){
                }
                if(contenu !== ''){
                    contenu='"' + contenu.replace(/"/g,'&quot;') + '"';
                }
                t+=contenu;
                if(contenu != ''){
                    dernierEstTexte=true;
                }
            }
        }
        if(retirerHtmlHeadEtBody && niveau === 0){
            /*
              le rev retourné inclut toujours une balise html et/ou body et/ou head
              Si ces balises ne contiennent pas d'éléments, on les retire 
            */
            var tableau1 = iterateCharacters2(t);
            var matriceFonction = functionToArray2(tableau1.out,false,true,'');
            if(matriceFonction.__xst === true){
                if(matriceFonction.__xva[1][1] === 'html' && matriceFonction.__xva[1][8] <= 2){
                    /*
                      l'élément html est en première position
                      si il n'a aucune propriété, on peut le supprimer
                    */
                    var aDesProps=false;
                    for( var i=0 ; i < matriceFonction.__xva.length && aDesProps === false ; i++ ){
                        if(matriceFonction.__xva[i][7] === 1){
                            if(matriceFonction.__xva[i][1] === ''){
                                aDesProps=true;
                                break;
                            }
                        }
                    }
                    if(aDesProps === false){
                        var nouveauTableau1 = baisserNiveauEtSupprimer(matriceFonction.__xva,1,0);
                        /*
                          si le head n'a aucun enfant
                        */
                        if(nouveauTableau1.length >= 2 && nouveauTableau1[1][1] === 'head' && nouveauTableau1[1][8] == 0){
                            var nouveauTableau2 = baisserNiveauEtSupprimer(nouveauTableau1,1,0);
                            if(nouveauTableau2[1][1] === 'body'){
                                var aDesProps=false;
                                for( var i=0 ; i < nouveauTableau2.length && aDesProps === false ; i++ ){
                                    if(nouveauTableau2[i][7] === 1){
                                        if(nouveauTableau2[i][1] === ''){
                                            aDesProps=true;
                                            break;
                                        }
                                    }
                                }
                                if(aDesProps === false){
                                    /*
                                      si le body n'a aucune propriété
                                    */
                                    var nouveauTableau3 = baisserNiveauEtSupprimer(nouveauTableau2,1,0);
                                    var nouveauJsonDeHtml = this.mapMatriceVersJsonDeHtml(nouveauTableau3);
                                    if(nouveauJsonDeHtml.__xst === true){
                                        var obj1 = this.traiteAstDeHtml(nouveauJsonDeHtml.__xva,0,false,'',[]);
                                        if(obj1.__xst === true){
                                            t=obj1.__xva;
                                        }else{
                                            return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0314 '}));
                                        }
                                    }else{
                                        return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0317 '}));
                                    }
                                }else{
                                    var nouveauJsonDeHtml = this.mapMatriceVersJsonDeHtml(nouveauTableau2);
                                    if(nouveauJsonDeHtml.__xst === true){
                                        var obj1 = this.traiteAstDeHtml(nouveauJsonDeHtml.__xva,0,false,'',[]);
                                        if(obj.__xst === true){
                                            t=obj.__xva;
                                        }else{
                                            return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0217 '}));
                                        }
                                    }else{
                                        return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0317 '}));
                                    }
                                }
                            }else{
                                var nouveauJsonDeHtml = this.mapMatriceVersJsonDeHtml(nouveauTableau2);
                                if(nouveauJsonDeHtml === true){
                                    var obj1 = this.traiteAstDeHtml(nouveauJsonDeHtml.__xva,0,false,'',[]);
                                    if(obj1.__xst === true){
                                        t=obj1.__xva;
                                    }else{
                                        return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0340 '}));
                                    }
                                }else{
                                    return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0343 '}));
                                }
                            }
                        }else{
                            /*
                              la balise head contient des éléments, 
                              
                              si la balise body ne contient rien, 
                            */
                            var body_est_vide=false;
                            for( var i = nouveauTableau1.length - 1 ; i >= 0 && body_est_vide === false ; i-- ){
                                if(nouveauTableau1[i][1].toLowerCase() === 'body' && nouveauTableau1[i][2] === 'f' && nouveauTableau1[i][3] === 0){
                                    body_est_vide=true;
                                    nouveauTableau1.splice(i,1);
                                    t='';
                                    for( var j=0 ; j < nouveauTableau1.length ; j++ ){
                                        if(nouveauTableau1[j][7] === 1){
                                            var obj = a2F1(nouveauTableau1,1,true,j);
                                            if(obj.__xst === true){
                                                t+=',' + obj.__xva + '\n';
                                            }else{
                                                return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0217 '}));
                                            }
                                        }
                                    }
                                    if(t !== false){
                                        t=t.substr(1);
                                    }
                                }
                            }
                            if(body_est_vide === true){
                            }else{
                                /*
                                  on reconstruit le source à partir de matriceFonction.__xva
                                  avec des retours de lignes et sans coloration
                                */
                                var nouveauJsonDeHtml = this.mapMatriceVersJsonDeHtml(nouveauTableau1);
                                var obj1 = this.traiteAstDeHtml(nouveauJsonDeHtml.__xva,0,false,'',[]);
                                if(obj1.__xst === true){
                                    t=obj1.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0217 '}));
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
                return(logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteJsonDeHtml 0168 ' + jsonDeHtml.type}));
            }
        }
        /*
          on retourne du html "pur"
        */
        t=t.replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\n');
        return({"__xst" : true ,"__xva" : t ,"dernierEstTexte" : dernierEstTexte});
    }
    /*
      =============================================================================================================
      function mapDOM
      fonction trouvée sur le net ( désolé, j'ai perdu la référence )
      A partir d'un html, on reconstruit un équivalent "ast" ( abstract syntax tree )
      =============================================================================================================
    */
    mapDOM(element){
        var treeObject={};
        if(typeof element === 'string'){
            var parser = new DOMParser();
            /*
              "application/xml"
              "image/svg+xml"
              "text/html"
            */
            var element_a_traiter = element.replace(/&nbsp;/g,'__a_remplacer__&#160;__a_remplacer__');
            /*
              j'aime les &nbsp;
            */
            var docNode = parser.parseFromString('<aaaaa>' + element_a_traiter + '</aaaaa>','application/xml');
            var elementNoeud=docNode.firstChild;
            if(docNode.getElementsByTagName('parsererror').length || element.indexOf('<') < 0){
                /*
                  ce n'est pas un xml parfait
                */
                var docNode = parser.parseFromString(element.replace(/&/g,'&amp;'),'text/html');
                elementNoeud=docNode.firstChild;
                function treeHTML(element,object){
                    object['type']=element.nodeName;
                    var i=0;
                    var nodeList=element.childNodes;
                    if(nodeList !== null){
                        if(nodeList.length){
                            object['content']=[];
                            for( i=0 ; i < nodeList.length ; i=i + 1 ){
                                if(nodeList[i].nodeType == 3){
                                    object['content'].push(nodeList[i].nodeValue);
                                }else{
                                    object['content'].push({});
                                    treeHTML(nodeList[i],object["content"][object["content"].length - 1]);
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
                            for( i=0 ; i < element.attributes.length ; i=i + 1 ){
                                if(element.attributes[i].nodeName === '"'){
                                    /*
                                      =============================================
                                      vraiment bizarre un attribut = '"'
                                      =============================================
                                    */
                                    console.log('element.attributes[i].nodeName=<' + element.attributes[i].nodeName + '>');
                                }else{
                                    object['attributes'][element.attributes[i].nodeName]=element.attributes[i].nodeValue;
                                }
                            }
                        }
                    }
                }
                treeHTML(elementNoeud,treeObject);
                return({"__xst" : true ,"__xva" : treeObject ,"parfait" : false});
            }else{
                /*
                  c'est un xml parfait, on retire la racine aaaaa et on le traite
                */
                elementNoeud=docNode.firstChild.childNodes;
                function treeXML(elements,objet,niveau,remplacer_les_nbsp){
                    try{
                        var les_contenus=[];
                        for( var i=0 ; i < elements.length ; i++ ){
                            var le_noeud={};
                            var les_attributs={};
                            le_noeud['type']=elements[i].nodeName;
                            if(elements[i].attributes && elements[i].attributes.length > 0){
                                for( var j=0 ; j < elements[i].attributes.length ; j++ ){
                                    les_attributs[elements[i].attributes[j].name]=elements[i].attributes[j].value;
                                }
                                le_noeud['attributes']=les_attributs;
                            }
                            if(elements[i].childNodes && elements[i].childNodes.length > 0){
                                treeXML(elements[i].childNodes,le_noeud,niveau + 1,remplacer_les_nbsp);
                            }else{
                                if(elements[i].data){
                                    if(remplacer_les_nbsp === true){
                                        le_noeud.content=elements[i].data.replace(/__a_remplacer__\u00A0__a_remplacer__/g,"&nbsp;");
                                        le_noeud.content=le_noeud.content.replace(/__a_remplacer__&#160;__a_remplacer__/g,"&nbsp;");
                                    }else{
                                        le_noeud.content=elements[i].data;
                                    }
                                }else{
                                    le_noeud.content=null;
                                }
                            }
                            les_contenus.push(le_noeud);
                        }
                        objet.content=JSON.parse(JSON.stringify(les_contenus));
                    }catch(e){
                        debugger;
                    }
                }
                treeObject['type']='';
                if(element.indexOf('&nbsp;') >= 0){
                    /*
                      j'aime les &nbsp;
                    */
                    treeXML(elementNoeud,treeObject,0,true);
                }else{
                    treeXML(elementNoeud,treeObject,0,false);
                }
                return({"__xst" : true ,"__xva" : treeObject ,"parfait" : true});
            }
        }
    }
    /*
      =============================================================================================================
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
      =============================================================================================================
    */
    mapMatriceVersJsonDeHtml(matrice){
        function reconstruit(tab,parentId){
            var l01=tab.length;
            var un_element={};
            var contenu=[];
            var attrib={};
            var indice=0;
            var i=0;
            var j=0;
            for( indice=parentId + 1 ; indice < l01 && tab[indice][3] > tab[parentId][3] ; indice++ ){
                if(tab[indice][7] === parentId){
                    if(tab[indice][2] === 'f' && tab[indice][1] !== ''){
                        attrib={};
                        var a_des_attributs=false;
                        for( var i = indice + 1 ; i < l01 ; i++ ){
                            if(tab[i][7] === indice && tab[i][1] === '' && tab[i][2] === 'f'){
                                if(tab[i][8] === 1){
                                    attrib[tab[i+1][1]]=null;
                                    a_des_attributs=true;
                                }else if(tab[i][8] === 2){
                                    attrib[tab[i+1][1]]=tab[i+2][1];
                                    a_des_attributs=true;
                                }else{
                                    return({"__xst" : false ,"message" : '0547 nombre incorrect pour les attributs'});
                                }
                            }
                        }
                        if(a_des_attributs === true){
                            un_element['attributes']=JSON.parse(JSON.stringify(attrib));
                        }
                        un_element['type']=tab[indice][1];
                        var le_contenu=[];
                        for( var i = indice + 1 ; i < l01 ; i++ ){
                            if(tab[i][7] === indice && tab[i][1] !== ''){
                                if(tab[i][2] === 'c'){
                                    le_contenu.push({"content" : tab[i][1]});
                                }else{
                                    attrib={};
                                    var a_des_attributs=false;
                                    for( var j = i + 1 ; j < l01 && tab[j][3] > tab[i][3] ; j++ ){
                                        if(tab[j][7] === i && tab[j][1] === '' && tab[j][2] === 'f'){
                                            if(tab[j][8] === 1){
                                                attrib[tab[j+1][1]]=null;
                                                a_des_attributs=true;
                                            }else if(tab[j][8] === 2){
                                                attrib[tab[j+1][1]]=tab[j+2][1];
                                                a_des_attributs=true;
                                            }else{
                                                return({"__xst" : false ,"message" : '0547 nombre incorrect pour les attributs'});
                                            }
                                        }
                                    }
                                    if(tab[tab[i][7]][1].toLowerCase() === 'javascriptdanshtml'){
                                        var debut = indice + 1;
                                        for( var j = indice + 1 ; j < l01 ; j++ ){
                                            if(tab[j][7] === indice){
                                                if(tab[j][1] === '' && tab[j][2] === 'f'){
                                                }else{
                                                    debut=j;
                                                    break;
                                                }
                                            }
                                        }
                                        var objContenuJs = parseJavascript0(tab,debut,0);
                                        if(objContenuJs.__xst === true){
                                            le_contenu.push(JSON.parse(JSON.stringify({"type" : 'javascriptdanshtml' ,"content" : objContenuJs.__xva ,"attributes" : attrib})));
                                        }else{
                                            return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0635 '}));
                                        }
                                    }else if(tab[parentId][1].toLowerCase() === 'ldplusjsondanshtml'){
                                        var debut = indice + 1;
                                        for( var j = indice + 1 ; j < l01 ; j++ ){
                                            if(tab[j][7] === indice){
                                                if(tab[j][1] === '' && tab[j][2] === 'f'){
                                                }else{
                                                    debut=j;
                                                    break;
                                                }
                                            }
                                        }
                                        var objContenuJs = parseJavascript0(tab,debut,0);
                                        if(objContenuJs.__xst === true){
                                            var contenu = objContenuJs.__xva.substr(objContenuJs.__xva.indexOf('=') + 1);
                                            if(contenu.substr(contenu.length - 1,1) === ';'){
                                                contenu=contenu.substr(0,contenu.length - 1);
                                            }
                                            content.push(contenu);
                                            le_contenu.push(JSON.parse(JSON.stringify({"type" : 'ldplusjsondanshtml' ,"content" : contenu ,"attributes" : attrib})));
                                        }else{
                                            return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0660 '}));
                                        }
                                    }else{
                                        var obj = reconstruit(tab,i);
                                        if(obj.__xst === true){
                                            if(a_des_attributs === true){
                                                le_contenu.push(JSON.parse(JSON.stringify({"type" : tab[i][1] ,"content" : obj.content ,"attributes" : attrib})));
                                                attrib={};
                                            }else{
                                                le_contenu.push(JSON.parse(JSON.stringify({"type" : tab[i][1] ,"content" : obj.content})));
                                            }
                                        }else{
                                            return({"__xst" : false ,"message" : '0563 '});
                                        }
                                    }
                                }
                            }
                        }
                        if(le_contenu.length > 0){
                            un_element['content']=JSON.parse(JSON.stringify(le_contenu));
                        }
                        contenu.push(JSON.parse(JSON.stringify(un_element)));
                        un_element={};
                    }else if(tab[indice][2] === 'c'){
                        un_element['content']=tab[indice][1];
                        contenu.push(JSON.parse(JSON.stringify(un_element)));
                        un_element={};
                    }
                }
            }
            if(parentId !== 0){
                return({"__xst" : true ,"content" : contenu});
            }else{
                return({"__xst" : true ,"content" : {"type" : '' ,"content" : contenu}});
            }
        }
        /*
          =====================================================================================================
          On définit une fonction dans une fonction car elle sera appelée récursivement
          =====================================================================================================
        */
        function reconstruit2(tab,parentId){
            var l01=tab.length;
            var type='';
            var attributes={};
            var content=[];
            /*
              récupération des attributs
            */
            var leJson={};
            if(tab[parentId][1].toLowerCase() === 'ldplusjsondanshtml'){
                var debut = parentId + 1;
                for( var j = parentId + 1 ; j < l01 ; j++ ){
                    if(tab[j][7] === parentId){
                        if(tab[j][1] === '' && tab[j][2] === 'f'){
                        }else{
                            debut=j;
                            break;
                        }
                    }
                }
                var objContenuJs = parseJavascript0(tab,debut,0);
                if(objContenuJs.__xst === true){
                    var contenu = objContenuJs.__xva.substr(objContenuJs.__xva.indexOf('=') + 1);
                    if(contenu.substr(contenu.length - 1,1) === ';'){
                        contenu=contenu.substr(0,contenu.length - 1);
                    }
                    content.push(contenu);
                }else{
                    return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0477 '}));
                }
            }else if(tab[parentId][1].toLowerCase() === 'javascriptdanshtml'){
                var debut = parentId + 1;
                for( var j = parentId + 1 ; j < l01 ; j++ ){
                    if(tab[j][7] === parentId){
                        if(tab[j][1] === '' && tab[j][2] === 'f'){
                        }else{
                            debut=j;
                            break;
                        }
                    }
                }
                var objContenuJs = parseJavascript0(tab,debut,0);
                if(objContenuJs.__xst === true){
                    content.push(objContenuJs.__xva);
                }else{
                    return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0503 '}));
                }
                console.log('objContenuJs=',objContenuJs);
            }else if(tab[parentId][1] === '@'){
                debugger;
            }else if(tab[parentId][8] === 0 && parentId > 0){
                content.push('');
            }else{
                for( var indice = parentId + 1 ; indice < l01 ; indice++ ){
                    var element={"type" : '' ,"attributes" : null ,"content" : null};
                    if(tab[indice][7] === parentId){
                        /*
                        */
                        if(tab[indice][1] !== ''){
                            if(tab[indice][2] === 'f'){
                                if('@' === tab[indice][1]){
                                    content.push(tab[indice][13].replace(/\\\'/g,'\'').replace(/\\\\/g,'\\'));
                                    var max = l01 - 1;
                                    for( var j = indice + 1 ; j < l01 ; j++ ){
                                        if(tab[j][3] <= tab[indice][3]){
                                            max=j - 1;
                                            break;
                                        }
                                    }
                                    indice=max;
                                }else if('ldplusjsondanshtml' === tab[indice][1].toLowerCase()){
                                    var obj = reconstruit(tab,indice);
                                    if(obj.__xst === true){
                                        content.push(obj.__xva);
                                    }else{
                                        return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0541 '}));
                                    }
                                    var max = l01 - 1;
                                    for( var j = indice + 1 ; j < l01 ; j++ ){
                                        if(tab[j][3] <= tab[indice][3]){
                                            max=j - 1;
                                            break;
                                        }
                                    }
                                    indice=max;
                                }else if('javascriptdanshtml' === tab[indice][1].toLowerCase()){
                                    var obj = reconstruit(tab,indice);
                                    if(obj.__xst === true){
                                        content.push(obj.__xva);
                                    }else{
                                        return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0559 '}));
                                    }
                                    var max = l01 - 1;
                                    for( var j = indice + 1 ; j < l01 ; j++ ){
                                        if(tab[j][3] <= tab[indice][3]){
                                            max=j - 1;
                                            break;
                                        }
                                    }
                                    indice=max;
                                    /*
                                    */
                                }else{
                                    var obj = reconstruit(tab,indice);
                                    if(obj.__xst === true){
                                        content.push(obj.__xva);
                                    }else{
                                        return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0559 '}));
                                    }
                                    var max = l01 - 1;
                                    for( var j = indice + 1 ; j < l01 ; j++ ){
                                        if(tab[j][3] <= tab[indice][3]){
                                            max=j - 1;
                                            break;
                                        }
                                    }
                                    indice=max;
                                }
                            }else{
                                var obj = reconstruit(tab,indice);
                                if(obj.__xst === true){
                                    content.push(obj.__xva);
                                }else{
                                    return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0559 '}));
                                }
                            }
                        }
                    }
                }
            }
            if(parentId === 0){
                type='';
            }else{
                if(tab[parentId][1] === '@'){
                    type='';
                }else{
                    type=tab[parentId][1];
                }
            }
            leJson['type']=type;
            leJson['content']=content;
            var aDesAttributs=false;
            for( var indice = parentId + 1 ; indice < l01 ; indice++ ){
                if(tab[indice][7] === parentId){
                    if(tab[indice][1] === '' && tab[indice][2] === 'f' && tab[indice][8] === 2){
                        attributes[tab[indice+1][1]]=tab[indice+2][1];
                        aDesAttributs=true;
                    }
                }
            }
            if(aDesAttributs){
                leJson['attributes']=attributes;
            }
            return({"__xst" : true ,"__xva" : leJson});
        }
        /*
          =====================================================================================================
          L'appel récursif se fait ici
          =====================================================================================================
        */
        var obj = reconstruit(matrice,0);
        if(obj.__xst === true){
            return({"__xst" : true ,"__xva" : obj.content});
        }else{
            return(asthtml_logerreur({"__xst" : false ,"__xme" : 'module_html erreur 0606 '}));
        }
    }
    /*
      =============================================================================================================
      function recupérer_un_fetch
    */
    async recupere_un_fetch(url,donnees){
        var delais_admis = donnees.call.opt && donnees.call.opt.delais_admis ? ( donnees.call.opt.delais_admis ) : ( 6000 );
        var masquer_les_messages_du_serveur = donnees.call.opt && donnees.call.opt.hasOwnProperty('masquer_les_messages_du_serveur') ? ( donnees.call.opt.masquer_les_messages_du_serveur ) : ( true );
        var en_entree={
            "signal" : AbortSignal.timeout(delais_admis) ,
            "method" : "POST" ,
            "mode" : "cors" ,
            "cache" : "no-cache" ,
            "credentials" : "same-origin" ,
            "headers" : {"Content-Type" : 'application/x-www-form-urlencoded'} ,
            "redirect" : "follow" ,
            "referrerPolicy" : "no-referrer" ,
            "body" : 'ajax_param=' + encodeURIComponent(JSON.stringify(donnees))
        };
        try{
            var response= await fetch(url,en_entree).catch((dataerr) => {
                console.error('fetch dataerr=',dataerr)
            }).finally((datafinally) => {
                /* vide */
            });
            var t= await response.text().catch((dataerr) => {
                console.error('text dataerr=',dataerr)
            }).finally((datafinally) => {
                /* vide */
            });
            try{
                var le_json = JSON.parse(t);
                if(le_json.hasOwnProperty('__xms')){
                    for(var i in le_json.__xms){
                        logerreur({"__xst" : le_json.__xst ,"__xme" : le_json.__xms[i] ,"masquee" : masquer_les_messages_du_serveur});
                    }
                }
                return le_json;
            }catch(e){
                logerreur({"__xst" : false ,"__xme" : 'erreur sur convertion json, texte non json=' + t ,"masquee" : masquer_les_messages_du_serveur});
                logerreur({"__xst" : false ,"__xme" : 'url=' + url ,"masquee" : masquer_les_messages_du_serveur});
                logerreur({"__xst" : false ,"__xme" : JSON.stringify(en_entree) ,"masquee" : masquer_les_messages_du_serveur});
                logerreur({"__xst" : false ,"__xme" : JSON.stringify(donnees) ,"masquee" : masquer_les_messages_du_serveur});
                return({"__xst" : false ,"__xme" : 'le retour n\'est pas en json pour ' + JSON.stringify(donnees) + ' , t=' + t ,"masquee" : masquer_les_messages_du_serveur});
            }
        }catch(e){
            console.log(e);
            if(e.message === 'signal timed out'){
                logerreur({"__xst" : false ,"__xme" : 'les données n\'ont pas pu être récupérées  en moins de ' + (parseInt(delais_admis / 1000 * 10,10) / 10) + ' secondes '});
            }else{
                logerreur({"__xst" : false ,"__xme" : e.message});
            }
            return({"__xst" : false ,"__xme" : e.message});
        }
    }
    /*
      =============================================================================================================
      function TransformHtmlEnRev
    */
    TransformHtmlEnRev(texteHtml,niveau,options){
        var t='';
        var esp0 = ' '.repeat(NBESPACESREV * niveau);
        var esp1 = ' '.repeat(NBESPACESREV);
        var supprimer_le_tag_html_et_head=true;
        var doctype='';
        var elementsJson={};
        var i=0;
        var tableau_des_commentaires_js=[];
        try{
            var position_doctype = texteHtml.toUpperCase().indexOf('<!DOCTYPE');
            if(position_doctype >= 0){
                if(position_doctype === 0){
                    for( i=1 ; i < texteHtml.length && doctype == '' ; i++ ){
                        if(texteHtml.substr(i,1) === '>'){
                            doctype=texteHtml.substr(0,i + 1);
                            texteHtml=texteHtml.substr(i + 1);
                        }
                    }
                }
            }
            elementsJson=this.mapDOM(texteHtml,false);
            if(elementsJson.__xst === true){
                if(elementsJson.parfait === true){
                    supprimer_le_tag_html_et_head=false;
                }else{
                    var supprimer_le_tag_html_et_head=true;
                    if(texteHtml.indexOf('<html') >= 0){
                        supprimer_le_tag_html_et_head=false;
                    }
                }
                try{
                    var tableau_de_javascripts_a_convertir=[];
                    var obj = this.traiteAstDeHtml(elementsJson.__xva,0,supprimer_le_tag_html_et_head,'',tableau_de_javascripts_a_convertir);
                    if(obj.__xst === true){
                        if(obj.__xva.trim().indexOf('html(') == 0){
                            if(doctype.toUpperCase() === '<!DOCTYPE HTML>'){
                                obj.__xva=obj.__xva.replace(/html\(/,'html((doctype)');
                            }else{
                                obj.__xva=obj.__xva.replace(/html\(/,'html(#((doctype)?? doctype pas html , normal="<!DOCTYPE html>" ?? )');
                            }
                        }
                        if(tableau_de_javascripts_a_convertir.length > 0){
                            var parseur_javascript=window.acorn.Parser;
                            for( var indjs=0 ; indjs < tableau_de_javascripts_a_convertir.length ; indjs++ ){
                                try{
                                    /*tabComment*/
                                    tableau_des_commentaires_js=[];
                                    
                                    var obj0 = parseur_javascript.parse(tableau_de_javascripts_a_convertir[indjs].__xva,{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tableau_des_commentaires_js});
                                }catch(e){
                                    console.error('erreur de conversion js e=',e);
                                    if(e.pos){
                                        logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 1094' + e.message ,"plage" : [e.pos,e.pos]});
                                    }
                                    return(logerreur({"__xst" : false ,"__xme" : '1093 il y a un problème dans un source javascript'}));
                                }
                                if(tableau_des_commentaires_js.length>0){
                                     /* 
                                       il faut retirer les commentaires si ce sont des CDATA ou des <source_javascript_rev> 
                                       car javascriptdanshtml les ajoute.
                                     */
                                     var commentaires_a_remplacer=[
                                         '<![CDATA[' , ']]>' , '<source_javascript_rev>' , '</source_javascript_rev>'  
                                     ]
                                     for(var nn=0;nn<commentaires_a_remplacer.length;nn++){
                                         for(var indc=tableau_des_commentaires_js.length-1;indc>=0;indc--){
                                             if(tableau_des_commentaires_js[indc].value.trim()===commentaires_a_remplacer[nn]){
                                                 tableau_des_commentaires_js.splice(indc,1);
                                             }
                                         }
                                     }
                                     for(var indc=tableau_des_commentaires_js.length-1;indc>=0;indc--){
                                         if(tableau_des_commentaires_js[indc].value.trim()==='' && tableau_des_commentaires_js[indc].type==='Line'){
                                             tableau_des_commentaires_js.splice(indc,1);
                                         }
                                     }
                                }
                                /* on transforme le ast du js en rev */
                                var obj1 = __module_js_parseur1.traite_ast(obj0.body,tableau_des_commentaires_js,{});
                                if(obj1.__xst === true){
                                    /* puis on remplace la chaine */
                                    var phrase_a_remplacer = '#(cle_javascript_a_remplacer,' + tableau_de_javascripts_a_convertir[indjs].cle + ')';
                                    obj.__xva=obj.__xva.replace(phrase_a_remplacer,obj1.__xva);
                                }else{
                                    console.error('erreur de conversion de ast vers js e=',e);
                                    return({"__xst" : false ,"__xme" : '1093 il y a un problème dans la transformation de ast js vers rev dans un source javascript'});
                                }
                            }
                            var source_rev=obj.__xva;
                            var une_erreur=false;
                            /*
                              =============================================================
                              console.log('après transformation, source_rev=',source_rev)
                              =============================================================
                            */
                            if(options.hasOwnProperty('en_ligne') && options.en_ligne === true){
                                sauvegarder_html_en_ligne(source_rev,options.donnees);
                                return;
                            }else if(options.hasOwnProperty('source_php')){
                                console.log('options=',options,'source_rev=',source_rev);
                                var chaine_a_remplacer = '#(cle_html_dans_php_a_remplacer,' + options.a_convertir.cle + ')';
                                options.source_php=options.source_php.replace(chaine_a_remplacer,source_rev);
                                var nouveau_source=options.source_php;
                                console.log('nouveau_source=',nouveau_source);
                                var param={"nouveau_source" : options.source_php ,"fonction_a_appeler" : options.fonction_a_appeler ,"cle_convertie" : options.a_convertir.cle ,"convertion_php" : true};
                                document.getElementById('txtar2').value=nouveau_source;
                                return;
                            }else{
                                if(options.hasOwnProperty('zone_html_rev')){
                                    try{
                                        if(document.getElementById(options.zone_html_rev)){
                                            document.getElementById(options.zone_html_rev).value=source_rev;
                                        }
                                        var tableau1 = iterateCharacters2(source_rev);
                                        var matriceFonction = functionToArray2(tableau1.out,true,false,'');
                                        if(matriceFonction.__xst === false){
                                            logerreur({"__xst" : false ,"__xme" : '1344 erreur module_html conversion en matrice'});
                                            return({"__xst" : false ,"__xme" : '1345 erreur module_html conversion en matrice'});
                                        }
                                        var obj1 = a2F1(matriceFonction.__xva,0,true,1);
                                        if(obj1.__xst === true){
                                            document.getElementById(options.zone_html_rev).value=obj1.__xva;
                                        }else{
                                            logerreur({"__xst" : false ,"__xme" : '1344 erreur module_html nettoyage en matrice'});
                                            return({"__xst" : false ,"__xme" : '1345 erreur module_html nettoyage en matrice'});
                                        }
                                    }catch(e){
                                        console.error('la zone "' + options.zone_html_rev + '" indiquée en paramètre n\'existe pas dans le document',e);
                                    }
                                }
                                return({"__xst" : true ,"__xva" : source_rev});
                            }
                        }else{
                            if(options.hasOwnProperty('html_dans_php')){
                                for( var i=0 ; i < options.tableau_de_html_dans_php_a_convertir.length ; i++ ){
                                    if(options.cle === options.tableau_de_html_dans_php_a_convertir[i].cle){
                                        var a_remplacer = '#(cle_html_dans_php_a_remplacer,' + options.cle + ')';
                                        options.html_dans_php=options.html_dans_php.replace(a_remplacer,obj.__xva);
                                    }
                                }
                                return({"__xst" : true ,"__xva" : options.html_dans_php});
                            }else if(options.hasOwnProperty('zone_html_rev')){
                                try{
                                    document.getElementById(options.zone_html_rev).value=obj.__xva.replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r').replace(/\\\\¶\\\\LF\\\\¶/g,'\n').replace(/\\\\¶\\\\CR\\\\¶/g,'\r');
                                    var tableau1 = iterateCharacters2(obj.__xva);
                                    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
                                    if(matriceFonction.__xst === false){
                                        logerreur({"__xst" : false ,"__xme" : '1412 erreur module_html conversion en matrice'});
                                        return({"__xst" : false ,"__xme" : '1413 erreur module_html conversion en matrice'});
                                    }
                                    var obj1 = a2F1(matriceFonction.__xva,0,true,1);
                                    if(obj1.__xst === true){
                                        document.getElementById(options.zone_html_rev).value=obj1.__xva;
                                    }else{
                                        logerreur({"__xst" : false ,"__xme" : '1419 erreur module_html nettoyage en matrice'});
                                        return({"__xst" : false ,"__xme" : '1420 erreur module_html nettoyage en matrice'});
                                    }
                                }catch(e){
                                    console.error('e=',e);
                                    return({"__xst" : false ,"__xme" : '1424 module_html'});
                                }
                                return({"__xst" : true ,"__xva" : obj.__xva});
                            }else{
                                return({"__xst" : true ,"__xva" : obj.__xva});
                            }
                        }
                    }else{
                        return(asthtml_logerreur({"__xst" : false ,"__xme" : '1191 erreur module_html'}));
                    }
                }catch(e){
                    console.error('e=',e);
                    return(asthtml_logerreur({"__xst" : false ,"__xme" : '1194 erreur module_html'}));
                }
            }else{
                console.log('elementsJson=',elementsJson);
            }
            console.log('par ici',elementsJson);
            return;
        }catch(e){
            console.log('e=',e);
            return(asthtml_logerreur({"__xst" : false ,"__xme" : 'erreur 0098 e=' + e.message + '\ne.stack=' + e.stack}));
        }
        console.log('fin');
    }
    /*
      =============================================================================================================
      function insere_javascript_dans_html
    */
    insere_javascript_dans_html(tab,ind,niveau){
        var t='';
        var j=0;
        var l01=tab.length;
        /*
          dans ce cas, c'est un tag <script avec des propriétés 
        */
        var lesProprietes='';
        var indiceDebutJs=-1;
        for( j=ind + 1 ; j < l01 && tab[j][3] > tab[ind][3] ; j++ ){
            if(tab[j][7] === ind){
                if(tab[j][2] === 'f'){
                    if(tab[j][1] === ''){
                        lesProprietes+=' ' + tab[j+1][1] + '="' + tab[j+2][1].replace(/\"/g,'&quot;').replace(/\\/g,'&#92;') + '"';
                    }else{
                        if(indiceDebutJs === -1){
                            indiceDebutJs=j;
                        }
                    }
                }else{
                    if(indiceDebutJs === -1){
                        indiceDebutJs=j;
                    }
                }
            }
        }
        if(indiceDebutJs === -1){
            /*
              c'est une balise <script src=""></script>
            */
            t+=CRLF;
            t+='<script' + lesProprietes + '></script>' + CRLF;
        }else{
            /*
              c'est un script dans un html
            */
            var ob = parseJavascript0(tab,indiceDebutJs,0);
            if(ob.__xst === true){
                /*
                  =====================================================================================
                  ecriture de la valeur dans le cas d'un tag javascriptdanshtml
                  =====================================================================================
                */
                t+=CRLF;
                t+='<script' + lesProprietes + '>' + CRLF;
                t+='//<![CDATA[' + CRLF;
                t+='//<source_javascript_rev>' + CRLF;
                t+=ob.__xva + CRLF;
                t+='//</source_javascript_rev>' + CRLF;
                t+='//]]>' + CRLF;
                t+='</script>' + CRLF;
            }else{
                return(logerreur({"__xst" : false ,"__xme" : 'erreur dans un javascript contenu dans un html par la fonction javascriptdanshtml 0700'}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /* function tabToHtml0 */
    tabToHtml0(tab,id,dansHead,dansBody,dansJs,noHead,dansPhp,dansCss,niveau){
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
        if(tab[id][1] == 'head'){
            dansHead=true;
        }
        if(tab[id][1] == 'style'){
            dansCss=true;
        }
        if(tab[id][1] == 'body'){
            dansBody=true;
        }
        if(tab[id][1] == 'script'){
            dansJs=true;
        }
        if(tab[id][1] == 'php'){
            dansPhp=true;
        }
        if(dansPhp && tab[id][1] === 'source'){
            t+='<?php ';
            ob=parseJavascript0(tab,id,0);
            parsePhp0(tab,id,0);
            if(ob.__xst === true){
                t+=ob.__xva;
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"__xme" : 'erreur de script dans un html'}));
            }
            t+=' ?>';
            return({
                "__xst" : true ,
                "__xva" : t ,
                "dansHead" : dansHead ,
                "dansBody" : dansBody ,
                "dansJs" : dansJs ,
                "dansPhp" : dansPhp ,
                "dansCss" : dansCss
            });
        }else if(dansJs && tab[id][1] === 'source'){
            php_contexte_commentaire_html=false;
            ob=parseJavascript0(tab,id + 1,0);
            php_contexte_commentaire_html=true;
            if(ob.__xst === true){
                t+=CRLF;
                t+='//<![CDATA[' + CRLF;
                t+='// = = = = <source javascript = = = =' + CRLF;
                if(ob.__xva.indexOf('use strict') >= 0){
                }else{
                    t+='"use strict";' + CRLF;
                }
                t+=ob.__xva;
                t+=CRLF + '// = = = = source javascript> = = = =' + CRLF;
                t+='//]]>' + CRLF;
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"__xme" : 'erreur de script dans un html'}));
            }
            return({
                "__xst" : true ,
                "__xva" : t ,
                "dansHead" : dansHead ,
                "dansBody" : dansBody ,
                "dansJs" : dansJs ,
                "dansPhp" : dansPhp ,
                "dansCss" : dansCss
            });
        }else{
            temp='';
            if(id === 0 || tab[id][1] === 'html' || tab[id][1] === 'html_dans_php'){
            }else{
                t+=espacesn(true,niveau);
            }
            if(tab[id][1] === '#' && tab[id][2] === 'f'){
                if(tab[id][13] === ''){
                    temp+='<!-- -->';
                }else{
                    var commentaire = traiteCommentaire2(tab[id][13],niveau,id);
                    if(commentaire !== ''){
                        /* si le commentaire html n'est pas vide, on lui ajoute au besoin un espace avant et après */
                        if(commentaire.substr(0,1) !== ' '){
                            commentaire=' ' + commentaire;
                        }
                        if(commentaire.substr(commentaire.length - 1,1) !== ' '){
                            commentaire=commentaire + ' ';
                        }
                    }
                    temp+='<!--' + commentaire;
                }
            }else if(tab[id][1] === 'php' && tab[id][2] === 'f'){
                temp+='';
            }else{
                if(noHead && tab[id][2] === 'f' && (tab[id][1] == 'html' || tab[id][1] == 'html_dans_php')){
                }else{
                    temp+='<' + tab[id][1];
                }
            }
            doctype='';
            for( i=id + 1 ; i < l01 && tab[i][3] > tab[id][3] ; i++ ){
                if(tab[i][7] == id){
                    if(tab[i][2] == 'f' && tab[i][1] == ''){
                        if(tab[i][8] <= 2){
                            if(tab[i][8] == 2 && tab[i+1][2] == 'c' && tab[i+2][2] == 'c'){
                                /*
                                  =====================================================
                                  Ecriture de la propriété
                                  =====================================================
                                */
                                temp+=' ' + tab[i+1][1] + '="' + tab[i+2][1].replace(/\"/g,'&quot;').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\') + '"';
                                if(tab[i+1][1] == 'data-lang' && (tab[i+2][1] == 'fr' || tab[i+2][1] == 'en')){
                                    globale_LangueCourante=tab[i+2][1];
                                }
                            }else if(tab[i][8] == 1 && tab[i+1][2] == 'c'){
                                if(tab[i+1][1] == 'doctype'){
                                    doctype='<!DOCTYPE html>';
                                }else{
                                    temp+=' ' + tab[i+1][1] + '';
                                }
                            }else{
                                return(logerreur({"__xst" : false ,"id" : i ,"__xva" : t ,"__xme" : '1 les propriété d\'un tag html doivent contenir une ou deux constantes 0596'}));
                            }
                        }else{
                            return(logerreur({"__xst" : false ,"id" : i ,"__xva" : t ,"__xme" : '2 les propriété d\'un tag html doivent contenir une ou deux constantes 0599'}));
                        }
                    }
                    if(tab[i][2] == 'f' && tab[i][1] != ''){
                        contientEnfantsNonVides=true;
                    }
                    if(tab[i][2] == 'c' && tab[i][1] != ''){
                        contientConstantes=true;
                    }
                }
            }
            if((tab[id][1] === 'html' || tab[id][1] === 'html_dans_php') && doctype != ''){
                if(id > 0){
                    t+=doctype + CRLF;
                    t+=temp;
                }
            }else{
                if(id > 0){
                    t+=temp;
                }
            }
            if(contientEnfantsNonVides || contientConstantes){
                if(id > 0){
                    if(noHead && (tab[id][1] == 'html' || tab[id][1] === 'html_dans_php')){
                    }else if(tab[id][1] == 'php'){
                    }else{
                        t+='>';
                    }
                }
                var contenuNiveauPlus1='';
                for( i=id + 1 ; i < l01 && tab[i][3] > tab[id][3] ; i++ ){
                    if(tab[i][7] == id){
                        if(tab[i][2] == 'f' && tab[i][1] != ''){
                            if(tab[i][1].toLowerCase() === '@'){
                                t+=tab[i][13];
                            }else if(tab[i][1].toLowerCase() === 'ldplusjsondanshtml'){
                                /*
                                  dans ce cas, c'est un tag <script avec des propriétés 
                                */
                                var lesProprietes='';
                                var indiceDebutJs=-1;
                                for( var j = i + 1 ; j < l01 && tab[j][3] > tab[i][3] ; j++ ){
                                    if(tab[j][7] === i){
                                        if(tab[j][2] === 'f'){
                                            if(tab[j][1] === ''){
                                                lesProprietes+=' ' + tab[j+1][1] + '="' + tab[j+2][1].replace(/\"/g,'&quot;').replace(/\\/g,'&#92;') + '"';
                                            }else{
                                                if(indiceDebutJs === -1){
                                                    indiceDebutJs=j;
                                                }
                                            }
                                        }else{
                                            if(indiceDebutJs === -1){
                                                indiceDebutJs=j;
                                            }
                                        }
                                    }
                                }
                                if(indiceDebutJs === -1){
                                    /*
                                      c'est une balise <script src=""></script>
                                    */
                                    t+=CRLF;
                                    t+='<script' + lesProprietes + '></script>' + CRLF;
                                }else{
                                    /*
                                      c'est un script dans un html
                                    */
                                    niveau++;
                                    ob=parseJavascript0(tab,indiceDebutJs,niveau);
                                    niveau--;
                                    if(ob.__xst === true){
                                        /*
                                          =====================================
                                          ecriture de la valeur dans le cas d'un tag ldplusjsondanshtml
                                          =====================================
                                        */
                                        t+=CRLF;
                                        t+='<script' + lesProprietes + '>';
                                        var contenu = ob.__xva.substr(ob.__xva.indexOf('=') + 1);
                                        if(contenu.substr(contenu.length - 1,1) === ';'){
                                            contenu=contenu.substr(0,contenu.length - 1);
                                        }
                                        t+=contenu + '</script>' + CRLF;
                                    }else{
                                        return(logerreur({"__xst" : false ,"__xme" : 'erreur dans un javascript contenu dans un html par la fonction ldplusjsondanshtml 0783'}));
                                    }
                                }
                            }else if(tab[i][1].toLowerCase() === 'javascriptdanshtml'){
                                var obj = this.insere_javascript_dans_html(tab,i,niveau);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xme" : 'erreur dans un javascript contenu dans un html par la fonction javascriptdanshtml 0943'}));
                                }
                            }else{
                                /*
                                  =====================================================
                                  entrée dans le récursif
                                  =====================================================
                                */
                                if(tab[i][1] === 'script' || id === 0){
                                    /*
                                      dans le cas du script ou de la racine, on le met à la racine
                                    */
                                    ob=this.tabToHtml0(tab,i,dansHead,dansBody,dansJs,noHead,dansPhp,dansCss,0);
                                }else{
                                    ob=this.tabToHtml0(tab,i,dansHead,dansBody,dansJs,noHead,dansPhp,dansCss,niveau + 1);
                                }
                                if(ob.__xst === true){
                                    /*
                                      =============================================
                                      ecriture de la valeur dans le cas d'un tag html normal
                                      =============================================
                                    */
                                    t+=ob.__xva;
                                    dansBody=ob.dansBody;
                                    dansHead=ob.dansHead;
                                    dansJs=ob.dansJs;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xme" : 'erreur dans un html 0659'}));
                                }
                            }
                        }else{
                            if(tab[i][2] === 'f' && tab[i][1] === ''){
                            }else{
                                if(tab[i][2] === 'c' && tab[tab[i][7]][8] === 1){
                                    /* aucune propriété et qu'une constante */
                                }else{
                                    if(tab[tab[i][7]][2] === 'f' && (tab[tab[i][7]][1] === 'textarea' || tab[tab[i][7]][1] === 'pre')){
                                        t+='';
                                    }else{
                                        t+=espacesn(true,niveau + 1);
                                    }
                                }
                                /*
                                  =====================================================
                                  ecriture de la valeur dans le cas d'une constante
                                  =====================================================
                                */
                                var indcss=0;
                                if(dansCss === true){
                                    for( indcss=t.length - 1 ; indcss >= 0 ; indcss-- ){
                                        if(t.substr(indcss,1) !== ' '){
                                            t=t.substr(0,indcss);
                                            break;
                                        }
                                    }
                                    var contenuCss = tab[i][1].replace(/&amp;gt;/g,'&gt;').replace(/&amp;lt;/g,'&lt;').replace(/&amp;amp;/g,'&amp;').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                                    /* on supprime les espaces de fin */
                                    if(contenuCss !== ''){
                                        for( var indcss = contenuCss.length - 1 ; indcss >= 0 ; indcss-- ){
                                            if(!(contenuCss.substr(indcss,1) === ' ' || contenuCss.substr(indcss,1) === '\n' || contenuCss.substr(indcss,1) === '\r')){
                                                contenuCss=contenuCss.substr(0,indcss + 1);
                                                break;
                                            }
                                        }
                                    }
                                    t+=contenuCss;
                                }else{
                                    /*
                                      if(false && tab[tab[i][7]][2]==='f' && ( tab[tab[i][7]][1]==='textarea' || tab[tab[i][7]][1]==='pre' )){
                                      
                                      var str01=tab[i][1].replace(/&amp;gt;/g,'&gt;').replace(/&amp;lt;/g,'&lt;').replace(/&amp;amp;/g,'&amp;').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\').replace(/>/g,'&gt;').replace(/</g,'&lt;');
                                      str01=str01.replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r').replace(/\\¶\\LF\\¶/g,'¶LF¶').replace(/\\¶\\CR\\¶/g,'¶CR¶');
                                      t+=str01;
                                      
                                    */
                                    if(tab[tab[i][7]][2] === 'f' && (tab[tab[i][7]][1] === 'textarea' || tab[tab[i][7]][1] === 'pre')){
                                        t+=tab[i][1].replace(/&amp;gt;/g,'&gt;').replace(/&amp;lt;/g,'&lt;').replace(/&amp;amp;/g,'&amp;').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                                    }else{
                                        t+=tab[i][1].replace(/&amp;gt;/g,'&gt;').replace(/&amp;lt;/g,'&lt;').replace(/&amp;amp;/g,'&amp;').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\').replace(/>/g,'&gt;').replace(/</g,'&lt;');
                                    }
                                }
                                contenuNiveauPlus1=tab[i][1];
                            }
                        }
                    }
                }
                if(id > 0){
                    if(noHead && (tab[id][1] === 'html' || tab[id][1] === 'html_dans_php')){
                        t+=CRLF;
                    }else{
                        if(tab[id][2] === 'f' && tab[id][8] === 1 && tab[id+1][2] === 'c'){
                            /* aucune propriété et qu'une constante */
                        }else{
                            if(id === 0 || tab[id][2] === 'f' && (tab[id][1] === 'textarea' || tab[id][1] === 'pre')){
                            }else{
                                t+=espacesn(true,niveau);
                            }
                        }
                        if(tab[id][1] === 'php'){
                        }else{
                            t+='</' + tab[id][1] + '>';
                            if((tab[id][1] == 'td'
                             || tab[id][1] == 'a'
                             || tab[id][1] == 'span'
                             || tab[id][1] == 'button'
                             || tab[id][1] == 'title'
                             || tab[id][1] == 'h1'
                             || tab[id][1] == 'h2'
                             || tab[id][1] == 'h3')
                             && contenuNiveauPlus1 != ''
                             && contenuNiveauPlus1.indexOf('<') < 0
                            ){
                                var tag=tab[id][1];
                                const re1 = new RegExp("\<" + tag + "(.*)\>\r\n[ \t]+","g");
                                const rp1 = '<' + tag + '$1>';
                                t=t.replace(re1,rp1);
                                const re2 = new RegExp("\r\n[ \t]+\<\/" + tag + "\>","g");
                                const rp2 = '</' + tag + '>';
                                t=t.replace(re2,rp2);
                            }
                        }
                    }
                }
                if('style' == tab[id][1]){
                    dansCss=false;
                }
                if('script' == tab[id][1]){
                    dansJs=false;
                }
                if('php' == tab[id][1]){
                    dansPhp=false;
                }
            }else{
                if(tab[id][1] == 'script'){
                    t+='>' + '<' + '/script>';
                    dansJs=false;
                }else if(tab[id][1] == 'php'){
                    t+='????PHP????';
                    dansPhp=false;
                }else{
                    if(id > 0){
                        if(tab[id][1] == '#'){
                            if(tab[id][13] === ''){
                                t+=CRLF;
                            }else{
                                t+='-->';
                            }
                        }else if(tab[id][1] == 'br' || tab[id][1] == 'hr' || tab[id][1] == 'meta' || tab[id][1] == 'link' || tab[id][1] == 'input'){
                            t+=' />';
                        }else{
                            t+='></' + tab[id][1] + '>';
                        }
                    }
                }
            }
            return({"__xst" : true ,"__xva" : t ,"dansHead" : dansHead ,"dansBody" : dansBody ,"dansJs" : dansJs});
        }
    }
}
export{traitements_sur_html};