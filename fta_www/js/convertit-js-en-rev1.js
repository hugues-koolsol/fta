"use strict";
/*
  var a=0;
  var b=0;
  a = b, new String();
*/
/* =================================================================================== */
function astjs_logerreur(o){
    logerreur(o);
    if(global_messages['ranges'].length<=3){

        if((o.hasOwnProperty('element')) && (o.element.hasOwnProperty('range'))){
            global_messages['ranges'].push(JSON.parse(JSON.stringify(o.element.range)));
        }
    }
    return o;
}
/*
  =====================================================================================================================
  point d'entrée = TransformAstEnRev
  
  }else if(
  //
  'ArrayExpression'       === element.type
  || 'AssignmentExpression'  === element.type
  || "AssignmentPattern"     === element.type
  || 'AwaitExpression'       === element.type
  || 'BinaryExpression'      === element.type
  || 'CallExpression'        === element.type
  || 'ConditionalExpression' === element.type
  || 'FunctionExpression'    === element.type
  || 'Identifier'            === element.type
  || 'Literal'               === element.type
  || 'LogicalExpression'     === element.type
  || 'MemberExpression'      === element.type
  || 'NewExpression'         === element.type
  || 'ObjectExpression'      === element.type
  || 'SequenceExpression'    === element.type
  || 'TemplateLiteral'       === element.type
  || 'ThisExpression'        === element.type     
  || 'UpdateExpression'      === element.type
  || 'UnaryExpression'       === element.type
  || 'VariableDeclarator'    === element.type
  ){
  var obj1 = traiteUneComposante(element.expression , niveau , [false todo ajuster]   , [false todo ajuster]   );    [[ parentEstCrochet , dansSiOuBoucle
  if(obj1.__xst === true){
  [ todo ajuster ] 
  t+=obj1.__xva;
  }else{
  return(astjs_logerreur({__xst:false,__xme:'erreur 0000 [ todo ajuster ] '}));
  }
  
  =====================================================================================================================
  
*/
function traiteUneComposante(element,niveau,parentEstCrochet,dansSiOuBoucle){
    var t='';
    var i=0;
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if('Literal' === element.type){

        if(element.regex){

            var leParam = '/' + element.regex.pattern + '/';
            if(element.regex.flags){

                leParam+=element.regex.flags;
            }
            t+=leParam;
        }else{
            t+=element.raw;
        }
    }else if('Identifier' === element.type){

        t+=element.name;
    }else if('AwaitExpression' === element.type){

        if("CallExpression" === element.argument.type){

            var objass = traiteUneComposante(element.argument,niveau,false,false);
            if(objass.__xst === true){

                t+='await(' + objass.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0084 pour ' + element.argument.type,element:element}));
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0087 pour ' + element.type,element:element}));
        }
    }else if('ArrowFunctionExpression' === element.type){

        if((element.async === false) && (element.expression === false) && (element.generator === false)){

            var lesArguments='';
            if((element.params) && (element.params.length > 0)){

                for(i=0;i < element.params.length;i++){
                    var objarg = traiteUneComposante(element.params[i],niveau,false,false);
                    if(objarg.__xst === true){

                        lesArguments+=',p(' + objarg.__xva + ')';
                    }
                }
                if(lesArguments.length > 0){

                    lesArguments=lesArguments.substr(1);
                }
                var contenu='';
                if((element.body) && (element.body.type === 'BlockStatement')){

                    if((element.body.body) && (element.body.body.length > 0)){

                        niveau+=2;
                        var obj = TransformAstEnRev(element.body.body,niveau);
                        niveau-=2;
                        if(obj.__xst === true){

                            contenu+=obj.__xva;
                        }else{
                            return(astjs_logerreur({__xst:false,__xme:'erreur 0116 pour ' + element.type,element:element}));
                        }
                    }
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0111 pour ' + element.type,element:element}));
            }
            t='appelf(flechee() , nomf(function) ' + lesArguments + ',contenu(' + contenu + '))';
        }else{
            debugger;
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0095 pour ' + element.type,element:element}));
        }
    }else if('MemberExpression' === element.type){

        var obj1 = traiteMemberExpression1(element,niveau,element,'');
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteUneComposante 0049 ' + element.type,element:element}));
        }
    }else if('UpdateExpression' === element.type){

        var objass = traiteUpdateExpress1(element,niveau,{'sansLF':true});
        if(objass.__xst === true){

            t+=objass.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0051 pour ' + element.type,element:element}));
        }
    }else if('CallExpression' === element.type){

        var obj1 = traiteCallExpression1(element,niveau,element,{});
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteUneComposante 0056 ' + element.type,element:element}));
        }
    }else if('ObjectExpression' === element.type){

        var obj1 = traiteObjectExpression1(element,niveau);
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0063',element:element}));
        }
    }else if('UnaryExpression' === element.type){

        var nomDuTestUnary = recupNomOperateur(element.operator);
        var obj1 = traiteUneComposante(element.argument,niveau,parentEstCrochet,dansSiOuBoucle);
        if(obj1.__xst === true){

            if(((nomDuTestUnary === 'moins') || (nomDuTestUnary === 'plus')) && (isNumeric(obj1.__xva))){

                if(nomDuTestUnary === 'moins'){

                    t+='-' + obj1.__xva;
                }else{
                    t+='+' + obj1.__xva;
                }
            }else{
                t+=nomDuTestUnary + '(' + obj1.__xva + ')';
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0076',element:element}));
        }
    }else if('LogicalExpression' === element.type){

        var obj = traiteLogicalExpression1(element,niveau,true);
        if(obj.__xst === true){

            if(dansSiOuBoucle){

                if(obj.__xva.substr(0,1) === ','){

                    t+='' + obj.__xva.substr(1) + '';
                }else{
                    t+='' + obj.__xva + '';
                }
            }else{
                if(obj.__xva.substr(0,1) === ','){

                    t+='condition(' + obj.__xva.substr(1) + ')';
                }else{
                    t+='condition(' + obj.__xva + ')';
                }
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0080 '}));
        }
    }else if('NewExpression' === element.type){

        var obj1 = traiteCallExpression1(element,niveau,element,{});
        if(obj1.__xst === true){

            t+='new(' + obj1.__xva + ')';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteUneComposante 0154 ' + element.type,element:element}));
        }
    }else if('ArrayExpression' === element.type){

        var obj1 = traiteArrayExpression1(element,niveau);
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0094',element:element}));
        }
    }else if('BinaryExpression' === element.type){

        var obj1 = traiteBinaryExpress1(element,niveau,parentEstCrochet,dansSiOuBoucle);
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0101 ',element:element}));
        }
    }else if('ConditionalExpression' === element.type){

        var obj1 = traiteConditionalExpression1(element,niveau);
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0108 ',element:element}));
        }
    }else if('TemplateLiteral' === element.type){

        var obj1 = traiteTemplateLiteral1(element,niveau);
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0115 ',element:element}));
        }
    }else if('FunctionExpression' === element.type){

        var obj1 = traiteFunctionExpression1(element,niveau,element,'');
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0147 ',element:element}));
        }
    }else if('AssignmentPattern' === element.type){

        var obj1 = traiteAssignmentPattern(element,niveau,{'sansLF':true});
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0136 ',element:element}));
        }
    }else if('AssignmentExpression' === element.type){

        var obj1 = traiteAssignmentExpress1(element,niveau,{'sansLF':true});
        if(obj1.__xst === true){

            t+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0136 ',element:element}));
        }
    }else if("ThisExpression" === element.type){

        t+='this';
    }else if("VariableDeclarator" === element.type){

        var obj2 = traiteUneComposante(element.init,niveau,parentEstCrochet,dansSiOuBoucle);
        if(obj2.__xst === true){

            t+=obj2.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0159 ',element:element}));
        }
    }else if("SequenceExpression" === element.type){

        for(i=0;i < element.expressions.length;i++){
            niveau+=2;
            var obj1 = traiteUneComposante(element.expressions[i],niveau,parentEstCrochet,dansSiOuBoucle);
            niveau-=2;
            if(obj1.__xst === true){

                if(t !== ''){

                    t+=',';
                }
                t+=obj1.__xva;
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0158 pour ' + element.type,element:element}));
            }
        }
        t='cascade(' + t + ')';
    }else if('MethodDefinition' === element.type){

        if(((element.kind === "method") || (element.kind === "constructor") || (element.kind === "get") || (element.kind === "set")) && (element.value) && (element.value.type === "FunctionExpression") && (element.value.body)){

            t+='\n' + esp0 + 'méthode(';
            t+='\n' + esp0 + esp1 + 'definition(';
            if((element.kind === "get") || (element.kind === "set")){

                t+='\n' + esp0 + esp1 + esp1 + 'type(' + ((element.kind === 'get')?'lire':'écrire') + '),';
            }
            t+='\n' + esp0 + esp1 + esp1 + 'nom(' + element.key.name + '),';
            if(element.key.type === "PrivateIdentifier"){

                t+='\n' + esp0 + esp1 + esp1 + 'mode(privée),';
            }
            if(element.value.async===true){

                t+='\n' + esp0 + esp1 + esp1 + 'asynchrone()';
            }
            if((element.value.params) && (element.value.params.length > 0)){

                t+=',';
                var j=0;
                for(j=0;j < element.value.params.length;j++){
                    if(element.value.params[j].type === "Identifier"){

                        t+='\n' + esp0 + esp1 + esp1 + 'argument(' + element.value.params[j].name + ')';
                    }else if(element.value.params[j].type === "AssignmentPattern"){

                        var obj = traiteAssignmentPattern(element.value.params[j],niveau,{});
                        if(obj.__xst === true){

                            t+='\n' + esp0 + esp1 + esp1 + 'argument(' + obj.__xva + ')';
                        }else{
                            return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 2377 type argument non prévu ' + element.value.params[j].type,element:element}));
                        }
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 2380 type argument non prévu ' + element.value.params[j].type,element:element}));
                    }
                    if(j < (element.value.params.length - 1)){

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
                    var obj = TransformAstEnRev(element.value[prop],(niveau + 2));
                    if(obj.__xst === true){

                        t+=obj.__xva;
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 2400 ' + element.type,element:element}));
                    }
                }
            }
            t+='\n' + esp0 + esp1 + ')';
            t+='\n' + esp0 + ')';
        }else{
            debugger;
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteUneComposante 0278 pour ' + element.type,element:element}));
        }
    }else if('PropertyDefinition' === element.type){
        if(element.key.type === 'PrivateIdentifier' || element.key.type === 'Identifier'){

            if(element.key.type === 'PrivateIdentifier'){
             
              t+='\n' + esp0 + esp1 + 'variable_privée(' + element.key.name;
            }else if(element.key.type === 'Identifier' ){
              t+='\n' + esp0 + esp1 + 'variable_publique(' + element.key.name;
            }
            if(element.value){

                if(element.value.type === 'Literal'){

                    t+=',' + element.value.raw;
                }else if(element.value.type === 'Identifier'){

                    t+=',' + element.value.name;
                }else if((element.value.type === 'ObjectExpression') || (element.value.type === 'BinaryExpression') || (element.value.type === 'MemberExpression') || (element.value.type === 'ArrayExpression')){

                    var obj1 = traiteUneComposante(element.value,niveau,false,false);
                    if(obj1.__xst === true){

                        t+=',' + obj1.__xva + '';
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0305',element:element}));
                    }
                }else{
                    debugger;
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0295 ' + element.value.type,element:element}));
                }
            }
            t+=')';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0291 ' + element.type,element:element}));
        }
    }else if('ExportNamedDeclaration' === element.type){

        if((element.specifiers) && (element.specifiers.length > 0)){

            var j=0;
            for(j=0;j < element.specifiers.length;j++){
                var specifier=element.specifiers[j];
                if(specifier.exported){

                    if(specifier.exported.type === "Identifier"){

                        t+='exporter(nom_de_classe(' + specifier.exported.name + '))';
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0316 ' + element.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0319 ' + element.type,element:element}));
                }
            }
        }
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0118 ' + element.type,element:element}));
    }
    return({__xst:true,__xva:t});
}
/* =================================================================================== */
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

        return 'nonBin';
    }else if(s === '^'){

        return 'ou_ex_bin';
        
    }else if(s === '>>'){

        return 'decalDroite';
    }else if(s === '>>>'){

        return 'decal_droite_non_signe';
    }else if(s === '<<'){

        return 'decalGauche';
    }else if(s === 'in'){

        return 'in';
    }else if(s === 'delete'){

        return 'supprimer';
    }else if(s === 'void'){

        return 'void';
    }else{
        return(('TODO recupNomOperateur pour "' + s + '"'));
    }
}
/*
  =====================================================================================================================
*/
function traiteConditionalExpression1(element,niveau){
    var t='';
    var objtest1 = traiteUneComposante(element.test,niveau,false,false);
    if(objtest1.__xst === true){

    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteConditionalExpression1 0180 ' + element.type,element:element}));
    }
    var objSiVrai={};
    var objSiVrai = traiteUneComposante(element.consequent,niveau,false,false);
    if(objSiVrai.__xst === true){

    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteUpdateExpress1 1707 ' + element.type,element:element}));
    }
    var objSiFaux={};
    var objSiFaux = traiteUneComposante(element.alternate,niveau,false,false);
    if(objSiFaux.__xst === true){

    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteUpdateExpress1 1707 ' + element.type,element:element}));
    }
    t+='testEnLigne(condition((' + objtest1.__xva + ')),siVrai(' + objSiVrai.__xva + '),siFaux(' + objSiFaux.__xva + '))';
    return({__xst:true,__xva:t});
}
/*
  =====================================================================================================================
*/
function traiteBinaryExpress1(element,niveau,parentEstCrochet,dansSiOuBoucle){
    var t='';
    var nomDuTest = recupNomOperateur(element.operator);
    var gauche = traiteUneComposante(element.left,niveau,parentEstCrochet,dansSiOuBoucle);
    if(gauche.__xst === true){

    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteBinaryExpress1 0215 ' + element.type,element:element}));
    }
    var droite = traiteUneComposante(element.right,niveau,parentEstCrochet,dansSiOuBoucle);
    if(droite.__xst === true){

    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteUpdateExpress1 0222 ' + element.type,element:element}));
    }
    if(((element.right.type === 'Literal') && ((element.right.raw.substr(0,1) === "'") || (element.right.raw.substr(0,1) === '"')) && (nomDuTest === 'plus')) || ((element.left.type === 'Literal') && ((element.left.raw.substr(0,1) === "'") || (element.left.raw.substr(0,1) === '"')) && (nomDuTest === 'plus'))){

        t+='concat(' + gauche.__xva + ',' + droite.__xva + ')';
    }else if((parentEstCrochet) && ((nomDuTest === 'plus') || (nomDuTest === 'moins'))){

        if((false) && (((element.right.type === 'Literal') && (element.left.type === 'CallExpression')) || ((element.right.type === 'ConditionalExpression') && (element.left.type === 'CallExpression')) || ((element.right.type === 'Literal') && (element.left.type === 'Identifier')) || ((element.right.type === 'Identifier') && (element.left.type === 'Identifier')))){

            t+='' + gauche.__xva + element.operator + droite.__xva + '';
        }else{
            t+='' + nomDuTest + '(' + gauche.__xva + ',' + droite.__xva + ')';
        }
    }else{
        t+='' + nomDuTest + '(' + gauche.__xva + ',' + droite.__xva + ')';
    }
    if(t.substr(0,12) === 'plus(concat('){

        t='concat(' + t.substr(5);
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
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteBinaryExpress1 0380 pour la simplification ' + element.type,element:element}));
        }
    }
    if((t.substr(0,10) === 'plus(plus(') || (t.substr(0,12) === 'moins(moins(') || (t.substr(0,10) === 'mult(mult(')){

        var o = functionToArray(t,true,false,'');
        if(o.__xst === true){

            var nouveauTableau = baisserNiveauEtSupprimer(o.__xva,2,0);
            var obj = a2F1(nouveauTableau,0,false,1,false);
            if(obj.__xst === true){

                t=obj.__xva;
            }
        }
    }
    return({__xst:true,__xva:t});
}
function traiteLogicalExpression1(element,niveau,dansSiOuBoucle){
    var t='';
    if((element.left) && (element.right)){

        var obj1 = js_traiteCondition1(element.left,niveau,dansSiOuBoucle);
        if(obj1.__xst === true){

            t+='' + obj1.__xva + '';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteLogicalExpression1 0274 ',element:element}));
        }
        if('&&' === element.operator){

            t+=',et';
        }else if('||' === element.operator){

            t+=',ou';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteLogicalExpression1 0436 ' + element.operator,element:element}));
        }
        var obj2 = js_traiteCondition1(element.right,niveau,dansSiOuBoucle);
        if(obj2.__xst === true){

            t+='(' + obj2.__xva + ')';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteLogicalExpression1 443 ' + element.operator,element:element}));
        }
    }else{
        console.error('traiteLogicalExpression1 todo 72 ',element);
        return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteLogicalExpression1 0238 ',element:element}));
    }
    return({__xst:true,__xva:t});
}
function js_traiteCondition1(element,niveau,dansSiOuBoucle){
    var t='';
    var i=0;
    var j=0;
    var obj1 = traiteUneComposante(element,niveau,false,dansSiOuBoucle);
    if(obj1.__xst === true){

        t+='(' + obj1.__xva + ')';
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour js_traiteCondition1 0614 ' + element.type,element:element}));
    }
    /*
      il faut transformer ceci :
      [[[egal[a,1]],ou[[egal[b,2]]]],ou[[egal[c,3]]]],
      en ceci
      [[egal[d,1]],ou[[egal[e,2]]],ou[[egal[f,3]]]]
    */
    var o = functionToArray(t,true,true,'');
    if(o.__xst === true){

        if((o.__xva.length > 3)
         && (o.__xva[1][1] === '')
         && (o.__xva[1][2] === 'f')
         && (o.__xva[2][1] === '')
         && (o.__xva[2][2] === 'f')
         && (o.__xva[3][1] === '')
         && (o.__xva[3][2] === 'f')){

            var enfantDe2='';
            var onContinue=true;
            for(i=0;(i < o.__xva.length) && (onContinue === true);i++){
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
                for(i=0;(i < o.__xva.length) && (onContinue === true);i++){
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
    return({__xst:true,__xva:t});
}
function traiteForIn1(element,niveau){
    t+=ajouteCommentaireAvant(element,niveau);
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomVariable='';
    var nomObjet='';
    var pourInit='';
    if(element.left.type === 'VariableDeclaration'){

        var objDecl = traiteDeclaration1(element.left,niveau);
        if(objDecl.__xst === true){

            t+='declare(' + objDecl.nomVariable + ' , obj() ),';
            nomVariable=objDecl.nomVariable;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteForIn1 0351 ' + element.left.type,element:element}));
        }
    }else if(element.left.type === 'Identifier'){

        nomVariable=element.left.name;
    }else if(element.left.type === 'MemberExpression'){

        var obj1 = traiteMemberExpression1(element.left,niveau,element,'');
        if(obj1.__xst === true){

            nomVariable=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteForIn1 0318 ',element:element}));
        }
    }else{
        console.log('element.left.type=',element.left.type);
        return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteForIn1 0414 ' + element.left.type,element:element}));
    }
    if(element.right.type === 'Identifier'){

        nomObjet=element.right.name;
    }else if(element.right.type === 'MemberExpression'){

        var obj1 = traiteMemberExpression1(element.right,niveau,element,'');
        if(obj1.__xst === true){

            nomObjet=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCondition1 0318 ',element:element}));
        }
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteForIn1 0421 ' + element.right.type,element:element}));
    }
    t+='\n' + esp0 + 'boucleSurObjet(';
    t+='\n' + esp0 + esp1 + 'pourChaque(dans(' + nomVariable + ' , ' + nomObjet + ')),';
    t+='\n' + esp0 + esp1 + 'faire(';
    niveau+=1;
    if(element.body){

        var obj3 = TransformAstEnRev(element.body,niveau);
    }else{
        if(element.expression){

            var obj3 = traiteUneComposante(element.expression,niveau,false,false);
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteForIn1 0580 rien à faire dans la boucle ',element:element}));
        }
    }
    niveau-=1;
    if(obj3.__xst === true){

        t+=obj3.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 152 pour ' + element.type,element:element}));
    }
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({__xst:true,__xva:t});
}
function traiteSwitch1(element,niveau){
    var t='';
    var i=0;
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    t+='\n' + esp0 + 'bascule(';
    var obj1 = traiteUneComposante(element.discriminant,niveau,false,false);
    if(obj1.__xst === true){

        t+='\n' + esp0 + esp1 + 'quand(' + obj1.__xva + ')';
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteSwitch1 0548',element:element}));
    }
    for(i=0;i < element.cases.length;i++){
        t+=',\n' + esp0 + esp1 + 'est(';
        if(element.cases[i].test !== null){

            var obj1 = traiteUneComposante(element.cases[i].test,niveau,false,false);
            if(obj1.__xst === true){

                t+='\n' + esp0 + esp1 + esp1 + 'valeur(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteSwitch1 0562',element:element}));
            }
        }else{
            t+='\n' + esp0 + esp1 + esp1 + 'valeurNonPrevue()';
        }
        t+=',\n' + esp0 + esp1 + esp1 + 'faire(\n';
        if((element.cases[i].consequent) && (element.cases[i].consequent.length > 0)){

            niveau+=3;
            var obj1 = TransformAstEnRev(element.cases[i].consequent,niveau);
            niveau-=3;
            if(obj1.__xst === true){

                t+=obj1.__xva;
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteSwitch1 0573',element:element}));
            }
        }
        t+='\n' + esp0 + esp1 + esp1 + ')';
        t+='\n' + esp0 + esp1 + ')';
    }
    t+='\n' + esp0 + ')';
    return({__xst:true,__xva:t});
}
function traiteWhile1(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    t+='\n' + esp0 + 'tantQue(';
    t+='\n' + esp0 + esp1 + 'condition(';
    var obj2 = js_traiteCondition1(element.test,0,true);
    if(obj2.__xst === true){

        t+='' + obj2.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteWhile1 0525 pour ' + element.type,element:element}));
    }
    t+='\n' + esp0 + esp1 + '),';
    t+='\n' + esp0 + esp1 + 'faire(';
    niveau+=1;
    if(element.body){

        var obj3 = TransformAstEnRev(element.body,niveau);
    }else{
        if(element.expression){

            var obj3 = traiteUneComposante(element.expression,niveau,false,false);
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteWhile1 0671 rien à faire dans la boucle ',element:element}));
        }
    }
    niveau-=1;
    if(obj3.__xst === true){

        t+=obj3.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteWhile1 538 pour ' + element.type,element:element}));
    }
    t+='\n' + esp0 + esp1 + '),';
    t+='\n' + esp0 + '),';
    return({__xst:true,__xva:t});
}
function traiteDo1(element,niveau){
    var t='';
    var i=0;
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    var body='';
    var test='';
    if(element.body){

        var obj3 = TransformAstEnRev(element.body,(niveau + 1));
    }else{
        if(element.expression){

            var obj3 = traiteUneComposante(element.expression,(niveau + 1),false,false);
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteFor1 0671 rien à faire dans la boucle ',element:element}));
        }
    }
    if(obj3.__xst === true){

        body=obj3.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 152 pour ' + element.type,element:element}));
    }
    var obj2 = js_traiteCondition1(element.test,0,true);
    if(obj2.__xst === true){

        test=obj2.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 238 pour ' + element.type,element:element}));
    }
    t+='\n' + esp0 + 'faire_tant_que(';
    t+='\n' + esp0 + esp1 + 'instructions(' + body + ')';
    t+='\n' + esp0 + esp1 + 'conditions(' + test + ')';
    t+='\n' + esp0 + ')';
    return({__xst:true,__xva:t});
}
function traiteFor1(element,niveau){
    var t='';
    var i=0;
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    var pourInit='';
    if(element.init === null){

        pourInit='';
    }else if(element.init.type === 'VariableDeclaration'){

        var objDecl = traiteDeclaration1(element.init,niveau);
        if(objDecl.__xst === true){

            t+=objDecl.__xva;
            if(pourInit !== ''){

                pourInit+=',';
            }
            pourInit+=objDecl.__xva.replaceAll('declare','affecte').replaceAll('\\n','');
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteFor1 134 ' + element.init.type,element:element}));
        }
    }else if('SequenceExpression' === element.init.type){

        var obj1 = traiteUneComposante(element.init,niveau,false,false);
        if(obj1.__xst === true){

            if(pourInit !== ''){

                pourInit+=',';
            }
            pourInit+=obj1.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur 0000 [ todo ajuster ] '}));
        }
    }else if('AssignmentExpression' === element.init.type){

        var objass0 = traiteAssignmentExpress1(element.init,niveau,{'sansLF':true});
        if(objass0.__xst === true){

            pourInit=objass0.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 248 pour ' + element.type,element:element}));
        }
    }else{
        console.log('element.init.type=',element.init.type);
    }
    t+='\n' + esp0 + 'boucle(';
    t+='\n' + esp0 + esp1 + 'initialisation(' + pourInit + ')';
    t+='\n' + esp0 + esp1 + 'condition(';
    if(element.test === null){

    }else{
        var obj2 = js_traiteCondition1(element.test,0,true);
        if(obj2.__xst === true){

            t+='' + obj2.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 238 pour ' + element.type,element:element}));
        }
    }
    t+=')';
    var valeurIncrement='';
    if(element.update === null){

        valeurIncrement='';
    }else{
        if(element.update.type === 'AssignmentExpression'){

            var objass = traiteAssignmentExpress1(element.update,niveau,{'sansLF':true});
            if(objass.__xst === true){

                valeurIncrement=objass.__xva;
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 0613 pour ' + element.type,element:element}));
            }
        }else if(element.update.type === 'UpdateExpression'){

            var objass = traiteUpdateExpress1(element.update,niveau,{'sansLF':true});
            if(objass.__xst === true){

                valeurIncrement=objass.__xva;
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 0621 pour ' + element.type,element:element}));
            }
        }else{
            t+='TODO)';
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 0625 pour ' + element.type,element:element}));
        }
    }
    t+='\n' + esp0 + esp1 + 'increment(' + valeurIncrement + ')';
    t+='\n' + esp0 + esp1 + 'faire(';
    if(element.body){

        var obj3 = TransformAstEnRev(element.body,(niveau + 1));
    }else{
        if(element.expression){

            var obj3 = traiteUneComposante(element.expression,(niveau + 1),false,false);
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteFor1 0671 rien à faire dans la boucle ',element:element}));
        }
    }
    if(obj3.__xst === true){

        t+=obj3.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteFor1 152 pour ' + element.type,element:element}));
    }
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({__xst:true,__xva:t});
}
function traiteIf1(element,niveau,type){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if(t !== ''){

        t+=',';
    }
    if(type === 'if'){

        t+='\n' + esp0 + 'choix(';
        t+='\n' + esp0 + esp1 + 'si(';
        t+='\n' + esp0 + esp1 + esp1 + 'condition(';
        var obj2 = js_traiteCondition1(element.test,0,true);
        if(obj2.__xst === true){

            t+='' + obj2.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteIf1 135 pour ' + element.type,element:element}));
        }
        t+='),';
    }else{
        if(element.test){

            t+='\n' + esp0 + esp1 + 'sinonsi(';
            t+='\n' + esp0 + esp1 + esp1 + 'condition(';
            var obj2 = js_traiteCondition1(element.test,0,true);
            if(obj2.__xst === true){

                t+='' + obj2.__xva;
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteIf1 372 pour ' + element.type,element:element}));
            }
            t+='),';
        }else{
            t+='\n' + esp0 + esp1 + 'sinon(';
        }
    }
    t+='\n' + esp0 + esp1 + esp1 + 'alors(';
    niveau+=3;
    if(element.consequent){

        if(element.consequent.body){

            var obj3 = TransformAstEnRev(element.consequent.body,niveau);
        }else{
            var obj3 = TransformAstEnRev([element.consequent],niveau);
        }
    }else{
        if(element.body){

            var obj3 = TransformAstEnRev(element.body,niveau);
        }else if(element.expression){

            var obj3 = traiteUneComposante(element.expression,niveau,false,false);
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteIf1 0819 pour ' + element.type,element:element}));
        }
    }
    niveau-=3;
    if(obj3.__xst === true){

        t+='\n' + esp0 + esp1 + esp1 + esp1 + obj3.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteIf1 0826 pour ' + element.type,element:element}));
    }
    if(element.alternate){

        if(element.alternate.hasOwnProperty('range')){

            positionDebutBloc=element.alternate.range[0];
        }else if(element.alternate.hasOwnProperty('start')){

            positionDebutBloc=element.alternate.start;
        }else{
            debugger;
        }
        t+=ajouteCommentaireAvant(element.alternate,(niveau + 3));
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
            t+=ajouteCommentaireAvant(element,(niveau + 3));
        }
    }
    if(element.alternate === null){

        positionDebutBloc=element.range[1];
        t+=ajouteCommentaireAvant(element,(niveau + 3));
    }
    t+='\n' + esp0 + esp1 + esp1 + ')';
    t+='\n' + esp0 + esp1 + ')';
    if(element.alternate){

        var obj3 = traiteIf1(element.alternate,niveau,'else');
        if(obj3.__xst === true){

            t+=obj3.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteIf1 170 pour ' + element.type,element:element}));
        }
    }
    if(type === 'if'){

        t+='\n' + esp0 + ')';
    }
    return({__xst:true,__xva:t});
}
function traiteCallExpression1(element,niveau,parent,opt){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    var parentProperty='';
    if(parent.property){

        if((parent.computed) && (parent.computed === true)){

            /*
              le parent est un tableau => les propriétés sont les indices du tableau
            */
        }else{
            if(parent.property.type === 'Identifier'){

                parentProperty='prop(' + parent.property.name + ')';
            }else if(parent.property.type === 'Literal'){

                parentProperty='prop(' + parent.property.raw + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 0514 ' + parent.property.type,element:element}));
            }
        }
    }
    if(opt['sansLF']){

        LF='';
        esp0='';
        esp1='';
    }
    var contenu='';
    if(element.body){

        niveau+=2;
        var obj = TransformAstEnRev(element.body,niveau);
        if(obj.__xst === true){

            contenu=obj.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 pour body',element:element}));
        }
        niveau-=2;
    }
    var lesArguments='';
    if((element.arguments) && (element.arguments.length > 0)){

        var i=0;
        for(i=0;i < element.arguments.length;i++){
            lesArguments+=',';
            if('CallExpression' === element.arguments[i].type){

                var obj1 = traiteCallExpression1(element.arguments[i],niveau,element,{'sansLF':true});
                if(obj1.__xst === true){

                    if(obj1.__xva.substr(0,6) === 'defTab'){

                        lesArguments+='p(' + obj1.__xva + ')';
                    }else if(obj1.__xva.substr(0,6) === 'appelf'){

                        lesArguments+='p(' + obj1.__xva + ')';
                    }else{
                        lesArguments+='p(appelf(' + obj1.__xva + '))';
                    }
                }else{
                    console.error('Dans traiteCallExpression1 element=',element);
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteCallExpression1 479 ',element:element}));
                }
            }else{
                var obj1 = traiteUneComposante(element.arguments[i],niveau,false,false);
                if(obj1.__xst === true){

                    positionDebutBloc=element.arguments[i].range[0];
                    var le_commentaire = ajouteCommentaireAvant(element.arguments[i],niveau);
                    lesArguments+='p(' + le_commentaire + '' + obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 0722',element:element}));
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

            if((element.callee.property.type === 'Identifier') || (element.callee.property.type === 'PrivateIdentifier')){

                prefixe='';
                if(element.callee.property.type === 'PrivateIdentifier'){

                    prefixe='#';
                }
                if((element.callee.object) && (element.callee.object.type === 'Identifier')){

                    if(contenu === ''){

                        t+='appelf(element(' + element.callee.object.name + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ')';
                    }else{
                        t+='appelf(element(' + element.callee.object.name + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ',contenu(' + contenu + '))';
                    }
                }else if((element.callee.object) && (element.callee.object.type === 'Literal')){

                    if(contenu === ''){

                        t+='appelf(element(' + element.callee.object.raw + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ')';
                    }else{
                        t+='appelf(element(' + element.callee.object.raw + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ',contenu(' + contenu + '))';
                    }
                }else{
                    if((element.callee.object) && (element.callee.object.type === 'MemberExpression') && ( !(((element.callee.object.object) && (element.callee.object.property) && (element.callee.object.object.type === 'Identifier')) && (element.callee.object.property.type === 'Identifier')))){

                        var obj1 = traiteMemberExpression1(element.callee.object,niveau,element,'');
                        if(obj1.__xst === true){

                            if(contenu === ''){

                                t+='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ')';
                            }else{
                                t+='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ',contenu(' + contenu + '))';
                            }
                        }else{
                            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 485 ',element:element}));
                        }
                    }else{
                        if(contenu === ''){

                            if(element.callee.property.name){

                                laPropriete='prop(appelf(nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + '))';
                            }else if(element.callee.property.type === 'ConditionalExpression'){

                                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 1235 ',element:element}));
                            }
                        }else{
                            console.error('\n\nATTENTION VERIFIER CECI\n\n');
                            laPropriete='#(verifier convertit_js_en-rev 1230 ),prop(appelf(nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ',contenu(' + contenu + ')))';
                        }
                    }
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 0887 ',element:element}));
            }
        }
        if(element.callee.object){

            if(element.callee.object.type === 'CallExpression'){

                var obj1 = traiteCallExpression1(element.callee.object,niveau,element,{});
                if(obj1.__xst === true){

                    if((obj1.__xva.substr(0,6) === 'appelf') && (obj1.__xva.substr((obj1.__xva.length - 1),1) === ')')){

                        t+='' + obj1.__xva.substr(0,(obj1.__xva.length - 1)) + ',' + laPropriete + ')';
                    }else{
                        if(contenu === ''){

                            t+='appelf(' + obj1.__xva + ',' + laPropriete + ')';
                        }else{
                            t+='appelf(' + obj1.__xva + ',' + laPropriete + ',contenu(' + contenu + '))';
                        }
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 0900 ',element:element}));
                }
            }else if(element.callee.object.type === 'ArrayExpression'){

                var obj1 = traiteArrayExpression1(element.callee.object,niveau);
                if(obj1.__xst === true){

                    /*
                      obj1.__xva   = defTab[p[0]]
                      laPropriete  = prop[appelf[nomf[x],p[cp]]]
                      => appelf[element[defTab[p[0]],nomf[x],p[cp]]
                    */
                    if((obj1.__xva.substr(0,7) === 'defTab(') && (laPropriete.substr(0,12) === 'prop(appelf(')){

                        var t1 = laPropriete.substr(5,(laPropriete.length - 5 - 2)) + ',element(' + obj1.__xva + '))';
                        t+=t1;
                    }else{
                        if(contenu === ''){

                            t+='appelf(' + obj1.__xva + ',' + laPropriete + ')';
                        }else{
                            t+='appelf(' + obj1.__xva + ',' + laPropriete + ',contenu(' + contenu + '))';
                        }
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteArrayExpression1 567 ',element:element}));
                }
            }else if(element.callee.object.type === 'MemberExpression'){

                var obj1 = traiteMemberExpression1(element.callee.object,niveau,element,'');
                if(obj1.__xst === true){

                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 485 ',element:element}));
                }
                prefixe='';
                if(element.callee.property.type === 'PrivateIdentifier'){

                    prefixe='#';
                }
                if((element.callee.object.object) && (element.callee.object.property) && (element.callee.object.object.type === 'Identifier') && (element.callee.object.property.type === 'Identifier')){

                    if(contenu === ''){

                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ')';
                    }else{
                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ',contenu(' + contenu + '))';
                    }
                }else{
                    /*
                      Traité plus haut en repère xxx001    
                      var obj1=traiteMemberExpression1[element.callee.object,niveau,element,''];
                      if[obj1.__xst===true]{
                      t+='appelf[nomf['+obj1.__xva+']'+laPropriete+']';
                      }else{
                      return astjs_logerreur[{__xst:false,__xme:'erreur dans traiteCallExpression1 485 ',element:element }]
                      }
                    */
                }
            }else if(element.callee.object.type === 'Identifier'){

            }else if(element.callee.object.type === 'Literal'){

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
                        return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 1230 type de source inconnu pour l\'import ' + element.callee.object.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 1230 pas de source en import ' + element.callee.object.type,element:element}));
                }
                if(contenu === ''){

                    t='appelf(nomf(import),' + lesArguments + ',' + laPropriete + ')';
                }else{
                    t='appelf(nomf(import),' + lesArguments + ',' + laPropriete + ',contenu(' + contenu + '))';
                }
            }else if(element.callee.object.type === 'Super'){

                t='appelf(nomf(super),' + lesArguments + ',' + laPropriete + ')';
            }else if(element.callee.object.type === 'NewExpression'){

                var obj1 = traiteUneComposante(element.callee.object,niveau,false,false);
                if(obj1.__xst === true){

                    t=obj1.__xva.substr(0,(obj1.__xva.length - 2)) + ',' + lesArguments + ',' + laPropriete + '))';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 1385',element:element}));
                }
            }else if(element.callee.object.type === 'BinaryExpression'){

                var obj1 = traiteUneComposante(element.callee.object,niveau,false,false);
                if(obj1.__xst === true){

                    if(contenu === ''){

                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ')';
                    }else{
                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + ',contenu(' + contenu + '))';
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 1366 ' + element.callee.object.type,element:element}));
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 0618 ' + element.callee.object.type,element:element}));
            }
        }else if(element.callee.type === 'Identifier'){

            if((element.callee.name === 'Array') && (laPropriete === '')){

                if((lesArguments.length > 0) && (lesArguments.substr(0,1) === ',')){

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

            var obj1 = traiteUneComposante(element.callee,niveau,false,false);
            if(obj1.__xst === true){

                if(contenu === ''){

                    t='appelf(nomf(' + obj1.__xva + ')' + lesArguments + ')';
                }else{
                    t='appelf(nomf(' + obj1.__xva + ')' + lesArguments + ',contenu(' + contenu + '))';
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 1417 ' + element.callee.type,element:element}));
            }
        }else if(element.callee.type === 'FunctionExpression'){

            var obj1 = traiteFunctionExpression1(element.callee,niveau,element,'');
            if(obj1.__xst === true){

                if(contenu === ''){

                    t+='appelf(nomf(' + obj1.__xva + ')' + lesArguments + laPropriete + ')';
                }else{
                    t+='appelf(nomf(' + obj1.__xva + ')' + lesArguments + laPropriete + ',contenu(' + contenu + '))';
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0147 ',element:element}));
            }
        }else if(element.callee.type === 'Super'){

            t+='appelf(nomf(super)' + lesArguments + laPropriete + ')';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCallExpression1 0933 ' + element.callee.type,element:element}));
        }
    }
    return({__xst:true,__xva:t});
}
function traiteFunctionExpression1(element,niveau){
    var t='';
    var lesArguments='';
    var contenu='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if((element.params) && (element.params.length > 0)){

        var i=0;
        for(i=0;i < element.params.length;i++){
            lesArguments+=',';
            if('Identifier' === element.params[i].type){

                lesArguments+='p(' + element.params[i].name + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteFunctionExpression1 1054 ',element:element}));
            }
        }
    }
    if(element.body){

        niveau+=2;
        var obj = TransformAstEnRev(element.body,niveau);
        if(obj.__xst === true){

            contenu=obj.__xva;
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteFunctionExpression1 pour body',element:element}));
        }
        niveau-=2;
    }
    if(element.id){

        if(element.id.type === "Identifier"){

            t='appelf(id(' + element.id.name + '),nomf(function) ' + lesArguments + ',contenu(' + contenu + '))';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteFunctionExpression1 pour element.id.type=' + element.id.type,element:element}));
        }
    }else{
        t='appelf(nomf(function) ' + lesArguments + ',contenu(' + contenu + '))';
    }
    return({__xst:true,__xva:t});
}
function traiteArrayExpression1(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    t+='defTab(';
    var lesPar='';
    var i={};
    for(i in element.elements){
        if(element.elements[i].type === 'Literal'){

            lesPar+=',p(' + element.elements[i].raw + ')';
        }else if(element.elements[i].type === 'Identifier'){

            lesPar+=',p(' + element.elements[i].name + ')';
        }else if(element.elements[i].type === 'ArrayExpression'){

            var obj1 = traiteArrayExpression1(element.elements[i],niveau);
            if(obj1.__xst === true){

                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteArrayExpression1 567 ',element:element}));
            }
        }else if(element.elements[i].type === 'MemberExpression'){

            var obj1 = traiteMemberExpression1(element.elements[i],niveau,element,'');
            if(obj1.__xst === true){

                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteObjectExpression1 0799 pour ' + eval.__xva.type,element:element}));
            }
        }else if(element.elements[i].type === 'CallExpression'){

            var obj1 = traiteCallExpression1(element.elements[i],element,{},'');
            if(obj1.__xst === true){

                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteObjectExpression1 0799 pour ' + eval.__xva.type,element:element}));
            }
        }else if(element.elements[i].type === "FunctionExpression"){

            var obj1 = traiteFunctionExpression1(element.elements[i],niveau,element,'');
            if(obj1.__xst === true){

                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteArrayExpression1 1103 ',element:element}));
            }
        }else if((element.elements[i].type === "BinaryExpression") || (element.elements[i].type === "UnaryExpression") || (element.elements[i].type === "ObjectExpression")){

            var obj1 = traiteUneComposante(element.elements[i],niveau,true,false);
            if(obj1.__xst === true){

                lesPar+=',p(' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteArrayExpression1 1111',element:element}));
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteArrayExpression1 1388 "' + element.elements[i].type + '"',element:element.elements[i]}));
        }
    }
    if(lesPar.length >= 0){

        lesPar=lesPar.substr(1);
    }
    t+=lesPar + ')';
    if(t === 'appelf(nomf(Array))'){

        t='[]';
    }
    return({__xst:true,__xva:t});
}
function traiteObjectExpression1(element,niveau){
    var t='';
    var i={};
    for(i in element.properties){
        if(t !== ''){

            t+=',';
        }
        positionDebutBloc=element.properties[i].range[0];
        t+=ajouteCommentaireAvant(element,niveau);
        var val=element.properties[i];
        if(val.key.type === 'Identifier'){

            t+='(' + val.key.name + ',';
        }else if(val.key.type === 'Literal'){

            t+='(' + val.key.raw + ',';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteObjectExpression1 609 ' + val.key.type,element:element}));
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
        if(('ArrayExpression' === val.value.type)
         || ('BinaryExpression' === val.value.type)
         || ('CallExpression' === val.value.type)
         || ('ConditionalExpression' === val.value.type)
         || ('FunctionExpression' === val.value.type)
         || ('Identifier' === val.value.type)
         || ('Literal' === val.value.type)
         || ('LogicalExpression' === val.value.type)
         || ('MemberExpression' === val.value.type)
         || ('ObjectExpression' === val.value.type)
         || ('TemplateLiteral' === val.value.type)
         || ('UnaryExpression' === val.value.type)){

            var obj1 = traiteUneComposante(val.value,niveau,false,false);
            if(obj1.__xst === true){

                t+=obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur 0000 [ todo ajuster ] '}));
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteObjectExpression1 0817 ' + val.value.type,element:element}));
        }
    }
    t='obj(' + t + ')';
    return({__xst:true,__xva:t});
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
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1572 pour ' + property.type,element:property}));
            }
        }else if(property.type === 'Identifier'){

            t+=property.name;
        }else if(property.type === 'PrivateIdentifier'){

            t+='#' + property.name + '';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1548  pour ' + property.type,element:property}));
        }
    }
    return({__xst:true,__xva:t});
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
                                t+=objTxt.substr(0,(objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                            }else{
                                if(objTxt.substr(0,6) === 'appelf'){

                                    if(objTxt.indexOf('prop(') >= 0){

                                        objTxt=objTxt.substr(0,(objTxt.length - 2)) + '.' + prop.__xva + '))';
                                        t=objTxt;
                                    }else{
                                        objTxt=objTxt.substr(0,(objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                                        t=objTxt;
                                    }
                                }else{
                                    t+=objTxt + '.' + prop.__xva;
                                }
                            }
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1528 pour ' + element.object.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1526 pour ' + element.type,element:element}));
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
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1528 pour ' + element.object.type,element:element}));
                }
            }else if(element.object.type === 'CallExpression'){

                var obj1 = traiteCallExpression1(element.object,element,{},'');
                if(obj1.__xst === true){

                    objTxt=obj1.__xva;
                    var prop = recupProp(element.property);
                    if(prop.__xst === true){

                        if(prop.__xva !== ''){

                            t+=objTxt.substr(0,(objTxt.length - 1)) + ',prop(' + prop.__xva + '))';
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1574 pour ' + element.object.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1530 pour ' + element.object.type,element:element}));
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
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1528 pour ' + element.object.type,element:element}));
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
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1528 pour ' + element.object.type,element:element}));
                }
            }else if(element.object.type === "ArrayExpression"){

                var obj1 = traiteArrayExpression1(element.object,niveau);
                if(obj1.__xst === true){

                    objTxt=obj1.__xva;
                    var prop = recupProp(element.property);
                    if(prop.__xst === true){

                        if(prop.__xva !== ''){

                            t+=objTxt.substr(0,(objTxt.length - 1)) + 'prop(' + prop.__xva + '))';
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1574 pour ' + element.object.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteMemberExpression1 1710'}));
                }
            }else{
                debugger;
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1523 pour ' + element.object.type,element:element}));
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1517 pour ' + element.type,element:element}));
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
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1526 pour ' + element.type,element:element}));
                }
            }else if(element.object.type === "CallExpression"){

                var obj1 = traiteCallExpression1(element.object,niveau,element,{});
                if(obj1.__xst === true){

                    objTxt=obj1.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1316 pour ' + element.object.type,element:element}));
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1582 pour ' + element.object.type,element:element}));
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1520 pas d\'objet pour ' + element.type,element:element}));
        }
        if(element.property){

            var obj1 = traiteUneComposante(element.property,niveau,true,false);
            if(obj1.__xst === true){
                if(element.object.type=== 'Identifier' || element.object.type=== 'MemberExpression'){
                    if(obj1.__xva.substr(0,5)==='plus(' || obj1.__xva.substr(0,6)==='moins('){
                        /*#
                         on essaie de mettre un arr[i+1][j+1] à la place d'un                      
                         tableau(
                          nomt(
                           tableau(nomt(arr) , p(plus(i , 1)))
                          ),
                          p(plus(j , 1))
                         )
                        */
//                        t+='arr[i+1]';
                        var obj_nom_tableau=functionToArray(objTxt,true,true,'');
                        if(obj_nom_tableau.__xst===true && obj_nom_tableau.__xva.length===2 && obj_nom_tableau.__xva[1][2]==='c'){
                            /*
                             le nom du tableau est une constante
                            */
                            var obj_indice_tableau=functionToArray(obj1.__xva,true,true,'');
                            if(obj_indice_tableau.__xst===true && obj_indice_tableau.__xva.length===4 && obj_indice_tableau.__xva[2][2]==='c' && obj_indice_tableau.__xva[3][2]==='c'){
                                if(obj1.__xva.substr(0,5)==='plus('){
                                    t+='' + objTxt + '['+obj_indice_tableau.__xva[2][1]+'+'+obj_indice_tableau.__xva[3][1]+']';
                                }else if(obj1.__xva.substr(0,5)==='moins('){
                                    t+='' + objTxt + '['+obj_indice_tableau.__xva[2][1]+'-'+obj_indice_tableau.__xva[3][1]+']';
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
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1572 pour ' + element.type,element:element}));
            }
        }else{
            t=objTxt;
        }
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteMemberExpression1 1512 pour ' + element.type,element:element}));
    }
    if(t.substr(0,8) === 'tableau('){

        var o = functionToArray(t,true,false,'');
        if(o.__xst === true){

            if((o.__xva[2][1] === 'nomt') && (o.__xva[2][8] === 1) && (o.__xva[3][2] === 'c')){

                var i=0;
                var bcont=true;
                var cumChaine='';
                for(i=4;(i < o.__xva.length) && (bcont === true);i++){
                    if(o.__xva[i][7] === 1){

                        if((o.__xva[i][1] === 'p') && (o.__xva[i + 1][2] === 'c')){

                            if(o.__xva[i + 1][4] !== 0){

                                bcont=false;
                                break;
                            }else if(o.__xva[i + 1][4] === 2){

                                bcont=false;
                                break;
                            }else{
                                cumChaine+='[' + maConstante(o.__xva[i + 1]) + ']';
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
    return({__xst:true,__xva:t});
}
/* =================================================================================== */
function traiteUpdateExpress1(element,niveau,opt){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if(opt['sansLF']){

        LF='';
        esp0='';
        esp1='';
    }
    var elem='';
    var obj = traiteUneComposante(element.argument,niveau,false,false);
    if(obj.__xst === true){

        elem=obj.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteUpdateExpress1 1707 ' + element.type,element:element}));
    }
    if(('++' === element.operator) && (element.prefix === false)){

        t+='postinc(' + elem + ')';
    }else if(('--' === element.operator) && (element.prefix === false)){

        t+='postdec(' + elem + ')';
    }else if(('++' === element.operator) && (element.prefix === true)){

        t+='preinc(' + elem + ')';
    }else if(('--' === element.operator) && (element.prefix === true)){

        t+='predec(' + elem + ')';
    }
    return({__xst:true,__xva:t});
}
/*
  =====================================================================================================================
*/
function traiteAssignmentPattern(element,niveau,opt){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if(opt['sansLF']){

        LF='';
        esp0='';
        esp1='';
    }else{
        t+=ajouteCommentaireAvant(element,niveau);
    }
    if((element.left) && (element.right)){

        var objgauche = traiteUneComposante(element.left,niveau,false,false);
        var objdroite = traiteUneComposante(element.right,niveau,false,false);
        if((objgauche.__xst === true) && (objdroite.__xst)){

            t+=objgauche.__xva + ',defaut(' + objdroite.__xva + ')';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentPattern 1558 pour ' + element.type,element:element}));
        }
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentPattern 1554 pour ' + element.type,element:element}));
    }
    return({__xst:true,__xva:t});
}
/*
  =====================================================================================================================
*/
function traiteAssignmentExpress1(element,niveau,opt){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
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
    if((element.left) && (element.left.type === 'Identifier')){

        if(element.operator === '='){

            valeurLeft=((LF + esp0)) + 'affecte(' + element.left.name + ' , ';
        }else{
            valeurLeft=((LF + esp0)) + 'affectop(\'' + element.operator + '\' , ' + element.left.name + ' , ';
        }
        if((element.right) && (element.right.type === 'Literal')){

            t+=((valeurLeft + element.right.raw)) + ')';
        }else if((element.right) && (element.right.type === 'MemberExpression')){

            var obj1 = traiteMemberExpression1(element.right,niveau,element,'');
            if(obj1.__xst === true){

                t+=((valeurLeft + obj1.__xva)) + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentExpress1 301 pour ' + element.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'BinaryExpression')){

            obj1=traiteBinaryExpress1(element.right,niveau,false,false);
            if(obj1.__xst === true){

                t+=((valeurLeft + obj1.__xva)) + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentExpress1 452 pour ' + element.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'CallExpression')){

            var obj1 = traiteCallExpression1(element.right,niveau,element,{'sansLF':true});
            if(obj1.__xst === true){

                t+=((valeurLeft + obj1.__xva)) + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteAssignmentExpress1 780 ' + element.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'Identifier')){

            t+=((valeurLeft + element.right.name)) + ')';
        }else if((element.right) && (element.right.type === 'UnaryExpression')){

            var nomDuTestUnary = recupNomOperateur(element.right.operator);
            var nomDuTest = recupNomOperateur(element.operator);
            if((element.right)
             && (typeof element.right.argument.name !== 'undefined')
             && (element.right.type === 'UnaryExpression')
             && (element.right.argument.type === 'Identifier')
             && ((element.right.operator === '-')
             || (element.right.operator === '+'))){

                t+=((valeurLeft + element.right.operator + element.right.argument.name)) + ')';
            }else if((element.right) && (element.right.type === 'Literal') && (element.right.argument.type === 'Identifier')){

                t+=((valeurLeft + nomDuTest)) + '(' + nomDuTestUnary + '(' + element.right.argument.name + ')' + ',' + element.right.raw + '))';
            }else if(((element.right.operator === '-') || (element.right.operator === '+')) && (element.right.argument.type === 'Literal')){

                t+=((valeurLeft + element.right.operator)) + '' + element.right.argument.raw + ')';
            }else if(((element.right.operator === '-') || (element.right.operator === '+')) && (element.right.argument.type === 'Identifiel')){

                t+=((valeurLeft + element.right.operator)) + '' + element.right.argument.name + ')';
            }else if(((element.right.operator === '+') || (element.right.operator === '-')) && (element.right.argument.type === 'CallExpression')){

                var obj1 = traiteCallExpression1(element.right.argument,niveau,element.right,{'sansLF':true});
                if(obj1.__xst === true){

                    t+=((valeurLeft + nomDuTestUnary)) + '(' + obj1.__xva + '))';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteAssignmentExpress1 780 ' + element.type,element:element}));
                }
            }else if((element.right.operator === '!') && (element.right.argument.type === 'CallExpression')){

                var obj1 = traiteCallExpression1(element.right.argument,niveau,element.right,{'sansLF':true});
                if(obj1.__xst === true){

                    t+=valeurLeft + 'condition(non(' + obj1.__xva + '))' + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteAssignmentExpress1 780 ' + element.type,element:element}));
                }
            }else if(element.right.operator === 'void'){

                var objass = traiteUneComposante(element.right.argument,niveau,false,false);
                if(objass.__xst === true){

                    t+=valeurLeft + 'appelf(nomf(void),p(' + objass.__xva + ')))';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentExpress1 1965 pour ' + element.argument.type,element:element}));
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 0934 '}));
            }
        }else if((element.right) && (element.right.type === 'AssignmentExpression')){

            var objass = traiteAssignmentExpress1(element.right,niveau,{'sansLF':true});
            if(objass.__xst === true){

                t+=((valeurLeft + objass.__xva)) + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentExpress1 1020 pour ' + element.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'ObjectExpression')){

            var obj1 = traiteObjectExpression1(element.right,niveau);
            if(obj1.__xst === true){

                t+=((valeurLeft + obj1.__xva)) + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 1027',element:element}));
            }
        }else if((element.right) && (element.right.type === 'LogicalExpression')){

            var obj1 = traiteLogicalExpression1(element.right,niveau,true);
            if(obj1.__xst === true){

                t+=valeurLeft + 'condition(' + obj1.__xva + '))';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 1181',element:element}));
            }
        }else if((element.right) && (element.right.type === 'ConditionalExpression')){

            var obj1 = traiteConditionalExpression1(element.right,niveau);
            if(obj1.__xst === true){

                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                console.error('erreur traiteAssignmentExpress1 1347 element=',element);
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentExpress1 1347 pour ' + element.right.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'ArrayExpression')){

            var obj1 = traiteArrayExpression1(element.right,niveau);
            if(obj1.__xst === true){

                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 1422'}));
            }
        }else if((element.right) && (element.right.type === 'NewExpression')){

            var obj1 = traiteUneComposante(element.right,niveau,false,false);
            if(obj1.__xst === true){

                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 1385',element:element}));
            }
        }else if((element.right) && (element.right.type === 'FunctionExpression')){

            var obj1 = traiteFunctionExpression1(element.right,niveau,element,'');
            if(obj1.__xst === true){

                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 0147 ',element:element}));
            }
        }else if((element.right) && (element.right.type === 'TemplateLiteral')){
         
            var obj1 = traiteUneComposante(element.right,niveau,false,false);
            if(obj1.__xst === true){

                t+=valeurLeft + '' + obj1.__xva + ')';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 1385',element:element}));
            }
        }else if((element.right) && (element.right.type === 'ThisExpression')){
                t+=valeurLeft + 'this)';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentExpress1 1023 pour ' + element.right.type,element:element}));
        }
    }else if((element.left) && (element.left.type === 'MemberExpression')){

        var obj2 = traiteMemberExpression1(element.left,niveau,element,'');
        if(obj2.__xst === true){

            if(element.operator === '='){

                t=((LF + esp0)) + 'affecte(' + obj2.__xva + ' , ';
            }else{
                t=((LF + esp0)) + 'affectop(\'' + element.operator + '\' , ' + obj2.__xva + ' , ';
            }
            if((element.right) && (element.right.type === 'Literal')){

                t+=element.right.raw + ')';
            }else if((element.right) && (element.right.type === 'Identifier')){

                t+=element.right.name + ')';
            }else if((element.right) && (element.right.type === 'MemberExpression')){

                var obj1 = traiteMemberExpression1(element.right,niveau,element,'');
                if(obj1.__xst === true){

                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentExpress1 318 pour ' + element.type,element:element}));
                }
            }else if('BinaryExpression' === element.right.type){

                obj1=traiteBinaryExpress1(element.right,niveau,false,false);
                if(obj1.__xst === true){

                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur traiteAssignmentExpress1 452 pour ' + element.type,element:element}));
                }
            }else if('FunctionExpression' === element.right.type){

                var obj1 = traiteFunctionExpression1(element.right,niveau,element,'');
                if(obj1.__xst === true){

                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0147 ',element:element}));
                }
            }else if('CallExpression' === element.right.type){

                var obj1 = traiteCallExpression1(element.right,niveau,element,{'sansLF':true});
                if(obj1.__xst === true){

                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteAssignmentExpress1 1232 ' + element.type,element:element}));
                }
            }else if('LogicalExpression' === element.right.type){

                var obj1 = traiteLogicalExpression1(element.right,niveau,false);
                if(obj1.__xst === true){

                    t+='condition(' + obj1.__xva + '))';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteAssignmentExpress1 1493 ',element:element}));
                }
            }else if('ArrayExpression' === element.right.type){

                var obj1 = traiteArrayExpression1(element.right,niveau);
                if(obj1.__xst === true){

                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 1500',element:element}));
                }
            }else if('ObjectExpression' === element.right.type){

                var obj1 = traiteObjectExpression1(element.right,niveau);
                if(obj1.__xst === true){

                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 534',element:element}));
                }
            }else if(('ConditionalExpression' === element.right.type)
             || ('NewExpression' === element.right.type)
             || ('UnaryExpression' === element.right.type)
             || ("AssignmentExpression" === element.right.type)
             || ("SequenceExpression" === element.right.type)){

                var obj1 = traiteUneComposante(element.right,niveau,false,false);
                if(obj1.__xst === true){

                    t+=obj1.__xva + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 1515',element:element}));
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur traiteExpression1 1223 pour ' + element.right.type,element:element}));
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteExpression1 305 pour ' + element.type,element:element}));
        }
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteExpression1 214 pour ' + element.type,element:element}));
    }
    return({__xst:true,__xva:t});
}
function traiteExpression1(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if('ExpressionStatement' === element.type){

        if('ExpressionStatement' === element.expression.type){

            var objexp1 = traiteExpression1(element.expression,niveau);
            if(objexp1.__xst === true){

                t+=objexp1.__xva;
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteExpression1 1134 ' + element.type,element:element}));
            }
        }else if('MemberExpression' === element.expression.type){

            var obj1 = traiteMemberExpression1(element.expression,niveau,element,'');
            if(obj1.__xst === true){

                t+=obj1.__xva;
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteDeclaration1 928 ' + element.type,element:element}));
            }
        }else if(('Literal' === element.expression.type) && (element.directive)){

            if(element.directive === 'use strict'){

                t+='useStrict()';
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteExpression1 1127 ' + element.type,element:element}));
            }
        }else if(('AssignmentExpression' === element.expression.type)
         || ('UpdateExpression' === element.expression.type)
         || ('CallExpression' === element.expression.type)
         || ('Identifier' === element.expression.type)
         || ('Literal' === element.expression.type)
         || ('LogicalExpression' === element.expression.type)
         || ('UnaryExpression' === element.expression.type)
         || ('SequenceExpression' === element.expression.type)
         || ('NewExpression' === element.expression.type)){

            var obj1 = traiteUneComposante(element.expression,niveau,false,false);
            if(obj1.__xst === true){

                t+=obj1.__xva;
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteDeclaration1 928 ' + element.type,element:element}));
            }
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur traiteExpression1 1124 pour ' + element.expression.type,element:element}));
        }
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur traiteExpression1 1037 pour ' + element.type,element:element}));
    }
    return({__xst:true,__xva:t});
}
function traiteDeclaration1(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomVariable='';
    t+=ajouteCommentaireAvant(element,niveau);
    var decl={};
    for(decl in element.declarations){
        if(t !== ''){

            t+=',';
        }
        var debutDeclaration='';
        debutDeclaration='\n' + esp0 + 'declare(' + element.declarations[decl].id.name + ' , ';
        nomVariable=element.declarations[decl].id.name;
        if(element.declarations[decl].init){

            if('Literal' === element.declarations[decl].init.type){

                t+=((debutDeclaration + element.declarations[decl].init.raw)) + ')';
            }else if('Identifier' === element.declarations[decl].init.type){

                t+=((debutDeclaration + element.declarations[decl].init.name)) + ')';
            }else if('MemberExpression' === element.declarations[decl].init.type){

                var obj1 = traiteMemberExpression1(element.declarations[decl].init,niveau,element,'');
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteDeclaration1 928 ' + element.type,element:element}));
                }
            }else if('CallExpression' === element.declarations[decl].init.type){

                var obj1 = traiteCallExpression1(element.declarations[decl].init,niveau,element,{});
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteDeclaration1 935 ' + element.type,element:element}));
                }
            }else if('ObjectExpression' === element.declarations[decl].init.type){

                var obj1 = traiteObjectExpression1(element.declarations[decl].init,niveau);
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 534',element:element}));
                }
            }else if('UnaryExpression' === element.declarations[decl].init.type){

                if((element.declarations[decl].init.argument) && (element.declarations[decl].init.argument.type === 'Literal')){

                    t+=((debutDeclaration + element.declarations[decl].init.operator + element.declarations[decl].init.argument.raw)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pas de callee dans traiteCallExpression1 517',element:element}));
                }
            }else if('LogicalExpression' === element.declarations[decl].init.type){

                var obj = traiteLogicalExpression1(element.declarations[decl].init,niveau,false);
                if(obj.__xst === true){

                    if(obj.__xva.substr(0,1) === ','){

                        t+=debutDeclaration + 'condition(' + obj.__xva.substr(1) + '))';
                    }else{
                        t+=debutDeclaration + 'condition(' + obj.__xva + '))';
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteCondition1 1545 '}));
                }
            }else if('NewExpression' === element.declarations[decl].init.type){

                var obj1 = traiteCallExpression1(element.declarations[decl].init,niveau,element,{});
                if(obj1.__xst === true){

                    t+=debutDeclaration + 'new(' + obj1.__xva + '))';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour traiteDeclaration1 1551 ' + element.type,element:element}));
                }
            }else if('ArrayExpression' === element.declarations[decl].init.type){

                var obj1 = traiteArrayExpression1(element.declarations[decl].init,niveau);
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 1559',element:element}));
                }
            }else if('BinaryExpression' === element.declarations[decl].init.type){

                var obj1 = traiteBinaryExpress1(element.declarations[decl].init,niveau,false,false);
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 1568 ',element:element}));
                }
            }else if('ConditionalExpression' === element.declarations[decl].init.type){

                var obj1 = traiteConditionalExpression1(element.declarations[decl].init,niveau);
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 1662 ',element:element}));
                }
            }else if('TemplateLiteral' === element.declarations[decl].init.type){

                var obj1 = traiteTemplateLiteral1(element.declarations[decl].init,niveau);
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 1662 ',element:element}));
                }
            }else if('FunctionExpression' === element.declarations[decl].init.type){

                var obj1 = traiteFunctionExpression1(element.declarations[decl].init,niveau,element.declarations[decl],'');
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0147 ',element:element}));
                }
            }else if(('UpdateExpression' === element.declarations[decl].init.type) || ("ThisExpression" === element.declarations[decl].init.type) || ("AssignmentExpression" === element.declarations[decl].init.type) || ("AwaitExpression" === element.declarations[decl].init.type)){

                var obj1 = traiteUneComposante(element.declarations[decl],niveau,false,false);
                if(obj1.__xst === true){

                    t+=((debutDeclaration + obj1.__xva)) + ')';
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteArrayExpression1 1111',element:element}));
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteDeclaration1 1565 ' + element.declarations[decl].init.type,element:element}));
            }
        }else{
            t+=debutDeclaration + 'obj())';
        }
    }
    return({__xst:true,__xva:t,'nomVariable':nomVariable});
}
function traiteTemplateLiteral1(element,niveau){
    var t='';
    if((element.quasis)
     && (element.quasis.length === 1)
     && ('TemplateElement' === element.quasis[0].type)
     && (element.quasis[0].value)
     && (element.quasis[0].value.raw)){

        t='`' + element.quasis[0].value.raw + '`';
    }else{
        
        return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteTemplateLiteral1 2131 ' + element.type,element:element}));
    }
    return({__xst:true,__xva:t});
}
function traiteTry1(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    t+='\n' + esp0 + 'essayer(';
    t+='\n' + esp0 + esp1 + 'faire(';
    niveau+=2;
    var obj = TransformAstEnRev(element.block.body,niveau);
    if(obj.__xst === true){

        t+='\n' + esp0 + esp1 + esp1 + esp1 + obj.__xva;
    }else{
        return(astjs_logerreur({__xst:false,__xme:'erreur pour ' + element.type,element:element}));
    }
    niveau-=2;
    t+='\n' + esp0 + esp1 + '),';
    t+='\n' + esp0 + esp1 + 'sierreur(';
    if((element.handler) && (element.handler.type === 'CatchClause')){

        if((element.handler.param) && (element.handler.param.type === 'Identifier')){

            t+='\n' + esp0 + esp1 + esp1 + element.handler.param.name + ',';
        }else{
            return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteTry1 1021, il manque le nom de la variable capturant l\'erreur : erreur pour ' + element.type,element:element}));
        }
        if((element.handler.body) && (element.handler.body.type === 'BlockStatement')){

            niveau+=2;
            var obj = TransformAstEnRev(element.handler.body,niveau);
            niveau-=2;
            if(obj.__xst === true){

                t+='\n' + esp0 + esp1 + esp1 + 'faire(';
                if(obj.__xva === ''){

                    t+=')';
                }else{
                    t+='\n' + esp0 + esp1 + esp1 + esp1 + obj.__xva;
                    t+='\n' + esp0 + esp1 + esp1 + ')';
                }
            }else{
                return(astjs_logerreur({__xst:false,__xme:'erreur pour ' + element.type,element:element}));
            }
        }
    }
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({__xst:true,__xva:t});
}
/*
  =====================================================================================================================
*/
function ajouteCommentaireAvant(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var i = (tabComment.length - 1);
    for(i=tabComment.length - 1;i >= 0;i=i - 1){
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
                        if(txtComment.substr(0,1)==='*' || txtComment.substr(0,1)==='#' ){
                            t='\n' + esp0 + '#(#' + txtComment.substr(1) + ')' + t;
                        }else{

                            t='\n' + esp0 + '#(' + txtComment + ')' + t;
                        }
                    }else{
                        if(txtComment.substr(0,1)==='*' || txtComment.substr(0,1)==='#' ){
                            t='\n' + esp0 + '#(#' + txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']') + ')' + t;
                        }else{
                            t='\n' + esp0 + '#(' + txtComment.replace(/\(/g,'[').replace(/\)/g,']') + ')' + t;
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
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if( !(Array.isArray(les_elements))){

        les_elements=[les_elements];
    }
    if(les_elements.length){

        var i=0;
        for(i=0;i < les_elements.length;i++){
            var element=les_elements[i];
            if(i < (les_elements.length - 1)){

                if(les_elements[i + 1].hasOwnProperty('range')){

                    positionDebutBlocSuivant=les_elements[i + 1].range[0];
                }else if(les_elements[i + 1].hasOwnProperty('start')){

                    positionDebutBlocSuivant=les_elements[i + 1].start;
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
                if((element.async) && (element.async === true)){

                    t+='\n' + esp0 + esp1 + esp1 + 'asynchrone()';
                }
                if((element.params) && (element.params.length > 0)){

                    t+=',';
                    var j=0;
                    for(j=0;j < element.params.length;j++){
                        if(element.params[j].type === "Identifier"){

                            t+='\n' + esp0 + esp1 + esp1 + 'argument(' + element.params[j].name + ')';
                        }else if(element.params[j].type === "AssignmentPattern"){

                            var obj = traiteAssignmentPattern(element.params[j],niveau,{});
                            if(obj.__xst === true){

                                t+='\n' + esp0 + esp1 + esp1 + 'argument(' + obj.__xva + ')';
                            }else{
                                return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 2101 type argument non prévu ' + element.params[j].type,element:element}));
                            }
                        }else{
                            return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 2053 type argument non prévu ' + element.params[j].type,element:element}));
                        }
                        if(j < (element.params.length - 1)){

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
                        niveau=niveau + 1;
                        var obj = TransformAstEnRev(element[prop],niveau);
                        niveau=niveau - 1;
                        if(obj.__xst === true){

                            t+=obj.__xva;
                        }else{
                            return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 229 ' + element.type,element:element}));
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
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 471 ' + element.type,element:element}));
                }
            }else if('IfStatement' === element.type){

                var objif = traiteIf1(element,niveau,'if');
                if(objif.__xst === true){

                    t+=objif.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 261 ' + element.type,element:element}));
                }
            }else if('ForInStatement' === element.type){

                var objFor = traiteForIn1(element,niveau);
                if(objFor.__xst === true){

                    t+=objFor.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 2442 ' + element.type,element:element}));
                }
            }else if('DoWhileStatement' === element.type){

                var objDo = traiteDo1(element,niveau);
                if(objDo.__xst === true){

                    t+=objDo.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 02449 ' + element.type,element:element}));
                }
            }else if('ForStatement' === element.type){

                var objFor = traiteFor1(element,niveau);
                if(objFor.__xst === true){

                    t+=objFor.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 2457 ' + element.type,element:element}));
                }
            }else if('ExpressionStatement' === element.type){

                var objexp1 = traiteExpression1(element,niveau);
                if(objexp1.__xst === true){

                    t+='\n' + esp0 + objexp1.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 1036 ' + element.type,element:element}));
                }
            }else if('ReturnStatement' === element.type){

                if(element.argument === null){

                    t+='\n' + esp0 + 'revenir()';
                }else if((element.argument) && (element.argument.type === 'CallExpression')){

                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{'sansLF':true});
                    if(obj1.__xst === true){

                        t+='\n' + esp0 + 'retourner(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur TransformAstEnRev 1221 ',element:element}));
                    }
                }else if((element.argument) && (element.argument.type === 'ObjectExpression')){

                    var obj1 = traiteObjectExpression1(element.argument,niveau);
                    if(obj1.__xst === true){

                        t+='\n' + esp0 + 'retourner(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur dans TransformAstEnRev 1963',element:element}));
                    }
                }else if((element.argument) && ((element.argument.type === 'ArrayExpression') || (element.argument.type === 'AssignmentExpression') || (element.argument.type === 'FunctionExpression') || (element.argument.type === 'ConditionalExpression') || (element.argument.type === 'LogicalExpression') || (element.argument.type === 'Identifier') || (element.argument.type === 'Literal') || (element.argument.type === 'BinaryExpression') || (element.argument.type === 'MemberExpression') || (element.argument.type === 'NewExpression') || (element.argument.type === 'UnaryExpression'))){

                    var obj1 = traiteUneComposante(element.argument,niveau,false,false);
                    if(obj1.__xst === true){

                        t+='\n' + esp0 + 'retourner(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur dans TransformAstEnRev 1978 ',element:element}));
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 1044 ' + element.argument.type,element:element}));
                }
            }else if('TryStatement' === element.type){

                var objtry1 = traiteTry1(element,niveau);
                if(objtry1.__xst === true){

                    t+=objtry1.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 1055 ' + element.type,element:element}));
                }
            }else if('BreakStatement' === element.type){

                t+='\n' + esp0 + 'break()';
            }else if('DebuggerStatement' === element.type){

                t+='\n' + esp0 + 'debugger()';
            }else if('ContinueStatement' === element.type){

                t+='\n' + esp0 + 'continue()';
            }else if('ThrowStatement' === element.type){

                if(element.argument.type === 'Identifier'){

                    t+='\n' + esp0 + 'throw(' + element.argument.name + ')';
                }else if(element.argument.type === 'CallExpression'){

                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{});
                    if(obj1.__xst === true){

                        t+='\n' + esp0 + 'throw(' + obj1.__xva + ')';
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 1994 ' + element.argument.type,element:element}));
                    }
                }else if(element.argument.type === 'NewExpression'){

                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{});
                    if(obj1.__xst === true){

                        t+='\n' + esp0 + 'throw(new(' + obj1.__xva + '))';
                    }else{
                        return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 1994 ' + element.argument.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 2185 "' + element.argument.type + '"',element:element}));
                }
            }else if('EmptyStatement' === element.type){

                t+='\n' + esp0 + '#(un point virgule est-il en trop ?)';
            }else if('WhileStatement' === element.type){

                var objWhile = traiteWhile1(element,niveau);
                if(objWhile.__xst === true){

                    t+=objWhile.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 1929 ' + element.type,element:element}));
                }
            }else if('SwitchStatement' === element.type){

                var objSwitch = traiteSwitch1(element,niveau);
                if(objSwitch.__xst === true){

                    t+=objSwitch.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour TransformAstEnRev 1972 ' + element.type,element:element}));
                }
            }else if('BlockStatement' === element.type){

                var obj = TransformAstEnRev(element.body,niveau);
                if(obj.__xst === true){

                    t+=obj.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'2311 erreur TransformAstEnRev BlockStatement ',element:element}));
                }
            }else if('ClassDeclaration' === element.type){

                var nom_de_la_classe='';
                var super_classe='';
                var corps_de_la_classe='';
                if(element.id){

                    if("Identifier" === element.id.type){

                        nom_de_la_classe=element.id.name;
                    }else{
                        astjs_logerreur({__xst:false,__xme:'erreur2289 le nom de la classe n\'est pas un identifiant ' + element.id.type,element:element});
                    }
                }else{
                    astjs_logerreur({__xst:false,__xme:'erreur2288 il manque id pour la définition de la classe ' + element.type,element:element});
                }
                if((element.body) && (element.body.type === "ClassBody") && (element.body.body) && (element.body.body.length > 0)){

                    var j=0;
                    for(j=0;j < element.body.body.length;j++){
                        var obj = TransformAstEnRev(element.body.body[j],(niveau + 1));
                        if(obj.__xst === true){

                            corps_de_la_classe+=obj.__xva;
                        }else{
                            return(astjs_logerreur({__xst:false,__xme:'2308 erreur pour le corps de la classe ',element:element}));
                        }
                    }
                }
                t+='definition_de_classe(nom_classe(' + nom_de_la_classe + '),contenu(' + corps_de_la_classe + '))';
            }else if(('MethodDefinition' === element.type) || ("PropertyDefinition" === element.type) || ("ExportNamedDeclaration" === element.type)){

                var obj1 = traiteUneComposante(element,niveau,false,false);
                if(obj1.__xst === true){

                    t+=obj1.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur dans traiteUneComposante 0076',element:element}));
                }
            }else{
                astjs_logerreur({__xst:false,__xme:'erreur 0922 pour ' + element.type,element:element});
                console.error('non pris en compte element.type=' + element.type,element);
                var prop={};
                for(prop in element){
                    if(prop === 'body'){

                        bodyTrouve=true;
                        var obj = TransformAstEnRev(element[prop],niveau);
                        if(obj.__xst === true){

                            t+=obj.__xva;
                        }else{
                            return(astjs_logerreur({__xst:false,__xme:'erreur pour ' + element.type,element:element}));
                        }
                    }
                }
            }
        }
    }else{
        /*
          on ne devrait plus passer par ici
        */
        if(les_elements.type === 'BlockStatement'){

            if(les_elements.body){

                niveau=niveau + 1;
                var obj = TransformAstEnRev(les_elements.body,niveau);
                if(obj.__xst === true){

                    t+=obj.__xva;
                }else{
                    return(astjs_logerreur({__xst:false,__xme:'erreur pour ' + les_elements,element:element}));
                }
                niveau=niveau - 1;
            }else{
                console.log('Pas de body pour ' + les_elements.type);
            }
        }
    }
    return({__xst:true,__xva:t});
}

