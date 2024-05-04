'use strict';
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

//=========================================================================================================
function astphp_logerreur(o){
 logerreur(o);
 if(rangeErreurSelectionne===false){
  if(o.element && o.element.hasOwnProperty('attributes') && o.element.attributes.hasOwnProperty('startTokenPos')  && o.element.attributes.hasOwnProperty('endTokenPos') ){
   rangeErreurSelectionne=true;
   global_messages['ranges'].push([o.element.attributes.startFilePos,o.element.attributes.endFilePos]);
  } 
 }
 return o;
}
//=========================================================================================================
function recupNomOperateur(s){ // recupNomOperateur
 if(s==='typeof'){
  return 'Typeof';
 }else if(s==='instanceof'){
  return 'Instanceof';
 }else if(s==='++'){
  return 'incr1';
 }else if(s==='--'){
  return 'decr1';
 }else if(s==='+'){
  return 'plus';
 }else if(s==='-'){
  return 'moins';
 }else if(s==='*'){
  return 'mult';
 }else if(s==='/'){
  return 'divi';
 }else if(s==='=='){
  return 'egal';
 }else if(s==='==='){
  return 'egalstricte';  
 }else if(s==='!='){
  return 'diff';
 }else if(s==='!=='){
  return 'diffstricte';
 }else if(s==='>'){
  return 'sup';
 }else if(s==='<'){
  return 'inf';
 }else if(s==='>='){
  return 'supeg';
 }else if(s==='<='){
  return 'infeg';
 }else if(s==='!'){
  return 'non';
 }else if(s==='&&'){
  return 'et';
 }else if(s==='||'){
  return 'ou';
 }else if(s==='&'){
  return 'etBin';
 }else{
  return 'TODO recupNomOperateur pour "'+s+'"'
 }
}



