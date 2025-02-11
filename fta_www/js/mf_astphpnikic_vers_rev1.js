"use strict";
/*
  =====================================================================================================================
  conversion d'un AST produit par https://github.com/nikic/PHP-Parser en rev
  point d'entrée = traite_ast_nikic
  todo
  $c=$a<=>$b; // echo "a" <=> "b"; // -1 , ,,,, echo "a" <=> "a"; // 0 ,,,,, echo "b" <=> "a"; // 1
  =====================================================================================================================
*/
class c_astphpnikic_vers_rev1{
    #nom_de_la_variable='';
    #options_traitement={};
    #tableau_de_html_dans_php_a_convertir=[];
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
    #astphp_logerreur(o){
        if(o.hasOwnProperty('element')
               && o.element
               && o.element.hasOwnProperty('attributes')
               && o.element.attributes.hasOwnProperty('startFilePos')
               && o.element.attributes.hasOwnProperty('endFilePos')
        ){
            o.plage=[o.element.attributes.startFilePos,o.element.attributes.endFilePos];
        }
        logerreur(o);
        return o;
    }
    /*
      =============================================================================================================
    */
    #recupNomOperateur(s){
        switch (s){
            case 'typeof' : return 'Typeof';
            case 'instanceof' : return 'Instanceof';
            case '++' : return 'incr1';
            case '--' : return 'decr1';
            case '+' : return 'plus';
            case '-' : return 'moins';
            case '*' : return 'mult';
            case '/' : return 'divi';
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
            case '&' : return 'et_binaire';
            case '|' : return 'ou_binaire';
            default:
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0079  erreur this.#recupNomOperateur "' + s + '" ' ,"element" : element}));
                
        }
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Eval(element,niveau){
        var t='';
        t+='appelf(';
        t+='nomf(eval)';
        var obj=this.#php_traite_Stmt_Expression(element.expr,false,element);
        if(obj.__xst === true){
            t+=',p(' + obj.__xva + ')';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Include(element,niveau){
        var t='';
        t+='appelf(';
        if(element.type === 1){
            t+='nomf(include)';
        }else if(element.type === 2){
            t+='nomf(include_once)';
        }else if(element.type === 3){
            t+='nomf(require)';
        }else if(element.type === 4){
            t+='nomf(require_once)';
        }
        var obj=this.#php_traite_Stmt_Expression(element.expr,false,element);
        if(obj.__xst === true){
            t+=',p(' + obj.__xva + ')';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_Switch(element,niveau,dansFor,de_racine,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var leTest='';
        var tabSw=[];
        if(element.cond){
            var obj=this.#php_traite_Stmt_Expression(element.cond,niveau,false,element,options_traitement);
            if(obj.__xst === true){
                leTest=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        if(element.cases){
            if(element.cases.length > 0){
                var i=0;
                for( i=0 ; i < element.cases.length ; i++ ){
                    var leSw=element.cases[i];
                    var laCondition='';
                    var lesInstructions='';
                    var les_commentaires=this.#ajouteCommentairesAvant(leSw,niveau + 3);
                    if(leSw.cond){
                        var obj=this.#php_traite_Stmt_Expression(leSw.cond,niveau,false,element);
                        if(obj.__xst === true){
                            laCondition=obj.__xva;
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                        }
                    }else{
                        laCondition=null;
                    }
                    if(leSw.stmts){
                        if(leSw.stmts.length > 0){
                            var obj1=this.#traite_ast_nikic0(leSw.stmts,niveau + 3,element,false,false,options_traitement);
                            if(obj1.__xst === true){
                                lesInstructions+=obj1.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                            }
                        }
                    }
                    tabSw.push([laCondition,lesInstructions,les_commentaires]);
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
        }
        t+='\n' + esp0 + 'bascule(';
        t+='\n' + esp0 + esp1 + 'quand(' + leTest + ')';
        var i=0;
        for( i=0 ; i < tabSw.length ; i++ ){
            t+=',\n' + esp0 + esp1 + '' + tabSw[i][2];
            t+=',\n' + esp0 + esp1 + 'est(';
            if(tabSw[i][0] === null){
                t+='\n' + esp0 + esp1 + esp1 + 'valeurNonPrevue()';
            }else{
                t+='\n' + esp0 + esp1 + esp1 + 'valeur(' + tabSw[i][0] + ')';
            }
            t+=',\n' + esp0 + esp1 + esp1 + 'faire(\n' + tabSw[i][1];
            t+='\n' + esp0 + esp1 + esp1 + ')';
            t+='\n' + esp0 + esp1 + ')';
        }
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_TryCatch(element,niveau,dansFor,de_racine,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var contenu='';
        if(element.stmts && element.stmts.length > 0){
            var obj=this.#traite_ast_nikic0(element.stmts,niveau + 2,element,false,false,options_traitement);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        t+='\n' + esp0 + 'essayer(';
        t+='\n' + esp0 + esp1 + 'faire(\n';
        t+=contenu;
        t+='\n' + esp0 + esp1 + '),';
        if(element.catches && element.catches.length > 0){
            var numc=0;
            for( numc=0 ; numc < element.catches.length ; numc++ ){
                contenu='';
                var lesTypesErreurs='';
                if(element.catches[numc].types && element.catches[numc].types.length > 0){
                    var i=0;
                    for( i=0 ; i < element.catches[numc].types.length ; i++ ){
                        if(element.catches[numc].types[i].nodeType === 'Name'){
                            lesTypesErreurs+=element.catches[numc].types[i].name + ' ';
                        }else if(element.catches[numc].types[i].nodeType === "Name_FullyQualified"){
                            lesTypesErreurs+='\\' + element.catches[numc].types[i].name + ' ';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                        }
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
                var leNomErreur='';
                if(element.catches[numc].var && element.catches[numc].var.nodeType === "Expr_Variable"){
                    leNomErreur='$' + element.catches[numc].var.name;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
                if(element.catches[numc].stmts && element.catches[numc].stmts.length > 0){
                    niveau+=3;
                    var obj=this.#traite_ast_nikic0(element.catches[numc].stmts,niveau,element,false,false,options_traitement);
                    niveau-=3;
                    if(obj.__xst === true){
                        contenu+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                    }
                }
                t+='\n' + esp0 + esp1 + 'sierreur(';
                if(lesTypesErreurs === ''){
                    t+='\n' + esp0 + esp1 + esp1 + 'err(' + leNomErreur + ')';
                }else{
                    if(lesTypesErreurs.indexOf('\\') >= 0){
                        t+='\n' + esp0 + esp1 + esp1 + 'err(\'' + lesTypesErreurs.replace(/\\/g,'\\\\') + '\',' + leNomErreur + ')';
                    }else{
                        t+='\n' + esp0 + esp1 + esp1 + 'err(' + lesTypesErreurs + ',' + leNomErreur + ')';
                    }
                }
                t+='\n' + esp0 + esp1 + esp1 + 'faire(\n';
                t+=contenu;
                t+='\n' + esp0 + esp1 + esp1 + ')';
                t+='\n' + esp0 + esp1 + ')';
            }
        }
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_Use(element,niveau){
        var t='';
        var i=0;
        for( i=0 ; i < element.uses.length ; i++ ){
            if("UseItem" === element.uses[i].nodeType){
                if(element.uses[i].name.nodeType === "Name"){
                    t+='appelf(nomf(use),p(\'' + element.uses[i].name.name.replace(/\\/g,'\\\\') + '\'))';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Isset(element,niveau){
        var t='';
        var nomFonction='isset';
        var lesArguments='';
        if(element.vars && element.vars.length > 0){
            var i=0;
            for( i=0 ; i < element.vars.length ; i++ ){
                var obj=this.#php_traite_Stmt_Expression(element.vars[i],niveau,false,element);
                if(obj.__xst === true){
                    lesArguments+=',p(' + obj.__xva + ')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
            }
        }
        t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Unset(element,niveau){
        var t='';
        var nomFonction='unset';
        var lesArguments='';
        if(element.vars && element.vars.length > 0){
            var i=0;
            for( i=0 ; i < element.vars.length ; i++ ){
                var obj=this.#php_traite_Stmt_Expression(element.vars[i],niveau,false,element);
                if(obj.__xst === true){
                    lesArguments+=',p(' + obj.__xva + ')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
                }
            }
        }
        t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_FuncCall(element,niveau){
        var t='';
        var nomFonction='';
        var prefixStatic='';
        if(element.nodeType === "Expr_StaticCall"){
            if(element.class.nodeType === 'Name'){
                prefixStatic=element.class.name + '::';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0359  erreur php_traite_Expr_FuncCall pour Expr_StaticCall ' ,"element" : element}));
            }
        }
        if(element.name){
            if(element.name.nodeType === 'Name'){
                nomFonction=prefixStatic + element.name.name;
            }else if(element.name.nodeType === "Expr_ArrayDimFetch"){
                var obj=this.#php_traite_Expr_ArrayDimFetch(element.name,niveau,0);
                if(obj.__xst === true){
                    nomFonction=prefixStatic + obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0359  erreur php_traite_Expr_FuncCall' ,"element" : element}));
                }
            }else if("Identifier" === element.name.nodeType){
                if(prefixStatic.indexOf('\\') >= 0){
                    nomFonction='\'' + prefixStatic.replace(/\\/g,'\\\\') + element.name.name + '\'';
                }else{
                    nomFonction=prefixStatic + element.name.name;
                }
            }else if(element.name.nodeType === "Expr_Variable"){
                nomFonction=prefixStatic + '$' + element.name.name;
            }else if(element.name.nodeType === "Name_FullyQualified"){
                /* nomFonction=prefixStatic + 'qualification_totale(' + element.name.name + ')'; */
                nomFonction=prefixStatic + '\'\\\\' + element.name.name.replace(/\\/,'\\\\') + '\'';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0364  erreur php_traite_Expr_FuncCall "' + element.name.nodeType + '"' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0367  erreur php_traite_Expr_FuncCall' ,"element" : element}));
        }
        var lesArgumentsCourts='';
        var lesArguments='';
        var tabArgs=[];
        if(element.args && element.args.length > 0){
            var i=0;
            for( i=0 ; i < element.args.length ; i++ ){
                var comm=this.#ajouteCommentairesAvant(element.args[i],niveau);
                if(comm !== ''){
                    comm+=',';
                }
                var obj=this.#php_traite_Stmt_Expression(element.args[i],niveau,false,element);
                if(obj.__xst === true){
                    lesArguments+=',p(' + comm + obj.__xva + ')';
                    tabArgs.push([obj.__xva,element.args[i].value.nodeType]);
                    lesArgumentsCourts+=',' + obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0349  erreur php_traite_Expr_FuncCall ' ,"element" : element}));
                }
            }
        }
        if('cst' === nomFonction){
            t+='cst(' + lesArgumentsCourts.substr(1) + ')';
        }else if('sql_inclure_source' === nomFonction){
            t+='sql_inclure_source(' + lesArgumentsCourts.substr(1) + ')';
        }else if('sql_inclure_reference' === nomFonction){
            t+='sql_inclure_reference(' + lesArgumentsCourts.substr(1) + ')';
        }else if('sql_dans_php' === nomFonction){
            if(lesArgumentsCourts.substr(0,1) === ','){
                lesArgumentsCourts=lesArgumentsCourts.substr(1);
            }
            var source=lesArgumentsCourts.substr(1,lesArgumentsCourts.length - 2);
            var source=source.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
            /* afr passe-t-on vraiement par là maintenant ? */
            debugger;
            /* var obj=convertion_texte_sql_en_rev(source); */
            source=source.replace(/\/\*\*\//g,'');
            var ast=window.sqliteParser(source,{});
            var obj=__m_astsqliteparseur_vers_rev1.traite_ast_de_sqliteparseur(ast);
            if(obj.__xst === true){
                t+='sql(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0369  erreur sql_dans_php ' ,"element" : element}));
            }
        }else if('htmlDansPhp' === nomFonction){
            if(lesArgumentsCourts.substr(0,1) === ','){
                lesArgumentsCourts=lesArgumentsCourts.substr(1);
            }
            var source=lesArgumentsCourts.substr(1,lesArgumentsCourts.length - 2);
            var source=source.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
            var obj=__module_html1.TransformHtmlEnRev(source,0);
            if(obj.__xst === true){
                t+='html_dans_php(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0381  erreur htmlDansPhp ' ,"element" : element}));
            }
        }else if('concat' === nomFonction){
            if(lesArgumentsCourts.substr(0,1) === ','){
                lesArgumentsCourts=lesArgumentsCourts.substr(1);
            }
            t+='' + nomFonction + '(' + lesArgumentsCourts + ')';
        }else{
            t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_printOuEcho(element,niveau,nomFonction){
        var t='';
        var lesArguments='';
        if(element.exprs){
            var i=0;
            for( i=0 ; i < element.exprs.length ; i++ ){
                var obj=this.#php_traite_Stmt_Expression(element.exprs[i],niveau,false,element);
                if(obj.__xst === true){
                    lesArguments+=',p(' + obj.__xva + ')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0412  erreur php_traite_printOuEcho ' ,"element" : element}));
                }
            }
        }
        if(element.expr){
            var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,false,element);
            if(obj.__xst === true){
                lesArguments+=',p(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0421  erreur php_traite_printOuEcho ' ,"element" : element}));
            }
        }
        t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_print(element,niveau){
        return(this.#php_traite_printOuEcho(element,niveau,'print'));
    }
    /*
      =============================================================================================================
    */
    #php_traite_echo(element,niveau){
        return(this.#php_traite_printOuEcho(element,niveau,'echo'));
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_ClassMethod(element,niveau,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var lesArguments='';
        var contenu='';
        var type_retour='';
        t+='\n' + esp0 + 'méthode(';
        t+='\n' + esp0 + esp1 + 'definition(';
        if(element.name && "Identifier" === element.name.nodeType){
            t+='\n' + esp0 + esp1 + esp1 + 'nomm(' + element.name.name + ')';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0464  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
        }
        if(element.params && element.params.length > 0){
            var i=0;
            for( i=0 ; i < element.params.length ; i++ ){
                var comm=this.#ajouteCommentairesAvant(element.params[i],niveau);
                if(comm !== ''){
                    comm+=',';
                }
                if(element.params[i].var && "Expr_Variable" === element.params[i].var.nodeType){
                    if(element.params[i].byRef && element.params[i].byRef === true){
                        lesArguments+='\n' + esp0 + esp1 + esp1 + 'adresseArgument(';
                    }else{
                        lesArguments+='\n' + esp0 + esp1 + esp1 + 'argument(';
                    }
                    lesArguments+=comm;
                    if(element.params[i].variadic && element.params[i].variadic === true){
                        lesArguments+='...$' + element.params[i].var.name;
                    }else{
                        lesArguments+='$' + element.params[i].var.name;
                    }
                    if(element.params[i].default){
                        var obj=this.#php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.__xst === true){
                            lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0487  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
                        }
                    }
                    if(element.params[i].type){
                        var obj=this.#php_traite_Stmt_Expression(element.params[i].type,niveau,false,element);
                        if(obj.__xst === true){
                            if(obj.__xva.indexOf('\\') >= 0){
                                lesArguments+=',type_argument(\'' + obj.__xva.replace(/\\/g,'\\\\') + '\')';
                            }else{
                                lesArguments+=',type_argument(' + obj.__xva + ')';
                            }
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0483  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
                        }
                    }
                    lesArguments+=')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0488  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
                }
            }
        }
        if(element.returnType){
            if(element.returnType.nodeType === 'Name'){
                type_retour=element.returnType.name;
            }else if(element.returnType.nodeType === 'Identifier'){
                type_retour=element.returnType.name;
            }else if(element.returnType.nodeType === 'NullableType'){
                if(element.returnType.type.nodeType === 'Identifier'){
                    type_retour='?' + element.returnType.type.name;
                }else if(element.returnType.type.nodeType === 'Name'){
                    type_retour='?' + element.returnType.type.name;
                }else{
                    return(this.#astphp_logerreur({
                        "__xst" : false ,
                        "__xme" : '0494  erreur php_traite_Stmt_ClassMethod return_type "' + element.returnType.nodeType + '"' ,
                        "element" : element
                    }));
                }
            }else{
                return(this.#astphp_logerreur({
                    "__xst" : false ,
                    "__xme" : '0497  erreur php_traite_Stmt_ClassMethod return_type "' + element.returnType.nodeType + '"' ,
                    "element" : element
                }));
            }
        }
        t+=lesArguments;
        if(element.flags === 33){
            t+='\n' + esp0 + esp1 + esp1 + 'finale()';
            t+='\n' + esp0 + esp1 + esp1 + 'publique()';
        }else if(element.flags === 18){
            t+='\n' + esp0 + esp1 + esp1 + 'abstraite()';
            t+='\n' + esp0 + esp1 + esp1 + 'protégée()';
        }else if(element.flags === 12){
            t+='\n' + esp0 + esp1 + esp1 + 'privée()';
            t+='\n' + esp0 + esp1 + esp1 + 'statique()';
        }else if(element.flags === 9){
            t+='\n' + esp0 + esp1 + esp1 + 'publique()';
            t+='\n' + esp0 + esp1 + esp1 + 'statique(),';
        }else if(element.flags === 4){
            t+='\n' + esp0 + esp1 + esp1 + 'privée()';
        }else if(element.flags === 2){
            t+='\n' + esp0 + esp1 + esp1 + 'protégée()';
        }else if(element.flags === 1){
            t+='\n' + esp0 + esp1 + esp1 + 'publique()';
        }else if(element.flags === 0){
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0507  erreur php_traite_Stmt_ClassMethod element.flags=' + element.flags ,"element" : element}));
        }
        if(type_retour !== ''){
            t+='\n' + esp0 + esp1 + 'type_retour(\'' + type_retour.replace(/\\/g,'\\\\') + '\')';
        }
        t+='\n' + esp0 + esp1 + '),';
        if(element.stmts && element.stmts.length > 0){
            var obj=this.#traite_ast_nikic0(element.stmts,niveau + 2,element,false,false,options_traitement);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0514  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
            }
        }
        if(contenu !== ''){
            t+='\n' + esp0 + esp1 + 'contenu(' + contenu + ')';
        }
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_Function(element,niveau){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var nomFonction='';
        var lesArguments='';
        var contenu='';
        var type_retour='';
        if(element.name && element.name.nodeType === "Identifier"){
            nomFonction=element.name.name;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0542  erreur php_traite_Stmt_Function ' ,"element" : element}));
        }
        if(element.params && element.params.length > 0){
            var i=0;
            for( i=0 ; i < element.params.length ; i++ ){
                var comm=this.#ajouteCommentairesAvant(element.params[i],niveau);
                if(comm !== ''){
                    comm+=',';
                }
                if(element.params[i].var && "Expr_Variable" === element.params[i].var.nodeType){
                    if(element.params[i].byRef && element.params[i].byRef === true){
                        lesArguments+=',\n' + esp0 + esp1 + esp1 + 'adresseArgument(' + comm + '$' + element.params[i].var.name;
                        if(element.params[i].default){
                            var obj=this.#php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                            if(obj.__xst === true){
                                lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0555  erreur php_traite_Stmt_Function ' ,"element" : element}));
                            }
                        }
                        if(element.params[i].type){
                            var obj=this.#php_traite_Stmt_Expression(element.params[i].type,niveau,false,element);
                            if(obj.__xst === true){
                                if(obj.__xva.indexOf('\\') >= 0){
                                    lesArguments+=',type_argument(\'' + obj.__xva.replace(/\\/g,'\\\\') + '\')';
                                }else{
                                    lesArguments+=',type_argument(' + obj.__xva + ')';
                                }
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0483  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
                            }
                        }
                        lesArguments+=')';
                    }else{
                        if(element.params[i].variadic && element.params[i].variadic === true){
                            lesArguments+=',\n' + esp0 + esp1 + esp1 + 'argument(' + comm + '...$' + element.params[i].var.name;
                        }else{
                            lesArguments+=',\n' + esp0 + esp1 + esp1 + 'argument(' + comm + '$' + element.params[i].var.name;
                        }
                        if(element.params[i].default){
                            var obj=this.#php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                            if(obj.__xst === true){
                                lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0570  erreur php_traite_Stmt_Function ' ,"element" : element}));
                            }
                        }
                        if(element.params[i].type){
                            var obj=this.#php_traite_Stmt_Expression(element.params[i].type,niveau,false,element);
                            if(obj.__xst === true){
                                if(obj.__xva.indexOf('\\') >= 0){
                                    lesArguments+=',type_argument(\'' + obj.__xva.replace(/\\/g,'\\\\') + '\')';
                                }else{
                                    lesArguments+=',type_argument(' + obj.__xva + ')';
                                }
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0483  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
                            }
                        }
                        lesArguments+=')';
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0576  erreur php_traite_Stmt_Function ' ,"element" : element}));
                }
            }
        }
        if(element.returnType){
            if(element.returnType.nodeType === 'Name'){
                type_retour=element.returnType.name;
            }else if(element.returnType.nodeType === 'Identifier'){
                type_retour=element.returnType.name;
            }else if(element.returnType.nodeType === 'NullableType'){
                if(element.returnType.type.nodeType === 'Identifier'){
                    type_retour='?' + element.returnType.type.name;
                }else if(element.returnType.type.nodeType === 'Name'){
                    type_retour='?' + element.returnType.type.name;
                }else{
                    return(this.#astphp_logerreur({
                        "__xst" : false ,
                        "__xme" : '0494  erreur php_traite_Stmt_ClassMethod return_type "' + element.returnType.nodeType + '"' ,
                        "element" : element
                    }));
                }
            }else{
                return(this.#astphp_logerreur({
                    "__xst" : false ,
                    "__xme" : '0497  erreur php_traite_Stmt_ClassMethod return_type "' + element.returnType.nodeType + '"' ,
                    "element" : element
                }));
            }
        }
        if(element.stmts && element.stmts.length > 0){
            var obj=this.#traite_ast_nikic0(element.stmts,niveau + 2,element,false);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0587  erreur php_traite_Stmt_Function ' ,"element" : element}));
            }
        }
        t+='\n' + esp0 + 'fonction(';
        t+='\n' + esp0 + esp1 + 'definition(';
        t+='\n' + esp0 + esp1 + esp1 + 'nom(' + nomFonction + ')';
        t+=lesArguments;
        if(type_retour !== ''){
            t+='\n' + esp0 + esp1 + ',type_retour(\'' + type_retour.replace(/\\/g,'\\\\') + '\')';
        }
        t+='\n' + esp0 + esp1 + '),';
        t+='\n' + esp0 + esp1 + 'contenu(\n';
        t+=contenu;
        t+='\n' + esp0 + esp1 + ')';
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_Static(element,niveau){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        if(element.vars && element.vars.length > 0){
            for( var i=0 ; i < element.vars.length ; i++ ){
                var obj=this.#php_traite_Stmt_Expression(element.vars[i],niveau,false,element);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0555  erreur php_traite_Stmt_Function ' ,"element" : element}));
                }
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0564  erreur php_traite_Stmt_Static ' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Clone(element,niveau){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        if(element.expr && element.expr.nodeType === "Expr_Variable"){
            t+='appelf(nomf(clone),p($' + element.expr.name + '))';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0560  erreur php_traite_Stmt_Function ' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Closure(element,niveau){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var lesArguments='';
        var les_utilisations='';
        var contenu='';
        var type_retour='';
        var type_argument='';
        var statique='';
        if(element.params && element.params.length > 0){
            var i=0;
            for( i=0 ; i < element.params.length ; i++ ){
                type_argument='';
                if(element.params[i].type){
                    if(element.params[i].type.nodeType == 'Name' || element.params[i].type.nodeType == 'Identifier'){
                        type_argument=',type_argument( \'' + element.params[i].type.name.replace(/\\/g,'\\\\') + '\' )';
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0614  erreur php_traite_Expr_Closure "' + element.params[i].type.nodeType + '" ' ,"element" : element}));
                    }
                }
                if(element.params[i].attrGroups && element.params[i].attrGroups.length > 0){
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0620  erreur php_traite_Expr_Closure ' ,"element" : element}));
                }
                if(element.params[i].hooks && element.params[i].hooks.length > 0){
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0624  erreur php_traite_Expr_Closure ' ,"element" : element}));
                }
                if(element.params[i].flags !== 0){
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0628  erreur php_traite_Expr_Closure ' ,"element" : element}));
                }
                if(element.params[i].var && "Expr_Variable" === element.params[i].var.nodeType){
                    if(element.params[i].byRef && element.params[i].byRef === true){
                        lesArguments+=',\n' + esp0 + esp1 + esp1 + 'adresseArgument($' + element.params[i].var.name;
                        if(element.params[i].default){
                            var obj=this.#php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                            if(obj.__xst === true){
                                lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0555  erreur php_traite_Expr_Closure ' ,"element" : element}));
                            }
                        }
                        lesArguments+=')';
                    }else{
                        if(element.params[i].variadic && element.params[i].variadic === true){
                            lesArguments+=',\n' + esp0 + esp1 + esp1 + 'argument(...$' + element.params[i].var.name;
                        }else{
                            lesArguments+=',\n' + esp0 + esp1 + esp1 + 'argument($' + element.params[i].var.name;
                        }
                        if(element.params[i].default){
                            var obj=this.#php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                            if(obj.__xst === true){
                                lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0570  erreur php_traite_Expr_Closure ' ,"element" : element}));
                            }
                        }
                        lesArguments+=type_argument + ')';
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0576  erreur php_traite_Expr_Closure ' ,"element" : element}));
                }
            }
            if(lesArguments.length > 1){
                lesArguments=lesArguments.substr(1);
            }
        }
        if(element.uses && element.uses.length > 0){
            var i=0;
            for( i=0 ; i < element.uses.length ; i++ ){
                if(element.uses[i].var && "Expr_Variable" === element.uses[i].var.nodeType){
                    if(element.uses[i].byRef && element.uses[i].byRef === true){
                        les_utilisations+=',\n' + esp0 + esp1 + esp1 + 'utilise_par_adresse($' + element.uses[i].var.name;
                        if(element.uses[i].default){
                            var obj=this.#php_traite_Stmt_Expression(element.uses[i].default,niveau,false,element);
                            if(obj.__xst === true){
                                les_utilisations+=',valeur_defaut(' + obj.__xva + ')';
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0555  erreur php_traite_Expr_Closure ' ,"element" : element}));
                            }
                        }
                        les_utilisations+=')';
                    }else{
                        if(element.uses[i].variadic && element.uses[i].variadic === true){
                            les_utilisations+=',\n' + esp0 + esp1 + esp1 + 'utilise(...$' + element.uses[i].var.name;
                        }else{
                            les_utilisations+=',\n' + esp0 + esp1 + esp1 + 'utilise($' + element.uses[i].var.name;
                        }
                        if(element.uses[i].default){
                            var obj=this.#php_traite_Stmt_Expression(element.uses[i].default,niveau,false,element);
                            if(obj.__xst === true){
                                les_utilisations+=',valeur_defaut(' + obj.__xva + ')';
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0570  erreur php_traite_Expr_Closure ' ,"element" : element}));
                            }
                        }
                        les_utilisations+=')';
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0576  erreur php_traite_Expr_Closure ' ,"element" : element}));
                }
            }
        }
        if(element.stmts && element.stmts.length > 0){
            var obj=this.#traite_ast_nikic0(element.stmts,niveau + 2,element,false);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0587  erreur php_traite_Expr_Closure ' ,"element" : element}));
            }
        }
        if(element.static !== false){
            statique='statique()';
        }
        if(element.returnType){
            var obj=this.#php_traite_Stmt_Expression(element.returnType,niveau,false,element);
            if(obj.__xst === true){
                type_retour+=',type_retour(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0570  erreur php_traite_Expr_Closure ' ,"element" : element}));
            }
        }
        t='cloturée(';
        t+=statique;
        t+=lesArguments;
        t+=type_retour;
        t+=les_utilisations;
        t+='\n' + esp0 + esp1 + 'contenu(\n';
        t+=contenu;
        t+='\n' + esp0 + esp1 + ')';
        t+=')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      traite un "new"
    */
    #php_traite_Expr_New(element,niveau){
        var t='';
        if(element.class){
            var qualif_totale=false;
            var nomClasse='';
            if(element.class.nodeType === "Name"){
                nomClasse=element.class.name;
            }else if(element.class.nodeType === "Name_FullyQualified"){
                nomClasse=element.class.name;
                qualif_totale=true;
            }else if(element.class.nodeType === "Expr_Variable"){
                var obj=this.#php_traite_Stmt_Expression(element.class,niveau,false,element);
                if(obj.__xst === true){
                    nomClasse=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0847  erreur php_traite_Expr_Assign ' ,"element" : element}));
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0589  erreur php_traite_Expr_New ' ,"element" : element}));
            }
            var lesArgumentsDeLaClass='';
            if(element.args){
                var i=0;
                for( i=0 ; i < element.args.length ; i++ ){
                    var obj=this.#php_traite_Stmt_Expression(element.args[i],niveau,false,element);
                    if(obj.__xst === true){
                        lesArgumentsDeLaClass+=',p(' + obj.__xva + ')';
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0599  erreur php_traite_Expr_New ' ,"element" : element}));
                    }
                }
            }
            /*#
              la doc dit :        
              If there are no arguments to be passed to the class's constructor, parentheses after the class name may be omitted. 
              Moi, je mets systématiquement des parenthèses !
            
              if(lesArgumentsDeLaClass===''){
                  lesArgumentsDeLaClass=',sans_arguments()';
              }
            */
            if(nomClasse.indexOf('\\') >= 0){
                if(qualif_totale === true){
                    /* t+='nouveau(appelf(nomf(qualification_totale(\'' + (nomClasse.replace(/\\/g,'\\\\')) + '\'))' + lesArgumentsDeLaClass + ')),'; */
                    t+='nouveau(appelf(nomf(\'\\\\' + nomClasse.replace(/\\/g,'\\\\') + '\')' + lesArgumentsDeLaClass + ')),';
                }else{
                    if(qualif_totale === true){
                        /* t+='nouveau[appelf[nomf[qualification_totale\'' + [nomClasse.replace[/\\/g,'\\\\']] + '\']]' + lesArgumentsDeLaClass + ']],'; */
                        t+='nouveau(appelf(nomf(\'\\\\' + nomClasse.replace(/\\/g,'\\\\') + '\')' + lesArgumentsDeLaClass + ')),';
                    }else{
                        t+='nouveau(appelf(nomf(\'' + nomClasse.replace(/\\/g,'\\\\') + '\')' + lesArgumentsDeLaClass + ')),';
                    }
                }
            }else{
                if(qualif_totale === true){
                    t+='nouveau(appelf(nomf(\'\\\\' + nomClasse + '\')' + lesArgumentsDeLaClass + ')),';
                }else{
                    t+='nouveau(appelf(nomf(' + nomClasse + ')' + lesArgumentsDeLaClass + ')),';
                }
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0610  erreur php_traite_Expr_New ' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_MethodCall(element,niveau){
        var t='';
        var nomFonction='';
        var lelement='';
        var lesArguments='';
        if(element.var){
            var obj=this.#php_traite_Stmt_Expression(element.var,niveau,false,element);
            if(obj.__xst === true){
                lelement+='element(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0583  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0653  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
        }
        if(element.name){
            if(element.name.nodeType === "Identifier"){
                nomFonction=element.name.name;
            }else{
                var obj=this.#php_traite_Stmt_Expression(element.name,niveau,false,element);
                if(obj.__xst === true){
                    nomFonction+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0806  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
                }
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0663  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
        }
        var lesArguments='';
        if(element.args && element.args.length > 0){
            var i=0;
            for( i=0 ; i < element.args.length ; i++ ){
                var comm=this.#ajouteCommentairesAvant(element.args[i],niveau);
                if(comm !== ''){
                    comm+=',';
                }
                var obj=this.#php_traite_Stmt_Expression(element.args[i],niveau,false,element);
                if(obj.__xst === true){
                    lesArguments+=',p(' + comm + obj.__xva + ')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0673  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
                }
            }
        }
        t+='appelf(' + lelement + 'nomf(' + nomFonction + ')' + lesArguments + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_AssignOp_General(element,niveau,nodeType){
        var operation='';
        if("Expr_AssignOp_Concat" === nodeType){
            operation='.=';
        }else if("Expr_AssignOp_Plus" === nodeType){
            operation='+=';
        }else if("Expr_AssignOp_BitwiseOr" === nodeType){
            operation='|=';
        }else if("Expr_AssignOp_Minus" === nodeType){
            operation='-=';
        }else if("Expr_AssignOp_Mod" === nodeType){
            operation='%=';
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0706  php_traite_Expr_AssignOp_General "' + nodeType + '"' ,"element" : element}));
        }
        var t='';
        var gauche='';
        if(element.var){
            var obj=this.#php_traite_Stmt_Expression(element.var,niveau,false,element);
            if(obj.__xst === true){
                gauche+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0716  php_traite_Expr_AssignOp_General ' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0720  php_traite_Expr_AssignOp_General ' ,"element" : element}));
        }
        var droite='';
        if(element.expr){
            var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,false,element);
            if(obj.__xst === true){
                droite+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0729  php_traite_Expr_AssignOp_General ' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0732  php_traite_Expr_AssignOp_General ' ,"element" : element}));
        }
        t+='affecteop(' + '\'' + operation + '\' , ' + gauche + ' , ' + droite + ' )';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_AssignRef(element,niveau){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var gauche='';
        var droite='';
        if(element.var){
            var obj=this.#php_traite_Stmt_Expression(element.var,niveau,false,element);
            if(obj.__xst === true){
                gauche=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0763  erreur php_traite_Expr_AssignRef ' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0766  erreur php_traite_Expr_AssignRef ' ,"element" : element}));
        }
        if(element.expr){
            var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,false,element);
            if(obj.__xst === true){
                droite=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0733  erreur php_traite_Expr_AssignRef ' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0776  erreur php_traite_Expr_AssignRef ' ,"element" : element}));
        }
        t+='affecte_reference(' + gauche + ' , ' + droite + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_declare(element,niveau){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var texte_des_directives='';
        var instructions='';
        for( var i=0 ; i < element.declares.length ; i++ ){
            if(element.declares[i].nodeType === 'DeclareItem'){
                if(element.declares[i].key.nodeType === 'Identifier'){
                    if(element.declares[i].value.nodeType === 'Scalar_Int'){
                        texte_des_directives+=',' + element.declares[i].key.name + '=' + element.declares[i].value.value;
                    }else if(element.declares[i].value.nodeType === 'Scalar_String'){
                        texte_des_directives+=',' + element.declares[i].key.name + '=\'' + element.declares[i].value.value + '\'';
                    }else{
                        return({"__xst" : false ,"__xme" : '0783 type de valeur non prédue dans une valeur de directive' ,"element" : element});
                    }
                }else{
                    return({"__xst" : false ,"__xme" : '0789 clé de directive non traitée "' + element.declares[i].key.nodeType + '"' ,"element" : element});
                }
            }else{
                return({"__xst" : false ,"__xme" : '0781 il faut un element DeclareItem' ,"element" : element});
            }
        }
        if(element.stmts && element.stmts.length > 0){
            var obj=this.#traite_ast_nikic0(element.stmts,niveau + 2,element,false);
            if(obj.__xst === true){
                instructions+=obj.__xva;
            }else{
                return({"__xst" : false ,"__xme" : '0801 erreut sur les instructions dans le directive' ,"element" : element});
            }
        }
        if(texte_des_directives === ''){
            return({"__xst" : false ,"__xme" : '0795 texte de directive non trouvé' ,"element" : element});
        }
        texte_des_directives=texte_des_directives.substr(1);
        if(instructions !== ''){
            t+='directive(texte(\'' + texte_des_directives.replace(/\'/g,'\\\'') + '\'),faire(' + instructions + '))';
        }else{
            t+='directive(texte(\'' + texte_des_directives.replace(/\'/g,'\\\'') + '\'))';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Assign(element,niveau,parent){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var gauche='';
        var droite='';
        if(element.var){
            if(element.var.nodeType === 'Expr_Variable'){
                /*
                  comme il y a beaucoup d'affectation à une variable simple,
                  on fait une affectation directe ici
                */
                gauche='$' + element.var.name;
            }else{
                var obj=this.#php_traite_Stmt_Expression(element.var,niveau,false,element);
                if(obj.__xst === true){
                    gauche=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0847  erreur php_traite_Expr_Assign ' ,"element" : element}));
                }
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0850  erreur php_traite_Expr_Assign ' ,"element" : element}));
        }
        if(element.expr){
            var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,false,element);
            if(obj.__xst === true){
                if(element.expr.nodeType === "Expr_ClassConstFetch"){
                    /* $symbol = self::SYMBOL_NONE; */
                    if(obj.__xva.indexOf('\\') >= 0){
                        droite='valeur_constante(' + obj.__xva + ')';
                    }else{
                        droite=obj.__xva;
                    }
                }else{
                    droite=obj.__xva;
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0733  erreur dans une assignation ' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0860  erreur php_traite_Expr_Assign ' ,"element" : element}));
        }
        t+='affecte(' + gauche + ' , ' + droite + ')';
        if(parent && parent.nodeType && parent.nodeType.substr(0,14) === 'Expr_BinaryOp_'){
            t='(' + t + ')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_ArrayDimFetch(element,niveau,num){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var nomTableau='';
        var nom_variable='';
        var parametres='';
        if(element.var){
            if("Expr_Variable" === element.var.nodeType){
                nom_variable='nomt($' + element.var.name + ')';
            }else if("Expr_ArrayDimFetch" === element.var.nodeType){
                var obj=this.#php_traite_Expr_ArrayDimFetch(element.var,niveau,num + 1);
                if(obj.__xst === true){
                    nom_variable+=obj.__xva;
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0884 php_traite_Expr_ArrayDimFetch ' ,"element" : element}));
                }
            }else{
                var obj=this.#php_traite_Stmt_Expression(element.var,niveau,true,element);
                if(obj.__xst === true){
                    nom_variable+='nomt(' + obj.__xva + ')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0870 php_traite_Expr_ArrayDimFetch ' ,"element" : element}));
                }
            }
        }
        if(element.dim){
            var obj=this.#php_traite_Stmt_Expression(element.dim,niveau,false,element);
            if(obj.__xst === true){
                parametres+=',p(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0881 php_traite_Expr_ArrayDimFetch ' ,"element" : element}));
            }
        }else{
            parametres+=',p()';
        }
        if(num === 0){
            if("Expr_Variable" === element.var.nodeType
                   || "Expr_ArrayDimFetch" === element.var.nodeType
                   || 'Expr_PropertyFetch' === element.var.nodeType
            ){
                t=this.#php_simplifie_tableau(nom_variable,parametres,num);
            }else{
                t='tableau(' + nom_variable + parametres + ')';
            }
        }else{
            if("Expr_Variable" === element.var.nodeType
                   || "Expr_ArrayDimFetch" === element.var.nodeType
                   || 'Expr_PropertyFetch' === element.var.nodeType
            ){
                t=this.#php_simplifie_tableau(nom_variable,parametres,num);
            }else{
                t=nom_variable + parametres;
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_simplifie_tableau(nom_variable,parametres,num){
        var t='';
        var obj_nom_tableau=functionToArray(nom_variable,true,true,'');
        if(obj_nom_tableau.__xst === true){
            if(obj_nom_tableau.__xva.length === 2
                   && obj_nom_tableau.__xva[1][2] === 'c'
                   && obj_nom_tableau.__xva[1][4] === 0
                   && obj_nom_tableau.__xva[1][1].substr(0,1) === '$'
            ){
                /*
                  cas $xxx
                */
                if(parametres.substr(0,1) === ','){
                    parametres=parametres.substr(1);
                }
                var obj_indice_tableau=functionToArray(parametres,true,true,'');
                if(obj_indice_tableau.__xst === true
                       && obj_indice_tableau.__xva.length === 3
                       && obj_indice_tableau.__xva[1][1] === 'p'
                       && obj_indice_tableau.__xva[1][2] === 'f'
                       && obj_indice_tableau.__xva[1][8] === 1
                       && obj_indice_tableau.__xva[2][2] === 'c'
                       && obj_indice_tableau.__xva[2][4] === 0
                ){
                    t=obj_nom_tableau.__xva[1][1] + '[' + obj_indice_tableau.__xva[2][1] + ']';
                }else{
                    t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                }
            }else if(obj_nom_tableau.__xva.length === 3
                   && obj_nom_tableau.__xva[2][2] === 'c'
                   && obj_nom_tableau.__xva[1][8] === 1
                   && obj_nom_tableau.__xva[1][1] === 'nomt'
            ){
                /*
                  cas nomt($xxx)
                */
                if(parametres.substr(0,1) === ','){
                    parametres=parametres.substr(1);
                }
                var obj_indice_tableau=functionToArray(parametres,true,true,'');
                if(obj_indice_tableau.__xst === true
                       && obj_indice_tableau.__xva.length === 3
                       && obj_indice_tableau.__xva[1][1] === 'p'
                       && obj_indice_tableau.__xva[1][2] === 'f'
                       && obj_indice_tableau.__xva[1][8] === 1
                       && obj_indice_tableau.__xva[2][2] === 'c'
                       && obj_indice_tableau.__xva[2][4] === 0
                ){
                    t=obj_nom_tableau.__xva[2][1] + '[' + obj_indice_tableau.__xva[2][1] + ']';
                }else{
                    t='tableau(' + nom_variable + '' + parametres + ')';
                }
            }else{
                /* si */
                if(nom_variable.substr(0,4) === 'nomt'){
                    var ne_contient_que_des_nomt_et_p=true;
                    for( var i=1 ; i < obj_nom_tableau.__xva.length ; i++ ){
                        if(obj_nom_tableau.__xva[i][7] === 0){
                            if(obj_nom_tableau.__xva[i][2] === 'f' && (obj_nom_tableau.__xva[i][1] === 'nomt' || obj_nom_tableau.__xva[i][1] === 'p')){
                            }else{
                                ne_contient_que_des_nomt_et_p=false;
                            }
                        }
                    }
                    if(ne_contient_que_des_nomt_et_p === true){
                        t='tableau(' + nom_variable + '' + parametres + ')';
                    }else{
                        t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                    }
                }else{
                    t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
                }
            }
        }else{
            t='tableau(nomt(' + nom_variable + ')' + parametres + ')';
        }
        return t;
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_List(element,niveau){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var lesElements='';
        if(element.items){
            var i=0;
            for( i=0 ; i < element.items.length ; i++ ){
                if(null === element.items[i]){
                    lesElements+='p()';
                }else if("ArrayItem" === element.items[i].nodeType){
                    var cle='';
                    if(element.items[i].value){
                        var objValeur=this.#php_traite_Stmt_Expression(element.items[i].value,niveau,false,element);
                        if(objValeur.__xst === true){
                            if(lesElements !== ''){
                                lesElements+=' , ';
                            }
                            lesElements+='p(' + objValeur.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1001  erreur php_traite_Expr_List ' ,"element" : element}));
                        }
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1005  erreur php_traite_Expr_List ' ,"element" : element}));
                }
            }
        }
        t+='liste(' + lesElements + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Array(element,niveau){
        var t='';
        var lesElements='';
        var format_court='';
        if(element.items){
            if(element.attributes.kind === 2){
                format_court='format_court(),';
            }
            var i=0;
            for( i=0 ; i < element.items.length ; i++ ){
                if("ArrayItem" === element.items[i].nodeType){
                    var cle='';
                    if(element.items[i].key){
                        var objcle=this.#php_traite_Stmt_Expression(element.items[i].key,niveau,false,element);
                        if(objcle.__xst === true){
                            cle=objcle.__xva;
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1005  erreur php_traite_Expr_Array ' ,"element" : element}));
                        }
                    }
                    if(element.items[i].value){
                        var objValeur=this.#php_traite_Stmt_Expression(element.items[i].value,niveau,false,element);
                        if(objValeur.__xst === true){
                            if(lesElements !== ''){
                                lesElements+=' , ';
                            }
                            if(element.items[i].attributes.hasOwnProperty('comments') && element.items[i].attributes.comments.length > 0){
                                lesElements+=this.#ajouteCommentairesAvant(element.items[i],niveau);
                            }
                            if(cle !== ''){
                                if(element.items[i].byRef && element.items[i].byRef === true){
                                    lesElements+='(' + cle + ' , &' + objValeur.__xva + ')';
                                }else{
                                    lesElements+='(' + cle + ' , ' + objValeur.__xva + ')';
                                }
                            }else{
                                if(element.items[i].byRef && element.items[i].byRef === true){
                                    lesElements+='(&' + objValeur.__xva + ')';
                                }else{
                                    lesElements+='(' + objValeur.__xva + ')';
                                }
                            }
                            cle=objValeur.__xva;
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'ERREUR dans php_traite_Expr_Array 869' ,"element" : element}));
                        }
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1059  erreur php_traite_Expr_Array ' ,"element" : element}));
                }
            }
        }
        t+='defTab(' + format_court + lesElements + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_chaine_raw(valeur_raw,element){
        var t='';
        var rv=valeur_raw;
        var contenu=rv.substr(1,rv.length - 2);
        /* si une chaine contient \\x, je préfère l'éclarter en '\\'.'x' */
        /*
          le traitement de 
          return '\\x' . str_pad($hex, 2, '0', \STR_PAD_LEFT);
          est assez tordu
        */
        /*
          \\x     => ""   , ""    => '\\'   .'x'
          aa\\x   => "aa" , ""    => 'aa'.'\\' .'x'
          aa\\xaa => "aa" , "aa"  => 'aa\\' .'x' . 'aa'
        */
        /*
          
          var tabcarspec=['x','f','o']
          for( var z in tabcarspec){
          var car_a_trouver=tabcarspec[z];
          var chaine_a_trouver='\\\\'+car_a_trouver;
          if(contenu.indexOf(chaine_a_trouver)>=0 ){
          //        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1311 php_traite_chaine_raw TO DO ' ,"element" : element}));
          
          var caractere='';
          if(rv.substr(0,1)==='\''){
          var tableau=contenu.split(chaine_a_trouver);
          var tableau_a_concatener=[];
          for(var i=0;i<tableau.length;i++){
          if(i===tableau.length-1){
          if(tableau[i]===''){
          }else{
          var tt=php_traite_chaine_raw("'"+tableau[i]+"'",element);
          if(tt.__xst===true){
          tableau_a_concatener.push(tt.__xva);
          }else{
          return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1433 php_traite_chaine_raw TO DO ' ,"element" : element}));
          }
          }
          }else{
          if(tableau[i]===''){
          tableau_a_concatener.push("'\\\\'");
          tableau_a_concatener.push("'"+car_a_trouver+"'");
          }else{
          var tt=php_traite_chaine_raw("'"+tableau[i]+"'",element);
          if(tt.__xst===true){
          tableau_a_concatener.push(tt.__xva);
          tableau_a_concatener.push("'\\\\'");
          tableau_a_concatener.push("'"+car_a_trouver+"'");
          }else{
          return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1447 php_traite_chaine_raw' ,"element" : element}));
          }
          }
          }
          }
          t='concat('+tableau_a_concatener.join(',')+')';
          return({__xst:true , __xva : t});
          }else{
          return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1311 php_traite_chaine_raw TO DO ' ,"element" : element}));
          }
          }
          }
        */
        var probablement_dans_une_regex=valeur_raw.substr(1,1) === '/' ? ( true ) : ( false );
        if(rv.substr(0,1) === '\''
                   && contenu.indexOf('\'') < 0
                   && contenu.indexOf('\\') < 0
               || rv.substr(0,1) === '"'
                   && contenu.indexOf('"') < 0
                   && contenu.indexOf('\\') < 0
        ){
            /*
              si c'est une chaine "simple" cad ne contenant ni terminateur ni antislash
            */
            t+=valeur_raw;
        }else{
            /*
              en php, une chaine 'bla \ bla' avec un antislash au milieu est accepté 
              mais pour les fichiers rev, c'est pas excellent, 
              on accepte les \r \n \t \x \o , \" et \' \\ donc on fait une 
              petite analyse et on remonte une erreur si on n'est pas dans ces cas
            */
            var l01=rv.length - 2;
            /*
              la chaine reçue dans le "raw" inclue le " ou les ' en début et fin 
              on les retire pour l'analyse, donc on part de l'avant dernier caractère 
              et on redescend jusqu'à l'indice 1
            */
            var nouvelle_chaine='';
            var i=l01;
            for( i=l01 ; i > 0 ; i-- ){
                if(rv.substr(i,1) === '\\'){
                    /* on remonte à partir du dernier caractère */
                    if(i === l01){
                        /* si le dernier caractère est un \ et que l'avant dernier est aussi un \, pas de problème */
                        if(rv.length > 2 && l01 > 1 && i > 1 && rv.substr(i - 1,1) === '\\'){
                            nouvelle_chaine='\\\\';
                            i--;
                        }else{
                            /* position du \ en dernier */
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0925  une chaine ne doit pas contenir un simple \\ en dernière position  ' ,"element" : element}));
                        }
                    }else{
                        if(i > 1){
                            /*
                              si on est avant le dernier caractère;
                            */
                            if(rv.substr(i - 1,1) === '\\'){
                                nouvelle_chaine='\\\\' + nouvelle_chaine;
                                i--;
                            }else{
                                if(rv.substr(i + 1,1) === 'r'
                                       || rv.substr(i + 1,1) === 'n'
                                       || rv.substr(i + 1,1) === 't'
                                       || rv.substr(i + 1,1) === '\''
                                       || rv.substr(i + 1,1) === '.'
                                       || rv.substr(i + 1,1) === '-'
                                       || rv.substr(i + 1,1) === 'A'
                                       || rv.substr(i + 1,1) === '?'
                                       || rv.substr(i + 1,1) === 'd'
                                       || rv.substr(i + 1,1) === '/'
                                       || rv.substr(i + 1,1) === 'x'
                                       || rv.substr(i + 1,1) === 'o'
                                       || rv.substr(i + 1,1) === 'b'
                                       || rv.substr(i + 1,1) === 'B'
                                       || rv.substr(i + 1,1) === '"'
                                       || rv.substr(i + 1,1) === '$'
                                       || rv.substr(i + 1,1) === 'w'
                                       || rv.substr(i + 1,1) === 's'
                                       || rv.substr(i + 1,1) === 'z'
                                       || rv.substr(i + 1,1) === 'Z'
                                       || rv.substr(i + 1,1) === '('
                                       || rv.substr(i + 1,1) === ')'
                                       || rv.substr(i + 1,1) === '['
                                       || rv.substr(i + 1,1) === ']'
                                ){
                                    if(rv.substr(i + 1,1) === 'r'
                                           || rv.substr(i + 1,1) === 't'
                                           || rv.substr(i + 1,1) === 'n'
                                           || rv.substr(i + 1,1) === '\''
                                               && rv.substr(0,1) === "'"
                                           || rv.substr(i + 1,1) === '"'
                                               && rv.substr(0,1) === '"'
                                    ){
                                        nouvelle_chaine='\\' + nouvelle_chaine;
                                    }else{
                                        nouvelle_chaine='\\\\' + nouvelle_chaine;
                                    }
                                }else{
                                    if(probablement_dans_une_regex === false){
                                        if(i > 0 && rv.substr(i - 1,1) !== '\\'){
                                            nouvelle_chaine='\\\\' + nouvelle_chaine;
                                        }else{
                                            return(this.#astphp_logerreur({
                                                "__xst" : false ,
                                                "__xme" : '1494 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + rv.substr(i + 1,1) + '" ' ,
                                                "element" : element
                                            }));
                                        }
                                    }else{
                                        /*
                                          commenté car $regex='/\'|\\\\(?=[\'\\\\]|$)|(?<=\\\\)\\\/'; ne passait plus 
                                          return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0958 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + (rv.substr(i + 1,1)) + '" ' ,"element" : element}));
                                        */
                                        if(i > 0 && rv.substr(i - 1,1) !== '\\'){
                                            nouvelle_chaine='\\\\' + nouvelle_chaine;
                                        }else{
                                            return(this.#astphp_logerreur({
                                                "__xst" : false ,
                                                "__xme" : '1494 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + rv.substr(i + 1,1) + '" ' ,
                                                "element" : element
                                            }));
                                        }
                                    }
                                }
                            }
                        }else{
                            /*
                              si on est au premier caractère;
                            */
                            if(rv.substr(i,1) === '\\'){
                                var c=nouvelle_chaine.substr(0,1);
                                if(c === '.'
                                       || c === '0'
                                       || c === '-'
                                       || c === 'd'
                                       || c === 'f'
                                       || c === '/'
                                       || c === 'x'
                                       || c === 'o'
                                       || c === 'b'
                                       || c === 's'
                                       || c === 'v'
                                       || c === '\\'
                                       || c === ']'
                                       || c === '['
                                       || c === '$'
                                       || c === '"'
                                       || c === 'N'
                                       || c === '{'
                                           && rv.substr(0,1) === '\''
                                ){
                                    nouvelle_chaine='\\\\' + nouvelle_chaine;
                                }else if(c === 'r'
                                       || c === 'n'
                                       || c === 't'
                                       || c === '\''
                                           && rv.substr(0,1) === '\''
                                       || c === '"'
                                           && rv.substr(0,1) === '"'
                                ){
                                    nouvelle_chaine='\\' + nouvelle_chaine;
                                }else{
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0930 après un backslash il ne peut y avoir que les caractères réduits et pas "' + c + '" ' ,"element" : element}));
                                }
                            }else{
                                nouvelle_chaine=rv.substr(i,1) + nouvelle_chaine;
                            }
                        }
                    }
                }else if(rv.substr(i,1) === '\'' && rv.substr(0,1) === '\''){
                    if(i >= 2 && rv.substr(i - 1,1) === '\\'){
                        nouvelle_chaine='\\\'' + nouvelle_chaine;
                        i--;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0983 il doit y avoir un backslash avant un apostrophe ' ,"element" : element}));
                    }
                }else if(rv.substr(i,1) === '"' && rv.substr(0,1) === '"'){
                    if(i >= 2 && rv.substr(i - 1,1) === '\\'){
                        nouvelle_chaine='\\"' + nouvelle_chaine;
                        i--;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0994 il doit y avoir un backslash avant un guillemet ' ,"element" : element}));
                    }
                }else{
                    nouvelle_chaine=rv.substr(i,1) + nouvelle_chaine;
                }
            }
            t+=rv.substr(0,1) + nouvelle_chaine + rv.substr(0,1);
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      
      
      var comptage={};
    */
    #php_traite_Stmt_Expression(element,niveau,dansFor,parent,options_traitement){
        /*#
          // pour perf
          if( parent && parent.hasOwnProperty('nodeType')){
              if(comptage.hasOwnProperty(element.nodeType+'___parent_'+parent.nodeType)){
                  comptage[element.nodeType+'___parent_'+parent.nodeType]++;
              }else{
                  comptage[element.nodeType+'___parent_'+parent.nodeType]=1;
              }
          }else{
              if(comptage.hasOwnProperty(element.nodeType+'____pas_de_parent')){
                  comptage[element.nodeType+'_no_parent']++;
              }else{
                  comptage[element.nodeType+'_no_parent']=1;
              }
          }
        */
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        if('Expr_BinaryOp_' === element.nodeType.substr(0,14)){
            var obj=this.#php_traite_Expr_BinaryOp_General(element,niveau,parent,options_traitement);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1349  dans php_traite_Stmt_Expression  ' ,"element" : element}));
            }
            /* =============================================== */
        }else if('Expr_Boolean' === element.nodeType.substr(0,12)){
            var obj=this.#php_traite_Expr_BooleanOp_General(element,niveau,options_traitement);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1362  dans php_traite_Stmt_Expression  ' ,"element" : element}));
            }
            /* =============================================== */
        }else if("Expr_AssignOp_" === element.nodeType.substr(0,14)){
            var obj=this.#php_traite_Expr_AssignOp_General(element,niveau,element.nodeType);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1460  dans php_traite_Stmt_Expression  ' ,"element" : element}));
            }
            /* =============================================== */
        }else{
            switch (element.nodeType){
                case "Scalar_Int" : t+=element.attributes.rawValue;
                    break;
                case "Scalar_Float" : t+=element.value;
                    break;
                case "Expr_Variable" : t+='$' + element.name;
                    break;
                case "Identifier" : 
                case "Name" : t+=element.name;
                    break;
                case "NullableType" :
                    if(element.type.nodeType === 'Name'){
                        t+='?' + element.type.name + '';
                    }else if(element.type.nodeType === 'Identifier'){
                        t+='?' + element.type.name + '';
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1132 php_traite_Stmt_Expression NullableType ' ,"element" : element}));
                    }
                    break;
                    
                case "Expr_ClassConstFetch" :
                    /* aaa\bbb::ccc */
                    if(element.class.nodeType === 'Name' && element.name.nodeType === 'Identifier'){
                        if(element.class.name.indexOf('\\') >= 0){
                            if(parent.nodeType === 'Expr_Array'
                                   || 'Expr_Ternary' === parent.nodeType
                                   || 'Arg' === parent.nodeType
                                   || 'Expr_BinaryOp_' === parent.nodeType.substr(0,14)
                            ){
                                t+='valeur_constante(\'' + (element.class.name.replace(/\\/g,'\\\\') + '::' + element.name.name) + '\')';
                            }else{
                                t+='\'' + element.class.name.replace(/\\/g,'\\\\') + '::' + element.name.name + '\'';
                            }
                        }else{
                            t+='' + element.class.name + '::' + element.name.name + '';
                        }
                    }
                    break;
                    
                case "Stmt_ClassConst" :
                    var privee='';
                    var constantes='';
                    var protegee='';
                    var publique='';
                    if(element.flags && element.flags > 0){
                        if(element.flags === 1){
                            publique='publique()';
                        }else if(element.flags === 4){
                            privee='privée()';
                        }else if(element.flags === 2){
                            protegee='protégée()';
                        }else{
                            debugger;
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1130 php_traite_Stmt_Expression Stmt_ClassConst class="' + element.flags + '" ' ,"element" : element}));
                        }
                    }
                    if(element.consts && element.consts.length > 0){
                        for( var i=0 ; i < element.consts.length ; i++ ){
                            var nom_constante='';
                            var valeur_constante='';
                            if(element.consts[i].name.nodeType === 'Identifier'){
                                nom_constante=element.consts[i].name.name;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1138 php_traite_Stmt_Expression Stmt_ClassConst ' ,"element" : element}));
                            }
                            var obj=this.#php_traite_Stmt_Expression(element.consts[i].value,niveau,false,element,options_traitement);
                            if(obj.__xst === true){
                                valeur_constante=obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1147 php_traite_Stmt_Expression Stmt_ClassConst ' ,"element" : element}));
                            }
                            constantes+=',constante(' + privee + publique + protegee + ',nomc(' + nom_constante + '),valeur(' + valeur_constante + '))';
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1136 php_traite_Stmt_Expression Stmt_ClassConst ' ,"element" : element}));
                    }
                    t+=constantes.substr(1);
                    break;
                    
                case "Stmt_Property" :
                    if(element.props && element.props.length > 0){
                        var i=0;
                        for( i=0 ; i < element.props.length ; i++ ){
                            if("PropertyItem" === element.props[i].nodeType
                                   && element.props[i].name
                                   && element.props[i].name.nodeType === "VarLikeIdentifier"
                            ){
                                if(element.flags && element.flags === 4){
                                    t+='variable_privée(';
                                }else if(element.flags && element.flags === 2){
                                    t+='variable_protégée(';
                                }else if(element.flags && element.flags === 1){
                                    t+='variable_publique(';
                                }else if(element.flags && element.flags === 9){
                                    /*
                                      public static $embedding_file = __FILE__;
                                    */
                                    t+='variable_publique_statique(';
                                }else if(element.flags && element.flags === 12){
                                    /*
                                      private static $_resources = array();
                                    */
                                    t+='variable_privée_statique(';
                                }else if(element.flags && element.flags === 10){
                                    /*
                                      private static $_resources = array();
                                    */
                                    t+='variable_ptotégée_statique(';
                                }else{
                                    debugger;
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1003 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                                }
                                if(element.type){
                                    if(element.type.nodeType === 'Identifier'){
                                        t+='type_variable(' + element.type.name + '),';
                                    }else if(element.type.nodeType === 'Name'){
                                        t+='type_variable(' + element.type.name + '),';
                                    }else if(element.type.nodeType === "NullableType"){
                                        if(element.type.type.nodeType === 'Name_FullyQualified'){
                                            t+='type_variable(\'?\\\\' + element.type.type.name + '\'),';
                                        }else if(element.type.type.nodeType === 'Identifier'){
                                            if(element.type.type.name.indexOf('\\') >= 0){
                                                t+='type_variable(\'?' + element.type.type.name + '\'),';
                                            }else{
                                                t+='type_variable(?' + element.type.type.name + '),';
                                            }
                                        }else if(element.type.type.nodeType === 'Name'){
                                            if(element.type.type.name.indexOf('\\') >= 0){
                                                t+='type_variable(\'?' + element.type.type.name + '\'),';
                                            }else{
                                                t+='type_variable(?' + element.type.type.name + '),';
                                            }
                                        }else{
                                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1198 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                                        }
                                    }else{
                                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1192 php_traite_Stmt_Expression Stmt_Property "' + element.type.nodeType + '" ' ,"element" : element}));
                                    }
                                }
                                /* le nom de la variable */
                                t+='$' + element.props[i].name.name;
                                /*  */
                                if(element.props[i].default){
                                    var obj=this.#php_traite_Stmt_Expression(element.props[i].default,niveau,true,element,options_traitement);
                                    if(obj.__xst === true){
                                        t+=',valeur_defaut(' + obj.__xva + ')';
                                    }else{
                                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1033 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                                    }
                                }
                                t+=')';
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0934 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                            }
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0931 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Scalar_String" :
                    if(element.attributes.kind && element.attributes.kind === 3){
                        t+='heredoc(\'' + element.attributes.docLabel + '\',`\n' + element.attributes.rawValue.replace(/`/g,'\\`') + '`)';
                    }else if(element.attributes.kind && element.attributes.kind === 4){
                        t+='nowdoc(\'' + element.attributes.docLabel + '\',`\n' + element.attributes.rawValue.replace(/`/g,'\\`') + '`)';
                    }else if(element.attributes.rawValue.substr(0,1) === '\'' || element.attributes.rawValue.substr(0,1) === '"'){
                        var obj=this.#php_traite_chaine_raw(element.attributes.rawValue,element);
                        if(obj.__xst === true){
                            t+=obj.__xva;
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1702 php_traite_Stmt_Expression Scalar_String ' ,"element" : element}));
                        }
                    }else{
                        t+=element.attributes.rawValue;
                    }
                    /* =============================================== */
                    break;
                    
                case "Stmt_ClassMethod" :
                    var obj=this.#php_traite_Stmt_ClassMethod(element,niveau,options_traitement);
                    if(obj.__xst === true){
                        t+='\n' + esp0 + obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1051  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Stmt_Continue" :
                    if(element.num === null){
                        t+='\n' + esp0 + 'continue()';
                    }else{
                        var obj=this.#php_traite_Stmt_Expression(element.num,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='\n' + esp0 + 'continue(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0999  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_UnaryMinus" :
                    var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        if(obj.__xva.substr(0,17) === 'valeur_constante('
                               || 'propriete' === obj.__xva.substr(0,9)
                               || element.expr.nodeType === 'Expr_ArrayDimFetch'
                        ){
                            t+='moins(' + obj.__xva + ')';
                        }else{
                            t+='-' + obj.__xva;
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0902  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    break;
                    
                case "Stmt_Global" :
                    var variables='';
                    var i={};
                    for(i in element.vars){
                        if(element.vars[i].nodeType === "Expr_Variable"){
                            variables+=',$' + element.vars[i].name;
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1325  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }
                    if(variables !== ''){
                        variables=variables.substr(1);
                        t+='globale(' + variables + ')';
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1065  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    break;
                    
                case "Expr_UnaryPlus" :
                    var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        if(obj.__xva.substr(0,17) === 'valeur_constante(' || 'propriete' === obj.__xva.substr(0,9)){
                            t+='plus(' + obj.__xva + ')';
                        }else{
                            t+='+' + obj.__xva;
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '0902  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_ArrayDimFetch" :
                    var obj=this.#php_traite_Expr_ArrayDimFetch(element,niveau,0);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1242  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_MethodCall" :
                    var obj=this.#php_traite_Expr_MethodCall(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1252  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Scalar_MagicConst_File" : t+='__FILE__';
                    break;
                case "Scalar_MagicConst_Class" : t+='__CLASS__';
                    break;
                case "Scalar_MagicConst_Line" : t+='__LINE__';
                    break;
                case "Scalar_MagicConst_Dir" : t+='__DIR__';
                    break;
                case "Scalar_MagicConst_Method" : t+='__METHOD__';
                    break;
                case "Arg" :
                    /* =============================================== */
                    if(element.byRef === true){
                        t+='&';
                    }
                    var obj=this.#php_traite_Stmt_Expression(element.value,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1270  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Assign" :
                    var obj=this.#php_traite_Expr_Assign(element,niveau,parent);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'erreur dans php_traite_Stmt_Expression 0512 ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_AssignRef" :
                    var obj=this.#php_traite_Expr_AssignRef(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'erreur dans php_traite_Stmt_Expression 0512 ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_FuncCall" :
                    var obj=this.#php_traite_Expr_FuncCall(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1304  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Include" :
                    var obj=this.#php_traite_Expr_Include(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1317  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Eval" :
                    var obj=this.#php_traite_Expr_Eval(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1327  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Ternary" :
                    var obj=this.#php_traite_Expr_Ternary(element,niveau,options_traitement);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1338  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case 'Expr_Isset' :
                    var obj=this.#php_traite_Expr_Isset(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1375  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case 'Expr_Array' :
                    var obj=this.#php_traite_Expr_Array(element,niveau,0);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'erreur dans php_traite_Stmt_Expression 1117' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_List" :
                    var obj=this.#php_traite_Expr_List(element,niveau,0);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'erreur dans php_traite_Stmt_Expression 0492' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Exit" :
                    if(element.expr){
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='sortir(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1411  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }else{
                        t+='sortir()';
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_ConstFetch" :
                    if(element.name){
                        if(element.name.nodeType === 'Name'){
                            if(element.name.name === 'true'){
                                t+='vrai';
                            }else if(element.name.name === 'false'){
                                t+='faux';
                            }else{
                                t+=element.name.name;
                            }
                        }else if(element.name.nodeType === 'Name_FullyQualified'){
                            if(element.name.name.indexOf('\\') >= 0){
                                t+='valeur_constante(\'\\\\' + element.name.name.replace(/\\/g,'\\\\') + '\')';
                            }else{
                                t+='valeur_constante(\'\\\\' + element.name.name + '\')';
                            }
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1430  dans php_traite_Stmt_Expression "' + element.name.nodeType + '" ' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2083  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_ErrorSuppress" :
                    if(element.expr){
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='supprimeErreur(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1446  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1449  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Print" :
                    var obj=this.#php_traite_print(element,niveau);
                    if(obj.__xst === true){
                        t+='\n' + esp0 + obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1471  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_New" :
                    var obj=this.#php_traite_Expr_New(element,niveau);
                    if(obj.__xst === true){
                        t+='\n' + esp0 + obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1483  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_PostInc" :
                    if(element.var && element.var.nodeType === "Expr_Variable"){
                        t+='$' + element.var.name + '++';
                    }else{
                        var obj=this.#php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='postinc(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1497  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_PostDec" :
                    if(element.var && element.var.nodeType === "Expr_Variable"){
                        t+='$' + element.var.name + '--';
                    }else{
                        var obj=this.#php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='postdec(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1510  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_PreDec" :
                    if(element.var && element.var.nodeType === "Expr_Variable"){
                        t+='--$' + element.var.name;
                    }else{
                        var obj=this.#php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='predec(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1527  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_PreInc" :
                    if(element.var && element.var.nodeType === "Expr_Variable"){
                        t+='++$' + element.var.name;
                    }else{
                        var obj=this.#php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='preinc(' + obj.__xva + ' )';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1538  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Cast_Array" :
                    if(element.expr){
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='casttableau(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1403  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1406  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Cast_Double" :
                    if(element.expr){
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='castfloat(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1540  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1543  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Cast_String" :
                    if(element.expr){
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='caststring(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1555  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1558  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Empty" :
                    if(element.expr){
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='appelf(nomf(empty),p(' + obj.__xva + '))';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1546  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1549  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Cast_Int" :
                    if(element.expr){
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='castint(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1561  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1564  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_StaticCall" :
                    var obj=this.#php_traite_Expr_FuncCall(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1576  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_PropertyFetch" :
                    if('Expr_Variable' === element.var.nodeType && element.name.nodeType === 'Identifier'){
                        t+='$' + element.var.name + '->' + element.name.name;
                    }else{
                        var variable='';
                        if(element.var){
                            var obj=this.#php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                            if(obj.__xst === true){
                                variable=obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1890  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                            }
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1450  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                        }
                        var propriete='';
                        if(element.name){
                            if(element.name.nodeType === 'Identifier'){
                                propriete=element.name.name;
                            }else if(element.name.nodeType === 'Expr_Variable'){
                                propriete='$' + element.name.name;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1900  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                            }
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1454  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                        }
                        t+='propriete(' + variable + ',' + propriete + ')';
                    }
                    /* =============================================== */
                    break;
                    
                case "Scalar_InterpolatedString" :
                    if(element.parts){
                        var chaine_concat='';
                        var i=0;
                        var tableau_des_elements=[];
                        for( i=0 ; i < element.parts.length ; i++ ){
                            if("InterpolatedStringPart" === element.parts[i].nodeType){
                                chaine_concat+=',"' + element.parts[i].value.replace(/\\/g,'\\\\').replace(/"/g,'\\"') + '"';
                                tableau_des_elements.push(element.parts[i].value.replace(/\\/g,'\\\\').replace(/"/g,'\\"'));
                            }else if("Expr_Variable" === element.parts[i].nodeType){
                                chaine_concat+=',$' + element.parts[i].name + '';
                                tableau_des_elements.push('{$' + element.parts[i].name + '}');
                            }else if("Expr_PropertyFetch" === element.parts[i].nodeType){
                                var obj=this.#php_traite_Stmt_Expression(element.parts[i],niveau,dansFor,element,options_traitement);
                                if(obj.__xst === true){
                                    chaine_concat+=',' + obj.__xva + '';
                                    tableau_des_elements.push('{' + obj.__xva + '}');
                                }else{
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1890  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                                }
                            }else if("Expr_MethodCall" === element.parts[i].nodeType){
                                var obj=this.#php_traite_Expr_MethodCall(element.parts[i],niveau);
                                if(obj.__xst === true){
                                    chaine_concat+=',' + obj.__xva + '';
                                    /* à vérifier */
                                    debugger;
                                    /* à vérifier */
                                    tableau_des_elements.push('{' + obj.__xva + '}');
                                }else{
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1252  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                                }
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1475  dans php_traite_Stmt_Expression "' + element.parts[i].nodeType + '" ' ,"element" : element}));
                            }
                        }
                        t+='encapsulé("';
                        for( i=0 ; i < tableau_des_elements.length ; i++ ){
                            t+=tableau_des_elements[i].replace(/"/g,'\\"');
                        }
                        t+='")';
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1472  dans php_traite_Stmt_Expression Scalar_InterpolatedString ' ,"element" : element}));
                    }
                    break;
                    
                case "Expr_ClassConstFetch" :
                    if(element.class && element.class.nodeType === "Name" && element.name && element.name.nodeType === "Identifier"){
                        t+=element.class.name + '::' + element.name.name;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1653  dans php_traite_Stmt_Expression Expr_ClassConstFetch ' ,"element" : element}));
                    }
                    break;
                    
                case "Expr_StaticPropertyFetch" :
                    /* $filename = self::$embedding_file; */
                    if(element.class && element.class.nodeType === 'Name' && element.name && element.name.nodeType === "VarLikeIdentifier"){
                        t+=element.class.name + '::$' + element.name.name;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2185  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                    }
                    break;
                    
                case "StaticVar" :
                    var variable="";
                    if(element.var){
                        var obj=this.#php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            variable+=obj.__xva;
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1197  dans php_traite_Stmt_Expression pas de ' + element.nodeType + ' ' ,"element" : element}));
                    }
                    var valeurDef="";
                    if(element.default && element.default !== null){
                        var obj=this.#php_traite_Stmt_Expression(element.default,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='\n' + esp0 + 'static(' + variable + ' , ' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1200  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                        }
                    }else{
                        t+='\n' + esp0 + 'static(' + variable + ')';
                    }
                    break;
                    
                case "Expr_Instanceof" :
                    if(element.class
                           && element.class.nodeType === 'Name_FullyQualified'
                           && element.expr
                           && element.expr.nodeType === "Expr_Variable"
                    ){
                        t+='instance_de($' + element.expr.name + ' , valeur_constante(\'\\\\' + element.class.name.replace(/\\/g,'\\\\') + '\'))';
                    }else if(element.class && element.class.nodeType === 'Name'){
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            if(element.class.name.indexOf('\\') >= 0){
                                t+='instance_de(' + obj.__xva + ' , \'' + element.class.name.replace(/\\/g,'\\\\') + '\')';
                            }else{
                                t+='instance_de(' + obj.__xva + ' , ' + element.class.name + ')';
                            }
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                        }
                    }else{
                        var nom='';
                        var obj=this.#php_traite_Stmt_Expression(element.class,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            nom=obj.__xva;
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                        }
                        var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            t+='instance_de(' + obj.__xva + ' , ' + nom + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                        }
                    }
                    break;
                    
                case "Expr_Throw" :
                    if(element.expr && element.expr.nodeType === "Expr_New"){
                        var obj=this.#php_traite_Expr_New(element.expr,niveau);
                        if(obj.__xst === true){
                            t+='throw(' + obj.__xva + ')';
                        }else{
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1748  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                        }
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1751  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Closure" :
                    var obj=this.#php_traite_Expr_Closure(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1576  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    /* =============================================== */
                    break;
                    
                case "Expr_Clone" :
                    var obj=this.#php_traite_Expr_Clone(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1576  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    break;
                    
                case "Stmt_Static" :
                    var obj=this.#php_traite_Stmt_Static(element,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2183  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                    break;
                    
                default:
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1392  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                    break;
                    
            }
        }
        return({"__xst" : true ,"__xva" : t ,"nodeType" : element.nodeType});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_Ternary(element,niveau,options_traitement){
        var t='';
        var conditionIf='';
        if(element.cond){
            var obj=this.#php_traiteCondition1(element.cond,niveau,element);
            if(obj.__xst === true){
                conditionIf=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1744 erreur php_traite_Expr_Ternary' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1705 erreur php_traite_Expr_Ternary' ,"element" : element}));
        }
        var siVrai='';
        if(element.if){
            var objSiVrai=this.#php_traite_Stmt_Expression(element.if,niveau,false,element,options_traitement);
            if(objSiVrai.__xst === true){
                siVrai=objSiVrai.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1758 erreur php_traite_Expr_Ternary' ,"element" : element}));
            }
        }
        var siFaux='';
        if(element.else){
            var objsiFaux=this.#php_traite_Stmt_Expression(element.else,niveau,false,element,options_traitement);
            if(objsiFaux.__xst === true){
                siFaux=objsiFaux.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1769 erreur php_traite_Expr_Ternary' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1772 erreur php_traite_Expr_Ternary' ,"element" : element}));
        }
        t+='testEnLigne(condition(' + conditionIf + '),siVrai(' + siVrai + '),siFaux(' + siFaux + '))';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_BooleanOp_General(element,niveau,options_traitement){
        var t='';
        if(element.expr){
            var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,false,element,options_traitement);
            if(obj.__xst === true){
                if(element.nodeType === 'Expr_BooleanNot'){
                    t+='non(' + obj.__xva + ')';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1788 erreur php_traite_Expr_BooleanOp_General' ,"element" : element}));
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1791 erreur php_traite_Expr_BooleanOp_General' ,"element" : element}));
            }
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Expr_BinaryOp_General(element,niveau,parent,options_traitement){
        var t='';
        var gauche='';
        var objGauche=this.#php_traite_Stmt_Expression(element.left,niveau,false,element,options_traitement);
        if(objGauche.__xst === true){
            gauche=objGauche.__xva;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1497  dans php_traite_Expr_BinaryOp_General' ,"element" : element}));
        }
        var droite='';
        var objdroite=this.#php_traite_Stmt_Expression(element.right,niveau,false,element,options_traitement);
        if(objdroite.__xst === true){
            if(objdroite.__xva.substr(0,7) === 'concat(' && "Expr_BinaryOp_Concat" === element.nodeType){
                droite=objdroite.__xva.substr(7);
                droite=droite.substr(0,droite.length - 1);
            }else{
                droite=objdroite.__xva;
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1513  dans php_traite_Expr_BinaryOp_General' ,"element" : element}));
        }
        if(element.nodeType === 'Expr_BinaryOp_BooleanOr'){
            if(parent.nodeType === 'Expr_BinaryOp_BooleanOr'){
                t+='' + gauche + ' , ' + droite + '';
            }else{
                t+='ou(' + gauche + ' , ' + droite + ')';
            }
        }else if(element.nodeType === 'Expr_BinaryOp_BooleanAnd'){
            if(parent.nodeType === 'Expr_BinaryOp_BooleanAnd'){
                t+='' + gauche + ' , ' + droite + '';
            }else{
                t+='et(' + gauche + ' , ' + droite + ')';
            }
        }else if(element.nodeType === 'Expr_BinaryOp_LogicalAnd'){
            t+='et_logique(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_LogicalOr'){
            t+='ou_logique(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_BitwiseXor'){
            t+='xou_binaire(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_BitwiseOr'){
            t+='ou_binaire(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_BitwiseAnd'){
            t+='et_binaire(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_NotIdentical'){
            t+='diffstricte(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Concat'){
            t+='concat(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_NotEqual'){
            t+='diff(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Equal'){
            t+='egal(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Identical'){
            t+='egalstricte(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Greater'){
            t+='sup(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BooleanNot'){
            t+='non(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Coalesce'){
            t+='??(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Mul'){
            t+='mult(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Plus'){
            t+='plus(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Minus'){
            t+='moins(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Smaller'){
            t+='inf(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_GreaterOrEqual'){
            t+='supeg(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_SmallerOrEqual'){
            t+='infeg(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Mod'){
            t+='modulo(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_ShiftLeft'){
            t+='decal_gauche(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_Div'){
            t+='divi(' + gauche + ' , ' + droite + ')';
        }else if(element.nodeType === 'Expr_BinaryOp_ShiftRight'){
            t+='decal_droite(' + gauche + ' , ' + droite + ')';
        }else{
            return(this.#astphp_logerreur({
                "__xst" : false ,
                "__xme" : '1918  non prévu ' + element.nodeType + ' dans php_traite_Expr_BinaryOp_General "' + element.nodeType + '"' ,
                "element" : element
            }));
        }
        if(t.substr(0,14) === 'concat(concat('
               || t.substr(0,6) === 'et(et('
               || t.substr(0,6) === 'ou(ou('
               || t.substr(0,10) === 'plus(plus('
               || t.substr(0,12) === 'moins(moins('
               || t.substr(0,22) === 'ou_binaire(ou_binaire('
        ){
            var tableau1=iterateCharacters2(t);
            var o=functionToArray2(tableau1.out,false,true,'');
            if(o.__xst === true){
                var nouveauTableau=baisserNiveauEtSupprimer(o.__xva,2,0);
                var obj=__m_rev1.matrice_vers_source_rev1(nouveauTableau,0,true,1);
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
    #php_traiteCondition1(element,niveau,parent,options_traitement){
        var t='';
        var obj=this.#php_traite_Stmt_Expression(element,niveau,false,parent);
        if(obj.__xst === true){
            /*
              il y a souvent un niveau de parenthèses en trop ici 
              On parcourt la matrice pour voir si 
              - la première entrée est une fonction vide
              - tous les autres niveaux sont >=1
            */
            if(obj.__xva.substr(0,1) === '(' && obj.__xva.substr(obj.__xva.length - 1,1) === ')'){
                var matrice=functionToArray(obj.__xva,true,true,'');
                if(matrice.__xst === true && matrice.__xva.length >= 2){
                    if(matrice.__xva[1][1] === ''){
                        var l01=matrice.__xva.length;
                        var tout_est_superieur=true;
                        var j=2;
                        for( j=2 ; j < l01 ; j++ ){
                            if(matrice.__xva[j][3] < 1){
                                tout_est_superieur=false;
                                break;
                            }
                        }
                        if(tout_est_superieur === true){
                            var nouveauTableau=baisserNiveauEtSupprimer(matrice.__xva,1,0);
                            var obj1=__m_rev1.matrice_vers_source_rev1(nouveauTableau,0,true,1);
                            if(obj1.__xst === true){
                                t+=obj1.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '16164334  dans php_traiteCondition1' ,"element" : element}));
                            }
                        }else{
                            t+=obj.__xva;
                        }
                    }else{
                        t+=obj.__xva;
                    }
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1656  dans php_traiteCondition1' ,"element" : element}));
                }
            }else{
                t+=obj.__xva;
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1665  dans php_traiteCondition1' ,"element" : element}));
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_While(element,niveau,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var conditionWhile='';
        if(element.cond){
            var obj=this.#php_traiteCondition1(element.cond,niveau,element,options_traitement);
            if(obj.__xst === true){
                conditionWhile=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1497  dans php_traite_Stmt_While' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1948  dans php_traite_Stmt_While' ,"element" : element}));
        }
        var instructionsDansWhile='';
        if(element.stmts){
            var obj=this.#traite_ast_nikic0(element.stmts,niveau + 2,element,false,false,options_traitement);
            if(obj.__xst === true){
                instructionsDansWhile+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1956  dans php_traite_Stmt_While' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1959  dans php_traite_Stmt_While' ,"element" : element}));
        }
        t+='\n' + esp0 + 'tantQue(';
        t+='\n' + esp0 + esp1 + 'condition(' + conditionWhile + ')';
        t+='\n' + esp0 + esp1 + 'faire(\n';
        t+=instructionsDansWhile;
        t+='\n' + esp0 + esp1 + ')';
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_If(element,niveau,unElseIfOuUnElse,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var conditionIf='';
        /*
          attention, if($a){}else if($b){}else{} ressort avec ce parseur comme
          if($a){}else{if($b){}else{}} ( ça ajoute un niveau!!! )
        */
        var instructionsDansElseOuElseifIf='';
        if(element.cond){
            var obj=this.#php_traiteCondition1(element.cond,niveau,element,options_traitement);
            if(obj.__xst === true){
                conditionIf=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2081  dans php_traite_Stmt_If' ,"element" : element}));
            }
        }else{
            conditionIf='';
        }
        var instructionsDansIf='';
        if(element.stmts){
            var obj=this.#traite_ast_nikic0(element.stmts,niveau + 3,element,false,false,options_traitement);
            if(obj.__xst === true){
                instructionsDansIf+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2096  dans php_traite_Stmt_If' ,"element" : element}));
            }
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1999  dans php_traite_Stmt_If' ,"element" : element}));
        }
        if(unElseIfOuUnElse){
            t+='\n' + esp0 + esp1 + 'sinonsi(';
            t+='\n' + esp0 + esp1 + esp1 + 'condition(' + conditionIf + ')';
            t+='\n' + esp0 + esp1 + esp1 + 'alors(\n';
            t+=instructionsDansIf;
            t+='\n' + esp0 + esp1 + esp1 + ')';
            t+='\n' + esp0 + esp1 + ')';
        }else{
            t+='\n' + esp0 + 'choix(';
            t+='\n' + esp0 + esp1 + 'si(';
            t+='\n' + esp0 + esp1 + esp1 + 'condition(' + conditionIf + ')';
            t+='\n' + esp0 + esp1 + esp1 + 'alors(\n';
            t+=instructionsDansIf;
            t+='\n' + esp0 + esp1 + esp1 + ')';
            t+='\n' + esp0 + esp1 + ')';
        }
        if(element.elseifs){
            var j={};
            for(j in element.elseifs){
                var objElseIf=this.#php_traite_Stmt_If(element.elseifs[j],niveau,true,options_traitement);
                if(objElseIf.__xst === true){
                    t+='' + objElseIf.__xva + '';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2126  dans php_traite_Stmt_If' ,"element" : element}));
                }
            }
        }
        if(element.else){
            if(element.else.stmts){
                if(false && element.else.stmts.length === 1 && element.else.stmts[0].nodeType === "Stmt_If"){
                    var objElseIf=this.#php_traite_Stmt_If(element.else.stmts[0],niveau,true,options_traitement);
                    if(objElseIf.__xst === true){
                        t+='' + objElseIf.__xva + '';
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2140  dans php_traite_Stmt_If' ,"element" : element}));
                    }
                }else{
                    niveau+=3;
                    var obj=this.#traite_ast_nikic0(element.else.stmts,niveau,element,false,false,options_traitement);
                    niveau-=3;
                    if(obj.__xst === true){
                        t+='\n' + esp0 + esp1 + 'sinon(';
                        t+='\n' + esp0 + esp1 + esp1 + 'alors(\n';
                        t+=obj.__xva;
                        t+='\n' + esp0 + esp1 + esp1 + ')';
                        t+='\n' + esp0 + esp1 + ')';
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2154  dans php_traite_Stmt_If' ,"element" : element}));
                    }
                }
            }
        }
        if(unElseIfOuUnElse){
        }else{
            t+='\n' + esp0 + ')';
        }
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_Class(element,niveau,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var nom_de_classe='';
        var contenu='';
        var implemente='';
        var indicateurs='';
        var etend='';
        if(element.extends){
            if(element.extends.nodeType === 'Name'){
                if(element.extends.name.indexOf('\\') >= 0){
                    etend+='\n' + esp0 + esp1 + ',étend(\'' + element.extends.name.replace(/\\/g,'\\\\') + '\')';
                }else{
                    etend+='\n' + esp0 + esp1 + ',étend(' + element.extends.name + ')';
                }
            }else if(element.extends.nodeType === 'Name_FullyQualified'){
                if(element.extends.name.indexOf('\\') >= 0){
                    etend+='\n' + esp0 + esp1 + ',étend(\'\\\\' + element.extends.name.replace(/\\/g,'\\\\') + '\')';
                }else{
                    etend+='\n' + esp0 + esp1 + ',étend(\'\\\\' + element.extends.name + '\')';
                }
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2573 dans php_traite_Stmt_Class pour "' + element.extends.nodeType + '"' ,"element" : element}));
            }
        }
        if(element.implements && element.implements.length > 0){
            for( var i=0 ; i < element.implements.length ; i++ ){
                if(element.implements[i].nodeType === 'Name'){
                    implemente+=',' + element.implements[i].name;
                }else if(element.implements[i].nodeType === 'Name_FullyQualified'){
                    implemente+=',\'\\\\' + element.implements[i].name + '\'';
                }else{
                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2111 dans php_traite_Stmt_Class' ,"element" : element}));
                }
            }
            implemente='\n' + esp0 + esp1 + ',implemente(' + implemente.substr(1) + ')';
        }
        if(element.flags && element.flags > 0){
            if(element.flags === 16){
                indicateurs+=',abstraite()';
            }else if(element.flags === 32){
                indicateurs+=',finale()';
            }else{
                debugger;
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2123 dans php_traite_Stmt_Class' ,"element" : element}));
            }
        }
        if(element.name && element.name.nodeType === "Identifier"){
            nom_de_classe=element.name.name;
        }else{
            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2108 dans php_traite_Stmt_Class' ,"element" : element}));
        }
        if(element.stmts && element.stmts.length > 0){
            var obj=this.#traite_ast_nikic0(element.stmts,niveau + 2,element,false,false,options_traitement);
            if(obj.__xst === true){
                contenu=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1955  dans php_traite_Stmt_Class' ,"element" : element}));
            }
        }else{
            contenu='';
            /* return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1949  dans php_traite_Stmt_Class' ,"element" : element})); */
        }
        t+='\n' + esp0 + 'definition_de_classe(';
        t+='\n' + esp0 + esp1 + 'nom_classe(' + nom_de_classe + ')';
        t+=indicateurs;
        t+=implemente;
        t+=etend;
        t+='\n' + esp0 + esp1 + 'contenu(' + contenu;
        t+='\n' + esp0 + esp1 + ')';
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_DoWhile(element,niveau,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var condition='';
        if(element.cond && element.cond.length === 1){
            var obj=this.#php_traiteCondition1(element.cond[0],niveau,element);
            if(obj.__xst === true){
                condition+='(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2265 dans php_traite_Stmt_For ' ,"element" : element}));
            }
        }else if(element.cond && element.cond.length === 0){
            condition='';
        }else if(element.cond && element.cond.nodeType){
            var obj=this.#php_traiteCondition1(element.cond,niveau,element);
            if(obj.__xst === true){
                condition+='(' + obj.__xva + ')';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2265 dans php_traite_Stmt_For ' ,"element" : element}));
            }
        }else{
            debugger;
            return(this.#astphp_logerreur({
                "__xst" : false ,
                "__xme" : '1963 dans php_traite_Stmt_For il y a plusieurs instructions dans la condition mais seule la dernière est prise en compte' ,
                "element" : element
            }));
        }
        var instructions='';
        if(element.stmts && element.stmts.length > 0){
            var obj1=this.#traite_ast_nikic0(element.stmts,niveau,element,false,false,options_traitement);
            if(obj1.__xst === true){
                instructions+=obj1.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1527  dans php_traite_Stmt_For erreur dans les instructions' ,"element" : element}));
            }
        }
        t+='\n' + esp0 + 'faire_tant_que(';
        t+='\n' + esp0 + esp1 + 'faire(';
        t+='\n' + instructions;
        t+='\n' + esp0 + esp1 + ')';
        t+='\n' + esp0 + esp1 + 'condition' + condition + ',';
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_For(element,niveau,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var initialisation='';
        if(element.init && element.init.length > 0){
            var obj1=this.#traite_ast_nikic0(element.init,niveau,element,true,false,options_traitement);
            if(obj1.__xst === true){
                initialisation+=obj1.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1495  dans php_traite_Stmt_For erreur dans l\'initialisation' ,"element" : element}));
            }
        }
        var condition='';
        if(element.cond && element.cond.length === 1){
            var obj=this.#php_traiteCondition1(element.cond[0],niveau,element);
            if(obj.__xst === true){
                condition+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2265 dans php_traite_Stmt_For ' ,"element" : element}));
            }
        }else if(element.cond && element.cond.length === 0){
            condition='';
        }else{
            debugger;
            return(this.#astphp_logerreur({
                "__xst" : false ,
                "__xme" : '1963 dans php_traite_Stmt_For il y a plusieurs instructions dans la condition mais seule la dernière est prise en compte' ,
                "element" : element
            }));
        }
        var increment='';
        if(element.loop && element.loop.length > 0){
            var obj1=this.#traite_ast_nikic0(element.loop,niveau,element,true,false,options_traitement);
            if(obj1.__xst === true){
                increment+=obj1.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1519  dans php_traite_Stmt_For erreur dans l\'incrément' ,"element" : element}));
            }
        }
        var instructions='';
        if(element.stmts && element.stmts.length > 0){
            var obj1=this.#traite_ast_nikic0(element.stmts,niveau,element,false,false,options_traitement);
            if(obj1.__xst === true){
                instructions+=obj1.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1527  dans php_traite_Stmt_For erreur dans les instructions' ,"element" : element}));
            }
        }
        t+='\n' + esp0 + 'boucle(';
        t+='\n' + esp0 + esp1 + 'initialisation(' + initialisation + '),';
        t+='\n' + esp0 + esp1 + 'condition(' + condition + '),';
        t+='\n' + esp0 + esp1 + 'increment(' + increment + '),';
        t+='\n' + esp0 + esp1 + 'faire(';
        t+='\n' + instructions;
        t+='\n' + esp0 + esp1 + ')';
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_Stmt_Foreach(element,niveau,options_traitement){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var cleValeur='';
        if(element.keyVar){
            var obj=this.#php_traite_Stmt_Expression(element.keyVar,niveau,false,element,options_traitement);
            if(obj.__xst === true){
                cleValeur=obj.__xva + ' , ';
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        if(element.valueVar){
            var obj=this.#php_traite_Stmt_Expression(element.valueVar,niveau,false,element,options_traitement);
            if(obj.__xst === true){
                cleValeur+=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        var nomVariable='';
        if(element.expr){
            var obj=this.#php_traite_Stmt_Expression(element.expr,niveau,false,element,options_traitement);
            if(obj.__xst === true){
                nomVariable=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        var instructions='';
        if(element.stmts){
            niveau+=2;
            var obj=this.#traite_ast_nikic0(element.stmts,niveau,element,false,false,options_traitement);
            niveau-=2;
            if(obj.__xst === true){
                instructions=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : element}));
            }
        }
        t+='\n' + esp0 + 'boucleSurTableau(';
        t+='\n' + esp0 + esp1 + 'pourChaque(dans(' + cleValeur + ' , ' + nomVariable + ')),';
        t+='\n' + esp0 + esp1 + 'faire(';
        t+='\n' + instructions;
        t+='\n' + esp0 + esp1 + ')';
        t+='\n' + esp0 + ')';
        return({"__xst" : true ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #ajouteCommentairesAvant(element,niveau){
        var t='';
        if(element.attributes.comments){
            var esp0=' '.repeat(NBESPACESREV * niveau);
            var esp1=' '.repeat(NBESPACESREV);
            var j=0;
            for( j=0 ; j < element.attributes.comments.length ; j++ ){
                if("Comment" === element.attributes.comments[j].nodeType || "Comment_Doc" === element.attributes.comments[j].nodeType){
                    var txtComment=element.attributes.comments[j].text.substr(2);
                    if(element.attributes.comments[j].text.substr(0,2) === '/*'){
                        var val=txtComment.substr(0,txtComment.length - 2);
                        if(((txtComment.match(/\(/g) || []).length) === ((txtComment.match(/\)/g) || []).length)){
                            if(val.substr(0,1) === '*' || val.substr(0,1) === '#'){
                                t+='\n' + esp0 + '#(#' + val.substr(1) + ')';
                            }else{
                                t+='\n' + esp0 + '#(' + val + ')';
                            }
                        }else{
                            if(val.substr(0,1) === '*' || val.substr(0,1) === '#'){
                                t+='\n' + esp0 + '#(#' + val.substr(1).replace(/\(/g,'[').replace(/\)/g,']') + ')';
                            }else{
                                t+='\n' + esp0 + '#(' + val.replace(/\(/g,'[').replace(/\)/g,']') + ')';
                            }
                        }
                        element.attributes.comments[j].text='';
                    }else if(element.attributes.comments[j].text.substr(0,2) === '//'){
                        if(((txtComment.match(/\(/g) || []).length) === ((txtComment.match(/\)/g) || []).length)){
                            t+='\n' + esp0 + '#( ' + txtComment.trim().replace(/\/\*/,'/_*').replace(/\*\//,'*_/') + ')';
                        }else{
                            t+='\n' + esp0 + '#( ' + txtComment.trim().replace(/\(/g,'[').replace(/\)/g,']').replace(/\/\*/,'/_*').replace(/\*\//,'*_/') + ')';
                        }
                        element.attributes.comments[j].text='';
                    }
                }
            }
        }
        return t;
    }
    /*
      =============================================================================================================
    */
    #php_construit_cle(l){
        let resultat='';
        /* on retire I("I" de [i]ncrément ) O("o" de [o]bjet) l("l" de laitue)  0(zéro) 1(un) */
        const lettres='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        const longueur=lettres.length;
        let c=0;
        while(c < l){
            resultat+=lettres.charAt(Math.floor(Math.random() * longueur));
            c++;
        }
        return('_' + resultat);
    }
    /*
      =============================================================================================================
    */
    #traite_ast_nikic0(stmts,niveau,parent,dansFor,de_racine,options_traitement){
        let t='';
        let obj=null;
        let i=0;
        let esp0=' '.repeat(NBESPACESREV * niveau);
        let esp1=' '.repeat(NBESPACESREV);
        if(stmts.length > 0){
            for( i=0 ; i < stmts.length ; i++ ){
                t+=this.#ajouteCommentairesAvant(stmts[i],niveau);
                if(t !== '' && "Stmt_Nop" !== stmts[i].nodeType){
                    t+=',';
                }
                if(stmts[i].nodeType.substr(0,14) === "Expr_AssignOp_"){
                    obj=this.#php_traite_Expr_AssignOp_General(stmts[i],niveau,stmts[i].nodeType);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Expr_AssignOp_ 2261 ' ,"element" : stmts[i]}));
                    }
                }else if('Expr_BinaryOp_' === stmts[i].nodeType.substr(0,14)){
                    obj=this.#php_traite_Stmt_Expression(stmts[i],niveau,dansFor,stmts,options_traitement);
                    if(obj.__xst === true){
                        t+='\n' + esp0 + obj.__xva;
                    }else{
                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2013  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                    }
                }else{
                    switch (stmts[i].nodeType){
                        case "Stmt_Nop" : t+='';
                            break;
                        case "Stmt_InlineHTML" :
                            /*
                              =============================================================
                              Quand un php contient du html, ou bien ce dernier est un dom valide qui ne contient pas de php
                              par exemple ">? <div>que_du_html</div><?php"
                              ou bien il contient du php, 
                              par exemple ">? <div> <?php echo '';?> </div> <?php"
                              Dans ce dernier car la chaine " <div> " n'est pas un html "parfait"
                              =============================================================
                            */
                            /* debugger */
                            var estTraiteSansErreur=false;
                            obj=__gi1.isHTML(stmts[i].value);
                            if(obj.__xst === true){
                                /* var nettoye=stmts[i].value.replace(/\<\!\-\-(.*)\-\-\>/g,'').trim(); */
                                var nettoye=stmts[i].value.replace(/<!--[\s\S]*?-->/g,'').trim();
                            }
                            /* recherche d'au moins un tag dans le texte */
                            var regex=/(<[a-zA-Z0-9\-_]+)/g;
                            var found=stmts[i].value.match(regex);
                            if(obj.__xst === true
                                   && (stmts[i].value.indexOf('<') >= 0
                                           && found
                                           && found.length > 0
                                       || nettoye === ''
                                       || stmts[i].value.indexOf('<') < 0
                                           && stmts[i].value.indexOf('>') < 0)
                            ){
                                var cle=this.#php_construit_cle(10);
                                this.#tableau_de_html_dans_php_a_convertir.push({"cle" : cle ,"valeur" : stmts[i].value});
                                t+='\n' + esp0 + 'html_dans_php(#(cle_html_dans_php_a_remplacer,' + cle + '))';
                                estTraiteSansErreur=true;
                            }else{
                                /*
                                  On ne capture pas l'erreur car ce qui est traité ici n'est peut être pas un html "pur"
                                  dans ce cas tout est remplacé par des "echo" plus bas
                                */
                                estTraiteSansErreur=false;
                            }
                            if(estTraiteSansErreur === false){
                                if(options_traitement && options_traitement.hasOwnProperty('nettoyer_html') && options_traitement.nettoyer_html === true){
                                }else{
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() + 'ATTENTION, ce php contient du html en ligne qui n\'est pas strict' ,"element" : stmts[i]}));
                                }
                                var cle=this.#php_construit_cle(10);
                                t+='#( === transformation html incomplet en echo voir ci dessous pour la clé = "' + cle + '")';
                                this.#astphp_logerreur({
                                        "__xst" : true ,
                                        "__xav" : nl1() + "ATTENTION, ce php contient du html incomplet qui est converti en echo (" + cle + ") !" ,
                                        "element" : stmts[i]
                                    });
                                /*
                                  numeroLigneCourantStmtHtmlStartLine=stmts[i].attributes.startLine;
                                  numeroLigneCourantStmtHtmlEndLine=stmts[i].attributes.endLine;
                                */
                                if(stmts[i].value.toLowerCase().indexOf('<script') < 0){
                                    /*
                                      =============================================
                                      C'est un html incomplet qui ne contient pas de script, on le transforme en echo
                                      =============================================
                                    */
                                    t+='\n' + esp0 + 'appelf(nomf(echo),p(\'' + stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'))';
                                }else{
                                    /*
                                      =============================================
                                      cas ou le html contenu contient des scripts, 
                                      =============================================
                                      
                                    */
                                    var obj1=__module_html1.mapDOM(stmts[i].value);
                                    if(obj1.__xst === true && obj1.parfait === true && obj1.__xva.type.toLowerCase() === 'html'){
                                        /*
                                          si le contenu contient du HTML en racine, on peut essayer de le nettoyer 
                                        */
                                        if(obj1.content && obj1.content.length >= 0){
                                            var j=0;
                                            for( j=0 ; j < obj1.content.length ; j++ ){
                                                if(obj1.content[j].type === 'BODY' || obj1.content[j].type === 'HEAD'){
                                                    if(obj1.content[j].content && obj1.content[j].content.length > 0){
                                                        var k=0;
                                                        for( k=0 ; k < obj1.content[j].content.length ; k++ ){
                                                            if(obj1.content[j].content[k].type){
                                                                var lesProprietes='';
                                                                if(obj1.content[j].content[k].attributes){
                                                                    var attr={};
                                                                    for(attr in obj1.content[j].content[k].attributes){
                                                                        if(lesProprietes !== ''){
                                                                            lesProprietes+=',';
                                                                        }
                                                                        lesProprietes+='(\'' + attr.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\' , \'' + obj1.content[j].content[k].attributes[attr].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
                                                                    }
                                                                }
                                                                if(obj1.content[j].content[k].type.toLowerCase() === 'script'){
                                                                    if(obj1.content[j].content[k].content){
                                                                        objScr=__gi1.convertit_source_javascript_en_rev(obj1.content[j].content[k].content[0]);
                                                                        if(objScr.__xst === true){
                                                                            if(objScr.__xva === ''){
                                                                                t+='\n' + esp0 + 'html_dans_php(script(' + lesProprietes + '))';
                                                                            }else{
                                                                                t+='\n' + esp0 + 'html_dans_php(script(' + lesProprietes + ',source(' + objScr.__xva + ')))';
                                                                            }
                                                                        }else{
                                                                            console.log('un script KO : ' + obj1.content[j].content[k].content[0]);
                                                                            t+='appelf(nomf(echo),p(\'<script type="text/javascript">\'))';
                                                                            t+='appelf(nomf(echo),p(\'' + obj1.content[j].content[k].content[0].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'))';
                                                                        }
                                                                    }else{
                                                                        t+='\n' + esp0 + 'html_dans_php(script(' + lesProprietes + '))';
                                                                    }
                                                                }else{
                                                                    obj=__module_html1.traiteAstDeHtml(obj1.content[j].content[k],0,true,'',tableau_de_javascripts_dans_php_a_convertir);
                                                                    if(obj.__xst === true){
                                                                        t+='\n' + esp0 + 'html_dans_php(' + obj.__xva + ')';
                                                                    }else{
                                                                        return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2433 dans TransformAstPhpEnRev ' ,"element" : stmts[i]}));
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }else{
                                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2440 dans TransformAstPhpEnRev ' ,"element" : stmts[i]}));
                                                }
                                            }
                                        }
                                    }else{
                                        /*
                                          si le contenu ne contient pas du HTML en racine, on "echo" 
                                        */
                                        t+='appelf(nomf(echo),p(\'' + stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'))';
                                    }
                                }
                            }
                            break;
                            
                        case "Stmt_Echo" :
                            obj=this.#php_traite_echo(stmts[i],niveau);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev 2342 "' + stmts[i].nodeType + '" ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_If" :
                            obj=this.#php_traite_Stmt_If(stmts[i],niveau,false,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev 2024 "' + stmts[i].nodeType + '" ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Expression" :
                            obj=this.#php_traite_Stmt_Expression(stmts[i].expr,niveau,dansFor,stmts,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev 1922 "' + stmts[i].nodeType + '" ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Function" :
                            obj=this.#php_traite_Stmt_Function(stmts[i],niveau);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2376  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Use" :
                            obj=this.#php_traite_Stmt_Use(stmts[i],niveau);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2387  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '" ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_TryCatch" :
                            obj=this.#php_traite_Stmt_TryCatch(stmts[i],niveau,false,false,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2398  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Return" :
                            if(stmts[i].expr === null){
                                t+='\n' + esp0 + 'revenir()';
                            }else{
                                obj=this.#php_traite_Stmt_Expression(stmts[i].expr,niveau,dansFor,stmts);
                                if(obj.__xst === true){
                                    t+='\n' + esp0 + 'retourner(' + obj.__xva + ')';
                                }else{
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2411  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                                }
                            }
                            break;
                            
                        case "Stmt_Break" :
                            if(stmts[i].num === null){
                                t+='\n' + esp0 + 'break()';
                            }else if(stmts[i].num.nodeType === 'Scalar_Int'){
                                t+='\n' + esp0 + 'break(' + stmts[i].num.value + ')';
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2420  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Switch" :
                            obj=this.#php_traite_Stmt_Switch(stmts[i],niveau,false,false,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_Switch 2215 ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case 'Stmt_Unset' :
                            /* =============================================== */
                            obj=this.#php_traite_Expr_Unset(stmts[i],niveau);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_Unset 2226 ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Foreach" :
                            /* =============================================== */
                            obj=this.#php_traite_Stmt_Foreach(stmts[i],niveau,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_Foreach 2237 ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Do" :
                            /* =============================================== */
                            obj=this.#php_traite_Stmt_DoWhile(stmts[i],niveau,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_For 2248 ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_For" :
                            /* =============================================== */
                            obj=this.#php_traite_Stmt_For(stmts[i],niveau,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_For 2248 ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Expr_Assign" :
                            /* =============================================== */
                            obj=this.#php_traite_Expr_Assign(stmts[i],niveau,parent);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2541 dans TransformAstPhpEnRev pour Expr_Assign  ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Class" :
                            /* =============================================== */
                            obj=this.#php_traite_Stmt_Class(stmts[i],niveau,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_Class 2436 ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_ClassMethod" :
                            /* =============================================== */
                            obj=this.#php_traite_Stmt_ClassMethod(stmts[i],niveau,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '1051  dans php_traite_Stmt_Expression  ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Continue" : 
                        case "Stmt_Global" : 
                        case "Stmt_ClassConst" : 
                        case "Expr_Isset" : 
                        case "Expr_PostDec" : 
                        case "Expr_PostInc" : 
                        case "Expr_PreDec" : 
                        case "Expr_PreInc" : 
                        case "Stmt_Property" : 
                        case "Stmt_Static" :
                            /* =============================================== */
                            obj=this.#php_traite_Stmt_Expression(stmts[i],niveau,dansFor,stmts,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2013  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_While" :
                            /* =============================================== */
                            obj=this.#php_traite_Stmt_While(stmts[i],niveau,options_traitement);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2530  dans TransformAstPhpEnRev  ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_Declare" :
                            /* =============================================== */
                            obj=this.#php_traite_Expr_declare(stmts[i],niveau);
                            if(obj.__xst === true){
                                t+='\n' + esp0 + obj.__xva;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2539  dans TransformAstPhpEnRev  ' ,"element" : stmts[i]}));
                            }
                            break;
                            
                        case "Stmt_HaltCompiler" :
                            if(stmts[i].remaining && stmts[i].remaining !== ''){
                                t+='\n' + esp0 + '__halt_compiler(\'' + stmts[i].remaining.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
                            }else{
                                t+='\n' + esp0 + '__halt_compiler()';
                            }
                            break;
                            
                        case "Stmt_Namespace" :
                            var nom_de_l_espace='';
                            var faire='';
                            if("Name" === stmts[i].name.nodeType){
                                nom_de_l_espace=stmts[i].name.name;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2604 dans TransformAstPhpEnRev  ' ,"element" : stmts[i]}));
                            }
                            if(stmts[i].stmts && stmts[i].stmts.length > 0){
                                obj=this.#traite_ast_nikic0(stmts[i].stmts,niveau + 2,stmts[i],false,false,options_traitement);
                                if(obj.__xst === true){
                                    faire+=obj.__xva;
                                }else{
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2613  erreur php_traite_Stmt_TryCatch' ,"element" : stmts[i]}));
                                }
                            }
                            if(nom_de_l_espace.indexOf('\\') >= 0){
                                t+='\n' + esp0 + 'espace_de_noms(nom_espace(\'' + nom_de_l_espace.replace(/\\/g,'\\\\') + '\'),faire(' + faire + '))';
                            }else{
                                t+='\n' + esp0 + 'espace_de_noms(nom_espace(' + nom_de_l_espace + '),faire(' + faire + '))';
                            }
                            break;
                            
                        case "Stmt_Interface" :
                            var nom_de_l_interface='';
                            var faire='';
                            if("Identifier" === stmts[i].name.nodeType){
                                nom_de_l_interface=stmts[i].name.name;
                            }else{
                                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2626  dans TransformAstPhpEnRev  ' ,"element" : stmts[i]}));
                            }
                            if(stmts[i].stmts && stmts[i].stmts.length > 0){
                                obj=this.#traite_ast_nikic0(stmts[i].stmts,niveau + 2,stmts[i],false,false,options_traitement);
                                if(obj.__xst === true){
                                    faire+=obj.__xva;
                                }else{
                                    return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2633 erreur php_traite_Stmt_TryCatch' ,"element" : stmts[i]}));
                                }
                            }
                            t+='\n' + esp0 + 'interface(nom_interface(\'' + nom_de_l_interface + '\'),faire(' + faire + '))';
                            break;
                            
                        default:
                            return(this.#astphp_logerreur({"__xst" : false ,"__xme" : '2620  dans TransformAstPhpEnRev nodeType non prévu "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                            
                    }
                    /* =============================================== */
                }
            }
        }
        /* console.log('stmts'); */
        return({"__xst" : true ,"__xva" : t});
        /* fin de traitement de la boucle principale #traite_ast_nikic0 */
    }
    /*
      =============================================================================================================
    */
    #transforme_html_de_php_en_rev(texteHtml,niveau,globale_tableau_des_js2){
        var t='';
        var esp0=' '.repeat(NBESPACESREV * niveau);
        var esp1=' '.repeat(NBESPACESREV);
        var supprimer_le_tag_html_et_head=true;
        var doctype='';
        var elementsJson={};
        var i=0;
        try{
            var position_doctype=texteHtml.toUpperCase().indexOf('<!DOCTYPE');
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
            elementsJson=__module_html1.mapDOM(texteHtml,false);
            if(elementsJson.__xst === true){
                if(elementsJson.parfait === true){
                    supprimer_le_tag_html_et_head=false;
                }else{
                    /*
                    */
                    var supprimer_le_tag_html_et_head=true;
                    if(texteHtml.indexOf('<html') >= 0){
                        supprimer_le_tag_html_et_head=false;
                    }
                }
                try{
                    var tableau_de_javascripts_a_convertir=[];
                    var obj=__module_html1.traiteAstDeHtml(elementsJson.__xva,0,supprimer_le_tag_html_et_head,'',tableau_de_javascripts_a_convertir);
                    if(obj.__xst === true){
                        if(obj.__xva.trim().indexOf('html(') == 0){
                            if(doctype.toUpperCase() === '<!DOCTYPE HTML>'){
                                obj.__xva=obj.__xva.replace(/html\(/,'html((doctype)');
                            }else{
                                obj.__xva=obj.__xva.replace(/html\(/,'html(#((doctype)?? doctype pas html , normal="<!DOCTYPE html>" ?? )');
                            }
                        }
                        if(tableau_de_javascripts_a_convertir.length > 0){
                            for( var i=0 ; i < tableau_de_javascripts_a_convertir.length ; i++ ){
                                globale_tableau_des_js2.push(tableau_de_javascripts_a_convertir[i]);
                            }
                        }
                        return({"__xst" : true ,"__xva" : obj.__xva});
                    }else{
                        debugger;
                    }
                }catch(e){
                    debugger;
                }
            }else{
                debugger;
            }
        }catch(e){}
        return({"__xst" : false ,"__xms" : 'le html dans php n\'est pas convertible'});
    }
    /*
      =============================================================================================================
      point d'entrée
      =============================================================================================================
    */
    traite_ast_nikic(ast_de_php,options_traitement){
        let t='';
        let obj=null;
        if(options_traitement !== undefined){
            this.#options_traitement=options_traitement;
        }
        this.#tableau_de_html_dans_php_a_convertir=[];
        /*
          =====================================================================================================
          on boucle sur chaque élément
          =====================================================================================================
        */
        if(ast_de_php.length > 0){
            obj=this.#traite_ast_nikic0(ast_de_php,0,null,false,true,options_traitement);
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() ,"element" : ast_de_php}));
            }
        }
        /*
          =====================================================================================================
          on remplace les html en ligne par du rev
          =====================================================================================================
        */
        var globale_tableau_des_js2=[];
        for( var i=0 ; i < this.#tableau_de_html_dans_php_a_convertir.length ; i++ ){
            obj=this.#transforme_html_de_php_en_rev(this.#tableau_de_html_dans_php_a_convertir[i].valeur,0,globale_tableau_des_js2);
            if(obj.__xst === true){
                var chaine_a_remplacer='#(cle_html_dans_php_a_remplacer,' + this.#tableau_de_html_dans_php_a_convertir[i].cle + ')';
                t=t.replace(chaine_a_remplacer,obj.__xva);
            }else{
                return(logerreur({"__xst" : false ,"__xme" : '3052 erreur dans la convertion de html dans php'}));
            }
        }
        /*
          =====================================================================================================
          on remplace les javascript dans les html
          =====================================================================================================
        */
        if(globale_tableau_des_js2.length > 0){
            var parseur_javascript=window.acorn.Parser;
            for( var i=0 ; i < globale_tableau_des_js2.length ; i++ ){
                try{
                    var tableau_des_commentaires_js=[];
                    obj=parseur_javascript.parse(globale_tableau_des_js2[i].__xva.replace(/&amp;/g,'&'),{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tableau_des_commentaires_js});
                }catch(e){
                    console.log(globale_tableau_des_js2[i].__xva.replace(/&amp;/g,'&'));
                    globale_tableau_des_js2=[];
                    return(logerreur({"__xst" : false ,"__xme" : nl1()+'<br />il y a un problème dans un source javascript dans le php'}));
                }
                var phrase_a_remplacer='#(cle_javascript_a_remplacer,' + globale_tableau_des_js2[i].cle + ')';
                if(obj === '' || obj.hasOwnProperty('body') && Array.isArray(obj.body) && obj.body.length === 0){
                    t=t.replace(phrase_a_remplacer,'');
                }else{
                    if(tableau_des_commentaires_js.length > 0){
                        /*
                          il faut retirer les commentaires si ce sont des CDATA ou des <source_javascript_rev> 
                          car javascriptdanshtml les ajoute.
                        */
                        var commentaires_a_remplacer=['<![CDATA[',']]>','<source_javascript_rev>','</source_javascript_rev>'];
                        for( var nn=0 ; nn < commentaires_a_remplacer.length ; nn++ ){
                            for( var indc=tableau_des_commentaires_js.length - 1 ; indc >= 0 ; indc-- ){
                                if(tableau_des_commentaires_js[indc].value.trim() === commentaires_a_remplacer[nn]){
                                    tableau_des_commentaires_js.splice(indc,1);
                                }
                            }
                        }
                        for( var indc=tableau_des_commentaires_js.length - 1 ; indc >= 0 ; indc-- ){
                            if(tableau_des_commentaires_js[indc].value.trim() === '' && tableau_des_commentaires_js[indc].type === 'Line'){
                                tableau_des_commentaires_js.splice(indc,1);
                            }
                        }
                    }
                    /* on transforme le ast du js en rev */
                    var obj0=__m_astjs_vers_rev1.traite_ast(obj.body,tableau_des_commentaires_js,{});
                    if(obj0.__xst === true){
                        /* on retire source() */
                        t=t.replace(phrase_a_remplacer,obj0.__xva);
                    }else{
                        globale_tableau_des_js2=[];
                        return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
                    }
                }
            }
        }
        if(t.substr(0,2) === '\r\n'){
            t=t.substr(2);
        }else if(t.substr(0,1) === '\r'){
            t=t.substr(1);
        }else if(t.substr(0,1) === '\n'){
            t=t.substr(1);
        }
        return({"__xst" : true ,"__xva" : 'php(' + t + ')'});
    }
    /*
      =============================================================================================================
      cette méthode devrait théoriquement être dans un autre module
    */
    recupere_ast_de_php_du_serveur(source_php,opt,fonction_traitement_apres_recuperation_ast_de_php2_ok,fonction_traitement_apres_recuperation_ast_de_php2_ko){
        opt.masquer_les_messages_du_serveur=false;
        var ajax_param={"call" : {"lib" : 'php' ,"file" : 'ast' ,"funct" : 'recuperer_ast_de_php2' ,"opt" : opt} ,"source_php" : source_php};
        var r=new XMLHttpRequest();
        r.onerror=function(e){
            debugger;
            console.error('e=',e);
            return({"__xst" : false});
        };
        r.onabort=function(e){
            debugger;
            console.error('e=',e);
            return({"__xst" : false});
        };
        r.ontimeout=function(e){
            debugger;
            console.error('e=',e);
            return({"__xst" : false});
        };
        try{
            var numero_de_message=0;
            var page='za_ajax.php?recupererAstDePhp';
            r.open("POST",page,true);
            r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
            r.onreadystatechange=function(){
                /*
                  0 unsent	UNSENT (numeric value 0)	The object has been constructed.
                  1 opened	OPENED (numeric value 1)	The open() method has been successfully invoked. During this state request headers can be set using setRequestHeader() and the fetch can be initiated using the send() method.
                  2 headers received	HEADERS_RECEIVED (numeric value 2)	All redirects (if any) have been followed and all headers of a response have been received.
                  3 loading	LOADING (numeric value 3)	The response body is being received.
                  4 done	DONE (numeric value 4)	The data transfer has been completed or something went wrong during the transfer (e.g., infinite redirects).
                */
                if(r.readyState === 4 && r.status === 200){
                    /* tout est normal, on a tout reçu et on continue le traitement plus bas */
                }else{
                    if(r.status === 404){
                        if(0 === numero_de_message++){
                            this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() + '<br />404 page "' + page + '" non trouvée'});
                            __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
                        }
                        return;
                    }else if(r.status >= 500){
                        if(0 === numero_de_message++){
                            this.#astphp_logerreur({"__xst" : false ,"__xme" : nl1() + '<br />erreur du serveur, peut-être une limite de temps de traitement atteinte'});
                            __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
                        }
                        /*
                          ici return est en commentaire car si par exemple il y a une erreur dans un source,
                          alors elle sera traitée dans un boucle suivante car on capture les erreurs php
                        */
                        /* return */
                    }else{
                        if(r.readyState === 0 || r.readyState === 1 || r.readyState === 2 || r.readyState === 3){
                            /* on sort,  on reboucle pour traiter l'état suivant */
                            return;
                        }else{
                            /* afr */
                            debugger;
                        }
                    }
                }
                try{
                    var json_retour=JSON.parse(r.responseText);
                    if(json_retour.__xms){
                        for(var i in json_retour.__xms){
                            logerreur({__xst:false,__xme:json_retour.__xms[i]});
                        }
                    }
                    if(json_retour.__xif){
                        for(var i in json_retour.__xms){
                            logerreur({__xst:true,__xme:json_retour.__xif[i]});
                        }
                    }
                    if(json_retour.__xav){
                        for(var i in json_retour.__xms){
                            logerreur({__xst:false,__xav:json_retour.__xav[i]});
                        }
                    }
                    if(json_retour.__xst === true){
                        if(fonction_traitement_apres_recuperation_ast_de_php2_ok !== undefined){
                            fonction_traitement_apres_recuperation_ast_de_php2_ok(json_retour);
                        }else{
                            console.error('veuillez définir une fonction de traitement');
                        }
                    }else{
                        fonction_traitement_apres_recuperation_ast_de_php2_ko(r.responseText,json_retour);
                    }
                }catch(e){
                    fonction_traitement_apres_recuperation_ast_de_php2_ko(r.responseText);
                }
            };
            r.send('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param)));
        }catch(e){
            debugger;
            return({"__xst" : false ,"__xme" : nl1()});
        }
        return({"__xst" : true});
    }
}
export{c_astphpnikic_vers_rev1 as c_astphpnikic_vers_rev1};