/*
  =====================================================================================================================
*/
function analyse_fichier_log_acorn(jsonRet){
 
 
    var numero_de_ligne=-1;
    var position=-1;
    var caractere_incorrecte='';
    if(jsonRet.fichier_erreur.indexOf('loc: Position')>=0){
     var temp=jsonRet.fichier_erreur.substr(jsonRet.fichier_erreur.indexOf('loc: Position')+14);
     if(temp.indexOf('}')>=0){
      temp=temp.substr(0,temp.indexOf('}')+1);
      try{
       var temp=temp.replace(/ /g,'');
       var temp=temp.replace(/line/g,'"line"');
       var temp=temp.replace(/column/g,'"column"');
       var tt=JSON.parse(temp);
       if(tt.hasOwnProperty('line')){
        numero_de_ligne=tt.line-1;
       }
//                       console.log(tt);
      }catch(e){
//                       console.error(e);
      }
     }
    }
    if(jsonRet.fichier_erreur.indexOf('pos: ')>=0){
     var temp=jsonRet.fichier_erreur.substr(jsonRet.fichier_erreur.indexOf('pos: ')+5);
     if(temp.indexOf(',')>=0){
      temp=temp.substr(0,temp.indexOf(','));
      try{
          position=parseInt(temp,10);
          if(jsonRet.__entree && jsonRet.__entree.texteSource){
           if(jsonRet.__entree.texteSource.length>=position){
            caractere_incorrecte=jsonRet.__entree.texteSource.substr(position,1);
            logerreur({__xst:false,__xme:'erreur dans un source javascript caractere_incorrecte="'+caractere_incorrecte+'"'});
            if(position-15>0){
             logerreur({__xst:false,__xme:'erreur dans un source javascript proche de="'+jsonRet.__entree.texteSource.substr(position-15,30).replace(/\n/g,'\\n')+'"',plage:[position,position]});
            }else{
             logerreur({__xst:false,__xme:'erreur dans un source javascript proche de="'+jsonRet.__entree.texteSource.substr(0,30)+'"',plage:[position,position]});
            }
            return({__xst:true});
           }
          }

      }catch(e){
      }
     }
    }
    

    return({__xst:false});
}

