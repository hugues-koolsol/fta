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
  if(o.element.hasOwnProperty('attributes') && o.element.attributes.hasOwnProperty('startTokenPos')  && o.element.attributes.hasOwnProperty('endTokenPos') ){
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
function php_traite_Expr_Include(element,niveau){
 console.log('%c entrée dans php_traite_Expr_Include element=','background:yellow;',element);
 var t='';
 if(element.type===1){
  t+='include('
 }else if (element.type===2){
  t+='include_once('
 }else if (element.type===3){
  t+='require('
 }else if (element.type===4){
  t+='require_once('
 }
 var obj=php_traite_Stmt_Expression(element.expr);
 if(obj.status===true){
  t+=obj.value;
 }else{
  t+='#(todo dans php_traite_Expr_FuncCall 0175 pas de expr )';
 }
 t+=')';
 
 
 return {'status':true,'value':t};
}
//=====================================================================================================================
function php_traite_Stmt_Use(element,niveau){
 console.log('%c entrée dans php_traite_Stmt_Use element=','background:yellow;',element);
 var t='';

 for(var i=0;i<element.uses.length;i++){
  if("UseItem"===element.uses[i].nodeType){
   if(element.uses[i].name.nodeType === "Name"){
    t+='use(\''+element.uses[i].name.name+'\')';
   }else{
    t+='#(todo erreur dans php_traite_Stmt_Expression 0232 pour ' + element.nodeType + ' )';
   }
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0235 pour ' + element.nodeType + ' )';
  }
 }
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
  }else{
   t+='#(todo dans php_traite_Expr_FuncCall 0163 pas de name)';
  }
 }else{
   t+='#(todo dans php_traite_Expr_FuncCall 0168 pas de name)';
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
 console.log('%c entrée dans php_traite_echo element=','background:pink;',element);
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
/*
//=====================================================================================================================
//=====================================================================================================================
//=====================================================================================================================
//=====================================================================================================================
//=====================================================================================================================
//=====================================================================================================================
//=====================================================================================================================
*/
function php_traite_Stmt_Expression(element,niveau){
 console.log('%c entrée dans php_traite_Stmt_Expression element=','background:yellow;',element.type,element);
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 


 /*===============================================*/
 if("Stmt_Use"===element.nodeType){
  
 /*===============================================*/
 }else if("Expr_BinaryOp_Concat"===element.nodeType){
  
  
  if(element.left.nodeType==="Expr_Variable"){
   t+='$'+element.left.name;
  }else if(element.left.nodeType==="Scalar_String"){
   t+="'"+element.left.value.replace(/\\/,'\\\\').replace(/\'/,'\\\'')+"'";
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0236 pour ' + element.left.nodeType + ' )';
  }
  t+='.';
  if(element.right.nodeType==="Scalar_String"){
   t+="'"+element.right.value.replace(/\\/,'\\\\').replace(/\'/,'\\\'')+"'";
  }else if(element.right.nodeType==="Expr_Variable"){
   t+='$'+element.right.name;
  }else{
   t+='#(todo erreur dans php_traite_Stmt_Expression 0236 pour ' + element.left.nodeType + ' )';
  }
  
  
  
 /*===============================================*/
 }else if("Scalar_MagicConst_File"===element.nodeType){
  t+='__FILE__';
 
  
  
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
  
  if(element.var){
   if(element.var.nodeType==="Expr_Variable"){
     t+='\n'+esp0+'affecte( $a ,';
   }else{
    t+='#(todo dans php_traite_Stmt_Expression 0168 '+element.var.nodeType+')';
   }
  }else{
   t+='#(todo dans php_traite_Stmt_Expression 0167 pas de variable '+element.nodeType+')';
  }

  if(element.expr){
   var obj=php_traite_Stmt_Expression( element.expr , niveau);
   if(obj.status===true){
    t+=''+esp0+obj.value+')';
   }else{
    t+='#(todo erreur dans php_traite_Stmt_Expression 0227 pas de expr '+element.nodeType+')';
   }
  }else{
   t+='#(todo dans php_traite_Stmt_Expression 0230 pas de expr '+element.nodeType+')';
  }

  
//  t+='\n'+esp0+'#(todo dans php_traite_Stmt_Expression '+element.nodeType+')';
 

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

 }else{
  
  
  t+='#(todo dans php_traite_Stmt_Expression '+element.nodeType+')';
  
  
  
 }
 
 return {'status':true,'value':t};
}
//=====================================================================================================================
function TransformAstPhpEnRev(stmts,niveau){
 var t='';
 var t='';
 var esp0 = ' '.repeat(NBESPACESREV*(niveau));
 var esp1 = ' '.repeat(NBESPACESREV);
 
 if(stmts.length>0){
  for( var i=0;i<stmts.length;i++){
   if(t != ''){
       t+=',';
   }
   if("Stmt_Echo"===stmts[i].nodeType){

    var obj=php_traite_echo( stmts[i] , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR php_traite_Stmt_Use "'+stmts[i].nodeType+'")';
    }
    


   }else if("Stmt_If"===stmts[i].nodeType){


    t+='\n'+esp0+'#(todo dans TransformAstPhpEnRev if)';


   }else if("Stmt_Expression"===stmts[i].nodeType){


    var obj=php_traite_Stmt_Expression( stmts[i].expr , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR "'+stmts[i].nodeType+'")';
    }
    

   }else if("Stmt_Use"===stmts[i].nodeType){

    var obj=php_traite_Stmt_Use( stmts[i] , niveau);
    if(obj.status===true){
     t+='\n'+esp0+obj.value;
    }else{
     t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev ERREUR php_traite_Stmt_Use "'+stmts[i].nodeType+'")';
    }
    

    
    
   }else if("Stmt_InlineHTML"===stmts[i].nodeType){


     t+='\n'+esp0+'html(@(\''+stmts[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'))';
    

   }else{
    t+='\n'+esp0+'#(TODO dans TransformAstPhpEnRev "'+stmts[i].nodeType+'")';
    astphp_logerreur({'status':false,'message':'0395  dans TransformAstPhpEnRev nodeType non prévu "'+stmts[i].nodeType+'"','element':stmts[i] });
    
   }
  }
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
    return astphp_logerreur({status:true,message:'pas d\'erreur pour le rev'});
   }else{
    return astphp_logerreur({status:false,message:'erreur pour le rev'});
   }
  }
 }catch(e){
  return astphp_logerreur({status:false,message:'erreur de conversion du ast vers json 0409'})
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

/*===============================================*/

use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;

?>
hello<?php echo ' world';?> and others
<?php
/*===============================================*/

function recupererAstDePhp(&$data){
// $data['messages'][]=var_export( $data['input']['texteSource'] , true )  ;
 $parser = (new ParserFactory())->createForNewestSupportedVersion();
 try {
     $ast = $parser->parse($data['input']['texteSource']);
     $data['value']=json_encode($ast);
     $data['status']='OK';
 } catch (Error $error) {
    $data['messages'][]="Parse error: {$error->getMessage()}\\n";
    return;
 }
}
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
