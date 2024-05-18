"use strict";

/*
var a=0;
var b=0;
a = b, new String();
*/
/* =================================================================================== */
function astjs_logerreur(o){
    logerreur(o);
    if(rangeErreurSelectionne === false){
        if((o.hasOwnProperty('element')) && (o.element.hasOwnProperty('range'))){
            rangeErreurSelectionne=true;
            global_messages['ranges'].push(o.element.range);
        }
    }
    return o;
}
/* 
=================================================================================== 
point d'entrée = TransformAstEnRev

  }else if(
     //
        'ArrayExpression'       === element.type
     || 'AssignmentExpression'  === element.type
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
      if(obj1.status === true){
          [ todo ajuster ] 
          t+=obj1.value;
      }else{
          return(astjs_logerreur({status:false,'message':'erreur 0000 [ todo ajuster ] '}));
      }

=================================================================================== 

*/

function traiteUneComposante(element , niveau , parentEstCrochet , dansSiOuBoucle ){
    console.log('%c dans traiteUpdateExpress1 , element=','color:red;background:yellow;',element);
    var t='';
    var i=0;
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
 
    if('Literal' === element.type){
        if(element.regex){
            var leParam = '/'+element.regex.pattern+'/';
            if(element.regex.flags){
             leParam+=element.regex.flags;
            }
            t+=leParam;
        }else{
            t+=element.raw;
        }
        
    }else if('Identifier' === element.type){
        t+=element.name;
    }else if('MemberExpression' === element.type){
        var obj1 = traiteMemberExpression1(element,niveau,element,'');
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur pour traiteUneComposante 0049 '+element.type,element:element}));
        }
    }else if('UpdateExpression' === element.type){
        var objass = traiteUpdateExpress1(element,niveau,{'sansLF':true});
        if(objass.status === true){
            t+=objass.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteUneComposante 0051 pour '+element.type,element:element}));
        }
    }else if('CallExpression' === element.type){
        var obj1 = traiteCallExpression1(element,niveau,element,{});
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur pour traiteUneComposante 0056 '+element.type,element:element}));
        }
    }else if('ObjectExpression' === element.type){
        var obj1 = traiteObjectExpression1(element,niveau);
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({status:false,message:'erreur dans traiteUneComposante 0063',element:element}));
        }
    }else if('UnaryExpression' === element.type){
     
     
        var nomDuTestUnary = recupNomOperateur(element.operator);
        
        var obj1=traiteUneComposante(element.argument , niveau, parentEstCrochet , dansSiOuBoucle );
        if(obj1.status===true){
          t+=nomDuTestUnary+'('+obj1.value+')'
        }else{
            return(astjs_logerreur({status:false,message:'erreur dans traiteUneComposante 0076',element:element}));
        }

    }else if('LogicalExpression' === element.type){
        var obj = traiteLogicalExpression1(element,niveau,true);
        if(obj.status === true){
           if(dansSiOuBoucle){
               if(obj.value.substr(0,1) === ','){
                   t+=''+obj.value.substr(1)+'';
               }else{
                   t+=''+obj.value+'';
               }
           }else{
               if(obj.value.substr(0,1) === ','){
                   t+='condition('+obj.value.substr(1)+')';
               }else{
                   t+='condition('+obj.value+')';
               }
           }
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteUneComposante 0080 '}));
        }
    }else if('NewExpression' === element.type){
        var obj1 = traiteCallExpression1(element,niveau,element,{});
        if(obj1.status === true){
            t+='new('+obj1.value+')';
        }else{
            return(astjs_logerreur({status:false,'message':'erreur pour traiteUneComposante 0087 '+element.type,element:element}));
        }
    }else if('ArrayExpression' === element.type){
        var obj1 = traiteArrayExpression1(element,niveau);
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({status:false,message:'erreur dans traiteUneComposante 0094',element:element}));
        }
    }else if('BinaryExpression' === element.type){
        var obj1 = traiteBinaryExpress1(element,niveau,parentEstCrochet , dansSiOuBoucle);
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteUneComposante 0101 ',element:element}));
        }
    }else if('ConditionalExpression' === element.type){
        var obj1 = traiteConditionalExpression1(element,niveau);
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteUneComposante 0108 ',element:element}));
        }
    }else if('TemplateLiteral' === element.type){
        var obj1 = traiteTemplateLiteral1(element,niveau);
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteUneComposante 0115 ',element:element}));
        }
    }else if('FunctionExpression' === element.type){
        var obj1 = traiteFunctionExpression1(element,niveau,element,'');
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({status:false,message:'erreur dans traiteUneComposante 0147 ',element:element}));
        }

    }else if('AssignmentExpression' === element.type){

        var obj1 = traiteAssignmentExpress1(element,niveau,{'sansLF':true});
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteUneComposante 0136 ',element:element}));
        }

    }else if("ThisExpression" === element.type){
     
        t+='this';
        
    }else if("VariableDeclarator" === element.type){
//        var obj1 = traiteUneComposante(element.id   , niveau,parentEstCrochet , dansSiOuBoucle);
        var obj2 = traiteUneComposante(element.init , niveau,parentEstCrochet , dansSiOuBoucle);
        if(obj2.status===true){
          t+=obj2.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteUneComposante 0159 ',element:element}));
        }
        
        
    }else if("SequenceExpression" === element.type){
        
        for(i=0;i < element.expressions.length;i=i+1){
            niveau+=2;

            var obj1 = traiteUneComposante(element.expressions[i],niveau,parentEstCrochet , dansSiOuBoucle);
            niveau-=2;
            if(obj1.status === true){
                if(t != ''){
                    t+=',';
                }
                t+=obj1.value;
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteUneComposante 0158 pour '+element.type,element:element}));
            }
        }
        t='cascade('+t+')';
        
        
    }else{
        return(astjs_logerreur({status:false,'message':'erreur dans traiteUneComposante 0118 '+element.type,element:element}));
    } 

    return({status:true,value:t});

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
    }else if(s === '>>'){
        return 'decalDroite';
    }else if(s === 'in'){
        return 'in';
    }else if(s === 'delete'){
        return 'supprimer';
    }else if(s === 'void'){
        return 'void';
    }else{
        return('TODO recupNomOperateur pour "'+s+'"');
    }
}
/*
============================================================================
*/
function traiteConditionalExpression1(element,niveau){
    var t='';
    console.log('element=',element);

    var objtest1=traiteUneComposante(element.test , niveau , false , false );
    if(objtest1.status === true){
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour traiteConditionalExpression1 0180 '+element.type,element:element}));
    }
    
    var objSiVrai={};
    var objSiVrai=traiteUneComposante(element.consequent , niveau , false , false );
    if(objSiVrai.status === true){
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour traiteUpdateExpress1 1707 '+element.type,element:element}));
    }

    var objSiFaux={};

    var objSiFaux=traiteUneComposante(element.alternate , niveau , false , false );
    if(objSiFaux.status === true){
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour traiteUpdateExpress1 1707 '+element.type,element:element}));
    }
    
    t+='testEnLigne(condition(('+objtest1.value+')),siVrai('+objSiVrai.value+'),siFaux('+objSiFaux.value+'))';
    return({status:true,value:t});
}
/*
============================================================================
*/
function traiteBinaryExpress1(element,niveau,parentEstCrochet,dansSiOuBoucle){
    var t='';

    var nomDuTest = recupNomOperateur(element.operator);
//    debugger
    var gauche=traiteUneComposante(element.left , niveau , parentEstCrochet,dansSiOuBoucle );
    if(gauche.status === true){
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour traiteBinaryExpress1 0215 '+element.type,element:element}));
    }


    var droite=traiteUneComposante(element.right , niveau , parentEstCrochet,dansSiOuBoucle );
    if(droite.status === true){
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour traiteUpdateExpress1 0222 '+element.type,element:element}));
    }

    if( 
             ( element.right.type === 'Literal' && ( element.right.raw.substr(0,1)==="'" || element.right.raw.substr(0,1)==='"') && nomDuTest==='plus' )
          || ( element.left.type === 'Literal'  && ( element.left.raw.substr(0,1)==="'"  || element.left.raw.substr(0,1)==='"' ) && nomDuTest==='plus' )
     ){
      
       t+='concat('+gauche.value+','+droite.value+')';
     
     }else if( (parentEstCrochet) && ( (nomDuTest === 'plus') || (nomDuTest === 'moins')) ){
     
             
       if(
       
            ( element.right.type == 'Literal'               && element.left.type === 'CallExpression' )
         || ( element.right.type == 'ConditionalExpression' && element.left.type === 'CallExpression' )
         || ( element.right.type == 'Literal'               && element.left.type === 'Identifier' )
         || ( element.right.type == 'Identifier'            && element.left.type === 'Identifier' )
         
      ){
       
        t+=''+gauche.value+element.operator+droite.value+'';
        
      }else{
       
        t+=''+nomDuTest+'('+gauche.value+','+droite.value+')';
        
      }
    
    }else{
        t+=''+nomDuTest+'('+gauche.value+','+droite.value+')';
    }




    if( t.substr(0,14) === 'concat(concat(' || t.substr(0,12) === 'concat(plus('  || t.substr(0,12) === 'plus(concat('  ){
        var o = functionToArray(t,true,false,'');
        if(o.status === true){
            console.log('%c simplifier les concat concat','background:pink;',t,o.value);
            var nouveauTableau = baisserNiveauEtSupprimer(o.value,2,0);
            console.log('nouveauTableau=',nouveauTableau);
            var obj = a2F1(nouveauTableau,0,false,1,false);
            if(obj.status === true){
                console.log('apres simplification obj.value=',obj.value);
                t=obj.value;
            }
        }else{
          return(astjs_logerreur({status:false,'message':'erreur pour traiteBinaryExpress1 0380 pour la simplification '+element.type,element:element}));
         
        }
    }
    if((t.substr(0,10) === 'plus(plus(') || (t.substr(0,12) === 'moins(moins(')){
        var o = functionToArray(t,true,false,'');
        if(o.status === true){
            console.log('%c simplifier les plus plus','background:pink;',t,o.value);
            var nouveauTableau = baisserNiveauEtSupprimer(o.value,2,0);
            console.log('nouveauTableau=',nouveauTableau);
            var obj = a2F1(nouveauTableau,0,false,1,false);
            if(obj.status === true){
                console.log('apres simplification obj.value=',obj.value);
                t=obj.value;
            }
        }
    }
    if(t.substr(0,6) === 'moins('){
        var o = functionToArray(t,true,false,'');
        if(o.status === true){
            console.log('%c réduire les moins(a,b)','background:pink;',t,o.value);
            var i=0;
            var bCont=true;
            var cumu='';
            var i=2;
            for(i=2;(i < o.value.length) && (bCont === true);i=i+1){
                if((o.value[i][2] === 'c') && (o.value[i][4] === 0)){
                    cumu+='-'+o.value[i][1];
                }else{
                    bCont=false;
                    break;
                }
            }
            if(bCont === true){
                cumu=cumu.substr(1);
                console.log('%c réduire les moins(a,b)','background:pink;',t,o.value,'cumu=',cumu);
                t=cumu;
            }
        }
    }
    console.log('%c sortie de traiteBinaryExpress1 element=','color:red;background:yellow;font-weight:bold;',element,'t='+t);
    return({status:true,value:t});
}
function traiteLogicalExpression1(element,niveau,dansSiOuBoucle){
    var t='';
    if((element.left) && (element.right)){
        var obj1 = js_traiteCondition1(element.left,niveau,dansSiOuBoucle);
        if(obj1.status === true){
            t+=''+obj1.value+'';
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteLogicalExpression1 0274 ',element:element}));
        }
        if('&&' == element.operator){
            t+=',et';
        }else if('||' == element.operator){
            t+=',ou';
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteLogicalExpression1 0436 '+element.operator,element:element}));
        }
        var obj2 = js_traiteCondition1(element.right,niveau,dansSiOuBoucle);
        if(obj2.status === true){
            t+='('+obj2.value+')';
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteLogicalExpression1 443 '+element.operator,element:element}));
        }
    }else{
        console.error('traiteLogicalExpression1 todo 72 ',element);
        return(astjs_logerreur({'status':false,'message':'erreur dans traiteLogicalExpression1 0238 ',element:element}));
    }
    return({status:true,value:t});
}
function js_traiteCondition1(element,niveau,dansSiOuBoucle){
    var t='';
    var i=0;
    var j=0;
    
    var obj1=traiteUneComposante(element , niveau , false,dansSiOuBoucle );
    if(obj1.status === true){
        t+='('+obj1.value+')';
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour js_traiteCondition1 0614 '+element.type,element:element}));
    }

    /*
      il faut transformer ceci :
      [[[egal[a,1]],ou[[egal[b,2]]]],ou[[egal[c,3]]]],
      en ceci
      [[egal[d,1]],ou[[egal[e,2]]],ou[[egal[f,3]]]]
    */

    var o = functionToArray(t,true,true,''); // si on reçoit un [], par exemple window.dataLayer = window.dataLayer || []; dans le source google
    if(o.status === true){
        if((o.value.length > 3) && (o.value[1][1] == '') && (o.value[1][2] == 'f') && (o.value[2][1] == '') && (o.value[2][2] == 'f') && (o.value[3][1] == '') && (o.value[3][2] == 'f')){
            var enfantDe2='';
            var onContinue=true;
            for(i=0;(i < o.value.length) && (onContinue === true);i=i+1){
                if(o.value[i][7] === 2){
                    if(o.value[i][1] != ''){
                        if(enfantDe2 == ''){
                            enfantDe2=o.value[i][1];
                        }else{
                            if(enfantDe2 != o.value[i][1]){
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
                for(i=0;(i < o.value.length) && (onContinue === true);i=i+1){
                    if(o.value[i][7] === 1){
                        if(o.value[i][1] != ''){
                            if(enfantDe1 == ''){
                                enfantDe1=o.value[i][1];
                                if(enfantDe1 !== enfantDe2){
                                    onContinue=false;
                                    break;
                                }
                            }else{
                                if(enfantDe1 != o.value[i][1]){
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
                var nouveauTableau = baisserNiveauEtSupprimer(o.value,2,0);
                var obj = a2F1(nouveauTableau,0,false,1,false);
                console.log('obj=',obj);
                if(obj.status === true){
                    t=obj.value;
                }
            }
        }
    }
    return({status:true,value:t});
}
function traiteForIn1(element,niveau){
    console.log('%c dans traiteForIn1, element=','color:green;font-weight:bold;background:yellow;',element);
    t+=ajouteCommentaireAvant(element,niveau);
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomVariable='';
    var nomObjet='';
    var pourInit='';
    if(element.left.type === 'VariableDeclaration'){
        var objDecl = traiteDeclaration1(element.left,niveau);
        if(objDecl.status === true){
            t+='declare('+objDecl.nomVariable+' , obj() ),';
            nomVariable=objDecl.nomVariable;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur pour traiteForIn1 0351 '+element.left.type,element:element}));
        }
    }else if(element.left.type === 'Identifier'){
        nomVariable=element.left.name;
    }else if(element.left.type === 'MemberExpression'){
        var obj1 = traiteMemberExpression1(element.left,niveau,element,'');
        if(obj1.status === true){
            nomVariable=obj1.value;
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteForIn1 0318 ',element:element}));
        }
    }else{
        console.log('element.left.type=',element.left.type);
        return(astjs_logerreur({status:false,'message':'erreur pour traiteForIn1 0414 '+element.left.type,element:element}));
    }
    if(element.right.type === 'Identifier'){
        nomObjet=element.right.name;
    }else if(element.right.type === 'MemberExpression'){
        var obj1 = traiteMemberExpression1(element.right,niveau,element,'');
        if(obj1.status === true){
            nomObjet=obj1.value;
        }else{
            return(astjs_logerreur({'status':false,'message':'erreur dans traiteCondition1 0318 ',element:element}));
        }
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour traiteForIn1 0421 '+element.right.type,element:element}));
    }
    t+='\n'+esp0+'boucleSurObjet(';
    t+='\n'+esp0+esp1+'pourChaque(dans('+nomVariable+' , '+nomObjet+')),';
    t+='\n'+esp0+esp1+'faire(';
    niveau+=1;
    if(element.body){
        var obj3 = TransformAstEnRev(element.body,niveau);
    }else{
     
        if(element.expression){
            var obj3=traiteUneComposante(element.expression , niveau, false , false ); //parentEstCrochet , dansSiOuBoucle );
        }else{
         return(astjs_logerreur({status:false,'message':'erreur pour traiteForIn1 0580 rien à faire dans la boucle ',element:element}));
        }

    }
    niveau-=1;
    if(obj3.status === true){
        t+=obj3.value;
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteFor1 152 pour '+element.type,element:element}));
    }
    t+='\n'+esp0+esp1+')';
    t+='\n'+esp0+')';
    return({status:true,value:t});
}

function traiteSwitch1(element,niveau){
    var t='';
    var i=0;
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    console.log('%c dans traiteSwitch1, element=','color:green;font-weight:bold;background:yellow;',element);
    
    
    t+='\n'+esp0+'bascule('
    
    var obj1=traiteUneComposante(element.discriminant , niveau, false , false );
    if(obj1.status===true){
      t+='\n'+esp0+esp1+'quand('+obj1.value+')';
    }else{
        return(astjs_logerreur({status:false,message:'erreur dans traiteSwitch1 0548',element:element}));
    }
    
    for(i=0;i<element.cases.length;i++){
     t+=',\n'+esp0+esp1+'est(';
     if(element.cases[i].test!==null){
      var obj1=traiteUneComposante(element.cases[i].test , niveau, false , false );
      if(obj1.status===true){
        t+='\n'+esp0+esp1+esp1+'valeur('+obj1.value+')';
      }else{
        return(astjs_logerreur({status:false,message:'erreur dans traiteSwitch1 0562',element:element}));
      }
     }else{
      t+= '\n'+esp0+esp1+esp1+'valeurNonPrevue()';
     }
     t+=',\n'+esp0+esp1+esp1+'faire(\n';
     if(element.cases[i].consequent && element.cases[i].consequent.length>0){
      niveau+=3;
      var obj1=TransformAstEnRev(element.cases[i].consequent,niveau);
      niveau-=3;
      if(obj1.status===true){
        t+=obj1.value;
      }else{
        return(astjs_logerreur({status:false,message:'erreur dans traiteSwitch1 0573',element:element}));
      }
     }
     t+= '\n'+esp0+esp1+esp1+')';
     t+= '\n'+esp0+esp1+')';
    }
    t+='\n'+esp0+')'
    
    return({status:true,value:t});
}

function traiteWhile1(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    console.log('%c dans traiteWhile1, element=','color:green;font-weight:bold;background:yellow;',element);
    t+=ajouteCommentaireAvant(element,niveau);

    
    
    t+='\n'+esp0+'tantQue(';
    t+='\n'+esp0+esp1+'condition(';
    var obj2 = js_traiteCondition1(element.test,0,true);
    if(obj2.status === true){
        t+=''+obj2.value;
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteWhile1 0525 pour '+element.type,element:element}));
    }
    t+='\n'+esp0+esp1+'),';
    t+='\n'+esp0+esp1+'faire(';
    
    niveau+=1;
    if(element.body){
        var obj3 = TransformAstEnRev(element.body,niveau);
    }else{
     
        if(element.expression){
            var obj3=traiteUneComposante(element.expression , niveau, false , false ); //parentEstCrochet , dansSiOuBoucle );
        }else{
         return(astjs_logerreur({status:false,'message':'erreur pour traiteWhile1 0671 rien à faire dans la boucle ',element:element}));
        }
     
    }
    niveau-=1;
    if(obj3.status === true){
        t+=obj3.value;
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteWhile1 538 pour '+element.type,element:element}));
    }
    
    t+='\n'+esp0+esp1+'),';
    t+='\n'+esp0+'),';
    
    
    return({status:true,value:t});
 
 
}
function traiteFor1(element,niveau){
    var t='';
    var i=0;
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    console.log('%c dans traiteFor1, element=','color:green;font-weight:bold;background:yellow;',element);
    t+=ajouteCommentaireAvant(element,niveau);
    var pourInit='';
    if(element.init.type === 'VariableDeclaration'){
        var objDecl = traiteDeclaration1(element.init,niveau);
        if(objDecl.status === true){
            t+=objDecl.value;
            if(pourInit != ''){
                pourInit+=',';
            }
            pourInit+=objDecl.value.replaceAll('declare','affecte').replaceAll('\\n','');
        }else{
            return(astjs_logerreur({status:false,'message':'erreur pour traiteFor1 134 '+element.init.type,element:element}));
        }
    }else if('SequenceExpression' == element.init.type){
     
        var obj1 = traiteUneComposante(element.init , niveau , false   , false   );//    [[ parentEstCrochet , dansSiOuBoucle
        if(obj1.status === true){
             if(pourInit != ''){
                 pourInit+=',';
             }
             pourInit+=obj1.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur 0000 [ todo ajuster ] '}));
        }
/*     
        for(i=0;i < element.init.expressions.length;i=i+1){
            niveau+=2;
            var obj1 = traiteAssignmentExpress1(element.init.expressions[i],niveau,{'sansLF':true});
            niveau-=2;
            if(obj1.status === true){
                if(pourInit != ''){
                    pourInit+=',';
                }
                pourInit+=obj1.value;
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteFor1 213 pour '+element.type,element:element}));
            }
        }
*/        
    }else if('AssignmentExpression' == element.init.type){
        var objass0 = traiteAssignmentExpress1(element.init,niveau,{'sansLF':true});
        if(objass0.status === true){
            pourInit=objass0.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteFor1 248 pour '+element.type,element:element}));
        }
    }else{
        console.log('element.init.type=',element.init.type);
    }
    t+='\n'+esp0+'boucle(';
    t+='\n'+esp0+esp1+'initialisation(';
    if(pourInit != ''){
        t+=pourInit;
    }else{
        t+=' 0569 TODO';
    }
    t+=')';
    t+='\n'+esp0+esp1+'condition(';
    var obj2 = js_traiteCondition1(element.test,0,true);
    if(obj2.status === true){
        t+=''+obj2.value;
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteFor1 238 pour '+element.type,element:element}));
    }
    t+=')';
    var valeurIncrement='';
    if(element.update.type === 'AssignmentExpression'){
        var objass = traiteAssignmentExpress1(element.update,niveau,{'sansLF':true});
        if(objass.status === true){
            valeurIncrement=objass.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteFor1 0613 pour '+element.type,element:element}));
        }
    }else if(element.update.type === 'UpdateExpression'){
        var objass = traiteUpdateExpress1(element.update,niveau,{'sansLF':true});
        if(objass.status === true){
            valeurIncrement=objass.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteFor1 0621 pour '+element.type,element:element}));
        }
    }else{
        t+='TODO)';
        return(astjs_logerreur({status:false,'message':'erreur traiteFor1 0625 pour '+element.type,element:element}));
    }
    t+='\n'+esp0+esp1+'increment('+valeurIncrement+')';
    t+='\n'+esp0+esp1+'faire(';
    niveau+=1;
    if(element.body){
        var obj3 = TransformAstEnRev(element.body,niveau);
    }else{
        if(element.expression){
            var obj3=traiteUneComposante(element.expression , niveau, false , false ); //parentEstCrochet , dansSiOuBoucle );
        }else{
         return(astjs_logerreur({status:false,'message':'erreur pour traiteFor1 0671 rien à faire dans la boucle ',element:element}));
        }

    }
    niveau-=1;
    if(obj3.status === true){
        t+=obj3.value;
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteFor1 152 pour '+element.type,element:element}));
    }
    t+='\n'+esp0+esp1+')';
    t+='\n'+esp0+')';
    return({status:true,value:t});
}
function traiteIf1(element,niveau,type){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if(t !== ''){
        t+=',';
    }
    if(type == 'if'){
        t+='\n'+esp0+'choix(';
        t+='\n'+esp0+esp1+'si(';
        t+='\n'+esp0+esp1+esp1+'condition(';
        var obj2 = js_traiteCondition1(element.test,0,true);
        if(obj2.status === true){
            t+=''+obj2.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteIf1 135 pour '+element.type,element:element}));
        }
        t+='),';
    }else{
        if(element.test){
            t+='\n'+esp0+esp1+'sinonsi(';
            t+='\n'+esp0+esp1+esp1+'condition(';
            var obj2 = js_traiteCondition1(element.test,0,true);
            if(obj2.status === true){
                t+=''+obj2.value;
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteIf1 372 pour '+element.type,element:element}));
            }
            t+='),';
        }else{
            t+='\n'+esp0+esp1+'sinon(';
        }
    }
    t+='\n'+esp0+esp1+esp1+'alors(';
    niveau+=3;
    if(element.consequent){
        if(element.consequent.body){
            var obj3 = TransformAstEnRev(element.consequent.body,niveau);
        }else{
         var obj3=TransformAstEnRev([element.consequent],niveau);
/*         
            if(element.consequent.type === 'ExpressionStatement'){
                var obj3 = traiteExpression1(element.consequent,niveau);
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteIf1 0817 pour '+element.type,element:element}));
            }
*/            
        }
    }else{
        if(element.body){
            var obj3 = TransformAstEnRev(element.body,niveau);
        }else if(element.expression){
            var obj3=traiteUneComposante(element.expression , niveau, false , false ); //parentEstCrochet , dansSiOuBoucle );

        }else{

            return(astjs_logerreur({status:false,'message':'erreur traiteIf1 0819 pour '+element.type,element:element}));
        }
    }
    niveau-=3;
    if(obj3.status === true){
        t+='\n'+esp0+esp1+esp1+esp1+obj3.value;
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteIf1 0826 pour '+element.type,element:element}));
    }
    if(element.alternate){
        positionDebutBloc=element.alternate.range[0];
        t+=ajouteCommentaireAvant(element.alternate,(niveau+3));
    }else{
        if(type == 'else'){
            /* il n'y a pas d'alternate mais il y a peut être des commentaires à la fin */
            positionDebutBloc=element.range[1];
            t+=ajouteCommentaireAvant(element,(niveau+3));
        }
    }
    t+='\n'+esp0+esp1+esp1+')';
    t+='\n'+esp0+esp1+')';
    if(element.alternate){
        var obj3 = traiteIf1(element.alternate,niveau,'else');
        if(obj3.status === true){
            t+=obj3.value;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteIf1 170 pour '+element.type,element:element}));
        }
    }
    if(type == 'if'){
        t+='\n'+esp0+')';
    }
    return({status:true,value:t});
}
function traiteCallExpression1(element,niveau,parent,opt){
    console.log('%c dans traiteCallExpression1 element=','color:red;background:yellow;font-weight:bold;',element,'parent=',parent);
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    var parentProperty='';
    if(parent.property){
        if(parent.computed && parent.computed===true){
         /*
         le parent est un tableau => les propriétés sont les indices du tableau
         */
        }else{
            if(parent.property.type === 'Identifier'){
                parentProperty='prop('+parent.property.name+')';
            }else if(parent.property.type === 'Literal'){
                parentProperty='prop('+parent.property.raw+')';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteCallExpression1 0514 '+parent.property.type,element:element}));
            }
        }
    }
    if(opt['sansLF']){
        LF='';
        esp0='';
        esp1='';
    }
    ///ajouter le body ici
    var contenu='';
    if(element.body){
        niveau+=2;
        var obj = TransformAstEnRev(element.body,niveau);
        if(obj.status === true){
            contenu=obj.value;
        }else{
            return(astjs_logerreur({status:false,message:'erreur dans traiteCallExpression1 pour body',element:element}));
        }
        niveau-=2;
    }
    
    
    console.log('element=',element);
    var lesArguments='';
    if((element.arguments) && (element.arguments.length > 0)){
        var i=0;
        for(i=0;i < element.arguments.length;i=i+1){
            lesArguments+=',';
            
            if('CallExpression' === element.arguments[i].type){
                var obj1 = traiteCallExpression1(element.arguments[i],niveau,element,{'sansLF':true});
                if(obj1.status === true){
                    if(obj1.value.substr(0,6) === 'defTab'){
                        lesArguments+='p('+obj1.value+')';
                    }else if(obj1.value.substr(0,6) === 'appelf'){
                        lesArguments+='p('+obj1.value+')';
                    }else{
                        lesArguments+='p(appelf('+obj1.value+'))';
                    }
                }else{
                  console.error('Dans traiteCallExpression1 element=',element);
                  return(astjs_logerreur({status:false,message:'erreur traiteCallExpression1 479 ',element:element}));
                }
                
            }else{
                var obj1=traiteUneComposante(element.arguments[i] , niveau, false , false ); //parentEstCrochet , dansSiOuBoucle );
                if(obj1.status===true){
                  lesArguments+='p('+obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteCallExpression1 0722',element:element}));
                }
            }
        }
    }
    if(lesArguments === ''){
        lesArguments=parentProperty;
    }else{
        if(parentProperty !== ''){
            lesArguments=lesArguments+','+parentProperty;
        }
    }
    var laPropriete='';
    if(element.callee){
        if(element.callee.property){
            if(element.callee.property.type === 'Identifier'){
                if((element.callee.object) && (element.callee.object.type === 'Identifier')){
                    if(contenu===''){
                     t+='appelf(element('+element.callee.object.name+'),nomf('+element.callee.property.name+')'+lesArguments+')';
                    }else{
                     t+='appelf(element('+element.callee.object.name+'),nomf('+element.callee.property.name+')'+lesArguments+',contenu('+contenu+'))';
                    }
                }else if((element.callee.object) && (element.callee.object.type === 'Literal')){
                    if(contenu===''){
                       t+='appelf(element('+element.callee.object.raw+'),nomf('+element.callee.property.name+')'+lesArguments+')';
                    }else{
                       t+='appelf(element('+element.callee.object.raw+'),nomf('+element.callee.property.name+')'+lesArguments+',contenu('+contenu+'))';
                    }
                }else{
                    if((element.callee.object) && (element.callee.object.type === 'MemberExpression') &&  !(((element.callee.object.object) && (element.callee.object.property) && (element.callee.object.object.type === 'Identifier')) && (element.callee.object.property.type === 'Identifier'))){
                        var obj1 = traiteMemberExpression1(element.callee.object,niveau,element,'');
                        if(obj1.status === true){
                            if(contenu===''){
                                t+='appelf(element('+obj1.value+'),nomf('+element.callee.property.name+')'+lesArguments+')';
                            }else{
                                t+='appelf(element('+obj1.value+'),nomf('+element.callee.property.name+')'+lesArguments+',contenu('+contenu+'))';
                            }
                        }else{
                            return(astjs_logerreur({status:false,message:'erreur dans traiteCallExpression1 485 ',element:element}));
                        }
                    }else{
                        if(contenu===''){
                         laPropriete='prop(appelf(nomf('+element.callee.property.name+')'+lesArguments+'))';
                        }else{
                         console.error('\n\nATTENTION VERIFIER CECI\n\n')
                         laPropriete='prop(appelf(nomf('+element.callee.property.name+')'+lesArguments+',contenu('+contenu+')))';
                        }
                    }
                }
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteCallExpression1 0887 ',element:element}));
            }
        }
        if(element.callee.object){
            if(element.callee.object.type === 'CallExpression'){
                var obj1 = traiteCallExpression1(element.callee.object,niveau,element,{});
                if(obj1.status === true){
                    if((obj1.value.substr(0,6) === 'appelf') && (obj1.value.substr(obj1.value.length-1,1) === ')')){
                        t+=''+obj1.value.substr(0,obj1.value.length-1)+','+laPropriete+')';
                    }else{
                        if(contenu===''){
                            t+='appelf('+obj1.value+','+laPropriete+')';
                        }else{
                            t+='appelf('+obj1.value+','+laPropriete+',contenu('+contenu+'))';
                        }
                    }
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteCallExpression1 0900 ',element:element}));
                }
            }else if(element.callee.object.type === 'ArrayExpression'){
             
                var obj1 = traiteArrayExpression1(element.callee.object,niveau);
                if(obj1.status === true){
                    /* 
                     obj1.value   = defTab(p(0))
                     laPropriete  = prop(appelf(nomf(x),p(cp)))
                     => appelf(element(defTab(p(0)),nomf(x),p(cp))
                    */
                    if(obj1.value.substr(0,7)==='defTab(' && laPropriete.substr(0,12)=='prop(appelf('){
                     var t1=laPropriete.substr(5,laPropriete.length-5-2)+',element('+obj1.value+'))';

                     t+=t1;
                    }else{
                        if(contenu===''){
                            t+='appelf('+obj1.value+','+laPropriete+')';
                        }else{
                            t+='appelf('+obj1.value+','+laPropriete+',contenu('+contenu+'))';
                        }
                    }
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteArrayExpression1 567 ',element:element}));
                }
                             
            }else if(element.callee.object.type === 'MemberExpression'){
                var obj1 = traiteMemberExpression1(element.callee.object,niveau,element,'');
                if(obj1.status === true){
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteCallExpression1 485 ',element:element}));
                }
                if((element.callee.object.object) && (element.callee.object.property) && (element.callee.object.object.type === 'Identifier') && (element.callee.object.property.type === 'Identifier')){
                    if(contenu===''){
                        t='appelf(element('+obj1.value+'),nomf('+element.callee.property.name+')'+lesArguments+')';
                    }else{
                        t='appelf(element('+obj1.value+'),nomf('+element.callee.property.name+')'+lesArguments+',contenu('+contenu+'))';
                    }
                }else{
                    /*
                      Traité plus haut en repère xxx001    
                      var obj1=traiteMemberExpression1[element.callee.object,niveau,element,''];
                      if[obj1.status===true]{
                      t+='appelf[nomf['+obj1.value+']'+laPropriete+']';
                      }else{
                      return astjs_logerreur[{status:false,message:'erreur dans traiteCallExpression1 485 ',element:element }]
                      }
                    */
                }
            }else if(element.callee.object.type === 'Identifier'){
            }else if(element.callee.object.type === 'Literal'){
            }else if(element.callee.object.type === 'ThisExpression'){
                if(contenu===''){
                    t='appelf(element(this),nomf('+element.callee.property.name+')'+lesArguments+')';
                }else{
                    t='appelf(element(this),nomf('+element.callee.property.name+')'+lesArguments+',contenu('+contenu+'))';
                }
            }else{
                
                return(astjs_logerreur({status:false,'message':'erreur dans traiteCallExpression1 0618 '+element.callee.object.type,element:element}));
            }
        }else if(element.callee.type === 'Identifier'){
            if(element.callee.name==='Array' && laPropriete===''){
                if(lesArguments.length>0 && lesArguments.substr(0,1)===','){
                 lesArguments=lesArguments.substr(1);
                }
                t+='defTab('+lesArguments+')';
//                t+='tableau(nomt('+element.callee.name+')'+lesArguments+')';
            }else{
                if(contenu===''){
                    t+='appelf(nomf('+element.callee.name+')'+lesArguments+laPropriete+')';
                }else{
                    t+='appelf(nomf('+element.callee.name+')'+lesArguments+laPropriete+',contenu('+contenu+'))';
                }
            }
        }else if(element.callee.type === 'FunctionExpression'){
            var obj1 = traiteFunctionExpression1(element.callee,niveau,element,'');

            if(obj1.status === true){
                if(contenu===''){
                    t+='appelf(nomf('+obj1.value+')'+lesArguments+laPropriete+')';
                }else{
                    t+='appelf(nomf('+obj1.value+')'+lesArguments+laPropriete+',contenu('+contenu+'))';
                }

            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteUneComposante 0147 ',element:element}));
            }
            
        }else{
            return(astjs_logerreur({status:false,message:'erreur dans traiteCallExpression1 0933 '+element.callee.type,element:element}));
        }
    }
    return({status:true,value:t});
}
function traiteFunctionExpression1(element,niveau){
    var t='';
    var lesArguments='';
    var contenu='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if((element.params) && (element.params.length > 0)){
        var i=0;
        for(i=0;i < element.params.length;i=i+1){
            lesArguments+=',';
            if('Identifier' === element.params[i].type){
                lesArguments+='p('+element.params[i].name+')';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteFunctionExpression1 1054 ',element:element}));
            }
        }
    }
    if(element.body){
        niveau+=2;
        var obj = TransformAstEnRev(element.body,niveau);
        if(obj.status === true){
            contenu=obj.value;
        }else{
            return(astjs_logerreur({status:false,message:'erreur dans traiteFunctionExpression1 pour body',element:element}));
        }
        niveau-=2;
    }
    if(element.id){
     if(element.id.type==="Identifier"){
      t='appelf(id('+element.id.name+'),nomf(function) '+lesArguments+',contenu('+contenu+'))';
     }else{
       return(astjs_logerreur({status:false,message:'erreur dans traiteFunctionExpression1 pour element.id.type='+element.id.type,element:element}));
     }
    }else{
     t='appelf(nomf(function) '+lesArguments+',contenu('+contenu+'))';
    }
    return({status:true,value:t});
}
function traiteArrayExpression1(element,niveau){
    console.log('%c dans traiteArrayExpression1, element=','color:red;font-weight:bold;background:yellow;',element);
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    
    t+='defTab(';
//    t+='nomt()';
    var lesPar='';
    var i={};
    for(i in element.elements){
        if(element.elements[i].type === 'Literal'){
            lesPar+=',p('+element.elements[i].raw+')';
        }else if(element.elements[i].type === 'Identifier'){
            lesPar+=',p('+element.elements[i].name+')';
        }else if(element.elements[i].type === 'ArrayExpression'){
            var obj1 = traiteArrayExpression1(element.elements[i],niveau);
            if(obj1.status === true){
                lesPar+=',p('+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteArrayExpression1 567 ',element:element}));
            }
        }else if(element.elements[i].type === 'MemberExpression'){
            var obj1 = traiteMemberExpression1(element.elements[i],niveau,element,'');
            if(obj1.status === true){
                lesPar+=',p('+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteObjectExpression1 0799 pour '+eval.value.type,element:element}));
            }
        }else if(element.elements[i].type === 'CallExpression'){
            var obj1 = traiteCallExpression1(element.elements[i],element,{},'');
            if(obj1.status === true){
                lesPar+=',p('+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteObjectExpression1 0799 pour '+eval.value.type,element:element}));
            }
        }else if(element.elements[i].type === "FunctionExpression"){
         
            var obj1 = traiteFunctionExpression1(element.elements[i],niveau,element,'');
            if(obj1.status === true){
                lesPar+=',p('+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteArrayExpression1 1103 ',element:element}));
            }
         
        }else if(element.elements[i].type === "BinaryExpression"){
            var obj1 = traiteUneComposante(element.elements[i] , niveau , true , false );
            if(obj1.status === true){
                lesPar+=',p('+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteArrayExpression1 1111',element:element}));
            }
            
        }else{
            return(astjs_logerreur({status:false,'message':'erreur dans traiteArrayExpression1 1388 "'+element.elements[i].type+'"',element:element.elements[i]}));
        }
    }
    if(lesPar.length>=0){
     lesPar=lesPar.substr(1);
    }
    t+=lesPar+')';
    if(t === 'appelf(nomf(Array))'){
        t='[]';
    }
    return({status:true,value:t});
}
function traiteObjectExpression1(element,niveau){
    console.log('%c dans traiteObjectExpression1, element=','color:red;font-weight:bold;background:yellow;',element);
    var t='';
    var i={};
    for(i in element.properties){
        if(t !== ''){
            t+=',';
        }
        var val=element.properties[i];
        if(val.key.type === 'Identifier'){
            t+='('+val.key.name+',';
        }else if(val.key.type === 'Literal'){
            t+='('+val.key.raw+',';
        }else{
            return(astjs_logerreur({status:false,'message':'erreur dans traiteObjectExpression1 609 '+val.key.type,element:element}));
            t+='(TODO_FOR_KEY_'+val.key.type+' , ';
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
       if(
             'ArrayExpression'       === val.value.type
          || 'BinaryExpression'      === val.value.type
          || 'CallExpression'        === val.value.type
          || 'ConditionalExpression' === val.value.type
          || 'FunctionExpression'    === val.value.type
          || 'Identifier'            === val.value.type
          || 'Literal'               === val.value.type
          || 'LogicalExpression'     === val.value.type
          || 'MemberExpression'      === val.value.type
          || 'ObjectExpression'      === val.value.type
       ){
           var obj1 = traiteUneComposante(val.value , niveau , false   , false   );//    [[ parentEstCrochet , dansSiOuBoucle
           if(obj1.status === true){
                t+=obj1.value+')';
           }else{
               return(astjs_logerreur({status:false,'message':'erreur 0000 [ todo ajuster ] '}));
           }
            
        }else{
            return(astjs_logerreur({status:false,'message':'erreur dans traiteObjectExpression1 817 '+val.value.type,element:element}));
        }
    }
    t='obj('+t+')';
    return({status:true,value:t});
}
function recupProp(property){
    var t='';
    if(property){
        if(property.type === 'BinaryExpression'){
            var obj1 = traiteBinaryExpress1(property,niveau,false,false);
            if(obj1.status === true){
                t+=obj1.value;
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1572 pour '+property.type,element:property}));
            }
        }else if(property.type === 'Identifier'){
            t+=property.name;
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1548  pour '+property.type,element:property}));
        }
    }
    return({status:true,value:t});
}
function traiteMemberExpression1(element,niveau,parent){
    var t='';
    console.log('%c dans traiteMemberExpression1 element=','color:red;background:yellow;font-weight:bold;',element,'\nparent=',parent);
    if(element.computed === false){
        var objTxt='';
        var propertyTxt='';
        if(element.object){
            if(element.object.type === 'MemberExpression'){
                var obj1 = traiteMemberExpression1(element.object,niveau,element);
                if(obj1.status === true){
                    objTxt=obj1.value;
                    var prop = recupProp(element.property);
                    if(prop.status === true){
                        if(prop.value !== ''){
                            if(objTxt.substr(0,8) == 'tableau('){
                                t+=objTxt.substr(0,objTxt.length-1)+',prop('+prop.value+'))';
                            }else{
                                if(objTxt.substr(0,6)==='appelf'){
                                 if(objTxt.indexOf('prop(')>=0){
                                  objTxt=objTxt.substr(0,objTxt.length-2)+'.'+prop.value+'))';
                                  t=objTxt;
                                 }else{
                                  objTxt=objTxt.substr(0,objTxt.length-1)+',prop('+prop.value+'))';
                                  t=objTxt;
                                 }
                                }else{
                                 t+=objTxt+'.'+prop.value;
                                }
                            }
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1528 pour '+element.object.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1526 pour '+element.type,element:element}));
                }
            }else if(element.object.type === 'Identifier'){
                objTxt=element.object.name;
                var prop = recupProp(element.property);
                if(prop.status === true){
                    if(prop.value !== ''){
                        t+=element.object.name+'.'+prop.value;
                    }else{
                        t+=element.object.name;
                    }
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1528 pour '+element.object.type,element:element}));
                }
            }else if(element.object.type === 'CallExpression'){
                var obj1 = traiteCallExpression1(element.object,element,{},'');
                if(obj1.status === true){
                    objTxt=obj1.value;
                    var prop = recupProp(element.property);
                    if(prop.status === true){
                        if(prop.value !== ''){
                            t+=objTxt.substr(0,objTxt.length-1)+',prop('+prop.value+'))';
                        }else{
                            t+=objTxt;
                        }
                    }else{
                        return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1574 pour '+element.object.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1530 pour '+element.object.type,element:element}));
                }
            }else if(element.object.type === "ThisExpression"){
                objTxt='this';
                var prop = recupProp(element.property);
                if(prop.status === true){
                    if(prop.value !== ''){
                        t+=objTxt+'.'+prop.value;
                    }else{
                        t+=objTxt;
                    }
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1528 pour '+element.object.type,element:element}));
                }
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1523 pour '+element.object.type,element:element}));
            }
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1517 pour '+element.type,element:element}));
        }
    }else if(element.computed === true){
        var objTxt='';
        var propertyTxt='';
        if(element.object){
            if(element.object.type === 'Identifier'){
                objTxt=element.object.name;
            }else if(element.object.type === 'MemberExpression'){
                var obj1 = traiteMemberExpression1(element.object,niveau,element);
                if(obj1.status === true){
                    objTxt=obj1.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1526 pour '+element.type,element:element}));
                }
            }else if(element.object.type === "CallExpression"){
             
                var obj1 = traiteCallExpression1(element.object,niveau,element,{});
                if(obj1.status === true){
                    objTxt=obj1.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1316 pour '+element.object.type,element:element}));
                }
             
             
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1582 pour '+element.object.type,element:element}));
            }
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1520 pas d\'objet pour '+element.type,element:element}));
        }
        if(element.property){
         
         
            var obj1=traiteUneComposante(element.property , niveau , true , false );
            if(obj1.status === true){
                t+='tableau(nomt('+objTxt+'),p('+obj1.value+'))';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1572 pour '+element.type,element:element}));
            }
/*            
            if(element.property.type === 'BinaryExpression'){
                var obj1 = traiteBinaryExpress1(element.property,niveau,true,false);
                if(obj1.status === true){
                    t+='tableau(nomt('+objTxt+'),p('+obj1.value+'))';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1572 pour '+element.type,element:element}));
                }
            }else if(element.property.type === 'Identifier'){
                t+='tableau(nomt('+objTxt+'),p('+element.property.name+'))';
            }else if(element.property.type === 'Literal'){
                t+='tableau(nomt('+objTxt+'),p('+element.property.raw+'))';
            }else if(element.property.type === 'MemberExpression'){
                var obj1 = traiteMemberExpression1(element.property,niveau,element);
                if(obj1.status === true){
                    t+='tableau(nomt('+objTxt+'),p('+obj1.value+'))';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1526 pour '+element.type,element:element}));
                }
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1604 pas de propriété pour '+element.property.type,element:element}));
            }
*/            
        }else{
            t=objTxt;
        }
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteMemberExpression1 1512 pour '+element.type,element:element}));
    }
    if(t.substr(0,8) == 'tableau('){
        var o = functionToArray(t,true,false,'');
        if(o.status === true){
            if((o.value[2][1] === 'nomt') && (o.value[2][8] === 1) && (o.value[3][2] === 'c')){
                var i=0;
                var bcont=true;
                var cumChaine='';
                for(i=4;(i < o.value.length) && (bcont === true);i=i+1){
                    if(o.value[i][7] === 1){
                        if((o.value[i][1] == 'p') && (o.value[i+1][2] == 'c')){
                            if(o.value[i+1][4] !== 0){
                                bcont=false;
                                break;
                            }else if(o.value[i+1][4] === 2){
                                bcont=false;
                                break;
                            }else{
                                cumChaine+='['+maConstante(o.value[i+1])+']';
                            }
                        }else{
                            bcont=false;
                            break;
                        }
                    }
                }
                if(bcont){
                    t=o.value[3][1]+cumChaine;
                }
            }
        }
    }
    return({status:true,value:t});
}

/* =================================================================================== */
function traiteUpdateExpress1(element,niveau,opt){
    console.log('%c dans traiteUpdateExpress1 , element=','color:red;background:yellow;',element);
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var LF='\n';
    if(opt['sansLF']){
        LF='';
        esp0='';
        esp1='';
    }
    var elem='';
    var obj=traiteUneComposante(element.argument , niveau, false , false );
    if(obj.status === true){
      elem=obj.value;
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour traiteUpdateExpress1 1707 '+element.type,element:element}));
    }
    if(      ('++' === element.operator) && (element.prefix == false)){
        t+='postinc('+elem+')';
    }else if(('--' === element.operator) && (element.prefix == false)){
        t+='postdec('+elem+')';
    }else if(('++' === element.operator) && (element.prefix == true)){
        t+='preinc('+elem+')';
    }else if(('--' === element.operator) && (element.prefix == true)){
        t+='predec('+elem+')';
    }
    
    return({status:true,value:t});
}

/*
=========================================================
*/


function traiteAssignmentExpress1(element,niveau,opt){
    console.log('%c dans traiteAssignmentExpress1 element=','color:red;background:yellow;font-weight:bold;',element);
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
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
            valeurLeft=LF+esp0+'affecte('+element.left.name+' , ';
        }else{
            valeurLeft=LF+esp0+'affectop(\''+element.operator+'\' , '+element.left.name+' , ';
        }
        if((element.right) && (element.right.type === 'Literal')){
            t+=valeurLeft+element.right.raw+')';
        }else if((element.right) && (element.right.type === 'MemberExpression')){
            var obj1 = traiteMemberExpression1(element.right,niveau,element,'');
            if(obj1.status === true){
                t+=valeurLeft+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteAssignmentExpress1 301 pour '+element.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'BinaryExpression')){
            obj1=traiteBinaryExpress1(element.right,niveau,false,false);
            if(obj1.status === true){
                t+=valeurLeft+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteAssignmentExpress1 452 pour '+element.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'CallExpression')){
            var obj1 = traiteCallExpression1(element.right,niveau,element,{'sansLF':true});
            if(obj1.status === true){
                t+=valeurLeft+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur pour traiteAssignmentExpress1 780 '+element.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'Identifier')){
            t+=valeurLeft+element.right.name+')';
        }else if((element.right) && (element.right.type === 'UnaryExpression')){
            var nomDuTestUnary = recupNomOperateur(element.right.operator);
            var nomDuTest = recupNomOperateur(element.operator);
            if((element.right) && (element.right.type === 'UnaryExpression') && (element.right.argument.type === 'Identifier') && (element.right.operator === '-') || (element.right.operator === '+') ){
                t+=valeurLeft+element.right.operator+element.right.argument.name+')';
            }else if((element.right) && (element.right.type === 'Literal') && (element.right.argument.type === 'Identifier')){
                t+=valeurLeft+nomDuTest+'('+nomDuTestUnary+'('+element.right.argument.name+')'+','+element.right.raw+'))';
            }else if(((element.right.operator === '-') || (element.right.operator === '+')) && (element.right.argument.type === 'Literal')){
                t+=valeurLeft+element.right.operator+''+element.right.argument.raw+')';
            }else if(((element.right.operator === '-') || (element.right.operator === '+')) && (element.right.argument.type === 'Identifiel')){
                t+=valeurLeft+element.right.operator+''+element.right.argument.name+')';
            }else if((element.right.operator === '!') && (element.right.argument.type === 'CallExpression')){
                var obj1 = traiteCallExpression1(element.right.argument,niveau,element.right,{'sansLF':true});
                if(obj1.status === true){
                    t+=valeurLeft+'condition(non('+obj1.value+'))'+')';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour traiteAssignmentExpress1 780 '+element.type,element:element}));
                }
            }else{
                return(astjs_logerreur({'status':false,'message':'erreur dans traiteAssignmentExpress1 0934 '}));
            }
        }else if((element.right) && (element.right.type === 'AssignmentExpression')){
            var objass = traiteAssignmentExpress1(element.right,niveau,{'sansLF':true});
            if(objass.status === true){
                t+=valeurLeft+objass.value+')';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteAssignmentExpress1 1020 pour '+element.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'ObjectExpression')){
            var obj1 = traiteObjectExpression1(element.right,niveau);
            if(obj1.status === true){
                t+=valeurLeft+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteAssignmentExpress1 1027',element:element}));
            }
        }else if((element.right) && (element.right.type === 'LogicalExpression')){
            var obj1 = traiteLogicalExpression1(element.right,niveau,true);
            if(obj1.status === true){
                t+=valeurLeft+'condition('+obj1.value+'))';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteAssignmentExpress1 1181',element:element}));
            }
        }else if((element.right) && (element.right.type === 'ConditionalExpression')){
            var obj1 = traiteConditionalExpression1(element.right,niveau);
            if(obj1.status === true){
                t+=valeurLeft+''+obj1.value+')';
            }else{
                console.error('erreur traiteAssignmentExpress1 1347 element=',element);
                return(astjs_logerreur({status:false,'message':'erreur traiteAssignmentExpress1 1347 pour '+element.right.type,element:element}));
            }
        }else if((element.right) && (element.right.type === 'ArrayExpression')){
            var obj1 = traiteArrayExpression1(element.right,niveau);
            if(obj1.status === true){
                t+=valeurLeft+''+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteAssignmentExpress1 1422'}));
            }
        }else if((element.right) && (element.right.type === 'NewExpression')){
            var obj1=traiteUneComposante(element.right , niveau, false , false );
            if(obj1.status===true){
                t+=valeurLeft+''+obj1.value+')';
            }else{
                return(astjs_logerreur({status:false,message:'erreur dans traiteAssignmentExpress1 1385',element:element}));
            }
            
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteAssignmentExpress1 1023 pour '+element.right.type,element:element}));
        }
    }else if((element.left) && (element.left.type === 'MemberExpression')){
        var obj2 = traiteMemberExpression1(element.left,niveau,element,'');
        if(obj2.status === true){
            if(element.operator === '='){
                t=LF+esp0+'affecte('+obj2.value+' , ';
            }else{
                t=LF+esp0+'affectop(\''+element.operator+'\' , '+obj2.value+' , ';
            }
            if((element.right) && (element.right.type === 'Literal')){
                t+=element.right.raw+')';
            }else if((element.right) && (element.right.type === 'Identifier')){
                t+=element.right.name+')';
            }else if((element.right) && (element.right.type === 'MemberExpression')){
                var obj1 = traiteMemberExpression1(element.right,niveau,element,'');
                if(obj1.status === true){
                    t+=obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteAssignmentExpress1 318 pour '+element.type,element:element}));
                }
            }else if('BinaryExpression' === element.right.type){
                obj1=traiteBinaryExpress1(element.right,niveau,false,false);
                if(obj1.status === true){
                    t+=obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur traiteAssignmentExpress1 452 pour '+element.type,element:element}));
                }
            }else if('FunctionExpression' === element.right.type){
                var obj1 = traiteFunctionExpression1(element.right,niveau,element,'');
                if(obj1.status === true){
                    t+=obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteUneComposante 0147 ',element:element}));
                }
            }else if('CallExpression' === element.right.type){
                var obj1 = traiteCallExpression1(element.right,niveau,element,{'sansLF':true});
                if(obj1.status === true){
                    t+=obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour traiteAssignmentExpress1 1232 '+element.type,element:element}));
                }
            }else if('LogicalExpression' === element.right.type){
                var obj1 = traiteLogicalExpression1(element.right,niveau,false);
                if(obj1.status === true){
                    t+='condition('+obj1.value+'))';
                }else{
                    return(astjs_logerreur({'status':false,'message':'erreur dans traiteAssignmentExpress1 1493 ',element:element}));
                }
            }else if('ArrayExpression' === element.right.type){
                var obj1 = traiteArrayExpression1(element.right,niveau);
                if(obj1.status === true){
                    t+=obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteDeclaration1 1500',element:element}));
                }
            }else if('ObjectExpression' === element.right.type){
                var obj1 = traiteObjectExpression1(element.right,niveau);
                if(obj1.status === true){
                    t+=obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteDeclaration1 534',element:element}));
                }
                
            }else if(
                   'ConditionalExpression' === element.right.type 
                || 'NewExpression' === element.right.type 
                || 'UnaryExpression' === element.right.type 
                || "AssignmentExpression" === element.right.type 
                || "SequenceExpression" === element.right.type 
            ){
             
                var obj1 = traiteUneComposante(element.right , niveau , false , false );
                if(obj1.status === true){
                    t+=obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteDeclaration1 1515',element:element}));
                }
                
                
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteExpression1 1223 pour '+element.right.type,element:element}));
            }
        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteExpression1 305 pour '+element.type,element:element}));
        }
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteExpression1 214 pour '+element.type,element:element}));
    }
    return({status:true,value:t});
}
function traiteExpression1(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    console.log('%c dans traiteExpression1 element=','color:red;background:yellow;font-weight:bold;',element);
    if('ExpressionStatement' === element.type){
     
        if('ExpressionStatement' === element.expression.type){
            var objexp1 = traiteExpression1(element.expression,niveau);
            if(objexp1.status == true){
                t+=objexp1.value;
            }else{
                return(astjs_logerreur({status:false,'message':'erreur pour traiteExpression1 1134 '+element.type,element:element}));
            }
        }else if('MemberExpression' === element.expression.type){
            var obj1 = traiteMemberExpression1(element.expression,niveau,element,'');
            if(obj1.status === true){
                t+=obj1.value;
            }else{
                return(astjs_logerreur({status:false,'message':'erreur pour traiteDeclaration1 928 '+element.type,element:element}));
            }
        }else if(('Literal' === element.expression.type) && (element.directive)){
            if(element.directive == 'use strict'){
                t+='useStrict()';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur pour traiteExpression1 1127 '+element.type,element:element}));
            }
        }else if(
              'AssignmentExpression' === element.expression.type
           || 'UpdateExpression' === element.expression.type
           || 'CallExpression' === element.expression.type
           || 'Identifier' === element.expression.type
           || 'Literal' === element.expression.type
           || 'UnaryExpression' === element.expression.type
           || 'SequenceExpression' === element.expression.type
        ){
            var obj1 = traiteUneComposante(element.expression , niveau , false , false );    // traiteExpression1 hugues         ;
            if(obj1.status === true){
                t+=obj1.value;
            }else{
                return(astjs_logerreur({status:false,'message':'erreur pour traiteDeclaration1 928 '+element.type,element:element}));
            }
        
/*
        }else if('AssignmentExpression' === element.expression.type){
            var objass = traiteAssignmentExpress1(element.expression,niveau,{});
            if(objass.status === true){
                t+=objass.value;
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteExpression1 318 pour '+element.type,element:element}));
            }
        }else if('UpdateExpression' === element.expression.type){
            var objass = traiteUpdateExpress1(element.expression,niveau,{'sansLF':true});
            if(objass.status === true){
                t+=objass.value+'';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur traiteExpression1 765 pour '+element.type,element:element}));
            }
        }else if('CallExpression' === element.expression.type){
            var obj1 = traiteCallExpression1(element.expression,niveau,element,{});
            if(obj1.status === true){
                t+=obj1.value+'';
            }else{
                return(astjs_logerreur({status:false,'message':'erreur pour traiteExpression1 827 '+element.type,element:element}));
            }
        }else if('Identifier' === element.expression.type){
            t+=element.expression.name;
        }else if('Literal' === element.expression.type){
            t+=element.expression.raw;

        }else if('UnaryExpression' === element.expression.type){
*/
            

        }else{
            return(astjs_logerreur({status:false,'message':'erreur traiteExpression1 1124 pour '+element.expression.type,element:element}));
        }
    }else{
        return(astjs_logerreur({status:false,'message':'erreur traiteExpression1 1037 pour '+element.type,element:element}));
    }
    return({status:true,value:t});
}
function traiteDeclaration1(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var nomVariable='';
    t+=ajouteCommentaireAvant(element,niveau);
    var decl={};
    for(decl in element.declarations){
        if(t !== ''){
            t+=',';
        }
        var debutDeclaration='';
        debutDeclaration='\n'+esp0+'declare('+element.declarations[decl].id.name+' , ';
        nomVariable=element.declarations[decl].id.name;
        if(element.declarations[decl].init){
            if('Literal' === element.declarations[decl].init.type){
                t+=debutDeclaration+element.declarations[decl].init.raw+')';
            }else if('Identifier' === element.declarations[decl].init.type){
                t+=debutDeclaration+element.declarations[decl].init.name+')';
            }else if('MemberExpression' === element.declarations[decl].init.type){
                var obj1 = traiteMemberExpression1(element.declarations[decl].init,niveau,element,'');
                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour traiteDeclaration1 928 '+element.type,element:element}));
                }
            }else if('CallExpression' === element.declarations[decl].init.type){
                var obj1 = traiteCallExpression1(element.declarations[decl].init,niveau,element,{});
                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour traiteDeclaration1 935 '+element.type,element:element}));
                }
            }else if('ObjectExpression' === element.declarations[decl].init.type){
                var obj1 = traiteObjectExpression1(element.declarations[decl].init,niveau);
                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteDeclaration1 534',element:element}));
                }
            }else if('UnaryExpression' === element.declarations[decl].init.type){
                if((element.declarations[decl].init.argument) && (element.declarations[decl].init.argument.type === 'Literal')){
                    t+=debutDeclaration+element.declarations[decl].init.operator+element.declarations[decl].init.argument.raw+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur pas de callee dans traiteCallExpression1 517',element:element}));
                }
            }else if('LogicalExpression' === element.declarations[decl].init.type){
                var obj = traiteLogicalExpression1(element.declarations[decl].init,niveau,false);
                if(obj.status === true){
                    if(obj.value.substr(0,1) === ','){
                        t+=debutDeclaration+'condition('+obj.value.substr(1)+'))';
                    }else{
                        t+=debutDeclaration+'condition('+obj.value+'))';
                    }
                }else{
                    return(astjs_logerreur({'status':false,'message':'erreur dans traiteCondition1 1545 '}));
                }
            }else if('NewExpression' === element.declarations[decl].init.type){
                var obj1 = traiteCallExpression1(element.declarations[decl].init,niveau,element,{});
                if(obj1.status === true){
                    t+=debutDeclaration+'new('+obj1.value+'))';
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour traiteDeclaration1 1551 '+element.type,element:element}));
                }
            }else if('ArrayExpression' === element.declarations[decl].init.type){
                var obj1 = traiteArrayExpression1(element.declarations[decl].init,niveau);
                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteDeclaration1 1559',element:element}));
                }
            }else if('BinaryExpression' === element.declarations[decl].init.type){
                var obj1 = traiteBinaryExpress1(element.declarations[decl].init,niveau,false,false);
                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({'status':false,'message':'erreur dans traiteDeclaration1 1568 ',element:element}));
                }
            }else if('ConditionalExpression' === element.declarations[decl].init.type){
                var obj1 = traiteConditionalExpression1(element.declarations[decl].init,niveau);
                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({'status':false,'message':'erreur dans traiteDeclaration1 1662 ',element:element}));
                }
            }else if('TemplateLiteral' === element.declarations[decl].init.type){
                var obj1 = traiteTemplateLiteral1(element.declarations[decl].init,niveau);
                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({'status':false,'message':'erreur dans traiteDeclaration1 1662 ',element:element}));
                }
                
            }else if('FunctionExpression' === element.declarations[decl].init.type){
                var obj1 = traiteFunctionExpression1(element.declarations[decl].init,niveau,element.declarations[decl],'');

                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteUneComposante 0147 ',element:element}));
                }
            }else if('UpdateExpression' === element.declarations[decl].init.type || "ThisExpression" === element.declarations[decl].init.type || "AssignmentExpression" === element.declarations[decl].init.type){
                var obj1 = traiteUneComposante(element.declarations[decl] , niveau , false , false );
                if(obj1.status === true){
                    t+=debutDeclaration+obj1.value+')';
                }else{
                    return(astjs_logerreur({status:false,message:'erreur dans traiteArrayExpression1 1111',element:element}));
                }
                
            }else{
                return(astjs_logerreur({status:false,'message':'erreur dans traiteDeclaration1 1565 '+element.declarations[decl].init.type,element:element}));
            }
        }else{
            t+=debutDeclaration+'obj())';
        }
    }
    return({status:true,value:t,'nomVariable':nomVariable});
}
function traiteTemplateLiteral1(element,niveau){
    var t='';
    if((element.quasis) && (element.quasis.length === 1) && ('TemplateElement' === element.quasis[0].type) && (element.quasis[0].value) && (element.quasis[0].value.raw)){
        t='`'+element.quasis[0].value.raw+'`';
    }else{
        return(astjs_logerreur({status:false,'message':'erreur dans traiteTemplateLiteral1 2131 '+element.type,element:element}));
    }
    return({status:true,value:t});
}
function traiteTry1(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    t+=ajouteCommentaireAvant(element,niveau);
    t+='\n'+esp0+'essayer(';
    t+='\n'+esp0+esp1+'faire(';
    niveau+=2;
    var obj = TransformAstEnRev(element.block.body,niveau);
    if(obj.status === true){
        t+='\n'+esp0+esp1+esp1+esp1+obj.value;
    }else{
        return(astjs_logerreur({status:false,'message':'erreur pour '+element.type,element:element}));
    }
    niveau-=2;
    t+='\n'+esp0+esp1+'),';
    t+='\n'+esp0+esp1+'sierreur(';
    if((element.handler) && (element.handler.type == 'CatchClause')){
        if((element.handler.param) && (element.handler.param.type === 'Identifier')){
            t+='\n'+esp0+esp1+esp1+element.handler.param.name+',';
        }else{
            return(astjs_logerreur({status:false,'message':'erreur dans traiteTry1 1021, il manque le nom de la variable capturant l\'erreur : erreur pour '+element.type,element:element}));
        }
        if((element.handler.body) && (element.handler.body.type === 'BlockStatement')){
            niveau+=2;
            var obj = TransformAstEnRev(element.handler.body,niveau);
            niveau-=2;
            if(obj.status === true){
                t+='\n'+esp0+esp1+esp1+'faire(';
                if(obj.value == ''){
                    t+=')';
                }else{
                    t+='\n'+esp0+esp1+esp1+esp1+obj.value;
                    t+='\n'+esp0+esp1+esp1+')';
                }
            }else{
                return(astjs_logerreur({status:false,'message':'erreur pour '+element.type,element:element}));
            }
        }
    }
    t+='\n'+esp0+esp1+')';
    t+='\n'+esp0+')';
    return({status:true,value:t});
}
function ajouteCommentaireAvant(element,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    var i=tabComment.length-1;
    for(i=tabComment.length-1;i >= 0;i=i-1){
        if(tabComment[i].type === 'Block'){
            if(tabComment[i].range[1] < positionDebutBloc){
                /*
                  Attention, ici on remonte le tableau de caractères
                  donc on ajoute le précédent après en changeant les parenthèses en []
                */
                var txtComment=tabComment[i].value;
                
                var c1=nbre_caracteres2('(',txtComment);
                var c2=nbre_caracteres2(')',txtComment);
                
                if(c1===c2){
                 t='\n'+esp0+'#('+txtComment+'),'+t;
                }else{
                 t='\n'+esp0+'#('+txtComment.replace(/\(/g,'[').replace(/\)/g,']')+'),'+t;
                }
                tabComment.splice(i,1);
            }
        }
    }
    return t;
}
var positionDebutBloc=0;
var positionDebutBlocSuivant=0;
function TransformAstEnRev(objectEsprimaBody,niveau){
    var t='';
    var esp0 = ' '.repeat(NBESPACESREV*(niveau));
    var esp1 = ' '.repeat(NBESPACESREV);
    if(!Array.isArray(objectEsprimaBody)){
     objectEsprimaBody=[objectEsprimaBody];
    }
//    console.log('typeof objectEsprimaBody=' , typeof objectEsprimaBody , Array.isArray(objectEsprimaBody)  )
    
    if(objectEsprimaBody.length){
        var i=0;
        for(i=0;i < objectEsprimaBody.length;i=i+1){
            var element=objectEsprimaBody[i];
            if(i < objectEsprimaBody.length-1){
                positionDebutBlocSuivant=objectEsprimaBody[i+1].range[0];
            }
            positionDebutBloc=element.range[0];
            t+=ajouteCommentaireAvant(element,niveau);
            var bodyTrouve=false;
            if(t != ''){
                t+=',';
            }
            if(element.type == 'FunctionDeclaration'){
                t+='\n'+esp0+'fonction(';
                t+='\n'+esp0+esp1+'definition(';
                t+='\n'+esp0+esp1+esp1+'nom('+element.id.name+')';
                if((element.params) && (element.params.length > 0)){
                    t+=',';
                    var j=0;
                    for(j=0;j < element.params.length;j=j+1){
                        t+='\n'+esp0+esp1+esp1+'argument('+element.params[j].name+')';
                        if(j < element.params.length-1){
                            t+=',';
                        }
                    }
                }
                t+='\n'+esp0+esp1+'),';
                t+='\n'+esp0+esp1+'contenu(';
                var prop={};
                for(prop in element){
                    if(prop == 'body'){
                        bodyTrouve=true;
                        niveau=niveau+1;
                        var obj = TransformAstEnRev(element[prop],niveau);
                        niveau=niveau-1;
                        if(obj.status === true){
                            t+=obj.value;
                        }else{
                            return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 229 '+element.type,element:element}));
                        }
                    }
                }
                t+='\n'+esp0+esp1+')';
                t+='\n'+esp0+')';
            }else if(element.type == 'VariableDeclaration'){
                var objDecl = traiteDeclaration1(element,niveau);
                if(objDecl.status === true){
                    t+=objDecl.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 471 '+element.type,element:element}));
                }
            }else if('IfStatement' === element.type){
                var objif = traiteIf1(element,niveau,'if');
                if(objif.status == true){
                    t+=objif.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 261 '+element.type,element:element}));
                }
            }else if('ForInStatement' === element.type){
                var objFor = traiteForIn1(element,niveau);
                if(objFor.status == true){
                    t+=objFor.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 466 '+element.type,element:element}));
                }
            }else if('ForStatement' === element.type){
                var objFor = traiteFor1(element,niveau);
                if(objFor.status == true){
                    t+=objFor.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 466 '+element.type,element:element}));
                }
            }else if('ExpressionStatement' === element.type){
                var objexp1 = traiteExpression1(element,niveau);
                if(objexp1.status == true){
                    t+='\n'+esp0+objexp1.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 1036 '+element.type,element:element}));
                }
            }else if('ReturnStatement' === element.type){
                if(element.argument === null){
                    t+='\n'+esp0+'revenir()';
                }else if((element.argument) && (element.argument.type == 'CallExpression')){
                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{'sansLF':true});
                    if(obj1.status === true){
                        t+='\n'+esp0+'revenir('+obj1.value+')';
                    }else{
                        return(astjs_logerreur({status:false,message:'erreur TransformAstEnRev 1221 ',element:element}));
                    }
                }else if((element.argument) && (element.argument.type == 'ObjectExpression')){
                    var obj1 = traiteObjectExpression1(element.argument,niveau);
                    if(obj1.status === true){
                        t+='\n'+esp0+'revenir('+obj1.value+')';
                    }else{
                        return(astjs_logerreur({status:false,message:'erreur dans TransformAstEnRev 1963',element:element}));
                    }
                    
/*                    
                }else if((element.argument) && (element.argument.type == 'Identifier')){
                    t+='\n'+esp0+'revenir('+element.argument.name+')';
                }else if((element.argument) && (element.argument.type == 'Literal')){
                    t+='\n'+esp0+'revenir('+element.argument.raw+')';
                }else if((element.argument) && (element.argument.type == 'BinaryExpression')){
                    var obj1 = traiteBinaryExpress1(element.argument,niveau,false,false);
                    if(obj1.status === true){
                        t+='\n'+esp0+'revenir('+obj1.value+')';
                    }else{
                        return(astjs_logerreur({'status':false,'message':'erreur dans TransformAstEnRev 1970 ',element:element}));
                    }
*/                    
                }else if(
                          (element.argument) && 
                          (
                               element.argument.type == 'FunctionExpression' 
                            || element.argument.type == 'ConditionalExpression' 
                            || element.argument.type == 'LogicalExpression' 
                            || element.argument.type == 'Identifier' 
                            || element.argument.type == 'Literal' 
                            || element.argument.type == 'BinaryExpression' 
                            || element.argument.type == 'MemberExpression' 
                            || element.argument.type == 'NewExpression' 
                            
                            
                          )
                        ){
                    var obj1 = traiteUneComposante(element.argument , niveau , false , false );
                    if(obj1.status === true){
                        t+='\n'+esp0+'revenir('+obj1.value+')';
                    }else{
                        return(astjs_logerreur({'status':false,'message':'erreur dans TransformAstEnRev 1978 ',element:element}));
                    }
                    

                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 1044 '+element.argument.type,element:element}));
                }
            }else if('TryStatement' === element.type){
                var objtry1 = traiteTry1(element,niveau);
                if(objtry1.status == true){
                    t+=objtry1.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 1055 '+element.type,element:element}));
                }
            }else if('BreakStatement' === element.type){
                t+='\n'+esp0+'break()';
            }else if('DebuggerStatement' === element.type){
                t+='\n'+esp0+'debugger()';
            }else if('ContinueStatement' === element.type){
                t+='\n'+esp0+'continue()';
            }else if('ThrowStatement' === element.type){
                
                if(element.argument.type==='Identifier'){
                        t+='\n'+esp0+'throw('+element.argument.name+')';
                }else if(element.argument.type==='CallExpression'){
                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{});
                    if(obj1.status === true){
                        t+='\n'+esp0+'throw('+obj1.value+')';
                    }else{
                        return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 1994 '+element.argument.type,element:element}));
                    }
                }else if(element.argument.type==='NewExpression'){
                    var obj1 = traiteCallExpression1(element.argument,niveau,element,{});
                    if(obj1.status === true){
                        t+='\n'+esp0+'throw(new('+obj1.value+'))';
                    }else{
                        return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 1994 '+element.argument.type,element:element}));
                    }
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 2185 "'+element.argument.type+'"',element:element}));
                }
            }else if('EmptyStatement' === element.type){
                    t+='\n'+esp0+'#(un point virgule est-il en trop ?)';
            }else if('WhileStatement' === element.type){
                var objWhile = traiteWhile1(element,niveau);
                if(objWhile.status == true){
                    t+=objWhile.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 1929 '+element.type,element:element}));
                }
            }else if('SwitchStatement' === element.type){
                var objSwitch = traiteSwitch1(element,niveau);
                if(objSwitch.status == true){
                    t+=objSwitch.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour TransformAstEnRev 1972 '+element.type,element:element}));
                }
                
            }else if('BlockStatement' === element.type){

                var obj = TransformAstEnRev(element.body,niveau);
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour '+objectEsprimaBody,element:element}));
                }
                
            }else{
                astjs_logerreur({status:false,'message':'erreur922 pour '+element.type,element:element});
                console.error('non pris en compte element.type='+element.type,element);
                var prop={};
                for(prop in element){
                    if(prop == 'body'){
                        bodyTrouve=true;
                        var obj = TransformAstEnRev(element[prop],niveau);
                        if(obj.status === true){
                            t+=obj.value;
                        }else{
                            return(astjs_logerreur({status:false,'message':'erreur pour '+element.type,element:element}));
                        }
                    }
                }
            }
        }
    }else{
        /*
        on ne devrait plus passer par ici
        */
//        debugger
        if(objectEsprimaBody.type === 'BlockStatement'){
            if(objectEsprimaBody.body){
                niveau=niveau+1;
                var obj = TransformAstEnRev(objectEsprimaBody.body,niveau);
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(astjs_logerreur({status:false,'message':'erreur pour '+objectEsprimaBody,element:element}));
                }
                niveau=niveau-1;
            }else{
                console.log('Pas de body pour '+objectEsprimaBody.type);
            }
        }
    }
    return({status:true,value:t});
}