//=====================================================================================================================
function php_traite_Expr_Eval(element,niveau){
 console.log('%c entrée dans php_traite_Expr_Eval element=','background:yellow;',element);
 var t='';
 t+='appelf('
 t+='nomf(eval)'
 var obj=php_traite_Stmt_Expression(element.expr,false);
 if(obj.status===true){
  t+=',p('+obj.value+')';
 }else{
  t+='#(todo dans php_traite_Expr_Eval 0121 pas de expr )';
 }
 t+=')';
 
 
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Expr_Include(element,niveau){
 console.log('%c entrée dans php_traite_Expr_Include element=','background:yellow;',element);
 var t='';
 t+='appelf('
 if(element.type===1){
  t+='nomf(include)'
 }else if (element.type===2){
  t+='nomf(include_once)'
 }else if (element.type===3){
  t+='nomf(require)'
 }else if (element.type===4){
  t+='nomf(require_once)'
 }
 var obj=php_traite_Stmt_Expression(element.expr,false);
 if(obj.status===true){
  t+=',p('+obj.value+')';
 }else{
  t+='#(todo dans php_traite_Expr_FuncCall 0175 pas de expr )';
 }
 t+=')';
 
 
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Stmt_Switch(element,niveau){
 console.log('%c entrée dans php_traite_Stmt_Switch element=','background:yellow;',element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);

 var leTest='';
 var tabSw=[];
 
 if(element.cond){
  
  var obj=php_traite_Stmt_Expression(element.cond,niveau,false);
  if(obj.status===true){
   leTest=obj.value;
  }else{
   t+='#(todo dans php_traite_Stmt_Switch 0126 )';
  }

 }else{
  
  leTest='#(erreur php_traite_Stmt_Switch 0131 )';
  
 }
 
 if(element.cases){
  if(element.cases.length>0){
   for(var i=0;i<element.cases.length;i++){
    var leSw=element.cases[i];
    var laCondition='';
    if(leSw.cond){
     
     var obj=php_traite_Stmt_Expression(leSw.cond,niveau,false);
     if(obj.status===true){
      laCondition=obj.value;
     }else{
      t+='#(todo dans php_traite_Stmt_Switch 0146 )';
     }
     
    }else{
     laCondition=null;
    }
    var lesInstructions='';
    if(leSw.stmts){
     if(leSw.stmts.length>0){
      niveau+=3;
      var obj1=TransformAstPhpEnRev(leSw.stmts , niveau,false);
      niveau-=3;
      if(obj1.status===true){
       lesInstructions=obj1.value;
      }else{
       lesInstructions='#(erreur php_traite_Stmt_Switch 222)';;
      }
     }
    }
    tabSw.push([laCondition,lesInstructions]);
   }
  }else{
   tabSw.push('#(erreur php_traite_Stmt_Switch 0202)');
  }
 }else{
   tabSw.push('#(erreur php_traite_Stmt_Switch 212)');
 }
 t+='\n'+esp0+'bascule('
 t+='\n'+esp0+esp1+'quand('+leTest+')';
 for(var i=0;i<tabSw.length;i++){
  t+=',\n'+esp0+esp1+'est(';
  if(tabSw[i][0]===null){
   t+= '\n'+esp0+esp1+esp1+'valeurNonPrevue()';
  }else{
   t+= '\n'+esp0+esp1+esp1+'valeur('+tabSw[i][0]+')';
  }
  t+=',\n'+esp0+esp1+esp1+'faire(\n'+tabSw[i][1]
  t+= '\n'+esp0+esp1+esp1+')';
  t+= '\n'+esp0+esp1+')';
 }
 t+='\n'+esp0+')'
 
 
 return {'status':true,'value':t};

}
//=====================================================================================================================
function php_traite_Stmt_TryCatch(element,niveau){
 console.log('%c entrée dans php_traite_Stmt_TryCatch element=','background:yellow;',element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 
 var contenu='';
 if(element.stmts && element.stmts.length>0){
  niveau+=2;
  var obj=TransformAstPhpEnRev(element.stmts,niveau,false)
  niveau-=2;
  if(obj.status===true){
   contenu+=obj.value;
  }else{
   contenu+='#(erreur php_traite_Stmt_Function 0288)'
  }
 }

 
 t+='\n'+esp0+'essayer(';
 t+='\n'+esp0+esp1+'faire(\n';
 t+=contenu;
 t+='\n'+esp0+esp1+'),';
 
 if(element.catches && element.catches.length>0){
  for( var numc=0;numc<element.catches.length;numc++){
   
   contenu='';
   var lesTypesErreurs='';
   if(element.catches[numc].types && element.catches[numc].types.length>0){
    for(var i=0;i<element.catches[numc].types.length;i++){
     if(element.catches[numc].types[i].nodeType==='Name'){
      lesTypesErreurs +=element.catches[numc].types[i].name+' ';
     }
    }
   }else{
    lesTypesErreurs='#(TODO php_traite_Stmt_TryCatch 0206)';
   }
   
   var leNomErreur='';
   if(element.catches[numc].var && element.catches[numc].var.nodeType==="Expr_Variable"){
    leNomErreur='$'+element.catches[numc].var.name;
   }else{
    leNomErreur='#(TODO php_traite_Stmt_TryCatch 0211)';
   }
   
   if(element.catches[numc].stmts && element.catches[numc].stmts.length>0){
    niveau+=3;
    var obj=TransformAstPhpEnRev(element.catches[numc].stmts,niveau,false)
    niveau-=3;
    if(obj.status===true){
     contenu+=obj.value;
    }else{
     contenu+='#(erreur php_traite_Stmt_Function 0232)'
    }
   }
   t+='\n'+esp0+esp1+'sierreur(';
   t+='\n'+esp0+esp1+esp1+'err('+lesTypesErreurs+','+leNomErreur+')';
   t+='\n'+esp0+esp1+esp1+'faire(\n';
   t+=contenu;
   t+='\n'+esp0+esp1+esp1+')';
   t+='\n'+esp0+esp1+')'; 
   
   
   
  }
 }
   
 
 
 t+='\n'+esp0+')';
 
 
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Stmt_Use(element,niveau){
 console.log('%c entrée dans php_traite_Stmt_Use element=','background:yellow;',element);
 var t='';

 for(var i=0;i<element.uses.length;i++){
  if("UseItem"===element.uses[i].nodeType){
   if(element.uses[i].name.nodeType === "Name"){
    t+='appelf(nomf(use),p(\''+element.uses[i].name.name.replace(/\\/g,'\\\\')+'\'))';
   }else{
    t+='#(todo erreur dans php_traite_Stmt_Use 0232 pour ' + element.nodeType + ' )';
   }
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Use 0235 pour ' + element.nodeType + ' )';
  }
 }
 return {'status':true,'value':t};

}

//=====================================================================================================================
function php_traite_Expr_Isset(element,niveau){
 console.log('%c entrée dans php_traite_Expr_Isset element=','background:yellow;',element);
 var t='';
 var nomFonction='isset';
 var lesArguments='';
 
 if(element.vars && element.vars.length>0){
  for(var i=0;i<element.vars.length;i++){
   var obj=php_traite_Stmt_Expression(element.vars[i],niveau,false);
   if(obj.status===true){
    lesArguments+=',p('+obj.value+')';
   }else{
    t+='#(todo dans php_traite_Expr_Isset 0358 )';
   }
  }
 }
 
 
 t+='appelf(nomf('+nomFonction+')'+lesArguments+')';
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Expr_Unset(element,niveau){
 console.log('%c entrée dans php_traite_Expr_Unset element=','background:yellow;',element);
 var t='';
 var nomFonction='unset';
 var lesArguments='';
 
 if(element.vars && element.vars.length>0){
  for(var i=0;i<element.vars.length;i++){
   var obj=php_traite_Stmt_Expression(element.vars[i],niveau,false);
   if(obj.status===true){
    lesArguments+=',p('+obj.value+')';
   }else{
    t+='#(todo dans php_traite_Expr_Unset 0388 )';
   }
  }
 }
 
 
 t+='appelf(nomf('+nomFonction+')'+lesArguments+')';
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Expr_FuncCall(element,niveau){
 console.log('%c entrée dans php_traite_Expr_FuncCall element=','background:yellow;',element);
 var t='';
 var nomFonction='';
 
 if(element.name){
  if(element.name.nodeType==='Name'){
   nomFonction=element.name.name;
  }else if(element.name.nodeType==="Expr_ArrayDimFetch"){
   var obj=php_traite_Expr_ArrayDimFetch(element.name,niveau,0);
   if(obj.status===true){
    nomFonction=obj.value;
   }else{
    nomFonction='#(todo php_traite_Expr_FuncCall 0389 )';
   }   
   
  }else{
   t+='#(todo dans php_traite_Expr_FuncCall 0163 pas de name)';
  }
 }else{
   t+='#(todo dans php_traite_Expr_FuncCall 0357 pas de name)';
 }
 
 var lesArgumentsCourts='';
 var lesArguments='';
 var tabArgs=[];
 if(element.args && element.args.length>0){
  for(var i=0;i<element.args.length;i++){
   var obj=php_traite_Stmt_Expression(element.args[i],niveau,false);
   if(obj.status===true){
    lesArguments+=',p('+obj.value+')';
    tabArgs.push([obj.value,element.args[i].value.nodeType]);
    lesArgumentsCourts+=','+obj.value;
   }else{
    t+='#(todo dans php_traite_Expr_FuncCall 0175 pas de expr )';
   }
  }
 }
 
 if('htmlDansPhp'===nomFonction){
  if(lesArgumentsCourts.substr(0,1)===','){
   lesArgumentsCourts=lesArgumentsCourts.substr(1);
  }
  var source=lesArgumentsCourts.substr(1,lesArgumentsCourts.length-2);
  var source=source.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
  
  var obj = TransformHtmlEnRev(source,0);
  if(obj.status == true){
   t+='html('+obj.value+')';
  }else{
   t+='#(erreur convertit-php-en-rev 0373)';
  }

 }else if('concat'===nomFonction){
  if(lesArgumentsCourts.substr(0,1)===','){
   lesArgumentsCourts=lesArgumentsCourts.substr(1);
  }
  t+=''+nomFonction+'('+lesArgumentsCourts+')';
 }else{
  t+='appelf(nomf('+nomFonction+')'+lesArguments+')';
 }
 return {'status':true,'value':t};
}

/*=====================================================================================================================*/
function php_traite_printOuEcho(element,niveau,nomFonction){
 console.log('%c entrée dans php_traite_printOuEcho element=','background:yellow;',element);
 var t='';
 var lesArguments='';
 if(element.exprs){
  for(var i=0;i<element.exprs.length;i++){
   var obj=php_traite_Stmt_Expression(element.exprs[i],niveau,false);
   if(obj.status===true){
    lesArguments+=',p('+obj.value+')';
   }else{
    t+='#(todo dans php_traite_printOuEcho 0454 )';
   }
   
  }
 }
 if(element.expr){
  var obj=php_traite_Stmt_Expression(element.expr,niveau,false);
  if(obj.status===true){
   lesArguments+=',p('+obj.value+')';
  }else{
   t+='#(todo dans php_traite_printOuEcho 0464 )';
  }
   
 }
 t+='appelf(nomf('+nomFonction+')'+lesArguments+')'; ;
 return {'status':true,'value':t};
}
/*=====================================================================================================================*/

function php_traite_print(element,niveau){
 return php_traite_printOuEcho(element , niveau , 'print');
}
/*=====================================================================================================================*/

function php_traite_echo(element,niveau){
 return php_traite_printOuEcho(element , niveau , 'echo');
}
//=====================================================================================================================
function php_traite_Stmt_Function(element , niveau){
 console.log('%c entrée dans php_traite_Stmt_Function element=','background:yellow;',element.type,element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 var nomFonction='';
 var lesArguments='';
 var contenu='';
 
 if(element.name && element.name.nodeType === "Identifier"){
  nomFonction=element.name.name;
 }else{
   nomFonction='#(todo erreur dans php_traite_Stmt_Function 0261 )';
 }
 if(element.params && element.params.length>0){
  for(var i=0;i<element.params.length;i++){


   if(element.params[i].var && "Expr_Variable" === element.params[i].var.nodeType ){
    if(element.params[i].byRef && element.params[i].byRef===true){
     lesArguments+=',\n'+esp0+esp1+esp1+'adresseArgument($'+element.params[i].var.name+')';
    }else{
     if(element.params[i].variadic && element.params[i].variadic===true){
      lesArguments+=',\n'+esp0+esp1+esp1+'argument(...$'+element.params[i].var.name;
     }else{
      lesArguments+=',\n'+esp0+esp1+esp1+'argument($'+element.params[i].var.name;
     }
     if(element.params[i].default){
      var obj=php_traite_Stmt_Expression( element.params[i].default , niveau,false);
      if(obj.status===true){
       lesArguments+=',defaut('+obj.value+')';
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
 if(element.stmts && element.stmts.length>0){
  niveau+=2;
  var obj=TransformAstPhpEnRev(element.stmts,niveau,false)
  niveau-=2;
  if(obj.status===true){
   contenu+=obj.value;
  }else{
   contenu+='#(erreur php_traite_Stmt_Function 0288)'
  }
 }
 
 
 
 t+='\n'+esp0+'fonction(';
 t+='\n'+esp0+esp1+'definition('
 t+='\n'+esp0+esp1+esp1+'nom('+nomFonction+')';
 t+=lesArguments;
 t+='\n'+esp0+esp1+'),';
 t+='\n'+esp0+esp1+'contenu(\n';
 t+=contenu;
 t+='\n'+esp0+esp1+')';
 t+='\n'+esp0+')';
 
 return {'status':true,'value':t};
}

/*
=====================================================================================================================
*/
function php_traite_Expr_New(element , niveau){
 console.log('%c entrée dans php_traite_Expr_New element=','background:yellow;',element.type,element);
 var t='';

 if(element.class){
  
  var nomClasse='';
  if(element.class.nodeType=="Name"){
   nomClasse=element.class.name;
  }else{
   nomClasse+='#(php_traite_Expr_New 0487),';
  }
  
  var lesArgumentsDeLaClass='';
  if(element.args){
   for(var i=0;i<element.args.length;i++){
    var obj=php_traite_Stmt_Expression(element.args[i],niveau,false);
    if(obj.status===true){
     lesArgumentsDeLaClass+=',p('+obj.value+')';
    }else{
     t+='#(todo dans php_traite_Expr_New 0497)';
    }
   }
  }
  
  t+='nouveau(appelf(nomf('+nomClasse+')'+lesArgumentsDeLaClass+')),';
  
 }else{
  
  t+='nouveau(#(php_traite_Expr_New 0506)),';
  
 }
 
 
 
 return {'status':true,'value':t};
}
/*
//=====================================================================================================================
*/
function php_traite_Expr_MethodCall(element , niveau){
 console.log('%c entrée dans php_traite_Stmt_Function element=','background:yellow;',element.type,element);
 var t='';

 var nomFonction='';
 var lelement='';
 var lesArguments='';
 
 
 if(element.var){
  if(element.var.nodeType=="Expr_New"){
   
   var obj=php_traite_Expr_New(element.var , niveau);
   if(obj.status===true){
    lelement+=',element('+obj.value+')';
   }else{
    lelement+='#(todo dans php_traite_Expr_MethodCall 0360 pas de expr )';
   }
   
  }else if(element.var.nodeType=="Expr_Variable"){
   
   lelement+='element($'+element.var.name+'),';
   
  }else{

   lelement+='element(#(php_traite_Expr_MethodCall 0316)),';

  }

 }else{

  lelement+='element(#(php_traite_Expr_MethodCall 0319)),';

 }  


 if(element.name){
  if(element.name.nodeType=="Identifier"){
   nomFonction=element.name.name;
  }else{
   nomFonction+='element(#(php_traite_Expr_MethodCall 0345)),';
  }
 }else{
  nomFonction+='element(#(php_traite_Expr_MethodCall 0345)),';
 }

 var lesArguments='';
 
 if(element.args && element.args.length>0){
  for(var i=0;i<element.args.length;i++){
   var obj=php_traite_Stmt_Expression(element.args[i],niveau,false);
   if(obj.status===true){
    lesArguments+=',p('+obj.value+')';
   }else{
    t+='#(todo dans php_traite_Expr_MethodCall 0360 pas de expr )';
   }
  }
 }
 


 
 t+='appelf('+lelement+'nomf('+nomFonction+')'+lesArguments+')';
 
 
 return {'status':true,'value':t};
}


/*
=====================================================================================================================
*/
function php_traite_Expr_AssignOp_General(element , niveau , nodeType ){
 
 var operation = '';
 if("Expr_AssignOp_Concat"===nodeType){
  operation = 'concat';
 }else if("Expr_AssignOp_Plus"===nodeType){
  operation = 'plus';
 }else{
  operation='todoOperationNodeType'+nodeType;
 }

 var t='';

 var gauche=''; 
 if(element.var){
  var obj=php_traite_Stmt_Expression(element.var,niveau,false)
  if(obj.status===true){
   gauche+=obj.value;
  }else{
   gauche+='#(todo erreur dans php_traite_Expr_AssignOp_Concat 0621)';
  }
 }else{
   gauche+='#(todo erreur dans php_traite_Expr_AssignOp_Concat 624)';
 }

 var droite=''; 
 if(element.expr){
  var obj=php_traite_Stmt_Expression(element.expr,niveau,false)
  if(obj.status===true){
   droite+=obj.value;
  }else{
   droite+='#(todo erreur dans php_traite_Expr_AssignOp_Concat 0633)';
  }
 }else{
  droite+='#(todo erreur dans php_traite_Expr_AssignOp_Concat 0636)';
 }
 t+='affecte('+gauche+' , '+operation+'( '+gauche+' , '+droite+' ))';

 if(droite.substr(0,operation.length+1)===operation+'('){
  var o1 = functionToArray2(droite,false,true,'');
  if(o1.status === true){
   var o2 = functionToArray2(gauche,false,true,'');
   if(o2.status === true){
    for(var i=o2.value.length-1;i>=1;i--){
     o1.value.splice(2,0,o2.value[i]);
     o1.value[2][3]=o1.value[2][3]+1;
     o1.value[2][0]=o1.value[2][0]+1;
    }
    for(var i=1+o2.value.length;i<o1.value.length;i++){
     o1.value[i][0]=o1.value[i][0]+o2.value.length-1;
    }
    var nouveauTableau=reIndicerLeTableau(o1.value);
    var obj = a2F1(nouveauTableau,0,false,1,false);
    if(obj.status === true){
     t='affecte('+gauche+' , '+obj.value+' )';
    }
   }  
  }
 }
 
 
 
  // hugues
 return {'status':true,'value':t};
}


/*
=====================================================================================================================
*/
function php_traite_Expr_Assign(element,niveau){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);

 var gauche=''; 
 var droite=''; 
 if(element.var){
  var obj=php_traite_Stmt_Expression( element.var , niveau,false);
  if(obj.status===true){
   gauche=obj.value;
  }else{
   gauche='#(todo erreur dans php_traite_Expr_Assign 0715 pas de expr '+element.var.nodeType+')';
  }
 }else{
  gauche='#(todo dans php_traite_Expr_Assign 0718 pas de variable '+element.nodeType+')';
 }

 if(element.expr){
  var obj=php_traite_Stmt_Expression( element.expr , niveau,false);
  if(obj.status===true){
   droite=obj.value;
  }else{
   droite='#(todo erreur dans php_traite_Expr_Assign 0726 pas de expr '+element.nodeType+')';
  }
 }else{
  droite='#(todo dans php_traite_Expr_Assign 0729 pas de expr '+element.nodeType+')';
 }
 t+='affecte('+gauche+' , '+droite+')';
  
 
 
 return {'status':true,'value':t};
}
/*
=====================================================================================================================
*/
function php_traite_Expr_ArrayDimFetch(element,niveau,num){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 var nomTableau='';

 
 if(element.var){
  if("Expr_Variable" === element.var.nodeType){
   t='nomt($'+element.var.name+')';
  }else if("Expr_ArrayDimFetch" === element.var.nodeType){
   num++;
   var obj=php_traite_Expr_ArrayDimFetch(element.var,niveau,num);
   num--;
   if(obj.status===true){
    t+=obj.value;
   }else{
    t+='#(todo erreur dans php_traite_Expr_ArrayDimFetch 0541)';
   }
  }else{
    t+='#(todo erreur dans php_traite_Expr_ArrayDimFetch 0544)';
  }
 }
 
 if(element.dim){
  
  var obj=php_traite_Stmt_Expression( element.dim , niveau,false);
  if(obj.status===true){
   t+=',p('+obj.value+')';
  }else{
   t+='#(todo erreur dans php_traite_Expr_ArrayDimFetch 0775 )';
  }
 }else{
  t+=',p()';
 }
 if(num===0){
  t='tableau('+t+')';
 }

// t+='#(todo erreur dans php_traite_Expr_ArrayDimFetch 0473)';

 return {'status':true,'value':t};
}

/*
=====================================================================================================================
*/
function php_traite_Expr_List(element,niveau){
 console.log('%c entrée dans php_traite_Stmt_Expression element=','background:yellow;',element.type,element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 
 var lesElements='';
 if(element.items){
  for(var i=0;i<element.items.length;i++){
   if(null===element.items[i]){
    lesElements+='p()';
   }else if("ArrayItem"===element.items[i].nodeType){
    var cle='';
    if(element.items[i].value){
     var objValeur=php_traite_Stmt_Expression(element.items[i].value,niveau,false);
     if(objValeur.status===true){
      if(lesElements!==''){
       lesElements+=' , ';
      }
      lesElements+='p('+objValeur.value+')';
     }else{
      lesElements='#(TODO ERREUR dans php_traite_Expr_List 0806)';
     }
     
    }
   }else{
    lesElements+='#(todo dans php_traite_Expr_List 0811 '+element.items[i].nodeType+')'
   }
  }
 }
 t+='liste('+lesElements+')';
 
 

 return {'status':true,'value':t};

}
//=====================================================================================================================
function php_traite_Expr_Array(element , niveau){
 console.log('%c entrée dans php_traite_Expr_Array 0843 element=','background:yellow;',element);
 var t='';
 
 var lesElements='';
 if(element.items){
  for(var i=0;i<element.items.length;i++){
   if("ArrayItem"===element.items[i].nodeType){
    var cle='';
    if(element.items[i].key){
     
     var objcle=php_traite_Stmt_Expression(element.items[i].key,niveau,false);
     if(objcle.status===true){
      cle=objcle.value;
     }else{
      cle='#(TODO ERREUR dans php_traite_Expr_Array 0859)';
     }
     
     
    }
    if(element.items[i].value){
     var objValeur=php_traite_Stmt_Expression(element.items[i].value,niveau,false);
     if(objValeur.status===true){
      if(lesElements!==''){
       lesElements+=' , ';
      }
      if(cle!=''){
       lesElements+='('+cle+' , '+objValeur.value+')';
      }else{
       lesElements+='('+objValeur.value+')';
      }
      cle=objValeur.value;
     }else{
      cle='#(TODO ERREUR dans php_traite_Expr_Array 869)';
     }
     
    }
   }else{
    lesElements+='#(todo dans php_traite_Expr_Array 0852 '+element.items[i].nodeType+')'
   }
  }
 }
 t+='defTab('+lesElements+')';


 
 return {'status':true,'value':t}; 
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
function php_traite_Stmt_Expression(element,niveau,dansFor){
 console.log('%c entrée dans php_traite_Stmt_Expression element=','background:yellow;',element.type,element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 


 /*===============================================*/
 if("Scalar_Int"===element.nodeType){

  t+=element.value;

 /*===============================================*/
 }else if("Expr_Variable"===element.nodeType){

  t+='$'+element.name+'';

 /*===============================================*/

 }else if("Scalar_String"===element.nodeType){

  t+=element.attributes.rawValue;

 /*===============================================*/

 }else if("Expr_UnaryMinus"===element.nodeType){

  
  var obj=php_traite_Stmt_Expression( element.expr , niveau,dansFor);
  if(obj.status===true){
   t+='-'+obj.value;
  }else{
   astphp_logerreur({'status':false,'message':'0902  dans php_traite_Stmt_Expression  ',element:element});
  }
  


 }else if("Expr_UnaryPlus"===element.nodeType){

  
  var obj=php_traite_Stmt_Expression( element.expr , niveau,dansFor);
  if(obj.status===true){
   t+='+'+obj.value;
  }else{
   astphp_logerreur({'status':false,'message':'0902  dans php_traite_Stmt_Expression  ',element:element});
  }
  


 /*===============================================*/
 }else if("Expr_ArrayDimFetch"===element.nodeType){

  var obj=php_traite_Expr_ArrayDimFetch( element , niveau,0);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0492 )';
  }
  
 /*===============================================*/
 }else if("Expr_MethodCall"===element.nodeType){

  var obj=php_traite_Expr_MethodCall( element , niveau);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0331 )';
  }

 /*===============================================*/
 }else if("Scalar_MagicConst_File"===element.nodeType){
  t+='__FILE__';
 }else if("Scalar_MagicConst_Line"===element.nodeType){
  t+='__LINE__';
 
  
  
 /*===============================================*/
 }else if("Arg"===element.nodeType){
  
  
  if(element.byRef===true){
   t+='&';
  }
  var obj=php_traite_Stmt_Expression( element.value , niveau,dansFor);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0205 )';
  }
  
  
 /*===============================================*/
 }else if("Expr_Assign"===element.nodeType){

  var obj=php_traite_Expr_Assign( element , niveau);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0512 )';
  }
  
 

 /*===============================================*/

 }else if("Expr_FuncCall"===element.nodeType){
  
   var obj=php_traite_Expr_FuncCall(element,niveau);
   if(obj.status===true){
    t+=obj.value;
   }else{
    t+='#(todo erreur dans php_traite_Stmt_Expression 252)';
   }
   

 /*===============================================*/

 }else if("Expr_Include"===element.nodeType){
  
   var obj=php_traite_Expr_Include(element,niveau);
   if(obj.status===true){
    t+=obj.value;
   }else{
    t+='#(todo erreur dans php_traite_Stmt_Expression 0264 )';
   }
   
 /*===============================================*/
 }else if("Expr_Eval"===element.nodeType){
  
   var obj=php_traite_Expr_Eval(element,niveau);
   if(obj.status===true){
    t+=obj.value;
   }else{
    t+='#(todo erreur dans php_traite_Stmt_Expression 0264 )';
   }
   
 /*===============================================*/
 }else if("Expr_Ternary"===element.nodeType){
   

   var obj=php_traite_Expr_Ternary(element,niveau);
   if(obj.status===true){
    t+=obj.value;
   }else{
    t+='#(todo erreur dans php_traite_Stmt_Expression 0752 )';
   }
   
 /*===============================================*/

 }else if(element.nodeType.substr(0,14)==='Expr_BinaryOp_' ){

  var obj=php_traite_Expr_BinaryOp_General(element,niveau);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0754 )';
  }

 /*===============================================*/
  
  
 }else if( 'Expr_Boolean' === element.nodeType.substr(0,12) ){

  var obj=php_traite_Expr_BooleanOp_General(element,niveau);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0754 )';
  }
  
  
  
 /*===============================================*/

 }else if(element.nodeType==='Expr_Isset'){

  var obj=php_traite_Expr_Isset(element,niveau);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 252)';
  }
   

 /*===============================================*/
   
 }else if(element.nodeType==='Expr_Array'){

  var obj=php_traite_Expr_Array(element,niveau,0);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Switch 0824)';
  }   
   
 /*===============================================*/
 }else if("Expr_List"===element.nodeType){

  var obj=php_traite_Expr_List( element , niveau,0);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0492 )';
  }
  
  
  
 /*===============================================*/
   
 }else if(element.nodeType==="Expr_Exit"){
  if(element.expr){
   var obj=php_traite_Stmt_Expression(element.expr,niveau,dansFor);
   if(obj.status===true){
    t+='sortir('+obj.value+')';
   }else{
    t+='#(erreur php_traite_Stmt_Expression 0834)';
   }
  }else{
   t+='sortir()';
  }



  
 /*===============================================*/
   
 }else if(element.nodeType==="Expr_ConstFetch"){
  if(element.name){
   if(element.name.nodeType=='Name'){
    if(element.name.name==='true'){
     t+='vrai';
    }else if(element.name.name==='false'){
     t+='faux';
    }else{
     t+=element.name.name;
    }
   }else{
    t+='#(todo dans php_traite_Stmt_Expression 839 '+element.nodeType+')';
   }
  }else{
   t+='#(todo dans php_traite_Stmt_Expression 842 '+element.nodeType+')';
  }
  
  
 /*===============================================*/
   
 }else if(element.nodeType==="Expr_ErrorSuppress"){
  
  if(element.expr){
   var obj=php_traite_Stmt_Expression( element.expr , niveau,dansFor);
   if(obj.status===true){
    t+='supprimeErreur('+obj.value+')';
   }else{
    t+='#(todo erreur dans php_traite_Stmt_Expression 1009 )';
   }
  }else{
   t+='#(erreur php_traite_Stmt_Expression 1012)';
  }
  
  
 /*===============================================*/
   
 }else if(element.nodeType.substr(0,14)==="Expr_AssignOp_"){
  var obj=php_traite_Expr_AssignOp_General(element,niveau,element.nodeType);
  if(obj.status===true){
   t+=obj.value;
  }else{
   t+='#(erreur php_traite_Stmt_Expression 0927)';
  }

 /*===============================================*/

 }else if("Expr_Print"===element.nodeType){

  var obj=php_traite_print( element , niveau);
  if(obj.status===true){
   t+='\n'+esp0+obj.value;
  }else{
   t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR php_traite_print "'+stmts[i].nodeType+'")';
  }
   
  
 /*===============================================*/

 }else if("Expr_New"===element.nodeType){

  var obj=php_traite_Expr_New( element , niveau);
  if(obj.status===true){
   t+='\n'+esp0+obj.value;
  }else{
   t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR php_traite_Expr_New "'+stmts[i].nodeType+'")';
  }
   
  
 /*===============================================*/

 }else if("Expr_PostInc"===element.nodeType){
  if(element.var && element.var.nodeType==="Expr_Variable"){
   t+='postinc($'+element.var.name+')';
  }else{
   var obj=php_traite_Stmt_Expression( element.var , niveau,dansFor);
   if(obj.status===true){
    t+='postinc('+obj.value+')';
   }else{
    t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR php_traite_Stmt_Expression 1068 "'+element.nodeType+'")';
   }
  }
  
 /*===============================================*/
 }else if("Expr_PostDec"===element.nodeType){
  if(element.var && element.var.nodeType==="Expr_Variable"){
   t+='postdec($'+element.var.name+'))';
  }else{
   var obj=php_traite_Stmt_Expression( element.var , niveau,dansFor);
   if(obj.status===true){
    t+='postdec('+obj.value+')';
   }else{
    t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR php_traite_Stmt_Expression 1146 "'+element.nodeType+'")';
   }
  }

 /*===============================================*/

 }else if("Expr_PreDec"===element.nodeType){
  if(element.var && element.var.nodeType==="Expr_Variable"){
   t+='predec($'+element.var.name+')';
  }else{
   var obj=php_traite_Stmt_Expression( element.var , niveau,dansFor);
   if(obj.status===true){
    t+='predec('+obj.value+')';
   }else{
    t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR php_traite_Stmt_Expression 1149 "'+element.nodeType+'")';
   }
  }

 /*===============================================*/

 }else if("Expr_PreInc"===element.nodeType){
  if(element.var && element.var.nodeType==="Expr_Variable"){
   t+='preinc($'+element.var.name+'))';
  }else{
   var obj=php_traite_Stmt_Expression( element.var , niveau,dansFor);
   if(obj.status===true){
    t+='preinc('+obj.value+' , 1))';
   }else{
    t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR php_traite_Stmt_Expression 1162 "'+element.nodeType+'")';
   }
  }

 /*===============================================*/

 }else if("Expr_Cast_Double"===element.nodeType){
  
  if(element.expr){
   var obj=php_traite_Stmt_Expression( element.expr , niveau,dansFor);
   if(obj.status===true){
    t+='castfloat('+obj.value+')';
   }else{
    t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR  1168 "'+element.nodeType+'")';
   }
  }else{
    t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR 1165 "'+element.nodeType+'")';
  }

 /*===============================================*/

 }else if("Expr_Cast_Int"===element.nodeType){
  
  if(element.expr){
   var obj=php_traite_Stmt_Expression( element.expr , niveau,dansFor);
   if(obj.status===true){
    t+='castint('+obj.value+')';
   }else{
    t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR  1201 "'+element.nodeType+'")';
   }
  }else{
    t+='\n'+esp0+'#(TODO dans php_traite_Stmt_Expression ERREUR 1204 "'+element.nodeType+'")';
  }

 /*===============================================*/

 }else if("StaticVar"===element.nodeType){
  
  
  var variable="";
  if(element.var){
   var obj=php_traite_Stmt_Expression( element.var , niveau,dansFor);
   if(obj.status===true){
    variable+=obj.value;
   }else{
    astphp_logerreur({'status':false,'message':'1200  dans php_traite_Stmt_Expression StaticVar ',element:element});
   }
   
  }else{
   astphp_logerreur({'status':false,'message':'1197  dans php_traite_Stmt_Expression pas de StaticVar ',element:element});
  }

 /*===============================================*/

  var valeurDef="";
  if(element.default && element.default!==null){
   var obj=php_traite_Stmt_Expression( element.default , niveau,dansFor);
   if(obj.status===true){
    t+='\n'+esp0+'static('+variable+' , '+obj.value+')';
   }else{
    astphp_logerreur({'status':false,'message':'1200  dans php_traite_Stmt_Expression StaticVar ',element:element});
   }
  }else{
    t+='\n'+esp0+'static('+variable+')';
  }



 /*===============================================*/

 }else{
  
  console.log('%c 0845 non traité','background:red;color:yellow;',element)
  t+='#(todo dans php_traite_Stmt_Expression 1044 '+element.nodeType+')';
  
  
  
 }
 
 return {'status':true,'value':t,'nodeType':element.nodeType};
}

