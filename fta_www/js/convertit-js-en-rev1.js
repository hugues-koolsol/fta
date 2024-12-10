"use strict";
/*
  =====================================================================================================================
  point d'entrée = TransformAstEnRev
  
  'ArrayExpression'
  'ArrowFunctionExpression'
  'AssignmentExpression'
  "AssignmentPattern"   
  'AwaitExpression'     
  'BinaryExpression'    
  'CallExpression'        
  'ConditionalExpression' 
  'FunctionExpression'    
  'Identifier'            
  'LabeledStatement'      
  'Literal'               
  'LogicalExpression'     
  'MemberExpression'      
  'NewExpression'         
  'ObjectExpression'      
  'SequenceExpression'    
  'TemplateLiteral'       
  'ThisExpression'             
  'UpdateExpression'      
  'UnaryExpression'       
  'VariableDeclarator'      
  =====================================================================================================================
*/
function astjs_logerreur(o){
    logerreur(o);
    if(global_messages['ranges'].length <= 3){
        if(o.hasOwnProperty('element') && o.element.hasOwnProperty('range')){
            global_messages['ranges'].push(JSON.parse(JSON.stringify(o.element.range)));
        }
    }
    return o;
}
/*
  =====================================================================================================================
*/
function traiteUneComposante(element,niveau,parentEstCrochet,dansSiOuBoucle,parent){
    var t='';
    var i=0;
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    if('Literal' === element.type){
        if(element.regex){
            var leParam = '/' + element.regex.pattern + '/';
            if(element.regex.flags){
                leParam+=element.regex.flags;
            }
            t+=leParam;
        }else{
            var valeur='';
            /* il faut traiter les valeurs entre quotes qui terminent par un \ */
            if(element.raw.indexOf('\\\n') >= 0){
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur 0063 veuillez réécrire ces lignes JS qui terminent par un \\' ,"element" : element}));
            }else{
                valeur=element.raw;
            }
            if(niveau <= 1){
                debugger;
                t+='directive(' + valeur + ')';
            }else{
                t+=valeur;
            }
        }
    }else if('Identifier' === element.type){
        if(niveau === 0){
            t+='identifiant(' + element.name + ')';
        }else{
            t+=element.name;
        }
    }else if('LabeledStatement' === element.type){
        var contenu='';
        if(element.body){
            var obj = TransformAstEnRev(element.body,niveau + 2);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur 0116 pour ' + element.type ,"element" : element}));
            }
        }
        if(element.label.type === 'Identifier'){
            t+='etiquette(' + element.label.name + ',contenu(' + contenu + '))';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0098 pour ' + element.type ,"element" : element}));
        }
    }else if('AwaitExpression' === element.type){
        if("CallExpression" === element.argument.type){
            var objass = traiteUneComposante(element.argument,niveau + 1,false,false,element);
            if(objass.__xst === true){
                t+='await(' + objass.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0084 pour ' + element.argument.type ,"element" : element}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0087 pour ' + element.type ,"element" : element}));
        }
    }else if('ArrowFunctionExpression' === element.type){
        var lesArguments='';
        if(element.params){
            if(element.params.length > 0){
                for( i=0 ; i < element.params.length ; i++ ){
                    var objarg = traiteUneComposante(element.params[i],niveau + 1,false,false,element);
                    if(objarg.__xst === true){
                        lesArguments+=',p(' + objarg.__xva + ')';
                    }
                }
                if(lesArguments.length > 0){
                    lesArguments=lesArguments.substr(1);
                }
            }else{
                /* pas d'argument pour cette fonction fléchée ! */
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0111 pour ' + element.type ,"element" : element}));
        }
        var contenu='';
        if(element.body && element.body.type === 'BlockStatement'){
            if(element.body.body && element.body.body.length > 0){
                var obj = TransformAstEnRev(element.body.body,niveau + 2);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                    if(element.body.hasOwnProperty('end')){
                        positionDebutBloc=element.body.end;
                    }else{
                        debugger;
                    }
                    contenu+=ajouteCommentaireAvant(element.body,niveau + 2);
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur 0116 pour ' + element.type ,"element" : element}));
                }
            }else{
                if(element.body.hasOwnProperty('end')){
                    positionDebutBloc=element.body.end;
                }else{
                    debugger;
                }
                contenu+=ajouteCommentaireAvant(element.body,niveau + 2);
            }
        }else if(element.body && (element.body.type === 'CallExpression' || element.body.type === 'BinaryExpression')){
            var objass = traiteUneComposante(element.body,niveau + 1,false,false,element);
            if(objass.__xst === true){
                contenu+=objass.__xva;
                if(element.body.hasOwnProperty('end')){
                    positionDebutBloc=element.body.end;
                }else{
                    debugger;
                }
                contenu+=ajouteCommentaireAvant(element.body,niveau + 2);
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0137 pour ' + element.argument.type ,"element" : element}));
            }
        }else{
            debugger;
            return(astjs_logerreur({"__xst" : false ,"__xme" : '0134 erreur traiteUneComposante  pour ' + element.type ,"element" : element}));
        }
        if(element.async === false && element.expression === false && element.generator === false){
            t='appelf(flechee() , nomf(function) ' + lesArguments + ',contenu(' + contenu + '))';
        }else if(element.async === false && element.expression === true && element.generator === false){
            t='appelf(flechee() , nomf(function) ' + lesArguments + ',contenu(' + contenu + '))';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0095 pour ' + element.type ,"element" : element}));
        }
    }else if('MemberExpression' === element.type){
        var obj1 = traiteMemberExpression1(element,niveau + 1,parent);
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteUneComposante 0049 ' + element.type ,"element" : element}));
        }
    }else if('UpdateExpression' === element.type){
        var objass = traiteUpdateExpress1(element,niveau + 1,{"sansLF" : true},parent);
        if(objass.__xst === true){
            t+=objass.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0051 pour ' + element.type ,"element" : element}));
        }
    }else if('CallExpression' === element.type){
        var obj1 = traiteCallExpression1(element,niveau + 1,element,{});
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteUneComposante 0056 ' + element.type ,"element" : element}));
        }
    }else if('ObjectExpression' === element.type){
        var obj1 = traiteObjectExpression1(element,niveau + 1);
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0193' ,"element" : element}));
        }
    }else if('UnaryExpression' === element.type){
        var nomDuTestUnary = recupNomOperateur(element.operator);
        var obj1 = traiteUneComposante(element.argument,niveau + 1,parentEstCrochet,dansSiOuBoucle,element);
        if(obj1.__xst === true){
            if((nomDuTestUnary === 'moins' || nomDuTestUnary === 'plus') && isNumeric(obj1.__xva)){
                if(nomDuTestUnary === 'moins'){
                    t+='-' + obj1.__xva;
                }else{
                    t+='+' + obj1.__xva;
                }
            }else{
                t+=nomDuTestUnary + '(' + obj1.__xva + ')';
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0076' ,"element" : element}));
        }
    }else if('LogicalExpression' === element.type){
        var obj = traiteLogicalExpression1(element,niveau + 1,true);
        if(obj.__xst === true){
            if(dansSiOuBoucle){
                if(obj.__xva.substr(0,1) === ','){
                    t+='' + (obj.__xva.substr(1)) + '';
                }else{
                    t+='' + obj.__xva + '';
                }
            }else{
                if(obj.__xva.substr(0,1) === ','){
                    t+='condition(' + (obj.__xva.substr(1)) + ')';
                }else{
                    t+='condition(' + obj.__xva + ')';
                }
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0080 '}));
        }
    }else if('NewExpression' === element.type){
        var obj1 = traiteCallExpression1(element,niveau + 1,element,{});
        if(obj1.__xst === true){
            t+='new(' + obj1.__xva + ')';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteUneComposante 0154 ' + element.type ,"element" : element}));
        }
    }else if('ArrayExpression' === element.type){
        var obj1 = traiteArrayExpression1(element,niveau + 1);
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0094' ,"element" : element}));
        }
    }else if('BinaryExpression' === element.type){
        var obj1 = traiteBinaryExpress1(element,niveau + 1,parentEstCrochet,dansSiOuBoucle);
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0101 ' ,"element" : element}));
        }
    }else if('ConditionalExpression' === element.type){
        var obj1 = traiteConditionalExpression1(element,niveau + 1);
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0108 ' ,"element" : element}));
        }
    }else if('TemplateLiteral' === element.type){
        var obj1 = traiteTemplateLiteral1(element,niveau + 1);
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0115 ' ,"element" : element}));
        }
    }else if('FunctionExpression' === element.type){
        var obj1 = traiteFunctionExpression1(element,niveau + 1,element,'');
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
        }
    }else if('AssignmentPattern' === element.type){
        var obj1 = traiteAssignmentPattern(element,niveau + 1,{"sansLF" : true});
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0136 ' ,"element" : element}));
        }
    }else if('AssignmentExpression' === element.type){
        var obj1 = traiteAssignmentExpress1(element,niveau + 1,{"sansLF" : true},parent);
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0136 ' ,"element" : element}));
        }
    }else if("ThisExpression" === element.type){
        t+='this';
    }else if("VariableDeclarator" === element.type){
        var obj2 = traiteUneComposante(element.init,niveau + 1,parentEstCrochet,dansSiOuBoucle,element);
        if(obj2.__xst === true){
            t+=obj2.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0159 ' ,"element" : element}));
        }
    }else if("SequenceExpression" === element.type){
        if(element.expressions.length > 1 && parent.computed && parent.computed === true){
            /*
              tab[1,1] est super dangereux, 
            */
            astjs_logerreur({"__xst" : true ,"__xav" : '0326 l\'opérateur virgule est dangereux dans un tableau !'});
        }
        for( i=0 ; i < element.expressions.length ; i++ ){
            var obj1 = traiteUneComposante(element.expressions[i],niveau + 2,parentEstCrochet,dansSiOuBoucle,element);
            if(obj1.__xst === true){
                if(t !== ''){
                    t+=',';
                }
                t+=obj1.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0158 pour ' + element.type ,"element" : element}));
            }
        }
        t='virgule(' + t + ')';
    }else if('MethodDefinition' === element.type){
        if((element.kind === "method"
         || element.kind === "constructor"
         || element.kind === "get"
         || element.kind === "set")
         && element.value
         && element.value.type === "FunctionExpression"
         && element.value.body
        ){
            t+='\n' + esp0 + 'méthode(';
            t+='\n' + esp0 + esp1 + 'definition(';
            if(element.kind === "get" || element.kind === "set"){
                t+='\n' + esp0 + esp1 + esp1 + 'type(' + (element.kind === 'get' ? ( 'lire' ) : ( 'écrire' )) + '),';
            }
            t+='\n' + esp0 + esp1 + esp1 + 'nom(' + element.key.name + '),';
            if(element.key.type === "PrivateIdentifier"){
                t+='\n' + esp0 + esp1 + esp1 + 'mode(privée),';
            }
            if(element.value.async === true){
                t+='\n' + esp0 + esp1 + esp1 + 'asynchrone()';
            }
            if(element.value.params && element.value.params.length > 0){
                t+=',';
                var j=0;
                for( j=0 ; j < element.value.params.length ; j++ ){
                    if(element.value.params[j].type === "Identifier"){
                        t+='\n' + esp0 + esp1 + esp1 + 'argument(';
                        t+=comm_avant_debut(element.value.params[j],niveau);
                        t+=element.value.params[j].name + ')';
                    }else if(element.value.params[j].type === "AssignmentPattern"){
                        var obj = traiteAssignmentPattern(element.value.params[j],niveau + 1,{});
                        if(obj.__xst === true){
                            t+='\n' + esp0 + esp1 + esp1 + 'argument(';
                            t+=comm_avant_debut(element.value.params[j],niveau);
                            t+=obj.__xva + ')';
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2377 type argument non prévu ' + element.value.params[j].type ,"element" : element}));
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2380 type argument non prévu ' + element.value.params[j].type ,"element" : element}));
                    }
                    if(j < element.value.params.length - 1){
                        t+=',';
                    }
                }
            }
            t+='\n' + esp0 + esp1 + '),';
            t+='\n' + esp0 + esp1 + 'contenu(';
            var prop={};
            var bodyTrouve=false;
            for(prop in element.value){
                if(prop === 'body'){
                    bodyTrouve=true;
                    var obj = TransformAstEnRev(element.value[prop],niveau + 2);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                        if(element.value[prop].hasOwnProperty('end')){
                            positionDebutBloc=element.value[prop].end;
                        }else{
                            debugger;
                        }
                        t+=ajouteCommentaireAvant(element.value[prop],niveau + 2);
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2400 ' + element.type ,"element" : element}));
                    }
                }
            }
            t+='\n' + esp0 + esp1 + ')';
            t+='\n' + esp0 + ')';
        }else{
            debugger;
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0278 pour ' + element.type ,"element" : element}));
        }
    }else if('PropertyDefinition' === element.type){
        if(element.key.type === 'PrivateIdentifier' || element.key.type === 'Identifier'){
            if(element.key.type === 'PrivateIdentifier'){
                t+='\n' + esp0 + esp1 + 'variable_privée(' + element.key.name;
            }else if(element.key.type === 'Identifier'){
                t+='\n' + esp0 + esp1 + 'variable_publique(' + element.key.name;
            }
            if(element.value){
                if(element.value.type === 'Literal'){
                    t+=',' + element.value.raw;
                }else if(element.value.type === 'Identifier'){
                    t+=',' + element.value.name;
                }else if(element.value.type === 'ObjectExpression'
                 || element.value.type === 'BinaryExpression'
                 || element.value.type === 'MemberExpression'
                 || element.value.type === 'ArrayExpression'
                ){
                    var obj1 = traiteUneComposante(element.value,niveau + 1,false,false,element);
                    if(obj1.__xst === true){
                        t+=',' + obj1.__xva + '';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0305' ,"element" : element}));
                    }
                }else{
                    debugger;
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0295 ' + element.value.type ,"element" : element}));
                }
            }
            t+=')';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0291 ' + element.type ,"element" : element}));
        }
    }else if('ExportNamedDeclaration' === element.type){
        if(element.specifiers && element.specifiers.length > 0){
            var j=0;
            for( j=0 ; j < element.specifiers.length ; j++ ){
                var specifier=element.specifiers[j];
                if(specifier.exported){
                    if(specifier.exported.type === "Identifier"){
                        t+='exporter(nom_de_classe(' + specifier.exported.name + '))';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0316 ' + element.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0319 ' + element.type ,"element" : element}));
                }
            }
        }
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0118 ' + element.type ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function recupNomOperateur(s){
    if(s === 'typeof'){
        return 'Typeof';
    }else if(s === 'instanceof'){
        return 'Instanceof';
    }else if(s === '++'){
        return 'incr1';
    }else if(s === '--'){
        return 'decr1';
    }else if(s === '+'){
        return 'plus';
    }else if(s === '-'){
        return 'moins';
    }else if(s === '*'){
        return 'mult';
    }else if(s === '/'){
        return 'divi';
    }else if(s === '%'){
        return 'modulo';
    }else if(s === '**'){
        return 'puissance';
    }else if(s === '=='){
        return 'egal';
    }else if(s === '==='){
        return 'egalstricte';
    }else if(s === '!='){
        return 'diff';
    }else if(s === '!=='){
        return 'diffstricte';
    }else if(s === '>'){
        return 'sup';
    }else if(s === '<'){
        return 'inf';
    }else if(s === '>='){
        return 'supeg';
    }else if(s === '<='){
        return 'infeg';
    }else if(s === '!'){
        return 'non';
    }else if(s === '&&'){
        return 'et';
    }else if(s === '||'){
        return 'ou';
    }else if(s === '|'){
        return 'ou_bin';
    }else if(s === '&'){
        return 'etBin';
    }else if(s === '~'){
        /* vieux nonBin */
        return 'oppose_binaire';
    }else if(s === '^'){
        return 'ou_ex_bin';
    }else if(s === '>>'){
        return 'decalDroite';
    }else if(s === '>>>'){
        return 'decal_droite_non_signe';
    }else if(s === '<<'){
        return 'decalGauche';
    }else if(s === 'in'){
        return 'cle_dans_objet';
    }else if(s === 'delete'){
        return 'supprimer';
    }else if(s === 'void'){
        return 'void';
    }else{
        return('TODO recupNomOperateur pour "' + s + '"');
    }
}
/*
  =====================================================================================================================
*/
function traiteConditionalExpression1(element,niveau){
    var t='';
    var objtest1 = traiteUneComposante(element.test,niveau,false,false,element);
    if(objtest1.__xst === false){
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteConditionalExpression1 0180 ' + element.type ,"element" : element}));
    }
    var objSiVrai={};
    var objSiVrai = traiteUneComposante(element.consequent,niveau,false,false,element);
    if(objSiVrai.__xst === false){
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteUpdateExpress1 1707 ' + element.type ,"element" : element}));
    }
    var objSiFaux={};
    var objSiFaux = traiteUneComposante(element.alternate,niveau,false,false,element);
    if(objSiFaux.__xst === false){
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteUpdateExpress1 1707 ' + element.type ,"element" : element}));
    }
    t+='testEnLigne(condition(' + objtest1.__xva + '),siVrai(' + objSiVrai.__xva + '),siFaux(' + objSiFaux.__xva + '))';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteBinaryExpress1(element,niveau,parentEstCrochet,dansSiOuBoucle){
    var t='';
    var nomDuTest = recupNomOperateur(element.operator);
    var gauche = traiteUneComposante(element.left,niveau,parentEstCrochet,dansSiOuBoucle,element);
    if(gauche.__xst === false){
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteBinaryExpress1 0215 ' + element.type ,"element" : element}));
    }
    var droite = traiteUneComposante(element.right,niveau,parentEstCrochet,dansSiOuBoucle,element);
    if(droite.__xst === false){
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteUpdateExpress1 0222 ' + element.type ,"element" : element}));
    }
    if(element.right.type === 'Literal'
     && (element.right.raw.substr(0,1) === "'"
     || element.right.raw.substr(0,1) === '"')
     && nomDuTest === 'plus'
     || element.left.type === 'Literal'
     && (element.left.raw.substr(0,1) === "'"
     || element.left.raw.substr(0,1) === '"')
     && nomDuTest === 'plus'
    ){
        t+='concat(' + gauche.__xva + ',' + droite.__xva + ')';
    }else if(parentEstCrochet && (nomDuTest === 'plus' || nomDuTest === 'moins')){
        t+='' + nomDuTest + '(' + gauche.__xva + ',' + droite.__xva + ')';
    }else{
        t+='' + nomDuTest + '(' + gauche.__xva + ',' + droite.__xva + ')';
    }
    if(t.substr(0,12) === 'plus(concat('){
        t='concat(' + (t.substr(5));
    }
    if(t.substr(0,14) === 'concat(concat('){
        var o = functionToArray(t,true,false,'');
        if(o.__xst === true){
            var nouveauTableau = baisserNiveauEtSupprimer(o.__xva,2,0);
            var obj = a2F1(nouveauTableau,0,false,1,false);
            if(obj.__xst === true){
                t=obj.__xva;
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteBinaryExpress1 0380 pour la simplification ' + element.type ,"element" : element}));
        }
    }
    if(t.substr(0,10) === 'plus(plus('
     || t.substr(0,12) === 'moins(moins('
     || t.substr(0,10) === 'mult(mult('
     || t.substr(0,10) === 'divi(divi('
    ){
        var o = functionToArray(t,true,false,'');
        if(o.__xst === true){
            var nouveauTableau = baisserNiveauEtSupprimer(o.__xva,2,0);
            var obj = a2F1(nouveauTableau,0,false,1,false);
            if(obj.__xst === true){
                t=obj.__xva;
            }
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteLogicalExpression1(element,niveau,dansSiOuBoucle){
    var t='';
    if(element.left && element.right){
        var obj1 = js_traiteCondition1(element.left,niveau,dansSiOuBoucle);
        if(obj1.__xst === false){
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteLogicalExpression1 0274 ' ,"element" : element}));
        }
        var obj2 = js_traiteCondition1(element.right,niveau,dansSiOuBoucle);
        if(obj2.__xst === false){
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteLogicalExpression1 0443 ' + element.operator ,"element" : element}));
        }
        if('&&' === element.operator){
            t+='et(' + obj1.__xva + ',' + obj2.__xva + ')';
        }else if('||' === element.operator){
            t+='ou(' + obj1.__xva + ',' + obj2.__xva + ')';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteLogicalExpression1 0436 ' + element.operator ,"element" : element}));
        }
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteLogicalExpression1 0238 ' ,"element" : element}));
    }
    if(t.substr(0,6) === 'ou(ou(' || t.substr(0,6) === 'et(et('){
        var o = functionToArray(t,true,false,'');
        if(o.__xst === true){
            var nouveauTableau = baisserNiveauEtSupprimer(o.__xva,2,0);
            var obj = a2F1(nouveauTableau,0,false,1,false);
            if(obj.__xst === true){
                t=obj.__xva;
            }
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function js_traiteCondition1(element,niveau,dansSiOuBoucle){
    var t='';
    var i=0;
    var j=0;
    var obj1 = traiteUneComposante(element,niveau,false,dansSiOuBoucle,element);
    if(obj1.__xst === true){
        t+=obj1.__xva;
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour js_traiteCondition1 0614 ' + element.type ,"element" : element}));
    }
    /*
      il faut transformer ceci :
      [[[egal[a,1]],ou[[egal[b,2]]]],ou[[egal[c,3]]]],
      en ceci
      [[egal[d,1]],ou[[egal[e,2]]],ou[[egal[f,3]]]]
    */
    var o = functionToArray(t,true,true,'');
    if(o.__xst === true){
        if(o.__xva.length > 3
         && o.__xva[1][1] === ''
         && o.__xva[1][2] === 'f'
         && o.__xva[2][1] === ''
         && o.__xva[2][2] === 'f'
         && o.__xva[3][1] === ''
         && o.__xva[3][2] === 'f'){
            var enfantDe2='';
            var onContinue=true;
            for( i=0 ; i < o.__xva.length && onContinue === true ; i++ ){
                if(o.__xva[i][7] === 2){
                    if(o.__xva[i][1] !== ''){
                        if(enfantDe2 === ''){
                            enfantDe2=o.__xva[i][1];
                        }else{
                            if(enfantDe2 !== o.__xva[i][1]){
                                /*
                                  on a des conditions "et" et "ou", on ne simplifie pas 
                                */
                                onContinue=false;
                                break;
                            }
                        }
                    }
                }
            }
            if(onContinue === true){
                var enfantDe1='';
                for( i=0 ; i < o.__xva.length && onContinue === true ; i++ ){
                    if(o.__xva[i][7] === 1){
                        if(o.__xva[i][1] !== ''){
                            if(enfantDe1 === ''){
                                enfantDe1=o.__xva[i][1];
                                if(enfantDe1 !== enfantDe2){
                                    onContinue=false;
                                    break;
                                }
                            }else{
                                if(enfantDe1 !== o.__xva[i][1]){
                                    /*
                                      on a des conditions "et" et "ou", on ne simplifie pas 
                                    */
                                    onContinue=false;
                                    break;
                                }else{
                                    if(enfantDe1 !== enfantDe2){
                                        onContinue=false;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(onContinue === true){
                /*
                  il faut supprimer l'id 2 et baisser de 1 tous les niveaux supérieurs à 1 de l'id 2
                */
                var nouveauTableau = baisserNiveauEtSupprimer(o.__xva,2,0);
                var obj = a2F1(nouveauTableau,0,false,1,false);
                if(obj.__xst === true){
                    t=obj.__xva;
                }
            }
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteForOf1(element,niveau){
    t+=ajouteCommentaireAvant(element,niveau);
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomVariable='';
    var nomObjet='';
    var pourInit='';
    if(element.left.type === 'VariableDeclaration'){
        var objDecl = traiteDeclaration1(element.left,niveau);
        if(objDecl.__xst === true){
            nomVariable=objDecl.__xva.replace(/\r/g,'').replace(/\n/g,'');
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteForIn1 0700 ' + element.left.type ,"element" : element}));
        }
    }else if(element.left.type === 'Identifier'){
        nomVariable=element.left.name;
    }else if(element.left.type === 'MemberExpression'){
        var obj1 = traiteMemberExpression1(element.left,niveau,element);
        if(obj1.__xst === true){
            nomVariable=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteForIn1 0709 ' ,"element" : element}));
        }
    }else{
        console.log('element.left.type=',element.left.type);
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteForIn1 0713 ' + element.left.type ,"element" : element}));
    }
    /* */
    if(element.right.type === 'Identifier'){
        nomObjet=element.right.name;
    }else if(element.right.type === 'MemberExpression'){
        var obj1 = traiteMemberExpression1(element.right,niveau,element);
        if(obj1.__xst === true){
            nomObjet=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteForIn1 0723 ' ,"element" : element}));
        }
    }else if(element.right.type === 'ThisExpression' || element.right.type === 'CallExpression'){
        var obj1 = traiteUneComposante(element.right,niveau,false,true,element);
        if(obj1.__xst === true){
            nomObjet=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteForIn1 0730 ' ,"element" : element}));
        }
    }else if(element.right.type === 'ArrayExpression'){
        var obj1 = traiteArrayExpression1(element.right,niveau + 1);
        if(obj1.__xst === true){
            nomObjet=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteForIn1 0730 ' ,"element" : element}));
        }
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteForIn1 0733 ' + element.right.type ,"element" : element}));
    }
    t+='\n' + esp0 + 'boucle_sur_objet_de(';
    t+='\n' + esp0 + esp1 + 'pourChaque(de(' + nomVariable + ' , ' + nomObjet + ')),';
    t+='\n' + esp0 + esp1 + 'faire(';
    niveau+=1;
    if(element.body){
        if(element.body.body && element.body.body.length === 0){
            /*
              contenu vide, mais il y a peut être un commentaire
            */
            if(element.body.hasOwnProperty('range')){
                positionDebutBloc=element.body.range[1];
            }else if(element.body.hasOwnProperty('start')){
                positionDebutBloc=element.body.start;
            }else{
                debugger;
            }
            t+=ajouteCommentaireAvant(element.body,niveau + 3);
        }else{
            var obj3 = TransformAstEnRev(element.body,niveau);
            if(obj3.__xst === true){
                t+=obj3.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteForIn1 152 pour ' + element.type ,"element" : element}));
            }
            if(element.body.hasOwnProperty('range')){
                positionDebutBloc=element.body.range[1];
            }else if(element.body.hasOwnProperty('start')){
                positionDebutBloc=element.body.start;
            }else{
                debugger;
            }
            t+=ajouteCommentaireAvant(element.body,niveau + 3);
        }
    }else{
        if(element.expression){
            var obj3 = traiteUneComposante(element.expression,niveau,false,false,element);
            if(obj3.__xst === true){
                t+=obj3.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteForIn1 152 pour ' + element.type ,"element" : element}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteForIn1 0580 rien à faire dans la boucle ' ,"element" : element}));
        }
    }
    niveau-=1;
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteForIn1(element,niveau){
    t+=ajouteCommentaireAvant(element,niveau);
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomVariable='';
    var nomObjet='';
    var pourInit='';
    if(element.left.type === 'VariableDeclaration'){
        var objDecl = traiteDeclaration1(element.left,niveau);
        if(objDecl.__xst === true){
            nomVariable=objDecl.__xva.replace(/\r/g,'').replace(/\n/g,'');
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteForIn1 0351 ' + element.left.type ,"element" : element}));
        }
    }else if(element.left.type === 'Identifier'){
        nomVariable=element.left.name;
    }else if(element.left.type === 'MemberExpression'){
        var obj1 = traiteMemberExpression1(element.left,niveau,element);
        if(obj1.__xst === true){
            nomVariable=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteForIn1 0318 ' ,"element" : element}));
        }
    }else{
        console.log('element.left.type=',element.left.type);
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteForIn1 0414 ' + element.left.type ,"element" : element}));
    }
    /* */
    if(element.right.type === 'Identifier'){
        nomObjet=element.right.name;
    }else if(element.right.type === 'MemberExpression'){
        var obj1 = traiteMemberExpression1(element.right,niveau,element);
        if(obj1.__xst === true){
            nomObjet=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteForIn1 0818 ' ,"element" : element}));
        }
    }else if(element.right.type === 'ThisExpression'){
        var obj1 = traiteUneComposante(element.right,niveau,false,true,element);
        if(obj1.__xst === true){
            nomObjet=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteForIn1 0826 ' ,"element" : element}));
        }
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteForIn1 0421 ' + element.right.type ,"element" : element}));
    }
    t+='\n' + esp0 + 'boucle_sur_objet_dans(';
    t+='\n' + esp0 + esp1 + 'pourChaque(dans(' + nomVariable + ' , ' + nomObjet + ')),';
    t+='\n' + esp0 + esp1 + 'faire(';
    niveau+=1;
    if(element.body){
        if(element.body.body && element.body.body.length === 0){
            /*
              contenu vide, mais il y a peut être un commentaire
            */
            if(element.body.hasOwnProperty('range')){
                positionDebutBloc=element.body.range[1];
            }else if(element.body.hasOwnProperty('start')){
                positionDebutBloc=element.body.start;
            }else{
                debugger;
            }
            t+=ajouteCommentaireAvant(element.body,niveau + 3);
        }else{
            var obj3 = TransformAstEnRev(element.body,niveau);
            if(obj3.__xst === true){
                t+=obj3.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteForIn1 152 pour ' + element.type ,"element" : element}));
            }
            if(element.body.hasOwnProperty('range')){
                positionDebutBloc=element.body.range[1];
            }else if(element.body.hasOwnProperty('start')){
                positionDebutBloc=element.body.start;
            }else{
                debugger;
            }
            t+=ajouteCommentaireAvant(element.body,niveau + 3);
        }
    }else{
        if(element.expression){
            var obj3 = traiteUneComposante(element.expression,niveau,false,false,element);
            if(obj3.__xst === true){
                t+=obj3.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteForIn1 152 pour ' + element.type ,"element" : element}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteForIn1 0580 rien à faire dans la boucle ' ,"element" : element}));
        }
    }
    niveau-=1;
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteSwitch1(element,niveau){
    var t='';
    var i=0;
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    t+='\n' + esp0 + 'bascule(';
    var obj1 = traiteUneComposante(element.discriminant,niveau,false,false,element);
    if(obj1.__xst === true){
        t+='\n' + esp0 + esp1 + 'quand(' + obj1.__xva + ')';
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteSwitch1 0548' ,"element" : element}));
    }
    for( i=0 ; i < element.cases.length ; i++ ){
        t+=',\n' + esp0 + esp1 + 'est(';
        if(element.cases[i].test !== null){
            var obj1 = traiteUneComposante(element.cases[i].test,niveau,false,false,element);
            if(obj1.__xst === true){
                t+='\n' + esp0 + esp1 + esp1 + 'valeur(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteSwitch1 0562' ,"element" : element}));
            }
        }else{
            t+='\n' + esp0 + esp1 + esp1 + 'valeurNonPrevue()';
        }
        t+=',\n' + esp0 + esp1 + esp1 + 'faire(\n';
        if(element.cases[i].consequent && element.cases[i].consequent.length > 0){
            niveau+=3;
            var obj1 = TransformAstEnRev(element.cases[i].consequent,niveau);
            niveau-=3;
            if(obj1.__xst === true){
                t+=obj1.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteSwitch1 0573' ,"element" : element}));
            }
        }
        t+='\n' + esp0 + esp1 + esp1 + ')';
        t+='\n' + esp0 + esp1 + ')';
    }
    t+='\n' + esp0 + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteWhile1(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    t+='\n' + esp0 + 'tantQue(';
    t+='\n' + esp0 + esp1 + '';
    var obj2 = js_traiteCondition1(element.test,niveau + 1,true);
    if(obj2.__xst === false){
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteWhile1 0525 pour ' + element.type ,"element" : element}));
    }
    t+='condition(' + obj2.__xva + '\n' + esp0 + esp1 + '),';
    /*un point virgule est-il en trop ?*/
    t+='\n' + esp0 + esp1 + 'faire(';
    if(element.body){
        var obj3 = TransformAstEnRev(element.body,niveau + 1);
    }else{
        if(element.expression){
            var obj3 = traiteUneComposante(element.expression,niveau + 1,false,false,element);
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteWhile1 0671 rien à faire dans la boucle ' ,"element" : element}));
        }
    }
    if(obj3.__xst === true){
        t+=obj3.__xva;
        if(element.hasOwnProperty('range')){
            positionDebutBloc=element.range[1];
        }else if(element.hasOwnProperty('start')){
            positionDebutBloc=element.start;
        }else{
            debugger;
        }
        t+=ajouteCommentaireAvant(element,niveau + 3);
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteWhile1 538 pour ' + element.type ,"element" : element}));
    }
    t+='\n' + esp0 + esp1 + '),';
    t+='\n' + esp0 + '),';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteDo1(element,niveau){
    var t='';
    var i=0;
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    var body='';
    var test='';
    if(element.body){
        var obj3 = TransformAstEnRev(element.body,niveau + 1);
    }else{
        if(element.expression){
            var obj3 = traiteUneComposante(element.expression,niveau + 1,false,false,element);
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteDo1 0671 rien à faire dans la boucle ' ,"element" : element}));
        }
    }
    if(obj3.__xst === true){
        body=obj3.__xva;
        if(element.hasOwnProperty('range')){
            positionDebutBloc=element.range[1];
        }else if(element.hasOwnProperty('start')){
            positionDebutBloc=element.start;
        }else{
            debugger;
        }
        body+=ajouteCommentaireAvant(element,niveau + 3);
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteDo1 152 pour ' + element.type ,"element" : element}));
    }
    var obj2 = js_traiteCondition1(element.test,niveau + 1,true);
    if(obj2.__xst === true){
        test=obj2.__xva;
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteDo1 238 pour ' + element.type ,"element" : element}));
    }
    t+='\n' + esp0 + 'faire_tant_que(';
    t+='\n' + esp0 + esp1 + 'instructions(' + body + ')';
    t+='\n' + esp0 + esp1 + 'condition(' + test + ')';
    t+='\n' + esp0 + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteFor1(element,niveau){
    var t='';
    var i=0;
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    var pourInit='';
    if(element.init === null){
        pourInit='';
    }else if(element.init.type === 'VariableDeclaration'){
        var objDecl = traiteDeclaration1(element.init,niveau);
        if(objDecl.__xst === true){
            if(pourInit !== ''){
                pourInit+=',';
            }
            pourInit+=objDecl.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteFor1 134 ' + element.init.type ,"element" : element}));
        }
    }else if('SequenceExpression' === element.init.type){
        var obj1 = traiteUneComposante(element.init,niveau,false,false,element);
        if(obj1.__xst === true){
            if(pourInit !== ''){
                pourInit+=',';
            }
            pourInit+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur 0000 [ todo ajuster ] '}));
        }
    }else if('AssignmentExpression' === element.init.type){
        var objass0 = traiteAssignmentExpress1(element.init,niveau,{"sansLF" : true},element);
        if(objass0.__xst === true){
            pourInit=objass0.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteFor1 248 pour ' + element.type ,"element" : element}));
        }
    }else{
        console.log('element.init.type=',element.init.type);
    }
    t+='\n' + esp0 + 'boucle(';
    t+='\n' + esp0 + esp1 + 'initialisation(' + pourInit + ')';
    t+='\n' + esp0 + esp1 + 'condition';
    if(element.test === null){
        t+='()';
    }else{
        var obj2 = js_traiteCondition1(element.test,niveau + 1,true);
        if(obj2.__xst === false){
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteFor1 238 pour ' + element.type ,"element" : element}));
        }
        t+='(' + obj2.__xva + ')';
    }
    var valeurIncrement='';
    if(element.update === null){
        valeurIncrement='';
    }else{
        if(element.update.type === 'AssignmentExpression'){
            var objass = traiteAssignmentExpress1(element.update,niveau,{"sansLF" : true},element);
            if(objass.__xst === true){
                valeurIncrement+=objass.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteFor1 0613 pour ' + element.type ,"element" : element}));
            }
        }else if(element.update.type === 'UpdateExpression'){
            var objass = traiteUpdateExpress1(element.update,niveau,{"sansLF" : true},element);
            if(objass.__xst === true){
                valeurIncrement+=objass.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteFor1 0621 pour ' + element.type ,"element" : element}));
            }
        }else if(element.update.type === 'SequenceExpression'){
            for( i=0 ; i < element.update.expressions.length ; i++ ){
                var obj1 = traiteUneComposante(element.update.expressions[i],niveau + 1,false,true,element);
                if(obj1.__xst === true){
                    if(valeurIncrement !== ''){
                        valeurIncrement+=',';
                    }
                    valeurIncrement+=obj1.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteUneComposante 0158 pour ' + element.type ,"element" : element}));
                }
            }
        }else{
            t+='TODO)';
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteFor1 0625 pour ' + element.update.type ,"element" : element}));
        }
    }
    t+='\n' + esp0 + esp1 + 'increment(' + valeurIncrement + ')';
    t+='\n' + esp0 + esp1 + 'faire(';
    if(element.body){
        var obj3 = TransformAstEnRev(element.body,niveau + 1);
    }else{
        if(element.expression){
            var obj3 = traiteUneComposante(element.expression,niveau + 1,false,false,element);
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteFor1 0671 rien à faire dans la boucle ' ,"element" : element}));
        }
    }
    if(obj3.__xst === true){
        t+=obj3.__xva;
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteFor1 152 pour ' + element.type ,"element" : element}));
    }
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteIf1(element,niveau,type){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    if(t !== ''){
        t+=',';
    }
    if(type === 'if'){
        t+='\n' + esp0 + 'choix(';
        t+='\n' + esp0 + esp1 + 'si(';
        var obj2 = js_traiteCondition1(element.test,niveau + 1,true);
        if(obj2.__xst === false){
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteIf1 135 pour ' + element.type ,"element" : element}));
        }
        t+='\n' + esp0 + esp1 + esp1 + 'condition(' + obj2.__xva + '),';
    }else{
        if(element.test){
            t+='\n' + esp0 + esp1 + 'sinonsi(';
            var obj2 = js_traiteCondition1(element.test,niveau + 1,true);
            if(obj2.__xst === false){
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteIf1 372 pour ' + element.type ,"element" : element}));
            }
            t+='\n' + esp0 + esp1 + esp1 + 'condition(' + obj2.__xva + '),';
        }else{
            t+='\n' + esp0 + esp1 + 'sinon(';
        }
    }
    t+='\n' + esp0 + esp1 + esp1 + 'alors(';
    if(element.consequent){
        if(element.consequent.body){
            if(Array.isArray(element.consequent.body) && element.consequent.body.length == 0){
                var commentaire = comm_avant_fin(element.consequent,niveau + 3);
                if(commentaire === ''){
                    /*                        plus tard, on mettre des avertissements                         //astjs_logerreur({__xst:true,__xav:'attention, un contenu de bloc if est vide, mettez un commentaire ',element:element})                      */
                }else{
                    t+=commentaire;
                }
                var obj3={"__xst" : true ,"__xva" : ''};
            }else{
                var obj3 = TransformAstEnRev(element.consequent.body,niveau + 3);
            }
        }else{
            var obj3 = TransformAstEnRev([element.consequent],niveau + 3);
        }
    }else{
        if(element.body){
            if(Array.isArray(element.body) && element.body.length == 0){
                var obj3={"__xst" : true ,"__xva" : ''};
            }else{
                var obj3 = TransformAstEnRev(element.body,niveau + 3);
            }
        }else if(element.expression){
            var obj3 = traiteUneComposante(element.expression,niveau + 3,false,false,element);
        }else{
            obj3=TransformAstEnRev(element,niveau + 3);
        }
    }
    if(obj3.__xst === true){
        t+='\n' + esp0 + esp1 + esp1 + esp1 + obj3.__xva;
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteIf1 0826 pour ' + element.type ,"element" : element}));
    }
    if(element.alternate){
        if(element.alternate.hasOwnProperty('range')){
            positionDebutBloc=element.alternate.range[0];
        }else if(element.alternate.hasOwnProperty('start')){
            positionDebutBloc=element.alternate.start;
        }else{
            debugger;
        }
        t+=ajouteCommentaireAvant(element.alternate,niveau + 3);
    }else{
        if(type === 'else'){
            /* il n'y a pas d'alternate mais il y a peut être des commentaires à la fin */
            if(element.hasOwnProperty('range')){
                positionDebutBloc=element.range[1];
            }else if(element.hasOwnProperty('start')){
                positionDebutBloc=element.start;
            }else{
                debugger;
            }
            t+=ajouteCommentaireAvant(element,niveau + 3);
        }
    }
    if(element.alternate === null){
        if(element.hasOwnProperty('range')){
            positionDebutBloc=element.range[1];
        }else if(element.hasOwnProperty('start')){
            positionDebutBloc=element.start;
        }else{
            debugger;
        }
        t+=ajouteCommentaireAvant(element,niveau + 3);
    }
    t+='\n' + esp0 + esp1 + esp1 + ')';
    t+='\n' + esp0 + esp1 + ')';
    if(element.alternate){
        var obj3 = traiteIf1(element.alternate,niveau,'else');
        if(obj3.__xst === true){
            t+=obj3.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteIf1 170 pour ' + element.type ,"element" : element}));
        }
    }
    if(type === 'if'){
        t+='\n' + esp0 + ')';
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteCallExpression1(element,niveau,parent,opt){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    var parentProperty='';
    if(parent.property){
        if(parent.computed && parent.computed === true){
            /*                le parent est un tableau => les propriétés sont les indices du tableau              */
        }else{
            if(parent.property.type === 'Identifier'){
                parentProperty='prop(' + parent.property.name + ')';
            }else if(parent.property.type === 'Literal'){
                parentProperty='prop(' + parent.property.raw + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 0514 ' + parent.property.type ,"element" : element}));
            }
        }
    }
    if(opt['sansLF']){
        LF='';
        esp0='';
        esp1='';
    }
    var contenu='';
    var le_contenu='';
    if(element.body){
        var obj = TransformAstEnRev(element.body,niveau + 2);
        if(obj.__xst === true){
            contenu=obj.__xva;
            if(contenu !== ''){
                le_contenu=',contenu(' + contenu + ')';
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 pour body' ,"element" : element}));
        }
    }
    var lesArguments='';
    if(element.arguments && element.arguments.length > 0){
        var i=0;
        for( i=0 ; i < element.arguments.length ; i++ ){
            lesArguments+=',';
            if('CallExpression' === element.arguments[i].type){
                var obj1 = traiteCallExpression1(element.arguments[i],niveau + 1,element,{"sansLF" : true});
                if(obj1.__xst === true){
                    if(obj1.__xva.substr(0,6) === 'defTab'){
                        lesArguments+='p(' + obj1.__xva + ')';
                    }else if(obj1.__xva.substr(0,6) === 'appelf'){
                        lesArguments+='p(' + obj1.__xva + ')';
                    }else if(false && obj1.__xva.substr(0,7) === '(appelf'){
                        if(obj1.__xva.indexOf('auto_appelee(1)') >= 0){
                            debugger;
                            obj1.__xva=obj1.__xva.replace(/auto_appelee\(1\),/g,'');
                        }
                        lesArguments+='p(' + obj1.__xva + ')';
                    }else{
                        lesArguments+='p(' + 'appelf(' + obj1.__xva + '))';
                    }
                }else{
                    console.error('Dans traiteCallExpression1 element=',element);
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteCallExpression1 479 ' ,"element" : element}));
                }
            }else{
                var obj1 = traiteUneComposante(element.arguments[i],niveau + 1,false,false,element);
                if(obj1.__xst === true){
                    if(element.hasOwnProperty('range')){
                        positionDebutBloc=element.range[0];
                    }else if(element.hasOwnProperty('start')){
                        positionDebutBloc=element.start;
                    }else{
                        debugger;
                    }
                    var le_commentaire = ajouteCommentaireAvant(element.arguments[i],niveau);
                    if('FunctionExpression' === element.arguments[i].type
                     && parent
                     && parent.callee
                     && parent.callee.type
                     && parent.callee.type === 'FunctionExpression'){
                        console.log('%c ajouter des parenthèses pour les arguments ','color:red;background:pink;');
                        lesArguments+='p(' + le_commentaire + '' + obj1.__xva + '),#(auto_appelee(2))';
                    }else{
                        lesArguments+='p(' + le_commentaire + '' + obj1.__xva + ')';
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 0722' ,"element" : element}));
                }
            }
        }
    }
    if(lesArguments === ''){
        lesArguments=parentProperty;
    }else{
        if(parentProperty !== ''){
            lesArguments=lesArguments + ',' + parentProperty;
        }
    }
    var laPropriete='';
    var prefixe='';
    if(element.callee){
        if(element.callee.property){
            if(element.callee.property.type === 'Identifier'
             || element.callee.property.type === 'PrivateIdentifier'
             || element.callee.property.type === 'Literal'
            ){
                var nom_de_la_fonction='';
                if(element.callee.property.type === 'Literal'){
                    nom_de_la_fonction='cst(' + element.callee.property.raw + ')';
                }else{
                    if(element.callee.property.type === 'PrivateIdentifier'){
                        nom_de_la_fonction='#' + element.callee.property.name;
                    }else{
                        nom_de_la_fonction=element.callee.property.name;
                    }
                }
                if(element.callee.object && element.callee.object.type === 'Identifier'){
                    if(element.callee.property.type === 'Literal'){
                        /* a['Symbol.iterator'](); => appelf(nomf(tableau(nomt(a),p('element.callee.property')))) */
                        if(element.callee.object.type === 'Identifier'){
                            if(element.callee.hasOwnProperty('computed') && element.callee.computed === true){
                                t+='appelf(nomf(tableau(nomt(' + element.callee.object.name + '),p(' + element.callee.property.raw + '))))';
                            }else{
                                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1411 ' ,"element" : element}));
                            }
                        }
                    }else{
                        t+='appelf(element(' + element.callee.object.name + '),nomf(' + nom_de_la_fonction + ')' + lesArguments + le_contenu + ')';
                    }
                }else if(element.callee.object && element.callee.object.type === 'Literal'){
                    t+='appelf(element(' + element.callee.object.raw + '),nomf(' + nom_de_la_fonction + ')' + lesArguments + le_contenu + ')';
                }else if(element.callee.object && element.callee.object.type === 'ArrayExpression'){
                    var obj1 = traiteArrayExpression1(element.callee.object,niveau);
                    if(obj1.__xst === true){
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : '1395 erreur dans traiteCallExpression1 ' ,"element" : element}));
                    }
                    t+='appelf(element(' + obj1.__xva + '),nomf(' + nom_de_la_fonction + ')' + lesArguments + le_contenu + ')';
                }else{
                    if(element.callee.object
                     && element.callee.object.type === 'MemberExpression'
                     && !(element.callee.object.object
                     && element.callee.object.property
                     && element.callee.object.object.type === 'Identifier'
                     && element.callee.object.property.type === 'Identifier')
                    ){
                        var obj1 = traiteMemberExpression1(element.callee.object,niveau,element);
                        if(obj1.__xst === true){
                            t+='appelf(element(' + obj1.__xva + '),nomf(' + nom_de_la_fonction + ')' + lesArguments + le_contenu + ')';
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 485 ' ,"element" : element}));
                        }
                    }else{
                        if(contenu === ''){
                            if(element.callee.property.name){
                                laPropriete='prop(appelf(nomf(' + nom_de_la_fonction + ')' + lesArguments + '))';
                            }else if(element.callee.property.type === 'ConditionalExpression'){
                                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1235 ' ,"element" : element}));
                            }
                        }else{
                            console.error('\n\nATTENTION VERIFIER CECI\n\n');
                            laPropriete='#(verifier convertit_js_en-rev 1230 ),prop(appelf(nomf(' + nom_de_la_fonction + ')' + lesArguments + ',contenu(' + contenu + ')))';
                        }
                    }
                }
            }else if(element.callee.property.type === 'MemberExpression'){
                /*                    ce sera traité plus bas dans le                     if(element.callee.object){                  */
            }else if(element.callee.property.type === 'Literal'){
                debugger;
            }else if(element.callee.property.type === 'ConditionalExpression'){
                var obj1 = traiteConditionalExpression1(element.callee.property,niveau + 1);
                if(obj1.__xst === true){
                    if(element.callee.hasOwnProperty('computed') && element.callee.computed === true){
                        if(element.callee.object.type === 'MemberExpression'){
                            var obj2 = traiteMemberExpression1(element.callee.object,niveau,element.callee);
                            if(obj2.__xst === true){
                                t+='appelf(nomf(tableau(nomt(' + obj2.__xva + '),p(' + obj1.__xva + ')))' + lesArguments + le_contenu + ')';
                            }else{
                                return(astjs_logerreur({"__xst" : false ,"__xme" : '1494 erreur dans traiteCallExpression1 pour "' + element.callee.property.type + '"' ,"element" : element}));
                            }
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : '1497 erreur dans traiteCallExpression1 pour "' + element.callee.property.type + '"' ,"element" : element}));
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : '1500 erreur dans traiteCallExpression1 pour "' + element.callee.property.type + '"' ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : '1504 erreur dans traiteCallExpression1 pour "' + element.callee.property.type + '"' ,"element" : element}));
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 0887 pour "' + element.callee.property.type + '"' ,"element" : element}));
            }
        }
        if(element.callee.object){
            if(element.callee.object.type === 'CallExpression'){
                var obj1 = traiteCallExpression1(element.callee.object,niveau,element,{});
                if(obj1.__xst === true){
                    if(obj1.__xva.substr(0,6) === 'appelf' && obj1.__xva.substr(obj1.__xva.length - 1,1) === ')'){
                        t+='' + (obj1.__xva.substr(0,obj1.__xva.length - 1)) + ',' + laPropriete + ')';
                    }else{
                        if(contenu === ''){
                            t+='appelf(' + obj1.__xva + ',' + laPropriete + ')';
                        }else{
                            t+='appelf(' + obj1.__xva + ',' + laPropriete + ',contenu(' + contenu + '))';
                        }
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 0900 ' ,"element" : element}));
                }
            }else if(element.callee.object.type === 'ArrayExpression'){
                console.log('%ctraité plus haut ' + t,'background:lightblue;color:navy;');
                /* traité plus haut */
            }else if(element.callee.object.type === 'MemberExpression'){
                var obj1 = traiteMemberExpression1(element.callee.object,niveau,element);
                if(obj1.__xst === false){
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 485 ' ,"element" : element}));
                }
                prefixe='';
                if(element.callee.property.type === 'PrivateIdentifier'){
                    prefixe='#';
                }
                if(element.callee.object.object
                 && element.callee.object.property
                 && element.callee.object.object.type === 'Identifier'
                 && element.callee.object.property.type === 'Identifier'
                ){
                    if(contenu === ''){
                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ')';
                    }else{
                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ',contenu(' + contenu + '))';
                    }
                }else{
                    /*
                      Traité plus haut en repère xxx001    
                    */
                }
            }else if(element.callee.object.type === 'Identifier'){
                var nom_de_l_objet=element.callee.object.name;
                if(element.callee.property && element.callee.property.type === 'MemberExpression'){
                    var obj = traiteMemberExpression1(element.callee.property,niveau,element.callee);
                    if(obj.__xst === true){
                        if(element.callee.hasOwnProperty('computed') && element.callee.computed === true){
                            /* a[Symbol.iterator](); => appelf(nomf(a[Symbol.iterator])) */
                            t+='appelf(nomf(' + nom_de_l_objet + '[' + obj.__xva + '])' + lesArguments + '' + le_contenu + ')';
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : '1539 erreur dans traiteCallExpression1 ' + element.callee.property.type ,"element" : element}));
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : '1538 erreur dans traiteCallExpression1 ' + element.callee.property.type ,"element" : element}));
                    }
                }
            }else if(element.callee.object.type === 'Literal'){
                /* le traitement a été fait plus haut */
            }else if(element.callee.object.type === 'ThisExpression'){
                prefixe='';
                if(element.callee.property.type === 'PrivateIdentifier'){
                    prefixe='#';
                }
                if(contenu === ''){
                    t='appelf(element(this),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ')';
                }else{
                    t='appelf(element(this),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ',contenu(' + contenu + '))';
                }
            }else if(element.callee.object.type === 'ImportExpression'){
                if(element.callee.object.source){
                    if(element.callee.object.source.type === 'Literal'){
                        lesArguments='p(' + element.callee.object.source.raw + ')';
                    }else if(element.callee.object.source.type === 'Identifier'){
                        lesArguments='p(' + element.callee.object.source.name + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1230 type de source inconnu pour l\'import ' + element.callee.object.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1230 pas de source en import ' + element.callee.object.type ,"element" : element}));
                }
                if(contenu === ''){
                    t='appelf(nomf(import),' + lesArguments + ',' + laPropriete + ')';
                }else{
                    t='appelf(nomf(import),' + lesArguments + ',' + laPropriete + ',contenu(' + contenu + '))';
                }
            }else if(element.callee.object.type === 'Super'){
                t='appelf(nomf(super),' + lesArguments + ',' + laPropriete + ')';
            }else if(element.callee.object.type === 'NewExpression'){
                var obj1 = traiteUneComposante(element.callee.object,niveau,false,false,element);
                if(obj1.__xst === true){
                    t=(obj1.__xva.substr(0,obj1.__xva.length - 2)) + ',' + lesArguments + ',' + laPropriete + '))';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1385' ,"element" : element}));
                }
            }else if(element.callee.object.type === 'BinaryExpression'){
                var obj1 = traiteUneComposante(element.callee.object,niveau,false,false,element);
                if(obj1.__xst === true){
                    t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1366 ' + element.callee.object.type ,"element" : element}));
                }
            }else if(element.callee.object.type === 'FunctionExpression'){
                var obj1 = traiteFunctionExpression1(element.callee.object,niveau,element,'');
                if(obj1.__xst === true){
                    t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                }
            }else if(element.callee.object.type === 'LogicalExpression'){
                var obj1 = traiteUneComposante(element.callee.object,niveau,false,false,element);
                if(obj1.__xst === true){
                    t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                }
            }else if(element.callee.object.type === 'AssignmentExpression'){
                var obj1 = traiteUneComposante(element.callee.object,niveau,false,false,element);
                if(obj1.__xst === true){
                    t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 0618 ' + element.callee.object.type ,"element" : element}));
            }
        }else if(element.callee.type === 'Identifier'){
            if(element.callee.name === 'Array' && laPropriete === ''){
                if(lesArguments.length > 0 && lesArguments.substr(0,1) === ','){
                    lesArguments=lesArguments.substr(1);
                }
                t+='defTab(' + lesArguments + ')';
            }else{
                if(contenu === ''){
                    t+='appelf(nomf(' + element.callee.name + ')' + lesArguments + laPropriete + ')';
                }else{
                    t+='appelf(nomf(' + element.callee.name + ')' + lesArguments + laPropriete + ',contenu(' + contenu + '))';
                }
            }
        }else if(element.callee.type === 'CallExpression'){
            var obj1 = traiteUneComposante(element.callee,niveau,false,false,element);
            if(obj1.__xst === true){
                t='appelf(nomf(' + obj1.__xva + ')' + lesArguments + le_contenu + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1417 ' + element.callee.type ,"element" : element}));
            }
        }else if(element.callee.type === 'SequenceExpression'){
            var obj1 = traiteUneComposante(element.callee,niveau,false,false,element);
            if(obj1.__xst === true){
                t='appelf(nomf(' + obj1.__xva + ')' + lesArguments + le_contenu + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1417 ' + element.callee.type ,"element" : element}));
            }
        }else if(element.callee.type === 'FunctionExpression'){
            var obj1 = traiteFunctionExpression1(element.callee,niveau,element,'');
            if(obj1.__xst === true){
                if(contenu === ''){
                    /*
                      console.log('element=',element)
                      console.log('parent=',parent)
                      console.log('parent.callee=',parent.callee)
                    */
                    if(obj1.__xva.substr(0,6) === 'appelf'){
                        console.log('%cajouter des parenthèses ','color:red;background:yellow;','element.callee=',element.callee);
                        /* cas (function() {var g=1;})(); */
                        t+='(appelf(#(auto_appelee(1)),auto_appelee(1),nomf(' + obj1.__xva + ')' + lesArguments + laPropriete + '))';
                    }else{
                        t+='appelf(nomf(' + obj1.__xva + ')' + lesArguments + laPropriete + ')';
                    }
                }else{
                    t+='appelf(nomf(' + obj1.__xva + ')' + lesArguments + laPropriete + ',contenu(' + contenu + '))';
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
            }
        }else if(element.callee.type === 'ConditionalExpression'){
            var obj1 = traiteConditionalExpression1(element.callee,niveau + 1);
            if(obj1.__xst === true){
                t='appelf(nomf(' + obj1.__xva + ')' + lesArguments + le_contenu + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0108 ' ,"element" : element}));
            }
        }else if(element.callee.type === 'Super'){
            t+='appelf(nomf(super)' + lesArguments + laPropriete + ')';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 0933 ' + element.callee.type ,"element" : element}));
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteFunctionExpression1(element,niveau){
    var t='';
    var lesArguments='';
    var contenu='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if(element.params && element.params.length > 0){
        var i=0;
        for( i=0 ; i < element.params.length ; i++ ){
            lesArguments+=',';
            if('Identifier' === element.params[i].type){
                lesArguments+='p(' + (comm_avant_debut(element.params[i],niveau)) + element.params[i].name + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteFunctionExpression1 1054 ' ,"element" : element}));
            }
        }
    }
    if(element.body){
        niveau+=2;
        var obj = TransformAstEnRev(element.body,niveau);
        if(obj.__xst === true){
            contenu=obj.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteFunctionExpression1 pour body' ,"element" : element}));
        }
        niveau-=2;
    }
    if(element.id){
        if(element.id.type === "Identifier"){
            t='appelf(id(' + element.id.name + '),nomf(function) ' + lesArguments + ',contenu(' + contenu + '))';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteFunctionExpression1 pour element.id.type=' + element.id.type ,"element" : element}));
        }
    }else{
        t='appelf(nomf(function) ' + lesArguments + ',contenu(' + contenu + '))';
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteArrayExpression1(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var ne_contient_que_des_constantes=true;
    var nombre_elements=0;
    var format_constante='';
    t+='defTab(';
    var lesPar='';
    var i={};
    for(i in element.elements){
        if(element.elements[i].type === 'Literal'){
            lesPar+=',p(' + element.elements[i].raw + ')';
            if(element.elements[i].raw.substr(0,1) === '\''
             || element.elements[i].raw.substr(0,1) === '"'
             || element.elements[i].raw.substr(0,1) === '/'
            ){
                ne_contient_que_des_constantes=false;
            }
            format_constante+='[' + element.elements[i].raw + ']';
            nombre_elements++;
        }else if(element.elements[i].type === 'Identifier'){
            lesPar+=',p(' + element.elements[i].name + ')';
            format_constante+='[' + element.elements[i].name + ']';
            nombre_elements++;
        }else if(element.elements[i].type === "SpreadElement"){
            if(element.elements[i].argument.type === "MemberExpression"){
                var obj1 = traiteMemberExpression1(element.elements[i].argument,niveau,element);
                if(obj1.__xst === true){
                    ne_contient_que_des_constantes=false;
                    lesPar+=',p(...' + obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteObjectExpression1 1651 pour ' + eval.__xva.type ,"element" : element}));
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteObjectExpression1 1655 pour ' + eval.__xva.type ,"element" : element}));
            }
        }else if(element.elements[i].type === 'ArrayExpression'){
            var obj1 = traiteArrayExpression1(element.elements[i],niveau);
            if(obj1.__xst === true){
                ne_contient_que_des_constantes=false;
                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteArrayExpression1 567 ' ,"element" : element}));
            }
        }else if(element.elements[i].type === 'MemberExpression'){
            var obj1 = traiteMemberExpression1(element.elements[i],niveau,element);
            if(obj1.__xst === true){
                ne_contient_que_des_constantes=false;
                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteObjectExpression1 0799 pour ' + eval.__xva.type ,"element" : element}));
            }
        }else if(element.elements[i].type === 'CallExpression'){
            var obj1 = traiteCallExpression1(element.elements[i],element,{},'');
            if(obj1.__xst === true){
                ne_contient_que_des_constantes=false;
                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteObjectExpression1 0799 pour ' + eval.__xva.type ,"element" : element}));
            }
        }else if(element.elements[i].type === "FunctionExpression"){
            var obj1 = traiteFunctionExpression1(element.elements[i],niveau,element,'');
            if(obj1.__xst === true){
                ne_contient_que_des_constantes=false;
                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteArrayExpression1 1103 ' ,"element" : element}));
            }
        }else if(element.elements[i].type === "NewExpression"
         || element.elements[i].type === "ConditionalExpression"
         || element.elements[i].type === "BinaryExpression"
         || element.elements[i].type === "UnaryExpression"
         || element.elements[i].type === "ObjectExpression"){
            var obj1 = traiteUneComposante(element.elements[i],niveau,true,false,element);
            if(obj1.__xst === true){
                ne_contient_que_des_constantes=false;
                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteArrayExpression1 1111' ,"element" : element}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : '1388 erreur dans traiteArrayExpression1 "' + element.elements[i].type + '"' ,"element" : element.elements[i]}));
        }
    }
    if(lesPar.length >= 0){
        lesPar=lesPar.substr(1);
    }
    t+=lesPar + ')';
    if(t === 'appelf(nomf(Array))'){
        t='[]';
    }else{
        if(ne_contient_que_des_constantes === true && nombre_elements <= 1){
            t=format_constante === '' ? ( '[]' ) : ( format_constante );
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteObjectExpression1(element,niveau){
    var t='';
    var i={};
    t+=ajouteCommentaireAvant(element,niveau);
    for(i in element.properties){
        if(t !== ''){
            t+=',';
        }
        if(element.properties[i].hasOwnProperty('range')){
            positionDebutBloc=element.properties[i].range[0];
        }else if(element.hasOwnProperty('start')){
            positionDebutBloc=element.properties[i].start;
        }else{
            debugger;
        }
        t+=ajouteCommentaireAvant(element,niveau);
        var val=element.properties[i];
        if(val.key.type === 'Identifier'){
            t+='(' + val.key.name + ',';
        }else if(val.key.type === 'Literal'){
            t+='(' + val.key.raw + ',';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteObjectExpression1 609 ' + val.key.type ,"element" : element}));
        }
        /*
          //     || 'AssignmentExpression'  === val.value.type
          //     || 'NewExpression'         === val.value.type
          //     || 'SequenceExpression'    === val.value.type
          //     || 'TemplateLiteral'       === val.value.type
          //     || 'ThisExpression'        === val.value.type     
          //     || 'UpdateExpression'      === val.value.type
          //     || 'UnaryExpression'       === val.value.type
          //     || 'VariableDeclarator'    === val.value.type
        */
        if('ArrayExpression' === val.value.type
         || 'BinaryExpression' === val.value.type
         || 'CallExpression' === val.value.type
         || 'ConditionalExpression' === val.value.type
         || 'FunctionExpression' === val.value.type
         || 'Identifier' === val.value.type
         || 'Literal' === val.value.type
         || 'LogicalExpression' === val.value.type
         || 'MemberExpression' === val.value.type
         || 'ObjectExpression' === val.value.type
         || 'NewExpression' === val.value.type
         || 'TemplateLiteral' === val.value.type
         || 'ThisExpression' === val.value.type
         || 'UnaryExpression' === val.value.type
         || 'UpdateExpression' === val.value.type){
            var obj1 = traiteUneComposante(val.value,niveau + 1,false,false,val);
            if(obj1.__xst === true){
                t+=obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur 0000 [ todo ajuster ] '}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : '1894 erreur dans traiteObjectExpression1  ' + val.value.type ,"element" : element}));
        }
    }
    t='obj(' + t + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function recupProp(property){
    var t='';
    if(property){
        if(property.type === 'BinaryExpression'){
            var obj1 = traiteBinaryExpress1(property,niveau,false,false);
            if(obj1.__xst === true){
                t+=obj1.__xva;
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1572 pour ' + property.type ,"element" : property}));
            }
        }else if(property.type === 'Identifier'){
            t+=property.name;
        }else if(property.type === 'PrivateIdentifier'){
            t+='#' + property.name + '';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1548  pour ' + property.type ,"element" : property}));
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteMemberExpression1(element,niveau,parent){
    var t='';
    if(element.computed === false){
        var objTxt='';
        var propertyTxt='';
        if(element.object){
            if(element.object.type === 'MemberExpression'){
                var obj1 = traiteMemberExpression1(element.object,niveau,element);
                if(obj1.__xst === true){
                    objTxt=obj1.__xva;
                    var prop = recupProp(element.property);
                    if(prop.__xst === true){
                        if(prop.__xva !== ''){
                            if(objTxt.substr(0,8) === 'tableau('){
                                t+=(objTxt.substr(0,objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                            }else{
                                if(objTxt.substr(0,6) === 'appelf'){
                                    if(objTxt.indexOf('prop(') >= 0){
                                        objTxt=(objTxt.substr(0,objTxt.length - 2)) + '.' + prop.__xva + '))';
                                        t=objTxt;
                                    }else{
                                        objTxt=(objTxt.substr(0,objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                                        t=objTxt;
                                    }
                                }else if(objTxt.substr(0,8) === 'tableau('){
                                    if(objTxt.indexOf('prop(') >= 0){
                                        objTxt=(objTxt.substr(0,objTxt.length - 2)) + '.' + prop.__xva + '))';
                                        t=objTxt;
                                    }else{
                                        debugger;
                                        if(objTxt.substr(objTxt.length - 1,1) === ']'){
                                            t=objTxt + '.' + prop.__xva;
                                        }else{
                                            objTxt=(objTxt.substr(0,objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                                            t=objTxt;
                                        }
                                    }
                                }else{
                                    t+=objTxt + '.' + prop.__xva;
                                }
                            }
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1528 pour ' + element.object.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1526 pour ' + element.type ,"element" : element}));
                }
            }else if(element.object.type === 'Identifier'){
                objTxt=element.object.name;
                var prop = recupProp(element.property);
                if(prop.__xst === true){
                    if(prop.__xva !== ''){
                        t+=element.object.name + '.' + prop.__xva;
                    }else{
                        t+=element.object.name;
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1528 pour ' + element.object.type ,"element" : element}));
                }
            }else if(element.object.type === 'CallExpression'){
                var obj1 = traiteCallExpression1(element.object,element,{},'');
                if(obj1.__xst === true){
                    objTxt=obj1.__xva;
                    var prop = recupProp(element.property);
                    if(prop.__xst === true){
                        if(prop.__xva !== ''){
                            t+=(objTxt.substr(0,objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1574 pour ' + element.object.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1530 pour ' + element.object.type ,"element" : element}));
                }
            }else if(element.object.type === "ThisExpression"){
                objTxt='this';
                var prop = recupProp(element.property);
                if(prop.__xst === true){
                    if(prop.__xva !== ''){
                        t+=objTxt + '.' + prop.__xva;
                    }else{
                        t+=objTxt;
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1528 pour ' + element.object.type ,"element" : element}));
                }
            }else if(element.object.type === "Super"){
                objTxt='super';
                var prop = recupProp(element.property);
                if(prop.__xst === true){
                    if(prop.__xva !== ''){
                        t+=objTxt + '.' + prop.__xva;
                    }else{
                        t+=objTxt;
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1528 pour ' + element.object.type ,"element" : element}));
                }
            }else if(element.object.type === "ArrayExpression"){
                var obj1 = traiteArrayExpression1(element.object,niveau);
                if(obj1.__xst === true){
                    objTxt=obj1.__xva;
                    var prop = recupProp(element.property);
                    if(prop.__xst === true){
                        if(prop.__xva !== ''){
                            /* attention, pour un tableau, on peut avoir en retour un [xxx] à la place d'un defTab(xxx) */
                            if(objTxt.substr(0,1) === '['){
                                if(prop.__xva.indexOf('(') < 0){
                                    t+=objTxt + '.' + prop.__xva;
                                }else{
                                    debugger;
                                    return(astjs_logerreur({"__xst" : false ,"__xme" : '2020 ajouter un appel à traiteArrayExpression1 en forçant un retour de type defTab ' ,"element" : element}));
                                }
                            }else{
                                t+=(objTxt.substr(0,objTxt.length - 1)) + 'prop(' + prop.__xva + '))';
                            }
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1574 pour ' + element.object.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteMemberExpression1 1710'}));
                }
            }else if(element.object.type === "ObjectExpression"){
                var obj1 = traiteObjectExpression1(element.object,niveau);
                if(obj1.__xst === true){
                    objTxt=obj1.__xva;
                    var prop = recupProp(element.property);
                    if(prop.__xst === true){
                        if(prop.__xva !== ''){
                            t+=(objTxt.substr(0,objTxt.length - 1)) + 'prop(' + prop.__xva + '))';
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1912 pour ' + element.object.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1916 pour ' + element.object.type ,"element" : element}));
                }
            }else if(element.object.type === "AssignmentExpression"){
                var objass = traiteAssignmentExpress1(element.object,niveau + 1,{"sansLF" : true},parent);
                if(objass.__xst === true){
                    objTxt=objass.__xva;
                    var prop = recupProp(element.property);
                    if(prop.__xst === true){
                        if(prop.__xva !== ''){
                            t+=(objTxt.substr(0,objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 2082 pour ' + element.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 1020 pour ' + element.type ,"element" : element}));
                }
            }else if(element.object.type === "LogicalExpression"){
                var objass = traiteLogicalExpression1(element.object,niveau + 1,true);
                if(objass.__xst === true){
                    objTxt=objass.__xva;
                    var prop = recupProp(element.property);
                    if(prop.__xst === true){
                        if(prop.__xva !== ''){
                            t+=(objTxt.substr(0,objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : '2119 erreur traiteLogicalExpression1  pour ' + element.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : '2123 erreur traiteLogicalExpression1  pour ' + element.type ,"element" : element}));
                }
            }else if(element.object.type === "ConditionalExpression"){
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1897 : veuillez réécrire cette ligne ' + element.object.type ,"element" : element}));
            }else if(element.object.type === "Literal"){
                /* exemple : 'xxx'.length */
                objTxt=element.object.raw;
                var prop = recupProp(element.property);
                if(prop.__xst === true){
                    if(prop.__xva !== ''){
                        var membre = 'membre(' + objTxt + ',' + 'prop(' + prop.__xva + '))';
                        console.log('%c utilisation de membre=' + membre,'background:lightgreen;color:navy;');
                        /*                        t+=objTxt.substr[0,objTxt.length - 1] + ',prop[' + prop.__xva + ']]'; */
                        t+=membre;
                    }else{
                        t+=objTxt;
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : '2119 erreur traiteLogicalExpression1  pour ' + element.type ,"element" : element}));
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1523 pour ' + element.object.type ,"element" : element}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1517 pour ' + element.type ,"element" : element}));
        }
    }else if(element.computed === true){
        var objTxt='';
        var propertyTxt='';
        if(element.object){
            if(element.object.type === 'Identifier'){
                objTxt=element.object.name;
            }else if(element.object.type === 'MemberExpression'){
                var obj1 = traiteMemberExpression1(element.object,niveau,element);
                if(obj1.__xst === true){
                    objTxt=obj1.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1526 pour ' + element.type ,"element" : element}));
                }
            }else if(element.object.type === "CallExpression"){
                var obj1 = traiteCallExpression1(element.object,niveau,element,{});
                if(obj1.__xst === true){
                    objTxt=obj1.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1316 pour ' + element.object.type ,"element" : element}));
                }
            }else if(element.object.type === "ThisExpression"){
                var objass = traiteUneComposante(element.object,niveau,false,false,element);
                if(objass.__xst === true){
                    objTxt=objass.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1993 pour ' + element.object.type ,"element" : element}));
                }
            }else if(element.object.type === "LogicalExpression"){
                var objass = traiteUneComposante(element.object,niveau,false,false,element);
                if(objass.__xst === true){
                    objTxt='condition(' + objass.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1993 pour ' + element.object.type ,"element" : element}));
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1582 pour ' + element.object.type ,"element" : element}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1520 pas d\'objet pour ' + element.type ,"element" : element}));
        }
        if(element.property){
            var obj1 = traiteUneComposante(element.property,niveau,true,false,element);
            if(obj1.__xst === true){
                if(element.object.type === 'Identifier' || element.object.type === 'MemberExpression'){
                    if(obj1.__xva.substr(0,5) === 'plus(' || obj1.__xva.substr(0,6) === 'moins('){
                        /*
                          on essaie de mettre un arr(i+1)(j+1) à la place d'un                      
                          tableau(nomt(tableau(nomt(arr) , p(plus(i , 1)))),p(plus(j , 1)))
                        */
                        var obj_nom_tableau = functionToArray(objTxt,true,true,'');
                        if(obj_nom_tableau.__xst === true && obj_nom_tableau.__xva.length === 2 && obj_nom_tableau.__xva[1][2] === 'c'){
                            /*
                              le nom du tableau est une constante
                            */
                            var obj_indice_tableau = functionToArray(obj1.__xva,true,true,'');
                            if(obj_indice_tableau.__xst === true
                             && obj_indice_tableau.__xva.length === 4
                             && obj_indice_tableau.__xva[2][2] === 'c'
                             && obj_indice_tableau.__xva[3][2] === 'c'
                            ){
                                if(obj1.__xva.substr(0,5) === 'plus('){
                                    t+='' + objTxt + '[' + obj_indice_tableau.__xva[2][1] + '+' + obj_indice_tableau.__xva[3][1] + ']';
                                }else if(obj1.__xva.substr(0,6) === 'moins('){
                                    t+='' + objTxt + '[' + obj_indice_tableau.__xva[2][1] + '-' + obj_indice_tableau.__xva[3][1] + ']';
                                }else{
                                    t+='tableau(nomt(' + objTxt + '),p(' + obj1.__xva + '))';
                                }
                            }else{
                                t+='tableau(nomt(' + objTxt + '),p(' + obj1.__xva + '))';
                            }
                        }else{
                            t+='tableau(nomt(' + objTxt + '),p(' + obj1.__xva + '))';
                        }
                    }else{
                        t+='tableau(nomt(' + objTxt + '),p(' + obj1.__xva + '))';
                    }
                }else{
                    t+='tableau(nomt(' + objTxt + '),p(' + obj1.__xva + '))';
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1572 pour ' + element.type ,"element" : element}));
            }
        }else{
            t=objTxt;
        }
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteMemberExpression1 1512 pour ' + element.type ,"element" : element}));
    }
    if(t.substr(0,8) === 'tableau('){
        var o = functionToArray(t,true,false,'');
        if(o.__xst === true){
            if(o.__xva[2][1] === 'nomt' && o.__xva[2][8] === 1 && o.__xva[3][2] === 'c'){
                var i=0;
                var bcont=true;
                var cumChaine='';
                for( i=4 ; i < o.__xva.length && bcont === true ; i++ ){
                    if(o.__xva[i][7] === 1){
                        if(o.__xva[i][1] === 'p' && o.__xva[i+1][2] === 'c'){
                            if(o.__xva[i+1][4] !== 0){
                                bcont=false;
                                break;
                            }else if(o.__xva[i+1][4] === 2){
                                bcont=false;
                                break;
                            }else{
                                cumChaine+='[' + (maConstante(o.__xva[i+1])) + ']';
                            }
                        }else{
                            bcont=false;
                            break;
                        }
                    }
                }
                if(bcont){
                    t=o.__xva[3][1] + cumChaine;
                }
            }
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteUpdateExpress1(element,niveau,opt,parent){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if(opt['sansLF']){
        LF='';
        esp0='';
        esp1='';
    }
    var elem='';
    if(element.argument.type === 'Identifier' && parent.type === "ForStatement" && parent.update.type === "UpdateExpression"){
        /* cas simples de for(i=0;i<j;i++){} */
        if('++' === element.operator && element.prefix === false){
            t+=element.argument.name + '++';
        }else if('--' === element.operator && element.prefix === false){
            t+=element.argument.name + '--';
        }else if('++' === element.operator && element.prefix === true){
            t+='++' + element.argument.name;
        }else if('--' === element.operator && element.prefix === true){
            t+='--' + element.argument.name;
        }
        return({"__xst" : true ,"__xva" : t});
    }
    var obj = traiteUneComposante(element.argument,niveau,false,false,element);
    if(obj.__xst === true){
        elem=obj.__xva;
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteUpdateExpress1 1707 ' + element.type ,"element" : element}));
    }
    if('++' === element.operator && element.prefix === false){
        t+='postinc(' + elem + ')';
    }else if('--' === element.operator && element.prefix === false){
        t+='postdec(' + elem + ')';
    }else if('++' === element.operator && element.prefix === true){
        t+='preinc(' + elem + ')';
    }else if('--' === element.operator && element.prefix === true){
        t+='predec(' + elem + ')';
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteAssignmentPattern(element,niveau,opt){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if(opt['sansLF']){
        LF='';
        esp0='';
        esp1='';
    }else{
        t+=ajouteCommentaireAvant(element,niveau);
    }
    if(element.left && element.right){
        var objgauche = traiteUneComposante(element.left,niveau + 1,false,false,element);
        var objdroite = traiteUneComposante(element.right,niveau + 1,false,false,element);
        if(objgauche.__xst === true && objdroite.__xst){
            t+=objgauche.__xva + ',defaut(' + objdroite.__xva + ')';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentPattern 1558 pour ' + element.type ,"element" : element}));
        }
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentPattern 1554 pour ' + element.type ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteAssignmentExpress1(element,niveau,opt,parent){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if(opt['sansLF']){
        LF='';
        esp0='';
        esp1='';
    }else{
        t+=ajouteCommentaireAvant(element,niveau);
    }
    var valeurLeft='';
    if(element.left && element.left.type === 'Identifier'){
        if(element.operator === '='){
            valeurLeft=(LF + esp0) + 'affecte(' + element.left.name + ' , ';
        }else{
            valeurLeft=(LF + esp0) + 'affectop(\'' + element.operator + '\' , ' + element.left.name + ' , ';
        }
        if(element.right && element.right.type === 'Literal'){
            t+=(valeurLeft + element.right.raw) + ')';
        }else if(element.right && element.right.type === 'MemberExpression'){
            var obj1 = traiteMemberExpression1(element.right,niveau + 1,element);
            if(obj1.__xst === true){
                t+=(valeurLeft + obj1.__xva) + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 301 pour ' + element.type ,"element" : element}));
            }
        }else if(element.right && element.right.type === 'BinaryExpression'){
            obj1=traiteBinaryExpress1(element.right,niveau + 1,false,false);
            if(obj1.__xst === true){
                t+=(valeurLeft + obj1.__xva) + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 452 pour ' + element.type ,"element" : element}));
            }
        }else if(element.right && element.right.type === 'CallExpression'){
            var obj1 = traiteCallExpression1(element.right,niveau + 1,element,{"sansLF" : true});
            if(obj1.__xst === true){
                if(obj1.__xva.substr(0,8) === '(appelf('){
                    t+=(valeurLeft + obj1.__xva.substr(1,obj1.__xva.length - 2)) + ')';
                }else{
                    t+=(valeurLeft + obj1.__xva) + ')';
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteAssignmentExpress1 780 ' + element.type ,"element" : element}));
            }
        }else if(element.right && element.right.type === 'Identifier'){
            t+=(valeurLeft + element.right.name) + ')';
        }else if(element.right && element.right.type === 'UnaryExpression'){
            var nomDuTestUnary = recupNomOperateur(element.right.operator);
            var nomDuTest = recupNomOperateur(element.operator);
            if(element.right
             && typeof element.right.argument.name !== 'undefined'
             && element.right.type === 'UnaryExpression'
             && element.right.argument.type === 'Identifier'
             && (element.right.operator === '-'
             || element.right.operator === '+')){
                t+=(valeurLeft + element.right.operator + element.right.argument.name) + ')';
            }else if(element.right && element.right.type === 'Literal' && element.right.argument.type === 'Identifier'){
                t+=(valeurLeft + nomDuTest) + '(' + nomDuTestUnary + '(' + element.right.argument.name + ')' + ',' + element.right.raw + '))';
            }else if((element.right.operator === '-' || element.right.operator === '+') && element.right.argument.type === 'Literal'){
                t+=(valeurLeft + element.right.operator) + '' + element.right.argument.raw + ')';
            }else if((element.right.operator === '-' || element.right.operator === '+') && element.right.argument.type === 'Identifiel'){
                t+=(valeurLeft + element.right.operator) + '' + element.right.argument.name + ')';
            }else if((element.right.operator === '+' || element.right.operator === '-') && element.right.argument.type === 'CallExpression'){
                var obj1 = traiteCallExpression1(element.right.argument,niveau + 1,element.right,{"sansLF" : true});
                if(obj1.__xst === true){
                    t+=(valeurLeft + nomDuTestUnary) + '(' + obj1.__xva + '))';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteAssignmentExpress1 780 ' + element.type ,"element" : element}));
                }
            }else if(element.right.operator === '!' && element.right.argument.type === 'CallExpression'){
                var obj1 = traiteCallExpression1(element.right.argument,niveau + 1,element.right,{"sansLF" : true});
                if(obj1.__xst === true){
                    t+=valeurLeft + 'condition(non(' + obj1.__xva + '))' + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteAssignmentExpress1 780 ' + element.type ,"element" : element}));
                }
            }else if(element.right.operator === 'void'){
                var objass = traiteUneComposante(element.right.argument,niveau + 1,false,false,element);
                if(objass.__xst === true){
                    t+=valeurLeft + 'appelf(nomf(void),p(' + objass.__xva + ')))';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 1965 pour ' + element.argument.type ,"element" : element}));
                }
            }else{
                var objass = traiteUneComposante(element.right,niveau + 1,false,false,element);
                if(objass.__xst === true){
                    t+=(valeurLeft + objass.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 2311 pour ' + element.argument.type ,"element" : element}));
                }
            }
        }else if(element.right && element.right.type === 'AssignmentExpression'){
            var objass = traiteAssignmentExpress1(element.right,niveau + 1,{"sansLF" : true},element);
            if(objass.__xst === true){
                t+=(valeurLeft + objass.__xva) + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 1020 pour ' + element.type ,"element" : element}));
            }
        }else if(element.right && element.right.type === 'ObjectExpression'){
            var obj1 = traiteObjectExpression1(element.right,niveau + 1);
            if(obj1.__xst === true){
                t+=(valeurLeft + obj1.__xva) + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1027' ,"element" : element}));
            }
        }else if(element.right && element.right.type === 'LogicalExpression'){
            var obj1 = traiteLogicalExpression1(element.right,niveau + 1,true);
            if(obj1.__xst === true){
                t+=valeurLeft + 'condition(' + obj1.__xva + '))';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1181' ,"element" : element}));
            }
        }else if(element.right && element.right.type === 'ConditionalExpression'){
            var obj1 = traiteConditionalExpression1(element.right,niveau + 1);
            if(obj1.__xst === true){
                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                console.error('erreur traiteAssignmentExpress1 1347 element=',element);
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 1347 pour ' + element.right.type ,"element" : element}));
            }
        }else if(element.right && element.right.type === 'ArrayExpression'){
            var obj1 = traiteArrayExpression1(element.right,niveau + 1);
            if(obj1.__xst === true){
                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1422'}));
            }
        }else if(element.right && element.right.type === 'FunctionExpression'){
            var obj1 = traiteFunctionExpression1(element.right,niveau + 1,element,'');
            if(obj1.__xst === true){
                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 0147 ' ,"element" : element}));
            }
        }else if(element.right && element.right.type === 'ThisExpression'){
            t+=valeurLeft + 'this)';
        }else if(element.right && element.right.type === 'SequenceExpression'){
            var obj1 = traiteUneComposante(element.right,niveau + 1,false,false,element);
            if(obj1.__xst === true){
                t+='(' + valeurLeft + '' + obj1.__xva + '))';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1385' ,"element" : element}));
            }
        }else if(element.right && (element.right.type === 'NewExpression' || element.right.type === 'TemplateLiteral')){
            var obj1 = traiteUneComposante(element.right,niveau + 1,false,false,element);
            if(obj1.__xst === true){
                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1385' ,"element" : element}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 1023 pour ' + element.right.type ,"element" : element}));
        }
    }else if(element.left && element.left.type === 'MemberExpression'){
        var obj2 = traiteMemberExpression1(element.left,niveau + 1,element);
        if(obj2.__xst === true){
            if(element.operator === '='){
                t=(LF + esp0) + 'affecte(' + obj2.__xva + ' , ';
            }else{
                t=(LF + esp0) + 'affectop(\'' + element.operator + '\' , ' + obj2.__xva + ' , ';
            }
            if(element.right && element.right.type === 'Literal'){
                t+=element.right.raw + ')';
            }else if(element.right && element.right.type === 'Identifier'){
                t+=element.right.name + ')';
            }else if(element.right && element.right.type === 'MemberExpression'){
                var obj1 = traiteMemberExpression1(element.right,niveau + 1,element);
                if(obj1.__xst === true){
                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 318 pour ' + element.type ,"element" : element}));
                }
            }else if('BinaryExpression' === element.right.type){
                obj1=traiteBinaryExpress1(element.right,niveau + 1,false,false);
                if(obj1.__xst === true){
                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 452 pour ' + element.type ,"element" : element}));
                }
            }else if('FunctionExpression' === element.right.type){
                var obj1 = traiteFunctionExpression1(element.right,niveau + 1,element,'');
                if(obj1.__xst === true){
                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                }
            }else if('CallExpression' === element.right.type){
                var obj1 = traiteCallExpression1(element.right,niveau + 1,element,{"sansLF" : true});
                if(obj1.__xst === true){
                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteAssignmentExpress1 1232 ' + element.type ,"element" : element}));
                }
            }else if('LogicalExpression' === element.right.type){
                var obj1 = traiteLogicalExpression1(element.right,niveau + 1,false);
                if(obj1.__xst === true){
                    t+='condition(' + obj1.__xva + '))';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1493 ' ,"element" : element}));
                }
            }else if('ArrayExpression' === element.right.type){
                var obj1 = traiteArrayExpression1(element.right,niveau + 1);
                if(obj1.__xst === true){
                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1500' ,"element" : element}));
                }
            }else if('ObjectExpression' === element.right.type){
                var obj1 = traiteObjectExpression1(element.right,niveau + 1);
                if(obj1.__xst === true){
                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 534' ,"element" : element}));
                }
            }else if('ConditionalExpression' === element.right.type
             || 'NewExpression' === element.right.type
             || 'UnaryExpression' === element.right.type
             || "AssignmentExpression" === element.right.type
             || "SequenceExpression" === element.right.type
             || "ThisExpression" === element.right.type
             || "UpdateExpression" === element.right.type){
                var obj1 = traiteUneComposante(element.right,niveau + 1,false,false,element);
                if(obj1.__xst === true){
                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1515' ,"element" : element}));
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 1223 pour ' + element.right.type ,"element" : element}));
            }
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 305 pour ' + element.type ,"element" : element}));
        }
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentExpress1 214 pour ' + element.type ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteExpression1(element,niveau,parent){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    if('ExpressionStatement' === element.type){
        if('ExpressionStatement' === element.expression.type){
            var objexp1 = traiteExpression1(element.expression,niveau + 1,element);
            if(objexp1.__xst === false){
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteExpression1 1134 ' + element.type ,"element" : element}));
            }
            t+=objexp1.__xva;
        }else if('Literal' === element.expression.type && element.directive){
            if(element.directive === 'use strict'){
                t+='useStrict()';
            }else{
                t+='directive("' + (element.directive.replace(/"/g,'\\"')) + '")';
            }
        }else if('AssignmentExpression' === element.expression.type
         || 'BinaryExpression' === element.expression.type
         || 'CallExpression' === element.expression.type
         || 'ConditionalExpression' === element.expression.type
         || 'Identifier' === element.expression.type
         || 'Literal' === element.expression.type
         || 'LogicalExpression' === element.expression.type
         || 'MemberExpression' === element.expression.type
         || 'NewExpression' === element.expression.type
         || 'SequenceExpression' === element.expression.type
         || 'UpdateExpression' === element.expression.type
         || 'UnaryExpression' === element.expression.type){
            var obj1 = traiteUneComposante(element.expression,niveau + 1,false,false,element.expression);
            if(obj1.__xst === false){
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteExpression1 928 ' + element.type ,"element" : element}));
            }
            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteExpression1 1124 pour ' + element.expression.type ,"element" : element}));
        }
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteExpression1 1037 pour ' + element.type ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteDeclaration1(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomVariable='';
    t+=ajouteCommentaireAvant(element,niveau);
    var decl={};
    for(decl in element.declarations){
        if(t !== ''){
            t+=',';
        }
        var debutDeclaration='';
        if(element.kind && element.kind === 'var'){
            debutDeclaration='\n' + esp0 + 'declare(' + element.declarations[decl].id.name + ' , ';
        }else if(element.kind && element.kind === 'const'){
            debutDeclaration='\n' + esp0 + 'declare_constante(' + element.declarations[decl].id.name + ' , ';
        }else if(element.kind && element.kind === 'let'){
            debutDeclaration='\n' + esp0 + 'declare_variable(' + element.declarations[decl].id.name + ' , ';
        }else{
            debutDeclaration='\n' + esp0 + 'declare(' + element.declarations[decl].id.name + ' , ';
        }
        nomVariable=element.declarations[decl].id.name;
        if(element.declarations[decl].init){
            if('Literal' === element.declarations[decl].init.type){
                t+=(debutDeclaration + element.declarations[decl].init.raw) + ')';
            }else if('Identifier' === element.declarations[decl].init.type){
                t+=(debutDeclaration + element.declarations[decl].init.name) + ')';
            }else if('MemberExpression' === element.declarations[decl].init.type){
                var obj1 = traiteMemberExpression1(element.declarations[decl].init,niveau + 1,element.declarations[decl]);
                if(obj1.__xst === true){
                    t+=(debutDeclaration + obj1.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteDeclaration1 928 ' + element.type ,"element" : element}));
                }
            }else if('CallExpression' === element.declarations[decl].init.type){
                var obj1 = traiteCallExpression1(element.declarations[decl].init,niveau + 1,element,{});
                if(obj1.__xst === true){
                    t+=(debutDeclaration + obj1.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteDeclaration1 935 ' + element.type ,"element" : element}));
                }
            }else if('ObjectExpression' === element.declarations[decl].init.type){
                var obj1 = traiteObjectExpression1(element.declarations[decl].init,niveau + 1);
                if(obj1.__xst === true){
                    t+=(debutDeclaration + obj1.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteDeclaration1 534' ,"element" : element}));
                }
            }else if('UnaryExpression' === element.declarations[decl].init.type){
                var nomDuTestUnary = recupNomOperateur(element.declarations[decl].init.operator);
                if(element.declarations[decl].init.argument){
                    if(element.declarations[decl].init.argument.type === 'Literal'){
                        if(nomDuTestUnary === 'plus' || nomDuTestUnary === 'moins'){
                            t+=(debutDeclaration + (nomDuTestUnary === 'plus' ? ( '+' ) : ( '-' )) + element.declarations[decl].init.argument.raw) + ')';
                        }else{
                            t+=(debutDeclaration + nomDuTestUnary) + '(' + element.declarations[decl].init.argument.raw + '))';
                        }
                    }else if(element.declarations[decl].init.argument.type === 'Identifier'){
                        if(nomDuTestUnary === 'plus' || nomDuTestUnary === 'moins'){
                            t+=(debutDeclaration + (nomDuTestUnary === 'plus' ? ( '+' ) : ( '-' )) + element.declarations[decl].init.argument.name) + ')';
                        }else{
                            t+=(debutDeclaration + nomDuTestUnary) + '(' + element.declarations[decl].init.argument.name + '))';
                        }
                    }else if(element.declarations[decl].init.argument.type === 'BinaryExpression'){
                        var obj1 = traiteBinaryExpress1(element.declarations[decl].init.argument,niveau + 1,false,false);
                        if(obj1.__xst === true){
                            t+=(debutDeclaration + nomDuTestUnary) + '(' + obj1.__xva + '))';
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteDeclaration1 2626 ' ,"element" : element}));
                        }
                    }else if(element.declarations[decl].init.argument.type === 'CallExpression'){
                        var obj1 = traiteCallExpression1(element.declarations[decl].init.argument,niveau + 1,element,{});
                        if(obj1.__xst === true){
                            t+=(debutDeclaration + nomDuTestUnary) + '(' + obj1.__xva + '))';
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pas de callee dans traiteDeclaration1 2594' ,"element" : element}));
                        }
                    }else if(element.declarations[decl].init.argument.type === 'LogicalExpression'){
                        var obj1 = traiteLogicalExpression1(element.declarations[decl].init.argument,niveau + 1,false);
                        if(obj1.__xst === true){
                            t+=(debutDeclaration + nomDuTestUnary) + '(' + obj1.__xva + '))';
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pas de callee dans traiteDeclaration1 2721' ,"element" : element}));
                        }
                    }else if(element.declarations[decl].init.argument.type === 'NewExpression'){
                        var obj1 = traiteCallExpression1(element.declarations[decl].init.argument,niveau + 1,element,{});
                        if(obj1.__xst === true){
                            t+=(debutDeclaration + nomDuTestUnary) + '(new(' + obj1.__xva + ')))';
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteDeclaration1 1551 ' + element.type ,"element" : element}));
                        }
                    }else if(element.declarations[decl].init.argument.type === 'MemberExpression'
                     || element.declarations[decl].init.argument.type === 'UnaryExpression'
                    ){
                        var obj1 = traiteUneComposante(element.declarations[decl].init.argument,niveau + 1,false,false,element);
                        if(obj1.__xst === true){
                            t+=(debutDeclaration + nomDuTestUnary) + '(' + obj1.__xva + '))';
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pas de callee dans traiteDeclaration1 2721' ,"element" : element}));
                        }
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pas de callee dans traiteDeclaration1 2590 pour "' + element.declarations[decl].init.argument.type + '"' ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pas de callee dans traiteDeclaration1 2602' ,"element" : element}));
                }
            }else if('LogicalExpression' === element.declarations[decl].init.type){
                var obj = traiteLogicalExpression1(element.declarations[decl].init,niveau + 1,false);
                if(obj.__xst === true){
                    if(obj.__xva.substr(0,1) === ','){
                        t+=debutDeclaration + 'condition(' + (obj.__xva.substr(1)) + '))';
                    }else{
                        t+=debutDeclaration + 'condition(' + obj.__xva + '))';
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCondition1 1545 '}));
                }
            }else if('NewExpression' === element.declarations[decl].init.type){
                var obj1 = traiteCallExpression1(element.declarations[decl].init,niveau + 1,element,{});
                if(obj1.__xst === true){
                    t+=debutDeclaration + 'new(' + obj1.__xva + '))';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour traiteDeclaration1 1551 ' + element.type ,"element" : element}));
                }
            }else if('ArrayExpression' === element.declarations[decl].init.type){
                var obj1 = traiteArrayExpression1(element.declarations[decl].init,niveau + 1);
                if(obj1.__xst === true){
                    t+=(debutDeclaration + obj1.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteDeclaration1 1559' ,"element" : element}));
                }
            }else if('BinaryExpression' === element.declarations[decl].init.type){
                var obj1 = traiteBinaryExpress1(element.declarations[decl].init,niveau + 1,false,false);
                if(obj1.__xst === true){
                    t+=debutDeclaration + '' + obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteDeclaration1 1568 ' ,"element" : element}));
                }
            }else if('ConditionalExpression' === element.declarations[decl].init.type){
                var obj1 = traiteConditionalExpression1(element.declarations[decl].init,niveau + 1);
                if(obj1.__xst === true){
                    t+=(debutDeclaration + obj1.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteDeclaration1 1662 ' ,"element" : element}));
                }
            }else if('TemplateLiteral' === element.declarations[decl].init.type){
                var obj1 = traiteTemplateLiteral1(element.declarations[decl].init,niveau + 1);
                if(obj1.__xst === true){
                    t+=(debutDeclaration + obj1.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteDeclaration1 1662 ' ,"element" : element}));
                }
            }else if('FunctionExpression' === element.declarations[decl].init.type){
                var obj1 = traiteFunctionExpression1(element.declarations[decl].init,niveau + 1,element.declarations[decl],'');
                if(obj1.__xst === true){
                    t+=(debutDeclaration + obj1.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                }
            }else if('SequenceExpression' === element.declarations[decl].init.type
             || 'UpdateExpression' === element.declarations[decl].init.type
             || "ThisExpression" === element.declarations[decl].init.type
             || "AssignmentExpression" === element.declarations[decl].init.type
             || "AwaitExpression" === element.declarations[decl].init.type){
                var obj1 = traiteUneComposante(element.declarations[decl],niveau + 1,false,false,element);
                if(obj1.__xst === true){
                    t+=(debutDeclaration + obj1.__xva) + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteArrayExpression1 1111' ,"element" : element}));
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteDeclaration1 1565 ' + element.declarations[decl].init.type ,"element" : element}));
            }
        }else{
            t+=debutDeclaration + 'null())';
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteTemplateLiteral1(element,niveau){
    var t='';
    if(element.quasis
     && element.quasis.length === 1
     && 'TemplateElement' === element.quasis[0].type
     && element.quasis[0].value
     && element.quasis[0].value.raw){
        t='`' + element.quasis[0].value.raw + '`';
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteTemplateLiteral1 2131 ' + element.type ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function traiteTry1(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    t+='\n' + esp0 + 'essayer(';
    t+='\n' + esp0 + esp1 + 'faire(';
    var obj = TransformAstEnRev(element.block.body,niveau + 2);
    if(obj.__xst === true){
        t+='\n' + esp0 + esp1 + esp1 + esp1 + obj.__xva;
    }else{
        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour ' + element.type ,"element" : element}));
    }
    t+='\n' + esp0 + esp1 + '),';
    t+='\n' + esp0 + esp1 + 'sierreur(';
    if(element.handler && element.handler.type === 'CatchClause'){
        if(element.handler.param && element.handler.param.type === 'Identifier'){
            t+='\n' + esp0 + esp1 + esp1 + element.handler.param.name + ',';
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteTry1 1021, il manque le nom de la variable capturant l\'erreur : erreur pour ' + element.type ,"element" : element}));
        }
        if(element.handler.body && element.handler.body.type === 'BlockStatement'){
            var obj = TransformAstEnRev(element.handler.body,niveau + 2);
            if(obj.__xst === true){
                t+='\n' + esp0 + esp1 + esp1 + 'faire(';
                if(obj.__xva === ''){
                    t+=')';
                }else{
                    t+='\n' + esp0 + esp1 + esp1 + esp1 + obj.__xva;
                    t+='\n' + esp0 + esp1 + esp1 + ')';
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour ' + element.type ,"element" : element}));
            }
        }
    }
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function comm_avant_fin(elem,niveau){
    var t='';
    if(elem.hasOwnProperty('range')){
        positionDebutBloc=elem.range[1];
    }else if(elem.hasOwnProperty('end')){
        positionDebutBloc=elem.end;
    }else{
        debugger;
    }
    var commentaire = ajouteCommentaireAvant(elem,niveau + 1);
    if(commentaire !== ''){
        t=commentaire;
        /*
          t+=(commentaire.trim().replace(/\n/g,' ').replace(/\r/g,' ').trim()) + ',';
        */
    }
    return t;
}
/*
  =====================================================================================================================
*/
function comm_avant_debut(elem,niveau){
    var t='';
    if(elem.hasOwnProperty('range')){
        positionDebutBloc=elem.range[0];
    }else if(elem.hasOwnProperty('start')){
        positionDebutBloc=elem.start;
    }else{
        debugger;
    }
    var commentaire = ajouteCommentaireAvant(elem,niveau + 1);
    if(commentaire !== ''){
        t+=(commentaire.trim().replace(/\n/g,' ').replace(/\r/g,' ').trim()) + ',';
    }
    return t;
}
/*
  =====================================================================================================================
*/
function ajouteCommentaireAvant(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var i = tabComment.length - 1;
    for( i=tabComment.length - 1 ; i >= 0 ; i=i - 1 ){
        if(tabComment[i].type === 'Block'){
            if(tabComment[i].hasOwnProperty('range')){
                if(tabComment[i].range[1] <= positionDebutBloc){
                    /*
                      Attention, ici on remonte le tableau de caractères
                      donc on ajoute le précédent après en changeant les parenthèses en []
                    */
                    var txtComment=tabComment[i].value;
                    var c1 = nbre_caracteres2('(',txtComment);
                    var c2 = nbre_caracteres2(')',txtComment);
                    if(c1 === c2){
                        if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                            t='\n' + esp0 + '#(#' + (txtComment.substr(1)) + ')' + t;
                        }else{
                            t='\n' + esp0 + '#(' + txtComment + ')' + t;
                        }
                    }else{
                        if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                            t='\n' + esp0 + '#(#' + (txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']')) + ')' + t;
                        }else{
                            t='\n' + esp0 + '#(' + (txtComment.replace(/\(/g,'[').replace(/\)/g,']')) + ')' + t;
                        }
                    }
                    tabComment.splice(i,1);
                }
            }else{
                debugger;
            }
        }
    }
    return t;
}
var positionDebutBloc=0;
var positionDebutBlocSuivant=0;
/*
  =====================================================================================================================
*/
function TransformAstEnRev(les_elements,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    if(!(Array.isArray(les_elements))){
        les_elements=[les_elements];
    }
    if(les_elements.length){
        var i=0;
        for( i=0 ; i < les_elements.length ; i++ ){
            var element=les_elements[i];
            if(i < les_elements.length - 1){
                if(les_elements[i+1].hasOwnProperty('range')){
                    positionDebutBlocSuivant=les_elements[i+1].range[0];
                }else if(les_elements[i+1].hasOwnProperty('start')){
                    positionDebutBlocSuivant=les_elements[i+1].start;
                }else{
                    debugger;
                }
            }
            if(element.hasOwnProperty('range')){
                positionDebutBloc=element.range[0];
            }else if(element.hasOwnProperty('start')){
                positionDebutBloc=element.start;
            }else{
                debugger;
            }
            t+=ajouteCommentaireAvant(element,niveau);
            var bodyTrouve=false;
            if(t !== ''){
                t+=',';
            }
            if(element.type === 'FunctionDeclaration'){
                t+='\n' + esp0 + 'fonction(';
                t+='\n' + esp0 + esp1 + 'definition(';
                t+='\n' + esp0 + esp1 + esp1 + 'nom(' + element.id.name + ')';
                if(element.async && element.async === true){
                    t+='\n' + esp0 + esp1 + esp1 + 'asynchrone()';
                }
                if(element.params && element.params.length > 0){
                    t+=',';
                    var j=0;
                    for( j=0 ; j < element.params.length ; j++ ){
                        if(element.params[j].type === "Identifier"){
                            t+='\n' + esp0 + esp1 + esp1 + 'argument(';
                            t+=comm_avant_debut(element.params[j],niveau);
                            t+=element.params[j].name;
                            t+=')';
                        }else if(element.params[j].type === "AssignmentPattern"){
                            var obj = traiteAssignmentPattern(element.params[j],niveau + 1,{});
                            if(obj.__xst === true){
                                t+='\n' + esp0 + esp1 + esp1 + 'argument(';
                                t+=comm_avant_debut(element.params[j],niveau);
                                t+=obj.__xva;
                                t+=')';
                            }else{
                                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2101 type argument non prévu ' + element.params[j].type ,"element" : element}));
                            }
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2053 type argument non prévu ' + element.params[j].type ,"element" : element}));
                        }
                        if(j < element.params.length - 1){
                            t+=',';
                        }
                    }
                }
                t+='\n' + esp0 + esp1 + '),';
                t+='\n' + esp0 + esp1 + 'contenu(';
                var prop={};
                for(prop in element){
                    if(prop === 'body'){
                        bodyTrouve=true;
                        var obj = TransformAstEnRev(element[prop],niveau + 1);
                        if(obj.__xst === true){
                            t+=obj.__xva;
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 229 ' + element.type ,"element" : element}));
                        }
                    }
                }
                t+='\n' + esp0 + esp1 + ')';
                t+='\n' + esp0 + ')';
            }else if(element.type === 'VariableDeclaration'){
                var objDecl = traiteDeclaration1(element,niveau);
                if(objDecl.__xst === true){
                    t+=objDecl.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 471 ' + element.type ,"element" : element}));
                }
            }else if('IfStatement' === element.type){
                var objif = traiteIf1(element,niveau + 1,'if');
                if(objif.__xst === true){
                    t+=objif.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 261 ' + element.type ,"element" : element}));
                }
            }else if('ForInStatement' === element.type){
                var objFor = traiteForIn1(element,niveau + 1);
                if(objFor.__xst === true){
                    t+=objFor.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2442 ' + element.type ,"element" : element}));
                }
            }else if('ForOfStatement' === element.type){
                var objFor = traiteForOf1(element,niveau + 1);
                if(objFor.__xst === true){
                    t+=objFor.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2442 ' + element.type ,"element" : element}));
                }
            }else if('DoWhileStatement' === element.type){
                var objDo = traiteDo1(element,niveau + 1);
                if(objDo.__xst === true){
                    t+=objDo.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 02449 ' + element.type ,"element" : element}));
                }
            }else if('WhileStatement' === element.type){
                var objWhile = traiteWhile1(element,niveau + 1);
                if(objWhile.__xst === true){
                    t+=objWhile.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 1929 ' + element.type ,"element" : element}));
                }
            }else if('ForStatement' === element.type){
                var objFor = traiteFor1(element,niveau + 1);
                if(objFor.__xst === true){
                    t+=objFor.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2457 ' + element.type ,"element" : element}));
                }
            }else if('ExpressionStatement' === element.type){
                var objexp1 = traiteExpression1(element,niveau + 1,les_elements);
                if(objexp1.__xst === true){
                    t+='\n' + esp0 + objexp1.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 1036 ' + element.type ,"element" : element}));
                }
            }else if('ReturnStatement' === element.type){
                if(element.argument === null){
                    t+='\n' + esp0 + 'revenir()';
                }else if(element.argument && element.argument.type === 'CallExpression'){
                    var obj1 = traiteCallExpression1(element.argument,niveau + 1,element,{"sansLF" : true});
                    if(obj1.__xst === true){
                        if(obj1.__xva.indexOf('auto_appelee(1)') >= 0){
                            console.log('%con retire les fonctions auto appelées dans un return','background:red;color:white;');
                            obj1.__xva=obj1.__xva.replace(/auto_appelee\(1\),/g,'');
                        }
                        t+='\n' + esp0 + 'retourner(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur TransformAstEnRev 1221 ' ,"element" : element}));
                    }
                }else if(element.argument && element.argument.type === 'ObjectExpression'){
                    var obj1 = traiteObjectExpression1(element.argument,niveau + 1);
                    if(obj1.__xst === true){
                        t+='\n' + esp0 + 'retourner(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans TransformAstEnRev 1963' ,"element" : element}));
                    }
                }else if(element.argument
                 && (element.argument.type === 'SequenceExpression'
                 || element.argument.type === 'ArrayExpression'
                 || element.argument.type === 'ArrowFunctionExpression'
                 || element.argument.type === 'AssignmentExpression'
                 || element.argument.type === 'FunctionExpression'
                 || element.argument.type === 'ConditionalExpression'
                 || element.argument.type === 'LogicalExpression'
                 || element.argument.type === 'Identifier'
                 || element.argument.type === 'Literal'
                 || element.argument.type === 'BinaryExpression'
                 || element.argument.type === 'MemberExpression'
                 || element.argument.type === 'NewExpression'
                 || element.argument.type === 'UnaryExpression')
                ){
                    var obj1 = traiteUneComposante(element.argument,niveau,false,false,element);
                    if(obj1.__xst === true){
                        t+='\n' + esp0 + 'retourner(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans TransformAstEnRev 1978 ' ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : '1044 erreur pour TransformAstEnRev ' + element.argument.type ,"element" : element}));
                }
            }else if('TryStatement' === element.type){
                var objtry1 = traiteTry1(element,niveau);
                if(objtry1.__xst === true){
                    t+=objtry1.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 1055 ' + element.type ,"element" : element}));
                }
            }else if('BreakStatement' === element.type){
                if(element.label !== null){
                    if(element.label.type === 'Identifier'){
                        t+='\n' + esp0 + 'break(' + element.label.name + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 3242 ' + element.type ,"element" : element}));
                    }
                }else{
                    t+='\n' + esp0 + 'break()';
                }
            }else if('DebuggerStatement' === element.type){
                t+='\n' + esp0 + 'debugger()';
            }else if('ContinueStatement' === element.type){
                t+='\n' + esp0 + 'continue()';
            }else if('ThrowStatement' === element.type){
                if(element.argument.type === 'Identifier'){
                    t+='\n' + esp0 + 'throw(' + element.argument.name + ')';
                }else if(element.argument.type === 'Literal'){
                    t+='\n' + esp0 + 'throw(' + element.argument.raw + ')';
                }else if(element.argument.type === 'CallExpression'){
                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{});
                    if(obj1.__xst === true){
                        t+='\n' + esp0 + 'throw(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 1994 ' + element.argument.type ,"element" : element}));
                    }
                }else if(element.argument.type === 'NewExpression'){
                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{});
                    if(obj1.__xst === true){
                        t+='\n' + esp0 + 'throw(new(' + obj1.__xva + '))';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 1994 ' + element.argument.type ,"element" : element}));
                    }
                }else if(element.argument.type === 'SequenceExpression' || 'ConditionalExpression' === element.argument.type){
                    var obj1 = traiteUneComposante(element.argument,niveau,false,false,element);
                    if(obj1.__xst === true){
                        t+='\n' + esp0 + 'throw(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 1994 ' + element.argument.type ,"element" : element}));
                    }
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 2185 "' + element.argument.type + '"' ,"element" : element}));
                }
            }else if('EmptyStatement' === element.type){
                t+='\n' + esp0 + '#(un point virgule est-il en trop ?)';
            }else if('SwitchStatement' === element.type){
                var objSwitch = traiteSwitch1(element,niveau);
                if(objSwitch.__xst === true){
                    t+=objSwitch.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour TransformAstEnRev 1972 ' + element.type ,"element" : element}));
                }
            }else if('BlockStatement' === element.type){
                if(Array.isArray(element.body) && element.body.length === 0){
                    t+='';
                }else{
                    var obj = TransformAstEnRev(element.body,niveau + 1);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : '3109 erreur TransformAstEnRev BlockStatement ' ,"element" : element}));
                    }
                }
            }else if('ClassDeclaration' === element.type){
                var nom_de_la_classe='';
                var super_classe='';
                var corps_de_la_classe='';
                if(element.id){
                    if("Identifier" === element.id.type){
                        nom_de_la_classe=element.id.name;
                    }else{
                        astjs_logerreur({"__xst" : false ,"__xme" : 'erreur2289 le nom de la classe n\'est pas un identifiant ' + element.id.type ,"element" : element});
                    }
                }else{
                    astjs_logerreur({"__xst" : false ,"__xme" : 'erreur2288 il manque id pour la définition de la classe ' + element.type ,"element" : element});
                }
                if(element.body && element.body.type === "ClassBody" && element.body.body && element.body.body.length > 0){
                    var j=0;
                    for( j=0 ; j < element.body.body.length ; j++ ){
                        var obj = TransformAstEnRev(element.body.body[j],niveau + 1);
                        if(obj.__xst === true){
                            corps_de_la_classe+=obj.__xva;
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : '2308 erreur pour le corps de la classe ' ,"element" : element}));
                        }
                    }
                }
                t+='definition_de_classe(nom_classe(' + nom_de_la_classe + '),contenu(' + corps_de_la_classe + '))';
            }else if('MethodDefinition' === element.type
             || "PropertyDefinition" === element.type
             || "ExportNamedDeclaration" === element.type
            ){
                var obj1 = traiteUneComposante(element,niveau,false,false,null);
                if(obj1.__xst === true){
                    t+=obj1.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0076' ,"element" : element}));
                }
            }else if('LabeledStatement' === element.type){
                var obj1 = traiteUneComposante(element,niveau,false,false,element);
                if(obj1.__xst === true){
                    t+='\n' + esp0 + obj1.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans TransformAstEnRev 1978 ' ,"element" : element}));
                }
            }else{
                astjs_logerreur({"__xst" : false ,"__xme" : '0922 erreur pour ' + element.type ,"element" : element});
                console.error('non pris en compte element.type=' + element.type,element);
                var prop={};
                for(prop in element){
                    if(prop === 'body'){
                        bodyTrouve=true;
                        var obj = TransformAstEnRev(element[prop],niveau + 1);
                        if(obj.__xst === true){
                            t+=obj.__xva;
                        }else{
                            return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour ' + element.type ,"element" : element}));
                        }
                    }
                }
            }
        }
    }else{
        if(les_elements.type === 'BlockStatement'){
            if(les_elements.body){
                var obj = TransformAstEnRev(les_elements.body,niveau + 1);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur pour ' + les_elements ,"element" : element}));
                }
            }else{
                console.log('Pas de body pour ' + les_elements.type);
            }
        }else{
            /*
              on ne devrait plus passer par ici
            */
            console.log('%cRRRRRAAAAAAAAHHHHHHH','background:yellow;color;red;');
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function transform_source_js_en_rev_avec_acorn(source,options){
    var parseur_javascript=window.acorn.Parser;
    try{
        tabComment=[];
        var obj = parseur_javascript.parse(source,{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tabComment});
        if(obj === ''){
            t='';
        }else if(obj.hasOwnProperty('body') && Array.isArray(obj.body) && obj.body.length === 0){
            t='';
        }else{
            var startMicro = performance.now();
            var obj0 = TransformAstEnRev(obj.body,0);
            if(obj0.__xst === true){
                if(options.hasOwnProperty('en_ligne') && options.en_ligne === true){
                    sauvegarder_js_en_ligne(obj0.__xva,options.donnees);
                }else if(options.nom_de_la_text_area_rev){
                    document.getElementById(options.nom_de_la_text_area_rev).value=obj0.__xva;
                    var obj1 = functionToArray(obj0.__xva,true,false,'');
                    if(obj1.__xst === true){
                        var endMicro = performance.now();
                        astjs_logerreur({"__xst" : true ,"__xme" : 'pas d\'erreur pour le rev ' + (parseInt((endMicro - startMicro) * 1000,10) / 1000) + ' ms'});
                        var resJs = parseJavascript0(obj1.__xva,1,0);
                        if(resJs.__xst === true){
                            var tableau1 = iterateCharacters2(obj0.__xva);
                            var matriceFonction = functionToArray2(tableau1.out,true,false,'');
                            if(matriceFonction.__xst === true){
                                var obj2 = arrayToFunct1(matriceFonction.__xva,true,false);
                                if(obj2.__xst === true){
                                    document.getElementById(options.nom_de_la_text_area_rev).value=obj2.__xva;
                                }else{
                                    document.getElementById(options.nom_de_la_text_area_rev).value=obj0.__xva;
                                }
                            }else{
                                document.getElementById(options.nom_de_la_text_area_rev).value=obj0.__xva;
                            }
                            if(document.getElementById('txtar3')){
                                document.getElementById('txtar3').value=resJs.__xva;
                            }
                        }else{
                            document.getElementById(options.nom_de_la_text_area_rev).value=obj0.__xva;
                            astjs_logerreur({"__xst" : true ,"__xme" : '2586 erreur de conversion de rev en javascript'});
                            __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar2');
                            return;
                        }
                    }else{
                        document.getElementById(options.nom_de_la_text_area_rev).value=obj0.__xva;
                    }
                }
            }else{
                logerreur({"__xst" : false ,"__xme" : 'erreur transform_source_js_en_rev_avec_acorn 3375'});
            }
        }
    }catch(e){
        console.error('e=',e);
        if(e.pos){
            logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 3382' ,"plage" : [e.pos,e.pos]});
        }else{
            logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 3385'});
        }
    }
    return({"__xst" : true});
}
/*
  =====================================================================================================================
*/
function convertit_source_javascript_en_rev(sourceDuJavascript){
    var parseur_javascript=window.acorn.Parser;
    try{
        tabComment=[];
        var obj = parseur_javascript.parse(sourceDuJavascript,{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tabComment});
        if(obj === ''){
            t='';
        }else if(obj.hasOwnProperty('body') && Array.isArray(obj.body) && obj.body.length === 0){
            t='';
        }else{
            var obj1 = TransformAstEnRev(obj.body,0);
            if(obj1.__xst === true){
                return({"__xst" : true ,"__xva" : obj1.__xva});
            }else{
                logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 3433'});
            }
        }
    }catch(e){
        console.error('e=',e);
        if(e.pos){
            logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 3441' ,"plage" : [e.pos,e.pos]});
        }else{
            logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 3443'});
        }
    }
    return({"__xst" : true ,"__xva" : obj1.__xva});
}
var tabComment=[];
/*
  =====================================================================================================================
*/
function bouton_dans_traite_js_transform_textarea_js_en_rev_avec_acorn2(nom_de_la_text_area_source,nom_de_la_text_area_rev){
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_de_la_text_area_source);
    localStorage.setItem('fta_indexhtml_javascript_dernier_fichier_charge',a.value);
    var parseur_javascript=window.acorn.Parser;
    try{
        tabComment=[];
        var obj = parseur_javascript.parse(a.value,{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tabComment});
        if(obj === ''){
            t='';
        }else if(obj.hasOwnProperty('body') && Array.isArray(obj.body) && obj.body.length === 0){
            t='';
        }else{
            var obj1 = TransformAstEnRev(obj.body,0);
            if(obj1.__xst === true){
                document.getElementById(nom_de_la_text_area_rev).value=obj1.__xva;
            }else{
                logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 3433'});
            }
        }
    }catch(e){
        console.error('e=',e);
        if(e.pos){
            logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 3441' ,"plage" : [e.pos,e.pos]});
        }else{
            logerreur({"__xst" : false ,"__xme" : 'erreur convertit_source_javascript_en_rev 3443'});
        }
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar1');
}
/*
  =====================================================================================================================
*/
function chargerSourceDeTestJs(){
    var t=`
var test=a===2;
var test=a==2;
test=a===2;test=a==2;/*

a.b("c").d += '<e f="g">' + h.i[i] + "</e>";

for (var i = 0; i < b; i++) {
  a.b("c").d += '<e>' + h.i[i] + "</e>";
}
t = " ".repeat(NBESPACESSOURCEPRODUIT * i);
t += " ".repeat(NBESPACESSOURCEPRODUIT * i);

/*
  =====================================================================================================================
*/
function traiteCommentaire2(texte, niveau, ind) {
  var s = "";
  s = traiteCommentaireSourceEtGenere1(texte, niveau, ind, NBESPACESSOURCEPRODUIT, false);
  return s;
}
/*
  =====================================================================================================================
*/
function tagada() {
  for (var i = 0; i < global_messages.errors.length; i++) {
    document.getElementById("global_messages").innerHTML += '<div class="yyerreur">' + global_messages.errors[i] + "</div>";
  }
  var numLignePrecedente = -1;
  for (var i = 0; i < global_messages.ids.length; i++) {
    var id = global_messages.ids[i];
    if (id < global_messages.data.matrice.__xva.length) {
      var ligneMatrice = global_messages.data.matrice.__xva[id];
      var caractereDebut = ligneMatrice[5];
      var numeroDeLigne = 0;
      for (var j = caractereDebut; j >= 0; j--) {
        if (global_messages.data.tableau.out[j][0] === "\\n") {
          numeroDeLigne++;
        }
      }
    }
    if (numeroDeLigne > 0) {
      if (numeroDeLigne !== numLignePrecedente) {
        document.getElementById("global_messages").innerHTML += '<a href="javascript:jumpToError(' + (numeroDeLigne + 1) + ')" class="yyerreur" style="border:2px red outset;">go to line ' + numeroDeLigne + "</a>&nbsp;";
        numLignePrecedente = numeroDeLigne;
      }
    }
  }
}

/*
  =====================================================================================================================
*/
function espacesn(optionCRLF, i) {
  var t = "";
  if (optionCRLF) {
    t = "\\r\\n";
  } else {
    t = "\\n";
  }
  if (i > 0) {
    t += " ".repeat(NBESPACESSOURCEPRODUIT * i);
  }
  return t;
}

*/`;
    document.getElementById('txtar1').value=t;
}
/*
  =====================================================================================================================
*/
function chargerLeDernierSourceJs(){
    var fta_indexhtml_javascript_dernier_fichier_charge = localStorage.getItem('fta_indexhtml_javascript_dernier_fichier_charge');
    if(fta_indexhtml_javascript_dernier_fichier_charge !== null){
        document.getElementById('txtar1').value=fta_indexhtml_javascript_dernier_fichier_charge;
    }
}