/*
  =====================================================================================================================
  Appel SYNCHRONE à la transformation de source js en ast
  =====================================================================================================================
*/
function recupere_ast_de_source_js_en_synchrone(texteSource){
    var texte_source_mini=texteSource.trim();
    if(texte_source_mini===''){
        return({__xst:true,'__xva':{"type":"Program","start":0,"end":1,"range":[0,1],"body":[],"sourceType":"module"},'commentaires':[]});
    }else if(texte_source_mini==='//'){
        return({__xst:true,'__xva':{"type":"Program","start":0,"end":3,"range":[0,3],"body":[],"sourceType":"module"},'commentaires':[{"type":"Line","value":"","start":1,"end":3,"range":[1,3]}]});
    }
    
    var r= new XMLHttpRequest();
    r.onerror=function(e){
        console.error('e=',e);
        return({__xst:false});
    };
    var ajax_param={'call':{'lib':'js','file':'ast','funct':'recupererAstDeJs'},'texteSource':texteSource};
    try{
    /*
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      ATTENTION appel "SYNCHRONE" à la récupération ast, le r.open a comme dernier paramètre : false
      on fait ceci car quand un html contient du javascript, on convertit ce dernier à la volée
      Remarque : le html peut aussi être dans un php ....
      Ce sera à modifier plus tard ...
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
    */

        r.open("POST",'za_ajax.php?recupererAstDeJs',false);
        r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        r.send('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param)));
    }catch(e){
        console.error('e=',e);
        logerreur({__xst:false,__xme:' conv js 3127  message='+e.message});
        return({__xst:false,__xme:' conv js message='+e.message});
    }
    if(r.readyState === 4){
        if(r.status===404){
            logerreur({__xst:false,__xme:' === <b>Vérifiez l\'url de l\'appel synchrone </b> === , conv js 3131 url non trouvée '});
            return({__xst:false,__xme:'conv js 3131url non trouvée '});
            
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            
        }catch(erreur_json){
            logerreur({__xst:false,__xme:' conv js 3141 erreur de réception de données, erreur_json= '+erreur_json.message});
            return({__xst:false,__xme:' conv js 3141 erreur de réception de données, erreur_json= '+erreur_json.message});
            
        }
        if(jsonRet.__xst === true){

            var elem={};
            for(elem in jsonRet.messages){
                logerreur({__xst:true,__xme:'<pre>' + jsonRet.messages[elem].replace(/&/g,'&lt;') + '</pre>'});
            }
            return({__xst:true,'__xva':JSON.parse(jsonRet.__xva),'commentaires':JSON.parse(jsonRet.commentaires)});
        }else{
            if(jsonRet.fichier_erreur){
               var obj=analyse_fichier_log_acorn(jsonRet);
               if(obj.__xst===true){
               }else{
                
                  console.error(jsonRet.fichier_erreur);
                  console.error(jsonRet.__entree.texteSource);
                  
                  logerreur({__xst:false,__xme:'erreur dans un source javascript'});
                  return(logerreur({__xst:false,__xme:jsonRet.fichier_erreur}));
               }
            }
            return({__xst:false,__xme:'convertit js en rev erreur dans le source js '});
        }
    }else{
        return({__xst:false});
    }
}
/*
  =====================================================================================================================
*/
function convertit_source_javascript_en_rev(sourceDuJavascript){
    var t='';
    try{
        var obj1 = recupere_ast_de_source_js_en_synchrone(sourceDuJavascript);
        if(obj1.__xst === true){

            tabComment=obj1.commentaires;
            var obj = TransformAstEnRev(obj1.__xva.body,0);
            if(obj.__xst === true){

                t=obj.__xva;
            }else{
                return(logerreur({__xst:false,__xme:'erreur convertit_source_javascript_en_rev 2733'}));
            }
        }else{
            return(logerreur({__xst:false,__xme:'erreur convertit_source_javascript_en_rev 2611'}));
        }
        return({__xst:true,__xva:t});
    }catch(e){
        console.log('erreur de conversion de source',e);
        return(logerreur({__xst:false,__xme:'erreurconvertit_source_javascript_en_rev e=' + e.message}));
    }
    return({__xst:true,__xva:t});
}
var tabComment = [];
/*
  =====================================================================================================================
*/
function traitement_apres_recuperation_ast_de_js_avec_acorn(donnees_en_entree){
    var texte_source_ast=donnees_en_entree.__xva.__xva;
    try{
        var ast_json = JSON.parse(texte_source_ast);
        if((ast_json.type === 'Program') && (ast_json.body)){

            var startMicro = performance.now();
            tabComment=JSON.parse(donnees_en_entree.__xva.commentaires);
            var obj = TransformAstEnRev(ast_json.body,0);
            if(obj.__xst === true){

                if(donnees_en_entree.__xva.__entree.options.options.nom_de_la_text_area_rev){

                    document.getElementById(donnees_en_entree.__xva.__entree.options.options.nom_de_la_text_area_rev).value=obj.__xva;
                    var obj1 = functionToArray(obj.__xva,true,false,'');
                    if(obj1.__xst === true){

                        var endMicro = performance.now();
                        console.log('mise en tableau endMicro=',(parseInt((((endMicro - startMicro)) * 1000),10) / 1000) + ' ms');
                        astjs_logerreur({__xst:true,__xme:'pas d\'erreur pour le rev ' + (parseInt((((endMicro - startMicro)) * 1000),10) / 1000) + ' ms'});
                        var resJs = parseJavascript0(obj1.__xva,1,0);
                        if(resJs.__xst === true){

                            document.getElementById('txtar3').value=resJs.__xva;
                        }else{
                            astjs_logerreur({__xst:true,__xme:'2586 erreur de conversion de rev en javascript'});
                            __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar2');
                            return;
                        }
                    }
                }
            }else{
                __gi1.remplir_et_afficher_les_messages1('zone_global_messages','txtar1');
                return;
            }
        }else{
        }
    }catch(e){
        console.error('e=',e);
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
}
/*
  =====================================================================================================================
*/
function recupere_ast_de_js_avec_acorn(texteSource,options,fonction_a_lancer_apres_traitement){


    
    var ajax_param={'call':{'lib':'js','file':'ast','funct':'recupererAstDeJs'},'texteSource':texteSource,'options':options};
    
    async function recupererAstDeJs1(url="",ajax_param){
        return(__gi1.recupérer_un_fetch(url,ajax_param));
    }
    recupererAstDeJs1('za_ajax.php?recupererAstDeJs',ajax_param).then((donnees) => {
     if(donnees.__xst===true){
         var elem={};
         for(elem in donnees.__xms){
             logerreur({__xst:true,__xme:'<pre>' + donnees.__xms[elem].replace(/&/g,'&lt;') + '</pre>'});
         }
         fonction_a_lancer_apres_traitement({__xst:true,__xva:donnees});
         return({__xst:true});
      
     }else{
         var elem={};
         for(elem in donnees.__xms){
             logerreur({__xst:false,__xme:'<pre>' + donnees.__xms[elem].replace(/&/g,'&lt;') + '</pre>'});
         }
         if(donnees.fichier_erreur){
             var obj=analyse_fichier_log_acorn(donnees);
             if(obj.__xst===true){
             }else{
              logerreur({__xst:false,__xme:'<pre>' + donnees.fichier_erreur.replace(/&/g,'&lt;').replace(/\n/,'<br />') + '</pre>'});
             }
             

         }
         if(donnees.hasOwnProperty('__entree')
           && donnees.__entree.hasOwnProperty('options')
           && donnees.__entree.options.hasOwnProperty('options')
           && donnees.__entree.options.options.hasOwnProperty('nom_de_la_text_area_source')
         ){
           __gi1.remplir_et_afficher_les_messages1('zone_global_messages',donnees.__entree.options.options.nom_de_la_text_area_source);
         }else{
           __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
         }
//                console.log(r);
         return({__xst:true,__xme:'3372'});
      
     }
    });
    return({__xst:true});
}

/*
  =====================================================================================================================
*/
function transform_source_js_en_rev_avec_acorn(source,options){
    var ret={__xst:true,__xme:true};
    try{
        var ret = recupere_ast_de_js_avec_acorn(source,{options:options},traitement_apres_recuperation_ast_de_js_avec_acorn);
        if(ret.__xst === true){

        }else{
            logerreur({__xst:false,__xme:'il y a une erreur d\'envoie du source js à convertir'});
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
            ret.__xst=false;
        }
    }catch(e){
        console.log('erreur transform 2424',e);
        ret.__xst=false;
    }
    return ret;
}
/*
  =====================================================================================================================
*/
function transform_textarea_js_en_rev_avec_acorn(nom_de_la_text_area_source,nom_de_la_text_area_rev){
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_de_la_text_area_source);
    localStorage.setItem('fta_indexhtml_javascript_dernier_fichier_charge',a.value);
    var obj = transform_source_js_en_rev_avec_acorn(a.value,{nom_de_la_text_area_source:nom_de_la_text_area_source,nom_de_la_text_area_rev:nom_de_la_text_area_rev});
    if(obj.__xst === true){

    }else{
        astjs_logerreur({__xst:false,__xme:'2446 erreur '});
    }
}
function chargerSourceDeTestJs(){
    var t=`
var test=a===2;
var test=a==2;
test=a===2;
test=a==2;
    /*
    
a.b("c").d += '<e f="g">' + h.i[i] + "</e>";

for (var i = 0; i < b; i++) {
  a.b("c").d += '<e>' + h.i[i] + "</e>";
}
t = " ".repeat(NBESPACESSOURCEPRODUIT * i);
t += " ".repeat(NBESPACESSOURCEPRODUIT * i);



//==========================================================================================
//testé
function traiteCommentaire2(texte, niveau, ind) {
  var s = "";
  s = traiteCommentaireSourceEtGenere1(texte, niveau, ind, NBESPACESSOURCEPRODUIT, false);
  return s;
}

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
function chargerLeDernierSourceJs(){
    var fta_indexhtml_javascript_dernier_fichier_charge = localStorage.getItem('fta_indexhtml_javascript_dernier_fichier_charge');
    if(fta_indexhtml_javascript_dernier_fichier_charge !== null){

        document.getElementById('txtar1').value=fta_indexhtml_javascript_dernier_fichier_charge;
    }
}