/*
=====================================================================================================================
*/
function transformSourceJavascriptEnRev(sourceDuJavascript){
 var t='';
 
 try{
  var ret=esprima.parseScript(sourceDuJavascript,{ range: true ,comment:true}); // ,{'comment':true}
  console.log('ret.body=',ret);

  
 }catch(e){
  console.log('erreur esprima',e);
  return logerreur({status:false,message:'erreur convertir-js-en-rev 2725 e='+e.message });
 }
 if(ret!==false){
  tabComment=ret.comments;
  var obj=TransformAstEnRev(ret.body,0);
  if(obj.status==true){
   t=obj.value;
  }else{
   return logerreur({status:false,message:'erreur convertir-js-en-rev 2733'});
  }
 }
 return {status:true,value:t};
}


var tabComment=[];
/*
=====================================================================================================================
*/

function transformJsEnRev(texteJs){
 
    try{
        var ret = esprima.parseScript(texteJs,{range:true,comment:true});
        var obj = TransformAstEnRev(ret.body,0);
        if(obj.status == true){
         return {status:true,value:obj.value}
        }else{
         return {status:false,message:'erreur de conversion de js en rev dans convertit-js-en-rev 2227'}
        }

    }catch(e){
        return {status:false,message:'erreur de conversion de js en rev dans convertit-js-en-rev 2232, probablement une erreur dans le javascript'}
    }
 
 
}


