"use strict";

/*
  =====================================================================================================================
  conversion d'un ast produit acorn https://github.com/acornjs/acorn en rev
  point d'entrée = traite_ast, #traite_element
  =====================================================================================================================
*/
class module_conversion_ast_de_js_acorn_vers_rev1{
    #nom_de_la_variable='';
    #options_traitement=null;
    /*
      =============================================================================================================
      le seul argument est pour l'instant le nom de la variable qui est déclarée
    */
    constructor(nom_de_la_variable){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    /*
      =============================================================================================================
    */
    #astjs_logerreur(o){
        logerreur(o);
        /*
          if(o.hasOwnProperty('element') && o.element.hasOwnProperty('loc') && o.element.loc.hasOwnProperty('start') ){
          if(global_messages['lines'].length<5){
          global_messages['lines'].push(o.element.loc.start.line);
          }
          }
        */
        return o;
    }
    /*
      =============================================================================================================
    */
    #traite_FunctionExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let id='';
        let contenu='';
        let les_arguments='';
        let asynchrone='';
        let le_commentaire='';
        if(element.async !== false){
            asynchrone='asynchrone(),';
        }
        if(element.expression !== false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0044 #traite_FunctionExpression expression' ,"element" : element}));
        }
        if(element.generator !== false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0047 #traite_FunctionExpression generator' ,"element" : element}));
        }
        if(element.id){
            obj=this.#traite_element(element.id,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                id+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0055 #traite_FunctionExpression' ,"element" : element}));
            }
        }
        if(element.params && Array.isArray(element.params)){
            if(element.params.length === 0){
                les_arguments=',p()';
            }else{
                for( let i=0 ; i < element.params.length ; i++ ){
                    le_commentaire=this.#comm_dans_arguments_appel_fonction(element.params[i],niveau,element,tab_comm);
                    obj=this.#traite_element(element.params[i],niveau + 1,element,tab_comm);
                    if(obj.__xst === true){
                        les_arguments+=',p(' +le_commentaire+ obj.__xva + ')';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0123 #traite_CallExpression' ,"element" : element}));
                    }
                }
            }
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0055 #traite_FunctionExpression' ,"element" : element}));
            }
        }
        if(id !== ''){
            t+='appelf(' + asynchrone + 'id(' + id + '),nomf(function),contenu(' + contenu + ')' + les_arguments + ')';
        }else{
            t+='appelf(' + asynchrone + 'nomf(function),contenu(' + contenu + ')' + les_arguments + ')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_CallExpression(element,niveau,parent,tab_comm){
        let t='';
        let auto_appelee='';
        let les_arguments='';
        let nom_fonction='';
        var i=0;
        var j=0;
        var k=0;
        element.auto_appelee=false;
        var parentProperty='';
        if(element.callee){
            if(element.callee.params && element.arguments && Array.isArray(element.callee.params) && Array.isArray(element.arguments)){
                auto_appelee='auto_appelee(3),';
                element.auto_appelee=true;
            }
        }
        if(parent.property){
            if(parent.computed && parent.computed === true){
                /* le parent est un tableau => les propriétés sont les indices du tableau */
            }else{
                if(parent.property.type === 'Identifier'){
                    parentProperty='prop(' + parent.property.name + ')';
                    parent.property=null;
                }else if(parent.property.type === 'Literal'){
                    parentProperty='prop(' + parent.property.raw + ')';
                    parent.property=null;
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 0514 ' + parent.property.type ,"element" : element}));
                }
            }
        }
        var lesArguments='';
        if(element.arguments && element.arguments.length > 0){
            for( i=0 ; i < element.arguments.length ; i++ ){
                lesArguments+=',';
                var le_commentaire = '';
                if(auto_appelee!==''){
                   le_commentaire=this.#comm_dans_arguments_appel_fonction(element.arguments[i],niveau,element,tab_comm);
                }
                
                if('CallExpression' === element.arguments[i].type){
                    var obj1 = this.#traite_CallExpression(element.arguments[i],niveau + 1,element,tab_comm);
                    if(obj1.__xst === true){
                        if(obj1.__xva.substr(0,6) === 'defTab'){
                            lesArguments+='p(' + le_commentaire + obj1.__xva + ')';
                        }else if(obj1.__xva.substr(0,6) === 'appelf'){
                            lesArguments+='p(' + le_commentaire + obj1.__xva + ')';
                        }else{
                            lesArguments+='p(' + le_commentaire + 'appelf(' + obj1.__xva + '))';
                        }
                    }else{
                        console.error('Dans traiteCallExpression1 element=',element);
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteCallExpression1 479 ' ,"element" : element}));
                    }
                }else{
                    var obj1 = this.#traite_element(element.arguments[i],niveau + 1,element,tab_comm);
                    if(obj1.__xst === true){
                        if('FunctionExpression' === element.arguments[i].type
                         && parent
                         && parent.callee
                         && parent.callee.type
                         && parent.callee.type === 'FunctionExpression'
                        ){
                            console.log('%c VERIFIER ajouter des parenthèses pour les arguments ','color:red;background:pink;');
                            /* on ajoute une parenthèse */
                            lesArguments+='p(' + le_commentaire + obj1.__xva + ')';
                        }else{
                            lesArguments+='p(' + le_commentaire + obj1.__xva + ')';
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
        lesArguments=lesArguments + auto_appelee;
        
        var contenu='';
        var le_contenu='';
        if(element.body){
            var obj = this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
            if(obj.__xst === true){
                contenu=obj.__xva;
                if(contenu !== ''){
                    le_contenu=',contenu(' + contenu + ')';
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 pour body' ,"element" : element}));
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
                                    t+='appelf(nomf(tableau(nomt(' + element.callee.object.name + '),p(' + element.callee.property.raw + ')))' + lesArguments + ')';
                                }else{
                                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1411 ' ,"element" : element}));
                                }
                            }
                        }else if(element.callee.property.type === 'Identifier'
                         && element.callee.hasOwnProperty('computed')
                         && element.callee.computed === true
                        ){
                            /* a[b](x) */
                            t+='appelf(nomf(tableau(nomt(' + element.callee.object.name + '),p(' + element.callee.property.name + ')))' + lesArguments + le_contenu + ')';
                        }else{
                            t+='appelf(element(' + element.callee.object.name + '),nomf(' + nom_de_la_fonction + ')' + lesArguments + le_contenu + ')';
                        }
                    }else if(element.callee.object && element.callee.object.type === 'Literal'){
                        t+='appelf(element(' + element.callee.object.raw + '),nomf(' + nom_de_la_fonction + ')' + lesArguments + le_contenu + ')';
                    }else if(element.callee.object && 'ArrayExpression' === element.callee.object.type){
                        if(element.callee.property.type === 'Identifier'){
                            /* cas ([f(3160).forEach,f(1654)]).forEach(function(x){a=1;}); */
                            element.callee.property=null;
                        }
                        var obj1 = this.#traite_ArrayExpression(element.callee.object,niveau,element.callee,tab_comm);
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
                            var obj1 = this.#traite_MemberExpression(element.callee.object,niveau,element.callee,tab_comm);
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
                                laPropriete='#(to' + 'do verifier convertit_js_en-rev 1230 ),prop(appelf(nomf(' + nom_de_la_fonction + ')' + lesArguments + ',contenu(' + contenu + ')))';
                            }
                        }
                    }
                }else if(element.callee.property.type === 'MemberExpression'){
                    /* ce sera traité plus bas dans le                     if(element.callee.object){ */
                }else if(element.callee.property.type === 'Literal'){
                    debugger;
                }else if(element.callee.property.type === 'ConditionalExpression'){
                    var obj1 = this.#traite_ConditionalExpression(element.callee.property,niveau,element.callee,tab_comm);
                    if(obj1.__xst === true){
                        if(element.callee.hasOwnProperty('computed') && element.callee.computed === true){
                            if(element.callee.object.type === 'MemberExpression'){
                                var obj2 = this.#traite_MemberExpression(element.callee.object,niveau,element.callee,tab_comm);
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
                    var obj1 = this.#traite_CallExpression(element.callee.object,niveau + 1,element,tab_comm);
                    if(obj1.__xst === true){
                        if(obj1.__xva.substr(0,6) === 'appelf' && obj1.__xva.substr(obj1.__xva.length - 1,1) === ')'){
                            t+='' + (obj1.__xva.substr(0,obj1.__xva.length - 1)) + ',' + laPropriete + ')';
                        }else if(obj1.__xva.substr(0,3) === 'new' && obj1.__xva.substr(obj1.__xva.length - 1,1) === ')'){
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
                    /*
                      c'est traité plus haut 
                    */
                }else if(element.callee.object.type === 'MemberExpression'){
                    var obj1 = this.#traite_MemberExpression(element.callee.object,niveau,element.callee,tab_comm);
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
                        var obj = this.#traite_MemberExpression(element.callee.property,niveau,element.callee,tab_comm);
                        if(obj.__xst === true){
                            if(element.callee.hasOwnProperty('computed') && element.callee.computed === true){
                                /* a[Symbol.iterator](); => appelf(nomf(a[Symbol.iterator])) */
                                t+='appelf(nomf(' + nom_de_l_objet + '[' + obj.__xva + '])' + lesArguments + le_contenu + ')';
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
                    t='appelf(element(this),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
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
                    t='appelf(nomf(import),' + lesArguments + ',' + laPropriete + le_contenu + ')';
                }else if(element.callee.object.type === 'Super'){
                    t='appelf(nomf(super),' + lesArguments + ',' + laPropriete + ')';
                }else if(element.callee.object.type === 'NewExpression'){
                    var obj1 = this.#traite_element(element.callee.object,niveau,element.callee,tab_comm);
                    if(obj1.__xst === true){
                        t=(obj1.__xva.substr(0,obj1.__xva.length - 2)) + ',' + lesArguments + ',' + laPropriete + '))';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteAssignmentExpress1 1385' ,"element" : element}));
                    }
                }else if(element.callee.object.type === 'BinaryExpression'){
                    var obj1 = this.#traite_element(element.callee.object,niveau,element.callee,tab_comm);
                    if(obj1.__xst === true){
                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1366 ' + element.callee.object.type ,"element" : element}));
                    }
                }else if(element.callee.object.type === 'FunctionExpression'){
                    var obj1 = this.#traite_FunctionExpression(element.callee.object,niveau,element,tab_comm);
                    if(obj1.__xst === true){
                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                    }
                }else if(element.callee.object.type === 'LogicalExpression'){
                    var obj1 = this.#traite_element(element.callee.object,niveau,element.callee,tab_comm);
                    if(obj1.__xst === true){
                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                    }
                }else if(element.callee.object.type === 'AssignmentExpression'){
                    var obj1 = this.#traite_element(element.callee.object,niveau,element.callee,tab_comm);
                    if(obj1.__xst === true){
                        t='appelf(element(' + obj1.__xva + '),nomf(' + prefixe + element.callee.property.name + ')' + lesArguments + le_contenu + ')';
                    }else{
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                    }
                }else if(element.callee.object.type === 'ConditionalExpression'){
                    var obj1 = this.#traite_element(element.callee.object,niveau,element.callee,tab_comm);
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
                    t+='appelf(nomf(' + element.callee.name + ')' + lesArguments + laPropriete + le_contenu + ')';
                }
            }else if(element.callee.type === 'CallExpression'){
                var obj1 = this.#traite_element(element.callee,niveau,element,tab_comm);
                if(obj1.__xst === true){
                    t='appelf(nomf(' + obj1.__xva + ')' + lesArguments + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1417 ' + element.callee.type ,"element" : element}));
                }
            }else if(element.callee.type === 'SequenceExpression'){
                var obj1 = this.#traite_element(element.callee,niveau,element,tab_comm);
                if(obj1.__xst === true){
                    t='appelf(nomf(' + obj1.__xva + ')' + lesArguments + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1417 ' + element.callee.type ,"element" : element}));
                }
            }else if(element.callee.type === 'ConditionalExpression'){
                var obj1 = this.#traite_ConditionalExpression(element.callee,niveau,element,tab_comm);
                if(obj1.__xst === true){
                    t='appelf(nomf(' + obj1.__xva + ')' + lesArguments + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0108 ' ,"element" : element}));
                }
            }else if(element.callee.type === 'FunctionExpression'){
                var obj1 = this.#traite_FunctionExpression(element.callee,niveau,element,tab_comm);
                if(obj1.__xst === true){
                    t+='appelf(nomf(' + obj1.__xva + ')' + lesArguments + laPropriete + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteUneComposante 0147 ' ,"element" : element}));
                }
            }else if(element.callee.type === 'Super'){
                t+='appelf(nomf(super)' + lesArguments + laPropriete + ')';
            }else if(element.callee.type === 'ArrowFunctionExpression'){
                var obj1 = this.#traite_element(element.callee,niveau,element,tab_comm);
                if(obj1.__xst === true){
                    t+='appelf(nomf(' + obj1.__xva + ')' + lesArguments + laPropriete + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur dans traiteCallExpression1 1417 ' + element.callee.type ,"element" : element}));
                }
            }else if(element.callee.type === 'ThisExpression'){
                var obj1 = this.#traite_element(element.callee,niveau,element,tab_comm);
                if(obj1.__xst === true){
                    t+='appelf(nomf(' + obj1.__xva + ')' + lesArguments + laPropriete + le_contenu + ')';
                }else{
                    return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur 0000 [ to' + 'do ajuster ] '}));
                }
            }else{
                return(astjs_logerreur({"__xst" : false ,"__xme" : '1627 erreur dans traiteCallExpression1 "' + element.callee.type + '"' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ArrowFunctionExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let contenu='';
        let id='';
        let les_arguments='';
        let est_expression=false;
        let asynchrone='';
        let le_commentaire='';
        if(element.async !== false){
            asynchrone='asynchrone(),';
        }
        est_expression=element.expression;
        if(element.generator !== false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0047 #traite_ArrowFunctionExpression generator' ,"element" : element}));
        }
        if(element.id){
            obj=this.#traite_element(element.id,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                id+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0099 #traite_ArrowFunctionExpression' ,"element" : element}));
            }
        }
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+='retourner(' + obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0130 #traite_ArrowFunctionExpression' ,"element" : element}));
                }
            }else{
                obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0097 #traite_ArrowFunctionExpression' ,"element" : element}));
                }
            }
        }
        if(element.params && Array.isArray(element.params)){
            if(element.params.length === 0){
                les_arguments=',p()';
            }else{
                for( let i=0 ; i < element.params.length ; i++ ){
                    le_commentaire=this.#comm_dans_arguments_appel_fonction(element.params[i],niveau,element,tab_comm);
                    obj=this.#traite_element(element.params[i],niveau + 1,element,tab_comm);
                    if(obj.__xst === true){
                        les_arguments+=',p(' +le_commentaire+ obj.__xva + ')';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0123 #traite_CallExpression' ,"element" : element}));
                    }
                }
            }
        }
        t+='appelf(' + asynchrone + 'flechee()' + les_arguments + ',contenu(' + contenu + '))';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ReturnStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let l_argument='';
        if(element.argument){
            obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                if(obj.__xva.substr(obj.__xva.length - 1,1) === ';'){
                    debugger;
                }
                l_argument+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0206 #traite_ReturnStatement' ,"element" : element}));
            }
        }
        if(l_argument === ''){
            t+='revenir()';
        }else{
            t+='retourner(' + l_argument + ')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_AssignmentExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';
        obj=this.#traite_element(element.left,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0134 #traite_AssignmentExpression' ,"element" : element}));
        }
        obj=this.#traite_element(element.right,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            droite+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0142 #traite_AssignmentExpression' ,"element" : element}));
        }
        if(element.operator === '='){
            t+='affecte(' + gauche + ' , ' + droite + ')';
        }else{
            t+='affectop(\'' + element.operator + '\' , ' + gauche + ' , ' + droite + ')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_BinaryExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';
        let nomDuTest='';
        let nouveauTableau=null;
        obj=this.#traite_element(element.left,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0279 #traite_BinaryExpression' ,"element" : element}));
        }
        obj=this.#traite_element(element.right,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            droite+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0287 #traite_BinaryExpression' ,"element" : element}));
        }
        nomDuTest=this.#recup_nom_operateur(element.operator);
        if(element.right.type === 'Literal'
         && (element.right.raw.substr(0,1) === "'"
         || element.right.raw.substr(0,1) === '"')
         && nomDuTest === 'plus'
         || element.left.type === 'Literal'
         && (element.left.raw.substr(0,1) === "'"
         || element.left.raw.substr(0,1) === '"')
         && nomDuTest === 'plus'
        ){
            t+='concat(' + gauche + ',' + droite + ')';
        }else{
            t+=nomDuTest + '(' + gauche + ',' + droite + ')';
        }
        if(t.substr(0,12) === 'plus(concat('){
            t='concat(' + (t.substr(5));
        }
        if(t.substr(0,13) === 'plus( concat('){
            t='concat(' + (t.substr(5));
        }
        if(t.substr(0,14) === 'concat(concat(' || t.substr(0,15) === 'concat( concat('){
            obj=functionToArray(t,true,false,'');
            if(obj.__xst === true){
                nouveauTableau=baisserNiveauEtSupprimer(obj.__xva,2,0);
                obj=a2F1(nouveauTableau,0,false,1);
                if(obj.__xst === true){
                    t=obj.__xva;
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0324 #traite_BinaryExpression ' ,"element" : element}));
            }
        }
        if(t.substr(0,10) === 'plus(plus('
         || t.substr(0,12) === 'moins(moins('
         || t.substr(0,10) === 'mult(mult('
         || t.substr(0,10) === 'divi(divi('
        ){
            obj=functionToArray(t,true,false,'');
            if(obj.__xst === true){
                nouveauTableau=baisserNiveauEtSupprimer(obj.__xva,2,0);
                obj=a2F1(nouveauTableau,0,false,1);
                if(obj.__xst === true){
                    t=obj.__xva;
                }
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_VariableDeclaration(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let nomVariable='';
        let debutDeclaration='';
        for(let decl in element.declarations){
            if(t !== ''){
                t+=',';
            }
            nomVariable='';
            if(element.declarations[decl].id){
                obj=this.#traite_element(element.declarations[decl].id,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    nomVariable=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0279 #traite_VariableDeclaration' ,"element" : element}));
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0387 #traite_VariableDeclaration' ,"element" : element}));
            }
            debutDeclaration='';
            if(element.kind && element.kind === 'var'){
                debutDeclaration='declare(' + nomVariable + ' , ';
            }else if(element.kind && element.kind === 'const'){
                debutDeclaration='declare_constante(' + nomVariable + ' , ';
            }else if(element.kind && element.kind === 'let'){
                debutDeclaration='declare_variable(' + nomVariable + ' , ';
            }else{
                debutDeclaration='declare(' + nomVariable + ' , ';
            }
            if(element.declarations[decl].init){
                obj=this.#traite_element(element.declarations[decl].init,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    t+=(debutDeclaration + obj.__xva) + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0279 #traite_BinaryExpression' ,"element" : element}));
                }
            }else{
                t+=debutDeclaration + 'null())';
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ObjectExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        for(let i in element.properties){
            if(t !== ''){
                t+=',';
            }
            t+=this.#comm_avant_debut1(element.properties[i],niveau,element,tab_comm);
            var val=element.properties[i];
            if(val.key.type === 'Identifier'){
                t+='(' + val.key.name + ',';
            }else if(val.key.type === 'Literal'){
                t+='(' + val.key.raw + ',';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '280 #traite_ObjectExpression "' + val.key.type + '"' ,"element" : element}));
            }
            obj=this.#traite_element(val.value,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                t+=obj.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0386 #traite_ObjectExpression'}));
            }
        }
        t='obj(' + t + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ArrayExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let ne_contient_que_des_constantes=true;
        let nombre_elements=0;
        let format_constante='';
        let commentaire='';
        t+='defTab(';
        let lesPar='';
        for(let i in element.elements){
            commentaire=this.#comm_avant_debut1(element.elements[i],niveau,element,tab_comm);
            if(commentaire !== ''){
                lesPar+=',' + commentaire;
            }
            if(element.elements[i].type === 'Literal'){
                lesPar+=',p(' + element.elements[i].raw + ')';
                if(element.elements[i].raw.substr(0,1) === '\''
                 || element.elements[i].raw.substr(0,1) === '"'
                 || element.elements[i].raw.substr(0,1) === '/'
                ){
                    ne_contient_que_des_constantes=false;
                }
                format_constante+= commentaire + '[' + element.elements[i].raw + ']';
                nombre_elements++;
            }else if(element.elements[i].type === 'Identifier'){
                lesPar+=',p(' + element.elements[i].name + ')';
                format_constante+=commentaire + '[' + element.elements[i].name + ']';
                nombre_elements++;
            }else{
                ne_contient_que_des_constantes=false;
                obj=this.#traite_element(element.elements[i],niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    lesPar+=',p(' + obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0388 #traite_ArrayExpression' ,"element" : element}));
                }
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
      =============================================================================================================
    */
    #traite_FunctionDeclaration(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let contenu='';
        let nom_fonction='';
        let les_arguments='';
        let asynchrone='';
        if(element.async !== false){
            asynchrone='asynchrone(),';
        }
        if(element.expression !== false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0458 #traite_FunctionDeclaration expression' ,"element" : element}));
        }
        if(element.generator !== false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0461 #traite_FunctionDeclaration generator' ,"element" : element}));
        }
        if(element.id){
            obj=this.#traite_element(element.id,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                nom_fonction+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0475 #traite_FunctionDeclaration' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0478 #traite_FunctionDeclaration' ,"element" : element}));
        }
        if(element.params && Array.isArray(element.params)){
            for( let i=0 ; i < element.params.length ; i++ ){
                obj=this.#traite_element(element.params[i],niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    les_arguments+=',argument(' + obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0123 #traite_FunctionDeclaration' ,"element" : element}));
                }
            }
            if(les_arguments !== ''){
                les_arguments=les_arguments.substr(1);
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0478 #traite_FunctionDeclaration' ,"element" : element}));
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0466 #traite_FunctionDeclaration' ,"element" : element}));
            }
        }
        t+='fonction( definition(' + asynchrone + 'nom(' + nom_fonction + ') ' + les_arguments + ' )  ,  contenu( ' + contenu + ' ) )';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #recupProp(element,niveau,parent,tab_comm){
        var t='';
        var obj=null;
        if(element.type === 'BinaryExpression'){
            obj=this.#traite_BinaryExpression(element,niveau,element,tab_comm);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0555 #recupProp' ,"element" : element}));
            }
        }else if(element.type === 'Identifier'){
            t+=element.name;
        }else if(element.type === 'PrivateIdentifier'){
            t+='#' + element.name + '';
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0561 #recupProp "' + element.type + '"' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_MemberExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let objTxt='';
        let propertyTxt='';
        let prop='';
        let valeur='';
        obj=this.#traite_element(element.object,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            valeur=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0553 #traite_MemberExpression' ,"element" : element}));
        }
        if(element.computed === false){
            if(element.property){
                obj=this.#traite_element(element.property,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    prop=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0522 #traite_MemberExpression' ,"element" : element}));
                }
            }
            if(prop !== ''){
                if(valeur.substr(0,8) === 'tableau('){
                    t+=(valeur.substr(0,valeur.length - 1)) + ',prop(' + prop + '))';
                }else if(valeur.substr(0,6) === 'appelf'){
                    if(valeur.indexOf('prop(') >= 0){
                        valeur=(valeur.substr(0,valeur.length - 2)) + '.' + prop + '))';
                        t=valeur;
                    }else{
                        valeur=(valeur.substr(0,valeur.length - 1)) + ',prop(' + prop + '))';
                        t=valeur;
                    }
                }else{
                    if(valeur.substr(valeur.length - 1,1) === ')'){
                        if(valeur.substr(valeur.length - 2,1) === '('){
                            t+=(valeur.substr(0,valeur.length - 1)) + 'prop(' + prop + ')' + ')';
                        }else{
                            t+=(valeur.substr(0,valeur.length - 1)) + ',prop(' + prop + ')' + ')';
                        }
                    }else{
                        t+=valeur + '.' + prop;
                    }
                }
            }else{
                t+=valeur;
            }
        }else{
            if(element.property){
                obj=this.#traite_element(element.property,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    prop=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0522 #traite_MemberExpression' ,"element" : element}));
                }
            }
            if(prop === ''){
                t+=valeur;
            }else{
                if(element.object.type === 'Identifier' && element.property.type === 'Identifier'){
                    t+=valeur + '[' + prop + ']';
                }else if(element.object.type === 'Identifier' || element.object.type === 'MemberExpression'){
                    if(prop.substr(0,5) === 'plus(' || prop.substr(0,6) === 'moins('){
                        /*
                          on essaie de mettre un arr(i+1)(j+1) à la place d'un                      
                          tableau(nomt(tableau(nomt(arr) , p(plus(i , 1)))),p(plus(j , 1)))
                        */
                        var obj_nom_tableau = functionToArray(valeur,true,true,'');
                        if(obj_nom_tableau.__xst === true && obj_nom_tableau.__xva.length === 2 && obj_nom_tableau.__xva[1][2] === 'c'){
                            /*
                              le nom du tableau est une constante
                            */
                            var obj_indice_tableau = functionToArray(prop,true,true,'');
                            if(obj_indice_tableau.__xst === true
                             && obj_indice_tableau.__xva.length === 4
                             && obj_indice_tableau.__xva[2][2] === 'c'
                             && obj_indice_tableau.__xva[3][2] === 'c'
                            ){
                                if(prop.substr(0,5) === 'plus('){
                                    t+='' + valeur + '[' + obj_indice_tableau.__xva[2][1] + '+' + obj_indice_tableau.__xva[3][1] + ']';
                                }else if(prop.substr(0,6) === 'moins('){
                                    t+='' + valeur + '[' + obj_indice_tableau.__xva[2][1] + '-' + obj_indice_tableau.__xva[3][1] + ']';
                                }else{
                                    t+='tableau(nomt(' + valeur + '),p(' + prop + '))';
                                }
                            }else{
                                t+='tableau(nomt(' + valeur + '),p(' + prop + '))';
                            }
                        }else{
                            t+='tableau(nomt(' + valeur + '),p(' + prop + '))';
                        }
                    }else{
                        t+='tableau(nomt(' + valeur + '),p(' + prop + '))';
                    }
                }else{
                    t+='tableau(nomt(' + valeur + '),p(' + prop + '))';
                }
            }
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
      =============================================================================================================
    */
    #traiteCondition1(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let i=0;
        let j=0;
        let onContinue=true;
        let enfantDe2='';
        let enfantDe1='';
        let nouveau_tableau=null;
        obj=this.#traite_element(element,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(astjs_logerreur({"__xst" : false ,"__xme" : '0671 #traiteCondition1' ,"element" : element}));
        }
        /*
          il faut transformer ceci :
          [ [ [ egal[a,1] ], ou[ [egal[b,2] ] ] ] , ou[ [ egal[c,3] ] ] ],
          en ceci
          [ [ egal[d,1] ],ou[ [ egal[e,2] ] ] , ou[ [egal[f,3] ] ] ]
        */
        obj=functionToArray(t,true,true,'');
        if(obj.__xst === true){
            if(obj.__xva.length > 3
             && obj.__xva[1][1] === ''
             && obj.__xva[1][2] === 'f'
             && obj.__xva[2][1] === ''
             && obj.__xva[2][2] === 'f'
             && obj.__xva[3][1] === ''
             && obj.__xva[3][2] === 'f'
            ){
                enfantDe2='';
                onContinue=true;
                for( i=0 ; i < obj.__xva.length && onContinue === true ; i++ ){
                    if(obj.__xva[i][7] === 2){
                        if(obj.__xva[i][1] !== ''){
                            if(enfantDe2 === ''){
                                enfantDe2=obj.__xva[i][1];
                            }else{
                                if(enfantDe2 !== obj.__xva[i][1]){
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
                    enfantDe1='';
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
                    nouveau_tableau=baisserNiveauEtSupprimer(o.__xva,2,0);
                    obj=a2F1(nouveau_tableau,0,false,1);
                    if(obj.__xst === true){
                        t=obj.__xva;
                    }
                }
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_LogicalExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let nouveau_tableau=null;
        let gauche='';
        let droite='';
        if(element.left && element.right){
            obj=this.#traiteCondition1(element.left,niveau,element,tab_comm);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0762 #traite_LogicalExpression ' ,"element" : element}));
            }
            gauche=obj.__xva;
            obj=this.#traiteCondition1(element.right,niveau,element,tab_comm);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0767 #traite_LogicalExpression ' ,"element" : element}));
            }
            droite=obj.__xva;
            if('&&' === element.operator){
                t+='et(' + gauche + ',' + droite + ')';
            }else if('||' === element.operator){
                t+='ou(' + gauche + ',' + droite + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0775 #traite_LogicalExpression ' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0778 #traite_LogicalExpression ' ,"element" : element}));
        }
        if(t.substr(0,6) === 'ou(ou(' || t.substr(0,6) === 'et(et('){
            obj=functionToArray(t,true,false,'');
            if(obj.__xst === true){
                nouveau_tableau=baisserNiveauEtSupprimer(obj.__xva,2,0);
                obj=a2F1(nouveau_tableau,0,false,1);
                if(obj.__xst === true){
                    t=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0788 #traite_LogicalExpression ' ,"element" : element}));
                }
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #recup_nom_operateur(s){
        switch (s){
            case 'typeof' : return 'Typeof';
            case 'instanceof' : return 'Instanceof';
            case '++' : return 'incr1';
            case '--' : return 'decr1';
            case '+' : return 'plus';
            case '-' : return 'moins';
            case '*' : return 'mult';
            case '/' : return 'divi';
            case '%' : return 'modulo';
            case '**' : return 'puissance';
            case '==' : return 'egal';
            case '===' : return 'egalstricte';
            case '!=' : return 'diff';
            case '!==' : return 'diffstricte';
            case '>' : return 'sup';
            case '<' : return 'inf';
            case '>=' : return 'supeg';
            case '<=' : return 'infeg';
            case '!' : return 'non';
            case '&&' : return 'et';
            case '||' : return 'ou';
            case '|' : return 'ou_bin';
            case '&' : return 'etBin';
            case '~' : return 'oppose_binaire';
            case '^' : return 'ou_ex_bin';
            case '>>' : return 'decalDroite';
            case '>>>' : return 'decal_droite_non_signe';
            case '<<' : return 'decalGauche';
            case 'in' : return 'cle_dans_objet';
            case 'delete' : return 'supprimer';
            case 'void' : return 'void';
            default:
                this.#astjs_logerreur({"__xst" : false ,"__xme" : '0834 #recup_nom_operateur "' + s + '"'});
                return('TO' + 'DO recupNomOperateur pour "' + s + '"');
                
        }
    }
    /*
      =============================================================================================================
    */
    #traite_UnaryExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let nomDuTestUnary = this.#recup_nom_operateur(element.operator);
        obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            if((nomDuTestUnary === 'moins' || nomDuTestUnary === 'plus') && isNumeric(obj.__xva)){
                if(nomDuTestUnary === 'moins'){
                    t+='-' + obj.__xva;
                }else{
                    t+='+' + obj.__xva;
                }
            }else{
                t+=nomDuTestUnary + '(' + obj.__xva + ')';
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0860 #traite_UnaryExpression' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_SwitchStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let i=0;
        t+='bascule(';
        obj=this.#traite_element(element.discriminant,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            t+='quand(' + obj.__xva + ')';
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1312 #traite_SwitchStatement' ,"element" : element}));
        }
        for( i=0 ; i < element.cases.length ; i++ ){
            t+='est(';
            if(element.cases[i].test !== null){
                obj=this.#traite_element(element.cases[i].test,niveau + 1,false,false,element);
                if(obj.__xst === true){
                    t+='valeur(' + obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1322 #traite_SwitchStatement' ,"element" : element}));
                }
            }else{
                t+='valeurNonPrevue()';
            }
            t+='faire(';
            if(element.cases[i].consequent && element.cases[i].consequent.length > 0){
                obj=this.#traite_ast0(element.cases[i].consequent,niveau + 3,element.cases[i],tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1333 #traite_SwitchStatement' ,"element" : element}));
                }
            }
            t+=')';
            t+=')';
        }
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ForInStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';
        let contenu='';
        obj=this.#traite_element(element.left,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1318 #traite_ForInStatement' ,"element" : element}));
        }
        obj=this.#traite_element(element.right,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            droite+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1326 #traite_ForInStatement' ,"element" : element}));
        }
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1337 #traite_ForInStatement' ,"element" : element}));
                }
            }else{
                obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1344 #traite_ForInStatement' ,"element" : element}));
                }
            }
        }
        t+='boucle_sur_objet_dans(';
        t+='pourChaque(dans(' + gauche + ' , ' + droite + ')),';
        t+='faire(' + contenu + ')';
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_DoWhileStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let i=0;
        let test='';
        let contenu='';
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0922 #traite_DoWhileStatement' ,"element" : element}));
                }
            }else{
                obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0929 #traite_DoWhileStatement' ,"element" : element}));
                }
            }
        }
        obj=this.#traite_element(element.test,niveau + 1,element,tab_comm);
        if(obj.__xst === false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0897 #traite_DoWhileStatement' ,"element" : element}));
        }
        test+=obj.__xva;
        t+='faire_tant_que(';
        t+='instructions(' + contenu + ')';
        t+='condition(' + test + '),';
        t+='),';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_WhileStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let i=0;
        let test='';
        let contenu='';
        obj=this.#traite_element(element.test,niveau + 1,element,tab_comm);
        if(obj.__xst === false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0897 #traite_WhileStatement' ,"element" : element}));
        }
        test+=obj.__xva;
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0922 #traite_WhileStatement' ,"element" : element}));
                }
            }else{
                obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0929 #traite_WhileStatement' ,"element" : element}));
                }
            }
        }
        t+='tantQue(';
        t+='condition(' + test + '),';
        t+='faire(' + contenu + ')';
        t+='),';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ForStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let i=0;
        let pourInit='';
        let test='';
        let valeurIncrement='';
        let contenu='';
        if(element.init === null){
            pourInit='';
        }else{
            obj=this.#traite_element(element.init,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                if(pourInit !== ''){
                    pourInit+=',';
                }
                pourInit+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0888 #traite_ForStatement' ,"element" : element}));
            }
        }
        if(element.test === null){
            test+='()';
        }else{
            obj=this.#traite_element(element.test,niveau + 1,element,tab_comm);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0897 #traite_ForStatement' ,"element" : element}));
            }
            test+=obj.__xva;
        }
        if(element.update === null){
            valeurIncrement='';
        }else{
            obj=this.#traite_element(element.update,niveau + 1,element,tab_comm);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0907 #traite_ForStatement' ,"element" : element}));
            }
            valeurIncrement+=obj.__xva;
        }
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0922 #traite_ForStatement' ,"element" : element}));
                }
            }else{
                obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0929 #traite_ForStatement' ,"element" : element}));
                }
            }
        }
        t+='boucle(';
        t+='    initialisation(' + pourInit + ')';
        t+='    condition(' + test + ')';
        t+='    increment(' + valeurIncrement + ')';
        t+='    faire(' + contenu + ')';
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_UpdateExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let elem='';
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
        obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            elem=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0972 #traite_UpdateExpression' ,"element" : element}));
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
      =============================================================================================================
    */
    #traite_IfStatement(element,niveau,parent,tab_comm,type){
        let t='';
        let obj=null;
        if(type === 'if'){
            t+='choix(';
            t+='si(';
            obj=this.#traite_element(element.test,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                t+='condition(' + obj.__xva + '),';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1036 #traite_IfStatement' ,"element" : element}));
            }
        }else{
            if(element.test){
                t+='sinonsi(';
                obj=this.#traite_element(element.test,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    t+='condition(' + obj.__xva + '),';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1036 #traite_IfStatement' ,"element" : element}));
                }
            }else{
                t+='sinon(';
            }
        }
        t+='alors(';
        var bloc_traitement_dans=null;
        if(element.consequent){
            obj=this.#traite_ast0(element.consequent,niveau + 2,element.consequent,tab_comm);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1063 #traite_IfStatement' ,"element" : element}));
            }
        }else{
            obj=this.#traite_ast0(element,niveau + 2,parent,tab_comm);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1083 #traite_IfStatement' ,"element" : element}));
            }
        }
        t+=')';
        t+=')';
        if(element.alternate){
            obj=this.#traite_IfStatement(element.alternate,niveau,element.alternate,tab_comm,'else');
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1110 #traite_IfStatement' ,"element" : element}));
            }
        }
        if(type === 'if'){
            t+=')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ClassDeclaration(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let nom_de_la_classe='';
        let super_classe='';
        let corps_de_la_classe='';
        if(element.id){
            if("Identifier" === element.id.type){
                nom_de_la_classe=element.id.name;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1102 #traite_ClassDeclaration' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1105 #traite_ClassDeclaration' ,"element" : element}));
        }
        if(element.body){
            if(element.body.type === "ClassBody" && element.body.body && element.body.body.length > 0){
                obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    corps_de_la_classe+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1063 #traite_ClassDeclaration' ,"element" : element}));
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1128 #traite_ClassDeclaration' ,"element" : element}));
            }
        }
        t+='definition_de_classe(nom_classe(' + nom_de_la_classe + '),contenu(' + corps_de_la_classe + '))';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_PropertyDefinition(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.key.type === 'PrivateIdentifier' || element.key.type === 'Identifier'){
            if(element.key.type === 'PrivateIdentifier'){
                t+='variable_privée(' + element.key.name;
            }else if(element.key.type === 'Identifier'){
                t+='variable_publique(' + element.key.name;
            }
            if(element.value){
                obj=this.#traite_element(element.value,niveau + 1,element,tab_comm);
                if(obj.__xst === true){
                    t+=',' + obj.__xva + '';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1157 #traite_PropertyDefinition' ,"element" : element}));
                }
            }
            t+=')';
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1162 #traite_PropertyDefinition' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_MethodDefinition(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let j=0;
        if((element.kind === "method"
         || element.kind === "constructor"
         || element.kind === "get"
         || element.kind === "set")
         && element.value
         && element.value.type === "FunctionExpression"
         && element.value.body
        ){
            t+='méthode(';
            t+='definition(';
            if(element.kind === "get" || element.kind === "set"){
                t+='type(' + (element.kind === 'get' ? ( 'lire' ) : ( 'écrire' )) + '),';
            }
            t+='nom(' + element.key.name + '),';
            if(element.key.type === "PrivateIdentifier"){
                t+='mode(privée),';
            }
            if(element.value.async === true){
                t+='asynchrone()';
            }
            if(element.value.params && element.value.params.length > 0){
                t+=',';
                for( j=0 ; j < element.value.params.length ; j++ ){
                    if(element.value.params[j].type === "Identifier"){
                        t+='argument(' + element.value.params[j].name + ')';
                    }else if(element.value.params[j].type === "AssignmentPattern"){
                        obj=traiteAssignmentPattern(element.value.params[j],niveau + 1,{});
                        if(obj.__xst === true){
                            t+='argument(' + obj.__xva + ')';
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1193 #traite_MethodDefinition' ,"element" : element}));
                        }
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1196 #traite_MethodDefinition' ,"element" : element}));
                    }
                    if(j < element.value.params.length - 1){
                        t+=',';
                    }
                }
            }
            t+='),';
            t+='contenu(';
            var prop={};
            for(prop in element.value){
                if(prop === 'body'){
                    obj=this.#traite_ast0(element.value[prop],niveau + 2,element,tab_comm);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1212 #traite_MethodDefinition' ,"element" : element}));
                    }
                }
            }
            t+=')';
            t+=')';
        }else{
            debugger;
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1222 #traite_MethodDefinition' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ConditionalExpression(element,niveau,parent,tab_comm){
        let t='';
        var objtest1 = this.#traite_element(element.test,niveau,element,tab_comm);
        if(objtest1.__xst === false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1733 #traite_ConditionalExpression' ,"element" : element}));
        }
        var objSiVrai={};
        var objSiVrai = this.#traite_element(element.consequent,niveau,element,tab_comm);
        if(objSiVrai.__xst === false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1738 #traite_ConditionalExpression' ,"element" : element}));
        }
        var objSiFaux={};
        var objSiFaux = this.#traite_element(element.alternate,niveau,element,tab_comm);
        if(objSiFaux.__xst === false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1743 #traite_ConditionalExpression' ,"element" : element}));
        }
        t+='testEnLigne(condition(' + objtest1.__xva + '),siVrai(' + objSiVrai.__xva + '),siFaux(' + objSiFaux.__xva + '))';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_PrivateIdentifier(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        t='#' + element.name;
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ExportNamedDeclaration(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let j=0;
        if(element.specifiers && element.specifiers.length > 0){
            for( j=0 ; j < element.specifiers.length ; j++ ){
                var specifier=element.specifiers[j];
                if(specifier.exported){
                    if(specifier.exported.type === "Identifier"){
                        t+='exporter(nom_de_classe(' + specifier.exported.name + '))';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1777 #traite_ExportNamedDeclaration' ,"element" : element}));
                    }
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1780 #traite_ExportNamedDeclaration' ,"element" : element}));
                }
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_TemplateLiteral(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.quasis
         && element.quasis.length === 1
         && 'TemplateElement' === element.quasis[0].type
         && element.quasis[0].value
         && element.quasis[0].value.raw
        ){
            t='`' + element.quasis[0].value.raw + '`';
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1802 #traite_TemplateLiteral' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_NewExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.callee && element.callee.type === 'MemberExpression' && element.arguments.length === 0){
            obj=this.#traite_MemberExpression(element.callee,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                t+='new(' + obj.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1820 #traite_NewExpression' ,"element" : element}));
            }
        }else if(element.callee
         && element.callee.type === 'MemberExpression'
         && element.arguments.length > 0
         || element.callee
         && element.callee.type === 'Identifier'
         || element.callee
         && element.callee.type === 'ThisExpression'
        ){
            var obj1 = this.#traite_CallExpression(element,niveau + 1,element,{});
            if(obj1.__xst === true){
                t+='new(' + obj1.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1831 #traite_NewExpression' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1834 #traite_NewExpression' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_TryStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        t+='essayer(';
        t+='faire(';
        obj=this.#traite_ast0(element.block.body,niveau + 2,element.block,tab_comm);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1854 #traite_TryStatement' ,"element" : element}));
        }
        t+='),';
        t+='sierreur(';
        if(element.handler && element.handler.type === 'CatchClause'){
            if(element.handler.param && element.handler.param.type === 'Identifier'){
                t+=element.handler.param.name + ',';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1863 #traite_TryStatement' ,"element" : element}));
            }
            if(element.handler.body && element.handler.body.type === 'BlockStatement'){
                obj=this.#traite_ast0(element.handler.body,niveau + 2,element.handler,tab_comm);
                if(obj.__xst === true){
                    t+='faire(' + obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1870 #traite_TryStatement' ,"element" : element}));
                }
            }
        }
        t+=')';
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_AssignmentPattern(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.left && element.right){
            var objgauche = this.#traite_element(element.left,niveau + 1,element,tab_comm);
            var objdroite = this.#traite_element(element.right,niveau + 1,element,tab_comm);
            if(objgauche.__xst === true && objdroite.__xst){
                t+=objgauche.__xva + ',defaut(' + objdroite.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1893 #traite_AssignmentPattern' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1896 #traite_AssignmentPattern' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_AwaitExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if("CallExpression" === element.argument.type){
            var objass = this.#traite_element(element.argument,niveau + 1,element,tab_comm);
            if(objass.__xst === true){
                t+='await(' + objass.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1924 #traite_AwaitExpression' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1927 #traite_AwaitExpression' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ThrowStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm);
        if(obj.__xst === true){
            t+='throw(' + obj.__xva + ')';
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1987 #traite_ThrowStatement' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_LabeledStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let contenu='';
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2070 #traite_LabeledStatement' ,"element" : element}));
            }
        }
        if(element.label.type === 'Identifier'){
            t+='etiquette(' + element.label.name + ',contenu(' + contenu + '))';
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2076 #traite_LabeledStatement' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_SequenceExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.expressions.length > 1 && parent.computed && parent.computed === true){
            /*
              tab[1,1] est super dangereux, on le signale mais ça passe
            */
            this.#astjs_logerreur({"__xst" : false ,"__xme" : '2008 l\'opérateur virgule est dangereux dans un tableau !' ,"element" : element});
        }
        for( let i=0 ; i < element.expressions.length ; i++ ){
            obj=this.#traite_element(element.expressions[i],niveau + 2,element,tab_comm);
            if(obj.__xst === true){
                if(t !== ''){
                    t+=',';
                }
                t+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2018 #traite_SequenceExpression' ,"element" : element}));
            }
        }
        t='virgule(' + t + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_BlockStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.body && Array.isArray(element.body)){
            for( let i=0 ; i < element.body.length ; i++ ){
                if(element.body[i].type && element.body[i].type === 'ExpressionStatement'){
                    obj=this.#traite_element(element.body[i].expression,niveau,element,tab_comm);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2126 #traite_BlockStatement' ,"element" : element}));
                    }
                }else{
                    obj=this.#traite_element(element.body[i],niveau,element,tab_comm);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2133 #traite_BlockStatement' ,"element" : element}));
                    }
                }
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2139 #traite_BlockStatement' ,"element" : element}));
        }
        t='(' + t + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_element(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        
        if('ForStatement'===element.type){
//         debugger
        }
        t+=this.#comm_avant_debut1(element,niveau,parent,tab_comm);
        switch (element.type){
            case 'Identifier' : t+=element.name;
                break;
            case 'Literal' :
                if(element.regex){
                    let leParam = '/' + element.regex.pattern + '/';
                    if(element.regex.flags){
                        leParam+=element.regex.flags;
                    }
                    t+=leParam;
                }else{
                    let valeur='';
                    /* il faut traiter les valeurs entre quotes qui terminent par un \ */
                    if(element.raw.indexOf('\\\n') >= 0){
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1744 #traite_element Literal veuillez réécrire ces lignes JS qui terminent par un \\' ,"element" : element}));
                    }else{
                        valeur=element.raw;
                    }
                    if(niveau === 0){
                        t+='directive(' + valeur + ')';
                    }else{
                        t+=valeur;
                    }
                }
                break;
                
            case 'BreakStatement' :
                if(element.label !== null){
                    if(element.label.type === 'Identifier'){
                        t+='break(' + element.label.name + ')';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1758 #traite_element BreakStatement' ,"element" : element}));
                    }
                }else{
                    t+='break()';
                }
                break;
                
            case 'EmptyStatement' : t+='';
                break;
            case 'DebuggerStatement' : t+='debugger()';
                break;
            case 'ThisExpression' : t+='this';
                break;
            case 'ContinueStatement' : t+='continue()';
                break;
            case 'LabeledStatement' :
                obj=this.#traite_LabeledStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2053 #traite_element LabeledStatement ' ,"element" : element}));
                }
                break;
                
            case 'SequenceExpression' :
                obj=this.#traite_SequenceExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2053 #traite_element SequenceExpression ' ,"element" : element}));
                }
                break;
                
            case 'ThrowStatement' :
                obj=this.#traite_ThrowStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2053 #traite_element ThrowStatement ' ,"element" : element}));
                }
                break;
                
            case 'AwaitExpression' :
                obj=this.#traite_AwaitExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1990 #traite_element AwaitExpression ' ,"element" : element}));
                }
                break;
                
            case 'AssignmentPattern' :
                obj=this.#traite_AssignmentPattern(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2000 #traite_element AssignmentPattern ' ,"element" : element}));
                }
                break;
                
            case 'TryStatement' :
                obj=this.#traite_TryStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2010 #traite_element TryStatement ' ,"element" : element}));
                }
                break;
                
            case 'NewExpression' :
                obj=this.#traite_NewExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1883 #traite_element NewExpression ' ,"element" : element}));
                }
                break;
                
            case 'TemplateLiteral' :
                obj=this.#traite_TemplateLiteral(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1862 #traite_element TemplateLiteral ' ,"element" : element}));
                }
                break;
                
            case 'ExportNamedDeclaration' :
                obj=this.#traite_ExportNamedDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1837 #traite_element ExportNamedDeclaration ' ,"element" : element}));
                }
                break;
                
            case 'SwitchStatement' :
                obj=this.#traite_SwitchStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2071 #traite_element SwitchStatement ' ,"element" : element}));
                }
                break;
                
            case 'ForInStatement' :
                obj=this.#traite_ForInStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1716 #traite_element ForInStatement ' ,"element" : element}));
                }
                break;
                
            case 'PrivateIdentifier' :
                obj=this.#traite_PrivateIdentifier(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1698 #traite_element PrivateIdentifier ' ,"element" : element}));
                }
                break;
                
            case 'ConditionalExpression' :
                obj=this.#traite_ConditionalExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1671 #traite_element ConditionalExpression ' ,"element" : element}));
                }
                break;
                
            case 'MethodDefinition' :
                obj=this.#traite_MethodDefinition(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1173 #traite_element MethodDefinition ' ,"element" : element}));
                }
                break;
                
            case 'PropertyDefinition' :
                obj=this.#traite_PropertyDefinition(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1173 #traite_element PropertyDefinition ' ,"element" : element}));
                }
                break;
                
            case 'ClassDeclaration' :
                obj=this.#traite_ClassDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1124 #traite_element ClassDeclaration ' ,"element" : element}));
                }
                break;
                
            case 'IfStatement' :
                obj=this.#traite_IfStatement(element,niveau,parent,tab_comm,'if');
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0898 #traite_element IfStatement ' ,"element" : element}));
                }
                break;
                
            case 'UpdateExpression' :
                obj=this.#traite_UpdateExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0898 #traite_element UpdateExpression ' ,"element" : element}));
                }
                break;
                
            case 'DoWhileStatement' :
                obj=this.#traite_DoWhileStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2082 #traite_element DoWhileStatement ' ,"element" : element}));
                }
                break;
                
            case 'WhileStatement' :
                obj=this.#traite_WhileStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2082 #traite_element WhileStatement ' ,"element" : element}));
                }
                break;
                
            case 'ForStatement' :
                obj=this.#traite_ForStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0898 #traite_element ForStatement ' ,"element" : element}));
                }
                break;
                
            case 'UnaryExpression' :
                obj=this.#traite_UnaryExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0828 #traite_element UnaryExpression ' ,"element" : element}));
                }
                break;
                
            case 'LogicalExpression' :
                obj=this.#traite_LogicalExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0689 #traite_element LogicalExpression ' ,"element" : element}));
                }
                break;
                
            case 'MemberExpression' :
                obj=this.#traite_MemberExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0539 #traite_element MemberExpression ' ,"element" : element}));
                }
                break;
                
            case 'FunctionDeclaration' :
                obj=this.#traite_FunctionDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0477 #traite_element FunctionDeclaration ' ,"element" : element}));
                }
                break;
                
            case 'ArrayExpression' :
                obj=this.#traite_ArrayExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0487 #traite_element ArrayExpression ' ,"element" : element}));
                }
                break;
                
            case 'ObjectExpression' :
                obj=this.#traite_ObjectExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0388 #traite_element ObjectExpression ' ,"element" : element}));
                }
                break;
                
            case 'VariableDeclaration' :
                obj=this.#traite_VariableDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0327 #traite_element VariableDeclaration ' ,"element" : element}));
                }
                break;
                
            case 'BinaryExpression' :
                obj=this.#traite_BinaryExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0288 #traite_element BinaryExpression ' ,"element" : element}));
                }
                break;
                
            case 'ReturnStatement' :
                obj=this.#traite_ReturnStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0251 #traite_element ReturnStatement ' ,"element" : element}));
                }
                break;
                
            case 'AssignmentExpression' :
                obj=this.#traite_AssignmentExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0138 #traite_element AssignmentExpression ' ,"element" : element}));
                }
                break;
                
            case "ArrowFunctionExpression" :
                obj=this.#traite_ArrowFunctionExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0185 #traite_element ArrowFunctionExpression ' ,"element" : element}));
                }
                break;
                
            case 'FunctionExpression' :
                obj=this.#traite_FunctionExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0095 #traite_element FunctionExpression ' ,"element" : element}));
                }
                break;
                
            case 'CallExpression' :
                obj=this.#traite_CallExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0059 #traite_element CallExpression ' ,"element" : element}));
                }
                break;
                
            case 'BlockStatement' :
                /*# 
                  de temps en temps, on peut passer pas là mais je ne vois pas l'utilité : exemple :
                  switch(a) {
                   case b:
                     { // pourquoi cette accolade ?
                       a=1;
                     } // pourquoi cette accolade ?
                     break;
                  }
                  c'est peut-être quand on veut isoler des variables ...
                */
                obj=this.#traite_BlockStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2551 #traite_element BlockStatement ' ,"element" : element}));
                }
                break;
                
            default:
                debugger;
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2500 #traite_element non prévu "' + element.type + '" ' ,"element" : element}));
                break;
                
        }
        element=null;
        return({"__xst" : true ,"__xva" : t});
    }
    
    
    /*
      =============================================================================================================
      les arguments d'une fonction auto_appelée ne commencent qu'après le "element.callee.body.end"
    */
    #comm_dans_arguments_appel_fonction(element,niveau,parent,tab_comm){ // tabComment
        var t='';
        let tab_com_a_supprimer=[];
        
        if(parent.hasOwnProperty('auto_appelee') && parent.auto_appelee===true){
            var position_debut_parenthese = parent.callee.body.end + 1;
            var position_fin_parenthese=parent.end;
            for( var i=0 ; i < tab_comm.length ; i++ ){
                if(tab_comm[i].start > position_debut_parenthese
                 && tab_comm[i].end < position_fin_parenthese
                 && element.start >= tab_comm[i].end
                ){
                    var txtComment = tab_comm[i].value.trim();
                    t='#( ' + (txtComment.replace(/\(/g,'[').replace(/\)/g,']')) + ' )' + t;
                    tab_com_a_supprimer.push(i);
                }else if(tab_comm[i].start > position_fin_parenthese){
                    break;
                }
            }
        }else{
            t=this.#comm_avant_debut1(element,niveau,parent,tab_comm);
        }
        for(var j=0;j<tab_com_a_supprimer.length;j++){
           tab_comm.splice(tab_com_a_supprimer[j],1);
        }
        return t;
    }    

    /*
      =============================================================================================================
    */
    #derniers_commentaires(tab_comm){
        let t='';
        for( let i=0 ; i < tab_comm.length ; i++ ){
            var txtComment=tab_comm[i].value;
            if(txtComment.indexOf('\n') < 0){
                txtComment=txtComment.trim();
                txtComment=' ' + txtComment + ' ';
            }
            var c1 = nbre_caracteres2('(',txtComment);
            var c2 = nbre_caracteres2(')',txtComment);
            if(c1 === c2){
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + (txtComment.substr(1)) + ')';
                }else{
                    t+='#(' + txtComment + ')';
                }
            }else{
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + (txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']')) + ')';
                }else{
                    t+='#(' + (txtComment.replace(/\(/g,'[').replace(/\)/g,']')) + ')';
                }
            }
        }
        return t;
    }
    /*
      =============================================================================================================
    */
    #comm_avant_fin1(elem,niveau,parent,tab_comm){
        let t='';
        let txtComment='';
        let position_debut_bloc=0;//parent.start;
        let position_fin_bloc=0;//parent.end;
        let i=0;
        let c1=0;
        let c2=0;
        let tab_com_a_supprimer=[];
     
        if(parent===null){
         return t;
        }
     

        
        if(Array.isArray(parent)){
            position_debut_bloc=parent[0].start;
            position_fin_bloc=parent[parent.length-1].end;
        }else{
            position_debut_bloc=parent.start;
            position_fin_bloc=parent.end;
        }
        
        if(parent.hasOwnProperty('auto_appelee') && parent.auto_appelee===true){
          return t;
          position_fin_bloc=parent.callee.body.end;
        }
        
        for( i=0;i<tab_comm.length && tab_comm[i].start<=position_fin_bloc && tab_comm[i].end<=position_fin_bloc ; i++ ){
            if(tab_comm[i].start<position_debut_bloc ){
                /* dans le cas des fonctions auto_appelées , les commentaires peuvent être au milieu du tableau */
                continue;
            }
            txtComment=tab_comm[i].value;
            if(txtComment.indexOf('\n') < 0){
                txtComment=txtComment.trim();
                txtComment=' ' + txtComment + ' ';
            }
            c1 = nbre_caracteres2('(',txtComment);
            c2 = nbre_caracteres2(')',txtComment);
            if(c1 === c2){
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + (txtComment.substr(1)) + ')';
                }else{
                    t+='#(' + txtComment + ')';
                }
            }else{
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + (txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']')) + ')';
                }else{
                    t+='#(' + (txtComment.replace(/\(/g,'[').replace(/\)/g,']')) + ')';
                }
            }
            tab_com_a_supprimer.push(i);
        }
        for(var j=tab_com_a_supprimer.length-1;j>=0;j--){
           tab_comm.splice(tab_com_a_supprimer[j],1);
        }
        return t;
        
    }
    /*
      =============================================================================================================
      on cherche les commentaires avant elem
    */
    #comm_avant_debut1(elem,niveau,parent,tab_comm){
        let t='';
        let i=0;
        let c1=0;
        let c2=0;
        let tab_com_a_supprimer=[];
        let txtComment='';
        let position_debut_bloc=0;
        let position_fin_bloc=0;
        let position_debut_element=null;
        
        
        

        if(elem.start===undefined){
            /* on a probablement un tableau */
            if(Array.isArray(elem)){
                if(elem.length>0){
                    position_debut_element=elem[0].start;
                }else{
                    if(parent===null){
                        /* on est dans l'initialisation */ 
                        return t;
                    }else{
                        debugger;
                    }
                }
            }else{
                debugger;
            }
        }else{
            position_debut_element=elem.start;
        }
        
        if(parent===null){
            /* cas initialisation */
            position_debut_bloc=0;
            if(elem.end===undefined){
                if(Array.isArray(elem)){
                    if(elem.length>0){
                        /* il y a au moins une ligne de code */
                        position_fin_bloc=elem[elem.length-1].end;
                    }else{
                        return t;
                    }
                }else{
                    debugger;
                }
            }else{
                position_fin_bloc=elem.end;
            }
        }else if(Array.isArray(parent)){
            position_debut_bloc=parent[0].start;
            if(elem.start===parent[0].start){
             position_debut_bloc=0;
            }
            position_fin_bloc=parent[parent.length-1].end;
/*
        }else if(elem.body){
            position_debut_bloc=elem.start;
            position_fin_bloc=elem.end-1;
*/            
        }else{

            position_debut_bloc=parent.start;
            position_fin_bloc=parent.end;

            if(parent.type==="CallExpression" && parent.arguments && Array.isArray(parent.arguments)){
                for(var j=0;j<parent.arguments.length;j++){
                   if(elem.start===parent.arguments[j].start){
                       position_debut_bloc=parent.callee.end;
                   }
                }
            }
        }

        if(parent && parent.hasOwnProperty('auto_appelee') && parent.auto_appelee===true){
          return t;
        }
        for( i=0;i<tab_comm.length && tab_comm[i].start<=position_debut_element && tab_comm[i].end<=position_fin_bloc ; i++ ){
             
             if(tab_comm[i].start<position_debut_bloc){
                  /* dans le cas des fonctions auto_appelées , les commentaires peuvent être au milieu du tableau */
                  continue;
             }
             
             txtComment=tab_comm[i].value;
             if(txtComment.indexOf('\n') < 0){
                 txtComment=txtComment.trim();
                 txtComment=' ' + txtComment + ' ';
             }
             if((txtComment.match(/\(/g)||[]).length === (txtComment.match(/\)/g)||[]).length){
                 if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                     t+='#(#' + (txtComment.substr(1)) + ')';
                 }else{
                     t+='#(' + txtComment + ')';
                 }
             }else{
                 if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                     t+='#(#' + (txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']')) + ')';
                 }else{
                     t+='#(' + (txtComment.replace(/\(/g,'[').replace(/\)/g,']')) + ')';
                 }
             }
             tab_com_a_supprimer.push(i);
        }
        if(t.indexOf('044')>=0){
            debugger;
        }
        for(var j=tab_com_a_supprimer.length-1;j>=0;j--){
           tab_comm.splice(tab_com_a_supprimer[j],1);
        }
        return t;
    }
    /*
      =============================================================================================================
    */
    #traite_ast0(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        const espaces = CRLF + '   '.repeat(niveau);
        
        if(Array.isArray(element)){
            for( let i=0 ; i < element.length ; i++ ){
                switch (element[i].type){
                    case 'ExpressionStatement' :
                        obj=this.#traite_element(element[i].expression,niveau,element,tab_comm);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 ExpressionStatement' ,"element" : element}));
                        }
                        break;
                        
                    case 'EmptyStatement' :
                        t+=this.#comm_avant_debut1(element[i],niveau,parent,tab_comm);
                        t+='';
                        break;
                        
                    default:
                        obj=this.#traite_element(element[i],niveau,parent,tab_comm);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 ExpressionStatement' ,"element" : element}));
                        }
                        break;
                        
                }
            }
        }else if(element.type && element.type === 'BlockStatement' || element.type && element.type === 'ClassBody'){
            if(element.body && Array.isArray(element.body)){
                for( let i=0 ; i < element.body.length ; i++ ){
                    if(element.body[i].type && element.body[i].type === 'ExpressionStatement'){
                        obj=this.#traite_element(element.body[i].expression,niveau,element,tab_comm);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0187 #traite_ast0 BlockStatement ' ,"element" : element}));
                        }
                    }else{
                        obj=this.#traite_element(element.body[i],niveau,element,tab_comm);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0429 #traite_ast0 BlockStatement ' ,"element" : element}));
                        }
                    }
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0191 #traite_ast0 BlockStatement' ,"element" : element}));
            }
        }else if(element.type && element.type === 'ExpressionStatement'){
            obj=this.#traite_element(element.expression,niveau,element,tab_comm);
            if(obj.__xst === true){
                t+=espaces + obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 ExpressionStatement' ,"element" : element}));
            }
        }else{
            obj=this.#traite_element(element,niveau,element,tab_comm);
            if(obj.__xst === true){
                t+=espaces + obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 ExpressionStatement' ,"element" : element}));
            }
        }
        t+=this.#comm_avant_fin1(element,niveau,parent,tab_comm,true);
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    traite_ast(ast_de_js,tab_comm,options_traitement){
        let t='';
        let obj=null;
        console.log(ast_de_js);
        if(options_traitement !== undefined){
            this.#options_traitement=options_traitement;
        }
        if(Array.isArray(ast_de_js)){
            let niveau=0;
            obj=this.#traite_ast0(ast_de_js,niveau,null,tab_comm);
            if(obj.__xst === true){
                t+=obj.__xva;
                t+=this.#derniers_commentaires(tab_comm);
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 traite_ast erreur de convertion'}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 traite_ast le point d\'entrée doit être un tableau'}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
}
export{module_conversion_ast_de_js_acorn_vers_rev1};