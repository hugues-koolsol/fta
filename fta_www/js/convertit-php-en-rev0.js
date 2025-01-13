"use strict";

/*
  =====================================================================================================================
  conversion d'un AST produit par https://github.com/nikic/PHP-Parser en rev
  =====================================================================================================================
  todo
  $c=$a<=>$b; // echo "a" <=> "b"; // -1 , ,,,, echo "a" <=> "a"; // 0 ,,,,, echo "b" <=> "a"; // 1
  $output = `ls -al`; // Utiliser les guillemets obliques revient à utiliser la fonction shell_exec().
  =====================================================================================================================
  point d'entrée : TransformAstPhpEnRev  
  fonction principale php_traite_Stmt_Expression
  =====================================================================================================================
*/
var contient_du_javascript_dans_html=false;
var tableau_de_html_dans_php_a_convertir=[];
/*
  =====================================================================================================================
*/
function astphp_logerreur(o){
    logerreur(o);
    if(global_messages.ranges.length <= 3){
        if(o.element
         && o.element.hasOwnProperty('attributes')
         && o.element.attributes.hasOwnProperty('startTokenPos')
         && o.element.attributes.hasOwnProperty('endTokenPos')
        ){
            global_messages['ranges'].push([o.element.attributes.startFilePos,o.element.attributes.endFilePos]);
        }
    }
    if(o.hasOwnProperty('element')){
        console.log('%cerreur element=','background:yellow;color:hotpink;',o.element);
    }
    return o;
}
/*
  =====================================================================================================================
*/
function recupNomOperateur(s){
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
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0079  erreur recupNomOperateur "' + s + '" ' ,"element" : element}));
            
    }
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Eval(element,niveau){
    var t='';
    t+='appelf(';
    t+='nomf(eval)';
    var obj = php_traite_Stmt_Expression(element.expr,false,element);
    if(obj.__xst === true){
        t+=',p(' + obj.__xva + ')';
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0094  erreur php_traite_Expr_Eval' ,"element" : element}));
    }
    t+=')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Include(element,niveau){
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
    var obj = php_traite_Stmt_Expression(element.expr,false,element);
    if(obj.__xst === true){
        t+=',p(' + obj.__xva + ')';
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0118  erreur php_traite_Expr_Include' ,"element" : element}));
    }
    t+=')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Stmt_Switch(element,niveau,dansFor,de_racine,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var leTest='';
    var tabSw=[];
    if(element.cond){
        var obj = php_traite_Stmt_Expression(element.cond,niveau,false,element,options_traitement);
        if(obj.__xst === true){
            leTest=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0140  erreur php_traite_Stmt_Switch' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0145  erreur php_traite_Stmt_Switch' ,"element" : element}));
    }
    if(element.cases){
        if(element.cases.length > 0){
            var i=0;
            for( i=0 ; i < element.cases.length ; i++ ){
                var leSw=element.cases[i];
                var laCondition='';
                var lesInstructions='';
                var les_commentaires = ajouteCommentairesAvant(leSw,niveau + 3);
                if(leSw.cond){
                    var obj = php_traite_Stmt_Expression(leSw.cond,niveau,false,element);
                    if(obj.__xst === true){
                        laCondition=obj.__xva;
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '0160  erreur php_traite_Stmt_Switch' ,"element" : element}));
                    }
                }else{
                    laCondition=null;
                }
                if(leSw.stmts){
                    if(leSw.stmts.length > 0){
                        var obj1 = TransformAstPhpEnRev(leSw.stmts,niveau + 3,element,false,false,options_traitement);
                        if(obj1.__xst === true){
                            lesInstructions+=obj1.__xva;
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0175  erreur php_traite_Stmt_TryCatch' ,"element" : element}));
                        }
                    }
                }
                tabSw.push([laCondition,lesInstructions,les_commentaires]);
            }
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0182  erreur php_traite_Stmt_Switch' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0185  erreur php_traite_Stmt_Switch' ,"element" : element}));
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
  =====================================================================================================================
*/
function php_traite_Stmt_TryCatch(element,niveau,dansFor,de_racine,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var contenu='';
    if(element.stmts && element.stmts.length > 0){
        var obj = TransformAstPhpEnRev(element.stmts,niveau + 2,element,false,false,options_traitement);
        if(obj.__xst === true){
            contenu+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0220  erreur php_traite_Stmt_TryCatch' ,"element" : element}));
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
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '0212  php_traite_Stmt_TryCatch' ,"element" : element}));
                    }
                }
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0242  erreur php_traite_Stmt_TryCatch' ,"element" : element}));
            }
            var leNomErreur='';
            if(element.catches[numc].var && element.catches[numc].var.nodeType === "Expr_Variable"){
                leNomErreur='$' + element.catches[numc].var.name;
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0249  erreur php_traite_Stmt_TryCatch' ,"element" : element}));
            }
            if(element.catches[numc].stmts && element.catches[numc].stmts.length > 0){
                niveau+=3;
                var obj = TransformAstPhpEnRev(element.catches[numc].stmts,niveau,element,false,false,options_traitement);
                niveau-=3;
                if(obj.__xst === true){
                    contenu+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '0259  erreur php_traite_Stmt_TryCatch' ,"element" : element}));
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
  =====================================================================================================================
