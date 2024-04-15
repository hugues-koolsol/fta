'use strict';
var rangeErreurSelectionne=false;


//=========================================================================================================
function jumpToRange(debut,fin){
 var zoneSource=dogid('txtar1');
 zoneSource.select();
 zoneSource.selectionStart=debut;
 zoneSource.selectionEnd=fin;
 var texteDebut=zoneSource.value.substr(0,debut);
 var texteFin=zoneSource.value.substr(debut);
 zoneSource.value=texteDebut;
 zoneSource.scrollTo(0,9999999);
 var nouveauScroll=zoneSource.scrollTop;
 zoneSource.value=texteDebut+texteFin;
 if(nouveauScroll>50){
  zoneSource.scrollTo(0,nouveauScroll+50);
 }else{
  zoneSource.scrollTo(0,0);
 }
 zoneSource.selectionStart=debut;
 zoneSource.selectionEnd=fin;
}
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
//=========================================================================================================
function baisserNiveauEtSupprimer(tab,id,niveau){
 for(var i=id+1;i<tab.length;i++){
  if(tab[i][7]===id){
   tab[i][3]=tab[i][3]-1;
   if(tab[i][2]==='f'){
    niveau++;
    baisserNiveauEtSupprimer(tab,i,niveau)
    niveau--;
   }
  }
 }
 if(niveau===0){
  tab.splice(id,1);
  var j=0;
  var l01=tab.length;
  for(i=l01-1;(i > 0);i=i-1){
      niveau=tab[i][3];
      for(j=i;(j >= 0);j=j-1){
          if((tab[j][3] == niveau-1)){
              tab[i][7]=j;
              tab[j][8]=(tab[j][8]+1);
              break;
          }
      }
  }
  /*
    
    ============================== 
    numérotation des enfants
    numenfant = k
    ==============================
  */
  var k=0;
  for(i=0;(i < l01);i=(i+1)){
      k=0;
      for(j=(i+1);(j < l01);j=(j+1)){
          if((tab[j][7] == tab[i][0])){
              k=(k+1);
              tab[j][9]=k;
          }
      }
  }
  /*
    =======================================
    profondeur des fonctions
    k=remonterAuNiveau
    l=idParent
    =======================================
  */
  var l=0;
  for(i=l01-1;(i > 0);i=i-1){
      if((tab[i][2] == 'c')){
          tab[i][10]=0;
      }
      if((tab[i][7] > 0)){
          k=tab[i][3];
          l=tab[i][7];
          for(j=1;(j <= k);j=(j+1)){
              if((tab[l][10] < j)){
                  tab[l][10]=j;
              }
              l=tab[l][7];
          }
      }
  }
  
  
  
  return tab;
 }
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
 var obj=php_traite_Stmt_Expression(element.expr);
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
  if(element.cond.nodeType==="Expr_Variable"){
   leTest='$'+element.cond.name;
  }else if(element.cond.nodeType==="Expr_ArrayDimFetch"){
   
   var obj=php_traite_Expr_ArrayDimFetch(element.cond,niveau,0);
   if(obj.status===true){
    leTest=obj.value;
   }else{
    leTest='#(todo erreur dans php_traite_Stmt_Switch 0450)';
   }   
  }else{
   leTest='#(erreur php_traite_Stmt_Switch 0193)';
  }
 }else{
  leTest='#(erreur php_traite_Stmt_Switch 0196)';
 }
 
 if(element.cases){
  if(element.cases.length>0){
   for(var i=0;i<element.cases.length;i++){
    var leSw=element.cases[i];
    var laCondition='';
    if(leSw.cond){
     if(leSw.cond.nodeType==="Expr_ConstFetch"){
      laCondition=leSw.cond.name.name;
     }else{
      laCondition='#(todo php_traite_Stmt_Switch 205)';
     }
    }else{
     laCondition='#(erreur php_traite_Stmt_Switch 211)';
    }
    var lesInstructions='';
    if(leSw.stmts){
     if(leSw.stmts.length>0){
      niveau+=3;
      var obj1=TransformAstPhpEnRev(leSw.stmts , niveau);
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
  t+= '\n'+esp0+esp1+esp1+'valeur('+tabSw[i][0]+')';
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
  var obj=TransformAstPhpEnRev(element.stmts,niveau)
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
    var obj=TransformAstPhpEnRev(element.catches[numc].stmts,niveau)
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
   var obj=php_traite_Stmt_Expression(element.vars[i],niveau);
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
 
 var lesArguments='';
 
 if(element.args && element.args.length>0){
  for(var i=0;i<element.args.length;i++){
   var obj=php_traite_Stmt_Expression(element.args[i],niveau);
   if(obj.status===true){
    lesArguments+=',p('+obj.value+')';
   }else{
    t+='#(todo dans php_traite_Expr_FuncCall 0175 pas de expr )';
   }
  }
 }
 
 
 t+='appelf(nomf('+nomFonction+')'+lesArguments+')';
 return {'status':true,'value':t};
}
/*=====================================================================================================================*/

function php_traite_echo(element,niveau){
 console.log('%c entrée dans php_traite_echo element=','background:yellow;',element);
 var t='';
 var lesArguments='';
 if(element.exprs){
  for(var i=0;i<element.exprs.length;i++){
   var obj=php_traite_Stmt_Expression(element.exprs[i],niveau);
   if(obj.status===true){
    lesArguments+=',p('+obj.value+')';
   }else{
    t+='#(todo dans php_traite_Expr_FuncCall 0175 pas de expr )';
   }
   
  }
 }
 t+='appelf(nomf(echo)'+lesArguments+')'; ;
 return {'status':true,'value':t};
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
     lesArguments+=',\n'+esp0+esp1+esp1+'argument($'+element.params[i].var.name+')';
    }
   }else{
    lesArguments+='#(TODO 0278 dans php_traite_Stmt_Function)';
   }
  }
 }
 if(element.stmts && element.stmts.length>0){
  niveau+=2;
  var obj=TransformAstPhpEnRev(element.stmts,niveau)
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
   
   
   if(element.var.class){
    
    var nomClasse='';
    if(element.var.class.nodeType=="Name"){
     nomClasse=element.var.class.name;
    }else{
     nomClasse+='#(php_traite_Expr_MethodCall 0331),';
    }
    
    var lesArgumentsDeLaClass='';
    if(element.var.args){
     for(var i=0;i<element.var.args.length;i++){
      var obj=php_traite_Stmt_Expression(element.var.args[i],niveau);
      if(obj.status===true){
       lesArgumentsDeLaClass+=',p('+obj.value+')';
      }else{
       t+='#(todo dans php_traite_Expr_MethodCall 341)';
      }
     }
    }
    
    lelement+='element(new(appelf(nomf('+nomClasse+')'+lesArgumentsDeLaClass+'))),';
    
   }else{
    
    lelement+='element(new(#(php_traite_Expr_MethodCall 0323))),';
    
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
   var obj=php_traite_Stmt_Expression(element.args[i],niveau);
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
function php_traite_Expr_Assign(element,niveau){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);

 var gauche=''; 
 var droite=''; 
 if(element.var){
  if(element.var.nodeType==="Expr_Variable"){
    gauche='$'+element.var.name;
  }else if(element.var.nodeType==="Expr_ArrayDimFetch"){
   var obj=php_traite_Expr_ArrayDimFetch(element.var,niveau,0);
   if(obj.status===true){
    gauche+=obj.value;
   }else{
    gauche+='#(todo erreur dans php_traite_Expr_Assign 0450)';
   }   
  }else{
   gauche='#(todo dans php_traite_Stmt_Expression 0567 '+element.var.nodeType+')';
  }
 }else{
  gauche='#(todo dans php_traite_Stmt_Expression 0167 pas de variable '+element.nodeType+')';
 }

 if(element.expr){
  var obj=php_traite_Stmt_Expression( element.expr , niveau);
  if(obj.status===true){
   droite=obj.value;
  }else{
   droite='#(todo erreur dans php_traite_Stmt_Expression 0227 pas de expr '+element.nodeType+')';
  }
 }else{
  droite='#(todo dans php_traite_Stmt_Expression 0230 pas de expr '+element.nodeType+')';
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
  if("Scalar_String" === element.dim.nodeType){
   t+=',p(\''+element.dim.value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
  }else if("Expr_Variable" === element.dim.nodeType){
   t+=',p($'+element.dim.name+')';
  }else{
   t+=',p(#(todo erreur dans php_traite_Expr_ArrayDimFetch 0554))';
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
=====================================================================================================================
=====================================================================================================================
=====================================================================================================================
=====================================================================================================================
=====================================================================================================================
=====================================================================================================================
*/
function php_traite_Stmt_Expression(element,niveau){
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
 }else if("Scalar_String"===element.nodeType){

  t+="'"+element.value.replace(/\\/,'\\\\').replace(/\'/,'\\\'')+"'";


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
  var obj=php_traite_Stmt_Expression( element.value , niveau);
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
   
 }else if(element.nodeType==="Expr_Exit"){
  if(element.expr){
   var obj=php_traite_Stmt_Expression(element.expr,niveau);
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

 }else{
  
  console.log('%c 0845 non traité','background:red;color:yellow;',element)
  t+='#(todo dans php_traite_Stmt_Expression 701 '+element.nodeType+')';
  
  
  
 }
 
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Expr_Array(element , niveau){
 console.log('%c entrée dans php_traite_Expr_Array 0843 element=','background:pink;',element);
 var t='';
 
 //affecte($a , array(('title' , 'login') , ('description' , 'login'))),

 var lesElements='';
 if(element.items){
  for(var i=0;i<element.items.length;i++){
   if("ArrayItem"===element.items[i].nodeType){
    var cle='';
    if(element.items[i].key){
     
     var objcle=php_traite_Stmt_Expression(element.items[i].key,niveau);
     if(objcle.status===true){
      cle=objcle.value;
     }else{
      cle='#(TODO ERREUR dans php_traite_Expr_Array 0859)';
     }
     
     
    }
    if(element.items[i].value){
     var objValeur=php_traite_Stmt_Expression(element.items[i].value,niveau);
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
 t+='array('+lesElements+')';


 
 return {'status':true,'value':t}; 
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
  var objSiVrai=php_traite_Stmt_Expression(element.if,niveau);
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
  var objsiFaux=php_traite_Stmt_Expression(element.else,niveau);
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
  var obj=php_traite_Stmt_Expression(element.expr,niveau);
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
 var objGauche=php_traite_Stmt_Expression(element.left,niveau);
 if(objGauche.status===true){
  gauche=objGauche.value;
 }else{
  gauche='#(php_traite_Expr_BinaryOp_General ERREUR 0858)';
 }
 
 var droite='';
 var objdroite=php_traite_Stmt_Expression(element.right,niveau);
 if(objdroite.status===true){
  droite=objdroite.value;
 }else{
  droite='#(php_traite_Expr_BinaryOp_General ERREUR 0867)';
 }
 
 
 if(element.nodeType==='Expr_BinaryOp_Concat'){
  
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
  
 }else{
  
  t+='#(Traitement non prévu '+element.nodeType+' 0844 '+gauche+' , '+droite+')';
  
 }
 
 if((t.substr(0,14) === 'concat(concat(')){
     var o = functionToArray(t,true);
     if(o.status === true){
//         console.log('%c simplifier les concat concat','background:pink;',t,o.value);
         var nouveauTableau = baisserNiveauEtSupprimer(o.value,2,0);
         console.log('nouveauTableau=',nouveauTableau);
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
 
 var obj=php_traite_Stmt_Expression(element,niveau);
 if(obj.status===true){
  t+=obj.value;
 }else{
  t='#(condition ERREUR 0800)';
 }
 
 return {'status':true,'value':t};
 
}
//=====================================================================================================================
function php_traite_Stmt_If(element,niveau,unElseIfOuUnElse){
 console.log('%c entrée dans php_traite_Stmt_If 0794 element=','background:yellow;',element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 var conditionIf='';
 if(element.cond){
  var obj=php_traiteCondition1(element.cond,niveau);
  if(obj.status===true){
   conditionIf=obj.value;
  }else{
   conditionIf='#(TODO ERREUR dans php_traite_Stmt_If 0818)';
  }
   
 }else{
  conditionIf='#(pas de condition)';
 }
 
 var instructionsDansIf='';
 if(element.stmts){
  niveau+=3;
  var obj=TransformAstPhpEnRev(element.stmts,niveau);
  niveau-=3;
  if(obj.status===true){
   instructionsDansIf+=obj.value;
  }else{
   instructionsDansIf+='#(ERREUR 0902 '+element.else.stmts[i].nodeType+' )';
  }
 }else{
  instructionsDansIf='#(PAS instructions dans if)';
 }

 
 var listeDesElse='';
 var listeDesElseIf='';
 if(element.else){
  if(element.else.stmts){
   for(var i=0;i<element.else.stmts.length;i++){
    if(element.else.stmts[i].nodeType==="Stmt_If"){
     var obj=php_traite_Stmt_If(element.else.stmts[i],niveau,true);
     if(obj.status===true){
      listeDesElseIf+=obj.value;
     }else{
      listeDesElseIf+='#(ERREUR 894 '+element.else.stmts[i].nodeType+' )';
     }
    }else if(element.else.stmts[i].nodeType==="Stmt_Expression"){
     niveau+=2;
     var obj=php_traite_Stmt_Expression(element.else.stmts[i].expr,niveau);
     niveau-=2;
     if(obj.status===true){
      listeDesElse+=obj.value;
     }else{
      listeDesElse+='#(ERREUR 0902 '+element.else.stmts[i].nodeType+' )';
     }
    }else{
     listeDesElseIf+='#(ERREUR 890 '+element.else.stmts[i].nodeType+' )';
    }
   }
  }
 }
 if(unElseIfOuUnElse===false){
  t+='\n'+esp0+'choix('
  t+='\n'+esp0+esp1+'si('
  t+='\n'+esp0+esp1+esp1+'condition(('+conditionIf+'))';
  t+='\n'+esp0+esp1+esp1+'alors(\n'
  t+=instructionsDansIf
  t+='\n'+esp0+esp1+esp1+')';
  t+='\n'+esp0+esp1+')'
  t+='\n'+esp0+esp1+listeDesElseIf
  if(listeDesElse!==''){
   t+=''+esp0+'sinon(alors('+listeDesElse+'))'
  }
  t+='\n'+esp0+')'
 }else{
  if(conditionIf!==''){
   t+=  'sinonsi('
   t+='\n'+esp0+esp1+esp1+'condition(('+conditionIf+'))';
   t+='\n'+esp0+esp1+esp1+'alors(\n'
   t+=instructionsDansIf
   t+='\n'+esp0+esp1+esp1+')';
   t+='\n'+esp0+esp1+')'
   t+='\n'+esp0+esp1+listeDesElseIf
   if(listeDesElse!==''){
    t+=''+esp0+'sinon(alors('+listeDesElse+'))'
   }
  }else{
   listeDesElse='#(ERREUR 0936)'
/*   
   t+='\n'+esp0+esp1+'sinon('
   t+='\n'+esp0+esp1+esp1+'alors('+instructionsDansIf+')';
   t+='\n'+esp0+esp1+')'
   t+='\n'+esp0+esp1+listeDesElseIf
   if(listeDesElse!==''){
    t+='\n'+esp0+esp1+'sinon('+listeDesElse+')'
   }
*/   
  }
 }

 return {'status':true,'value':t};
}
//=====================================================================================================================
function TransformAstPhpEnRev(stmts,niveau){
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 
 if(stmts.length>0){
  for( var i=0;i<stmts.length;i++){
   if(t != ''){
       t+=',';
   }
   
   if("Stmt_Nop"===stmts[i].nodeType){
    
    
    t+='';
    
    
   }else if("Stmt_Echo"===stmts[i].nodeType){

    var obj=php_traite_echo( stmts[i] , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
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


    var obj=php_traite_Stmt_Expression( stmts[i].expr , niveau);
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
     }else {
      t+='\n'+esp0+'#(TODO return 780)';
     }
    
   }else if("Stmt_Break"===stmts[i].nodeType){
     
     if(stmts[i].num===null){
      t+='\n'+esp0+'break()';
     }else {
      t+='\n'+esp0+'#(TODO return 868)';
     }
    
   }else if("Stmt_InlineHTML"===stmts[i].nodeType){


     t+='\n'+esp0+'html(@(\''+stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'))';

   }else if("Stmt_Switch"===stmts[i].nodeType){

    var obj=php_traite_Stmt_Switch( stmts[i] , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR 814 "'+stmts[i].nodeType+'")';
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
//=====================================================================================================================
function traitementApresRecuperationAst(ret){
 
 console.log('ret=',ret);
 try{ 
  var ast=JSON.parse(ret.value);
  console.log('ast=',ast);
  var obj=TransformAstPhpEnRev(ast,0);
  if(obj.status===true){
   document.getElementById('resultat1').innerHTML='<pre style="font-size:0.8em;">'+obj.value.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</pre>'; //  style="white-space: normal;"
   document.getElementById('txtar2').value=obj.value;
   var obj1=functionToArray(obj.value,true);
   if(obj.status===true){
    astphp_logerreur({status:true,message:'pas d\'erreur pour le rev'});
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
    display_ajax_error_in_cons(jsonRet);
    console.log(r);
    alert('BAD job !');
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
function transform(){
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
function chargerSourceDeTest(){
// debut de backtic ``` ci dessous pour la variable t = = = = = = = = = = = = = = = = = = = = = = = = = 
 var t=`<?php
$a=realpath(dirname(dirname(dirname(__FILE__))));
require($a.'/phplib/vendor/autoload.php');
/*
https://github.com/nikic/php-parser
*/
use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;

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
hello<?php echo ' world';?> and others<?php

`;




// fin de backtic ``` ci dessus pour la variable t = = = = = = = = = = = = = = = = = = = = = = = = = 
 dogid('txtar1').value=t;
}
//=====================================================================================================================
function chargerLeDernierSource(){
 var fta_indexhtml_php_dernier_fichier_charge=localStorage.getItem("fta_indexhtml_php_dernier_fichier_charge");
// console.log('fta_indexhtml_javascript_dernier_fichier_charge=' , fta_indexhtml_javascript_dernier_fichier_charge );
 if(fta_indexhtml_php_dernier_fichier_charge!==null){
  dogid('txtar1').value=fta_indexhtml_php_dernier_fichier_charge;
 }
}

chargerLeDernierSource();
transform();