//=====================================================================================================================
function php_traite_Expr_Ternary(element , niveau){
 var t=''
 
 var conditionIf='';
 if(element.cond){
  var obj=php_traiteCondition1(element.cond,niveau);
  if(obj.status===true){
   conditionIf=obj.value;
  }else{
   conditionIf='#(TODO ERREUR dans php_traite_Expr_Ternary 0818)';
  }
 }else{
  conditionIf='#(erreur php_traite_Expr_Ternary 0797)';
 }
 var siVrai='';
 if(element.if){
  var objSiVrai=php_traite_Stmt_Expression(element.if,niveau,false);
  if(objSiVrai.status===true){
   siVrai=objSiVrai.value;
  }else{
   siVrai='#(TODO ERREUR dans php_traite_Expr_Ternary 0818)';
  }
 }else{
  siVrai='#(erreur php_traite_Expr_Ternary 0807)';
 }
 
 var siFaux='';
 if(element.if){
  var objsiFaux=php_traite_Stmt_Expression(element.else,niveau,false);
  if(objsiFaux.status===true){
   siFaux=objsiFaux.value;
  }else{
   siFaux='#(TODO ERREUR dans php_traite_Expr_Ternary 0818)';
  }
 }else{
  siFaux='#(erreur php_traite_Expr_Ternary 0807)';
 }
 
 t+='testEnLigne(condition(('+conditionIf+')),siVrai('+siVrai+'),siFaux('+siFaux+'))';


 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Expr_BooleanOp_General(element , niveau){
 var t=''
 if(element.expr){
  var obj=php_traite_Stmt_Expression(element.expr,niveau,false);
  if(obj.status===true){
   if(element.nodeType==='Expr_BooleanNot'){
    t+='non('+obj.value+')';
   }else{
    t+='#(TODO 997 php_traite_Expr_BooleanOp_General '+element.nodeType+')';
   }
  }else{
   t+='#(erreur 999 php_traite_Expr_BooleanOp_General)';
  }
 }
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Expr_BinaryOp_General(element , niveau ){
 var t=''
 var gauche='';
 var objGauche=php_traite_Stmt_Expression(element.left,niveau,false);
 if(objGauche.status===true){
  gauche=objGauche.value;
 }else{
  gauche='#(php_traite_Expr_BinaryOp_General ERREUR 0858)';
 }
 
 var droite='';
 var objdroite=php_traite_Stmt_Expression(element.right,niveau,false);
 if(objdroite.status===true){
  droite=objdroite.value;
 }else{
  droite='#(php_traite_Expr_BinaryOp_General ERREUR 0867)';
 }
 
 
 if(element.nodeType==='Expr_BinaryOp_NotIdentical'){
  
  t+='diffstricte('+gauche+' , '+droite+')';
  
 }else if(element.nodeType==='Expr_BinaryOp_Concat'){
  
  t+='concat('+gauche+' , '+droite+')';
  
 }else if(element.nodeType==='Expr_BinaryOp_NotEqual'){
  
  t+='diff('+gauche+' , '+droite+')';
  
 }else if(element.nodeType==='Expr_BinaryOp_Equal'){
  
  t+='egal('+gauche+' , '+droite+')';
  
 }else if(element.nodeType==='Expr_BinaryOp_Identical'){
  
  t+='egalstricte('+gauche+' , '+droite+')';
  
 }else if(element.nodeType==='Expr_BinaryOp_BooleanOr'){
  
  t+=''+gauche+' , ou( '+droite+')';
  
 }else if(element.nodeType==='Expr_BinaryOp_BooleanAnd'){
  
  t+=''+gauche+' , et('+droite+')';

 }else if(element.nodeType==='Expr_BinaryOp_Greater'){
  
  t+='sup('+gauche+' , '+droite+')';
  
 }else if(element.nodeType==='Expr_BooleanNot'){
  
  t+='non('+gauche+' , '+droite+')';
  
 }else if(element.nodeType==='Expr_BinaryOp_Coalesce'){
  
  t+='??('+gauche+' , '+droite+')';

 }else if(element.nodeType==='Expr_BinaryOp_Mul'){
  
  t+='mult('+gauche+' , '+droite+')';

 }else if(element.nodeType==='Expr_BinaryOp_Plus'){
  
  t+='plus('+gauche+' , '+droite+')';

 }else if(element.nodeType==='Expr_BinaryOp_Minus'){
  
  t+='moins('+gauche+' , '+droite+')';

 }else if(element.nodeType==='Expr_BinaryOp_Smaller'){
  
  t+='inf('+gauche+' , '+droite+')';

 }else if(element.nodeType==='Expr_BinaryOp_GreaterOrEqual'){
  
  t+='supeg('+gauche+' , '+droite+')';

 }else if(element.nodeType==='Expr_BinaryOp_SmallerOrEqual'){
  
  t+='infeg('+gauche+' , '+droite+')';

 }else if(element.nodeType==='Expr_BinaryOp_Mod'){
  
  t+='modulo('+gauche+' , '+droite+')';
  
 }else{
  
  t+='#(Traitement non prévu '+element.nodeType+' 1236 '+gauche+' , '+droite+')';
  
 }
 
 if((t.substr(0,14) === 'concat(concat(')){
     var o = functionToArray2(t,false,true,'');
     if(o.status === true){
//         console.log('%c simplifier les concat concat','background:yellow;',t,o.value);
         var nouveauTableau = baisserNiveauEtSupprimer(o.value,2,0);
//         console.log('nouveauTableau=',nouveauTableau);
         var obj = a2F1(nouveauTableau,0,false,1,false);
         if(obj.status === true){
             console.log('apres simplification obj.value=',obj.value);
             t=obj.value;
         }
     }
 }
 
  
 return {'status':true,'value':t};
}


//=====================================================================================================================
function php_traiteCondition1(element,niveau){
 var t='';
 
 var obj=php_traite_Stmt_Expression(element,niveau,false);
 if(obj.status===true){
  t+=obj.value;
 }else{
  t='#(condition ERREUR 0800)';
 }
 
 return {'status':true,'value':t};
 
}
 
//=====================================================================================================================
function php_traite_Stmt_While(element,niveau,unElseIfOuUnElse){
 console.log('%c entrée dans php_traite_Stmt_While 0794 element=','background:yellow;',element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 
 var conditionWhile='';
 if(element.cond){
  var obj=php_traiteCondition1(element.cond,niveau);
  if(obj.status===true){
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
  var obj=TransformAstPhpEnRev(element.stmts,niveau,false);
  niveau-=2;
  if(obj.status===true){
   instructionsDansWhile+=obj.value;
  }else{
   instructionsDansWhile+='#(ERREUR 1217 '+element.else.stmts[i].nodeType+' )';
  }
 }else{
  instructionsDansWhile='#(PAS instructions dans if)';
 }

 t+='\n'+esp0+'tantQue('
 t+='\n'+esp0+esp1+'condition(('+conditionWhile+'))';
 t+='\n'+esp0+esp1+'faire(\n'
 t+=instructionsDansWhile
 t+='\n'+esp0+esp1+')';
 t+='\n'+esp0+')'
 
 
 return {'status':true,'value':t};
 
}
 
//=====================================================================================================================
function php_traite_Stmt_If(element,niveau,unElseIfOuUnElse){
 console.log('%c entrée dans php_traite_Stmt_If 0794 element=','background:yellow;',element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 var conditionIf='';
 var instructionsDansElseOuElseifIf='';
 if(element.cond){
  var obj=php_traiteCondition1(element.cond,niveau);
  if(obj.status===true){
   conditionIf=obj.value;
  }else{
   conditionIf='#(TODO ERREUR dans php_traite_Stmt_If 0818)';
  }
   
 }else{
  conditionIf='';
 }
 
 var instructionsDansIf='';
 if(element.stmts){
  niveau+=3;
  var obj=TransformAstPhpEnRev(element.stmts,niveau,false);
  niveau-=3;
  if(obj.status===true){
   instructionsDansIf+=obj.value;
  }else{
   instructionsDansIf+='#(ERREUR 0902 '+element.else.stmts[i].nodeType+' )';
  }
 }else{
  instructionsDansIf='#(PAS instructions dans if)';
 }

 if(unElseIfOuUnElse){
  
  t+='\n'+esp0+esp1+'sinonsi('
  t+='\n'+esp0+esp1+esp1+'condition(('+conditionIf+'))';
  t+='\n'+esp0+esp1+esp1+'alors(\n'
  t+=instructionsDansIf
  t+='\n'+esp0+esp1+esp1+')';
  t+='\n'+esp0+esp1+')'
  
 }else{
  t+='\n'+esp0+'choix('
  t+='\n'+esp0+esp1+'si('
  t+='\n'+esp0+esp1+esp1+'condition(('+conditionIf+'))';
  t+='\n'+esp0+esp1+esp1+'alors(\n'
  t+=instructionsDansIf
  t+='\n'+esp0+esp1+esp1+')';
  t+='\n'+esp0+esp1+')'
 }
 
 
 var listeDesElse='';
 var listeDesElseIf='';
 if(element.else){
  if(element.else.stmts){
   if(element.else.stmts.length===1 && element.else.stmts[0].nodeType==="Stmt_If"){
    // c'est un elseif
    var objElseIf=php_traite_Stmt_If(element.else.stmts[0],niveau,true);
    if(objElseIf.status===true){
     t+=''+objElseIf.value+'';
    }else{
     instructionsDansElseOuElseifIf+='#(ERREUR 0902 '+element.else.stmts[0].nodeType+' )';
    }
   }else{
    // c'est un else
    niveau+=3;
    var obj=TransformAstPhpEnRev(element.else.stmts,niveau,false);
    niveau-=3;
    if(obj.status===true){
     t+='\n'+esp0+esp1+'sinon('
     t+='\n'+esp0+esp1+esp1+'alors(\n'
     t+=obj.value;
     t+='\n'+esp0+esp1+esp1+')';
     t+='\n'+esp0+esp1+')'
    }else{
     t+='#(ERREUR 0902 '+element.else.stmts[0].nodeType+' )';
    }
   }
  }
 }
 if(unElseIfOuUnElse){
 }else{
  t+='\n'+esp0+')';
 }
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Stmt_For(element , niveau){
 console.log('%c entrée dans php_traite_Stmt_For 1486 element=','background:pink;',element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);

 var initialisation='';
 if(element.init && element.init.length>0){
  var obj1=TransformAstPhpEnRev(element.init,niveau,true);  
  if(obj1.status===true){
   initialisation+=obj1.value;
  }else{
   astphp_logerreur({'status':false,'message':'1495  dans php_traite_Stmt_For erreur dans l\'initialisation',element:element});
  }
 }
 /*
 todo attention, en php on peut mettre plusieurs conditions mais seule la dernière est valide
 */
 var condition=''; 
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
 var increment='';
 if(element.loop && element.loop.length>0){
  var obj1=TransformAstPhpEnRev(element.loop,niveau,true);  
  if(obj1.status===true){
   increment+=obj1.value;
  }else{
   astphp_logerreur({'status':false,'message':'1519  dans php_traite_Stmt_For erreur dans l\'incrément',element:element});
  }
 }
 var instructions='';
 if(element.stmts && element.stmts.length>0){
  var obj1=TransformAstPhpEnRev(element.stmts,niveau,false);  
  if(obj1.status===true){
   instructions+=obj1.value;
  }else{
   astphp_logerreur({'status':false,'message':'1527  dans php_traite_Stmt_For erreur dans les instructions',element:element});
  }
 }

 t+='\n'+esp0+'boucle(';
 t+='\n'+esp0+esp1+'initialisation('+initialisation+'),';
 t+='\n'+esp0+esp1+'condition(('+condition+')),';
 t+='\n'+esp0+esp1+'increment('+increment+'),';
 t+='\n'+esp0+esp1+'faire(';
 t+='\n'+instructions;
 t+='\n'+esp0+esp1+')';
 t+='\n'+esp0+')';
 
 return {'status':true,'value':t};
}

//=====================================================================================================================
function php_traite_Stmt_Foreach(element , niveau){
 console.log('%c entrée dans php_traite_Stmt_Foreach 1232 element=','background:yellow;',element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);

 var cleValeur='';
 if(element.keyVar){
  var obj=php_traite_Stmt_Expression(element.keyVar,niveau,false);
  if(obj.status===true){
   cleValeur=obj.value+' , '
  }else{
   cle='#(ERREUR 1243 dans php_traite_Stmt_Foreach)';
  }
 }
 if(element.valueVar){
  var obj=php_traite_Stmt_Expression(element.valueVar,niveau,false);
  if(obj.status===true){
   cleValeur+=obj.value;
  }else{
   cle='#(ERREUR 1251 dans php_traite_Stmt_Foreach)';
  }
 }
 var nomVariable='';
 if(element.expr){
  var obj=php_traite_Stmt_Expression(element.expr,niveau,false);
  if(obj.status===true){
   nomVariable=obj.value;
  }else{
   cle='#(ERREUR 1260 dans php_traite_Stmt_Foreach)';
  }
 }
 var instructions='';
 if(element.stmts){
  niveau+=2;
  var obj=TransformAstPhpEnRev(element.stmts,niveau,false);
  niveau-=2;
  if(obj.status===true){
   instructions=obj.value;
  }else{
   cle='#(ERREUR 1271 dans php_traite_Stmt_Foreach)';
  }
 }
 t+='\n'+esp0+'boucleSurTableau(';
 t+='\n'+esp0+esp1+'pourChaque(dans('+cleValeur+' , '+nomVariable+')),';
 t+='\n'+esp0+esp1+'faire(';
 t+='\n'+instructions;
 t+='\n'+esp0+esp1+')';
 t+='\n'+esp0+')';

  
 return {'status':true,'value':t};
}
/*
  =====================================================================================================================
*/
function ajouteCommentairesAvant(element,niveau){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 if(element.attributes.comments){
  for(var j=0;j<element.attributes.comments.length;j++){
   if(element.attributes.comments[j].nodeType==="Comment"){
    
    var txtComment=element.attributes.comments[j].text.substr(2);
    
    if(element.attributes.comments[j].text.substr(0,2)==='/*'){
     
     var c1=nbre_caracteres2('(',txtComment);
     var c2=nbre_caracteres2(')',txtComment);
     
     if(c1===c2){
      t+='\n'+esp0+'#('+txtComment.substr(0,txtComment.length-2)+')';
     }else{
      t+='\n'+esp0+'#('+txtComment.substr(0,txtComment.length-2).replace(/\(/g,'[').replace(/\)/g,']')+')';
     }
     element.attributes.comments[j].text='';
     
    }else if(element.attributes.comments[j].text.substr(0,2)==='//'){

     var c1=nbre_caracteres2('(',txtComment);
     var c2=nbre_caracteres2(')',txtComment);
     if(c1===c2){
       t+='\n'+esp0+'#('+txtComment+')';
     }else{
       t+='\n'+esp0+'#('+txtComment.replace(/\(/g,'[').replace(/\)/g,']')+')';
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
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 var numeroLignePrecedentStmtHtmlStartLine=0;
 var numeroLigneCourantStmtHtmlStartLine=0;
 var numeroLignePrecedentStmtHtmlEndLine=0;
 var numeroLigneCourantStmtHtmlEndLine=0;
 var StmtsHtmlPrecedentEstEcho=false;
 
 if(stmts.length>0){
  for( var i=0;i<stmts.length;i++){
   t+=ajouteCommentairesAvant( stmts[i],niveau)
   
   if(t != ''){
       t+=',';
   }
   
   if("Stmt_Nop"===stmts[i].nodeType){
    
    
    t+='';
    
    
   }else if("Stmt_Echo"===stmts[i].nodeType){

    var obj=php_traite_echo( stmts[i] , niveau);
    if(obj.status===true){
     
     numeroLigneCourantStmtHtmlStartLine = stmts[i].attributes.startLine;
     numeroLigneCourantStmtHtmlEndLine   = stmts[i].attributes.endLine;

     if( ( numeroLigneCourantStmtHtmlStartLine===numeroLignePrecedentStmtHtmlStartLine || numeroLigneCourantStmtHtmlStartLine===numeroLignePrecedentStmtHtmlEndLine )&& StmtsHtmlPrecedentEstEcho===true){
      console.log('optimiserIci t=',t);
      /*
      t finit par appelf(nomf(echo),p($d)),"
      */
      if('appelf(nomf(echo),'===obj.value.substr(0,18)){
       t=t.substr(0,t.length-2)+obj.value.substr(17);
      }else{
       t+='\n'+esp0+obj.value;
      }
      numeroLignePrecedentStmtHtmlStartLine = numeroLigneCourantStmtHtmlStartLine;
      numeroLignePrecedentStmtHtmlEndLine   = numeroLigneCourantStmtHtmlEndLine;
      
     }else{
      t+='\n'+esp0+obj.value;
     }
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR php_traite_echo "'+stmts[i].nodeType+'")';
    }
    
    


   }else if("Stmt_If"===stmts[i].nodeType){


    var obj=php_traite_Stmt_If( stmts[i] , niveau , false );
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR 0822 "'+stmts[i].nodeType+'")';
    }


   }else if("Stmt_Expression"===stmts[i].nodeType){


    var obj=php_traite_Stmt_Expression( stmts[i].expr , niveau,dansFor);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR "'+stmts[i].nodeType+'")';
    }
    

   }else if("Stmt_Function"===stmts[i].nodeType){

    var obj=php_traite_Stmt_Function( stmts[i] , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR Stmt_Function "'+stmts[i].nodeType+'")';
    }
    
    
    
   }else if("Stmt_Use"===stmts[i].nodeType){

    var obj=php_traite_Stmt_Use( stmts[i] , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR php_traite_Stmt_Use "'+stmts[i].nodeType+'")';
    }
    

    
   }else if("Stmt_TryCatch"===stmts[i].nodeType){

    var obj=php_traite_Stmt_TryCatch( stmts[i] , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR 0610 "'+stmts[i].nodeType+'")';
    }
    

   }else if("Stmt_Return"===stmts[i].nodeType){
          
    if(stmts[i].expr===null){
     t+='\n'+esp0+'revenir()';
    }else{
     var obj=php_traite_Stmt_Expression( stmts[i].expr , niveau,dansFor);
     if(obj.status===true){
      t+='\n'+esp0+'revenir('+obj.value+')';
     }else{
      t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR 1298 "'+stmts[i].nodeType+'")';
     }
    }
     
   }else if("Stmt_Break"===stmts[i].nodeType){
     
     if(stmts[i].num===null){
      t+='\n'+esp0+'break()';
     }else {
      t+='\n'+esp0+'#(TODO TransformAstPhpEnRev return 868)';
     }
    
   }else if("Stmt_InlineHTML"===stmts[i].nodeType){



     /*
     ===========================================================================
     */
     var estTraiteSansErreur=false;
     var obj=isHTML(stmts[i].value);
//     console.log('obj=',obj , stmts[i].value );
     if(obj.status===true){
      var obj1=TransformHtmlEnRev(stmts[i].value);
      if(obj1.status===true){
        StmtsHtmlPrecedentEstEcho=false;
        t+='\n'+esp0+'html('+obj1.value+')';
        estTraiteSansErreur=true;
      }
     }
     if(estTraiteSansErreur===false){
      
      numeroLigneCourantStmtHtmlStartLine = stmts[i].attributes.startLine;
      numeroLigneCourantStmtHtmlEndLine   = stmts[i].attributes.endLine;
      if(stmts[i].value.toLowerCase().indexOf('<script')<0 ){
       /*
         ================================================================================
         C'est un html incomplet qui ne contient pas de script, on le transforme en echo
         ================================================================================
       */
       
       if( ( numeroLigneCourantStmtHtmlStartLine===numeroLignePrecedentStmtHtmlStartLine || numeroLigneCourantStmtHtmlStartLine===numeroLignePrecedentStmtHtmlEndLine )&& StmtsHtmlPrecedentEstEcho===true){
        // todo, vérifier que la ligne précédente n'est pas trop longue avant de la concaténer
        t=t.substr(0,t.length-2)+',p(\''+stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'))';
       }else{
        t+='\n'+esp0+'appelf(nomf(echo),p(\''+stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'))';
       }
//       t+='\n'+esp0+'appelf(nomf(echo),p(\''+stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'))';
       StmtsHtmlPrecedentEstEcho=true;
       numeroLignePrecedentStmtHtmlStartLine = numeroLigneCourantStmtHtmlStartLine;
       numeroLignePrecedentStmtHtmlEndLine   = numeroLigneCourantStmtHtmlEndLine;      
       
      }else{
       
       /*
       ===========================================================================
       cas ou le html contenu contient des scripts
       ===========================================================================
       
       */
       
       var obj1=mapDOM(stmts[i].value);
       if(obj1 && obj1.type==='HTML'){
        if( obj1.content && obj1.content.length>=0){
         for(var j=0;j<obj1.content.length;j++){
          console.log(obj1.content[j].type);
          if(obj1.content[j].type==='BODY' || obj1.content[j].type==='HEAD' ){
           if(obj1.content[j].content && obj1.content[j].content.length>0){
            for(var k=0;k<obj1.content[j].content.length;k++){
             if(obj1.content[j].content[k].type){
              var lesProprietes='';
              if(obj1.content[j].content[k].attributes){
               for(var attr in obj1.content[j].content[k].attributes){
                if(lesProprietes!==''){
                 lesProprietes+=',';
                }
                lesProprietes+='(\''+attr.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\' , \''+obj1.content[j].content[k].attributes[attr].replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')'
               }
              }
              
              
              if(obj1.content[j].content[k].type==='SCRIPT'){
//                console.log('source=',obj1.content[j].content[k].content[0]);
                if(obj1.content[j].content[k].content){

                 var objScr=transformJsEnRev(obj1.content[j].content[k].content[0]);
                 if(objScr.status===true){
                  if(objScr.value===''){
                   t+='\n'+esp0+'html(script('+lesProprietes+'))';
                  }else{
                   t+='\n'+esp0+'html(script('+lesProprietes+',source('+objScr.value+')))';
                  }
 //                 console.log('un script OK ="'+ objScr.value + '"' )
                  
                 }else{
 //                 console.log('un script KO')
                 }


                }else{
                   t+='\n'+esp0+'html(script('+lesProprietes+'))';


                }
              }else{
               
               var obj=traiteJsonDeHtml(obj1.content[j].content[k],0,true,'');
               if(obj.status===true){
                //t=obj.value;
                console.log(obj.value)
                t+='\n'+esp0+'html('+obj.value+')';
               }else{
                t+='\n'+esp0+'#(erreur 1679 dans convertit-php-en-rev)';
               }
               
              } 
             }
            }
           }
          }else{
            t+='\n'+esp0+'#(cas non traité convertit-php-en-rev 1669)';
          }
         }
        }
       }
      }
     }


   }else if("Stmt_Switch"===stmts[i].nodeType){

    var obj=php_traite_Stmt_Switch( stmts[i] , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR 814 "'+stmts[i].nodeType+'")';
    }
    
    /*===============================================*/

    }else if(stmts[i].nodeType==='Stmt_Unset'){

     var obj=php_traite_Expr_Unset(stmts[i],niveau);
     if(obj.status===true){
      t+='\n'+esp0+obj.value;
     }else{
      t+='\n'+esp0+'#(todo erreur dans TransformAstPhpEnRev 1356)';
     }
   
    /*===============================================*/

    }else if("Stmt_Foreach"===stmts[i].nodeType){

     var obj=php_traite_Stmt_Foreach(stmts[i],niveau);
     if(obj.status===true){
      t+='\n'+esp0+obj.value;
     }else{
      t+='\n'+esp0+'#(todo erreur dans TransformAstPhpEnRev 1356)';
     }
   
    /*===============================================*/

    }else if("Stmt_For"===stmts[i].nodeType){

     var obj=php_traite_Stmt_For(stmts[i],niveau);
     if(obj.status===true){
      t+='\n'+esp0+obj.value;
     }else{
      t+='\n'+esp0+'#(todo erreur dans TransformAstPhpEnRev 1356)';
     }

   
    /*===============================================*/
    
   
   
    }else if(stmts[i].nodeType.substr(0,14)==="Expr_AssignOp_"){
     var obj=php_traite_Expr_AssignOp_General(stmts[i],niveau,stmts[i].nodeType);
     if(obj.status===true){
      t+=obj.value;
     }else{
      t+='#(erreur TransformAstPhpEnRev 1950)';
     }

    /*===============================================*/
    
    }else if("Expr_Assign"===stmts[i].nodeType){

     var obj=php_traite_Expr_Assign( stmts[i] , niveau);
     if(obj.status===true){
      t+='\n'+esp0+obj.value;
     }else{
      t+='#(todo erreur dans TransformAstPhpEnRev 1972 )';
     }
   
   
    /*===============================================*/

   
    }else if(
        "Expr_PostInc"   === stmts[i].nodeType
     || "Expr_PreDec"    === stmts[i].nodeType
     || "Expr_PreInc"    === stmts[i].nodeType
     || "Expr_PostDec"   === stmts[i].nodeType
     || 'Expr_BinaryOp_' === stmts[i].nodeType.substr(0,14)
    ){
     var obj=php_traite_Stmt_Expression(stmts[i],niveau,dansFor);
     if(obj.status===true){
      t+='\n'+esp0+obj.value;
     }else{
      astphp_logerreur({'status':false,'message':'2013  dans TransformAstPhpEnRev "'+stmts[i].nodeType+'"','element':stmts[i] });
     }
   
    /*===============================================*/

    }else if("Stmt_While"===stmts[i].nodeType){
     
     var obj=php_traite_Stmt_While(stmts[i],niveau);
     if(obj.status===true){
      t+='\n'+esp0+obj.value;
     }else{
      t+='\n'+esp0+'#(todo erreur dans TransformAstPhpEnRev 1356)';
     }
   
   
    /*===============================================*/

    }else if("Stmt_Static"===stmts[i].nodeType){
     
     
     if(stmts[i].vars && stmts[i].vars.length>0){
      for( var j=0;j<stmts[i].vars.length;j++){
       var obj=php_traite_Stmt_Expression(stmts[i].vars[j],niveau,dansFor);
       if(obj.status===true){
        t+='\n'+esp0+obj.value;
       }else{
        astphp_logerreur({'status':false,'message':'2022  dans TransformAstPhpEnRev "'+stmts[i].nodeType+'"','element':stmts[i] });
       }
      }
      
     }


   }else{
    console.log('%cAvant erreur :stmts[i]=' , 'background:red;' , stmts[i] );
    t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev 0439 "'+stmts[i].nodeType+'")';
    astphp_logerreur({'status':false,'message':'0440  dans TransformAstPhpEnRev nodeType non prévu "'+stmts[i].nodeType+'"','element':stmts[i] });
    
   }
  }
 }
 if(t.substr(0,2)==='\r\n'){
  t=t.substr(2);
 }else if(t.substr(0,1)==='\r'){
  t=t.substr(1);
 }else if(t.substr(0,1)==='\n'){
  t=t.substr(1);
 }
 return {'status':true,'value':t};
}