/*
=====================================================================================================================
*/
function transformJsDeTextAreaEnRev(){
    console.log('=========================\ndébut de transforme');
    document.getElementById('txtar2').value='';
    document.getElementById('resultat1').innerHTML='';
    clearMessages('zone_global_messages');
    var a = document.getElementById('txtar1');
    localStorage.setItem('fta_indexhtml_javascript_dernier_fichier_charge',a.value);
    var lines = mySplit(a.value , '\\r|\\r\\n|\\n');
    var count=lines.length;
    a.setAttribute('rows',(count+1));
    var startMicro=performance.now();
    try{
        var ret = esprima.parseScript(a.value,{range:true,comment:true});
        console.log('ret.body=',ret);
    }catch(e){
        console.log('erreur esprima',e);
        if(e.lineNumber){
         astjs_logerreur({status:false,message:'il y a une erreur dans le javascript d\'origine en ligne '+e.lineNumber,line:e.lineNumber});
        }
        ret=false;
    }
    if(ret !== false){
        tabComment=ret.comments;
        var obj = TransformAstEnRev(ret.body,0);
        var endMicro=performance.now();  console.log('mise en tableau endMicro=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');       
        astjs_logerreur({status:true,message:'pas d\'erreur pour la conversion du js en rev '+parseInt(((endMicro-startMicro)*1000),10)/1000+' ms' });
        if(obj.status == true){
            document.getElementById('resultat1').innerHTML='<pre style="font-size:0.8em;">'+obj.value.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</pre>';
            document.getElementById('txtar2').value=obj.value;
            var obj1 = functionToArray(obj.value,true,false,'');
            if(obj1.status === true){
            var endMicro=performance.now();  console.log('mise en tableau endMicro=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');
             
                astjs_logerreur({status:true,message:'pas d\'erreur pour le rev '+parseInt(((endMicro-startMicro)*1000),10)/1000+' ms' });
                
                var resJs=parseJavascript0(obj1.value,1,0);
                if(resJs.status===true){
                   document.getElementById('txtar3').value=resJs.value;
                }
                
                
            }else{
                astjs_logerreur({status:false,message:'erreur pour le rev'});
            }
        }
    }else{
        astjs_logerreur({status:false,message:'il y a une erreur dans le javascript d\'origine'});
    }
    displayMessages('zone_global_messages','txtar1');
    rangeErreurSelectionne=false;
}
function chargerSourceDeTestJs(){
    var t=`/*
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
    if (id < global_messages.data.matrice.value.length) {
      var ligneMatrice = global_messages.data.matrice.value[id];
      var caractereDebut = ligneMatrice[5];
      var numeroDeLigne = 0;
      for (var j = caractereDebut; j >= 0; j--) {
        if (global_messages.data.tableau.out[j][0] == "\n") {
          numeroDeLigne++;
        }
      }
    }
    if (numeroDeLigne > 0) {
      if (numeroDeLigne != numLignePrecedente) {
        document.getElementById("global_messages").innerHTML += '<a href="javascript:jumpToError(' + (numeroDeLigne + 1) + ')" class="yyerreur" style="border:2px red outset;">go to line ' + numeroDeLigne + "</a>&nbsp;";
        numLignePrecedente = numeroDeLigne;
      }
    }
  }
}

function espacesn(optionCRLF, i) {
  var t = "";
  if (optionCRLF) {
    t = "\r\n";
  } else {
    t = "\n";
  }
  if (i > 0) {
    t += " ".repeat(NBESPACESSOURCEPRODUIT * i);
  }
  return t;
}



*/`;
    dogid('txtar1').value=t;
}
function chargerLeDernierSourceJs(){
    var fta_indexhtml_javascript_dernier_fichier_charge = localStorage.getItem('fta_indexhtml_javascript_dernier_fichier_charge');
    if(fta_indexhtml_javascript_dernier_fichier_charge !== null){
        dogid('txtar1').value=fta_indexhtml_javascript_dernier_fichier_charge;
    }
}
