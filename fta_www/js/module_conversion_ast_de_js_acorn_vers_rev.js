"use strict";
/*
  =====================================================================================================================
  conversion d'un ast produit acorn https://github.com/acornjs/acorn en rev
  point d'entrée = traite_ast
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
        if(element.async!==false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0041 #traite_FunctionExpression async' ,"element" : element}));
        }
        if(element.expression!==false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0044 #traite_FunctionExpression expression' ,"element" : element}));
        }
        if(element.generator!==false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0047 #traite_FunctionExpression generator' ,"element" : element}));
        }
        if(element.id){
           obj=this.#traite_element(element.id,niveau+1,parent,tab_comm);
           if(obj.__xst===true){
               id+=obj.__xva;
           }else{
               return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0055 #traite_FunctionExpression' ,"element" : element}));
           }
        }
        if(element.params && Array.isArray(element.params) ){
            if(element.params.length===0){
                les_arguments=',p()';
            }else{
                for(let i=0;i<element.params.length;i++){
                    obj=this.#traite_element(element.params[i],niveau+1,parent,tab_comm);
                    if(obj.__xst===true){
                        les_arguments+=',p('+obj.__xva+')'
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0123 #traite_CallExpression' ,"element" : element}));
                    }
                }
            }
        }
        
        
        if(element.body){
           obj=this.#traite_ast0(element.body,niveau+2,parent,tab_comm);
           if(obj.__xst===true){
               contenu+=obj.__xva;
           }else{
               return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0055 #traite_FunctionExpression' ,"element" : element}));
           }
        }

        if(id!==''){
            t+='appelf(id('+id+'),nomf(function),contenu('+contenu+')'+les_arguments+')';
        }else{
            t+='appelf(nomf(function),contenu('+contenu+')'+les_arguments+')';
        }

        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =============================================================================================================
    */
    #traite_CallExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let auto_appelee='';
        let les_arguments='';
        let nom_fonction='';
        debugger
        if(element.callee){
           if( element.callee.params && element.arguments && Array.isArray(element.callee.params) && Array.isArray(element.arguments) ){
               auto_appelee='auto_appelee(1),';
           }
           obj=this.#traite_element(element.callee,niveau+1,parent,tab_comm);
           if(obj.__xst===true){
               nom_fonction+=obj.__xva;
           }else{
               return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0059 #traite_CallExpression' ,"element" : element}));
           }
        }else{
           return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0059 #traite_element CallExpression ' ,"element" : element}));
        }
        if(element.arguments && Array.isArray(element.arguments) ){
            if(element.arguments.length===0){
                les_arguments=',p()';
            }else{
                for(let i=0;i<element.arguments.length;i++){
                    obj=this.#traite_element(element.arguments[i],niveau+1,parent,tab_comm);
                    if(obj.__xst===true){
                        les_arguments+=',p('+obj.__xva+')'
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0059 #traite_CallExpression' ,"element" : element}));
                    }
                }
            }
        }
        t+='appelf('+auto_appelee+'nomf('+nom_fonction+')'+les_arguments+')';
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
        let est_expression=false

        if(element.async!==false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0083 #traite_ArrowFunctionExpression async' ,"element" : element}));
        }
        
        est_expression=element.expression;
        
        
        if(element.generator!==false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0047 #traite_ArrowFunctionExpression generator' ,"element" : element}));
        }

        if(element.id){
           obj=this.#traite_element(element.id,niveau+1,parent,tab_comm);
           if(obj.__xst===true){
               id+=obj.__xva;
           }else{
               return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0099 #traite_ArrowFunctionExpression' ,"element" : element}));
           }
        }


        if(element.body){
           if(element.expression){

               obj=this.#traite_element(element.body,niveau+2,parent,tab_comm);
               if(obj.__xst===true){
                   contenu+='retourner('+obj.__xva+')';
               }else{
                   return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0130 #traite_ArrowFunctionExpression' ,"element" : element}));
               }
           }else{
               obj=this.#traite_ast0(element.body,niveau+2,parent,tab_comm);
               if(obj.__xst===true){
                   contenu+=obj.__xva;
               }else{
                   return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0097 #traite_ArrowFunctionExpression' ,"element" : element}));
               }
           }
        }
        
        if(element.params && Array.isArray(element.params) ){
            if(element.params.length===0){
                les_arguments=',p()';
            }else{
                for(let i=0;i<element.params.length;i++){
                    obj=this.#traite_element(element.params[i],niveau+1,parent,tab_comm);
                    if(obj.__xst===true){
                        les_arguments+=',p('+obj.__xva+')'
                    }else{
                        return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0123 #traite_CallExpression' ,"element" : element}));
                    }
                }
            }
        }
        
        
        t+='appelf(flechee()'+les_arguments+',contenu('+contenu+'))';

        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =============================================================================================================
    */
    #traite_ReturnStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let l_argument='';
        
        if(element.argument ){
            obj=this.#traite_element(element.argument,niveau+1,parent,tab_comm);
            if(obj.__xst===true){
                l_argument+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0206 #traite_ReturnStatement' ,"element" : element}));
            }
        }
        if(l_argument===''){
            t+='revenir()';
        }else{
            t+='retourner('+l_argument+')';
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
        
        obj=this.#traite_element(element.left,niveau+1,parent,tab_comm);
        if(obj.__xst===true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0134 #traite_AssignmentExpression' ,"element" : element}));
        }
        
        
        obj=this.#traite_element(element.right,niveau+1,parent,tab_comm);
        if(obj.__xst===true){
            droite+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0142 #traite_AssignmentExpression' ,"element" : element}));
        }
        
        if(element.operator === '='){
            t+='affecte(' + gauche + ' , '+droite+ ')';;
        }else{
            t+='affectop(\'' + element.operator + '\' , ' + gauche + ' , '+droite+ ')';;
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
        
        obj=this.#traite_element(element.left,niveau+1,parent,tab_comm);
        if(obj.__xst===true){
            gauche+=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0279 #traite_BinaryExpression' ,"element" : element}));
        }
        
        
        obj=this.#traite_element(element.right,niveau+1,parent,tab_comm);
        if(obj.__xst===true){
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

            obj = functionToArray(t,true,false,'');
            if(obj.__xst === true){ 
                nouveauTableau = baisserNiveauEtSupprimer(obj.__xva,2,0);
                obj = a2F1(nouveauTableau,0,false,1);
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
            obj = functionToArray(t,true,false,'');
            if(obj.__xst === true){
                nouveauTableau = baisserNiveauEtSupprimer(obj.__xva,2,0);
                obj = a2F1(nouveauTableau,0,false,1);
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
        if(element.declarations)
            if(t !== ''){
                t+=',';
            }
            nomVariable='';
            if(element.declarations[decl].id){
                obj=this.#traite_element(element.declarations[decl].id,niveau+1,parent,tab_comm);
                if(obj.__xst===true){
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

                obj=this.#traite_element(element.declarations[decl].init,niveau+1,parent,tab_comm);
                if(obj.__xst===true){
                    t+=debutDeclaration + obj.__xva + ')';
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
            var val=element.properties[i];
            if(val.key.type === 'Identifier'){
                t+='(' + val.key.name + ',';
            }else if(val.key.type === 'Literal'){
                t+='(' + val.key.raw + ',';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '280 #traite_ObjectExpression "' + val.key.type+'"' ,"element" : element}));
            }
            obj = this.#traite_element(val.value,niveau+1,parent,tab_comm);
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
        t+='defTab(';
        let lesPar='';
        for(let i in element.elements){
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
            }else{
                ne_contient_que_des_constantes=false;
                obj=this.#traite_element(element.elements[i],niveau+1,parent,tab_comm);
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
        
        if(element.async!==false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0455 #traite_FunctionDeclaration async' ,"element" : element}));
        }
        if(element.expression!==false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0458 #traite_FunctionDeclaration expression' ,"element" : element}));
        }
        if(element.generator!==false){
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0461 #traite_FunctionDeclaration generator' ,"element" : element}));
        }
        
        if(element.body){
           obj=this.#traite_ast0(element.body,niveau+2,parent,tab_comm);
           if(obj.__xst===true){
               contenu+=obj.__xva;
           }else{
               return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0466 #traite_FunctionDeclaration' ,"element" : element}));
           }
        }
        
        if(element.id){
           obj=this.#traite_element(element.id,niveau+1,parent,tab_comm);
           if(obj.__xst===true){
               nom_fonction+=obj.__xva;
           }else{
               return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0475 #traite_FunctionDeclaration' ,"element" : element}));
           }
        }else{
           return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0478 #traite_FunctionDeclaration' ,"element" : element}));
        }


        if(element.params && Array.isArray(element.params) ){
            for(let i=0;i<element.params.length;i++){
                obj=this.#traite_element(element.params[i],niveau+1,parent,tab_comm);
                if(obj.__xst===true){
                    les_arguments+=',argument('+obj.__xva+')'
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0123 #traite_FunctionDeclaration' ,"element" : element}));
                }
            }
            if(les_arguments!==''){
                les_arguments=les_arguments.substr(1);
            }
        }else{
           return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0478 #traite_FunctionDeclaration' ,"element" : element}));
        }
        
        t+='fonction( definition(nom('+nom_fonction+') '+les_arguments+' )  ,  contenu( '+contenu+' ) )';
        
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =====================================================================================================================
    */
    #recupProp(element,niveau,parent,tab_comm){
        var t='';
        var obj=null;
        if(element.type === 'BinaryExpression'){
            obj=this.#traite_BinaryExpression(element,niveau,parent,tab_comm);
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
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0561 #recupProp "'+element.type+'"' ,"element" : element}));
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

        if(element.property){
            obj=this.#traite_element(element.property,niveau+1,parent,tab_comm);
            if(obj.__xst === true){
                prop=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0522 #traite_MemberExpression' ,"element" : element}));
            }
        }
        
        obj=this.#traite_element(element.object,niveau+1,element,tab_comm);
        if(obj.__xst === true){
            valeur=obj.__xva;
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0553 #traite_MemberExpression' ,"element" : element}));
        }
        
        if(element.computed === false){
            if(prop!==''){
             
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
                    t+=valeur + '.' + prop;
                }
            }else{
                t+=valeur;
            }
        }else{

            if(prop===''){
                t+=valeur;
            }else{
             
                if(element.object.type === 'Identifier' && element.property.type === 'Identifier'){
                    t+=valeur+'['+prop+']'
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
      =====================================================================================================================
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
        
        obj = this.#traite_element(element,niveau+1,parent,tab_comm);
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
        obj = functionToArray(t,true,true,'');
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
                    nouveau_tableau = baisserNiveauEtSupprimer(o.__xva,2,0);
                    obj = a2F1(nouveau_tableau,0,false,1);
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
            obj = this.#traiteCondition1(element.left,niveau,element,tab_comm);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0762 #traite_LogicalExpression ' ,"element" : element}));
            }
            gauche=obj.__xva;
            obj = this.#traiteCondition1(element.right,niveau,element,tab_comm);
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
            obj = functionToArray(t,true,false,'');
            if(obj.__xst === true){
                nouveau_tableau = baisserNiveauEtSupprimer(obj.__xva,2,0);
                obj = a2F1(nouveau_tableau,0,false,1);
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
      =====================================================================================================================
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
            this.#astjs_logerreur({"__xst" : false ,"__xme" : '0834 #recup_nom_operateur "'+s+'"'})
            return('TODO recupNomOperateur pour "' + s + '"');
        }
    }
    
    /*
      =============================================================================================================
    */
    #traite_UnaryExpression(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        
        
        let nomDuTestUnary = this.#recup_nom_operateur(element.operator);
        obj = this.#traite_element(element.argument,niveau+1,element,tab_comm);
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
    #traite_ForStatement(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        let i=0;
        let pourInit='';
        let test='';
        let valeurIncrement='';
        let contenu = '';
        
        
        if(element.init === null){
            pourInit='';
        }else {
            obj = this.#traite_element(element.init,niveau+1,element,tab_comm);
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
            t+='()';
        }else{

            obj = this.#traite_element(element.test,niveau+1,element,tab_comm);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0897 #traite_ForStatement' ,"element" : element}));
            }
            test+=obj.__xva;
        }

        if(element.update === null){
            valeurIncrement='';
        }else{
            obj = this.#traite_element(element.update,niveau+1,element,tab_comm);
            if(obj.__xst === false){
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0907 #traite_ForStatement' ,"element" : element}));
            }
            valeurIncrement+=obj.__xva;

        }

        
        if(element.body){
            if(element.expression){

                obj=this.#traite_element(element.body,niveau+2,parent,tab_comm);
                if(obj.__xst===true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0922 #traite_ForStatement' ,"element" : element}));
                }
            }else{
                obj=this.#traite_ast0(element.body,niveau+2,parent,tab_comm);
                if(obj.__xst===true){
                    contenu+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0929 #traite_ForStatement' ,"element" : element}));
                }
            }
        }
        
        
        t+='boucle(';
        t+='    initialisation(' + pourInit + ')';
        t+='    condition('+test+')';
        t+='    increment(' + valeurIncrement + ')';
        t+='    faire('+contenu+')';
        t+=')';

        return({"__xst" : true ,"__xva" : t});        
    }
    
    /*
      =====================================================================================================================
    */
    #traite_UpdateExpression(element,niveau,parent,tab_comm){ //element,niveau,opt,parent){
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
        obj = this.#traite_element(element.argument,niveau+1,parent,tab_comm);
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
        if( type === 'if'){
            t+='choix(';
            t+='si(';
            obj = this.#traite_element(element.test,niveau+1,parent,tab_comm);
            if(obj.__xst === true){
                t+='condition(' + obj.__xva + '),';
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1036 #traite_IfStatement' ,"element" : element}));
            }
            
        }else{
            if(element.test){
                t+='sinonsi(';
                obj = this.#traite_element(element.test,niveau+1,parent,tab_comm);
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
            obj=this.#traite_ast0(element.consequent,niveau+2,parent,tab_comm);
            if(obj.__xst===true){
                t+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1063 #traite_IfStatement' ,"element" : element}));
            }
        }else{

            obj=this.#traite_ast0(element,niveau+2,parent,tab_comm);
            if(obj.__xst===true){
                t+=obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1083 #traite_IfStatement' ,"element" : element}));
            }

        }
        t+=')';
        t+=')';
        if(element.alternate){
            obj = this.#traite_IfStatement(element.alternate,niveau,parent,tab_comm,'else');
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
        if(element.body ){
            if(element.body.type === "ClassBody" && element.body.body && element.body.body.length > 0){

                obj=this.#traite_ast0(element.body,niveau+2,parent,tab_comm);
                if(obj.__xst===true){
                    corps_de_la_classe+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1063 #traite_IfStatement' ,"element" : element}));
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
                obj = this.#traite_element(element.value,niveau+1,parent,tab_comm);
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
                        t+='argument('+element.value.params[j].name + ')';
                    }else if(element.value.params[j].type === "AssignmentPattern"){
                        obj = traiteAssignmentPattern(element.value.params[j],niveau + 1,{});
                        if(obj.__xst === true){
                            t+='argument('+obj.__xva + ')';
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
                    obj=this.#traite_ast0(element.value[prop],niveau+2,parent,tab_comm);
                    if(obj.__xst===true){
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
    #traite_element(element,niveau,parent,tab_comm){
        let t='';
        let obj=null;
        t+=this.#comm_avant_debut(element,niveau,tab_comm);
        switch(element.type){
         
            case 'Identifier' :
                t+=element.name;
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
                        return(astjs_logerreur({"__xst" : false ,"__xme" : 'erreur 0063 veuillez réécrire ces lignes JS qui terminent par un \\' ,"element" : element}));
                    }else{
                        valeur=element.raw;
                    }
                    if(niveau===0){
                        t+='directive(' + valeur + ')';
                    }else{
                        t+=valeur;
                    }
                }
            
         
            case 'EmptyStatement' :

                t+='';
                break;
                
            case 'ThisExpression' :
                t+='this';
                break;
                
                
            case 'MethodDefinition' :
                
                obj=this.#traite_MethodDefinition(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '1173 #traite_element PropertyDefinition ' ,"element" : element}));
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
                
                
            
            case 'FunctionExpression':         
                obj=this.#traite_FunctionExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0095 #traite_element FunctionExpression ' ,"element" : element}));
                }
                break;
                
            
            case 'CallExpression':
            
                obj=this.#traite_CallExpression(element,niveau,parent,tab_comm);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0059 #traite_element CallExpression ' ,"element" : element}));
                }
                break;
                
            default:
                t+='#(0570 TODO #traite_element "'+element.type+'")';
                break;
        }
        return({"__xst" : true ,"__xva" : t});
    }
    
    /*
      =====================================================================================================================
    */
    #ajouteCommentaireAvant(element,niveau,positionDebutBloc,tab_comm){
        var t='';
        var i = tab_comm.length - 1;
        var nombre_de_ligne_trouvees=0;
        for( i=tab_comm.length - 1 ; i >= 0 ; i-- ){
            if(tab_comm[i].type === 'Block'){
                if(tab_comm[i].hasOwnProperty('end')){
                    if(tab_comm[i].end <= positionDebutBloc){
                        nombre_de_ligne_trouvees++;
                        /*
                          Attention, ici on remonte le tableau de caractères
                          donc on ajoute le précédent après en changeant les parenthèses en []
                        */
                        var txtComment=tab_comm[i].value;
                        if(txtComment.indexOf('\n') < 0){
                            txtComment=txtComment.trim();
                            txtComment=' ' + txtComment + ' ';
                        }
                        var c1 = nbre_caracteres2('(',txtComment);
                        var c2 = nbre_caracteres2(')',txtComment);
                        if(c1 === c2){
                            if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                                t='#(#' + (txtComment.substr(1)) + ')' + t;
                            }else{
                                t='#(' + txtComment + ')' + t;
                            }
                        }else{
                            if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                                t='#(#' + (txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']')) + ')' + t;
                            }else{
                                t='#(' + (txtComment.replace(/\(/g,'[').replace(/\)/g,']')) + ')' + t;
                            }
                        }
                        tab_comm.splice(i,1);
                    }
                }else{
                    debugger;
                }
            }
        }
        /* on ajoute les commentaires de ligne qui n'ont pas été intégrés précédemment */
        for( i=tab_comm.length - 1 ; i >= 0 ; i-- ){
            if(tab_comm[i].type === 'Line' && tab_comm[i].end < element.start){
                var txtComment=tab_comm[i].value;
                /* on ne traite pas les commentaires insérés automatiquement dans les js valides */
                if(!(txtComment === ''
                 || '<![CDATA[' === txtComment
                 || '<source_javascript_rev>' === txtComment
                 || '</source_javascript_rev>' === txtComment
                 || ']]>' === txtComment)
                ){
                    nombre_de_ligne_trouvees++;
                    var c1 = nbre_caracteres2('(',txtComment);
                    var c2 = nbre_caracteres2(')',txtComment);
                    if(c1 === c2){
                        t='#(✍' + (txtComment.replace(/\*\//g,'* /')) + ')' + t;
                    }else{
                        t='#(✍' + (txtComment.replace(/\(/g,'[').replace(/\)/g,']').replace(/\*\//g,'* /')) + ')' + t;
                    }
                }
                tab_comm.splice(i,1);
            }
        }
        if(nombre_de_ligne_trouvees > 1 ){
            /* si on a trouvé plusieurs ligne de commentaires, on les rassemble */
            var obj = rev_texte_vers_matrice(t);
            if(obj.__xst === true){
                var nouveauCommentaire=obj.__xva[1][13];
                for( var i=2 ; i < obj.__xva.length ; i++ ){
                    nouveauCommentaire+=CRLF + obj.__xva[i][13];
                }
                t='#(' + nouveauCommentaire + ')';
            }
        }
        return t;
    }
    /*
      =====================================================================================================================
    */
    #derniers_commentaires(tab_comm){
        let t='';
        for( let i=0;i<tab_comm.length ; i++ ){
            var txtComment=tab_comm[i].value;
            if(txtComment.indexOf('\n') < 0){
                txtComment=txtComment.trim();
                txtComment=' ' + txtComment + ' ';
            }
            var c1 = nbre_caracteres2('(',txtComment);
            var c2 = nbre_caracteres2(')',txtComment);
            if(c1 === c2){
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t='#(#' + (txtComment.substr(1)) + ')' + t;
                }else{
                    t='#(' + txtComment + ')' + t;
                }
            }else{
                if(txtComment.substr(0,1) === '*' || txtComment.substr(0,1) === '#'){
                    t='#(#' + (txtComment.substr(1).replace(/\(/g,'[').replace(/\)/g,']')) + ')' + t;
                }else{
                    t='#(' + (txtComment.replace(/\(/g,'[').replace(/\)/g,']')) + ')' + t;
                }
            }
         
        }
        return t;
    }
    /*
      =====================================================================================================================
    */
    #comm_avant_fin(elem,niveau,tab_comm){
        var t='';
        var positionDebutBloc=elem.end;
        var commentaire = ajouteCommentaireAvant(elem,niveau + 1,positionDebutBloc);
        t=commentaire;
        return t;
    }
    /*
      =====================================================================================================================
    */
    #comm_avant_debut(elem,niveau,tab_comm){
        var t='';
        var positionDebutBloc=elem.start;
        var commentaire = this.#ajouteCommentaireAvant(elem,niveau + 1,positionDebutBloc , tab_comm );
        t+=commentaire;
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
            for(let i=0;i<element.length;i++){
                switch(element[i].type){
                    case 'ExpressionStatement':
                        obj=this.#traite_element(element[i].expression,niveau,element,tab_comm);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 ExpressionStatement' ,"element" : element}));
                        }
                        break;
                        
                    case 'ClassDeclaration' :
                    case 'FunctionDeclaration':
                    case 'VariableDeclaration':
                    case 'IfStatement':
                    case 'ForStatement':
                        obj=this.#traite_element(element[i],niveau,element,tab_comm);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 ExpressionStatement' ,"element" : element}));
                        }
                        break;
                        
                    case 'EmptyStatement':
                        t+=this.#comm_avant_debut(element[i],niveau,tab_comm);
                    
                        t+='';
                        break;
                        
                    default:
                        t+=espaces + '#(0415 TODO "'+element[i].type+'")';
                        
                }
            }
        }else if(element.type && element.type==='BlockStatement' || element.type && element.type==='ClassBody'){

            if(element.body && Array.isArray(element.body)){
                
                for(let i=0;i<element.body.length;i++){
                    if(element.body[i].type && element.body[i].type==='ExpressionStatement'){
                        obj=this.#traite_element(element.body[i].expression,niveau,parent,tab_comm);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0187 #traite_ast0 BlockStatement ' ,"element" : element}));
                        }
                    }else{
                        obj=this.#traite_element(element.body[i],niveau,parent,tab_comm);
                        if(obj.__xst === true){
                            t+=espaces + obj.__xva;
                        }else{
                            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0429 #traite_ast0 BlockStatement ' ,"element" : element}));
                        }
                    }
                }
                t+=this.#comm_avant_fin(element,niveau,tab_comm,true);
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0191 #traite_ast0 BlockStatement' ,"element" : element}));
            }
     
         
        }else if(element.type && element.type==='ExpressionStatement'){
            obj=this.#traite_element(element.expression,niveau,element,tab_comm);
            if(obj.__xst === true){
                t+=espaces + obj.__xva;
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 #traite_ast0 ExpressionStatement' ,"element" : element}));
            }
         
        }else{
            return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0048 #traite_ast0 non prévu "'+element.type+'"' }));
        }
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
            obj = this.#traite_ast0(ast_de_js,niveau,null,tab_comm);
            if(obj.__xst === true){
                t+=obj.__xva;
                t+=this.#derniers_commentaires(tab_comm);
            }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 traite_ast erreur de convertion' }));
            }
         
        }else{
                return(this.#astjs_logerreur({"__xst" : false ,"__xme" : '0066 traite_ast le point d\'entrée doit être un tableau' }));
        }
        
        
        
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
}
export{module_conversion_ast_de_js_acorn_vers_rev1};