/*
===========================================================================
*/
function isHTML(str) {
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
 
 var l01=str.length;
 var niveau=0;
 for(var i=0;i<l01;i++){
  c0=str.substr(i,1);
  if(i<l01-1){
   cp1=str.substr(i+1,1);
  }else{
   cp1='';
  }
  if(i>0 && l01>0){
   cm1=str.substr(i-1,1);
  }else{
   cm1='';
  }
  if(dansTag){
   
   if(dansNomPropriete){
     if(c0===' ' || c0==='\r' || c0==='\n' || c0==='\t'){
      if(i > 50){
        presDe = str.substr(i-50,i+10);
      }else{
        presDe = str.substr(0,i+10);
      }
      return({status:false,id:i,message:'Erreur 1785 pres de "'+presDe+'"'});
     }else if(c0==='='){
      if(cp1==="'" || cp1=='"'){
       dansValeurPropriete=true;
       dansNomPropriete=false;
       caractereDebutProp=cp1;
       i++;
      }else{
       if(i > 50){
         presDe = str.substr(i-50,i+10);
       }else{
         presDe = str.substr(0,i+10);
       }
       return({status:false,id:i,message:'Erreur 1804 pres de "'+presDe+'"'});
      }
      
     }else{
      // on continue
     }
   }else if(dansValeurPropriete){
    if(c0===caractereDebutProp){
     if(cm1==='\\'){
     // on continue
     }else{
      dansValeurPropriete=false;
     }
    }else{
     // on continue
    }
    
   }else if(dansNomTag){
    
    if(c0===' ' || c0==='\r' || c0==='\n' || c0==='\t'){
     tabTags.push(nomTag);
     dansNomTag=false;
    }else if(c0==='>'){
     if(dansBaliseFermante){ // </a>
      dansNomTag=false
      dansInner=true;
      dansTag=false;
      if(nomTag===tabTags[tabTags.length-1]){
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
      // <b>
      if(nomTag===''){
       if(i > 50){
         presDe = str.substr(i-50,i+10);
       }else{
         presDe = str.substr(0,i+10);
       }
       return({status:false,id:i,message:'Erreur 1852 pres de "'+presDe+'"'});
      }
      tabTags.push(nomTag);
      dansNomTag=false
      dansInner=true;
      dansTag=false;
      nomTag='';
      
     }

    }else if(c0==='=' || c0==='"' || c0==='\''){
     if(i > 50){
       presDe = str.substr(i-50,i+10);
     }else{
       presDe = str.substr(0,i+10);
     }
     return({status:false,id:i,message:'Erreur 1804 pres de "'+presDe+'"'});
    }else{
     nomTag+=c0;
     if(nomTag==='![C'+'DATA['){
      dansCdata=true;
     }
    }
    
    
   }else{
    
    if(nomTag===''){
     
     if(c0===' ' || c0==='\r' || c0==='\n' || c0==='\t'){
       if(i > 50){
         presDe = str.substr(i-50,i+10);
       }else{
         presDe = str.substr(0,i+10);
       }
       return({status:false,id:i,message:'Erreur 1865 pres de "'+presDe+'"'});
      
     }else{
      dansNomTag=true;
      nomTag+=c0;
     }
     
    }else{
     /* 
       le tag a été fait, maintenant, c'est les propriétés 
       ou la fin des propriétés ou un / pour une balise auto fermante ( <br /> )
     */
     if(c0===' ' || c0==='\r' || c0==='\n' || c0==='\t'){
      // on continue
     }else if(c0==='/'){
      if(cp1==='>'){
       // balise auto fermante
       nomTag='';
       if(tabTags.length===0){
        if(i > 50){
          presDe = str.substr(i-50,i+10);
        }else{
          presDe = str.substr(0,i+10);
        }
        return({status:false,id:i,message:'Erreur 1902 pres de "'+presDe+'"'});
       }
       tabTags.pop();
       niveau--
       dansTag=false;
       dansInner=true;
       i++;
      }
     }else if(c0==='>'){
      if(nomTag===''){
       if(i > 50){
         presDe = str.substr(i-50,i+10);
       }else{
         presDe = str.substr(0,i+10);
       }
       return({status:false,id:i,message:'Erreur 1896 pres de "'+presDe+'"'});
      
      }
      dansTag=false;
      dansInner=true;
      if(tabTags.length===0){
       if(i > 50){
         presDe = str.substr(i-50,i+10);
       }else{
         presDe = str.substr(0,i+10);
       }
       return({status:false,id:i,message:'Erreur 1929 pres de "'+presDe+'"'});
      }
      tabTags.pop();
      nomTag='';
     }else{
      if(c0==='=' || c0==='"' || c0==='\''){
       if(i > 50){
         presDe = str.substr(i-50,i+10);
       }else{
         presDe = str.substr(0,i+10);
       }
       return({status:false,id:i,message:'Erreur 1910 pres de "'+presDe+'"'});
      }else{
       dansNomPropriete=true;
      }
     }
    }
   }
   
  }else if(dansInner){
   if(c0==='<'){
    if(cp1==='/'){ // fin de tag </a>
     if(tabTags.length===0){
      if(i > 50){
        presDe = str.substr(i-50,i+10);
      }else{
        presDe = str.substr(0,i+10);
      }
      return({status:false,id:i,message:'Erreur 1982 pres de "'+presDe+'"'});
     }
    
     dansBaliseFermante=true;
     i++;
    }else{
     niveau+=1;
    }
    dansInner=false;
    dansTag=true;
   }else if(c0==='>'){
    if(niveau===0){
       if(i > 50){
         presDe = str.substr(i-50,i+10);
       }else{
         presDe = str.substr(0,i+10);
       }
       return({status:false,id:i,message:'Erreur 1935 pres de "'+presDe+'"'});
    }
   }else{
    // caractere suivant
   }
   
  }else{
   if(c0==='<'){
   }else if(c0==='>'){
    debugger // on ne devrait pas passer par ici
    niveau-=1;
    if(niveau<0){
       if(i > 50){
         presDe = str.substr(i-50,i+10);
       }else{
         presDe = str.substr(0,i+10);
       }
       return({status:false,id:i,message:'Erreur 1952 pres de "'+presDe+'"'});
    }
   }
  }
  
 }
 if(tabTags.length>0){
  if(i > 50){
    presDe = str.substr(i-50,i+10);
  }else{
    presDe = str.substr(0,i+10);
  }
  return({status:false,id:i,message:'Erreur 1964 pres de "'+presDe+'"'});
 }
 if(dansTag){
  if(i > 50){
    presDe = str.substr(i-50,i+10);
  }else{
    presDe = str.substr(0,i+10);
  }
  return({status:false,id:i,message:'Erreur 1972 pres de "'+presDe+'"'});
 }
 return({status:true});
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
    if (c[i].nodeType == 1) return true; 
  }

  return false;
*/       
}