*/
function php_traite_Stmt_Use(element,niveau){
    var t='';
    var i=0;
    for( i=0 ; i < element.uses.length ; i++ ){
        if("UseItem" === element.uses[i].nodeType){
            if(element.uses[i].name.nodeType === "Name"){
                t+='appelf(nomf(use),p(\'' + element.uses[i].name.name.replace(/\\/g,'\\\\') + '\'))';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0259  erreur php_traite_Stmt_Use' ,"element" : element}));
            }
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0294  erreur php_traite_Stmt_Use' ,"element" : element}));
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Isset(element,niveau){
    var t='';
    var nomFonction='isset';
    var lesArguments='';
    if(element.vars && element.vars.length > 0){
        var i=0;
        for( i=0 ; i < element.vars.length ; i++ ){
            var obj = php_traite_Stmt_Expression(element.vars[i],niveau,false,element);
            if(obj.__xst === true){
                lesArguments+=',p(' + obj.__xva + ')';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0314  erreur php_traite_Expr_Isset' ,"element" : element}));
            }
        }
    }
    t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Unset(element,niveau){
    var t='';
    var nomFonction='unset';
    var lesArguments='';
    if(element.vars && element.vars.length > 0){
        var i=0;
        for( i=0 ; i < element.vars.length ; i++ ){
            var obj = php_traite_Stmt_Expression(element.vars[i],niveau,false,element);
            if(obj.__xst === true){
                lesArguments+=',p(' + obj.__xva + ')';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0388  erreur php_traite_Expr_Isset' ,"element" : element}));
            }
        }
    }
    t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_FuncCall(element,niveau){
    var t='';
    var nomFonction='';
    var prefixStatic='';
    if(element.nodeType === "Expr_StaticCall"){
        if(element.class.nodeType === 'Name'){
            prefixStatic=element.class.name + '::';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0359  erreur php_traite_Expr_FuncCall pour Expr_StaticCall ' ,"element" : element}));
        }
    }
    if(element.name){
        if(element.name.nodeType === 'Name'){
            nomFonction=prefixStatic + element.name.name;
        }else if(element.name.nodeType === "Expr_ArrayDimFetch"){
            var obj = php_traite_Expr_ArrayDimFetch(element.name,niveau,0);
            if(obj.__xst === true){
                nomFonction=prefixStatic + obj.__xva;
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0359  erreur php_traite_Expr_FuncCall' ,"element" : element}));
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
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0364  erreur php_traite_Expr_FuncCall "' + element.name.nodeType + '"' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0367  erreur php_traite_Expr_FuncCall' ,"element" : element}));
    }
    var lesArgumentsCourts='';
    var lesArguments='';
    var tabArgs=[];
    if(element.args && element.args.length > 0){
        var i=0;
        for( i=0 ; i < element.args.length ; i++ ){
            var obj = php_traite_Stmt_Expression(element.args[i],niveau,false,element);
            if(obj.__xst === true){
                lesArguments+=',p(' + obj.__xva + ')';
                tabArgs.push([obj.__xva,element.args[i].value.nodeType]);
                lesArgumentsCourts+=',' + obj.__xva;
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0349  erreur php_traite_Expr_FuncCall ' ,"element" : element}));
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
        var source = lesArgumentsCourts.substr(1,lesArgumentsCourts.length - 2);
        var source = source.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
        var obj = convertion_texte_sql_en_rev(source);
        if(obj.__xst === true){
            t+='sql(' + obj.__xva + ')';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0369  erreur sql_dans_php ' ,"element" : element}));
        }
    }else if('htmlDansPhp' === nomFonction){
        if(lesArgumentsCourts.substr(0,1) === ','){
            lesArgumentsCourts=lesArgumentsCourts.substr(1);
        }
        var source = lesArgumentsCourts.substr(1,lesArgumentsCourts.length - 2);
        var source = source.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
        var obj = __module_html1.TransformHtmlEnRev(source,0);
        if(obj.__xst === true){
            t+='html_dans_php(' + obj.__xva + ')';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0381  erreur htmlDansPhp ' ,"element" : element}));
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
  =====================================================================================================================
*/
function php_traite_printOuEcho(element,niveau,nomFonction){
    var t='';
    var lesArguments='';
    if(element.exprs){
        var i=0;
        for( i=0 ; i < element.exprs.length ; i++ ){
            var obj = php_traite_Stmt_Expression(element.exprs[i],niveau,false,element);
            if(obj.__xst === true){
                lesArguments+=',p(' + obj.__xva + ')';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0412  erreur php_traite_printOuEcho ' ,"element" : element}));
            }
        }
    }
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.__xst === true){
            lesArguments+=',p(' + obj.__xva + ')';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0421  erreur php_traite_printOuEcho ' ,"element" : element}));
        }
    }
    t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
    /* un point virgule est-il en trop ? */
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_print(element,niveau){
    return(php_traite_printOuEcho(element,niveau,'print'));
}
/*
  =====================================================================================================================
*/
function php_traite_echo(element,niveau){
    return(php_traite_printOuEcho(element,niveau,'echo'));
}
/*
  =====================================================================================================================
*/
function php_traite_Stmt_ClassMethod(element,niveau,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var lesArguments='';
    var contenu='';
    var type_retour='';
    t+='\n' + esp0 + 'méthode(';
    t+='\n' + esp0 + esp1 + 'definition(';
    if(element.name && "Identifier" === element.name.nodeType){
        t+='\n' + esp0 + esp1 + esp1 + 'nomm(' + element.name.name + ')';
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0464  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
    }
    if(element.params && element.params.length > 0){
        var i=0;
        for( i=0 ; i < element.params.length ; i++ ){
            if(element.params[i].var && "Expr_Variable" === element.params[i].var.nodeType){
                if(element.params[i].byRef && element.params[i].byRef === true){
                    lesArguments+='\n' + esp0 + esp1 + esp1 + 'adresseArgument(';
                }else{
                    lesArguments+='\n' + esp0 + esp1 + esp1 + 'argument(';
                }
                if(element.params[i].variadic && element.params[i].variadic === true){
                    lesArguments+='...$' + element.params[i].var.name;
                }else{
                    lesArguments+='$' + element.params[i].var.name;
                }
                if(element.params[i].default){
                    var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                    if(obj.__xst === true){
                        lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '0487  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
                    }
                }
                if(element.params[i].type){
                    var obj = php_traite_Stmt_Expression(element.params[i].type,niveau,false,element);
                    if(obj.__xst === true){
                        if(obj.__xva.indexOf('\\') >= 0){
                            lesArguments+=',type_argument(\'' + obj.__xva.replace(/\\/g,'\\\\') + '\')';
                        }else{
                            lesArguments+=',type_argument(' + obj.__xva + ')';
                        }
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '0483  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
                    }
                }
                lesArguments+=')';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0488  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
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
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0494  erreur php_traite_Stmt_ClassMethod return_type "' + element.returnType.nodeType + '"' ,"element" : element}));
            }
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0497  erreur php_traite_Stmt_ClassMethod return_type "' + element.returnType.nodeType + '"' ,"element" : element}));
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
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0507  erreur php_traite_Stmt_ClassMethod element.flags=' + element.flags ,"element" : element}));
    }
    if(type_retour !== ''){
        t+='\n' + esp0 + esp1 + 'type_retour(\'' + type_retour.replace(/\\/g,'\\\\') + '\')';
    }
    t+='\n' + esp0 + esp1 + '),';
    if(element.stmts && element.stmts.length > 0){
        var obj = TransformAstPhpEnRev(element.stmts,niveau + 2,element,false,false,options_traitement);
        if(obj.__xst === true){
            contenu+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0514  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
        }
    }
    if(contenu !== ''){
        t+='\n' + esp0 + esp1 + 'contenu(' + contenu + ')';
    }
    t+='\n' + esp0 + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Stmt_Function(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomFonction='';
    var lesArguments='';
    var contenu='';
    var type_retour='';
    if(element.name && element.name.nodeType === "Identifier"){
        nomFonction=element.name.name;
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0542  erreur php_traite_Stmt_Function ' ,"element" : element}));
    }
    if(element.params && element.params.length > 0){
        var i=0;
        for( i=0 ; i < element.params.length ; i++ ){
            if(element.params[i].var && "Expr_Variable" === element.params[i].var.nodeType){
                if(element.params[i].byRef && element.params[i].byRef === true){
                    lesArguments+=',\n' + esp0 + esp1 + esp1 + 'adresseArgument($' + element.params[i].var.name;
                    if(element.params[i].default){
                        var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.__xst === true){
                            lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0555  erreur php_traite_Stmt_Function ' ,"element" : element}));
                        }
                    }
                    if(element.params[i].type){
                        var obj = php_traite_Stmt_Expression(element.params[i].type,niveau,false,element);
                        if(obj.__xst === true){
                            if(obj.__xva.indexOf('\\') >= 0){
                                lesArguments+=',type_argument(\'' + obj.__xva.replace(/\\/g,'\\\\') + '\')';
                            }else{
                                lesArguments+=',type_argument(' + obj.__xva + ')';
                            }
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0483  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
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
                        var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.__xst === true){
                            lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0570  erreur php_traite_Stmt_Function ' ,"element" : element}));
                        }
                    }
                    if(element.params[i].type){
                        var obj = php_traite_Stmt_Expression(element.params[i].type,niveau,false,element);
                        if(obj.__xst === true){
                            if(obj.__xva.indexOf('\\') >= 0){
                                lesArguments+=',type_argument(\'' + obj.__xva.replace(/\\/g,'\\\\') + '\')';
                            }else{
                                lesArguments+=',type_argument(' + obj.__xva + ')';
                            }
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0483  erreur php_traite_Stmt_ClassMethod ' ,"element" : element}));
                        }
                    }
                    lesArguments+=')';
                }
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0576  erreur php_traite_Stmt_Function ' ,"element" : element}));
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
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0494  erreur php_traite_Stmt_ClassMethod return_type "' + element.returnType.nodeType + '"' ,"element" : element}));
            }
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0497  erreur php_traite_Stmt_ClassMethod return_type "' + element.returnType.nodeType + '"' ,"element" : element}));
        }
    }
    if(element.stmts && element.stmts.length > 0){
        var obj = TransformAstPhpEnRev(element.stmts,niveau + 2,element,false);
        if(obj.__xst === true){
            contenu+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0587  erreur php_traite_Stmt_Function ' ,"element" : element}));
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
  =====================================================================================================================
*/
function php_traite_Stmt_Static(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    if(element.vars && element.vars.length > 0){
        for( var i=0 ; i < element.vars.length ; i++ ){
            var obj = php_traite_Stmt_Expression(element.vars[i],niveau,false,element);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0555  erreur php_traite_Stmt_Function ' ,"element" : element}));
            }
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0564  erreur php_traite_Stmt_Static ' ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Clone(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    if(element.expr && element.expr.nodeType === "Expr_Variable"){
        t+='appelf(nomf(clone),p($' + element.expr.name + '))';
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0560  erreur php_traite_Stmt_Function ' ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Closure(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
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
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '0614  erreur php_traite_Expr_Closure "' + element.params[i].type.nodeType + '" ' ,"element" : element}));
                }
            }
            if(element.params[i].attrGroups && element.params[i].attrGroups.length > 0){
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0620  erreur php_traite_Expr_Closure ' ,"element" : element}));
            }
            if(element.params[i].hooks && element.params[i].hooks.length > 0){
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0624  erreur php_traite_Expr_Closure ' ,"element" : element}));
            }
            if(element.params[i].flags !== 0){
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0628  erreur php_traite_Expr_Closure ' ,"element" : element}));
            }
            if(element.params[i].var && "Expr_Variable" === element.params[i].var.nodeType){
                if(element.params[i].byRef && element.params[i].byRef === true){
                    lesArguments+=',\n' + esp0 + esp1 + esp1 + 'adresseArgument($' + element.params[i].var.name;
                    if(element.params[i].default){
                        var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.__xst === true){
                            lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0555  erreur php_traite_Expr_Closure ' ,"element" : element}));
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
                        var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.__xst === true){
                            lesArguments+=',valeur_defaut(' + obj.__xva + ')';
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0570  erreur php_traite_Expr_Closure ' ,"element" : element}));
                        }
                    }
                    lesArguments+=type_argument + ')';
                }
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0576  erreur php_traite_Expr_Closure ' ,"element" : element}));
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
                        var obj = php_traite_Stmt_Expression(element.uses[i].default,niveau,false,element);
                        if(obj.__xst === true){
                            les_utilisations+=',valeur_defaut(' + obj.__xva + ')';
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0555  erreur php_traite_Expr_Closure ' ,"element" : element}));
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
                        var obj = php_traite_Stmt_Expression(element.uses[i].default,niveau,false,element);
                        if(obj.__xst === true){
                            les_utilisations+=',valeur_defaut(' + obj.__xva + ')';
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0570  erreur php_traite_Expr_Closure ' ,"element" : element}));
                        }
                    }
                    les_utilisations+=')';
                }
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0576  erreur php_traite_Expr_Closure ' ,"element" : element}));
            }
        }
    }
    if(element.stmts && element.stmts.length > 0){
        var obj = TransformAstPhpEnRev(element.stmts,niveau + 2,element,false);
        if(obj.__xst === true){
            contenu+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0587  erreur php_traite_Expr_Closure ' ,"element" : element}));
        }
    }
    if(element.static !== false){
        statique='statique()';
    }
    if(element.returnType){
        var obj = php_traite_Stmt_Expression(element.returnType,niveau,false,element);
        if(obj.__xst === true){
            type_retour+=',type_retour(' + obj.__xva + ')';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0570  erreur php_traite_Expr_Closure ' ,"element" : element}));
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
  =====================================================================================================================
  traite un "new"
*/
function php_traite_Expr_New(element,niveau){
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
            var obj = php_traite_Stmt_Expression(element.class,niveau,false,element);
            if(obj.__xst === true){
                nomClasse=obj.__xva;
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0847  erreur php_traite_Expr_Assign ' ,"element" : element}));
            }
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0589  erreur php_traite_Expr_New ' ,"element" : element}));
        }
        var lesArgumentsDeLaClass='';
        if(element.args){
            var i=0;
            for( i=0 ; i < element.args.length ; i++ ){
                var obj = php_traite_Stmt_Expression(element.args[i],niveau,false,element);
                if(obj.__xst === true){
                    lesArgumentsDeLaClass+=',p(' + obj.__xva + ')';
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '0599  erreur php_traite_Expr_New ' ,"element" : element}));
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
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0610  erreur php_traite_Expr_New ' ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_MethodCall(element,niveau){
    var t='';
    var nomFonction='';
    var lelement='';
    var lesArguments='';
    if(element.var){
        var obj = php_traite_Stmt_Expression(element.var,niveau,false,element);
        if(obj.__xst === true){
            lelement+='element(' + obj.__xva + ')';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0583  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0653  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
    }
    if(element.name){
        if(element.name.nodeType === "Identifier"){
            nomFonction=element.name.name;
        }else{
            var obj = php_traite_Stmt_Expression(element.name,niveau,false,element);
            if(obj.__xst === true){
                nomFonction+=obj.__xva;
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0806  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
            }
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0663  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
    }
    var lesArguments='';
    if(element.args && element.args.length > 0){
        var i=0;
        for( i=0 ; i < element.args.length ; i++ ){
            var obj = php_traite_Stmt_Expression(element.args[i],niveau,false,element);
            if(obj.__xst === true){
                lesArguments+=',p(' + obj.__xva + ')';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0673  erreur php_traite_Expr_MethodCall ' ,"element" : element}));
            }
        }
    }
    t+='appelf(' + lelement + 'nomf(' + nomFonction + ')' + lesArguments + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_AssignOp_General(element,niveau,nodeType){
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
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0706  php_traite_Expr_AssignOp_General "' + nodeType + '"' ,"element" : element}));
    }
    var t='';
    var gauche='';
    if(element.var){
        var obj = php_traite_Stmt_Expression(element.var,niveau,false,element);
        if(obj.__xst === true){
            gauche+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0716  php_traite_Expr_AssignOp_General ' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0720  php_traite_Expr_AssignOp_General ' ,"element" : element}));
    }
    var droite='';
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.__xst === true){
            droite+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0729  php_traite_Expr_AssignOp_General ' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0732  php_traite_Expr_AssignOp_General ' ,"element" : element}));
    }
    t+='affecteop(' + '\'' + operation + '\' , ' + gauche + ' , ' + droite + ' )';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_AssignRef(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var gauche='';
    var droite='';
    if(element.var){
        var obj = php_traite_Stmt_Expression(element.var,niveau,false,element);
        if(obj.__xst === true){
            gauche=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0763  erreur php_traite_Expr_AssignRef ' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0766  erreur php_traite_Expr_AssignRef ' ,"element" : element}));
    }
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.__xst === true){
            droite=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0733  erreur php_traite_Expr_AssignRef ' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0776  erreur php_traite_Expr_AssignRef ' ,"element" : element}));
    }
    t+='affecte_reference(' + gauche + ' , ' + droite + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_declare(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
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
        var obj = TransformAstPhpEnRev(element.stmts,niveau + 2,element,false);
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
  =====================================================================================================================
*/
function php_traite_Expr_Assign(element,niveau,parent){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
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
            var obj = php_traite_Stmt_Expression(element.var,niveau,false,element);
            if(obj.__xst === true){
                gauche=obj.__xva;
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0847  erreur php_traite_Expr_Assign ' ,"element" : element}));
            }
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0850  erreur php_traite_Expr_Assign ' ,"element" : element}));
    }
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
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
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0733  erreur dans une assignation ' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '0860  erreur php_traite_Expr_Assign ' ,"element" : element}));
    }
    t+='affecte(' + gauche + ' , ' + droite + ')';
    if(parent && parent.nodeType && parent.nodeType.substr(0,14) === 'Expr_BinaryOp_'){
        t='(' + t + ')';
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_ArrayDimFetch(element,niveau,num){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomTableau='';
    var nom_variable='';
    var parametres='';
    if(element.var){
        if("Expr_Variable" === element.var.nodeType){
            nom_variable='nomt($' + element.var.name + ')';
        }else if("Expr_ArrayDimFetch" === element.var.nodeType){
            var obj = php_traite_Expr_ArrayDimFetch(element.var,niveau,num + 1);
            if(obj.__xst === true){
                nom_variable+=obj.__xva;
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0884 php_traite_Expr_ArrayDimFetch ' ,"element" : element}));
            }
        }else{
            var obj = php_traite_Stmt_Expression(element.var,niveau,true,element);
            if(obj.__xst === true){
                nom_variable+='nomt(' + obj.__xva + ')';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '0870 php_traite_Expr_ArrayDimFetch ' ,"element" : element}));
            }
        }
    }
    if(element.dim){
        var obj = php_traite_Stmt_Expression(element.dim,niveau,false,element);
        if(obj.__xst === true){
            parametres+=',p(' + obj.__xva + ')';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '0881 php_traite_Expr_ArrayDimFetch ' ,"element" : element}));
        }
    }else{
        parametres+=',p()';
    }
    if(num === 0){
        if("Expr_Variable" === element.var.nodeType
         || "Expr_ArrayDimFetch" === element.var.nodeType
         || 'Expr_PropertyFetch' === element.var.nodeType
        ){
            t=simplifie_tableau(nom_variable,parametres,num);
        }else{
            t='tableau(' + nom_variable + parametres + ')';
        }
    }else{
        if("Expr_Variable" === element.var.nodeType
         || "Expr_ArrayDimFetch" === element.var.nodeType
         || 'Expr_PropertyFetch' === element.var.nodeType
        ){
            t=simplifie_tableau(nom_variable,parametres,num);
        }else{
            t=nom_variable + parametres;
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function simplifie_tableau(nom_variable,parametres,num){
    var t='';
    var obj_nom_tableau = functionToArray(nom_variable,true,true,'');
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
            var obj_indice_tableau = functionToArray(parametres,true,true,'');
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
            var obj_indice_tableau = functionToArray(parametres,true,true,'');
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
  =====================================================================================================================
*/
function php_traite_Expr_List(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var lesElements='';
    if(element.items){
        var i=0;
        for( i=0 ; i < element.items.length ; i++ ){
            if(null === element.items[i]){
                lesElements+='p()';
            }else if("ArrayItem" === element.items[i].nodeType){
                var cle='';
                if(element.items[i].value){
                    var objValeur = php_traite_Stmt_Expression(element.items[i].value,niveau,false,element);
                    if(objValeur.__xst === true){
                        if(lesElements !== ''){
                            lesElements+=' , ';
                        }
                        lesElements+='p(' + objValeur.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1001  erreur php_traite_Expr_List ' ,"element" : element}));
                    }
                }
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '1005  erreur php_traite_Expr_List ' ,"element" : element}));
            }
        }
    }
    t+='liste(' + lesElements + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Array(element,niveau){
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
                    var objcle = php_traite_Stmt_Expression(element.items[i].key,niveau,false,element);
                    if(objcle.__xst === true){
                        cle=objcle.__xva;
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1005  erreur php_traite_Expr_Array ' ,"element" : element}));
                    }
                }
                if(element.items[i].value){
                    var objValeur = php_traite_Stmt_Expression(element.items[i].value,niveau,false,element);
                    if(objValeur.__xst === true){
                        if(lesElements !== ''){
                            lesElements+=' , ';
                        }
                        if(element.items[i].attributes.hasOwnProperty('comments') && element.items[i].attributes.comments.length > 0){
                            lesElements+=ajouteCommentairesAvant(element.items[i],niveau);
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
                        return(astphp_logerreur({"__xst" : false ,"__xme" : 'ERREUR dans php_traite_Expr_Array 869' ,"element" : element}));
                    }
                }
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '1059  erreur php_traite_Expr_Array ' ,"element" : element}));
            }
        }
    }
    t+='defTab(' + format_court + lesElements + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_chaine_raw(valeur_raw,element){
    var t='';
    var rv=valeur_raw;
    var contenu = rv.substr(1,rv.length - 2);
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
      //        return(astphp_logerreur({"__xst" : false ,"__xme" : '1311 php_traite_chaine_raw TO DO ' ,"element" : element}));
      
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
      return(astphp_logerreur({"__xst" : false ,"__xme" : '1433 php_traite_chaine_raw TO DO ' ,"element" : element}));
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
      return(astphp_logerreur({"__xst" : false ,"__xme" : '1447 php_traite_chaine_raw' ,"element" : element}));
      }
      }
      }
      }
      t='concat('+tableau_a_concatener.join(',')+')';
      return({__xst:true , __xva : t});
      }else{
      return(astphp_logerreur({"__xst" : false ,"__xme" : '1311 php_traite_chaine_raw TO DO ' ,"element" : element}));
      }
      }
      }
    */
    var probablement_dans_une_regex = valeur_raw.substr(1,1) === '/' ? ( true ) : ( false );
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
        var l01 = rv.length - 2;
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
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '0925  une chaine ne doit pas contenir un simple \\ en dernière position  ' ,"element" : element}));
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
                                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1494 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + rv.substr(i + 1,1) + '" ' ,"element" : element}));
                                    }
                                }else{
                                    /*
                                      commenté car $regex='/\'|\\\\(?=[\'\\\\]|$)|(?<=\\\\)\\\/'; ne passait plus 
                                      return(astphp_logerreur({"__xst" : false ,"__xme" : '0958 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + (rv.substr(i + 1,1)) + '" ' ,"element" : element}));
                                    */
                                    if(i > 0 && rv.substr(i - 1,1) !== '\\'){
                                        nouvelle_chaine='\\\\' + nouvelle_chaine;
                                    }else{
                                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1494 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + rv.substr(i + 1,1) + '" ' ,"element" : element}));
                                    }
                                }
                            }
                        }
                    }else{
                        /*
                          si on est au premier caractère;
                        */
                        if(rv.substr(i,1) === '\\'){
                            var c = nouvelle_chaine.substr(0,1);
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
                            }else if(c === 'r' || c === 'n' || c === 't' || c === '\'' && rv.substr(0,1) === '\'' || c === '"' && rv.substr(0,1) === '"'){
                                nouvelle_chaine='\\' + nouvelle_chaine;
                            }else{
                                return(astphp_logerreur({"__xst" : false ,"__xme" : '0930 après un backslash il ne peut y avoir que les caractères réduits et pas "' + c + '" ' ,"element" : element}));
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
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '0983 il doit y avoir un backslash avant un apostrophe ' ,"element" : element}));
                }
            }else if(rv.substr(i,1) === '"' && rv.substr(0,1) === '"'){
                if(i >= 2 && rv.substr(i - 1,1) === '\\'){
                    nouvelle_chaine='\\"' + nouvelle_chaine;
                    i--;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '0994 il doit y avoir un backslash avant un guillemet ' ,"element" : element}));
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
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  
  
  var comptage={};
