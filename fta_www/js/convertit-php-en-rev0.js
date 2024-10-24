
"use strict";
/*
  
  todo
  $c=$a<=>$b; // echo "a" <=> "b"; // -1 , ,,,, echo "a" <=> "a"; // 0 ,,,,, echo "b" <=> "a"; // 1
  $c=$a ** $b
  $a= $b|$c;
  $a= $b&$c;
  $c=$a ^ $b;
  $c=~$a;
  $c=$a << $b;
  $c=$a >> $b;
  
  $output = `ls -al`; // Utiliser les guillemets obliques revient à utiliser la fonction shell_exec().
  echo "<pre>$output</pre>";
  
  class MaClasse{}; class PasMaClasse{}; $a = new MaClasse; var_dump($a instanceof MaClasse); var_dump($a instanceof PasMaClasse);
  
  
*/
var rangeErreurSelectionne=false;
function astphp_logerreur(o){
    logerreur(o);
    if(rangeErreurSelectionne === false){
        if((o.element) && (o.element.hasOwnProperty('attributes')) && (o.element.attributes.hasOwnProperty('startTokenPos')) && (o.element.attributes.hasOwnProperty('endTokenPos'))){
            rangeErreurSelectionne=true;
            global_messages['ranges'].push([o.element.attributes.startFilePos,o.element.attributes.endFilePos]);
        }
    }
    return o;
}
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
    }else if(s === '&'){
        return 'etBin';
    }else{
        astphp_logerreur({'status':false,'message':'0079  erreur recupNomOperateur "' + s + '" ',element:element});
    }
}
function php_traite_Expr_Eval(element,niveau){
    var t='';
    t+='appelf(';
    t+='nomf(eval)';
    var obj = php_traite_Stmt_Expression(element.expr,false,element);
    if(obj.status === true){
        t+=',p(' + obj.value + ')';
    }else{
        return(astphp_logerreur({'status':false,'message':'0094  erreur php_traite_Expr_Eval',element:element}));
    }
    t+=')';
    return({'status':true,'value':t});
}
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
    if(obj.status === true){
        t+=',p(' + obj.value + ')';
    }else{
        return(astphp_logerreur({'status':false,'message':'0118  erreur php_traite_Expr_Include',element:element}));
    }
    t+=')';
    return({'status':true,'value':t});
}
function php_traite_Stmt_Switch(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var leTest='';
    var tabSw = [];
    if(element.cond){
        var obj = php_traite_Stmt_Expression(element.cond,niveau,false,element);
        if(obj.status === true){
            leTest=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'0140  erreur php_traite_Stmt_Switch',element:element}));
        }
    }else{
        return(astphp_logerreur({'status':false,'message':'0145  erreur php_traite_Stmt_Switch',element:element}));
    }
    if(element.cases){
        if(element.cases.length > 0){
            var i=0;
            for(i=0;i < element.cases.length;i++){
                var leSw=element.cases[i];
                var laCondition='';
                if(leSw.cond){
                    var obj = php_traite_Stmt_Expression(leSw.cond,niveau,false,element);
                    if(obj.status === true){
                        laCondition=obj.value;
                    }else{
                        return(astphp_logerreur({'status':false,'message':'0160  erreur php_traite_Stmt_Switch',element:element}));
                    }
                }else{
                    laCondition=null;
                }
                var lesInstructions='';
                if(leSw.stmts){
                    if(leSw.stmts.length > 0){
                        niveau+=3;
                        var obj1 = TransformAstPhpEnRev(leSw.stmts,niveau,false);
                        niveau-=3;
                        if(obj1.status === true){
                            lesInstructions=obj1.value;
                        }else{
                            return(astphp_logerreur({'status':false,'message':'0175  erreur php_traite_Stmt_TryCatch',element:element}));
                        }
                    }
                }
                tabSw.push([laCondition,lesInstructions]);
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'0182  erreur php_traite_Stmt_Switch',element:element}));
        }
    }else{
        return(astphp_logerreur({'status':false,'message':'0185  erreur php_traite_Stmt_Switch',element:element}));
    }
    t+='\n' + esp0 + 'bascule(';
    t+='\n' + esp0 + esp1 + 'quand(' + leTest + ')';
    var i=0;
    for(i=0;i < tabSw.length;i++){
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
    return({'status':true,'value':t});
}
function php_traite_Stmt_TryCatch(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var contenu='';
    if((element.stmts) && (element.stmts.length > 0)){
        niveau+=2;
        var obj = TransformAstPhpEnRev(element.stmts,niveau,false);
        niveau-=2;
        if(obj.status === true){
            contenu+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'0220  erreur php_traite_Stmt_TryCatch',element:element}));
        }
    }
    t+='\n' + esp0 + 'essayer(';
    t+='\n' + esp0 + esp1 + 'faire(\n';
    t+=contenu;
    t+='\n' + esp0 + esp1 + '),';
    if((element.catches) && (element.catches.length > 0)){
        var numc=0;
        for(numc=0;numc < element.catches.length;numc++){
            contenu='';
            var lesTypesErreurs='';
            if((element.catches[numc].types) && (element.catches[numc].types.length > 0)){
                var i=0;
                for(i=0;i < element.catches[numc].types.length;i++){
                    if(element.catches[numc].types[i].nodeType === 'Name'){
                        lesTypesErreurs+=element.catches[numc].types[i].name + ' ';
                    }
                }
            }else{
                return(astphp_logerreur({'status':false,'message':'0242  erreur php_traite_Stmt_TryCatch',element:element}));
            }
            var leNomErreur='';
            if((element.catches[numc].var) && (element.catches[numc].var.nodeType === "Expr_Variable")){
                leNomErreur='$' + element.catches[numc].var.name;
            }else{
                return(astphp_logerreur({'status':false,'message':'0249  erreur php_traite_Stmt_TryCatch',element:element}));
            }
            if((element.catches[numc].stmts) && (element.catches[numc].stmts.length > 0)){
                niveau+=3;
                var obj = TransformAstPhpEnRev(element.catches[numc].stmts,niveau,false);
                niveau-=3;
                if(obj.status === true){
                    contenu+=obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'0259  erreur php_traite_Stmt_TryCatch',element:element}));
                }
            }
            t+='\n' + esp0 + esp1 + 'sierreur(';
            t+='\n' + esp0 + esp1 + esp1 + 'err(' + lesTypesErreurs + ',' + leNomErreur + ')';
            t+='\n' + esp0 + esp1 + esp1 + 'faire(\n';
            t+=contenu;
            t+='\n' + esp0 + esp1 + esp1 + ')';
            t+='\n' + esp0 + esp1 + ')';
        }
    }
    t+='\n' + esp0 + ')';
    return({'status':true,'value':t});
}
function php_traite_Stmt_Use(element,niveau){
    var t='';
    var i=0;
    for(i=0;i < element.uses.length;i++){
        if("UseItem" === element.uses[i].nodeType){
            if(element.uses[i].name.nodeType === "Name"){
                t+='appelf(nomf(use),p(\'' + element.uses[i].name.name.replace(/\\/g,'\\\\') + '\'))';
            }else{
                return(astphp_logerreur({'status':false,'message':'0259  erreur php_traite_Stmt_Use',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'0294  erreur php_traite_Stmt_Use',element:element}));
        }
    }
    return({'status':true,'value':t});
}
function php_traite_Expr_Isset(element,niveau){
    var t='';
    var nomFonction='isset';
    var lesArguments='';
    if((element.vars) && (element.vars.length > 0)){
        var i=0;
        for(i=0;i < element.vars.length;i++){
            var obj = php_traite_Stmt_Expression(element.vars[i],niveau,false,element);
            if(obj.status === true){
                lesArguments+=',p(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'0314  erreur php_traite_Expr_Isset',element:element}));
            }
        }
    }
    t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
    return({'status':true,'value':t});
}
/*
  =======================
*/
function php_traite_Expr_Unset(element,niveau){
    var t='';
    var nomFonction='unset';
    var lesArguments='';
    if((element.vars) && (element.vars.length > 0)){
        var i=0;
        for(i=0;i < element.vars.length;i++){
            var obj = php_traite_Stmt_Expression(element.vars[i],niveau,false,element);
            if(obj.status === true){
                lesArguments+=',p(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'0388  erreur php_traite_Expr_Isset',element:element}));
            }
        }
    }
    t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
    return({'status':true,'value':t});
}
/*
  =======================
*/
function php_traite_Expr_FuncCall(element,niveau){
    var t='';
    var nomFonction='';
    if(element.name){
        if(element.name.nodeType === 'Name'){
            nomFonction=element.name.name;
        }else if(element.name.nodeType === "Expr_ArrayDimFetch"){
            var obj = php_traite_Expr_ArrayDimFetch(element.name,niveau,0);
            if(obj.status === true){
                nomFonction=obj.value;
            }else{
                return(astphp_logerreur({'status':false,'message':'0359  erreur php_traite_Expr_FuncCall',element:element}));
            }
        }else if("Identifier" === element.name.nodeType){
            nomFonction=element.name.name;

        }else if(element.name.nodeType === "Expr_Variable"){
            nomFonction='$'+element.name.name;
            
        }else{
            return(astphp_logerreur({'status':false,'message':'0364  erreur php_traite_Expr_FuncCall',element:element}));
        }
    }else{
        return(astphp_logerreur({'status':false,'message':'0367  erreur php_traite_Expr_FuncCall',element:element}));
    }
    var lesArgumentsCourts='';
    var lesArguments='';
    var tabArgs = [];
    if((element.args) && (element.args.length > 0)){
        var i=0;
        for(i=0;i < element.args.length;i++){
            var obj = php_traite_Stmt_Expression(element.args[i],niveau,false,element);
            if(obj.status === true){
                lesArguments+=',p(' + obj.value + ')';
                tabArgs.push([obj.value,element.args[i].value.nodeType]);
                lesArgumentsCourts+=',' + obj.value;
            }else{
                t+='#(todo dans php_traite_Expr_FuncCall 0175 pas de expr )';
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
        var source = lesArgumentsCourts.substr(1,(lesArgumentsCourts.length - 2));
        var source = source.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');

        var obj=convertion_texte_sql_en_rev(source);
        if(obj.status === true){
            t+='sql(' + obj.value + ')';
        }else{
            t+='#(erreur convertit-php-en-rev pour sql_dans_php 0373)';
        }

        
    }else if('htmlDansPhp' === nomFonction){
        if(lesArgumentsCourts.substr(0,1) === ','){
            lesArgumentsCourts=lesArgumentsCourts.substr(1);
        }
        var source = lesArgumentsCourts.substr(1,(lesArgumentsCourts.length - 2));
        var source = source.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
        var obj = __module_html1.TransformHtmlEnRev(source,0);
        if(obj.status === true){
            t+='html(' + obj.value + ')';
        }else{
            t+='#(erreur convertit-php-en-rev pour htmlDansPhp 0373)';
        }
    }else if('concat' === nomFonction){
        if(lesArgumentsCourts.substr(0,1) === ','){
            lesArgumentsCourts=lesArgumentsCourts.substr(1);
        }
        t+='' + nomFonction + '(' + lesArgumentsCourts + ')';
    }else{
        if((element.class) && ("Expr_StaticCall" === element.nodeType) && (element.class.nodeType === 'Name')){
            t+='appelf(element(' + element.class.name + '::),nomf(' + nomFonction + ')' + lesArguments + ')';
        }else{
            t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
        }
    }
    return({'status':true,'value':t});
}
/*=====================================================================================================================*/
function php_traite_printOuEcho(element,niveau,nomFonction){
    var t='';
    var lesArguments='';
    if(element.exprs){
        var i=0;
        for(i=0;i < element.exprs.length;i++){
            var obj = php_traite_Stmt_Expression(element.exprs[i],niveau,false,element);
            if(obj.status === true){
                lesArguments+=',p(' + obj.value + ')';
            }else{
                t+='#(todo dans php_traite_printOuEcho 0454 )';
            }
        }
    }
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.status === true){
            lesArguments+=',p(' + obj.value + ')';
        }else{
            t+='#(todo dans php_traite_printOuEcho 0464 )';
        }
    }
    t+='appelf(nomf(' + nomFonction + ')' + lesArguments + ')';
    /*un point virgule est-il en trop ?*/
    return({'status':true,'value':t});
}
/*=====================================================================================================================*/
function php_traite_print(element,niveau){
    return(php_traite_printOuEcho(element,niveau,'print'));
}
/*=====================================================================================================================*/
function php_traite_echo(element,niveau){
    return(php_traite_printOuEcho(element,niveau,'echo'));
}
/*
  =====================================================================================================================
*/
function php_traite_Stmt_ClassMethod(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var lesArguments='';
    var contenu='';
    t+='\n' + esp0 + 'méthode(';
    t+='\n' + esp0 + esp1 + 'definition(';
    if((element.name) && ("Identifier" === element.name.nodeType)){
        t+='\n' + esp0 + esp1 + esp1 + 'nomm(' + element.name.name + ')';
    }else{
        return(astphp_logerreur({'status':false,'message':'0464  erreur php_traite_Stmt_ClassMethod ',element:element}));
    }
    if((element.params) && (element.params.length > 0)){
        var i=0;
        for(i=0;i < element.params.length;i++){
            if((element.params[i].var) && ("Expr_Variable" === element.params[i].var.nodeType)){
                if((element.params[i].byRef) && (element.params[i].byRef === true)){
                    lesArguments+=',\n' + esp0 + esp1 + esp1 + 'adresseArgument($' + element.params[i].var.name 
                    if(element.params[i].default){
                        var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.status === true){
                            lesArguments+=',defaut(' + obj.value + ')';
                        }else{
                            return(astphp_logerreur({'status':false,'message':'0487  erreur php_traite_Stmt_ClassMethod ',element:element}));
                        }
                    }
                    lesArguments+=')';
                }else{
                    if((element.params[i].variadic) && (element.params[i].variadic === true)){
                        lesArguments+=',\n' + esp0 + esp1 + esp1 + 'argument(...$' + element.params[i].var.name;
                    }else{
                        lesArguments+=',\n' + esp0 + esp1 + esp1 + 'argument($' + element.params[i].var.name;
                    }
                    if(element.params[i].default){
                        var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.status === true){
                            lesArguments+=',defaut(' + obj.value + ')';
                        }else{
                            return(astphp_logerreur({'status':false,'message':'0487  erreur php_traite_Stmt_ClassMethod ',element:element}));
                        }
                    }
                    lesArguments+=')';
                }
            }else{
                return(astphp_logerreur({'status':false,'message':'0493  erreur php_traite_Stmt_ClassMethod ',element:element}));
            }
        }
    }
    t+=lesArguments;
    if(element.flags === 12){
        t+='\n' + esp0 + esp1 + esp1 + 'privée(),';
        t+='\n' + esp0 + esp1 + esp1 + 'statique(),';
    }else if(element.flags === 9){
        t+='\n' + esp0 + esp1 + esp1 + 'publique(),';
        t+='\n' + esp0 + esp1 + esp1 + 'statique(),';
    }else if(element.flags === 4){
        t+='\n' + esp0 + esp1 + esp1 + 'privée(),';
    }else if(element.flags === 1){
        t+='\n' + esp0 + esp1 + esp1 + 'publique(),';
    }else if(element.flags === 0){
    }else{
        return(astphp_logerreur({'status':false,'message':'0507  erreur php_traite_Stmt_ClassMethod ',element:element}));
    }
    t+='\n' + esp0 + esp1 + '),';
    if((element.stmts) && (element.stmts.length > 0)){
        var obj = TransformAstPhpEnRev(element.stmts,(niveau + 2),false);
        if(obj.status === true){
            contenu+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'0514  erreur php_traite_Stmt_ClassMethod ',element:element}));
        }
    }
    t+='\n' + esp0 + esp1 + 'contenu(' + contenu + ')';
    t+='\n' + esp0 + ')';
    return({'status':true,'value':t});
}
function php_traite_Stmt_Function(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomFonction='';
    var lesArguments='';
    var contenu='';
    if((element.name) && (element.name.nodeType === "Identifier")){
        nomFonction=element.name.name;
    }else{
        nomFonction='#(todo erreur dans php_traite_Stmt_Function 0261 )';
    }
    if((element.params) && (element.params.length > 0)){
        var i=0;
        for(i=0;i < element.params.length;i++){
            if((element.params[i].var) && ("Expr_Variable" === element.params[i].var.nodeType)){
                if((element.params[i].byRef) && (element.params[i].byRef === true)){
                    lesArguments+=',\n' + esp0 + esp1 + esp1 + 'adresseArgument($' + element.params[i].var.name ;
                    if(element.params[i].default){
                        var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.status === true){
                            lesArguments+=',defaut(' + obj.value + ')';
                        }else{
                            t+='#(todo dans php_traite_Stmt_Function 0494 pas de expr )';
                        }
                    }
                    lesArguments+=')';
                }else{
                    if((element.params[i].variadic) && (element.params[i].variadic === true)){
                        lesArguments+=',\n' + esp0 + esp1 + esp1 + 'argument(...$' + element.params[i].var.name;
                    }else{
                        lesArguments+=',\n' + esp0 + esp1 + esp1 + 'argument($' + element.params[i].var.name;
                    }
                    if(element.params[i].default){
                        var obj = php_traite_Stmt_Expression(element.params[i].default,niveau,false,element);
                        if(obj.status === true){
                            lesArguments+=',defaut(' + obj.value + ')';
                        }else{
                            t+='#(todo dans php_traite_Stmt_Function 0494 pas de expr )';
                        }
                    }
                    lesArguments+=')';
                }
            }else{
                lesArguments+='#(TODO 0278 dans php_traite_Stmt_Function)';
            }
        }
    }
    if((element.stmts) && (element.stmts.length > 0)){
        niveau+=2;
        var obj = TransformAstPhpEnRev(element.stmts,niveau,false);
        niveau-=2;
        if(obj.status === true){
            contenu+=obj.value;
        }else{
            contenu+='#(erreur php_traite_Stmt_Function 0288)';
        }
    }
    t+='\n' + esp0 + 'fonction(';
    t+='\n' + esp0 + esp1 + 'definition(';
    t+='\n' + esp0 + esp1 + esp1 + 'nom(' + nomFonction + ')';
    t+=lesArguments;
    t+='\n' + esp0 + esp1 + '),';
    t+='\n' + esp0 + esp1 + 'contenu(\n';
    t+=contenu;
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
  traite un "new"