//=====================================================================================================================
function traitementApresRecuperationAst(ret){
 
// console.log('ret=',ret);
 try{
  var startMicro=performance.now();
  var ast=JSON.parse(ret.value);
//  console.log('ast=',ast);
  var obj=TransformAstPhpEnRev(ast,0,false);
  if(obj.status===true){
   document.getElementById('resultat1').innerHTML='<pre style="font-size:0.8em;">php(\n'+obj.value.replace(/&/g,'&amp;').replace(/</g,'&lt;')+')\n</pre>'; //  style="white-space: normal;"
   document.getElementById('txtar2').value='php('+obj.value+')';
   var tableau1 = iterateCharacters2(obj.value);
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
  }
 }catch(e){
  astphp_logerreur({status:false,message:'erreur de conversion du ast vers json 0409 ' + e.message + ' ' + JSON.stringify(e.stack).replace(/\\n/g,'\n<br />') })
 }
 
 displayMessages('zone_global_messages');
 rangeErreurSelectionne=false;
 
 return {status:true,value:''}
}
//=====================================================================================================================
function recupereAstDePhp(texteSource,opt,f_traitementApresRecuperationAst){
 
 
 var r = new XMLHttpRequest();
 r.open("POST",'za_ajax.php?recupererAstDePhp',true);
 r.timeout=6000;
 r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
 r.onreadystatechange = function () {
  if(r.readyState != 4 || r.status != 200){
   if(r.status==500){
    /*
      normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
      au niveau du php za_ajax mais sait-on jamais
    */
    
    if(global_messages['e500logged']==false){
     try{
//     console.log("r=",r);
//     console.log("r="+r.response);
      var errors=JSON.parse(r.responseText);
      var t='';
      for(var elem in errors.messages){
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
   var jsonRet=JSON.parse(r.responseText);
   if(jsonRet.status=='OK'){
    for(var elem in jsonRet.messages){
     astphp_logerreur( {'status':true,'message':'<pre>'+jsonRet.messages[elem].replace(/&/g,'&lt;')+'</pre>'});
    }
    f_traitementApresRecuperationAst({status:true,value:jsonRet.value});
   }else{
    for(var elem in jsonRet.messages){
     astphp_logerreur( {'status':false,'message':'<pre>'+jsonRet.messages[elem].replace(/&/g,'&lt;')+'</pre>'});
    }
    displayMessages('zone_global_messages');
//    display_ajax_error_in_cons(jsonRet);
    console.log(r);
//    alert('BAD job !');
    return;
   }
  }catch(e){
   var errors=JSON.parse(r.responseText);
   var t='';
   for(var elem in errors.messages){
    global_messages['errors'].push(errors.messages[elem]);
   }
   displayMessages('zone_global_messages');
   console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
   return;
  }
 };
 r.onerror=function(e){
  console.error('e=',e); /* whatever(); */
  return;
 }
 
 r.ontimeout=function(e){
  console.error('e=',e);
  return;
 }
 var ajax_param={
  call:{
   'lib'                       : 'php'   ,
   'file'                      : 'ast'  ,
   'funct'                     : 'recupererAstDePhp' ,
  },
  'texteSource':texteSource
 }
 try{
  r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));  
 }catch(e){
  console.error('e=',e); /* whatever(); */
  return {status:false};  
 }
 return {status:true};  
 
 
}
//=====================================================================================================================
function transformPhpEnRev(){
  //"àà"

  console.log('=========================\ndébut de transforme')
  document.getElementById('txtar2').value='';
  document.getElementById('resultat1').innerHTML='';
  clearMessages('zone_global_messages');
  var a=document.getElementById('txtar1');
  localStorage.setItem("fta_indexhtml_php_dernier_fichier_charge", a.value);
  
  var lines = a.value.split(/\r|\r\n|\n/);
  
  var count = lines.length;
  a.setAttribute('rows',count+1);
  
//  console.log('a compiler="'+a.value+'"');
  try{
   var ret=recupereAstDePhp(a.value,{},traitementApresRecuperationAst); // ,{'comment':true}
   if(ret.status===true){
//    console.log('ret=',ret)
   }else{
    astphp_logerreur({status:false,message:'il y a une erreur d\'envoie du source php à convertir'})
    displayMessages('zone_global_messages');
    rangeErreurSelectionne=false;
    ret=false;
   }
  }catch(e){
   console.log('erreur transform 0178',e);
   ret=false;
  }
  
 
}
//=====================================================================================================================
//=====================================================================================================================
//=====================================================================================================================
function chargerSourceDeTestPhp(){
// debut de backtic ``` ci dessous pour la variable t = = = = = = = = = = = = = = = = = = = = = = = = = 
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




// fin de backtic ``` ci dessus pour la variable t = = = = = = = = = = = = = = = = = = = = = = = = = 
 dogid('txtar1').value=t;
}
//=====================================================================================================================
function chargerLeDernierSourcePhp(){
 var fta_indexhtml_php_dernier_fichier_charge=localStorage.getItem("fta_indexhtml_php_dernier_fichier_charge");
// console.log('fta_indexhtml_javascript_dernier_fichier_charge=' , fta_indexhtml_javascript_dernier_fichier_charge );
 if(fta_indexhtml_php_dernier_fichier_charge!==null){
  dogid('txtar1').value=fta_indexhtml_php_dernier_fichier_charge;
 }
}