*/
function php_traite_Stmt_Expression(element,niveau,dansFor,parent,options_traitement){
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
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    if('Expr_BinaryOp_' === element.nodeType.substr(0,14)){
        var obj = php_traite_Expr_BinaryOp_General(element,niveau,parent,options_traitement);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1349  dans php_traite_Stmt_Expression  ' ,"element" : element}));
        }
        /* =============================================== */
    }else if('Expr_Boolean' === element.nodeType.substr(0,12)){
        var obj = php_traite_Expr_BooleanOp_General(element,niveau,options_traitement);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1362  dans php_traite_Stmt_Expression  ' ,"element" : element}));
        }
        /* =============================================== */
    }else if("Expr_AssignOp_" === element.nodeType.substr(0,14)){
        var obj = php_traite_Expr_AssignOp_General(element,niveau,element.nodeType);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1460  dans php_traite_Stmt_Expression  ' ,"element" : element}));
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
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1132 php_traite_Stmt_Expression NullableType ' ,"element" : element}));
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
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1130 php_traite_Stmt_Expression Stmt_ClassConst class="' + element.flags + '" ' ,"element" : element}));
                    }
                }
                if(element.consts && element.consts.length > 0){
                    for( var i=0 ; i < element.consts.length ; i++ ){
                        var nom_constante='';
                        var valeur_constante='';
                        if(element.consts[i].name.nodeType === 'Identifier'){
                            nom_constante=element.consts[i].name.name;
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '1138 php_traite_Stmt_Expression Stmt_ClassConst ' ,"element" : element}));
                        }
                        var obj = php_traite_Stmt_Expression(element.consts[i].value,niveau,false,element,options_traitement);
                        if(obj.__xst === true){
                            valeur_constante=obj.__xva;
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '1147 php_traite_Stmt_Expression Stmt_ClassConst ' ,"element" : element}));
                        }
                        constantes+=',constante(' + privee + publique + protegee + ',nomc(' + nom_constante + '),valeur(' + valeur_constante + '))';
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1136 php_traite_Stmt_Expression Stmt_ClassConst ' ,"element" : element}));
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
                                return(astphp_logerreur({"__xst" : false ,"__xme" : '1003 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
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
                                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1198 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                                    }
                                }else{
                                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1192 php_traite_Stmt_Expression Stmt_Property "' + element.type.nodeType + '" ' ,"element" : element}));
                                }
                            }
                            /* le nom de la variable */
                            t+='$' + element.props[i].name.name;
                            /*  */
                            if(element.props[i].default){
                                var obj = php_traite_Stmt_Expression(element.props[i].default,niveau,true,element,options_traitement);
                                if(obj.__xst === true){
                                    t+=',valeur_defaut(' + obj.__xva + ')';
                                }else{
                                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1033 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                                }
                            }
                            t+=')';
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '0934 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                        }
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '0931 php_traite_Stmt_Expression Stmt_Property ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Scalar_String" :
                if(element.attributes.kind && element.attributes.kind === 3){
                    t+='heredoc(\'' + element.attributes.docLabel + '\',`\n' + element.attributes.rawValue.replace(/`/g,'\\`') + '`)';
                }else if(element.attributes.kind && element.attributes.kind === 4){
                    t+='nowdoc(\'' + element.attributes.docLabel + '\',`\n' + element.attributes.rawValue.replace(/`/g,'\\`') + '`)';
                }else if(element.attributes.rawValue.substr(0,1) === '\'' || element.attributes.rawValue.substr(0,1) === '"'){
                    var obj = php_traite_chaine_raw(element.attributes.rawValue,element);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1702 php_traite_Stmt_Expression Scalar_String ' ,"element" : element}));
                    }
                }else{
                    t+=element.attributes.rawValue;
                }
                /* =============================================== */
                break;
                
            case "Stmt_ClassMethod" :
                var obj = php_traite_Stmt_ClassMethod(element,niveau,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1051  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Stmt_Continue" :
                if(element.num === null){
                    t+='\n' + esp0 + 'continue()';
                }else{
                    var obj = php_traite_Stmt_Expression(element.num,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='\n' + esp0 + 'continue(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '0999  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }
                /* =============================================== */
                break;
                
            case "Expr_UnaryMinus" :
                var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
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
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '0902  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                break;
                
            case "Stmt_Global" :
                var variables='';
                var i={};
                for(i in element.vars){
                    if(element.vars[i].nodeType === "Expr_Variable"){
                        variables+=',$' + element.vars[i].name;
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1325  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }
                if(variables !== ''){
                    variables=variables.substr(1);
                    t+='globale(' + variables + ')';
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1065  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                break;
                
            case "Expr_UnaryPlus" :
                var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                if(obj.__xst === true){
                    if(obj.__xva.substr(0,17) === 'valeur_constante(' || 'propriete' === obj.__xva.substr(0,9)){
                        t+='plus(' + obj.__xva + ')';
                    }else{
                        t+='+' + obj.__xva;
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '0902  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_ArrayDimFetch" :
                var obj = php_traite_Expr_ArrayDimFetch(element,niveau,0);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1242  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_MethodCall" :
                var obj = php_traite_Expr_MethodCall(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1252  dans php_traite_Stmt_Expression  ' ,"element" : element}));
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
                var obj = php_traite_Stmt_Expression(element.value,niveau,dansFor,element,options_traitement);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1270  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Assign" :
                var obj = php_traite_Expr_Assign(element,niveau,parent);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'erreur dans php_traite_Stmt_Expression 0512 ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_AssignRef" :
                var obj = php_traite_Expr_AssignRef(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'erreur dans php_traite_Stmt_Expression 0512 ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_FuncCall" :
                var obj = php_traite_Expr_FuncCall(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1304  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Include" :
                var obj = php_traite_Expr_Include(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1317  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Eval" :
                var obj = php_traite_Expr_Eval(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1327  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Ternary" :
                var obj = php_traite_Expr_Ternary(element,niveau,options_traitement);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1338  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case 'Expr_Isset' :
                var obj = php_traite_Expr_Isset(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1375  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case 'Expr_Array' :
                var obj = php_traite_Expr_Array(element,niveau,0);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'erreur dans php_traite_Stmt_Expression 1117' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_List" :
                var obj = php_traite_Expr_List(element,niveau,0);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'erreur dans php_traite_Stmt_Expression 0492' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Exit" :
                if(element.expr){
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='sortir(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1411  dans php_traite_Stmt_Expression  ' ,"element" : element}));
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
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1430  dans php_traite_Stmt_Expression "' + element.name.nodeType + '" ' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2083  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_ErrorSuppress" :
                if(element.expr){
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='supprimeErreur(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1446  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1449  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Print" :
                var obj = php_traite_print(element,niveau);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1471  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_New" :
                var obj = php_traite_Expr_New(element,niveau);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1483  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_PostInc" :
                if(element.var && element.var.nodeType === "Expr_Variable"){
                    t+='postinc($' + element.var.name + ')';
                }else{
                    var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='postinc(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1497  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }
                /* =============================================== */
                break;
                
            case "Expr_PostDec" :
                if(element.var && element.var.nodeType === "Expr_Variable"){
                    t+='postdec($' + element.var.name + ')';
                }else{
                    var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='postdec(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1510  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }
                /* =============================================== */
                break;
                
            case "Expr_PreDec" :
                if(element.var && element.var.nodeType === "Expr_Variable"){
                    t+='predec($' + element.var.name + ')';
                }else{
                    var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='predec(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1527  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }
                /* =============================================== */
                break;
                
            case "Expr_PreInc" :
                if(element.var && element.var.nodeType === "Expr_Variable"){
                    t+='preinc($' + element.var.name + ')';
                }else{
                    var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='preinc(' + obj.__xva + ' )';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1538  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }
                /* =============================================== */
                break;
                
            case "Expr_Cast_Array" :
                if(element.expr){
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='casttableau(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1403  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1406  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Cast_Double" :
                if(element.expr){
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='castfloat(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1540  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1543  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Cast_String" :
                if(element.expr){
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='caststring(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1555  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1558  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Empty" :
                if(element.expr){
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='appelf(nomf(empty),p(' + obj.__xva + '))';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1546  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1549  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Cast_Int" :
                if(element.expr){
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='castint(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1561  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1564  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_StaticCall" :
                var obj = php_traite_Expr_FuncCall(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1576  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_PropertyFetch" :
                if('Expr_Variable' === element.var.nodeType && element.name.nodeType === 'Identifier'){
                    t+='$' + element.var.name + '->' + element.name.name;
                }else{
                    var variable='';
                    if(element.var){
                        var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                        if(obj.__xst === true){
                            variable=obj.__xva;
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '1890  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                        }
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1450  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                    }
                    var propriete='';
                    if(element.name){
                        if(element.name.nodeType === 'Identifier'){
                            propriete=element.name.name;
                        }else if(element.name.nodeType === 'Expr_Variable'){
                            propriete='$' + element.name.name;
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '1900  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                        }
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1454  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
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
                            var obj = php_traite_Stmt_Expression(element.parts[i],niveau,dansFor,element,options_traitement);
                            if(obj.__xst === true){
                                chaine_concat+=',' + obj.__xva + '';
                                tableau_des_elements.push('{' + obj.__xva + '}');
                            }else{
                                return(astphp_logerreur({"__xst" : false ,"__xme" : '1890  dans php_traite_Stmt_Expression Expr_PropertyFetch ' ,"element" : element}));
                            }
                        }else if("Expr_MethodCall" === element.parts[i].nodeType){
                            var obj = php_traite_Expr_MethodCall(element.parts[i],niveau);
                            if(obj.__xst === true){
                                chaine_concat+=',' + obj.__xva + '';
                                /* à vérifier */
                                debugger;
                                /* à vérifier */
                                tableau_des_elements.push('{' + obj.__xva + '}');
                            }else{
                                return(astphp_logerreur({"__xst" : false ,"__xme" : '1252  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                            }
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '1475  dans php_traite_Stmt_Expression "' + element.parts[i].nodeType + '" ' ,"element" : element}));
                        }
                    }
                    t+='encapsulé("';
                    for( i=0 ; i < tableau_des_elements.length ; i++ ){
                        t+=tableau_des_elements[i].replace(/"/g,'\\"');
                    }
                    t+='")';
                    /*
                      if(chaine_concat !== ''){
                      chaine_concat=chaine_concat.substr(1);
                      t+='concat(' + chaine_concat + ')';
                      }else{
                      return(astphp_logerreur({"__xst" : false ,"__xme" : '1484  dans php_traite_Stmt_Expression Scalar_InterpolatedString ' ,"element" : element}));
                      }
                    */
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1472  dans php_traite_Stmt_Expression Scalar_InterpolatedString ' ,"element" : element}));
                }
                break;
                
            case "Expr_ClassConstFetch" :
                if(element.class && element.class.nodeType === "Name" && element.name && element.name.nodeType === "Identifier"){
                    t+=element.class.name + '::' + element.name.name;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1653  dans php_traite_Stmt_Expression Expr_ClassConstFetch ' ,"element" : element}));
                }
                break;
                
            case "Expr_StaticPropertyFetch" :
                /* $filename = self::$embedding_file; */
                if(element.class && element.class.nodeType === 'Name' && element.name && element.name.nodeType === "VarLikeIdentifier"){
                    t+=element.class.name + '::$' + element.name.name;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2185  dans php_traite_Stmt_Expression "' + element.nodeType + '" ' ,"element" : element}));
                }
                break;
                
            case "StaticVar" :
                var variable="";
                if(element.var){
                    var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        variable+=obj.__xva;
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1197  dans php_traite_Stmt_Expression pas de ' + element.nodeType + ' ' ,"element" : element}));
                }
                var valeurDef="";
                if(element.default && element.default !== null){
                    var obj = php_traite_Stmt_Expression(element.default,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='\n' + esp0 + 'static(' + variable + ' , ' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1200  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
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
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        if(element.class.name.indexOf('\\') >= 0){
                            t+='instance_de(' + obj.__xva + ' , \'' + element.class.name.replace(/\\/g,'\\\\') + '\')';
                        }else{
                            t+='instance_de(' + obj.__xva + ' , ' + element.class.name + ')';
                        }
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                    }
                }else{
                    var nom='';
                    var obj = php_traite_Stmt_Expression(element.class,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        nom=obj.__xva;
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                    }
                    var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element,options_traitement);
                    if(obj.__xst === true){
                        t+='instance_de(' + obj.__xva + ' , ' + nom + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ' ,"element" : element}));
                    }
                }
                break;
                
            case "Expr_Throw" :
                if(element.expr && element.expr.nodeType === "Expr_New"){
                    var obj = php_traite_Expr_New(element.expr,niveau);
                    if(obj.__xst === true){
                        t+='throw(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '1748  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1751  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Closure" :
                var obj = php_traite_Expr_Closure(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1576  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                /* =============================================== */
                break;
                
            case "Expr_Clone" :
                var obj = php_traite_Expr_Clone(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1576  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                break;
                
            case "Stmt_Static" :
                var obj = php_traite_Stmt_Static(element,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2183  dans php_traite_Stmt_Expression  ' ,"element" : element}));
                }
                break;
                
            default:
                return(astphp_logerreur({"__xst" : false ,"__xme" : '1392  dans php_traite_Stmt_Expression "' + element.nodeType + '"' ,"element" : element}));
                break;
                
        }
    }
    return({"__xst" : true ,"__xva" : t ,"nodeType" : element.nodeType});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Ternary(element,niveau,options_traitement){
    var t='';
    var conditionIf='';
    if(element.cond){
        var obj = php_traiteCondition1(element.cond,niveau,element);
        if(obj.__xst === true){
            conditionIf=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1744 erreur php_traite_Expr_Ternary' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1705 erreur php_traite_Expr_Ternary' ,"element" : element}));
    }
    var siVrai='';
    if(element.if){
        var objSiVrai = php_traite_Stmt_Expression(element.if,niveau,false,element,options_traitement);
        if(objSiVrai.__xst === true){
            siVrai=objSiVrai.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1758 erreur php_traite_Expr_Ternary' ,"element" : element}));
        }
    }
    var siFaux='';
    if(element.else){
        var objsiFaux = php_traite_Stmt_Expression(element.else,niveau,false,element,options_traitement);
        if(objsiFaux.__xst === true){
            siFaux=objsiFaux.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1769 erreur php_traite_Expr_Ternary' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1772 erreur php_traite_Expr_Ternary' ,"element" : element}));
    }
    t+='testEnLigne(condition(' + conditionIf + '),siVrai(' + siVrai + '),siFaux(' + siFaux + '))';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_BooleanOp_General(element,niveau,options_traitement){
    var t='';
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element,options_traitement);
        if(obj.__xst === true){
            if(element.nodeType === 'Expr_BooleanNot'){
                t+='non(' + obj.__xva + ')';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '1788 erreur php_traite_Expr_BooleanOp_General' ,"element" : element}));
            }
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1791 erreur php_traite_Expr_BooleanOp_General' ,"element" : element}));
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_BinaryOp_General(element,niveau,parent,options_traitement){
    var t='';
    var gauche='';
    var objGauche = php_traite_Stmt_Expression(element.left,niveau,false,element,options_traitement);
    if(objGauche.__xst === true){
        gauche=objGauche.__xva;
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1497  dans php_traite_Expr_BinaryOp_General' ,"element" : element}));
    }
    var droite='';
    var objdroite = php_traite_Stmt_Expression(element.right,niveau,false,element,options_traitement);
    if(objdroite.__xst === true){
        if(objdroite.__xva.substr(0,7) === 'concat(' && "Expr_BinaryOp_Concat" === element.nodeType){
            droite=objdroite.__xva.substr(7);
            droite=droite.substr(0,droite.length - 1);
        }else{
            droite=objdroite.__xva;
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1513  dans php_traite_Expr_BinaryOp_General' ,"element" : element}));
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
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1918  non prévu ' + element.nodeType + ' dans php_traite_Expr_BinaryOp_General "' + element.nodeType + '"' ,"element" : element}));
    }
    if(t.substr(0,14) === 'concat(concat('){
        var tableau1 = iterateCharacters2(t);
        var o = functionToArray2(tableau1.out,false,true,'');
        if(o.__xst === true){
            var nouveauTableau = baisserNiveauEtSupprimer(o.__xva,2,0);
            var obj = a2F1(nouveauTableau,0,true,1);
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
function php_traiteCondition1(element,niveau,parent,options_traitement){
    var t='';
    var obj = php_traite_Stmt_Expression(element,niveau,false,parent);
    if(obj.__xst === true){
        /*
          il y a souvent un niveau de parenthèses en trop ici 
          On parcourt la matrice pour voir si 
          - la première entrée est une fonction vide
          - tous les autres niveaux sont >=1
        */
        if(obj.__xva.substr(0,1) === '(' && obj.__xva.substr(obj.__xva.length - 1,1) === ')'){
            var matrice = functionToArray(obj.__xva,true,true,'');
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
                        var nouveauTableau = baisserNiveauEtSupprimer(matrice.__xva,1,0);
                        var obj1 = a2F1(nouveauTableau,0,true,1);
                        if(obj1.__xst === true){
                            t+=obj1.__xva;
                        }else{
                            return(astphp_logerreur({"__xst" : false ,"__xme" : '16164334  dans php_traiteCondition1' ,"element" : element}));
                        }
                    }else{
                        t+=obj.__xva;
                    }
                }else{
                    t+=obj.__xva;
                }
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '1656  dans php_traiteCondition1' ,"element" : element}));
            }
        }else{
            t+=obj.__xva;
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1665  dans php_traiteCondition1' ,"element" : element}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_Stmt_While(element,niveau,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var conditionWhile='';
    if(element.cond){
        var obj = php_traiteCondition1(element.cond,niveau,element,options_traitement);
        if(obj.__xst === true){
            conditionWhile=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1497  dans php_traite_Stmt_While' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1948  dans php_traite_Stmt_While' ,"element" : element}));
    }
    var instructionsDansWhile='';
    if(element.stmts){
        var obj = TransformAstPhpEnRev(element.stmts,niveau + 2,element,false,false,options_traitement);
        if(obj.__xst === true){
            instructionsDansWhile+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1956  dans php_traite_Stmt_While' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1959  dans php_traite_Stmt_While' ,"element" : element}));
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
  =====================================================================================================================
*/
function php_traite_Stmt_If(element,niveau,unElseIfOuUnElse,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var conditionIf='';
    var instructionsDansElseOuElseifIf='';
    if(element.cond){
        var obj = php_traiteCondition1(element.cond,niveau,element,options_traitement);
        if(obj.__xst === true){
            conditionIf=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2081  dans php_traite_Stmt_If' ,"element" : element}));
        }
    }else{
        conditionIf='';
    }
    var instructionsDansIf='';
    if(element.stmts){
        niveau+=3;
        var obj = TransformAstPhpEnRev(element.stmts,niveau,element,false,false,options_traitement);
        niveau-=3;
        if(obj.__xst === true){
            instructionsDansIf+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2096  dans php_traite_Stmt_If' ,"element" : element}));
        }
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1999  dans php_traite_Stmt_If' ,"element" : element}));
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
            var objElseIf = php_traite_Stmt_If(element.elseifs[j],niveau,true,options_traitement);
            if(objElseIf.__xst === true){
                t+='' + objElseIf.__xva + '';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '2126  dans php_traite_Stmt_If' ,"element" : element}));
            }
        }
    }
    if(element.else){
        if(element.else.stmts){
            if(false && element.else.stmts.length === 1 && element.else.stmts[0].nodeType === "Stmt_If"){
                var objElseIf = php_traite_Stmt_If(element.else.stmts[0],niveau,true,options_traitement);
                if(objElseIf.__xst === true){
                    t+='' + objElseIf.__xva + '';
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2140  dans php_traite_Stmt_If' ,"element" : element}));
                }
            }else{
                niveau+=3;
                var obj = TransformAstPhpEnRev(element.else.stmts,niveau,element,false,false,options_traitement);
                niveau-=3;
                if(obj.__xst === true){
                    t+='\n' + esp0 + esp1 + 'sinon(';
                    t+='\n' + esp0 + esp1 + esp1 + 'alors(\n';
                    t+=obj.__xva;
                    t+='\n' + esp0 + esp1 + esp1 + ')';
                    t+='\n' + esp0 + esp1 + ')';
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2154  dans php_traite_Stmt_If' ,"element" : element}));
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
  =====================================================================================================================
*/
function php_traite_Stmt_Class(element,niveau,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
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
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2573 dans php_traite_Stmt_Class pour "' + element.extends.nodeType + '"' ,"element" : element}));
        }
    }
    if(element.implements && element.implements.length > 0){
        for( var i=0 ; i < element.implements.length ; i++ ){
            if(element.implements[i].nodeType === 'Name'){
                implemente+=',' + element.implements[i].name;
            }else if(element.implements[i].nodeType === 'Name_FullyQualified'){
                implemente+=',\'\\\\' + element.implements[i].name + '\'';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '2111 dans php_traite_Stmt_Class' ,"element" : element}));
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
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2123 dans php_traite_Stmt_Class' ,"element" : element}));
        }
    }
    if(element.name && element.name.nodeType === "Identifier"){
        nom_de_classe=element.name.name;
    }else{
        return(astphp_logerreur({"__xst" : false ,"__xme" : '2108 dans php_traite_Stmt_Class' ,"element" : element}));
    }
    if(element.stmts && element.stmts.length > 0){
        var obj = TransformAstPhpEnRev(element.stmts,niveau + 2,element,false,false,options_traitement);
        if(obj.__xst === true){
            contenu=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1955  dans php_traite_Stmt_Class' ,"element" : element}));
        }
    }else{
        contenu='';
        /* return(astphp_logerreur({"__xst" : false ,"__xme" : '1949  dans php_traite_Stmt_Class' ,"element" : element})); */
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
  =====================================================================================================================
*/
function php_traite_Stmt_DoWhile(element,niveau,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var condition='';
    if(element.cond && element.cond.length === 1){
        var obj = php_traiteCondition1(element.cond[0],niveau,element);
        if(obj.__xst === true){
            condition+='(' + obj.__xva + ')';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2265 dans php_traite_Stmt_For ' ,"element" : element}));
        }
    }else if(element.cond && element.cond.length === 0){
        condition='';
    }else if(element.cond && element.cond.nodeType){
        var obj = php_traiteCondition1(element.cond,niveau,element);
        if(obj.__xst === true){
            condition+='(' + obj.__xva + ')';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2265 dans php_traite_Stmt_For ' ,"element" : element}));
        }
    }else{
        debugger;
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1963 dans php_traite_Stmt_For il y a plusieurs instructions dans la condition mais seule la dernière est prise en compte' ,"element" : element}));
    }
    var instructions='';
    if(element.stmts && element.stmts.length > 0){
        var obj1 = TransformAstPhpEnRev(element.stmts,niveau,element,false,false,options_traitement);
        if(obj1.__xst === true){
            instructions+=obj1.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1527  dans php_traite_Stmt_For erreur dans les instructions' ,"element" : element}));
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
  =====================================================================================================================
*/
function php_traite_Stmt_For(element,niveau,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var initialisation='';
    if(element.init && element.init.length > 0){
        var obj1 = TransformAstPhpEnRev(element.init,niveau,element,true,false,options_traitement);
        if(obj1.__xst === true){
            initialisation+=obj1.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1495  dans php_traite_Stmt_For erreur dans l\'initialisation' ,"element" : element}));
        }
    }
    var condition='';
    if(element.cond && element.cond.length === 1){
        var obj = php_traiteCondition1(element.cond[0],niveau,element);
        if(obj.__xst === true){
            condition+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2265 dans php_traite_Stmt_For ' ,"element" : element}));
        }
    }else if(element.cond && element.cond.length === 0){
        condition='';
    }else{
        debugger;
        return(astphp_logerreur({"__xst" : false ,"__xme" : '1963 dans php_traite_Stmt_For il y a plusieurs instructions dans la condition mais seule la dernière est prise en compte' ,"element" : element}));
    }
    var increment='';
    if(element.loop && element.loop.length > 0){
        var obj1 = TransformAstPhpEnRev(element.loop,niveau,element,true,false,options_traitement);
        if(obj1.__xst === true){
            increment+=obj1.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1519  dans php_traite_Stmt_For erreur dans l\'incrément' ,"element" : element}));
        }
    }
    var instructions='';
    if(element.stmts && element.stmts.length > 0){
        var obj1 = TransformAstPhpEnRev(element.stmts,niveau,element,false,false,options_traitement);
        if(obj1.__xst === true){
            instructions+=obj1.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '1527  dans php_traite_Stmt_For erreur dans les instructions' ,"element" : element}));
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
  =====================================================================================================================
*/
function php_traite_Stmt_Foreach(element,niveau,options_traitement){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var cleValeur='';
    if(element.keyVar){
        var obj = php_traite_Stmt_Expression(element.keyVar,niveau,false,element,options_traitement);
        if(obj.__xst === true){
            cleValeur=obj.__xva + ' , ';
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2165  dans php_traite_Stmt_Foreach' ,"element" : element}));
        }
    }
    if(element.valueVar){
        var obj = php_traite_Stmt_Expression(element.valueVar,niveau,false,element,options_traitement);
        if(obj.__xst === true){
            cleValeur+=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2173  dans php_traite_Stmt_Foreach' ,"element" : element}));
        }
    }
    var nomVariable='';
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element,options_traitement);
        if(obj.__xst === true){
            nomVariable=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2182  dans php_traite_Stmt_Foreach' ,"element" : element}));
        }
    }
    var instructions='';
    if(element.stmts){
        niveau+=2;
        var obj = TransformAstPhpEnRev(element.stmts,niveau,element,false,false,options_traitement);
        niveau-=2;
        if(obj.__xst === true){
            instructions=obj.__xva;
        }else{
            return(astphp_logerreur({"__xst" : false ,"__xme" : '2194 dans php_traite_Stmt_Foreach 1905 ' ,"element" : element}));
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
  =====================================================================================================================
*/
function ajouteCommentairesAvant(element,niveau){
    var t='';
    if(element.attributes.comments){
        var esp0 = ' '.repeat(NBESPACESREV * niveau);
        var esp1 = ' '.repeat(NBESPACESREV);
        var j=0;
        for( j=0 ; j < element.attributes.comments.length ; j++ ){
            if("Comment" === element.attributes.comments[j].nodeType || "Comment_Doc" === element.attributes.comments[j].nodeType){
                var txtComment = element.attributes.comments[j].text.substr(2);
                if(element.attributes.comments[j].text.substr(0,2) === '/*'){
                    var c1 = nbre_caracteres2('(',txtComment);
                    var c2 = nbre_caracteres2(')',txtComment);
                    var val = txtComment.substr(0,txtComment.length - 2);
                    if(c1 === c2){
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
                    var c1 = nbre_caracteres2('(',txtComment);
                    var c2 = nbre_caracteres2(')',txtComment);
                    if(c1 === c2){
                        t+='\n' + esp0 + '#( ' + txtComment.trim() + ')';
                    }else{
                        t+='\n' + esp0 + '#( ' + txtComment.trim().replace(/\(/g,'[').replace(/\)/g,']') + ')';
                    }
                    element.attributes.comments[j].text='';
                }
            }
        }
    }
    return t;
}
/*
  =====================================================================================================================
*/
function php_construit_cle(l){
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
  =====================================================================================================================
*/
function construit_cle_pour_php(length){
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
/*
  =====================================================================================================================
*/
function TransformAstPhpEnRev(stmts,niveau,parent,dansFor,de_racine,options_traitement){
    if(typeof de_racine !== 'undefined' && de_racine === true){
        contient_du_javascript_dans_html=false;
        tableau_de_html_dans_php_a_convertir=[];
    }
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var numeroLignePrecedentStmtHtmlStartLine=0;
    var numeroLigneCourantStmtHtmlStartLine=0;
    var numeroLignePrecedentStmtHtmlEndLine=0;
    var numeroLigneCourantStmtHtmlEndLine=0;
    var StmtsHtmlPrecedentEstEcho=false;
    if(stmts.length > 0){
        var i=0;
        for( i=0 ; i < stmts.length ; i++ ){
            t+=ajouteCommentairesAvant(stmts[i],niveau);
            if(t !== '' && "Stmt_Nop" !== stmts[i].nodeType){
                t+=',';
            }
            if("Stmt_Nop" === stmts[i].nodeType){
                t+='';
            }else if("Stmt_InlineHTML" === stmts[i].nodeType){
                /*
                  =====================================================================================
                  Quand un php contient du html, ou bien ce dernier est un dom valide qui ne contient pas de php
                  par exemple ">? <div>que_du_html</div><?php"
                  ou bien il contient du php, 
                  par exemple ">? <div> <?php echo '';?> </div> <?php"
                  Dans ce dernier car la chaine " <div> " n'est pas un html "parfait"
                  =====================================================================================
                */
                var estTraiteSansErreur=false;
                var obj = isHTML(stmts[i].value);
                if(obj.__xst === true){
                    var nettoye = stmts[i].value.replace(/\<\!\-\-(.*)\-\-\>/g,'').trim();
                }
                /* recherche d'au moins un tag dans le texte */
                var regex=/(<[a-zA-Z0-9\-_]+)/g;
                var found = stmts[i].value.match(regex);
                if(obj.__xst === true && (stmts[i].value.indexOf('<') >= 0 && found && found.length > 0 || nettoye === '')){
                    var cle = php_construit_cle(10);
                    tableau_de_html_dans_php_a_convertir.push({"cle" : cle ,"valeur" : stmts[i].value});
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
                        return(astphp_logerreur({
                            "__xst" : false ,
                            "__xme" : '2230 ATTENTION, ce php contient du html en ligne qui n\'est pas complet<br /> passez par le menu html pour le nettoyer <br />ou bien utilisez le bouton "convertir3" du menu php'
                        }));
                    }
                    var cle = construit_cle_pour_php(10);
                    t+='#( === transformation html incomplet en echo voir ci dessous pour la clé = "' + cle + '")';
                    logerreur({"__xst" : false ,"__xme" : "2848 ATTENTION, ce php contient du html incomplet qui est converti en echo (" + cle + ") !"});
                    numeroLigneCourantStmtHtmlStartLine=stmts[i].attributes.startLine;
                    numeroLigneCourantStmtHtmlEndLine=stmts[i].attributes.endLine;
                    if(stmts[i].value.toLowerCase().indexOf('<script') < 0){
                        /*
                          =====================================================================
                          C'est un html incomplet qui ne contient pas de script, on le transforme en echo
                          =====================================================================
                        */
                        if((numeroLigneCourantStmtHtmlStartLine === numeroLignePrecedentStmtHtmlStartLine
                         || numeroLigneCourantStmtHtmlStartLine === numeroLignePrecedentStmtHtmlEndLine)
                         && StmtsHtmlPrecedentEstEcho === true
                        ){
                            t=t.substr(0,t.length - 2) + ',p(\'' + stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'))';
                        }else{
                            t+='\n' + esp0 + 'appelf(nomf(echo),p(\'' + stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'))';
                        }
                        StmtsHtmlPrecedentEstEcho=true;
                        numeroLignePrecedentStmtHtmlStartLine=numeroLigneCourantStmtHtmlStartLine;
                        numeroLignePrecedentStmtHtmlEndLine=numeroLigneCourantStmtHtmlEndLine;
                    }else{
                        /*
                          =====================================================================
                          cas ou le html contenu contient des scripts, 
                          =====================================================================
                          
                        */
                        var obj1 = __module_html1.mapDOM(stmts[i].value);
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
                                                            var objScr = convertit_source_javascript_en_rev(obj1.content[j].content[k].content[0]);
                                                            if(objScr.__xst === true){
                                                                contient_du_javascript_dans_html=true;
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
                                                        contient_du_javascript_dans_html=true;
                                                        var obj = __module_html1.traiteAstDeHtml(obj1.content[j].content[k],0,true,'',tableau_de_javascripts_dans_php_a_convertir);
                                                        if(obj.__xst === true){
                                                            t+='\n' + esp0 + 'html_dans_php(' + obj.__xva + ')';
                                                        }else{
                                                            return(astphp_logerreur({"__xst" : false ,"__xme" : '2433 dans TransformAstPhpEnRev ' ,"element" : stmts[i]}));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }else{
                                        return(astphp_logerreur({"__xst" : false ,"__xme" : '2440 dans TransformAstPhpEnRev ' ,"element" : stmts[i]}));
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
            }else if("Stmt_Echo" === stmts[i].nodeType){
                var obj = php_traite_echo(stmts[i],niveau);
                if(obj.__xst === true){
                    numeroLigneCourantStmtHtmlStartLine=stmts[i].attributes.startLine;
                    numeroLigneCourantStmtHtmlEndLine=stmts[i].attributes.endLine;
                    if((numeroLigneCourantStmtHtmlStartLine === numeroLignePrecedentStmtHtmlStartLine
                     || numeroLigneCourantStmtHtmlStartLine === numeroLignePrecedentStmtHtmlEndLine)
                     && StmtsHtmlPrecedentEstEcho === true
                    ){
                        /*
                          t finit par appelf(nomf(echo),p($d)),"
                        */
                        if('appelf(nomf(echo),' === obj.__xva.substr(0,18)){
                            t=t.substr(0,t.length - 2) + obj.__xva.substr(17);
                        }else{
                            t+='\n' + esp0 + obj.__xva;
                        }
                        numeroLignePrecedentStmtHtmlStartLine=numeroLigneCourantStmtHtmlStartLine;
                        numeroLignePrecedentStmtHtmlEndLine=numeroLigneCourantStmtHtmlEndLine;
                    }else{
                        t+='\n' + esp0 + obj.__xva;
                    }
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev 2342 "' + stmts[i].nodeType + '" ' ,"element" : stmts[i]}));
                }
            }else if("Stmt_If" === stmts[i].nodeType){
                var obj = php_traite_Stmt_If(stmts[i],niveau,false,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev 2024 "' + stmts[i].nodeType + '" ' ,"element" : stmts[i]}));
                }
            }else if("Stmt_Expression" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Expression(stmts[i].expr,niveau,dansFor,stmts,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev 1922 "' + stmts[i].nodeType + '" ' ,"element" : stmts[i]}));
                }
            }else if("Stmt_Function" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Function(stmts[i],niveau);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2376  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                }
            }else if("Stmt_Use" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Use(stmts[i],niveau);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2387  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '" ' ,"element" : stmts[i]}));
                }
            }else if("Stmt_TryCatch" === stmts[i].nodeType){
                var obj = php_traite_Stmt_TryCatch(stmts[i],niveau,false,false,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2398  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                }
            }else if("Stmt_Return" === stmts[i].nodeType){
                if(stmts[i].expr === null){
                    t+='\n' + esp0 + 'revenir()';
                }else{
                    var obj = php_traite_Stmt_Expression(stmts[i].expr,niveau,dansFor,stmts);
                    if(obj.__xst === true){
                        t+='\n' + esp0 + 'retourner(' + obj.__xva + ')';
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '2411  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                    }
                }
            }else if("Stmt_Break" === stmts[i].nodeType){
                if(stmts[i].num === null){
                    t+='\n' + esp0 + 'break()';
                }else if(stmts[i].num.nodeType === 'Scalar_Int'){
                    t+='\n' + esp0 + 'break(' + stmts[i].num.value + ')';
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2420  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                }
            }else if("Stmt_Switch" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Switch(stmts[i],niveau,false,false,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_Switch 2215 ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if(stmts[i].nodeType === 'Stmt_Unset'){
                var obj = php_traite_Expr_Unset(stmts[i],niveau);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_Unset 2226 ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_Foreach" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Foreach(stmts[i],niveau,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_Foreach 2237 ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_Do" === stmts[i].nodeType){
                var obj = php_traite_Stmt_DoWhile(stmts[i],niveau,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_For 2248 ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_For" === stmts[i].nodeType){
                var obj = php_traite_Stmt_For(stmts[i],niveau,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_For 2248 ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if(stmts[i].nodeType.substr(0,14) === "Expr_AssignOp_"){
                var obj = php_traite_Expr_AssignOp_General(stmts[i],niveau,stmts[i].nodeType);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Expr_AssignOp_ 2261 ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Expr_Assign" === stmts[i].nodeType){
                var obj = php_traite_Expr_Assign(stmts[i],niveau,parent);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2541 dans TransformAstPhpEnRev pour Expr_Assign  ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_Class" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Class(stmts[i],niveau,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : 'dans TransformAstPhpEnRev pour Stmt_Class 2436 ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_ClassMethod" === stmts[i].nodeType){
                var obj = php_traite_Stmt_ClassMethod(stmts[i],niveau,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '1051  dans php_traite_Stmt_Expression  ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_Continue" === stmts[i].nodeType
             || "Stmt_Global" === stmts[i].nodeType
             || "Stmt_ClassConst" === stmts[i].nodeType
             || "Expr_Isset" === stmts[i].nodeType
             || "Expr_PostDec" === stmts[i].nodeType
             || "Expr_PostInc" === stmts[i].nodeType
             || "Expr_PreDec" === stmts[i].nodeType
             || "Expr_PreInc" === stmts[i].nodeType
             || "Stmt_Property" === stmts[i].nodeType
             || "Stmt_Static" === stmts[i].nodeType
             || 'Expr_BinaryOp_' === stmts[i].nodeType.substr(0,14)
            ){
                var obj = php_traite_Stmt_Expression(stmts[i],niveau,dansFor,stmts,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2013  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_While" === stmts[i].nodeType){
                var obj = php_traite_Stmt_While(stmts[i],niveau,options_traitement);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2530  dans TransformAstPhpEnRev  ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_Declare" === stmts[i].nodeType){
                var obj = php_traite_Expr_declare(stmts[i],niveau);
                if(obj.__xst === true){
                    t+='\n' + esp0 + obj.__xva;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2539  dans TransformAstPhpEnRev  ' ,"element" : stmts[i]}));
                }
                /* =============================================== */
            }else if("Stmt_HaltCompiler" === stmts[i].nodeType){
                if(stmts[i].remaining && stmts[i].remaining !== ''){
                    t+='\n' + esp0 + '__halt_compiler(\'' + stmts[i].remaining.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
                }else{
                    t+='\n' + esp0 + '__halt_compiler()';
                }
            }else if("Stmt_Namespace" === stmts[i].nodeType){
                var nom_de_l_espace='';
                var faire='';
                if("Name" === stmts[i].name.nodeType){
                    nom_de_l_espace=stmts[i].name.name;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2604 dans TransformAstPhpEnRev  ' ,"element" : stmts[i]}));
                }
                if(stmts[i].stmts && stmts[i].stmts.length > 0){
                    var obj = TransformAstPhpEnRev(stmts[i].stmts,niveau + 2,stmts[i],false,false,options_traitement);
                    if(obj.__xst === true){
                        faire+=obj.__xva;
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '2613  erreur php_traite_Stmt_TryCatch' ,"element" : stmts[i]}));
                    }
                }
                if(nom_de_l_espace.indexOf('\\') >= 0){
                    t+='\n' + esp0 + 'espace_de_noms(nom_espace(\'' + nom_de_l_espace.replace(/\\/g,'\\\\') + '\'),faire(' + faire + '))';
                }else{
                    t+='\n' + esp0 + 'espace_de_noms(nom_espace(' + nom_de_l_espace + '),faire(' + faire + '))';
                }
            }else if("Stmt_Interface" === stmts[i].nodeType){
                var nom_de_l_interface='';
                var faire='';
                if("Identifier" === stmts[i].name.nodeType){
                    nom_de_l_interface=stmts[i].name.name;
                }else{
                    return(astphp_logerreur({"__xst" : false ,"__xme" : '2626  dans TransformAstPhpEnRev  ' ,"element" : stmts[i]}));
                }
                if(stmts[i].stmts && stmts[i].stmts.length > 0){
                    var obj = TransformAstPhpEnRev(stmts[i].stmts,niveau + 2,stmts[i],false,false,options_traitement);
                    if(obj.__xst === true){
                        faire+=obj.__xva;
                    }else{
                        return(astphp_logerreur({"__xst" : false ,"__xme" : '2633 erreur php_traite_Stmt_TryCatch' ,"element" : stmts[i]}));
                    }
                }
                t+='\n' + esp0 + 'interface(nom_interface(\'' + nom_de_l_interface + '\'),faire(' + faire + '))';
            }else{
                return(astphp_logerreur({"__xst" : false ,"__xme" : '2620  dans TransformAstPhpEnRev nodeType non prévu "' + stmts[i].nodeType + '"' ,"element" : stmts[i]}));
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
    /*
      if(niveau===0){
      console.log('comptage=' , comptage);
      }
    */
    if(typeof de_racine !== 'undefined'){
        return({"__xst" : true ,"__xva" : t ,"contient_du_javascript_dans_html" : contient_du_javascript_dans_html ,"tableau_de_html_dans_php_a_convertir" : tableau_de_html_dans_php_a_convertir});
    }else{
        return({"__xst" : true ,"__xva" : t});
    }
}
/*
  =====================================================================================================================
*/
function isHTML(str){
    var i=0;
    var j=0;
    var c0='';
    var cp1='';
    var cm1='';
    var dansTag=false;
    var dansInner=true;
    var dansNomPropriete=false;
    var dansValeurPropriete=false;
    var dansNomTag=false;
    var caractereDebutProp='';
    var nomTag='';
    var dansBaliseFermante=false;
    var tabTags=[];
    var presDe='';
    var dansCdata=false;
    var dansTextArea=false;
    var l01=str.length;
    var niveau=0;
    var i=0;
    for( i=0 ; i < l01 ; i++ ){
        c0=str.substr(i,1);
        if(i < l01 - 1){
            cp1=str.substr(i + 1,1);
        }else{
            cp1='';
        }
        if(i > 0 && l01 > 0){
            cm1=str.substr(i - 1,1);
        }else{
            cm1='';
        }
        if(dansCdata === true){
            /*
              =============================================================================================
              premier cas spécial : cdata
              =============================================================================================
            */
            var j=i;
            for( j=i ; j < l01 ; j++ ){
                if(str.substr(j,3) === ']]' + '>'){
                    i=j + 2;
                    break;
                }
            }
            dansCdata=false;
            nomTag='';
            dansInner=true;
            dansTag=false;
            continue;
        }else if(dansTextArea === true){
            /*
              =============================================================================================
              deuxième cas spécial : textarea
              =============================================================================================
            */
            var j=i;
            for( j=i ; j < l01 ; j++ ){
                if(str.substr(j,11).toLowerCase() === '</' + 'textarea>'){
                    i=j - 1;
                    break;
                }
            }
            dansTextArea=false;
            nomTag='';
            dansInner=true;
            dansTag=false;
            continue;
        }else if(dansTag){
            if(dansNomPropriete){
                if(c0 === ' ' || c0 === '\r' || c0 === '\n' || c0 === '\t'){
                    if(i > 50){
                        presDe=str.substr(i - 50,i + 10);
                    }else{
                        presDe=str.substr(0,i + 10);
                    }
                    return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1785 pres de "' + presDe + '"'});
                }else if(c0 === '='){
                    if(cp1 === "'" || cp1 === '"'){
                        dansValeurPropriete=true;
                        dansNomPropriete=false;
                        caractereDebutProp=cp1;
                        i++;
                    }else{
                        if(i > 50){
                            presDe=str.substr(i - 50,i + 10);
                        }else{
                            presDe=str.substr(0,i + 10);
                        }
                        return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 2864 pres de "' + presDe + '"'});
                    }
                }else{
                }
            }else if(dansValeurPropriete){
                if(c0 === caractereDebutProp){
                    if(cm1 === '\\'){
                    }else{
                        dansValeurPropriete=false;
                    }
                }else{
                }
            }else if(dansNomTag){
                if(c0 === ' ' || c0 === '\r' || c0 === '\n' || c0 === '\t'){
                    if(dansCdata === true){
                        var j=i;
                        for( j=i ; j < l01 ; j++ ){
                            if(str.substr(j,3) === ']]' + '>'){
                                i=j + 2;
                                break;
                            }
                        }
                        dansNomTag=false;
                        dansTag=false;
                        dansInner=true;
                        nomTag='';
                        continue;
                    }else{
                        if(nomTag.toLowerCase() === 'textarea'){
                            dansTextArea=true;
                        }
                        tabTags.push(nomTag);
                        dansNomTag=false;
                    }
                }else if(c0 === '>'){
                    if(dansBaliseFermante){
                        dansNomTag=false;
                        dansInner=true;
                        dansTag=false;
                        if(nomTag === tabTags[tabTags.length-1]){
                            /*
                              on a bien une balise fermante correspondant à la palise ouvrante précédente
                            */
                            tabTags.pop();
                        }else{
                            return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 2266 les balises html ne sont pas équilibrées'});
                        }
                        nomTag='';
                        dansBaliseFermante=false;
                        niveau--;
                    }else{
                        if(nomTag === ''){
                            if(i > 50){
                                presDe=str.substr(i - 50,i + 10);
                            }else{
                                presDe=str.substr(0,i + 10);
                            }
                            return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1852 pres de "' + presDe + '"'});
                        }
                        if(nomTag.toLowerCase() === 'textarea'){
                            dansTextArea=true;
                        }
                        tabTags.push(nomTag);
                        dansNomTag=false;
                        dansInner=true;
                        dansTag=false;
                        nomTag='';
                    }
                }else if(c0 === '=' || c0 === '"' || c0 === '\''){
                    if(i > 50){
                        presDe=str.substr(i - 50,i + 10);
                    }else{
                        presDe=str.substr(0,i + 10);
                    }
                    return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 2926 pres de "' + presDe + '"'});
                }else{
                    nomTag+=c0;
                    if(nomTag === '![C' + 'DATA['){
                        dansCdata=true;
                    }
                }
            }else{
                if(nomTag === ''){
                    if(c0 === ' ' || c0 === '\r' || c0 === '\n' || c0 === '\t'){
                        if(i > 50){
                            presDe=str.substr(i - 50,i + 10);
                        }else{
                            presDe=str.substr(0,i + 10);
                        }
                        return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1865 pres de "' + presDe + '"'});
                    }else{
                        dansNomTag=true;
                        nomTag+=c0;
                    }
                }else{
                    /*
                      le tag a été fait, maintenant, c'est les propriétés 
                      ou la fin des propriétés ou un / pour une balise auto fermante ( <br /> )
                    */
                    if(c0 === ' ' || c0 === '\r' || c0 === '\n' || c0 === '\t'){
                    }else if(c0 === '/'){
                        if(cp1 === '>'){
                            nomTag='';
                            if(tabTags.length === 0){
                                if(i > 50){
                                    presDe=str.substr(i - 50,i + 10);
                                }else{
                                    presDe=str.substr(0,i + 10);
                                }
                                return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1902 pres de "' + presDe + '"'});
                            }
                            tabTags.pop();
                            niveau--;
                            dansTag=false;
                            dansInner=true;
                            i++;
                        }
                    }else if(c0 === '>'){
                        if(nomTag === ''){
                            if(i > 50){
                                presDe=str.substr(i - 50,i + 10);
                            }else{
                                presDe=str.substr(0,i + 10);
                            }
                            return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1896 pres de "' + presDe + '"'});
                        }
                        dansTag=false;
                        dansInner=true;
                        if(tabTags.length === 0){
                            if(i > 50){
                                presDe=str.substr(i - 50,i + 10);
                            }else{
                                presDe=str.substr(0,i + 10);
                            }
                            return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1929 pres de "' + presDe + '"'});
                        }
                        /*
                          pas de pop ici, dans <a b="c">d</a>, on est sur le > avant le d
                        */
                        nomTag='';
                    }else{
                        if(c0 === '=' || c0 === '"' || c0 === '\''){
                            if(i > 50){
                                presDe=str.substr(i - 50,i + 10);
                            }else{
                                presDe=str.substr(0,i + 10);
                            }
                            return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1910 pres de "' + presDe + '"'});
                        }else{
                            dansNomPropriete=true;
                        }
                    }
                }
            }
        }else if(dansInner){
            if(c0 === '<'){
                if(cp1 === '/'){
                    if(tabTags.length === 0){
                        if(i > 50){
                            presDe=str.substr(i - 50,i + 10);
                        }else{
                            presDe=str.substr(0,i + 10);
                        }
                        return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1982 pres de "' + presDe + '"'});
                    }
                    dansBaliseFermante=true;
                    i++;
                    dansInner=false;
                    dansTag=true;
                }else{
                    if(cp1 === '!' && i < l01 - 4 && str.substr(i + 2,1) === '-' && str.substr(i + 3,1) === '-'){
                        /*
                          on est dans un commentaire
                        */
                        var fin_de_commentaire_trouve=-1;
                        for( j=i + 4 ; j < l01 - 3 && fin_de_commentaire_trouve === -1 ; j++ ){
                            if(str.substr(j,3) === '-->'){
                                fin_de_commentaire_trouve=j;
                            }
                        }
                        if(fin_de_commentaire_trouve > 0){
                            i=fin_de_commentaire_trouve + 2;
                            dansTag=false;
                        }else{
                            niveau+=1;
                            dansInner=false;
                            dansTag=true;
                        }
                    }else{
                        niveau+=1;
                        dansInner=false;
                        dansTag=true;
                    }
                }
            }else if(c0 === '>'){
                if(niveau === 0){
                    if(i > 50){
                        presDe=str.substr(i - 50,i + 10);
                    }else{
                        presDe=str.substr(0,i + 10);
                    }
                    return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1935 pres de "' + presDe + '"'});
                }
            }else{
            }
        }else{
            if(c0 === '<'){
            }else if(c0 === '>'){
                debugger;
                niveau-=1;
                if(niveau < 0){
                    if(i > 50){
                        presDe=str.substr(i - 50,i + 10);
                    }else{
                        presDe=str.substr(0,i + 10);
                    }
                    return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1952 pres de "' + presDe + '"'});
                }
            }
        }
    }
    if(tabTags.length > 0){
        if(i > 50){
            presDe=str.substr(i - 50,i + 10);
        }else{
            presDe=str.substr(0,i + 10);
        }
        return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1964 pres de "' + presDe + '"'});
    }
    if(dansTag){
        if(i > 50){
            presDe=str.substr(i - 50,i + 10);
        }else{
            presDe=str.substr(0,i + 10);
        }
        return({"__xst" : false ,"id" : i ,"__xme" : 'Erreur 1972 pres de "' + presDe + '"'});
    }
    return({"__xst" : true});
}
/*
  =====================================================================================================================
*/
async function traiter_html_dans_php1(param){
    console.log('%c on entre dans traiter_html_dans_php1','background:yellow;color:red;');
    if(param.hasOwnProperty('cle_convertie')){
        globale_source_php1=param.nouveau_source;
        for( var i=0 ; i < globale_tableau_des_php1.length ; i++ ){
            if(globale_tableau_des_php1[i].cle === param.cle_convertie){
                globale_tableau_des_php1.splice(i,1);
            }
        }
    }
    if(globale_tableau_des_php1.length === 0){
        console.log('termine');
        globale_tableau_des_php1=[];
        globale_source_php1='';
        debugger;
        return;
    }else{
        console.log('dans traiter_html_dans_php1, globale_source_php1=',globale_source_php1);
    }
    var a_convertir=globale_tableau_des_php1[0];
    console.log(a_convertir);
    var options={"fonction_a_appeler" : "traiter_html_dans_php1" ,"source_php" : globale_source_php1 ,"a_convertir" : a_convertir};
    setTimeout(function(options){
            __module_html1.TransformHtmlEnRev(options.a_convertir.valeur,0,options);
        },1000,options);
}
/*
  try{
  
  await __module_html1.TransformHtmlEnRev(a_convertir.valeur,0,options);
  
  }catch(e){
  console.error('e=',e);
  }
*/
var globale_tableau_des_php1=[];
var globale_source_php1='';
/*
  =====================================================================================================================
*/
function transforme_html_de_php_en_rev(texteHtml,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV * niveau);
    var esp1 = ' '.repeat(NBESPACESREV);
    var supprimer_le_tag_html_et_head=true;
    var doctype='';
    var elementsJson={};
    var i=0;
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
                var obj = __module_html1.traiteAstDeHtml(elementsJson.__xva,0,supprimer_le_tag_html_et_head,'',tableau_de_javascripts_a_convertir);
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
    }catch(e){
    }
    return({"__xst" : false ,"__xms" : 'le html dans php n\'est pas convertible'});
}
/*
  =====================================================================================================================
*/
function traiter_html_dans_php2(options){
    if(globale_tableau_des_php2.length === 0){
        if(globale_tableau_des_js2.length === 0){
            console.log('terminé');
        }else{
            console.log('todo');
        }
    }
    var zone_rev=null;
    if(options && options.hasOwnProperty('zone_rev')){
        zone_rev=options.zone_rev;
    }
    var zone_php=null;
    if(options && options.hasOwnProperty('zone_php')){
        zone_php=options.zone_php;
    }
    var en_ligne=null;
    if(options && options.hasOwnProperty('en_ligne') && options.en_ligne === true){
        en_ligne=true;
    }
    var a_convertir=globale_tableau_des_php2[0];
    for( var i=0 ; i < globale_tableau_des_php2.length ; i++ ){
        var obj = transforme_html_de_php_en_rev(globale_tableau_des_php2[i].valeur,0,options);
        if(obj.__xst === true){
            var chaine_a_remplacer = '#(cle_html_dans_php_a_remplacer,' + globale_tableau_des_php2[i].cle + ')';
            globale_source_php2=globale_source_php2.replace(chaine_a_remplacer,obj.__xva);
        }else{
            return(logerreur({"__xst" : false ,"__xme" : '3052 erreur dans la convertion de html dans php'}));
        }
    }
    if(zone_rev){
        document.getElementById(zone_rev).value=globale_source_php2;
    }
    function fin_traitement_php(zone_rev,globale_source_php2){
        globale_tableau_des_js2=[];
        if(zone_rev){
            var tableau1 = iterateCharacters2(globale_source_php2);
            var matriceFonction = functionToArray2(tableau1.out,true,false,'');
            if(matriceFonction.__xst === true){
                var obj2 = arrayToFunct1(matriceFonction.__xva,true);
                if(obj2.__xst === true){
                    document.getElementById(zone_rev).value=obj2.__xva;
                    globale_source_php2='';
                    return(logerreur({"__xst" : true}));
                }else{
                    document.getElementById(zone_rev).value=globale_source_php2;
                    globale_source_php2='';
                    return(logerreur({"__xst" : true ,"__xva" : '3079 erreur de formattage de rev'}));
                }
            }else{
                document.getElementById(zone_rev).value=globale_source_php2;
                globale_source_php2='';
                return(logerreur({"__xst" : true ,"__xva" : '3083 erreur mise en matrice'}));
            }
        }
        if(en_ligne === true){
            sauvegarder_php_en_ligne(globale_source_php2,options.donnees);
            globale_source_php2='';
            return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
        }else{
            globale_source_php2='';
            return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
        }
    }
    if(globale_tableau_des_js2.length > 0){
        var parseur_javascript=window.acorn.Parser;
        for( var i=0 ; i < globale_tableau_des_js2.length ; i++ ){
            try{
                var tableau_des_commentaires_js=[];
                var obj = parseur_javascript.parse(globale_tableau_des_js2[i].__xva,{"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : true ,"onComment" : tableau_des_commentaires_js});
            }catch(e){
                globale_tableau_des_js2=[];
                return(logerreur({"__xst" : false ,"__xme" : '3770 il y a un problème dans un source javascript dans le php'}));
            }
            var phrase_a_remplacer = '#(cle_javascript_a_remplacer,' + globale_tableau_des_js2[i].cle + ')';
            if(obj === '' || obj.hasOwnProperty('body') && Array.isArray(obj.body) && obj.body.length === 0){
                globale_source_php2=globale_source_php2.replace(phrase_a_remplacer,'');
            }else{
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
                var obj0 = __module_js_parseur1.traite_ast(obj.body,tableau_des_commentaires_js,{});
                if(obj0.__xst === true){
                    debugger
                    globale_source_php2=globale_source_php2.replace(phrase_a_remplacer,obj0.__xva);
                }else{
                    globale_tableau_des_js2=[];
                    return(logerreur({"__xst" : true ,"__xme" : '3154 le source a été converti en rev'}));
                }
            }
        }
        return(fin_traitement_php(zone_rev,globale_source_php2));
    }else{
        return(fin_traitement_php(zone_rev,globale_source_php2));
    }
}
/*
  =====================================================================================================================
*/
var globale_tableau_des_php2=[];
var globale_source_php2='';
var globale_tableau_des_js2=[];
/*
  =====================================================================================================================
*/
function traitement_apres_recuperation_ast_de_php2(retour_avec_ast){
    var ast = JSON.parse(retour_avec_ast.__xva);
    var options={"nettoyer_html" : false};
    if(retour_avec_ast.hasOwnProperty('__entree') && retour_avec_ast.__entree.hasOwnProperty('opt')){
        options=retour_avec_ast.__entree.opt;
        if(retour_avec_ast.__entree.opt.hasOwnProperty('options_traitement')){
            if(retour_avec_ast.__entree.opt.options_traitement.hasOwnProperty('nettoyer_html')){
                options.nettoyer_html=retour_avec_ast.__entree.opt.options_traitement.nettoyer_html;
            }
        }else if(retour_avec_ast.__entree.opt.hasOwnProperty('nettoyer_html')){
            options.nettoyer_html=retour_avec_ast.__entree.opt.nettoyer_html;
        }else if(retour_avec_ast.__entree.opt.hasOwnProperty('zone_rev')){
            options.nettoyer_html=retour_avec_ast.__entree.opt.zone_rev;
        }else if(retour_avec_ast.__entree.opt.hasOwnProperty('zone_php')){
            options.nettoyer_html=retour_avec_ast.__entree.opt.zone_php;
        }
    }
    var obj = TransformAstPhpEnRev(ast,0,null,false,true,options);
    var zone_rev=null;
    var zone_php=null;
    if(options.hasOwnProperty('zone_rev')){
        zone_rev=options.zone_rev;
    }
    if(options.hasOwnProperty('zone_php')){
        zone_php=options.zone_php;
    }
    var en_ligne=null;
    if(options.hasOwnProperty('en_ligne') && options.en_ligne === true){
        en_ligne=true;
    }
    if(obj.__xst === true){
        if(obj.hasOwnProperty('tableau_de_html_dans_php_a_convertir') && obj.tableau_de_html_dans_php_a_convertir.length > 0){
            /*
              il y a du html dans ce php, on le traite et on le remplace 
            */
            try{
                if(zone_rev !== null){
                    document.getElementById(zone_rev).value=obj.__xva;
                }
                globale_tableau_des_php2=obj.tableau_de_html_dans_php_a_convertir;
                globale_source_php2=obj.__xva;
                var obj = traiter_html_dans_php2(options);
                if(obj.status === true){
                    if(zone_rev !== null){
                        __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_rev);
                    }
                    return({"__xst" : true});
                }else{
                    if(zone_php !== null){
                        __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_php);
                    }
                }
            }catch(e){
                console.error('e=',e);
            }
        }else{
            if(en_ligne === true){
                sauvegarder_php_en_ligne('php(' + obj.__xva + ')',options.donnees);
                __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_rev);
            }else{
                __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_rev);
                var tableau1 = iterateCharacters2('php(' + obj.__xva + ')');
                var matriceFonction = functionToArray2(tableau1.out,true,false,'');
                if(matriceFonction.__xst === true){
                    var obj2 = arrayToFunct1(matriceFonction.__xva,true);
                    if(obj2.__xst === true){
                        if(zone_rev !== null){
                            document.getElementById(zone_rev).value=obj2.__xva;
                            logerreur({"__xst" : true ,"__xme" : 'le fichier rev a été produit sans erreurs'});
                            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_php);
                        }
                    }else{
                        if(zone_rev !== null){
                            document.getElementById(zone_rev).value='php(' + obj.__xva + ')';
                        }
                    }
                }else{
                    if(zone_rev !== null){
                        document.getElementById(zone_rev).value='php(' + obj.__xva + ')';
                    }
                }
            }
        }
        return({"__xst" : true});
    }else{
        logerreur({"__xst" : false ,"__xme" : 'il y a eu une erreur de conversion du programme php'});
        if(zone_php !== null){
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_php);
        }
        if(options.hasOwnProperty('en_ligne') && options.en_ligne === true){
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',zone_php);
        }
        return({"__xst" : false});
    }
}
/*
  =====================================================================================================================
*/
function recupereAstDePhp2(texteSource,opt,f_traitement_apres_recuperation_ast_de_php2){
    var ajax_param={"call" : {"lib" : 'php' ,"file" : 'ast' ,"funct" : 'recupererAstDePhp' ,"opt" : {"masquer_les_messages_du_serveur" : false}} ,"texteSource" : texteSource ,"opt" : opt};
    var r = new XMLHttpRequest();
    r.onerror=function(e){
        console.error('e=',e);
        return({"__xst" : false});
    };
    try{
        r.open("POST",'za_ajax.php?recupererAstDePhp',true);
        r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        r.onreadystatechange=function(){
            if(r.readyState != 4 || r.status != 200){
                if(r.status === 404){
                    logerreur({"__xst" : false ,"__xme" : ' === <b>Vérifiez l\'url de l\'appel synchrone </b> === , conv js 3131 url non trouvée '});
                    return({"__xst" : false ,"__xme" : 'conv js 3131url non trouvée '});
                }else{
                    return;
                }
                if(r.readyState === 2){
                    debugger;
                }
            }
            try{
                var json_retour = JSON.parse(r.responseText);
                if(json_retour.__xst === true){
                    var obj = traitement_apres_recuperation_ast_de_php2(json_retour);
                    return({"__xst" : obj.__xst});
                }else{
                    for(var elem in json_retour.__xms){
                        if(json_retour.__xms[elem].indexOf('on line ') >= 0
                         && isNumeric(json_retour.__xms[elem].substr(json_retour.__xms[elem].indexOf('on line ') + 8))
                        ){
                            var line = parseInt(json_retour.__xms[elem].substr(json_retour.__xms[elem].indexOf('on line ') + 8),10);
                            astphp_logerreur({"__xst" : false ,"line" : line});
                        }
                        astphp_logerreur({"__xst" : false ,"__xme" : json_retour.__xms[elem]});
                    }
                    if(json_retour.hasOwnProperty('__entree') && json_retour.__entree.hasOwnProperty('opt')){
                        if(json_retour.__entree.opt.hasOwnProperty('zone_php') && json_retour.__entree.opt.zone_php !== null){
                            __gi1.remplir_et_afficher_les_messages1('zone_global_messages',json_retour.__entree.opt.zone_php);
                            return({"__xst" : false});
                        }else{
                            if(json_retour.__entree.opt.hasOwnProperty('en_ligne') && json_retour.__entree.opt.en_ligne === true){
                                __gi1.remplir_et_afficher_les_messages1('zone_global_messages');
                                return({"__xst" : false});
                            }else{
                                debugger;
                            }
                        }
                    }
                    return({"__xst" : false ,"__xme" : 'erreur json'});
                }
            }catch(e){
                console.error('e=',e);
                return({"__xst" : false ,"__xme" : ' conv js message=' + e.message});
            }
        };
        r.send('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param)));
    }catch(e){
        console.error('e=',e);
        logerreur({"__xst" : false ,"__xme" : ' conv js 3127  message=' + e.message});
        return({"__xst" : false ,"__xme" : ' conv js message=' + e.message});
    }
    return({"__xst" : true});
}