*/
function php_traite_Expr_New(element,niveau){
    var t='';
    if(element.class){
        var nomClasse='';
        if(element.class.nodeType === "Name"){
            nomClasse=element.class.name;
        }else{
            nomClasse+='#(php_traite_Expr_New 0597),';
        }
        var lesArgumentsDeLaClass='';
        if(element.args){
            var i=0;
            for(i=0;i < element.args.length;i++){
                var obj = php_traite_Stmt_Expression(element.args[i],niveau,false,element);
                if(obj.status === true){
                    lesArgumentsDeLaClass+=',p(' + obj.value + ')';
                }else{
                    t+='#(todo dans php_traite_Expr_New 0497)';
                }
            }
        }
        t+='nouveau(appelf(nomf(' + nomClasse + ')' + lesArgumentsDeLaClass + ')),';
    }else{
        t+='nouveau(#(php_traite_Expr_New 0506)),';
    }
    return({'status':true,'value':t});
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
        if(obj.status === true){
            lelement+=',element(' + obj.value + ')';
        }else{
            return(astphp_logerreur({'status':false,'message':'0583  erreur php_traite_Expr_MethodCall ',element:element}));
        }
    }else{
        return(astphp_logerreur({'status':false,'message':'0587  erreur php_traite_Expr_MethodCall ',element:element}));
    }
    if(element.name){
        if(element.name.nodeType === "Identifier"){
            nomFonction=element.name.name;
        }else{
            nomFonction+='element(#(php_traite_Expr_MethodCall 0345)),';
        }
    }else{
        nomFonction+='element(#(php_traite_Expr_MethodCall 0345)),';
    }
    var lesArguments='';
    if((element.args) && (element.args.length > 0)){
        var i=0;
        for(i=0;i < element.args.length;i++){
            var obj = php_traite_Stmt_Expression(element.args[i],niveau,false,element);
            if(obj.status === true){
                lesArguments+=',p(' + obj.value + ')';
            }else{
                t+='#(todo dans php_traite_Expr_MethodCall 0360 pas de expr )';
            }
        }
    }
    t+='appelf(' + lelement + 'nomf(' + nomFonction + ')' + lesArguments + ')';
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_AssignOp_General(element,niveau,nodeType){
    var operation='';
    if("Expr_AssignOp_Concat" === nodeType){
        operation='concat';
    }else if("Expr_AssignOp_Plus" === nodeType){
        operation='plus';
    }else if("Expr_AssignOp_BitwiseOr" === nodeType){
        operation='ou_binaire';
    }else if("Expr_AssignOp_Minus" === nodeType){
        operation='moins';
    }else{
        return(astphp_logerreur({'status':false,'message':'0706  php_traite_Expr_AssignOp_General "' + nodeType + '"',element:element}));
    }
    var t='';
    var gauche='';
    if(element.var){
        var obj = php_traite_Stmt_Expression(element.var,niveau,false,element);
        if(obj.status === true){
            gauche+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'0716  php_traite_Expr_AssignOp_General ',element:element}));
        }
    }else{
        return(astphp_logerreur({'status':false,'message':'0720  php_traite_Expr_AssignOp_General ',element:element}));
    }
    var droite='';
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.status === true){
            droite+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'0729  php_traite_Expr_AssignOp_General ',element:element}));
        }
    }else{
        return(astphp_logerreur({'status':false,'message':'0732  php_traite_Expr_AssignOp_General ',element:element}));
    }
    t+='affecte(' + gauche + ' , ' + operation + '( ' + gauche + ' , ' + droite + ' ))';
    if(droite.substr(0,(operation.length + 1)) === (operation + '(')){
        var o1 = functionToArray2(droite,false,true,'');
        if(o1.status === true){
            var o2 = functionToArray2(gauche,false,true,'');
            if(o2.status === true){
                var i = (o2.value.length - 1);
                for(i=o2.value.length - 1;i >= 1;i--){
                    o1.value.splice(2,0,o2.value[i]);
                    o1.value[2][3]=o1.value[2][3] + 1;
                    o1.value[2][0]=o1.value[2][0] + 1;
                }
                var i = (1 + o2.value.length);
                for(i=1 + o2.value.length;i < o1.value.length;i++){
                    o1.value[i][0]=((o1.value[i][0] + o2.value.length)) - 1;
                }
                var nouveauTableau = reIndicerLeTableau(o1.value);
                var obj = a2F1(nouveauTableau,0,true,1,false);
                if(obj.status === true){
                    t='affecte(' + gauche + ' , ' + obj.value + ' )';
                }
            }
        }
    }
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_AssignRef(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var gauche='';
    var droite='';
    if(element.var){
        var obj = php_traite_Stmt_Expression(element.var,niveau,false,element);
        if(obj.status === true){
            gauche=obj.value;
        }else{
            gauche='#(todo erreur dans php_traite_Expr_Assign 0715 pas de expr ' + element.var.nodeType + ')';
        }
    }else{
        gauche='#(todo dans php_traite_Expr_Assign 0718 pas de variable ' + element.nodeType + ')';
    }
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.status === true){
            droite=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'0733  erreur dans une assignation ',element:element}));
        }
    }else{
        droite='#(todo dans php_traite_Expr_Assign 0729 pas de expr ' + element.nodeType + ')';
    }
    t+='affecte_reference(' + gauche + ' , ' + droite + ')';
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_Assign(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var gauche='';
    var droite='';
    if(element.var){
        var obj = php_traite_Stmt_Expression(element.var,niveau,false,element);
        if(obj.status === true){
            gauche=obj.value;
        }else{
            gauche='#(todo erreur dans php_traite_Expr_Assign 0715 pas de expr ' + element.var.nodeType + ')';
        }
    }else{
        gauche='#(todo dans php_traite_Expr_Assign 0718 pas de variable ' + element.nodeType + ')';
    }
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.status === true){
            droite=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'0733  erreur dans une assignation ',element:element}));
        }
    }else{
        droite='#(todo dans php_traite_Expr_Assign 0729 pas de expr ' + element.nodeType + ')';
    }
    t+='affecte(' + gauche + ' , ' + droite + ')';
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_ArrayDimFetch(element,niveau,num){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomTableau='';
    if(element.var){
        if("Expr_Variable" === element.var.nodeType){
            t='nomt($' + element.var.name + ')';
        }else if("Expr_ArrayDimFetch" === element.var.nodeType){
            var obj = php_traite_Expr_ArrayDimFetch(element.var,niveau,(num + 1));
            if(obj.status === true){
                t+=obj.value;
            }else{
                return(astphp_logerreur({'status':false,'message':'0860 php_traite_Expr_ArrayDimFetch ',element:element}));
            }
        }else{
            var obj = php_traite_Stmt_Expression(element.var,niveau,true,element);
            if(obj.status === true){
                t+='nomt(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'0870 php_traite_Expr_ArrayDimFetch ',element:element}));
            }
        }
    }
    if(element.dim){
        var obj = php_traite_Stmt_Expression(element.dim,niveau,false,element);
        if(obj.status === true){
            t+=',p(' + obj.value + ')';
        }else{
            return(astphp_logerreur({'status':false,'message':'0881 php_traite_Expr_ArrayDimFetch ',element:element}));
        }
    }else{
        t+=',p()';
    }
    if(num === 0){
        t='tableau(' + t + ')';
    }
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
*/
function php_traite_Expr_List(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var lesElements='';
    if(element.items){
        var i=0;
        for(i=0;i < element.items.length;i++){
            if(null === element.items[i]){
                lesElements+='p()';
            }else if("ArrayItem" === element.items[i].nodeType){
                var cle='';
                if(element.items[i].value){
                    var objValeur = php_traite_Stmt_Expression(element.items[i].value,niveau,false,element);
                    if(objValeur.status === true){
                        if(lesElements !== ''){
                            lesElements+=' , ';
                        }
                        lesElements+='p(' + objValeur.value + ')';
                    }else{
                        lesElements='#(TODO ERREUR dans php_traite_Expr_List 0806)';
                    }
                }
            }else{
                lesElements+='#(todo dans php_traite_Expr_List 0811 ' + element.items[i].nodeType + ')';
            }
        }
    }
    t+='liste(' + lesElements + ')';
    return({'status':true,'value':t});
}
function php_traite_Expr_Array(element,niveau){

    var t='';
    var lesElements='';
    if(element.items){
        var i=0;
        for(i=0;i < element.items.length;i++){
            if("ArrayItem" === element.items[i].nodeType){
                var cle='';
                if(element.items[i].key){
                    var objcle = php_traite_Stmt_Expression(element.items[i].key,niveau,false,element);
                    if(objcle.status === true){
                        cle=objcle.value;
                    }else{
                        cle='#(TODO ERREUR dans php_traite_Expr_Array 0859)';
                    }
                }
                if(element.items[i].value){
                    var objValeur = php_traite_Stmt_Expression(element.items[i].value,niveau,false,element);
                    if(objValeur.status === true){
                        if(lesElements !== ''){
                            lesElements+=' , ';
                        }
                        if(element.items[i].attributes.hasOwnProperty('comments') && element.items[i].attributes.comments.length>0){
                          lesElements+=ajouteCommentairesAvant(element.items[i],niveau);
                        }
                        if(cle !== ''){
                            if((element.items[i].byRef) && (element.items[i].byRef === true)){
                                lesElements+='(' + cle + ' , &' + objValeur.value + ')';
                            }else{
                                lesElements+='(' + cle + ' , ' + objValeur.value + ')';
                            }
                        }else{
                            if((element.items[i].byRef) && (element.items[i].byRef === true)){
                                lesElements+='(&' + objValeur.value + ')';
                            }else{
                                lesElements+='(' + objValeur.value + ')';
                            }
                        }
                        cle=objValeur.value;
                    }else{
                        return(astphp_logerreur({'status':false,'message':'ERREUR dans php_traite_Expr_Array 869','element':element}));
                    }
                }
            }else{
                lesElements+='#(todo dans php_traite_Expr_Array 0852 ' + element.items[i].nodeType + ')';
            }
        }
    }
    t+='defTab(' + lesElements + ')';
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
function php_traite_Stmt_Expression(element,niveau,dansFor,parent){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    /*===============================================*/
    if("Scalar_Int" === element.nodeType){
        t+=element.value;
        /*===============================================*/
    }else if("Scalar_Float" === element.nodeType){
        t+=element.value;
        /*===============================================*/
    }else if("Expr_Variable" === element.nodeType){
        t+='$' + element.name + '';
        /*===============================================*/
    }else if("Stmt_Property" === element.nodeType){
        if((element.props) && (element.props.length > 0)){
            var i=0;
            for(i=0;i < element.props.length;i++){
                if(("PropertyItem" === element.props[i].nodeType) && (element.props[i].name) && (element.props[i].name.nodeType === "VarLikeIdentifier")){
                    if((element.flags) && (element.flags === 4)){
                        t+='variable_privée($' + element.props[i].name.name;
                    }else if((element.flags) && (element.flags === 2)){
                        t+='variable_protégée($' + element.props[i].name.name;
                    }else if((element.flags) && (element.flags === 1)){
                        t+='variable_publique($' + element.props[i].name.name;
                    }else if((element.flags) && (element.flags === 9)){
                        /*
                          public static $embedding_file = __FILE__;
                        */
                        t+='variable_publique_statique($' + element.props[i].name.name;
                    }else if((element.flags) && (element.flags === 12)){
                        /*
                          private static $_resources = array();
                        */
                        t+='variable_privée_statique($' + element.props[i].name.name;
                    }else{
                        return(astphp_logerreur({'status':false,'message':'1003 php_traite_Stmt_Expression Stmt_Property ',element:element}));
                    }
                    if(element.props[i].default){
                        var obj = php_traite_Stmt_Expression(element.props[i].default,niveau,true,element);
                        if(obj.status === true){
                            t+=',defaut(' + obj.value + '))';
                        }else{
                            return(astphp_logerreur({'status':false,'message':'1033 php_traite_Stmt_Expression Stmt_Property ',element:element}));
                        }
                    }else{
                        t+=')';
                    }
                }else{
                    return(astphp_logerreur({'status':false,'message':'0934 php_traite_Stmt_Expression Stmt_Property ',element:element}));
                }
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'0931 php_traite_Stmt_Expression Stmt_Property ',element:element}));
        }
        /*===============================================*/
    }else if("Scalar_String" === element.nodeType){
        if((element.attributes.rawValue.substr(0,1) === '\'') || (element.attributes.rawValue.substr(0,1) === '"')){
            /*
              en php, une chaine 'bla \ bla' avec un antislash au milieu est accepté 
              mais pour les fichiers rev, c'est pas excellent, 
              on accepte les \r \n \t \x \o , \" et \' \\ donc on fait une 
              petite analyse et on remonte une erreur si on n'est pas dans ces cas
            */
            var rv=element.attributes.rawValue;
            var l01 = (rv.length - 2);
            /*
              la chaine reçue dans le "raw" inclue le " ou les ' en début et fin 
              on les retire pour l'analyse, donc on part de l'avant dernier caractère 
              et on redescend jusqu'à l'indice 1
            */
            var nouvelle_chaine='';
            var i=l01;
            for(i=l01;i > 0;i--){
                if(rv.substr(i,1) === '\\'){
                    /* on remonte à partir du dernier caractère */
                    if(i === l01){
                        /* si le dernier caractère est un \ et que l'avant dernier est aussi un \, pas de problème */
                        if((rv.length > 2) && (l01 > 1) && (i > 1) && (rv.substr((i - 1),1) === '\\')){
                            nouvelle_chaine='\\\\';
                            i--;
                        }else{
                            /* position du \ en dernier */
                            return(astphp_logerreur({'status':false,'message':'0925  une chaine ne doit pas contenir un simple \\ en dernière position  ',element:element}));
                        }
                    }else{
                        if(i > 1){
                            /*
                              si on est avant le dernier caractère;
                            */
                            if(rv.substr((i - 1),1) === '\\'){
                                nouvelle_chaine='\\\\' + nouvelle_chaine;
                                i--;
                            }else{
                                if((rv.substr((i + 1),1) === 'r')
                                 || (rv.substr((i + 1),1) === 'n')
                                 || (rv.substr((i + 1),1) === 't')
                                 || (rv.substr((i + 1),1) === '\'')
                                 || (rv.substr((i + 1),1) === '.')
                                 || (rv.substr((i + 1),1) === '-')
                                 || (rv.substr((i + 1),1) === 'd')
                                 || (rv.substr((i + 1),1) === '/')
                                 || (rv.substr((i + 1),1) === 'x')
                                 || (rv.substr((i + 1),1) === 'o')
                                 || (rv.substr((i + 1),1) === 'b')
                                 || (rv.substr((i + 1),1) === '"')
                                 || (rv.substr((i + 1),1) === '$')
                                 || (rv.substr((i + 1),1) === 'w')
                                 || (rv.substr((i + 1),1) === 's')
                                 || (rv.substr((i + 1),1) === '(')
                                 || (rv.substr((i + 1),1) === ')')
                                 || (rv.substr((i + 1),1) === '[')
                                 || (rv.substr((i + 1),1) === ']')){
                                    if((rv.substr((i + 1),1) === 'r')
                                     || (rv.substr((i + 1),1) === 't')
                                     || (rv.substr((i + 1),1) === 'n')
                                     || ((rv.substr((i + 1),1) === '\'')
                                     && (rv.substr(0,1) === "'"))
                                     || ((rv.substr((i + 1),1) === '"')
                                     && (rv.substr(0,1) === '"'))){
                                        nouvelle_chaine='\\' + nouvelle_chaine;
                                    }else{
                                        nouvelle_chaine='\\\\' + nouvelle_chaine;
                                    }
                                }else{
                                    return(astphp_logerreur({'status':false,'message':'0958 après un backslash il ne peut y avoir que les caractères spéciaux et non pas "' + rv.substr((i + 1),1) + '" ',element:element}));
                                }
                            }
                        }else{
                            /*
                              si on est au premier caractère;
                            */
                            if(rv.substr(i,1) === '\\'){
                                var c = nouvelle_chaine.substr(0,1);
                                if((c === '.')
                                 || (c === '-')
                                 || (c === 'd')
                                 || (c === '/')
                                 || (c === 'x')
                                 || (c === 'o')
                                 || (c === 'b')
                                 || (c === 's')
                                 || (c === '\\')
                                 || (c === ']')
                                 || (c === '[')
                                 || (c === '$')
                                 || ((c === '"')
                                 && (rv.substr(0,1) === '\''))){
                                    nouvelle_chaine='\\\\' + nouvelle_chaine;
                                }else if((c === 'r')
                                 || (c === 'n')
                                 || (c === 't')
                                 || ((c === '\'')
                                 && (rv.substr(0,1) === '\''))
                                 || ((c === '"')
                                 && (rv.substr(0,1) === '"'))){
                                    nouvelle_chaine='\\' + nouvelle_chaine;
                                }else{
                                    return(astphp_logerreur({'status':false,'message':'0930 après un backslash il ne peut y avoir que les caractères entre les crochets suivants [\\"\'tonrxb] ',element:element}));
                                }
                            }else{
                                nouvelle_chaine=rv.substr(i,1) + nouvelle_chaine;
                            }
                        }
                    }
                }else if((rv.substr(i,1) === '\'') && (rv.substr(0,1) === '\'')){
                    if((i >= 2) && (rv.substr((i - 1),1) === '\\')){
                        nouvelle_chaine='\\\'' + nouvelle_chaine;
                        i--;
                    }else{
                        return(astphp_logerreur({'status':false,'message':'0983 il doit y avoir un backslash avant un apostrophe ',element:element}));
                    }
                }else if((rv.substr(i,1) === '"') && (rv.substr(0,1) === '"')){
                    if((i >= 2) && (rv.substr((i - 1),1) === '\\')){
                        nouvelle_chaine='\\"' + nouvelle_chaine;
                        i--;
                    }else{
                        return(astphp_logerreur({'status':false,'message':'0994 il doit y avoir un backslash avant un guillemet ',element:element}));
                    }
                }else{
                    nouvelle_chaine=rv.substr(i,1) + nouvelle_chaine;
                }
            }
            t+=rv.substr(0,1) + nouvelle_chaine + rv.substr(0,1);
        }else{
            t+=element.attributes.rawValue;
        }
        /*===============================================*/
    }else if("Stmt_ClassMethod" === element.nodeType){
        var obj = php_traite_Stmt_ClassMethod(element,niveau);
        if(obj.status === true){
            t+='\n' + esp0 + obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1051  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Stmt_Continue" === element.nodeType){
        if(element.num === null){
            t+='\n' + esp0 + 'continue()';
        }else{
            var obj = php_traite_Stmt_Expression(element.num,niveau,dansFor,element);
            if(obj.status === true){
                t+='\n' + esp0 + 'continue(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'0999  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }
        /*===============================================*/
    }else if("Expr_UnaryMinus" === element.nodeType){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
        if(obj.status === true){
            t+='-' + obj.value;
        }else{
            astphp_logerreur({'status':false,'message':'0902  dans php_traite_Stmt_Expression  ',element:element});
        }
    }else if("Stmt_Global" === element.nodeType){
        var variables='';
        var i={};
        for(i in element.vars){
            if(element.vars[i].nodeType === "Expr_Variable"){
                variables+=',$' + element.vars[i].name;
            }else{
                return(astphp_logerreur({'status':false,'message':'1059  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }
        if(variables !== ''){
            variables=variables.substr(1);
            t+='globale(' + variables + ')';
        }else{
            return(astphp_logerreur({'status':false,'message':'1065  dans php_traite_Stmt_Expression  ',element:element}));
        }
    }else if("Expr_UnaryPlus" === element.nodeType){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
        if(obj.status === true){
            t+='+' + obj.value;
        }else{
            astphp_logerreur({'status':false,'message':'0902  dans php_traite_Stmt_Expression  ',element:element});
        }
        /*===============================================*/
    }else if("Expr_ArrayDimFetch" === element.nodeType){
        var obj = php_traite_Expr_ArrayDimFetch(element,niveau,0);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1242  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_MethodCall" === element.nodeType){
        var obj = php_traite_Expr_MethodCall(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1252  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Scalar_MagicConst_File" === element.nodeType){
        t+='__FILE__';
    }else if("Scalar_MagicConst_Line" === element.nodeType){
        t+='__LINE__';
        /*===============================================*/
    }else if("Arg" === element.nodeType){
        if(element.byRef === true){
            t+='&';
        }
        var obj = php_traite_Stmt_Expression(element.value,niveau,dansFor,element);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1270  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Assign" === element.nodeType){
        var obj = php_traite_Expr_Assign(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'erreur dans php_traite_Stmt_Expression 0512 ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_AssignRef" === element.nodeType){
        var obj = php_traite_Expr_AssignRef(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'erreur dans php_traite_Stmt_Expression 0512 ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_FuncCall" === element.nodeType){
        var obj = php_traite_Expr_FuncCall(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1304  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Include" === element.nodeType){
        var obj = php_traite_Expr_Include(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1317  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Eval" === element.nodeType){
        var obj = php_traite_Expr_Eval(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1327  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Ternary" === element.nodeType){
        var obj = php_traite_Expr_Ternary(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1338  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if(element.nodeType.substr(0,14) === 'Expr_BinaryOp_'){
        var obj = php_traite_Expr_BinaryOp_General(element,niveau,parent);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1349  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if('Expr_Boolean' === element.nodeType.substr(0,12)){
        var obj = php_traite_Expr_BooleanOp_General(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1362  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if(element.nodeType === 'Expr_Isset'){
        var obj = php_traite_Expr_Isset(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1375  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if(element.nodeType === 'Expr_Array'){
        var obj = php_traite_Expr_Array(element,niveau,0);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'erreur dans php_traite_Stmt_Expression 1117','element':element}));
        }
        /*===============================================*/
    }else if("Expr_List" === element.nodeType){
        var obj = php_traite_Expr_List(element,niveau,0);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'erreur dans php_traite_Stmt_Expression 0492',element:element}));
        }
        /*===============================================*/
    }else if(element.nodeType === "Expr_Exit"){
        if(element.expr){
            var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
            if(obj.status === true){
                t+='sortir(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1411  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }else{
            t+='sortir()';
        }
        /*===============================================*/
    }else if(element.nodeType === "Expr_ConstFetch"){
        if(element.name){
            if(element.name.nodeType === 'Name'){
                if(element.name.name === 'true'){
                    t+='vrai';
                }else if(element.name.name === 'false'){
                    t+='faux';
                }else{
                    t+=element.name.name;
                }
            }else{
                return(astphp_logerreur({'status':false,'message':'1430  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1433  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if(element.nodeType === "Expr_ErrorSuppress"){
        if(element.expr){
            var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
            if(obj.status === true){
                t+='supprimeErreur(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1446  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1449  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if(element.nodeType.substr(0,14) === "Expr_AssignOp_"){
        var obj = php_traite_Expr_AssignOp_General(element,niveau,element.nodeType);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1460  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Print" === element.nodeType){
        var obj = php_traite_print(element,niveau);
        if(obj.status === true){
            t+='\n' + esp0 + obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1471  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_New" === element.nodeType){
        var obj = php_traite_Expr_New(element,niveau);
        if(obj.status === true){
            t+='\n' + esp0 + obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1483  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_PostInc" === element.nodeType){
        if((element.var) && (element.var.nodeType === "Expr_Variable")){
            t+='postinc($' + element.var.name + ')';
        }else{
            var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element);
            if(obj.status === true){
                t+='postinc(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1497  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }
        /*===============================================*/
    }else if("Expr_PostDec" === element.nodeType){
        if((element.var) && (element.var.nodeType === "Expr_Variable")){
            t+='postdec($' + element.var.name + ')';
        }else{
            var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element);
            if(obj.status === true){
                t+='postdec(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1510  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }
        /*===============================================*/
    }else if("Expr_PreDec" === element.nodeType){
        if((element.var) && (element.var.nodeType === "Expr_Variable")){
            t+='predec($' + element.var.name + ')';
        }else{
            var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element);
            if(obj.status === true){
                t+='predec(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1527  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }
        /*===============================================*/
    }else if("Expr_PreInc" === element.nodeType){
        if((element.var) && (element.var.nodeType === "Expr_Variable")){
            t+='preinc($' + element.var.name + ')';
        }else{
            var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element);
            if(obj.status === true){
                t+='preinc(' + obj.value + ' , 1)';
            }else{
                return(astphp_logerreur({'status':false,'message':'1538  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }
        /*===============================================*/
    }else if("Expr_Cast_Array" === element.nodeType){
        if(element.expr){
            var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
            if(obj.status === true){
                t+='casttableau(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1403  dans php_traite_Stmt_Expression "' + element.nodeType + '" ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1406  dans php_traite_Stmt_Expression "' + element.nodeType + '" ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Cast_Double" === element.nodeType){
        if(element.expr){
            var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
            if(obj.status === true){
                t+='castfloat(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1540  dans php_traite_Stmt_Expression "' + element.nodeType + '"',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1543  dans php_traite_Stmt_Expression "' + element.nodeType + '"',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Cast_String" === element.nodeType){
        if(element.expr){
            var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
            if(obj.status === true){
                t+='caststring(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1555  dans php_traite_Stmt_Expression "' + element.nodeType + '"',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1558  dans php_traite_Stmt_Expression "' + element.nodeType + '"',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Empty" === element.nodeType){
        if(element.expr){
            var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
            if(obj.status === true){
                t+='appelf(nomf(empty),p(' + obj.value + '))';
            }else{
                return(astphp_logerreur({'status':false,'message':'1546  dans php_traite_Stmt_Expression "' + element.nodeType + '" ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1549  dans php_traite_Stmt_Expression "' + element.nodeType + '" ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_Cast_Int" === element.nodeType){
        if(element.expr){
            var obj = php_traite_Stmt_Expression(element.expr,niveau,dansFor,element);
            if(obj.status === true){
                t+='castint(' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1561  dans php_traite_Stmt_Expression  ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1564  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_StaticCall" === element.nodeType){
        var obj = php_traite_Expr_FuncCall(element,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1576  dans php_traite_Stmt_Expression  ',element:element}));
        }
        /*===============================================*/
    }else if("Expr_PropertyFetch" === element.nodeType){
        var variable='';
        if(element.var){
            var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element);
            if(obj.status === true){
                variable=obj.value;
            }else{
                return(astphp_logerreur({'status':false,'message':'1447  dans php_traite_Stmt_Expression Expr_PropertyFetch ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1450  dans php_traite_Stmt_Expression Expr_PropertyFetch ',element:element}));
        }
        var propriete='';
        if(element.name){
            if(element.name.nodeType === 'Identifier'){
                propriete=element.name.name;
            }else{
                return(astphp_logerreur({'status':false,'message':'1447  dans php_traite_Stmt_Expression Expr_PropertyFetch ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1454  dans php_traite_Stmt_Expression Expr_PropertyFetch ',element:element}));
        }
        t+='propriete(' + variable + ',' + propriete + ')';
        /*===============================================*/
    }else if("Scalar_InterpolatedString" === element.nodeType){
        if(element.parts){
            var chaine_concat='';
            var i=0;
            for(i=0;i < element.parts.length;i++){
                if("InterpolatedStringPart" === element.parts[i].nodeType){
                    chaine_concat+=',"' + element.parts[i].value.replace(/\\/g,'\\\\').replace(/"/g,'\\"') + '"';
                }else if("Expr_Variable" === element.parts[i].nodeType){
                    chaine_concat+=',$' + element.parts[i].name + '';
                }else{
                    return(astphp_logerreur({'status':false,'message':'1475  dans php_traite_Stmt_Expression Scalar_InterpolatedString ',element:element}));
                }
            }
            if(chaine_concat !== ''){
                chaine_concat=chaine_concat.substr(1);
                t+='concat(' + chaine_concat + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1484  dans php_traite_Stmt_Expression Scalar_InterpolatedString ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1472  dans php_traite_Stmt_Expression Scalar_InterpolatedString ',element:element}));
        }
    }else if("Expr_ClassConstFetch" === element.nodeType){
        if((element.class) && (element.class.nodeType === "Name") && (element.name) && (element.name.nodeType === "Identifier")){
            t+=element.class.name + '::' + element.name.name;
        }else{
            return(astphp_logerreur({'status':false,'message':'1653  dans php_traite_Stmt_Expression Expr_ClassConstFetch ',element:element}));
        }
    }else if("Expr_StaticPropertyFetch" === element.nodeType){
        /* $filename = self::$embedding_file;  */
        if((element.class) && (element.class.nodeType === 'Name') && (element.name) && (element.name.nodeType === "VarLikeIdentifier")){
            t+=element.class.name + '::$' + element.name.name;
        }else{
            return(astphp_logerreur({'status':false,'message':'1702  dans php_traite_Stmt_Expression "' + element.nodeType + '" ',element:element}));
        }
    }else if("StaticVar" === element.nodeType){
        var variable="";
        if(element.var){
            var obj = php_traite_Stmt_Expression(element.var,niveau,dansFor,element);
            if(obj.status === true){
                variable+=obj.value;
            }else{
                return(astphp_logerreur({'status':false,'message':'1465  dans php_traite_Stmt_Expression ' + element.nodeType + ' ',element:element}));
            }
        }else{
            return(astphp_logerreur({'status':false,'message':'1197  dans php_traite_Stmt_Expression pas de ' + element.nodeType + ' ',element:element}));
        }
        var valeurDef="";
        if((element.default) && (element.default !== null)){
            var obj = php_traite_Stmt_Expression(element.default,niveau,dansFor,element);
            if(obj.status === true){
                t+='\n' + esp0 + 'static(' + variable + ' , ' + obj.value + ')';
            }else{
                return(astphp_logerreur({'status':false,'message':'1200  dans php_traite_Stmt_Expression ' + element.nodeType + ' ',element:element}));
            }
        }else{
            t+='\n' + esp0 + 'static(' + variable + ')';
        }
        /*===============================================*/
    }else{
        return(astphp_logerreur({'status':false,'message':'1392  dans php_traite_Stmt_Expression "' + element.nodeType + '"',element:element}));
    }
    return({'status':true,'value':t,'nodeType':element.nodeType});
}
function php_traite_Expr_Ternary(element,niveau){
    var t='';
    var conditionIf='';
    if(element.cond){
        var obj = php_traiteCondition1(element.cond,niveau,element);
        if(obj.status === true){
            conditionIf=obj.value;
        }else{
            conditionIf='#(TODO ERREUR dans php_traite_Expr_Ternary 0818)';
        }
    }else{
        conditionIf='#(erreur php_traite_Expr_Ternary 0797)';
    }
    var siVrai='';
    if(element.if){
        var objSiVrai = php_traite_Stmt_Expression(element.if,niveau,false,element);
        if(objSiVrai.status === true){
            siVrai=objSiVrai.value;
        }else{
            siVrai='#(TODO ERREUR dans php_traite_Expr_Ternary 0818)';
        }
    }else{
        siVrai='#(erreur php_traite_Expr_Ternary 0807)';
    }
    var siFaux='';
    if(element.if){
        var objsiFaux = php_traite_Stmt_Expression(element.else,niveau,false,element);
        if(objsiFaux.status === true){
            siFaux=objsiFaux.value;
        }else{
            siFaux='#(TODO ERREUR dans php_traite_Expr_Ternary 0818)';
        }
    }else{
        siFaux='#(erreur php_traite_Expr_Ternary 0807)';
    }
    t+='testEnLigne(condition((' + conditionIf + ')),siVrai(' + siVrai + '),siFaux(' + siFaux + '))';
    return({'status':true,'value':t});
}
function php_traite_Expr_BooleanOp_General(element,niveau){
    var t='';
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.status === true){
            if(element.nodeType === 'Expr_BooleanNot'){
                t+='non(' + obj.value + ')';
            }else{
                t+='#(TODO 997 php_traite_Expr_BooleanOp_General ' + element.nodeType + ')';
            }
        }else{
            t+='#(erreur 999 php_traite_Expr_BooleanOp_General)';
        }
    }
    return({'status':true,'value':t});
}
function php_traite_Expr_BinaryOp_General(element,niveau,parent){
    var t='';
    var gauche='';
    var objGauche = php_traite_Stmt_Expression(element.left,niveau,false,element);
    if(objGauche.status === true){
        gauche=objGauche.value;
    }else{
        astphp_logerreur({'status':false,'message':'1497  dans php_traite_Expr_BinaryOp_General',element:element});
    }
    var droite='';
    var objdroite = php_traite_Stmt_Expression(element.right,niveau,false,element);
    if(objdroite.status === true){
        if((objdroite.value.substr(0,7) === 'concat(') && ("Expr_BinaryOp_Concat" === element.nodeType)){
            droite=objdroite.value.substr(7);
            droite=droite.substr(0,(droite.length - 1));
        }else{
            droite=objdroite.value;
        }
    }else{
        astphp_logerreur({'status':false,'message':'1513  dans php_traite_Expr_BinaryOp_General',element:element});
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
    }else if(element.nodeType === 'Expr_BinaryOp_Div'){
        t+='divi(' + gauche + ' , ' + droite + ')';
    }else{
        astphp_logerreur({'status':false,'message':'1918  non prévu ' + element.nodeType + ' dans php_traite_Expr_BinaryOp_General',element:element});
    }
    if(t.substr(0,14) === 'concat(concat('){
        var o = functionToArray2(t,false,true,'');
        if(o.status === true){
            var nouveauTableau = baisserNiveauEtSupprimer(o.value,2,0);
            var obj = a2F1(nouveauTableau,0,true,1,false);
            if(obj.status === true){
                t=obj.value;
            }
        }
    }
    return({'status':true,'value':t});
}
function php_traiteCondition1(element,niveau,parent){
    var t='';
    var obj = php_traite_Stmt_Expression(element,niveau,false,parent);
    if(obj.status === true){
        /*
          il y a souvent un niveau de parenthèses en trop ici 
          On parcourt la matrice pour voir si 
          - la première entrée est une fonction vide
          - tous les autres niveaux sont >=1
        */
        var matrice = functionToArray(obj.value,true,true,'');
        if((matrice.status === true) && (matrice.value.length >= 2)){
            if(matrice.value[1][1] === ''){
                var l01=matrice.value.length;
                var tout_est_superieur=true;
                var j=2;
                for(j=2;j < l01;j++){
                    if(matrice.value[j][3] < 1){
                        tout_est_superieur=false;
                        break;
                    }
                }
                if(tout_est_superieur === true){
                    var nouveauTableau = baisserNiveauEtSupprimer(matrice.value,1,0);
                    var obj1 = a2F1(nouveauTableau,0,true,1,false);
                    if(obj1.status === true){
                        t+=obj1.value;
                    }else{
                        astphp_logerreur({'status':false,'message':'16164334  dans php_traiteCondition1',element:element});
                    }
                }else{
                    t+=obj.value;
                }
            }else{
                t+=obj.value;
            }
        }else{
            astphp_logerreur({'status':false,'message':'1656  dans php_traiteCondition1',element:element});
        }
    }else{
        astphp_logerreur({'status':false,'message':'1665  dans php_traiteCondition1',element:element});
    }
    return({'status':true,'value':t});
}
function php_traite_Stmt_While(element,niveau,unElseIfOuUnElse){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var conditionWhile='';
    if(element.cond){
        var obj = php_traiteCondition1(element.cond,niveau,element);
        if(obj.status === true){
            conditionWhile=obj.value;
        }else{
            conditionWhile='#(TODO ERREUR dans php_traite_Stmt_While 1202)';
        }
    }else{
        conditionWhile='#(pas de condition)';
    }
    var instructionsDansWhile='';
    if(element.stmts){
        niveau+=2;
        var obj = TransformAstPhpEnRev(element.stmts,niveau,false);
        niveau-=2;
        if(obj.status === true){
            instructionsDansWhile+=obj.value;
        }else{
            instructionsDansWhile+='#(ERREUR 1217 ' + element.else.stmts[i].nodeType + ' )';
        }
    }else{
        instructionsDansWhile='#(PAS instructions dans if)';
    }
    t+='\n' + esp0 + 'tantQue(';
    t+='\n' + esp0 + esp1 + 'condition((' + conditionWhile + '))';
    t+='\n' + esp0 + esp1 + 'faire(\n';
    t+=instructionsDansWhile;
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({'status':true,'value':t});
}
function php_traite_Stmt_If(element,niveau,unElseIfOuUnElse){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var conditionIf='';
    var instructionsDansElseOuElseifIf='';
    if(element.cond){
        var obj = php_traiteCondition1(element.cond,niveau,element);
        if(obj.status === true){
            conditionIf=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'2081  dans php_traite_Stmt_If',element:element}));
        }
    }else{
        conditionIf='';
    }
    var instructionsDansIf='';
    if(element.stmts){
        niveau+=3;
        var obj = TransformAstPhpEnRev(element.stmts,niveau,false);
        niveau-=3;
        if(obj.status === true){
            instructionsDansIf+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'2096  dans php_traite_Stmt_If',element:element}));
        }
    }else{
        instructionsDansIf='#(PAS instructions dans if)';
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
            var objElseIf = php_traite_Stmt_If(element.elseifs[j],niveau,true);
            if(objElseIf.status === true){
                t+='' + objElseIf.value + '';
            }else{
                return(astphp_logerreur({'status':false,'message':'2126  dans php_traite_Stmt_If',element:element}));
            }
        }
    }
    if(element.else){
        if(element.else.stmts){
            if((element.else.stmts.length === 1) && (element.else.stmts[0].nodeType === "Stmt_If")){
                var objElseIf = php_traite_Stmt_If(element.else.stmts[0],niveau,true);
                if(objElseIf.status === true){
                    t+='' + objElseIf.value + '';
                }else{
                    return(astphp_logerreur({'status':false,'message':'2140  dans php_traite_Stmt_If',element:element}));
                }
            }else{
                niveau+=3;
                var obj = TransformAstPhpEnRev(element.else.stmts,niveau,false);
                niveau-=3;
                if(obj.status === true){
                    t+='\n' + esp0 + esp1 + 'sinon(';
                    t+='\n' + esp0 + esp1 + esp1 + 'alors(\n';
                    t+=obj.value;
                    t+='\n' + esp0 + esp1 + esp1 + ')';
                    t+='\n' + esp0 + esp1 + ')';
                }else{
                    return(astphp_logerreur({'status':false,'message':'2154  dans php_traite_Stmt_If',element:element}));
                }
            }
        }
    }
    if(unElseIfOuUnElse){
    }else{
        t+='\n' + esp0 + ')';
    }
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
*/
function php_traite_Stmt_Class(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if((element.name) && (element.name.nodeType === "Identifier")){
        t+='\n' + esp0 + 'definition_de_classe(';
        t+='\n' + esp0 + esp1 + 'nom_classe(' + element.name.name + ')';
        t+='\n' + esp0 + esp1 + 'contenu(';
        if((element.stmts) && (element.stmts.length > 0)){
            var obj = TransformAstPhpEnRev(element.stmts,(niveau + 2),false);
            if(obj.status === true){
                t+=obj.value;
            }else{
                return(astphp_logerreur({'status':false,'message':'1955  dans php_traite_Stmt_Class',element:element}));
            }
        }
        t+='\n' + esp0 + esp1 + ')';
        t+='\n' + esp0 + ')';
    }else{
        return(astphp_logerreur({'status':false,'message':'1949  dans php_traite_Stmt_Class',element:element}));
    }
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
*/
function php_traite_Stmt_For(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var initialisation='';
    if((element.init) && (element.init.length > 0)){
        var obj1 = TransformAstPhpEnRev(element.init,niveau,true);
        if(obj1.status === true){
            initialisation+=obj1.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1495  dans php_traite_Stmt_For erreur dans l\'initialisation',element:element}));
        }
    }
    /*
      todo attention, en php on peut mettre plusieurs conditions mais seule la dernière est valide
    */
    var condition='';
    if((element.cond) && (element.cond.length === 1)){
        var obj = php_traiteCondition1(element.cond[0],niveau,element);
        if(obj.status === true){
            condition+=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'1963 dans php_traite_Stmt_For ',element:element}));
        }
    }else{
        return(astphp_logerreur({'status':false,'message':'1963 dans php_traite_Stmt_For il y a plusieurs instructions dans la condition mais seule la dernière est prise en compte',element:element}));
    }
    /*
      if(element.cond && element.cond.length==1){
      var obj1=TransformAstPhpEnRev(element.cond,niveau,true);  
      if(obj1.status===true){
      condition+=obj1.value;
      }else{
      astphp_logerreur({'status':false,'message':'1508  dans php_traite_Stmt_For condition',element:element});
      }
      }else{
      astphp_logerreur({'status':false,'message':'1510  dans php_traite_Stmt_For il y a plusieurs instructions dans la condition mais seule la dernière est prise en compte',element:element});
      }
    */
    var increment='';
    if((element.loop) && (element.loop.length > 0)){
        var obj1 = TransformAstPhpEnRev(element.loop,niveau,true);
        if(obj1.status === true){
            increment+=obj1.value;
        }else{
            astphp_logerreur({'status':false,'message':'1519  dans php_traite_Stmt_For erreur dans l\'incrément',element:element});
        }
    }
    var instructions='';
    if((element.stmts) && (element.stmts.length > 0)){
        var obj1 = TransformAstPhpEnRev(element.stmts,niveau,false);
        if(obj1.status === true){
            instructions+=obj1.value;
        }else{
            astphp_logerreur({'status':false,'message':'1527  dans php_traite_Stmt_For erreur dans les instructions',element:element});
        }
    }
    t+='\n' + esp0 + 'boucle(';
    t+='\n' + esp0 + esp1 + 'initialisation(' + initialisation + '),';
    t+='\n' + esp0 + esp1 + 'condition((' + condition + ')),';
    t+='\n' + esp0 + esp1 + 'increment(' + increment + '),';
    t+='\n' + esp0 + esp1 + 'faire(';
    t+='\n' + instructions;
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({'status':true,'value':t});
}
function php_traite_Stmt_Foreach(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var cleValeur='';
    if(element.keyVar){
        var obj = php_traite_Stmt_Expression(element.keyVar,niveau,false,element);
        if(obj.status === true){
            cleValeur=obj.value + ' , ';
        }else{
            cle='#(ERREUR 1243 dans php_traite_Stmt_Foreach)';
        }
    }
    if(element.valueVar){
        var obj = php_traite_Stmt_Expression(element.valueVar,niveau,false,element);
        if(obj.status === true){
            cleValeur+=obj.value;
        }else{
            cle='#(ERREUR 1251 dans php_traite_Stmt_Foreach)';
        }
    }
    var nomVariable='';
    if(element.expr){
        var obj = php_traite_Stmt_Expression(element.expr,niveau,false,element);
        if(obj.status === true){
            nomVariable=obj.value;
        }else{
            cle='#(ERREUR 1260 dans php_traite_Stmt_Foreach)';
        }
    }
    var instructions='';
    if(element.stmts){
        niveau+=2;
        var obj = TransformAstPhpEnRev(element.stmts,niveau,false);
        niveau-=2;
        if(obj.status === true){
            instructions=obj.value;
        }else{
            return(astphp_logerreur({'status':false,'message':'dans php_traite_Stmt_Foreach 1905 ',element:element}));
        }
    }
    t+='\n' + esp0 + 'boucleSurTableau(';
    t+='\n' + esp0 + esp1 + 'pourChaque(dans(' + cleValeur + ' , ' + nomVariable + ')),';
    t+='\n' + esp0 + esp1 + 'faire(';
    t+='\n' + instructions;
    t+='\n' + esp0 + esp1 + ')';
    t+='\n' + esp0 + ')';
    return({'status':true,'value':t});
}
/*
  =====================================================================================================================
*/
function ajouteCommentairesAvant(element,niveau){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if(element.attributes.comments){
        var j=0;
        for(j=0;j < element.attributes.comments.length;j++){
            if(("Comment" === element.attributes.comments[j].nodeType) || ("Comment_Doc" === element.attributes.comments[j].nodeType)){
                var txtComment = element.attributes.comments[j].text.substr(2);
                if(element.attributes.comments[j].text.substr(0,2) === '/*'){
                    var c1 = nbre_caracteres2('(',txtComment);
                    var c2 = nbre_caracteres2(')',txtComment);
                    var val=txtComment.substr(0,(txtComment.length - 2));
                    if(c1 === c2){
                        if(val.substr(0,1)==='*' || val.substr(0,1)==='#' ){
                            t+='\n' + esp0 + '#(#' + val.substr(1) + ')';
                        }else{
                            t+='\n' + esp0 + '#(' + val + ')';
                        }
                    }else{
                        if(val.substr(0,1)==='*' || val.substr(0,1)==='#'){
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
                        t+='\n' + esp0 + '#(' + txtComment + ')';
                    }else{
                        t+='\n' + esp0 + '#(' + txtComment.replace(/\(/g,'[').replace(/\)/g,']') + ')';
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
function TransformAstPhpEnRev(stmts,niveau,dansFor){
    var t='';
    var esp0 = ' '.repeat((NBESPACESREV * niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var numeroLignePrecedentStmtHtmlStartLine=0;
    var numeroLigneCourantStmtHtmlStartLine=0;
    var numeroLignePrecedentStmtHtmlEndLine=0;
    var numeroLigneCourantStmtHtmlEndLine=0;
    var StmtsHtmlPrecedentEstEcho=false;
    if(stmts.length > 0){
        var i=0;
        for(i=0;i < stmts.length;i++){
            t+=ajouteCommentairesAvant(stmts[i],niveau);
            if(t !== ''){
                t+=',';
            }
            if("Stmt_Nop" === stmts[i].nodeType){
                t+='';
            }else if("Stmt_Echo" === stmts[i].nodeType){
                var obj = php_traite_echo(stmts[i],niveau);
                if(obj.status === true){
                    numeroLigneCourantStmtHtmlStartLine=stmts[i].attributes.startLine;
                    numeroLigneCourantStmtHtmlEndLine=stmts[i].attributes.endLine;
                    if(((numeroLigneCourantStmtHtmlStartLine === numeroLignePrecedentStmtHtmlStartLine) || (numeroLigneCourantStmtHtmlStartLine === numeroLignePrecedentStmtHtmlEndLine)) && (StmtsHtmlPrecedentEstEcho === true)){
                        /*
                          t finit par appelf(nomf(echo),p($d)),"
                        */
                        if('appelf(nomf(echo),' === obj.value.substr(0,18)){
                            t=t.substr(0,(t.length - 2)) + obj.value.substr(17);
                        }else{
                            t+='\n' + esp0 + obj.value;
                        }
                        numeroLignePrecedentStmtHtmlStartLine=numeroLigneCourantStmtHtmlStartLine;
                        numeroLignePrecedentStmtHtmlEndLine=numeroLigneCourantStmtHtmlEndLine;
                    }else{
                        t+='\n' + esp0 + obj.value;
                    }
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev 2342 "' + stmts[i].nodeType + '" ',element:stmts[i]}));
                }
            }else if("Stmt_If" === stmts[i].nodeType){
                var obj = php_traite_Stmt_If(stmts[i],niveau,false);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev 2024 "' + stmts[i].nodeType + '" ',element:stmts[i]}));
                }
            }else if("Stmt_Expression" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Expression(stmts[i].expr,niveau,dansFor,stmts);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev 1922 "' + stmts[i].nodeType + '" ',element:stmts[i]}));
                }
            }else if("Stmt_Function" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Function(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'2376  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"',element:stmts[i]}));
                }
            }else if("Stmt_Use" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Use(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'2387  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '" ',element:stmts[i]}));
                }
            }else if("Stmt_TryCatch" === stmts[i].nodeType){
                var obj = php_traite_Stmt_TryCatch(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'2398  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"',element:stmts[i]}));
                }
            }else if("Stmt_Return" === stmts[i].nodeType){
                if(stmts[i].expr === null){
                    t+='\n' + esp0 + 'revenir()';
                }else{
                    var obj = php_traite_Stmt_Expression(stmts[i].expr,niveau,dansFor,stmts);
                    if(obj.status === true){
                        t+='\n' + esp0 + 'retourner(' + obj.value + ')';
                    }else{
                        return(astphp_logerreur({'status':false,'message':'2411  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"',element:stmts[i]}));
                    }
                }
            }else if("Stmt_Break" === stmts[i].nodeType){
                if(stmts[i].num === null){
                    t+='\n' + esp0 + 'break()';
                }else{
                    return(astphp_logerreur({'status':false,'message':'2420  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"',element:stmts[i]}));
                }
            }else if("Stmt_InlineHTML" === stmts[i].nodeType){
                /*
                  =====================================================================================
                */
                var estTraiteSansErreur=false;
                var obj = isHTML(stmts[i].value);
                /* recherche d'au moins un tag dans le texte */
                var regex=/(<[a-zA-Z0-9\-_]+)/g;
                var found = stmts[i].value.match(regex);
                if((obj.status === true)
                 && (stmts[i].value.indexOf('<') >= 0)
                 && (stmts[i].value.indexOf('<') >= 0)
                 && (found)
                 && (found.length > 0)){
                    var obj1 = __module_html1.TransformHtmlEnRev(stmts[i].value,0);
                    if(obj1.status === true){
                        StmtsHtmlPrecedentEstEcho=false;
                        if(obj1.value !== ''){
                            t+='\n' + esp0 + 'html(' + obj1.value + ')';
                        }
                        estTraiteSansErreur=true;
                    }else{
                        /*
                          On ne capture pas l'erreur car ce qui est traité ici n'est peut être pas un html "pur"
                          dans ce cas tout est remplacé par des "echo" plus bas
                        */
                        estTraiteSansErreur=false;
                    }
                }else{
                    /*
                      On ne capture pas l'erreur car ce qui est traité ici n'est peut être pas un html "pur"
                      dans ce cas tout est remplacé par des "echo" plus bas
                    */
                    estTraiteSansErreur=false;
                }
                if(estTraiteSansErreur === false){
                    numeroLigneCourantStmtHtmlStartLine=stmts[i].attributes.startLine;
                    numeroLigneCourantStmtHtmlEndLine=stmts[i].attributes.endLine;
                    if(stmts[i].value.toLowerCase().indexOf('<script') < 0){
                        /*
                          =====================================================================
                          C'est un html incomplet qui ne contient pas de script, on le transforme en echo
                          =====================================================================
                        */
                        if(((numeroLigneCourantStmtHtmlStartLine === numeroLignePrecedentStmtHtmlStartLine) || (numeroLigneCourantStmtHtmlStartLine === numeroLignePrecedentStmtHtmlEndLine)) && (StmtsHtmlPrecedentEstEcho === true)){
                            t=t.substr(0,(t.length - 2)) + ',p(\'' + stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'))';
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
                        if((obj1) && (obj1.status === true) && (obj1.parfait === true) && (obj1.value.type.toLowerCase() === 'html')){
                            /*
                              si le contenu contient du HTML en racine, on peut essayer de le nettoyer 
                            */
                            if((obj1.content) && (obj1.content.length >= 0)){
                                var j=0;
                                for(j=0;j < obj1.content.length;j++){
                                    if((obj1.content[j].type === 'BODY') || (obj1.content[j].type === 'HEAD')){
                                        if((obj1.content[j].content) && (obj1.content[j].content.length > 0)){
                                            var k=0;
                                            for(k=0;k < obj1.content[j].content.length;k++){
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
                                                            if(objScr.status === true){
                                                                if(objScr.value === ''){
                                                                    t+='\n' + esp0 + 'html(script(' + lesProprietes + '))';
                                                                }else{
                                                                    t+='\n' + esp0 + 'html(script(' + lesProprietes + ',source(' + objScr.value + ')))';
                                                                }
                                                            }else{
                                                                console.log('un script KO : ' + obj1.content[j].content[k].content[0]);
                                                                t+='appelf(nomf(echo),p(\'<script type="text/javascript">\'))';
                                                                t+='appelf(nomf(echo),p(\'' + obj1.content[j].content[k].content[0].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'))';
                                                            }
                                                        }else{
                                                            t+='\n' + esp0 + 'html(script(' + lesProprietes + '))';
                                                        }
                                                    }else{
                                                        var obj = __module_html1.traiteAstDeHtml(obj1.content[j].content[k],0,true,'');
                                                        if(obj.status === true){
                                                            t+='\n' + esp0 + 'html(' + obj.value + ')';
                                                        }else{
                                                            t+='\n' + esp0 + '#(erreur 1679 dans convertit-php-en-rev)';
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }else{
                                        t+='\n' + esp0 + '#(cas non traité convertit-php-en-rev 1669)';
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
            }else if("Stmt_Switch" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Switch(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev pour Stmt_Switch 2215 ',element:stmts[i]}));
                }
                /*===============================================*/
            }else if(stmts[i].nodeType === 'Stmt_Unset'){
                var obj = php_traite_Expr_Unset(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev pour Stmt_Unset 2226 ',element:stmts[i]}));
                }
                /*===============================================*/
            }else if("Stmt_Foreach" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Foreach(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev pour Stmt_Foreach 2237 ',element:stmts[i]}));
                }
                /*===============================================*/
            }else if("Stmt_For" === stmts[i].nodeType){
                var obj = php_traite_Stmt_For(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev pour Stmt_For 2248 ',element:stmts[i]}));
                }
                /*===============================================*/
            }else if(stmts[i].nodeType.substr(0,14) === "Expr_AssignOp_"){
                var obj = php_traite_Expr_AssignOp_General(stmts[i],niveau,stmts[i].nodeType);
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev pour Expr_AssignOp_ 2261 ',element:stmts[i]}));

                }
                /*===============================================*/
            }else if("Expr_Assign" === stmts[i].nodeType){
                var obj = php_traite_Expr_Assign(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    t+='#(todo erreur dans TransformAstPhpEnRev 1972 )';
                }
                /*===============================================*/
            }else if("Stmt_Class" === stmts[i].nodeType){
                var obj = php_traite_Stmt_Class(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'dans TransformAstPhpEnRev pour Stmt_Class 2436 ',element:stmts[i]}));
                }
                /*===============================================*/
            }else if("Stmt_ClassMethod" === stmts[i].nodeType){
                var obj = php_traite_Stmt_ClassMethod(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'1051  dans php_traite_Stmt_Expression  ',element:stmts[i]}));
                }
                /*===============================================*/
            }else if(("Stmt_Continue" === stmts[i].nodeType)
             || ("Stmt_Global" === stmts[i].nodeType)
             || ("Expr_Isset" === stmts[i].nodeType)
             || ("Expr_PostDec" === stmts[i].nodeType)
             || ("Expr_PostInc" === stmts[i].nodeType)
             || ("Expr_PreDec" === stmts[i].nodeType)
             || ("Expr_PreInc" === stmts[i].nodeType)
             || ("Stmt_Property" === stmts[i].nodeType)
             || ("Stmt_Static" === stmts[i].nodeType)
             || ('Expr_BinaryOp_' === stmts[i].nodeType.substr(0,14))){
                var obj = php_traite_Stmt_Expression(stmts[i],niveau,dansFor,stmts);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    return(astphp_logerreur({'status':false,'message':'2013  dans TransformAstPhpEnRev "' + stmts[i].nodeType + '"','element':stmts[i]}));
                }
                /*===============================================*/
            }else if("Stmt_While" === stmts[i].nodeType){
                var obj = php_traite_Stmt_While(stmts[i],niveau);
                if(obj.status === true){
                    t+='\n' + esp0 + obj.value;
                }else{
                    t+='\n' + esp0 + '#(todo erreur dans TransformAstPhpEnRev 1356)';
                }
                /*===============================================*/
            }else if("Stmt_HaltCompiler" === stmts[i].nodeType){
                if((stmts[i].remaining) && (stmts[i].remaining !== '')){
                    t+='\n' + esp0 + '__halt_compiler(\'' + stmts[i].remaining.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
                }else{
                    t+='\n' + esp0 + '__halt_compiler()';
                }
            }else{
                return(astphp_logerreur({'status':false,'message':'2513  dans TransformAstPhpEnRev nodeType non prévu "' + stmts[i].nodeType + '"','element':stmts[i]}));
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
    return({'status':true,'value':t});
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
    var tabTags = [];
    var presDe='';
    var dansCdata=false;
    var l01=str.length;
    var niveau=0;
    var i=0;
    for(i=0;i < l01;i++){
        c0=str.substr(i,1);
        if(i < (l01 - 1)){
            cp1=str.substr((i + 1),1);
        }else{
            cp1='';
        }
        if((i > 0) && (l01 > 0)){
            cm1=str.substr((i - 1),1);
        }else{
            cm1='';
        }
        if(dansTag){
            if(dansNomPropriete){
                if((c0 === ' ') || (c0 === '\r') || (c0 === '\n') || (c0 === '\t')){
                    if(i > 50){
                        presDe=str.substr((i - 50),(i + 10));
                    }else{
                        presDe=str.substr(0,(i + 10));
                    }
                    return({status:false,id:i,'message':'Erreur 1785 pres de "' + presDe + '"'});
                }else if(c0 === '='){
                    if((cp1 === "'") || (cp1 === '"')){
                        dansValeurPropriete=true;
                        dansNomPropriete=false;
                        caractereDebutProp=cp1;
                        i++;
                    }else{
                        if(i > 50){
                            presDe=str.substr((i - 50),(i + 10));
                        }else{
                            presDe=str.substr(0,(i + 10));
                        }
                        return({status:false,id:i,'message':'Erreur 2864 pres de "' + presDe + '"'});
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
                if((c0 === ' ') || (c0 === '\r') || (c0 === '\n') || (c0 === '\t')){
                    if(dansCdata === true){
                        var j=i;
                        for(j=i;j < l01;j++){
                            if(str.substr(j,3) === (']]' + '>')){
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
                        tabTags.push(nomTag);
                        dansNomTag=false;
                    }
                }else if(c0 === '>'){
                    if(dansBaliseFermante){
                        dansNomTag=false;
                        dansInner=true;
                        dansTag=false;
                        if(nomTag === tabTags[tabTags.length - 1]){
                            /*
                              on a bien une balise fermante correspondant à la palise ouvrante précédente
                            */
                            tabTags.pop();
                        }else{
                            return({status:false,id:i,message:'Erreur 2266 les balises html ne sont pas équilibrées'});
                        }
                        nomTag='';
                        dansBaliseFermante=false;
                        niveau--;
                    }else{
                        if(nomTag === ''){
                            if(i > 50){
                                presDe=str.substr((i - 50),(i + 10));
                            }else{
                                presDe=str.substr(0,(i + 10));
                            }
                            return({status:false,id:i,'message':'Erreur 1852 pres de "' + presDe + '"'});
                        }
                        tabTags.push(nomTag);
                        dansNomTag=false;
                        dansInner=true;
                        dansTag=false;
                        nomTag='';
                    }
                }else if((c0 === '=') || (c0 === '"') || (c0 === '\'')){
                    if(i > 50){
                        presDe=str.substr((i - 50),(i + 10));
                    }else{
                        presDe=str.substr(0,(i + 10));
                    }
                    return({status:false,id:i,'message':'Erreur 2926 pres de "' + presDe + '"'});
                }else{
                    nomTag+=c0;
                    if(nomTag === ('![C' + 'DATA[')){
                        dansCdata=true;
                    }
                }
            }else{
                if(nomTag === ''){
                    if((c0 === ' ') || (c0 === '\r') || (c0 === '\n') || (c0 === '\t')){
                        if(i > 50){
                            presDe=str.substr((i - 50),(i + 10));
                        }else{
                            presDe=str.substr(0,(i + 10));
                        }
                        return({status:false,id:i,'message':'Erreur 1865 pres de "' + presDe + '"'});
                    }else{
                        dansNomTag=true;
                        nomTag+=c0;
                    }
                }else{
                    /*
                      le tag a été fait, maintenant, c'est les propriétés 
                      ou la fin des propriétés ou un / pour une balise auto fermante ( <br /> )
                    */
                    if((c0 === ' ') || (c0 === '\r') || (c0 === '\n') || (c0 === '\t')){
                    }else if(c0 === '/'){
                        if(cp1 === '>'){
                            nomTag='';
                            if(tabTags.length === 0){
                                if(i > 50){
                                    presDe=str.substr((i - 50),(i + 10));
                                }else{
                                    presDe=str.substr(0,(i + 10));
                                }
                                return({status:false,id:i,'message':'Erreur 1902 pres de "' + presDe + '"'});
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
                                presDe=str.substr((i - 50),(i + 10));
                            }else{
                                presDe=str.substr(0,(i + 10));
                            }
                            return({status:false,id:i,'message':'Erreur 1896 pres de "' + presDe + '"'});
                        }
                        dansTag=false;
                        dansInner=true;
                        if(tabTags.length === 0){
                            if(i > 50){
                                presDe=str.substr((i - 50),(i + 10));
                            }else{
                                presDe=str.substr(0,(i + 10));
                            }
                            return({status:false,id:i,'message':'Erreur 1929 pres de "' + presDe + '"'});
                        }
                        /*
                          pas de pop ici, dans <a b="c">d</a>, on est sur le > avant le d
                        */
                        nomTag='';
                    }else{
                        if((c0 === '=') || (c0 === '"') || (c0 === '\'')){
                            if(i > 50){
                                presDe=str.substr((i - 50),(i + 10));
                            }else{
                                presDe=str.substr(0,(i + 10));
                            }
                            return({status:false,id:i,'message':'Erreur 1910 pres de "' + presDe + '"'});
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
                            presDe=str.substr((i - 50),(i + 10));
                        }else{
                            presDe=str.substr(0,(i + 10));
                        }
                        return({status:false,id:i,'message':'Erreur 1982 pres de "' + presDe + '"'});
                    }
                    dansBaliseFermante=true;
                    i++;
                    dansInner=false;
                    dansTag=true;
                }else{
                    if(cp1 === '!' && i<l01-4 && str.substr(i+2,1)==='-'  && str.substr(i+3,1)==='-' ){
                        /*
                          on est dans un commentaire
                        */
                        var fin_de_commentaire_trouve=-1;
                        for(j=i+4;j<l01-3 && fin_de_commentaire_trouve===-1 ; j++){
                         if(str.substr(j,3)==='-->'){
                          fin_de_commentaire_trouve=j;
                         }
                        }
                        if(fin_de_commentaire_trouve>0){
                            i=fin_de_commentaire_trouve+2;
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
                        presDe=str.substr((i - 50),(i + 10));
                    }else{
                        presDe=str.substr(0,(i + 10));
                    }
                    return({status:false,id:i,'message':'Erreur 1935 pres de "' + presDe + '"'});
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
                        presDe=str.substr((i - 50),(i + 10));
                    }else{
                        presDe=str.substr(0,(i + 10));
                    }
                    return({status:false,id:i,'message':'Erreur 1952 pres de "' + presDe + '"'});
                }
            }
        }
    }
    if(tabTags.length > 0){
        if(i > 50){
            presDe=str.substr((i - 50),(i + 10));
        }else{
            presDe=str.substr(0,(i + 10));
        }
        return({status:false,id:i,'message':'Erreur 1964 pres de "' + presDe + '"'});
    }
    if(dansTag){
        if(i > 50){
            presDe=str.substr((i - 50),(i + 10));
        }else{
            presDe=str.substr(0,(i + 10));
        }
        return({status:false,id:i,'message':'Erreur 1972 pres de "' + presDe + '"'});
    }
    return({status:true});
}
/*
  liste des essais foireux trouvés sur stackoverflow      
  try {
  const fragment = new DOMParser().parseFromString(str,"application/xml");
  return fragment.body.children.length>0
  } catch(error) { ; }  
  return false;
  
  return /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\2>/i.test(str);
  var a = document.createElement('div');
  a.innerHTML = str;
  
  for (var c = a.childNodes, i = c.length; i--; ) {
  if (c[i].nodeType === 1) return true; 
  }
  
  return false;
*/
function traitementApresRecuperationAst(ret){
    var une_erreur_catch=false;
    try{
        var startMicro = performance.now();
        var ast = JSON.parse(ret.value);
        var obj = TransformAstPhpEnRev(ast,0,false);
        if(obj.status === true){
            document.getElementById('txtar2').value='php(' + obj.value + ')';
            var tableau1 = iterateCharacters2(obj.value);
            /*
              var obj1=functionToArray2(tableau1.out,false,true,'');
              if(obj1.status===true){
              var endMicro=performance.now();  
              astphp_logerreur({status:true,message:'pas d\'erreur pour le rev '+parseInt(((endMicro-startMicro)*1000),10)/1000+' ms' });
              var tabToPhp=parsePhp0(obj1.value,0,0);
              if(tabToPhp.status===true){
              document.getElementById('txtar3').value=tabToPhp.value;
              }
              }else{
              astphp_logerreur({status:false,message:'erreur pour le rev'});
              }
            */
        }else{
            displayMessages('zone_global_messages','txtar1');
        }
    }catch(e){
        console.error('e=',e);
        astphp_logerreur({status:false,'message':'erreur de conversion du ast vers json 0409 ' + e.message + ' ' + JSON.stringify(e.stack).replace(/\\n/g,'\n<br />')});
        une_erreur_catch=true;
        displayMessages('zone_global_messages','txtar1');
    }
    if(une_erreur_catch === false){
        if((ret.opt) && (ret.opt.zone_rev)){
            displayMessages('zone_global_messages',ret.opt.zone_rev);
        }else{
            displayMessages('zone_global_messages');
        }
    }
    rangeErreurSelectionne=false;
    return({status:true,value:''});
}
function recupereAstDePhp(texteSource,opt,f_traitementApresRecuperationAst){
    var r= new XMLHttpRequest();
    r.open("POST",'za_ajax.php?recupererAstDePhp',true);
    r.timeout=6000;
    r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
    r.onreadystatechange=function(){
        if((r.readyState !== 4) || (r.status !== 200)){
            if(r.status === 500){
                /*
                  normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                  au niveau du php za_ajax mais sait-on jamais
                */
                if(global_messages['e500logged'] === false){
                    try{
                        var errors = JSON.parse(r.responseText);
                        var t='';
                        var elem={};
                        for(elem in errors.messages){
                            global_messages['errors'].push(errors.messages[elem]);
                        }
                        global_messages['e500logged']=true;
                        displayMessages('zone_global_messages');
                        console.log(global_messages);
                    }catch(e){
                    }
                }
            }
            return;
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            if(jsonRet.status === 'OK'){
                var elem={};
                for(elem in jsonRet.messages){
                    astphp_logerreur({'status':true,'message':'<pre>' + jsonRet.messages[elem].replace(/&/g,'&lt;') + '</pre>'});
                }
                f_traitementApresRecuperationAst({status:true,value:jsonRet.value,input:jsonRet.input,opt:opt});
            }else{
                var elem={};
                for(elem in jsonRet.messages){
                    astphp_logerreur({'status':false,'message':'<pre>' + jsonRet.messages[elem].replace(/&/g,'&lt;') + '</pre>'});
                }
                displayMessages('zone_global_messages');
                console.log(r);
                return;
            }
        }catch(e){
            var errors = JSON.parse(r.responseText);
            var t='';
            var elem={};
            for(elem in errors.messages){
                global_messages['errors'].push(errors.messages[elem]);
            }
            displayMessages('zone_global_messages');
            console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
            return;
        }
    };
    r.onerror=function(e){
        console.error('e=',e);
        /* whatever(); */
        return;
    };
    r.ontimeout=function(e){
        console.error('e=',e);
        return;
    };
    var ajax_param={'call':{'lib':'php','file':'ast','funct':'recupererAstDePhp'},'texteSource':texteSource,'opt':opt};
    try{
        r.send('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param)));
    }catch(e){
        console.error('e=',e);
        /* whatever(); */
        return({status:false});
    }
    return({status:true});
}
function transform_text_area_php_en_rev(nom_de_la_text_area){
    document.getElementById('txtar2').value='Veuillez patienter !';
    clearMessages('zone_global_messages');
    var a = document.getElementById(nom_de_la_text_area);
    localStorage.setItem("fta_indexhtml_php_dernier_fichier_charge",a.value);
    var lines = a.value.split(/\r|\r\n|\n/);
    var count=lines.length;
    a.setAttribute('rows',(count + 1));
    try{
        var ret = recupereAstDePhp(a.value,{zone_php:nom_de_la_text_area,zone_rev:'txtar2'},traitementApresRecuperationAst);
        if(ret.status === true){
        }else{
            astphp_logerreur({status:false,message:'il y a une erreur d\'envoie du source php à convertir'});
            displayMessages('zone_global_messages','txtar2');
            rangeErreurSelectionne=false;
            ret=false;
        }
    }catch(e){
        console.log('erreur transform 0178',e);
        ret=false;
    }
}
function chargerSourceDeTestPhp(){
    var t=`<?php
$a=realpath(dirname(dirname(dirname(__FILE__))));
require($a.'/phplib/vendor/autoload.php');
/*
https://github.com/nikic/php-parser
*/
use PhpParser\\Error;
use PhpParser\\NodeDumper;
use PhpParser\\ParserFactory;

function recupererAstDePhp(&$data){
    $parser = (new ParserFactory())->createForNewestSupportedVersion();
    try {
        $ast = $parser->parse($data['input']['texteSource']);
        $data['value']=json_encode($ast);
        $data['status']='OK';
    } catch (Error $error) {
       $data['messages'][]=$error->getMessage();
       return;
    }
}
?>hello<?php echo ' world';?> and others<?php

`;
    dogid('txtar1').value=t;
}
function chargerLeDernierSourcePhp(){
    var fta_indexhtml_php_dernier_fichier_charge = localStorage.getItem("fta_indexhtml_php_dernier_fichier_charge");
    if(fta_indexhtml_php_dernier_fichier_charge !== null){
        dogid('txtar1').value=fta_indexhtml_php_dernier_fichier_charge;
    }
}