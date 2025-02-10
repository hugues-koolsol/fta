"use strict";
/*
  =====================================================================================================================
  conversion d'un ast produit acorn https://github.com/acornjs/acorn en rev
  point d'entrée = traite_ast, #traite_element
  =====================================================================================================================
*/
class c_astjs_vers_rev1{
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
        if(o.hasOwnProperty('element') && o.element.hasOwnProperty('end') && o.element.hasOwnProperty('start')){
            o.plage=[o.element.start,o.element.end];
        }
        logerreur(o);
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
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        if(element.generator !== false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        if(element.id){
            obj=this.#traite_element(element.id,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                id+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        if(element.params && Array.isArray(element.params)){
            if(element.params.length === 0){
                les_arguments=',p()';
            }else{
                for( let i=0 ; i < element.params.length ; i++ ){
                    le_commentaire=this.#comm_dans_arguments_appel_fonction(element.params[i],niveau,element,tab_comm);
                    obj=this.#traite_element(element.params[i],niveau + 1,element,tab_comm,false);
                    if(obj.__xst === true){
                        les_arguments+=',p(' + le_commentaire + obj.__xva + ')';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                    }
                }
            }
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
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
        let obj=null;
        let les_arguments='';
        let le_commentaire='';
        let i=0;
        let nom_de_la_fonction='';
        let le_contenu='';
        let auto_appelee='';
        if(element.callee && element.callee.params && element.arguments){
            auto_appelee='auto_appelee(4),';
            /* utile aussi pour selectionner les commentaires des arguments */
            element['auto_appelee']=true;
        }
        if(element.arguments){
            if(element.arguments.length > 0){
                for( i=0 ; i < element.arguments.length ; i++ ){
                    if(les_arguments !== ''){
                        les_arguments+=',';
                    }
                    le_commentaire=this.#comm_dans_arguments_appel_fonction(element.arguments[i],niveau,element,tab_comm);
                    /*
                      ici, on a le seul cas où ignorer_commentaires_avant est vrai
                    */
                    obj=this.#traite_element(element.arguments[i],niveau + 1,element.arguments,tab_comm,true);
                    if(obj.__xst === true){
                        les_arguments+='p(' + le_commentaire + obj.__xva + ')';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                    }
                }
            }else{
                les_arguments='p()';
            }
        }
        let type_callee=element.callee.type;
        if(element.callee){
            obj=this.#traite_element(element.callee,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                nom_de_la_fonction+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
            if(obj.__xst === true){
                if(obj.__xva !== ''){
                    le_contenu=',contenu(' + contenu + ')';
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + 'body' ,"element" : element}));
            }
        }
        if(element.optional === true){
            t+='chainé(' + nom_de_la_fonction + ' , appelf(' + auto_appelee + 'nomf()' + ',' + les_arguments + le_contenu + '))';
        }else{
            if(type_callee === 'MemberExpression'){
                if(nom_de_la_fonction.substr(0,8) === 'tableau('){
                    t+='appelf(' + auto_appelee + 'nomf(' + nom_de_la_fonction + '),' + les_arguments + le_contenu + ')';
                }else if(nom_de_la_fonction.indexOf('nomf') < 0){
                    t+='appelf(' + auto_appelee + 'nomf(' + nom_de_la_fonction + '),' + les_arguments + le_contenu + ')';
                }else{
                    t+='appelf(' + auto_appelee + nom_de_la_fonction + ',' + les_arguments + le_contenu + ')';
                }
            }else{
                t+='appelf(' + auto_appelee + 'nomf(' + nom_de_la_fonction + ')' + ',' + les_arguments + le_contenu + ')';
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
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' generator' ,"element" : element}));
        }
        if(element.id){
            obj=this.#traite_element(element.id,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                id+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm,false);
                if(obj.__xst === true){
                    contenu+='retourner(' + obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
            }else{
                obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
            }
        }
        if(element.params && Array.isArray(element.params)){
            if(element.params.length === 0){
                les_arguments=',p()';
            }else{
                for( let i=0 ; i < element.params.length ; i++ ){
                    le_commentaire=this.#comm_dans_arguments_appel_fonction(element.params[i],niveau,element,tab_comm);
                    obj=this.#traite_element(element.params[i],niveau + 1,element,tab_comm,false);
                    if(obj.__xst === true){
                        les_arguments+=',p(' + le_commentaire + obj.__xva + ')';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
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
            obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm,false);
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
        obj=this.#traite_element(element.left,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0134 #traite_AssignmentExpression' ,"element" : element}));
        }
        obj=this.#traite_element(element.right,niveau + 1,element,tab_comm,false);
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
        obj=this.#traite_element(element.left,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0279 #traite_BinaryExpression' ,"element" : element}));
        }
        obj=this.#traite_element(element.right,niveau + 1,element,tab_comm,false);
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
            t='concat(' + t.substr(5);
        }
        if(t.substr(0,13) === 'plus( concat('){
            t='concat(' + t.substr(5);
        }
        if(t.substr(0,14) === 'concat(concat(' || t.substr(0,15) === 'concat( concat('){
            obj=functionToArray(t,true,false,'');
            if(obj.__xst === true){
                nouveauTableau=baisserNiveauEtSupprimer(obj.__xva,2,0);
                obj=a2F1(nouveauTableau,0,false,1);
                if(obj.__xst === true){
                    t=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_BinaryExpression ' ,"element" : element}));
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_BinaryExpression ' ,"element" : element}));
            }
        }
        if(t.substr(0,10) === 'plus(plus('
               || t.substr(0,12) === 'moins(moins('
               || t.substr(0,10) === 'mult(mult('
               || t.substr(0,10) === 'divi(divi('
               || t.substr(0,11) === 'plus( plus('
               || t.substr(0,13) === 'moins( moins('
               || t.substr(0,11) === 'mult( mult('
               || t.substr(0,11) === 'divi( divi('
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
                obj=this.#traite_element(element.declarations[decl].id,niveau + 1,element,tab_comm,false);
                if(obj.__xst === true){
                    nomVariable=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0684 #traite_VariableDeclaration' ,"element" : element}));
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
                obj=this.#traite_element(element.declarations[decl].init,niveau + 1,element,tab_comm,false);
                if(obj.__xst === true){
                    t+=(debutDeclaration + obj.__xva) + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0704 #traite_VariableDeclaration' ,"element" : element}));
                }
            }else{
                t+=debutDeclaration + 'null())';
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);
    */
    #traite_MetaProperty(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let meta='';
        let propriete='';
        if(element.meta && element.property){
            obj=this.#traite_element(element.meta,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                meta+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0727 #traite_MetaProperty' ,"element" : element}));
            }
            obj=this.#traite_element(element.property,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                propriete+='.' + obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0727 #traite_MetaProperty' ,"element" : element}));
            }
            t+=meta + propriete;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0730 #traite_MetaProperty' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ImportExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let source='';
        if(element.source){
            obj=this.#traite_element(element.source,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                source+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0726 #traite_ImportExpression' ,"element" : element}));
            }
        }
        t+='appelf(nomf(import),p(' + source + '))';
        /* debugger */
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ImportNamespaceSpecifier(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.local){
            if(element.local.type === 'Identifier'){
                t+='espace_de_noms(' + element.local.name + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0724 #traite_ImportDefaultSpecifier' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0768 #traite_ImportDefaultSpecifier' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ImportDefaultSpecifier(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.local){
            if(element.local.type === 'Identifier'){
                t+='bibliotheque_par_défaut(' + element.local.name + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0742 #traite_ImportDefaultSpecifier' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0746 #traite_ImportDefaultSpecifier' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ImportSpecifier(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.imported && element.local){
            if(element.imported.type === 'Identifier' && element.local.type === 'Identifier'){
                if(element.imported.name === element.local.name){
                    t+='bibliotheque_spécifiée(' + element.imported.name + ')';
                }else{
                    t+='bibliotheque_spécifiée(' + element.imported.name + ',' + element.local.name + ')';
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0722 #traite_ImportSpecifier' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0722 #traite_ImportSpecifier' ,"element" : element}));
        }
        /*
          https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import
          import exportParDefaut from "nom-module";
          import * as nom from "nom-module";
          import { export1 } from "nom-module";
          import { export1 as alias } from "nom-module";
          import { export3 , export2 } from "nom-module";
          import { export4 , export2 as alias2  } from "nom-module";
          import exportParDefaut1, { export5  } from "nom-module";
          import exportParDefaut2, * as nom2 from "nom-module";
          import "nom-module";
          import { toto , truc } from "nom-module/chemin/vers/fichier-non-exporte";
          let promesse = import("nom-module");
        */
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ImportDeclaration(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let source='';
        let specifiers='';
        if(element.source){
            obj=this.#traite_element(element.source,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                source+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        if(element.specifiers){
            for( let i=0 ; i < element.specifiers.length ; i++ ){
                obj=this.#traite_element(element.specifiers[i],niveau + 1,element.specifiers,tab_comm,false);
                if(obj.__xst === true){
                    specifiers+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        t='importer(' + specifiers + (specifiers === '' ? ( '' ) : ( ',' )) + 'provenance(' + source + ')' + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_SpreadElement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.argument){
            obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                if(element.argument.type === 'CallExpression'){
                    /*
                      cas a=[...a.f()] => appelf(element(...a),nomf(f)) 
                      cas a=[...f]     => appelf(nomf(...f)) 
                    */
                    if(obj.__xva.substr(0,6) === 'appelf'){
                        var position_element=-1;
                        var position_nomf=-1;
                        obj=functionToArray(obj.__xva,true,false,'');
                        if(obj.__xst === true){
                            for( var i=2 ; i < obj.__xva.length ; i++ ){
                                if(obj.__xva[i][7] === 1){
                                    if(obj.__xva[i][1] === 'nomf' && obj.__xva[i][2] === 'f'){
                                        if(obj.__xva[i + 1][2] === 'c' && obj.__xva[i][8] === 1){
                                            position_nomf=i + 1;
                                        }else{
                                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                                        }
                                    }else if(obj.__xva[i][1] === 'element' && obj.__xva[i][2] === 'f'){
                                        if(obj.__xva[i + 1][2] === 'c' && obj.__xva[i][8] === 1){
                                            position_element=i + 1;
                                        }else{
                                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                                        }
                                    }
                                }
                            }
                            if(position_nomf > 0){
                                if(position_element < 0){
                                    obj.__xva[position_nomf][1]='...' + obj.__xva[position_nomf][1];
                                }else{
                                    obj.__xva[position_element][1]='...' + obj.__xva[position_element][1];
                                }
                                var nouvelle_fonction=a2F1(obj.__xva,0,false,1);
                                if(nouvelle_fonction.__xst === true){
                                    t+=nouvelle_fonction.__xva;
                                }else{
                                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                                }
                            }else{
                                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                            }
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                        }
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                    }
                }else{
                    t+='...' + obj.__xva;
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_RestElement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.argument){
            obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                t+='...' + obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_ObjectPattern(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        for(let i in element.properties){
            if(element.properties[i].method !== false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
            if(element.properties[i].shorthand !== false){
                /* const {a, b} = c; =>  const {a:a, b:b} = c; */
                /* debugger; */
                /* return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1207 #traite_ObjectPattern' ,"element" : element})); */
            }
            if(t !== ''){
                t+=',';
            }
            t+=this.#comm_avant_debut1(element.properties[i],niveau,element,tab_comm);
            var val=element.properties[i];
            if(val.computed === true){
                if(val.key.type === 'Identifier'){
                    t+='([' + val.key.name + '],';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0739 #traite_ObjectPattern "' + val.key.type + '"' ,"element" : element}));
                }
            }else{
                if(val.key.type === 'Identifier'){
                    t+='(' + val.key.name + ',';
                }else if(val.key.type === 'Literal'){
                    t+='(' + val.key.raw + ',';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0739 #traite_ObjectPattern "' + val.key.type + '"' ,"element" : element}));
                }
            }
            obj=this.#traite_element(val.value,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                t+=obj.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0745 #traite_ObjectPattern'}));
            }
        }
        t='obj(' + t + ')';
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
            if(val.key === undefined){
                t+='(';
                obj=this.#traite_element(val,niveau + 1,element,tab_comm,false);
                if(obj.__xst === true){
                    t+=obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
            }else{
                if(val.key.type === 'Identifier'){
                    t+='(' + val.key.name + ',';
                }else if(val.key.type === 'Literal'){
                    t+='(' + val.key.raw + ',';
                }else{
                    obj=this.#traite_element(val.key,niveau + 1,element,tab_comm,false);
                    if(obj.__xst === true){
                        t+='(' + obj.__xva + ',';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                    }
                }
                obj=this.#traite_element(val.value,niveau + 1,element,tab_comm,false);
                if(obj.__xst === true){
                    t+=obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
            }
        }
        t+=this.#comm_avant_fin1(element,niveau,element,tab_comm);
        t='obj(' + t + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      let k = class extends _ {}
    */
    #traite_ClassExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let contenu='';
        let etend='';
        if(element.superClass){
            obj=this.#traite_element(element.superClass,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                etend='etend(' + obj.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        if(element.body){
            obj=this.#traite_ast0(element.body,niveau + 2,element,tab_comm);
            if(obj.__xst === true){
                if(obj.__xva !== ''){
                    contenu+=',contenu(' + obj.__xva + ')';
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0466 #traite_FunctionDeclaration' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        t='classe(' + etend + contenu + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      c`<span class="shadow"></span>`
    */
    #traite_TaggedTemplateExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let le_tag='';
        let le_quasi='';
        if(element.tag){
            obj=this.#traite_element(element.tag,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                le_tag=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        if(element.quasi){
            obj=this.#traite_element(element.quasi,niveau,element,tab_comm,false);
            if(obj.__xst === true){
                le_quasi=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1746 #traite_TemplateLiteral' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        t='modèle_annoté(' + le_tag + ',' + le_quasi + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      for (const [t,s] of e)
    */
    #traite_ArrayPattern(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        obj=this.#traite_ArrayExpression(element,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1()}));
        }
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
        t+='';
        let lesPar='';
        for(let i in element.elements){
            commentaire=this.#comm_avant_debut1(element.elements[i],niveau,element,tab_comm);
            if(commentaire !== ''){
                lesPar+=',' + commentaire;
            }
            if(element.elements[i] === null){
                this.#astjs_logerreur({"__xst" : true ,"__xav" : nl1() + ' ATTENTION, CE N\'EST PAS UNE ERREUR MAIS... élément vide dans un tableau' ,"element" : element});
                lesPar+=',p()';
            }else if(element.elements[i].type === 'Literal'){
                lesPar+=',p(' + element.elements[i].raw + ')';
                if(element.elements[i].raw.substr(0,1) === '\''
                       || element.elements[i].raw.substr(0,1) === '"'
                       || element.elements[i].raw.substr(0,1) === '/'
                ){
                    ne_contient_que_des_constantes=false;
                }
                format_constante+=commentaire + '[' + element.elements[i].raw + ']';
                nombre_elements++;
            }else if(element.elements[i].type === 'Identifier'){
                lesPar+=',p(' + element.elements[i].name + ')';
                format_constante+=commentaire + '[' + element.elements[i].name + ']';
                nombre_elements++;
            }else{
                ne_contient_que_des_constantes=false;
                obj=this.#traite_element(element.elements[i],niveau + 1,element,tab_comm,false);
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
        lesPar+=this.#comm_avant_fin1(element,niveau,element,tab_comm);
        t='defTab(' + lesPar + ')';
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
            obj=this.#traite_element(element.id,niveau + 1,element,tab_comm,false);
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
                obj=this.#traite_element(element.params[i],niveau + 1,element,tab_comm,false);
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
        let objet='';
        let propriete='';
        let type_objet='';
        let type_parent=parent.type;
        let type_propriete=element.property.type;
        if(element.object){
            type_objet=element.object.type;
            obj=this.#traite_element(element.object,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                objet=obj.__xva;
                type_objet=element.object.type;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_MemberExpression' ,"element" : element}));
            }
        }else{
            /* cas let  x7 = a ?. [42]; */
            /* cas let x10 = a.b ?. c; */
            type_objet=null;
        }
        obj=this.#traite_element(element.property,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            propriete=obj.__xva;
            type_propriete=element.property.type;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_MemberExpression' ,"element" : element}));
        }
        if(element.computed === false){
            if(type_parent === 'CallExpression'){
                if(parent.optional === true){
                    if(element.property.type === 'Identifier' && element.object.type === 'Identifier'){
                        t=objet + '.' + propriete;
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_MemberExpression' ,"element" : element}));
                    }
                }else{
                    t='element(' + objet + '),nomf(' + propriete + ')';
                }
                return({"__xst" : true ,"__xva" : t});
            }else if(type_parent === 'ChainExpression'){
                /*
                  cas a.b ?. c.d()
                  objet=chainé(a.b,c)
                  on doit retourner chainé(a.b,c.d)
                */
                if(objet.substr(0,7) === 'chainé('){
                    debugger;
                    if(type_propriete === 'Identifier'){
                        t=objet.substr(0,objet.length - 1) + '.' + propriete + ')';
                        return({"__xst" : true ,"__xva" : t});
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_MemberExpression' ,"element" : element}));
                    }
                }else{
                    if(type_objet === null){
                        /*
                          cas let x12 = b.c ?. d ?. e; 
                          pour le e
                        */
                        t=propriete;
                    }else{
                        if(element.optional === true){
                            t='chainé(' + objet + ',' + propriete + ')';
                        }else{
                            t=objet + '.' + propriete;
                        }
                    }
                    return({"__xst" : true ,"__xva" : t});
                }
            }else{
                if(type_objet === 'CallExpression'){
                    /* pour traiter le d de "a.b(c).d" */
                    if(objet.substr(0,7) === 'appelf('){
                        /*
                          Cas le plus général : on retire la dernière parenthèse et on ajoute la propriété 
                        */
                        t=objet.substr(0,objet.length - 1) + 'prop(' + propriete + '))';
                    }else{
                        /*
                          cas tordu : il y a un commentaire dans un tableau vu dans htmx
                          a= [(/** /(elt.getRootNode())).host];
                          => affecte(  a, defTab( #() p( appelf( element(elt) , nomf(getRootNode) , p() , prop(host) )) ) ),
                        */
                        obj=functionToArray(objet,true,false,'');
                        if(obj.__xst === true){
                            /* on retire les commentaires au niveau 1 */
                            var nouveauTableau=obj.__xva;
                            var commentaire='';
                            for( var i=nouveauTableau.length - 1 ; i >= 1 ; i-- ){
                                if(nouveauTableau[i][2] === 'f' && nouveauTableau[i][1] === '#' && nouveauTableau[i][3] === 0){
                                    commentaire+=nouveauTableau[i][13].trim().replace(/\(/g,'[').replace(/\)/g,']');
                                    nouveauTableau=supprimer_un_element_de_la_matrice(nouveauTableau,i,0);
                                }
                            }
                            if(nouveauTableau.length > 0 && nouveauTableau[1][1] === 'appelf' && nouveauTableau[1][2] === 'f'){
                                var nouvelle_fonction=a2F1(nouveauTableau,0,false,1);
                                if(nouvelle_fonction.__xst === true){
                                    if(commentaire !== ''){
                                        t='#(' + commentaire + ')' + nouvelle_fonction.__xva.substr(0,nouvelle_fonction.__xva.length - 1) + 'prop(' + propriete + '))';
                                    }else{
                                        t=nouvelle_fonction.__xva.substr(0,nouvelle_fonction.__xva.length - 1) + 'prop(' + propriete + '))';
                                    }
                                }else{
                                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_MemberExpression' ,"element" : element}));
                                }
                            }else{
                                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_MemberExpression' ,"element" : element}));
                            }
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_MemberExpression' ,"element" : element}));
                        }
                    }
                }else if(type_objet === 'MemberExpression'){
                    /* pour traiter le d de "a.b(c).d" */
                    if(objet.substr(0,8) === 'tableau('){
                        /* on retire la dernière parenthèse et on ajoute la propriété */
                        t=objet.substr(0,objet.length - 1) + 'prop(' + propriete + '))';
                    }else if(objet.substr(0,7) === 'appelf('){
                        /* on retire la dernière parenthèse et on ajoute la propriété */
                        t=objet.substr(0,objet.length - 1) + 'prop(' + propriete + '))';
                    }else{
                        t=objet + '.' + propriete;
                        element.type='Identifier';
                    }
                }else if(type_objet === 'ObjectExpression'){
                    /* pour traiter le "{}.d" */
                    if(objet.substr(0,4) === 'obj('){
                        /* on retire la dernière parenthèse et on ajoute la propriété */
                        t=objet.substr(0,objet.length - 1) + 'prop(' + propriete + '))';
                    }else{
                        t=objet + '.' + propriete;
                        element.type='Identifier';
                    }
                }else if(type_objet === 'LogicalExpression' || type_objet === 'AssignmentExpression' || type_objet === 'NewExpression'){
                    t=objet.substr(0,objet.length - 1) + ',prop(' + propriete + '))';
                }else if(type_objet === 'Literal'){
                    /* cas (rare) a=' '.length  trouvé dans htmx => affecte(a , valeur_constante(' ',prop(length) ) ) */
                    t='valeur_constante(' + objet + ',prop(' + propriete + '))';
                }else if(type_objet === null){
                    /* cas let x10 = a.b ?. c; */
                    t=propriete;
                }else{
                    if(element.optional === true){
                        debugger;
                        t='chainé(' + objet + ',' + propriete + ')';
                    }else{
                        t=objet + '.' + propriete;
                    }
                    /* on force le type d'élément parent */
                    element.type='Identifier';
                }
                return({"__xst" : true ,"__xva" : t});
            }
        }else{
            if(type_parent === 'CallExpression'){
                /*  */
                if(true || type_propriete === 'Literal' && type_objet === 'Identifier'){
                    t='tableau( nomt(' + objet + '),p(' + propriete + '))';
                }else{
                    /* afr debugger; */
                    t='element(' + objet + '),nomf(' + propriete + ')';
                }
                return({"__xst" : true ,"__xva" : t});
            }else{
                if(type_propriete === 'Identifier' && type_objet === 'Identifier'){
                    t=objet + '[' + propriete + ']';
                    return({"__xst" : true ,"__xva" : t});
                }else{
                    if(objet.endsWith(']') && __m_rev1.est_num(propriete)){
                        t=objet + '[' + propriete + ']';
                    }else{
                        if((type_objet === 'Identifier' || type_objet === null) && __m_rev1.est_num(propriete)){
                            t=objet + '[' + propriete + ']';
                        }else{
                            t='tableau(nomt(' + objet + '),p(' + propriete + '))';
                        }
                    }
                    return({"__xst" : true ,"__xva" : t});
                }
            }
        }
        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' #traite_MemberExpression' ,"element" : element}));
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
        obj=this.#traite_element(element,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0671 #traiteCondition1' ,"element" : element}));
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
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1234 #traite_LogicalExpression ' ,"element" : element}));
            }
            droite=obj.__xva;
            if('&&' === element.operator){
                t+='et(' + gauche + ',' + droite + ')';
            }else if('||' === element.operator){
                t+='ou(' + gauche + ',' + droite + ')';
            }else if('??' === element.operator){
                t+='??(' + gauche + ',' + droite + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0775 #traite_LogicalExpression ' ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0778 #traite_LogicalExpression ' ,"element" : element}));
        }
        if(t.substr(0,6) === 'ou(ou(' || t.substr(0,6) === 'et(et(' || t.substr(0,7) === 'ou( ou(' || t.substr(0,7) === 'et( et('){
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
            case 'instanceof' : return 'instance_de';
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
            case '|' : return 'ou_binaire';
            case '&' : return 'et_binaire';
            case '~' : return 'oppose_binaire';
            case '^' : return 'xou_binaire';
            case '>>' : return 'decal_droite';
            case '>>>' : return 'decal_droite_non_signe';
            case '<<' : return 'decal_gauche';
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
    #traite_chaineCallee(element,niveau,parent,tab_comm){
        let obj=null;
        let t='';
        let objet='';
        let optionnel='';
        if(element.object){
            obj=this.#traite_chaineCallee(element.object,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                if(obj.optionnel !== ''){
                    optionnel=obj.optionnel;
                    objet=obj.objet;
                }else{
                    objet=obj.objet;
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1444 #traite_chaineCallee' ,"element" : element}));
            }
        }else{
            obj=this.#traite_element(element,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                objet=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1451 #traite_chaineCallee' ,"element" : element}));
            }
        }
        if(element.property){
            obj=this.#traite_element(element.property,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                if(optionnel !== ''){
                    optionnel+='.' + obj.__xva;
                }else{
                    if(element.hasOwnProperty('optional') && element.optional === true){
                        optionnel=obj.__xva;
                    }else{
                        if(element.property.type === 'Identifier'){
                            objet+='.' + obj.__xva;
                        }else if(element.property.type === 'Literal'){
                            objet='tableau(nomt(' + objet + '),p(' + obj.__xva + '))';
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1475 #traite_chaineCallee' ,"element" : element}));
                        }
                    }
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1480 #traite_chaineCallee' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"objet" : objet ,"optionnel" : optionnel});
    }
    /*
      =============================================================================================================
    */
    #traite_chaineObject(element,niveau,parent,tab_comm){
        let obj=null;
        let t='';
        let objet='';
        let optionnel='';
        debugger;
        if(element.object){
            obj=this.#traite_chaineObject(element.object,niveau + 1,element,tab_comm);
            if(obj.__xst === true){
                if(obj.optionnel !== ''){
                    optionnel=obj.optionnel;
                    objet=obj.objet;
                }else{
                    objet=obj.objet;
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1444 #traite_chaineCallee' ,"element" : element}));
            }
        }else{
            obj=this.#traite_element(element,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                objet=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1451 #traite_chaineCallee' ,"element" : element}));
            }
        }
        if(element.property){
            obj=this.#traite_element(element.property,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                if(optionnel !== ''){
                    optionnel+='.' + obj.__xva;
                }else{
                    if(element.hasOwnProperty('optional') && element.optional === true){
                        optionnel=obj.__xva;
                    }else{
                        if(element.property.type === 'Identifier'){
                            objet+='.' + obj.__xva;
                        }else if(element.property.type === 'Literal'){
                            objet='tableau(nomt(' + objet + '),p(' + obj.__xva + '))';
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1475 #traite_chaineCallee' ,"element" : element}));
                        }
                    }
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1480 #traite_chaineCallee' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"objet" : objet ,"optionnel" : optionnel});
    }
    /*
      =============================================================================================================
    */
    #traite_ChainExpression(element,niveau,parent,tab_comm){
        /*##
https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Optional_chaining
https://github.com/GoogleChrome/lighthouse/blob/main/core/user-flow.js

let  x4 = a ?. (b.c);
let  x5 = b.c ?. e;
let  x6 = b ?. e;
let  x7 = a ?. [42];
let  x8 = a ?. ["b"];
let  x9 = a.b ?. ();
let x10 = a.b ?. c;
let x11 = a.b ?. c.d();
let x12 = b.c ?. d ?. e;
let x13 = a.b ?. c ?. ();
let x14 = a.b ?. c ?. (a,b);
let x15 = a.b ?. c(a,b) ;
let x16 = a.b ?. c(a.b) ;

let x0=a.b ?. ();
let x1=a ?. b();
let x2=a.b ?. c(d);
let x3=b.c("d") ?. e;
let x4=a ?. (b.c);
let x5=b.c ?. e;
let x6=b ?. e;
let x7=a ?. [42];
let x8=a ?. ["b"];
let x9=a.b ?. ();
let x10=a.b ?. c;
let x11=a.b ?. c.d();
let x12=b.c ?. d ?. e;
let x13=a.b ?. c ?. ();
let x14=a.b ?. c ?. (a,b);
let x15=a.b ?. c(a,b);
let x16=a.b ?. c(a.b);
        */
        let t='';
        let obj=null;
        let gauche='';
        let droite='';
        let objet="";
        let propriete='';
        if(!element.expression){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1227 #traite_ChainExpression' ,"element" : element}));
        }
        if(element.expression.type === 'CallExpression'){
            var les_arguments='';
            if(element.expression.hasOwnProperty('arguments')){
                if(element.expression.arguments.length === 0){
                    les_arguments='p()';
                }else{
                    for( let i=0 ; i < element.expression.arguments.length ; i++ ){
                        var le_commentaire=this.#comm_dans_arguments_appel_fonction(element.expression.arguments[i],niveau,element,tab_comm);
                        var obj1=this.#traite_element(element.expression.arguments[i],niveau + 1,element.expression.arguments,tab_comm,false);
                        if(obj1.__xst === true){
                            if(les_arguments !== ''){
                                les_arguments+=',';
                            }
                            les_arguments+='p(' + le_commentaire + obj1.__xva + ')';
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0123 #traite_ChainExpression' ,"element" : element}));
                        }
                    }
                }
            }
            obj=this.#traite_element(element.expression.callee,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                gauche=obj.__xva;
                if(gauche.substr(0,7) === 'chainé('){
                    obj=functionToArray(gauche,true,true,'');
                    if(obj.__xst === true){
                        var nouveauTableau=obj.__xva;
                        /* le nom de l'élément */
                        var t1=a2F1(nouveauTableau,1,true,2,0,[],null,true);
                        if(t1.__xst === true){
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1747 #traite_BinaryExpression ' ,"element" : element}));
                        }
                        /* le reste */
                        var t2=a2F1(nouveauTableau,1,true,nouveauTableau[2][12],0,[],null,false);
                        if(t2.__xst === true){
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1747 #traite_BinaryExpression ' ,"element" : element}));
                        }
                        /*
                          ok pour let  x1 = a?. b();
                          afr pour let x13 = a.b ?. c ?. (); 
                        */
                        if(element.expression.optional === true){
                            t+='chainé(' + t1.__xva + ',chainé(' + t2.__xva + ',appelf(nomf()' + les_arguments + ')))';
                        }else{
                            t+='chainé(' + t1.__xva + ',appelf(nomf(' + t2.__xva + ')' + les_arguments + '))';
                        }
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0324 #traite_BinaryExpression ' ,"element" : element}));
                    }
                }else{
                    t+='chainé(' + gauche + ', appelf( nomf()' + les_arguments + '))';
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1745 #traite_ChainExpression' ,"element" : element}));
            }
        }else if(element.expression.type === 'MemberExpression'){
            element.expression.optional=false;
            obj=this.#traite_element(element.expression.object,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                gauche=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1745 #traite_ChainExpression' ,"element" : element}));
            }
            element.expression.object=null;
            obj=this.#traite_element(element.expression,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                droite=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1752 #traite_ChainExpression' ,"element" : element}));
            }
            t+='chainé(' + gauche + ',' + droite + ')';
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1633 #traite_ChainExpression pour "' + element.expression.type + '"' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_UnaryExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let nomDuTestUnary=this.#recup_nom_operateur(element.operator);
        obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            if((nomDuTestUnary === 'moins' || nomDuTestUnary === 'plus') && __m_rev1.est_num(obj.__xva)){
                if(nomDuTestUnary === 'moins'){
                    t+='-' + obj.__xva;
                }else{
                    t+='+' + obj.__xva;
                }
            }else{
                if(nomDuTestUnary === 'void'){
                    t+='appelf(nomf(void),p(' + obj.__xva + '))';
                }else{
                    t+=nomDuTestUnary + '(' + obj.__xva + ')';
                }
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
        obj=this.#traite_element(element.discriminant,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            t+='quand(' + obj.__xva + ')';
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1312 #traite_SwitchStatement' ,"element" : element}));
        }
        for( i=0 ; i < element.cases.length ; i++ ){
            t+='est(';
            if(element.cases[i].test !== null){
                obj=this.#traite_element(element.cases[i].test,niveau + 1,false,false,element,false);
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
    #traite_ForOfStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let gauche='';
        let droite='';
        let contenu='';
        obj=this.#traite_element(element.left,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1318 #traite_ForInStatement' ,"element" : element}));
        }
        obj=this.#traite_element(element.right,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            droite+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1326 #traite_ForInStatement' ,"element" : element}));
        }
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm,false);
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
        t+='boucle_sur_objet_de(';
        t+='pourChaque(de(' + gauche + ' , ' + droite + ')),';
        t+='faire(' + contenu + ')';
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
        obj=this.#traite_element(element.left,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1318 #traite_ForInStatement' ,"element" : element}));
        }
        obj=this.#traite_element(element.right,niveau + 1,element,tab_comm,false);
        if(obj.__xst === true){
            droite+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1326 #traite_ForInStatement' ,"element" : element}));
        }
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm,false);
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
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm,false);
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
        obj=this.#traite_element(element.test,niveau + 1,element,tab_comm,false);
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
        obj=this.#traite_element(element.test,niveau + 1,element,tab_comm,false);
        if(obj.__xst === false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0897 #traite_WhileStatement' ,"element" : element}));
        }
        test+=obj.__xva;
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm,false);
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
            obj=this.#traite_element(element.init,niveau + 1,element,tab_comm,false);
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
            test+='';
        }else{
            obj=this.#traite_element(element.test,niveau + 1,element,tab_comm,false);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0897 #traite_ForStatement' ,"element" : element}));
            }
            test+=obj.__xva;
        }
        if(element.update === null){
            valeurIncrement='';
        }else{
            obj=this.#traite_element(element.update,niveau + 1,element,tab_comm,false);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0907 #traite_ForStatement' ,"element" : element}));
            }
            valeurIncrement+=obj.__xva;
        }
        if(element.body){
            if(element.expression){
                obj=this.#traite_element(element.body,niveau + 2,element,tab_comm,false);
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
        obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm,false);
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
            obj=this.#traite_element(element.test,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                t+='condition(' + obj.__xva + '),';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1036 #traite_IfStatement' ,"element" : element}));
            }
        }else{
            if(element.test){
                t+='sinonsi(';
                obj=this.#traite_element(element.test,niveau + 1,element,tab_comm,false);
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
        let etend='';
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
                corps_de_la_classe='#(rien ici)';
            }
        }
        if(element.superClass){
            if('Identifier' === element.superClass.type){
                etend=',étend(' + element.superClass.name + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1734 #traite_ClassDeclaration "' + element.superClass.type + '"' ,"element" : element}));
            }
        }
        t+='definition_de_classe(nom_classe(' + nom_de_la_classe + ')' + etend + ',contenu(' + corps_de_la_classe + '))';
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
                obj=this.#traite_element(element.value,niveau + 1,element,tab_comm,false);
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
    #traiteAssignmentPattern(element,niveau,parent,tab_comm){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        if(element.left && element.right){
            var objgauche=this.#traite_element(element.left,niveau + 1,element,tab_comm,false);
            var objdroite=this.#traite_element(element.right,niveau + 1,element,tab_comm,false);
            if(objgauche.__xst === true && objdroite.__xst){
                t+=objgauche.__xva + ',defaut(' + objdroite.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentPattern 1558 pour ' + element.type ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : 'erreur traiteAssignmentPattern 1554 pour ' + element.type ,"element" : element}));
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
            var statique='';
            if(element.hasOwnProperty('static') && element.static === true){
                statique='statique(),';
            }
            t+='méthode(';
            t+='definition(';
            if(element.kind === "get" || element.kind === "set"){
                t+='type(' + (element.kind === 'get' ? ( 'lire' ) : ( 'écrire' )) + '),';
            }
            if(element.computed){
                t+='format_tableau(),';
            }
            if(element.key.name === undefined){
                obj=this.#traite_element(element.key,niveau,element,tab_comm,false);
                if(obj.__xst === false){
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
                t+=statique + 'nom(' + obj.__xva + '),';
            }else{
                t+=statique + 'nom(' + element.key.name + '),';
            }
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
                        obj=this.#traiteAssignmentPattern(element.value.params[j],niveau + 1,element,tab_comm);
                        if(obj.__xst === true){
                            t+='argument(' + obj.__xva + ')';
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                        }
                    }else if(element.value.params[j].type === "RestElement"
                           && element.value.params[j].argument
                           && element.value.params[j].argument.type === 'Identifier'
                    ){
                        t+='argument(...' + element.value.params[j].argument.name + ')';
                    }else if(element.value.params[j].type === "ObjectPattern"){
                        obj=this.#traite_element(element.value.params[j],niveau,element,tab_comm,false);
                        if(obj.__xst === false){
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                        }
                        t+='argument(' + obj.__xva + ')';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + '"' + element.value.params[j].type + '"' ,"element" : element}));
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
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2429 #traite_MethodDefinition' ,"element" : element}));
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
        var objtest1=this.#traite_element(element.test,niveau,element,tab_comm,false);
        if(objtest1.__xst === false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1733 #traite_ConditionalExpression' ,"element" : element}));
        }
        var objSiVrai={};
        var objSiVrai=this.#traite_element(element.consequent,niveau,element,tab_comm,false);
        if(objSiVrai.__xst === false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1738 #traite_ConditionalExpression' ,"element" : element}));
        }
        var objSiFaux={};
        var objSiFaux=this.#traite_element(element.alternate,niveau,element,tab_comm,false);
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
    #traite_ExportDefaultDeclaration(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        if(element.declaration){
            obj=this.#traite_element(element.declaration,niveau + 1,element,tab_comm,false);
            if(obj.__xst === true){
                t+='exporter_par_defaut(valeur(' + obj.__xva + '))';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
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
                var locale='';
                if(specifier.local){
                    if(specifier.local.type === 'Identifier'){
                        locale='locale(' + specifier.local.name + '),';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                    }
                }
                if(specifier.exported){
                    if(specifier.exported.type === "Identifier"){
                        t+='exporter(' + locale + 'nom_de_classe(' + specifier.exported.name + '))';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1777 #traite_ExportNamedDeclaration' ,"element" : element}));
                    }
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1780 #traite_ExportNamedDeclaration' ,"element" : element}));
                }
            }
        }
        if(element.declaration){
            obj=this.#traite_element(element.declaration,niveau,element,tab_comm,false);
            if(obj.__xst === true){
                t+='exporter_declaration(' + obj.__xva + ')';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1736 #traite_TemplateLiteral' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_TemplateElement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        t+='"' + element.value.raw.replace(/"/g,'\\"') + '"';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #traite_TemplateLiteral(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let tableau_des_expressions=[];
        if(element.quasis
               && element.quasis.length === 1
               && 'TemplateElement' === element.quasis[0].type
               && element.quasis[0].value
               && element.quasis[0].value.raw
        ){
            t='`' + element.quasis[0].value.raw + '`';
        }else{
            for( let i=0 ; i < element.expressions.length ; i++ ){
                obj=this.#traite_element(element.expressions[i],niveau,element.expressions,tab_comm,false);
                if(obj.__xst === true){
                    tableau_des_expressions.push(obj.__xva);
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1736 #traite_TemplateLiteral' ,"element" : element}));
                }
            }
            for( let i=0 ; i < element.quasis.length ; i++ ){
                t+=',';
                obj=this.#traite_element(element.quasis[i],niveau,element.quasis,tab_comm,false);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1746 #traite_TemplateLiteral' ,"element" : element}));
                }
                if(i < tableau_des_expressions.length){
                    t+=',' + tableau_des_expressions[i];
                }
            }
            if(t !== ''){
                t=t.substr(1);
            }
            t='concat(' + t + ')';
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
            var obj1=this.#traite_CallExpression(element,niveau + 1,element,{});
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
        if(element.handler){
            if(element.handler.type === 'CatchClause'){
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
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        t+=')';
        if(element.finalizer){
            if(element.finalizer.type === "BlockStatement"){
                obj=this.#traite_ast0(element.finalizer,niveau + 2,element,tab_comm);
                if(obj.__xst === true){
                    t+='finalement(' + obj.__xva + ')';
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1854 #traite_TryStatement' ,"element" : element}));
                }
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
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
            var objgauche=this.#traite_element(element.left,niveau + 1,element,tab_comm,false);
            var objdroite=this.#traite_element(element.right,niveau + 1,element,tab_comm,false);
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
        if(element.argument){
            var objass=this.#traite_element(element.argument,niveau + 1,element,tab_comm,false);
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
        obj=this.#traite_element(element.argument,niveau + 1,element,tab_comm,false);
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
            this.#astjs_logerreur({"__xst" : true ,"__xav" : '2008 l\'opérateur virgule est dangereux dans un tableau !' ,"element" : element});
        }
        for( let i=0 ; i < element.expressions.length ; i++ ){
            obj=this.#traite_element(element.expressions[i],niveau + 2,element,tab_comm,false);
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
                    obj=this.#traite_element(element.body[i].expression,niveau,element,tab_comm,false);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '2126 #traite_BlockStatement' ,"element" : element}));
                    }
                }else{
                    obj=this.#traite_element(element.body[i],niveau,element,tab_comm,false);
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
    #traite_element(element,niveau,parent,tab_comm,ignorer_commentaires_avant){
        let t='';
        let obj=null;
        if(!(ignorer_commentaires_avant !== undefined && ignorer_commentaires_avant === true)){
            t+=this.#comm_avant_debut1(element,niveau,parent,tab_comm);
        }
        switch (element.type){
            case 'Super' : t='Super';
                break;
            case 'Identifier' : t+=element.name;
                break;
            case 'Literal' :
                if(element.regex){
                    let leParam='/' + element.regex.pattern + '/';
                    if(element.regex.flags){
                        leParam+=element.regex.flags;
                    }
                    t+=leParam;
                }else{
                    let valeur='';
                    if(parent && parent.type === 'BlockStatement' && element.value === 'use strict'){
                        t+='useStrict()';
                    }else{
                        /* il faut traiter les valeurs entre quotes qui terminent par un \ */
                        if(element.raw.indexOf('\\\n') >= 0){
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + 'veuillez réécrire ces lignes JS qui terminent par un \\' ,"element" : element}));
                        }else{
                            valeur=element.raw;
                        }
                        if(niveau === 0){
                            t+='directive(' + valeur + ')';
                        }else{
                            t+=valeur;
                        }
                    }
                }
                break;
                
            case 'BreakStatement' :
                if(element.label !== null){
                    if(element.label.type === 'Identifier'){
                        t+='break(' + element.label.name + ')';
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
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
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'SequenceExpression' :
                obj=this.#traite_SequenceExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ThrowStatement' :
                obj=this.#traite_ThrowStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'AwaitExpression' :
                obj=this.#traite_AwaitExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'AssignmentPattern' :
                obj=this.#traite_AssignmentPattern(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'TryStatement' :
                obj=this.#traite_TryStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'NewExpression' :
                obj=this.#traite_NewExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'TemplateLiteral' :
                obj=this.#traite_TemplateLiteral(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'TemplateElement' :
                obj=this.#traite_TemplateElement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ExportNamedDeclaration' :
                obj=this.#traite_ExportNamedDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'SwitchStatement' :
                obj=this.#traite_SwitchStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ForInStatement' :
                obj=this.#traite_ForInStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ForOfStatement' :
                obj=this.#traite_ForOfStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'PrivateIdentifier' :
                obj=this.#traite_PrivateIdentifier(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ConditionalExpression' :
                obj=this.#traite_ConditionalExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'MethodDefinition' :
                obj=this.#traite_MethodDefinition(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'PropertyDefinition' :
                obj=this.#traite_PropertyDefinition(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ClassDeclaration' :
                obj=this.#traite_ClassDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'IfStatement' :
                obj=this.#traite_IfStatement(element,niveau,parent,tab_comm,'if');
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'UpdateExpression' :
                obj=this.#traite_UpdateExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'DoWhileStatement' :
                obj=this.#traite_DoWhileStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'WhileStatement' :
                obj=this.#traite_WhileStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ForStatement' :
                obj=this.#traite_ForStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'UnaryExpression' :
                obj=this.#traite_UnaryExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'LogicalExpression' :
                obj=this.#traite_LogicalExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'MemberExpression' :
                obj=this.#traite_MemberExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'FunctionDeclaration' :
                obj=this.#traite_FunctionDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ArrayExpression' :
                obj=this.#traite_ArrayExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ObjectExpression' :
                obj=this.#traite_ObjectExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'VariableDeclaration' :
                obj=this.#traite_VariableDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'BinaryExpression' :
                obj=this.#traite_BinaryExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ReturnStatement' :
                obj=this.#traite_ReturnStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'AssignmentExpression' :
                obj=this.#traite_AssignmentExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case "ArrowFunctionExpression" :
                obj=this.#traite_ArrowFunctionExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'FunctionExpression' :
                obj=this.#traite_FunctionExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'CallExpression' :
                obj=this.#traite_CallExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ChainExpression' :
                obj=this.#traite_ChainExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ObjectPattern' :
                obj=this.#traite_ObjectPattern(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'RestElement' :
                obj=this.#traite_RestElement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'SpreadElement' :
                obj=this.#traite_SpreadElement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ImportDeclaration' :
                obj=this.#traite_ImportDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ImportSpecifier' :
                obj=this.#traite_ImportSpecifier(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ImportDefaultSpecifier' :
                obj=this.#traite_ImportDefaultSpecifier(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ImportNamespaceSpecifier' :
                obj=this.#traite_ImportNamespaceSpecifier(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'ImportExpression' :
                obj=this.#traite_ImportExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'MetaProperty' :
                obj=this.#traite_MetaProperty(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case "ExportDefaultDeclaration" :
                obj=this.#traite_ExportDefaultDeclaration(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case "ArrayPattern" :
                obj=this.#traite_ArrayPattern(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case "TaggedTemplateExpression" :
                obj=this.#traite_TaggedTemplateExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case "ClassExpression" :
                obj=this.#traite_ClassExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            case 'BlockStatement' :
                /*# 
                  de temps en temps, on peut passer pas là, exemple :
                  switch(a) {
                   case b:
                     { // pourquoi cette accolade ?
                       a=1;
                     } // pourquoi cette accolade ?
                     break;
                  }
                */
                obj=this.#traite_BlockStatement(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + element.type ,"element" : element}));
                }
                break;
                
            default:
                debugger;
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : nl1() + ' non prévu "' + element.type + '" ' ,"element" : element}));
                break;
                
        }
        element=null;
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      les arguments d'une fonction auto_appelée ne commencent qu'après le "element.callee.body.end"
    */
    #comm_dans_arguments_appel_fonction(element,niveau,parent,tab_comm){
        /* tabComment */
        var t='';
        let tab_com_a_supprimer=[];
        if(parent.hasOwnProperty('auto_appelee') && parent.auto_appelee === true){
            var position_debut_parenthese=parent.callee.body.end + 1;
            var position_fin_parenthese=parent.end;
            for( var i=0 ; i < tab_comm.length ; i++ ){
                if(tab_comm[i].start > position_debut_parenthese
                       && tab_comm[i].end < position_fin_parenthese
                       && element.start >= tab_comm[i].end
                ){
                    var txtComment=tab_comm[i].value.trim();
                    t='#( ' + txtComment.replace(/\(/g,'[').replace(/\)/g,']') + ' )' + t;
                    tab_com_a_supprimer.push(i);
                }else if(tab_comm[i].start > position_fin_parenthese){
                    break;
                }
            }
        }else{
            t=this.#comm_avant_debut1(element,niveau,parent,tab_comm);
        }
        for( var j=0 ; j < tab_com_a_supprimer.length ; j++ ){
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
            if(tab_comm[i].type === 'Line'){
                txtComment=txtComment.replace(/\/\*/,'/_*').replace(/\*\//,'*_/');
            }
            var c1=nbre_caracteres2('(',txtComment);
            var c2=nbre_caracteres2(')',txtComment);
            if(c1 === c2){
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + txtComment.substr(1) + ')';
                }else{
                    t+='#(' + txtComment + ')';
                }
            }else{
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']') + ')';
                }else{
                    t+='#(' + txtComment.replace(/\(/g,'[').replace(/\)/g,']') + ')';
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
        let position_debut_bloc=0;
        /* parent.start; */
        let position_fin_bloc=0;
        /* parent.end; */
        let i=0;
        let c1=0;
        let c2=0;
        let tab_com_a_supprimer=[];
        if(parent === null){
            return t;
        }
        if(Array.isArray(parent)){
            position_debut_bloc=parent[0].start;
            position_fin_bloc=parent[parent.length - 1].end;
        }else{
            position_debut_bloc=parent.start;
            position_fin_bloc=parent.end;
        }
        if(parent.hasOwnProperty('auto_appelee') && parent.auto_appelee === true){
            return t;
        }
        for( i=0 ; i < tab_comm.length && tab_comm[i].start <= position_fin_bloc && tab_comm[i].end <= position_fin_bloc ; i++ ){
            if(tab_comm[i].start < position_debut_bloc){
                /* dans le cas des fonctions auto_appelées , les commentaires peuvent être au milieu du tableau */
                continue;
            }
            txtComment=tab_comm[i].value;
            if(txtComment.indexOf('\n') < 0){
                txtComment=txtComment.trim();
                txtComment=' ' + txtComment + ' ';
            }
            if(tab_comm[i].type === 'Line'){
                txtComment=txtComment.replace(/\/\*/,'/_*').replace(/\*\//,'*_/');
            }
            c1=nbre_caracteres2('(',txtComment);
            c2=nbre_caracteres2(')',txtComment);
            if(c1 === c2){
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + txtComment.substr(1) + ')';
                }else{
                    t+='#(' + txtComment + ')';
                }
            }else{
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']') + ')';
                }else{
                    t+='#(' + txtComment.replace(/\(/g,'[').replace(/\)/g,']') + ')';
                }
            }
            tab_com_a_supprimer.push(i);
        }
        for( var j=tab_com_a_supprimer.length - 1 ; j >= 0 ; j-- ){
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
        if(elem === null){
            return t;
        }
        if(elem.start === undefined){
            /* on a probablement un tableau */
            if(Array.isArray(elem)){
                if(elem.length > 0){
                    position_debut_element=elem[0].start;
                }else{
                    if(parent === null){
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
        if(parent === null){
            /* cas initialisation */
            position_debut_bloc=0;
            if(elem.end === undefined){
                if(Array.isArray(elem)){
                    if(elem.length > 0){
                        /* il y a au moins une ligne de code */
                        position_fin_bloc=elem[elem.length - 1].end;
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
            if(elem.start === parent[0].start){
                position_debut_bloc=0;
            }
            position_fin_bloc=parent[parent.length - 1].end;
            /*
              }else if(elem.body){
              position_debut_bloc=elem.start;
              position_fin_bloc=elem.end-1;
            */
        }else{
            position_debut_bloc=parent.start;
            position_fin_bloc=parent.end;
            if(parent.type === "CallExpression" && parent.arguments && Array.isArray(parent.arguments)){
                for( var j=0 ; j < parent.arguments.length ; j++ ){
                    if(elem.start === parent.arguments[j].start){
                        position_debut_bloc=parent.callee.end;
                    }
                }
            }
        }
        if(parent && parent.hasOwnProperty('auto_appelee') && parent.auto_appelee === true){
            return t;
        }
        /*
          dans le cas ou on a [/ * 1 * / a , b ].forEach(/ *  2 * /)
          le traitement de la fonction vient avant le traitement du tableau
        */
        var decallage=-1;
        if('FunctionExpression' === elem.type){
            decallage=elem.start;
        }
        for( i=0 ; i < tab_comm.length && tab_comm[i].start <= position_debut_element && tab_comm[i].end <= position_fin_bloc && tab_comm[i].start >= decallage ; i++ ){
            if(tab_comm[i].start < position_debut_bloc){
                /* dans le cas des fonctions auto_appelées , les commentaires peuvent être au milieu du tableau */
                continue;
            }
            txtComment=tab_comm[i].value;
            if(txtComment.indexOf('\n') < 0){
                txtComment=txtComment.trim();
                txtComment=' ' + txtComment + ' ';
            }
            if(tab_comm[i].type === 'Line'){
                txtComment=txtComment.replace(/\/\*/,'/_*').replace(/\*\//,'*_/');
            }
            if(((txtComment.match(/\(/g) || []).length) === ((txtComment.match(/\)/g) || []).length)){
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + txtComment.substr(1) + ')';
                }else{
                    t+='#(' + txtComment + ')';
                }
            }else{
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t+='#(#' + txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']') + ')';
                }else{
                    t+='#(' + txtComment.replace(/\(/g,'[').replace(/\)/g,']') + ')';
                }
            }
            tab_com_a_supprimer.push(i);
        }
        /*#
          if(t !== ''){
              debugger;
          }
        */
        for( var j=tab_com_a_supprimer.length - 1 ; j >= 0 ; j-- ){
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
        const espaces=CRLF + '   '.repeat(niveau);
        if(Array.isArray(element)){
            for( let i=0 ; i < element.length ; i++ ){
                switch (element[i].type){
                    case 'ExpressionStatement' :
                        obj=this.#traite_element(element[i].expression,niveau,element,tab_comm,false);
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
                        obj=this.#traite_element(element[i],niveau,parent,tab_comm,false);
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
                        obj=this.#traite_element(element.body[i].expression,niveau,element,tab_comm,false);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0187 #traite_ast0 BlockStatement ' ,"element" : element}));
                        }
                    }else{
                        obj=this.#traite_element(element.body[i],niveau,element,tab_comm,false);
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
            obj=this.#traite_element(element.expression,niveau,element,tab_comm,false);
            if(obj.__xst === true){
                t+=espaces + obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 ExpressionStatement' ,"element" : element}));
            }
        }else{
            obj=this.#traite_element(element,niveau,element,tab_comm,false);
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
        /* console.log(ast_de_js); */
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
export{c_astjs_vers_rev1 as c_astjs_vers_rev1};