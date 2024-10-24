
"use strict";
/*
  var global_enteteTableau=[
  ['id','id'                                 ,''], // 00
  ['val','value'                             ,''],
  ['typ','type'                              ,''],
  ['niv','niveau'                            ,''],
  ['coQ','constante quotee'                  ,''], // 04
  ['pre','position du premier caractère'     ,''], // 05
  ['der','position du dernier caractère'     ,''], // 06
  ['pId','Id du parent'                      ,''], // 07
  ['nbE','nombre d\'enfants'                 ,''], // 08
  ['nuE','numéro enfants'                    ,''], // 09
  ['pro','profondeur'                        ,''], // 10
  ['pop','position ouverture parenthese'     ,''], // 11
  ['pfp','position fermeture parenthese'     ,''], // 12
  ['com','commentaire'                       ,''], // 13
  
  ];
*/
function parseJavascript0(tab,id,niveau){
    var t='';
    var obj={};
    var retJS = js_tabTojavascript1(tab,id,false,false,niveau);
    if(retJS.status === true){
        t+=retJS.value;
    }else{
        console.error(retJS);
        return({status:false,value:t});
    }
    return({status:true,value:t});
}
/*
  todo augmenter l'utilisation de js_traiteInstruction1
*/
function js_tabTojavascript1(tab,id,dansFonction,dansInitialisation,niveau,dansCascade){
    var t='';
    var i=0;
    var j=0;
    var k=0;
    var obj={};
    var positionDeclarationFonction=-1;
    var positionContenu=-1;
    var nomFonction='';
    var argumentsFonction='';
    var tabchoix = [];
    var l01=tab.length;
    if(l01 <= 1){
        return({'status':true,'value':''});
    }
    var id_du_parent=tab[id][7];
    var terminateur=';';
    var espcLigne = espacesn(true,niveau);
    
    
    if(dansCascade === true){
        terminateur=',';
        espcLigne='';
        dansInitialisation=false;
    }
    for(i=id;(i < l01) && (tab[i][3] >= tab[id][3]);i=i + 1){
        if(tab[i][7] === id_du_parent){
         
         
            if(dansInitialisation===true && "initialisation" === tab[tab[id][7]][1] && tab[id][8]>1){
                t+=',';
            }
         
            if(((tab[i][1] === 'break') || (tab[i][1] === 'continue') || ('useStrict' === tab[i][1]) || ('debugger' === tab[i][1])) && (tab[i][2] === 'f')){
                if('useStrict' === tab[i][1]){
                    t+=espcLigne;
                    t+='"use strict"' + terminateur + '';
                }else{
                    if(tab[i][8] === 0){
                        t+=espcLigne;
                        t+=tab[i][1] + '' + terminateur + '';
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            'message':'erreur dans un ' + tab[i][1] + ' qui doit être sous le format ' + tab[i][1] + '() strictement'
                        }));
                    }
                }
            }else if((tab[i][1] === 'revenir') && (tab[i][2] === 'f')){
                if(tab[i][8] === 0){
                    t+=espcLigne;
                    t+='return' + terminateur + '';
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:' revenir ne doit pas avoir de paramètre'
                    }));
                }
            }else if((tab[i][1] === 'retourner') && (tab[i][2] === 'f')){
                if(tab[i][8] === 0){
                    try{
                        t+=espcLigne;
                        t+='return' + terminateur + '';
                    }catch(e){
                        debugger;
                    }
                }else{
                    if(tab[i][8] === 1){
                        if(tab[i + 1][2] === 'c'){
                            t+=espcLigne;
                            t+='return ' + maConstante(tab[i + 1]) + ';';
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'appelf')){
                            t+=espcLigne;
                            obj=js_traiteAppelFonction(tab,(i + 1),true,niveau,false);
                            if(obj.status === true){
                                t+='return(' + obj.value + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:id,
                                    tab:tab,
                                    message:'il faut un nom de fonction à appeler n(xxxx)'
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'obj')){
                            t+=espcLigne;
                            obj=js_traiteDefinitionObjet(tab,tab[i + 1][0],true,niveau);
                            if(obj.status === true){
                                t+='return(' + obj.value + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'dans obj de "return" ou "dans" il y a un problème'
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'condition')){
                            t+=espcLigne;
                            obj=js_condition0(tab,(i + 1),niveau);
                            if(obj.status === true){
                                t+='return(' + obj.value + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    'message':'erreur 0076 sur return '
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && ((tab[i + 1][1] === 'testEnLigne') || (tab[i + 1][1] === 'egalstricte') || (tab[i + 1][1] === 'supeg'))){
                            var objtestLi = js_traiteInstruction1(tab,niveau,(i + 1));
                            if(objtestLi.status === true){
                                t+='return(' + objtestLi.value + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0092 sur return'
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'new')){
                            t+=espcLigne;
                            var objtestLi = js_tabTojavascript1(tab,(i + 1),false,true,niveau,false);
                            if(objtestLi.status === true){
                                t+='return(' + objtestLi.value + ')';
                                if( !(dansInitialisation)){
                                    t+=terminateur;
                                }
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0092 sur return'
                                }));
                            }
/*#
                        }else if((tab[i + 1][2] === 'f') && ((tab[i + 1][1] === '') || (tab[i + 1][1] === '') )){
                            var objOperation = TraiteOperations1(tab,(i + 1),niveau);
                            if(objOperation.status === true){
                                t+=espcLigne;
                                t+='return(' + objOperation.value + ')';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0165 sur return '
                                }));
                            }
*/                            
                        }else if((tab[i + 1][2] === 'f')
                         && (
                            (tab[i + 1][1] === 'plus')
                         || (tab[i + 1][1] === 'moins')
                         || (tab[i + 1][1] === 'mult')
                         || (tab[i + 1][1] === 'divi')
                         || (tab[i + 1][1] === 'concat')
                         || (tab[i + 1][1] === 'ou_bin')
                         || (tab[i + 1][1] === 'nonBin')
                         || (tab[i + 1][1] === 'decalDroite')
                         || (tab[i + 1][1] === 'decal_droite_non_signe')
                         || (tab[i + 1][1] === 'puissance')
                         || (tab[i + 1][1] === 'decalGauche')
                         || (tab[i + 1][1] === 'ou_ex_bin')
                         || (tab[i + 1][1] === 'etBin')
                         || (tab[i + 1][1] === 'modulo')
                        )){
                            
                            t+=espcLigne;
                            var objOperation = TraiteOperations1(tab,tab[i + 1][0],niveau);
                            if(objOperation.status === true){
                                t+='return(' + objOperation.value + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0076 sur return '
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'defTab')){
                            var objtestLi = js_traiteDefinitionTableau(tab,tab[i + 1][0],niveau,{});
                            if(objtestLi.status === true){
                                t+=espcLigne;
                                t+='return(' + objtestLi.value + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0183 sur return'
                                }));
                            }
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:i,
                                tab:tab,
                                'message':'javascript non traité 0083 "' + tab[i + 1][1] + '"'
                            }));
                        }
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            message:'javascript non traité 0088'
                        }));
                    }
                }
            }else if(((tab[i][1] === 'fonction') || ('méthode' === tab[i][1])) && (tab[i][2] === 'f')){
                var nomFonction='';
                var typeFonction='';
                var modeFonction='';
                var asynchrone='';
                if((false) && (dansFonction === true)){
                    /*
                      en fait, on peut déclarer une fonction dans une fonction
                      On peut se demander si c'est vraiment utile en dehors de l'organisation du code source
                      Moi je considère qu'une fonction devrait être externe aux fonctions si on maitrise
                      son code... à voir...
                      
                    */
                    return(logerreur({
                        status:false,
                        value:t,
                        id:id,
                        tab:tab,
                        message:'on ne peut pas déclarer une fonction dans une fonction'
                    }));
                }else{
                    dansFonction=true;
                    positionDeclarationFonction=-1;
                    for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                        if((tab[j][1] === 'definition') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
                            positionDeclarationFonction=j;
                            break;
                        }
                    }
                    positionContenu=-1;
                    for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                        if((tab[j][1] === 'contenu') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
                            positionContenu=j;
                            break;
                        }
                    }
                    if((positionDeclarationFonction >= 0) && (positionContenu >= 0)){
                        for(j=positionDeclarationFonction + 1;(j < l01) && (tab[j][3] > tab[positionDeclarationFonction][3]);j=j + 1){
                            if((tab[j][1] === 'nom') && (tab[j][3] === (tab[positionDeclarationFonction][3] + 1))){
                                if(tab[j][8] === 1){
                                    nomFonction=tab[j + 1][1];
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:id,
                                        tab:tab,
                                        message:'0206 le nom de la fonction doit être sous la forme   '
                                    }));
                                }
                            }else if((tab[j][1] === 'asynchrone') && (tab[j][3] === (tab[positionDeclarationFonction][3] + 1))){
                                if(tab[j][8] === 0){
                                    asynchrone='async ';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:id,
                                        tab:tab,
                                        message:'0223 asynchrone doit être une fonction sans paramètres   '
                                    }));
                                }
                            }else if((tab[j][1] === 'mode') && (tab[j][3] === (tab[positionDeclarationFonction][3] + 1))){
                                if((tab[j][8] === 1) && (tab[j + 1][1] === 'privée')){
                                    modeFonction='#';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:id,
                                        tab:tab,
                                        message:'0212  mode de la classe '
                                    }));
                                }
                            }else if((tab[j][1] === 'type') && (tab[j][3] === (tab[positionDeclarationFonction][3] + 1))){
                                if((tab[j][8] === 1) && (tab[j + 1][1] === 'lire')){
                                    typeFonction='get ';
                                }else if((tab[j][8] === 1) && (tab[j + 1][1] === 'écrire')){
                                    typeFonction='set ';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:id,
                                        tab:tab,
                                        message:' 0220 le type de la classe doit être écrire ou lire '
                                    }));
                                }
                            }
                        }
                        argumentsFonction='';
                        for(j=positionDeclarationFonction + 1;(j < l01) && (tab[j][3] > tab[positionDeclarationFonction][3]);j=j + 1){
                            if((tab[j][1] === 'argument') && (tab[j][3] === (tab[positionDeclarationFonction][3] + 1))){
                                if(tab[j][8] === 1){
                                    argumentsFonction+=',' + tab[j + 1][1];
                                }else{
                                    if((tab[j][8] === 2) && (tab[j + 2][1] === 'defaut')){
                                        argumentsFonction+=',' + tab[j + 1][1];
                                        var objdef = js_traiteInstruction1(tab,niveau,(j + 3));
                                        if(objdef.status === true){
                                            argumentsFonction+='=' + objdef.value;
                                        }else{
                                            return(logerreur({
                                                status:false,
                                                value:t,
                                                id:id,
                                                tab:tab,
                                                message:'0220 les arguments passés à la fonction doivent être sous la forme argument(xxx,[defaut(yyy)]) '
                                            }));
                                        }
                                    }else{
                                        return(logerreur({
                                            status:false,
                                            value:t,
                                            id:id,
                                            tab:tab,
                                            message:'0224 les arguments passés à la fonction doivent être sous la forme argument(xxx,[defaut(yyy)]) '
                                        }));
                                    }
                                }
                            }
                        }
                        if(nomFonction !== ''){
                            if(('méthode' === tab[i][1]) && ( !((tab[i - 1][1] === '#') && (tab[i - 1][2] === 'f')))){
                                /*
                                  j'impose l'écriture d'un commentaire minimal devant une méthode
                                */
                                t+=espcLigne;
                                t+='/* function ' + nomFonction + ' */';
                            }
                            t+=espcLigne;
                            if('méthode' === tab[i][1]){
                                t+=((typeFonction + asynchrone + modeFonction + nomFonction)) + '(' + ((argumentsFonction === '')?'':argumentsFonction.substr(1)) + '){';
                            }else{
                                t+=asynchrone + 'function ' + nomFonction + '(' + ((argumentsFonction === '')?'':argumentsFonction.substr(1)) + '){';
                            }
                            if(tab[positionContenu][8] === 0){
                                t+=espcLigne;
                                t+='  // rien ici';
                                t+=espcLigne;
                                t+='}';
                            }else{
                                niveau=niveau + 1;
                                obj=js_tabTojavascript1(tab,(positionContenu + 1),dansFonction,false,niveau);
                                niveau=niveau - 1;
                                if(obj.status === true){
                                    t+=obj.value;
                                    t+=espcLigne;
                                    t+='}';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:id,
                                        tab:tab,
                                        'message':'problème sur le contenu de la fonction "' + nomFonction + '"'
                                    }));
                                }
                            }
                        }
                    }else{
                        return({
                            status:false,
                            value:t,
                            id:id,
                            tab:tab,
                            message:'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'
                        });
                    }
                    dansFonction=false;
                }
            }else if((tab[i][1] === 'appelf') && (tab[i][2] === 'f')){
                obj=js_traiteAppelFonction(tab,i,true,niveau,false);
                if(obj.status === true){
                    t+=espcLigne;
                    t+=obj.value + '' + terminateur + '';
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:id,
                        tab:tab,
                        message:'il faut un nom de fonction à appeler n(xxxx)'
                    }));
                }
            }else if((tab[i][1] === 'cascade') && (tab[i][2] === 'f')){
                var obj = js_tabTojavascript1(tab,(i + 1),false,true,niveau,true);
                if(obj.status === true){
                    t+=espcLigne;
                    if(obj.value.length > 0){
                        t+=obj.value.substr(0,(obj.value.length - 1));
                    }else{
                        t+=obj.value;
                    }
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'dans flux cascade, 0216'
                    }));
                }
            }else if((tab[i][1] === 'boucleSurObjet') && (tab[i][2] === 'f')){
                tabchoix=[];
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                    if(tab[j][3] === (tab[i][3] + 1)){
                        if(tab[j][1] === 'pourChaque'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:i,
                                tab:tab,
                                message:'la syntaxe de boucleSurObjet est boucleSurObjet(pourChaque(dans(a , b)),faire())'
                            }));
                        }
                    }
                }
                var pourChaque='';
                var faire='';
                for(j=0;j < tabchoix.length;j=j + 1){
                    if(tabchoix[j][1] === 'pourChaque'){
                        niveau=niveau + 1;
                        obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,true,niveau);
                        niveau=niveau - 1;
                        if(obj.status === true){
                            pourChaque+=obj.value;
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                'message':'problème sur la pour de boucleSurObjet en indice ' + tabchoix[j][0]
                            }));
                        }
                    }else if(tabchoix[j][1] === 'faire'){
                        niveau=niveau + 1;
                        obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,false,niveau);
                        niveau=niveau - 1;
                        if(obj.status === true){
                            faire+=obj.value;
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                'message':'problème sur le alors de boucleSurObjet en indice ' + tabchoix[j][0]
                            }));
                        }
                    }
                }
                t+=espcLigne;
                t+='for(';
                t+=pourChaque;
                t+='){';
                t+=faire;
                t+=espcLigne;
                t+='}';
            }else if((tab[i][1] === 'bascule') && (tab[i][2] === 'f')){
                var valeurQuand='';
                var valeursCase='';
                var j = (i + 1);
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][7] === i){
                        if((tab[j][1] === 'quand') && (tab[j][2] === 'f') && (tab[j][8] === 1)){
                            valeurQuand=tab[j + 1][1];
                        }else if(tab[j][1] === 'est'){
                            var valeurCas='';
                            var InstructionsCas='';
                            var k = (j + 1);
                            for(k=j + 1;(k < l01) && (tab[k][3] > tab[j][3]);k++){
                                if(tab[k][7] === j){
                                    if((tab[k][1] === 'valeurNonPrevue') && (tab[k][2] === 'f') && (tab[k][8] === 0)){
                                        valeurCas=null;
                                    }else if((tab[k][1] === 'valeur') && (tab[k][2] === 'f')){
                                        if(tab[k + 1][2] === 'f'){
                                            var obj = js_traiteInstruction1(tab,niveau,(k + 1));
                                            if(obj.status === true){
                                                valeurCas=obj.value;
                                            }else{
                                                return(logerreur({
                                                    status:false,
                                                    value:t,
                                                    id:ind,
                                                    tab:tab,
                                                    message:'javascript dans bascule 0274'
                                                }));
                                            }
                                        }else{
                                            valeurCas=maConstante(tab[k + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                                        }
                                    }else if((tab[k][1] === 'faire') && (tab[k][2] === 'f')){
                                        if(tab[k][8] >= 1){
                                            niveau+=2;
                                            var obj = js_tabTojavascript1(tab,(k + 1),true,false,niveau);
                                            niveau-=2;
                                            if(obj.status === true){
                                                InstructionsCas=obj.value;
                                            }else{
                                                return(logerreur({
                                                    status:false,
                                                    value:t,
                                                    id:k,
                                                    tab:tab,
                                                    message:'javascript dans bascule 0287'
                                                }));
                                            }
                                        }else{
                                            InstructionsCas='';
                                        }
                                    }else{
                                        return(logerreur({
                                            status:false,
                                            value:t,
                                            id:i,
                                            tab:tab,
                                            message:'javascript dans bascule 0293'
                                        }));
                                    }
                                }
                            }
                            valeursCase+=espacesn(true,(niveau + 1));
                            if(valeurCas === null){
                                valeursCase+='default:';
                            }else{
                                valeursCase+='case ' + valeurCas + ':';
                            }
                            valeursCase+=InstructionsCas;
                            valeursCase+=espacesn(true,(niveau + 2));
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:i,
                                tab:tab,
                                message:'javascript dans bascule 0307 '
                            }));
                        }
                    }
                }
                t+=espcLigne;
                t+='switch (' + valeurQuand + '){';
                t+=valeursCase;
                t+=espcLigne;
                t+='}';
            }else if((tab[i][1] === 'tantQue') && (tab[i][2] === 'f')){
                tabchoix=[];
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                    if(tab[j][3] === (tab[i][3] + 1)){
                        if(tab[j][1] === 'condition'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:id,
                                tab:tab,
                                message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'
                            }));
                        }
                    }
                }
                var condition='';
                var faire='';
                for(j=0;j < tabchoix.length;j=j + 1){
                    if(tabchoix[j][1] === 'condition'){
                        niveau=niveau + 1;
                        obj=js_condition0(tab,tabchoix[j][0],niveau);
                        niveau=niveau - 1;
                        if(obj.status === true){
                            condition+=obj.value;
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                'message':'1 problème sur la condition du choix en indice ' + tabchoix[j][0]
                            }));
                        }
                    }else if(tabchoix[j][1] === 'faire'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            /* pas d'enfants, ne rien faire !*/
                        }else{
                            niveau=niveau + 1;
                            obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,false,niveau);
                            niveau=niveau - 1;
                            if(obj.status === true){
                                faire+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    'message':'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }
                }
                if((condition.substr(0,1) === '(') && (condition.substr((condition.length - 1),1) === ')')){
                    condition=condition.substr(1,(condition.length - 2));
                }
                t+=espcLigne;
                t+='while(' + condition + '){';
                t+=faire;
                t+=espcLigne;
                t+='}';
            }else if((tab[i][1] === 'boucle') && (tab[i][2] === 'f')){
                tabchoix=[];
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                    if(tab[j][3] === (tab[i][3] + 1)){
                        if(tab[j][1] === 'condition'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'initialisation'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'increment'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:id,
                                tab:tab,
                                message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'
                            }));
                        }
                    }
                }
                var initialisation='';
                var condition='';
                var increment='';
                var faire='';
                for(j=0;j < tabchoix.length;j=j + 1){
                    if(tabchoix[j][1] === 'initialisation'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            initialisation='';
                        }else{
                            obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,true,(niveau + 1));
                            if(obj.status === true){
                                initialisation+=obj.value;
                                if(initialisation.substr((initialisation.length - 1),1) === ';'){
                                    initialisation=initialisation.substr(0,(initialisation.length - 1));
                                }
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    'message':'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }else if(tabchoix[j][1] === 'condition'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            condition='';
                        }else{
                            obj=js_condition0(tab,tabchoix[j][0],(niveau + 1));
                            if(obj.status === true){
                                condition+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    'message':'1 problème sur la condition du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }else if(tabchoix[j][1] === 'increment'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            increment='';
                        }else{
                            obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),true,true,(niveau + 1));
                            if(obj.status === true){
                                increment+=obj.value;
                                if(increment.substr((increment.length - 1),1) === ';'){
                                    increment=increment.substr(0,(increment.length - 1));
                                }
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    'message':'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }else if(tabchoix[j][1] === 'faire'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            /* pas d'enfants, ne rien faire !*/
                        }else{
                            niveau=niveau + 1;
                            obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,false,niveau);
                            niveau=niveau - 1;
                            if(obj.status === true){
                                faire+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    'message':'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }
                }
                if((initialisation.substr(0,1) === '(') && (initialisation.substr((initialisation.length - 1),1) === ')')){
                    initialisation=initialisation.substr(1,(initialisation.length - 2));
                }
                if((condition !== '') && (condition.substr(0,1) === '(') && (condition.substr((condition.length - 1),1) === ')')){
                    condition=condition.substr(1,(condition.length - 2));
                }
                t+=espcLigne;
                t+='for(' + initialisation + ';' + condition + ';' + increment + '){';
                t+=faire;
                t+=espcLigne;
                t+='}';
            }else if((tab[i][1] === 'essayer') && (tab[i][2] === 'f')){
                var contenu='';
                var sierreur='';
                var nomErreur='';
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                    if(tab[j][3] === (tab[i][3] + 1)){
                        if((tab[j][1] === 'faire') && (tab[j][2] === 'f')){
                            if(tab[j][8] > 0){
                                niveau=niveau + 1;
                                obj=js_tabTojavascript1(tab,(j + 1),dansFonction,false,niveau);
                                niveau=niveau - 1;
                                if(obj.status === true){
                                    contenu+=obj.value;
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:i,
                                        tab:tab,
                                        message:'problème sur le contenu du "essayer" '
                                    }));
                                }
                            }
                        }else if((tab[j][1] === 'sierreur') && (tab[j][2] === 'f')){
                            if(tab[j][8] === 2){
                                if(tab[j + 1][2] === 'c'){
                                    nomErreur=tab[j + 1][1];
                                    if((tab[j + 2][1] === 'faire') && (tab[j + 2][2] === 'f')){
                                        if(tab[j + 2][8] === 0){
                                        }else{
                                            niveau=niveau + 1;
                                            obj=js_tabTojavascript1(tab,(j + 3),dansFonction,false,niveau);
                                            niveau=niveau - 1;
                                            if(obj.status === true){
                                                sierreur+=obj.value;
                                            }else{
                                                return(logerreur({
                                                    status:false,
                                                    value:t,
                                                    id:i,
                                                    tab:tab,
                                                    message:'problème sur le "sierreur" du "essayer" '
                                                }));
                                            }
                                        }
                                    }else{
                                        return(logerreur({
                                            status:false,
                                            value:t,
                                            id:i,
                                            tab:tab,
                                            message:'problème sur le "sierreur" le deuxième argiment doit être "faire"'
                                        }));
                                    }
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:i,
                                        tab:tab,
                                        message:'problème sur le "sierreur" le premier argiment doit être une variable'
                                    }));
                                }
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'problème sur le "sierreur" du "essayer" il doit contenir 2 arguments sierreur(e,faire)'
                                }));
                            }
                        }
                    }
                }
                t+=espcLigne;
                t+='try{';
                t+=contenu;
                t+=espcLigne;
                t+='}catch(' + nomErreur + '){';
                t+=sierreur;
                t+=espcLigne;
                t+='}';
            }else if((tab[i][1] === 'choix') && (tab[i][2] === 'f')){
                tabchoix=[];
                var aDesSinonSi=false;
                var aUnSinon=false;
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                    if(tab[j][3] === (tab[i][3] + 1)){
                        if(tab[j][1] === 'si'){
                            tabchoix.push([j,tab[j][1],0,tab[j],0]);
                            for(k=j + 1;k < l01;k=k + 1){
                                if((tab[k][1] === 'alors') && (tab[k][3] === (tab[j][3] + 1))){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                                if(tab[k][3] < tab[j][3]){
                                    break;
                                }
                            }
                        }else if(tab[j][1] === 'sinonsi'){
                            aDesSinonSi=true;
                            tabchoix.push([j,tab[j][1],0,tab[j],0]);
                            for(k=j + 1;k < l01;k=k + 1){
                                if((tab[k][1] === 'alors') && (tab[k][3] === (tab[j][3] + 1))){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                                if(tab[k][3] < tab[j][3]){
                                    break;
                                }
                            }
                        }else if(tab[j][1] === 'sinon'){
                            aUnSinon=true;
                            tabchoix.push([j,tab[j][1],0,tab[j],0]);
                            for(k=j + 1;k < l01;k=k + 1){
                                if((tab[k][1] === 'alors') && (tab[k][3] === (tab[j][3] + 1))){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                                if(tab[k][3] < tab[j][3]){
                                    break;
                                }
                            }
                        }else if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                            tabchoix.push([j,tab[j][1],0,tab[j]]);
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:id,
                                tab:tab,
                                message:'la syntaxe de choix est choix(si(condition(),alors()),sinonsi(condition(),alors()),sinon(alors()))'
                            }));
                        }
                    }
                }
                var tabTemp = [];
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                    if((tab[i][0] === tab[tab[j][7]][7]) || (tab[i][0] === tab[j][7])){
                        if(((tab[j][1] === 'si') || (tab[j][1] === 'condition') || (tab[j][1] === 'alors') || (tab[j][1] === 'sinonsi') || (tab[j][1] === 'sinon') || (tab[j][1] === '#')) && (tab[j][2] === 'f')){
                            if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                            }else{
                                tabTemp.push(tab[j]);
                            }
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:j,
                                tab:tab,
                                'message':'file javascript.js : dans un choix, les niveaux doivent etre "si" "sinonsi" "sinon" et les sous niveaux "alors" et "condition" et non pas "' + JSON.stringify(tab[j]) + '" '
                            }));
                        }
                    }
                }
                for(j=0;j < tabTemp.length;j=j + 1){
                    if(j === 0){
                        if((tabTemp[j][1] === 'si') && (tabTemp[j + 1][1] === 'condition') && (tabTemp[j + 2][1] === 'alors')){
                            j+=2;
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:tabTemp[j][0],
                                tab:tab,
                                message:'un choix doit contenir au moins un "si" , une "condition" et un "alors" en première position [""]'
                            }));
                        }
                    }else{
                        if(tabTemp[j][1] === 'sinon'){
                            if((tabTemp[j + 1][1] === 'alors') && ((j + 2) === tabTemp.length)){
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'dans un choix le sinon doit être en derniere position'
                                }));
                            }
                        }
                    }
                }
                for(j=0;j < tabchoix.length;j=j + 1){
                    if(tabchoix[j][1] === '#'){
                        var niveauSi = (niveau + 2);
                        var k = (j + 1);
                        for(k=j + 1;k < tabchoix.length;k=k + 1){
                            if(tabchoix[k][1] === 'si'){
                                niveauSi=niveau + 1;
                                break;
                            }
                        }
                        if(tab[tabchoix[j][0]][13].indexOf('\n') >= 0){
                            t+=espacesn(true,niveauSi);
                        }
                        var commt = traiteCommentaire2(tab[tabchoix[j][0]][13],niveauSi,tabchoix[j][0]);
                        t+='/*' + commt + '*/';
                        if(tab[j][13].indexOf('\n') >= 0){
                            t+=espacesn(true,niveauSi);
                        }
                    }else if(tabchoix[j][1] === 'si'){
                        var tabComment = [];
                        var debutCondition=0;
                        var k = (i + 1);
                        for(k=i + 1;(k < l01) && (tab[k][3] > tab[i][3]);k=k + 1){
                            if(tab[k][1] === 'condition'){
                                debutCondition=k;
                                break;
                            }else if((tab[k][1] === '#') && (tab[k][2] === 'f') && (tab[k][3] === (tab[i][3] + 2))){
                                tabComment.push(tab[k][13]);
                            }
                        }
                        var k=0;
                        for(k=0;k < tabComment.length;k=k + 1){
                            if(tabComment[k].indexOf('\n') >= 0){
                                t+=espacesn(true,(niveau + 1));
                            }
                            var commt = traiteCommentaire2(tabComment[k],(niveau + 1),tabchoix[j][0]);
                            t+='/*' + commt + '*/';
                            if(tabComment[k].indexOf('\n') >= 0){
                                t+=espacesn(true,(niveau + 1));
                            }
                        }
                        t+=espcLigne;
                        t+='if(';
                        
                        obj=js_condition0(tab,debutCondition,(niveau + 1));
                        if(obj.status === true){
                            if((obj.value.substr(0,1) === '(') && (obj.value.substr((obj.value.length - 1),1) === ')')){
                                obj.value=obj.value.substr(1,(obj.value.length - 2));
                            }
                            if(tab[debutCondition + 1][8] >= 5){
                                /*
                                  on a une suite de et/ou 
                                */
                                obj.value=obj.value.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                                t+=obj.value;
                                t+='){';
                            }else{
                                if(obj.value.length>120 && obj.value.indexOf('\n')<0){
                                    
                                    obj.value=obj.value.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                                    t+=obj.value;
                                    t+=espcLigne +'){';
                                }else{
                                    t+=obj.value;
                                    t+='){';
                                }
                            }
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                'message':'2 problème sur la condition du choix en indice ' + tabchoix[j][0]
                            }));
                        }
                        if((tabchoix[j][2] > 0) && (tabchoix[j][4] > 0)){
                            niveau=niveau + 1;
                            obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
                            niveau=niveau - 1;
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    'message':'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                        if(aDesSinonSi){
                        }else{
                            if(aUnSinon){
                            }else{
                                t+=espcLigne;
                                t+='}';
                            }
                        }
                    }else if(tabchoix[j][1] === 'sinonsi'){
                        var tabComment = [];
                        var debutCondition=0;
                        var k=tabchoix[j][0];
                        for(k=tabchoix[j][0];(k < l01) && (tab[k][3] > tab[i][3]);k=k + 1){
                            if(tab[k][1] === 'condition'){
                                debutCondition=k;
                                break;
                            }else if((tab[k][1] === '#') && (tab[k][2] === 'f')){
                                tabComment.push(tab[k][13]);
                            }
                        }
                        var k=0;
                        for(k=0;k < tabComment.length;k=k + 1){
                            if(tabComment[k].indexOf('\n') >= 0){
                                t+=espacesn(true,(niveau + 1));
                            }
                            var commt = traiteCommentaire2(tabComment[k],(niveau + 1),tabchoix[j][0]);
                            t+='/*' + commt + '*/';
                            if(tabComment[k].indexOf('\n') >= 0){
                                t+=espacesn(true,(niveau + 1));
                            }
                        }
                        t+=espcLigne;
                        t+='}else if(';
                        niveau=niveau + 1;
                        obj=js_condition0(tab,debutCondition,niveau);
                        niveau=niveau - 1;
                        if(obj.status === true){
                            if((obj.value.substr(0,1) === '(') && (obj.value.substr((obj.value.length - 1),1) === ')')){
                                obj.value=obj.value.substr(1,(obj.value.length - 2));
                            }
                            if(tab[debutCondition + 1][8] >= 5){
                                /*
                                  on a une suite de et/ou 
                                */
                                obj.value=obj.value.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                            }
                            t+=obj.value;
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                'message':'3 problème sur la condition du choix en indice ' + tabchoix[j][0]
                            }));
                        }
                        t+='){';
                        if((tabchoix[j][2] > 0) && (tabchoix[j][4] > 0)){
                            niveau=niveau + 1;
                            obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
                            niveau=niveau - 1;
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    'message':'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                        if(aUnSinon){
                        }else{
                            if(j === (tabchoix.length - 1)){
                                t+=espcLigne;
                                t+='}';
                            }
                        }
                    }else{
                        t+=espcLigne;
                        t+='}else{';
                        if((tabchoix[j][2] > 0) && (tabchoix[j][4] > 0)){
                            niveau=niveau + 1;
                            obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
                            niveau=niveau - 1;
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    'message':'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                        t+=espcLigne;
                        t+='}';
                    }
                }
            }else if((tab[i][1] === 'affecteFonction') && (tab[i][2] === 'f')){
                if((tab[i + 1][2] === 'c') && (tab[i][8] >= 2)){
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:id,
                        tab:tab,
                        message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'
                    }));
                }
                if((tab[i + 2][2] === 'f') && (tab[i + 2][1] === 'appelf') && (tab[i][8] >= 2)){
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:id,
                        tab:tab,
                        message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'
                    }));
                }
                obj=js_traiteAppelFonction(tab,(i + 2),true,niveau,false);
                if(obj.status === true){
                    t+=espcLigne;
                    t+='' + tab[i + 1][1] + '=' + obj.value + '' + terminateur + '';
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:id,
                        tab:tab,
                        message:'il faut un nom de fonction à appeler n(xxxx)'
                    }));
                }
            }else if(((tab[i][1] === 'affecte') || (tab[i][1] === 'dans') || (tab[i][1] === 'affectop')) && (tab[i][2] === 'f')){
                var tabAffecte={};
                var signe='=';
                var numeroPar=0;
                var j = (i + 1);
                for(j=i + 1;j < l01;j=j + 1){
                    if(tab[j][3] <= tab[i][3]){
                        break;
                    }
                    if(tab[j][7] === tab[i][0]){
                        if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                        }else{
                            if(tab[i][1] === 'affectop'){
                                if(numeroPar === 0){
                                    signe=tab[j][1];
                                    numeroPar=numeroPar + 1;
                                }else{
                                    tabAffecte['par' + ((numeroPar - 1))]=tab[j];
                                    numeroPar=numeroPar + 1;
                                }
                            }else{
                                tabAffecte['par' + numeroPar]=tab[j];
                                numeroPar=numeroPar + 1;
                            }
                        }
                    }
                }
                if(tab[i][1] === 'dans'){
                    signe=' in ';
                }else if(tab[i][1] === 'affecte'){
                    signe='=';
                }
                if( !(dansInitialisation)){
                    t+=espcLigne;
                }
                if( !(tabAffecte['par1'])){
                    debugger;
                }
                var objInstructionGauche = js_traiteInstruction1(tab,niveau,tabAffecte['par0'][0]);
                if(objInstructionGauche.status === true){
                    var objInstructionDroite = js_traiteInstruction1(tab,niveau,tabAffecte['par1'][0]);
                    if(objInstructionDroite.status === true){
                        /*
                          on écrit l'affectation ici 
                        */
                        if((signe === '=') && (objInstructionGauche.value === objInstructionDroite.value.substr(0,objInstructionGauche.value.length)) && (objInstructionDroite.value.substr(objInstructionGauche.value.length,1) === '+')){
                            var droite = objInstructionDroite.value.substr((objInstructionGauche.value.length + 1));
                            if((droite.substr(0,1) === '(') && (droite.substr((droite.length - 1),1) === ')') && (tab[tabAffecte['par1'][0]][1] !== 'condition')){
                                droite=droite.substr(1,(droite.length - 2));
                            }
                            t+='' + objInstructionGauche.value + '+=' + droite;
                        }else{
                            var droite=objInstructionDroite.value;
                            if((droite.length >= 2) && (droite.substr(0,1) === '(') && (droite.substr((droite.length - 1),1) === ')') && ((tab[tabAffecte['par1'][0]][1] === 'concat') || (tab[tabAffecte['par1'][0]][1] === 'plus') || (tab[tabAffecte['par1'][0]][1] === 'moins'))){
                                /*
                                  pas besoin de parenthèses en plus pour un concat
                                */
                                droite=droite.substr(1,(droite.length - 2));
                            }
                            t+=objInstructionGauche.value + signe + droite;
                        }
                        if( !(dansInitialisation)){
                            t+='' + terminateur + '';
                        }
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:id,
                            tab:tab,
                            message:'dans appelf de "affecte" ou "dans" 0802 '
                        }));
                    }
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:id,
                        tab:tab,
                        message:'dans appelf de "affecte" ou "dans" 0805 '
                    }));
                }
            }else if(((tab[i][1] === 'declare') || ("variable_privée" === tab[i][1]) || ("variable_publique" === tab[i][1])) && (tab[i][2] === 'f')){
                t+=espcLigne;
                var tabdeclare = [];
                for(j=i + 1;j < l01;j=j + 1){
                    if(tab[j][3] <= tab[i][3]){
                        break;
                    }
                    if(tab[j][7] === tab[i][0]){
                        if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                        }else{
                            tabdeclare.push(tab[j]);
                        }
                    }
                }
                if(tabdeclare.length === 2){
                    var prefixe_declaration='var ';
                    if("variable_privée" === tab[i][1]){
                        prefixe_declaration='#';
                    }else if("variable_publique" === tab[i][1]){
                        prefixe_declaration='';
                    }else{
                    }
                    if((tabdeclare[0][2] === 'c') && (tabdeclare[1][2] === 'c')){
                        t+=((prefixe_declaration + tabdeclare[0][1])) + '=' + maConstante(tabdeclare[1]) + '' + terminateur + '';
                    }else{
                        if((tabdeclare[0][2] === 'c') && (tabdeclare[1][2] === 'f')){
                            if((tabdeclare[1][1] === 'new') && (tabdeclare[1][8] === 1) && (tab[i + 3][1] === 'appelf')){
                                t+=((prefixe_declaration + tabdeclare[0][1])) + '= new ';
                                obj=js_traiteAppelFonction(tab,(tabdeclare[1][0] + 1),true,niveau,false);
                                if(obj.status === true){
                                    t+=obj.value + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur dans une déclaration'
                                    }));
                                }
                            }else if(tabdeclare[1][1] === 'obj'){
                                if(tabdeclare[1][8] === 0){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + '={}' + terminateur + '';
                                }else{
                                    obj=js_traiteDefinitionObjet(tab,tabdeclare[1][0],true,niveau);
                                    if(obj.status === true){
                                        t+=((prefixe_declaration + tabdeclare[0][1])) + '=' + obj.value + '' + terminateur + '';
                                    }else{
                                        return(logerreur({
                                            status:false,
                                            value:t,
                                            id:i,
                                            tab:tab,
                                            message:'dans obj de "declare" ou "dans" il y a un problème'
                                        }));
                                    }
                                }
                            }else if(tabdeclare[1][1] === 'await'){
                                t+=((prefixe_declaration + tabdeclare[0][1])) + '= await ';
                                obj=js_traiteAppelFonction(tab,(tabdeclare[1][0] + 1),true,niveau,false);
                                if(obj.status === true){
                                    t+=obj.value + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur dans une déclaration'
                                    }));
                                }
                            }else if(tabdeclare[1][1] === 'appelf'){
                                obj=js_traiteAppelFonction(tab,tabdeclare[1][0],true,niveau,false);
                                if(obj.status === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + obj.value + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur dans une déclaration'
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'condition') && (tabdeclare[1][2] === 'f')){
                                obj=js_condition1(tab,(tabdeclare[1][0] + 1),niveau);
                                if(obj.status === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + obj.value + '' + terminateur + '';
                                }else{
                                    return(logerreur({status:false,value:t,id:id,message:'erreur dans une condition'}));
                                }
                            }else if((tabdeclare[1][2] === 'f') && ((tabdeclare[1][1] === 'plus') || (tabdeclare[1][1] === 'moins') || (tabdeclare[1][1] === 'mult') || (tabdeclare[1][1] === 'divi') || (tabdeclare[1][1] === 'modulo') || (tabdeclare[1][1] === 'concat') || (tabdeclare[1][1] === 'egalstricte') || (tabdeclare[1][1] === 'egal') || (tabdeclare[1][1] === 'diffstricte'))){
                                var objOperation = TraiteOperations1(tab,tabdeclare[1][0],niveau);
                                if(objOperation.status === true){
                                    var droite=objOperation.value;
                                    if((droite.length >= 2) && (tabdeclare[1][1] === 'concat') && (droite.substr(0,1) === '(') && (droite.substr((droite.length - 1),1) === ')')){
                                        droite=droite.substr(1,(droite.length - 2));
                                    }
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + droite + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur 1048 sur declaration '
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'tableau') && (tabdeclare[1][2] === 'f')){
                                var objTableau = js_traiteTableau1(tab,tabdeclare[1][0],true,niveau,false);
                                if(objTableau.status === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + objTableau.value + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur 1007 sur declaration '
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'testEnLigne') && (tabdeclare[1][2] === 'f')){
                                var objtestLi = js_traiteInstruction1(tab,niveau,tabdeclare[1][0]);
                                if(objtestLi.status === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + objtestLi.value + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:tabdeclare[0][0],
                                        tab:tab,
                                        message:'erreur sur declaration 0796'
                                    }));
                                }
                            }else if((tabdeclare[1][2] === 'f') && ((tabdeclare[1][1] === 'affecte') || (tabdeclare[1][1] === 'postinc'))){
                                var objtestLi = js_tabTojavascript1(tab,tabdeclare[1][0],true,true,niveau);
                                if(objtestLi.status === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + objtestLi.value + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:tabdeclare[0][0],
                                        tab:tab,
                                        message:'erreur sur declaration 0803'
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'defTab') && (tabdeclare[1][2] === 'f')){
                                var objtestLi = js_traiteDefinitionTableau(tab,tabdeclare[1][0],niveau,{});
                                if(objtestLi.status === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + objtestLi.value + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        status:false,
                                        value:t,
                                        id:tabdeclare[0][0],
                                        tab:tab,
                                        message:'erreur sur declaration 0803'
                                    }));
                                }
                            }else{
                                return(logerreur({status:false,id:i,'message':'javascript.js 0957 : cas dans declare non prévu ' + tabdeclare[1][1]}));
                            }
                        }else{
                            return(logerreur({status:false,id:i,message:'javascript.js 0960 : cas dans declare non prévu'}));
                        }
                    }
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur dans une déclaration 0996, declare  doit avoir 2 paramètres'
                    }));
                }
            }else if((tab[i][1] === '#') && (tab[i][2] === 'f')){
                if(tab[i][13].substr(0,1) === '#'){
                    t+='\n';
                }else{
                    t+=espcLigne;
                }
                var commt = traiteCommentaire2(tab[i][13],niveau,i);
                t+='/*' + commt;
                if(tab[i][13].substr(0,1) === '#'){
                    t+='\n';
                }
                t+='*/';
            }else if(((tab[i][1] === 'postinc') || (tab[i][1] === 'postdec') || (tab[i][1] === 'preinc') || (tab[i][1] === 'predec')) && (tab[i][2] === 'f')){
                if( !(dansInitialisation)){
                    t+=espcLigne;
                }
                if((tab[i + 1][2] === 'c') && (tab[i][8] === 1)){
                    if(tab[i][1] === 'preinc'){
                        t+='++';
                    }else if(tab[i][1] === 'predec'){
                        t+='--';
                    }
                    t+=tab[i + 1][1];
                    if(tab[i][1] === 'postinc'){
                        t+='++';
                    }else if(tab[i][1] === 'postdec'){
                        t+='--';
                    }
                    if( !(dansInitialisation)){
                        t+='' + terminateur + '';
                    }
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur dans un postinc'
                    }));
                }
            }else if((tab[i][1] === 'throw') && (tab[i][2] === 'f')){
                /* todo trouver un mot pour throw */
                t+=espcLigne;
                if((tab[i + 1][1] === 'new') && (tab[i + 1][8] === 1) && (tab[i + 2][1] === 'appelf')){
                    obj=js_traiteAppelFonction(tab,(i + 2),true,niveau,false);
                    if(obj.status === true){
                        t+='throw new ' + obj.value;
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            message:'erreur dans une déclaration'
                        }));
                    }
                }else if((tab[i + 1][1] === 'appelf') && (tab[i + 1][2] === 'f')){
                    obj=js_traiteAppelFonction(tab,(i + 1),true,niveau,false);
                    if(obj.status === true){
                        t+='throw ' + obj.value;
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            message:'erreur dans une déclaration'
                        }));
                    }
                }else if(tab[i + 1][2] === 'c'){
                    t+='throw ' + maConstante(tab[i + 1]);
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur dans throw 1040'
                    }));
                }
                if( !(dansInitialisation)){
                    t+=terminateur;
                }
            }else if((tab[i][1] === 'supprimer') && (tab[i][2] === 'f')){
                t+=espcLigne;
                if((tab[i + 1][8] === 0) && (tab[i + 1][2] === 'c')){
                    t+='delete ' + tab[i + 1][1] + '' + terminateur + '';
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur dans supprimer 0955'
                    }));
                }
            }else if((tab[i][1] === 'new') && (tab[i][2] === 'f')){
                if((tab[i][8] === 1) && (tab[i + 1][1] === 'appelf')){
                    obj=js_traiteAppelFonction(tab,(i + 1),true,niveau,false);
                    if(obj.status === true){
                        t+='new ' + obj.value;
                        if( !(dansInitialisation)){
                            t+=terminateur;
                        }
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            message:'erreur dans une déclaration'
                        }));
                    }
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur dans new 1074'
                    }));
                }
            }else if((tab[i][1] === 'defTab') && (tab[i][2] === 'f')){
                obj=js_traiteDefinitionTableau(tab,i,niveau,{});
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur js_tabTojavascript1 1037'
                    }));
                }
            }else if((tab[i][1] === 'void') && (tab[i][2] === 'f')){
                var objtestLi = js_traiteInstruction1(tab,niveau,(i + 1));
                if(objtestLi.status === true){
                    t+='void(' + objtestLi.value + ')';
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur js_tabTojavascript1 1047'
                    }));
                }
            }else if((tab[i][2] === 'f') && ((tab[i][1] === 'inf') || (tab[i][1] === 'egalstricte') || (tab[i][1] === 'testEnLigne') || (tab[i][1] === 'condition'))){
                var objtestLi = js_traiteInstruction1(tab,niveau,i);
                if(objtestLi.status === true){
                    t+='(' + objtestLi.value + ')';
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur js_tabTojavascript1 1056'
                    }));
                }
            }else if((("definition_de_classe" === tab[i][1]) || ("exporter" === tab[i][1])) && (tab[i][2] === 'f')){
                if((tab[i][8] === 1) && ("exporter" === tab[i][1]) && (tab[i + 1][8] === 1)){
                    t+=espcLigne;
                    t+='export{' + tab[i + 2][1] + '}' + terminateur;
                }else{
                    var objtestLi = js_traiteInstruction1(tab,niveau,i);
                    if(objtestLi.status === true){
                        t+='' + objtestLi.value + '';
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            message:'erreur js_tabTojavascript1 1233'
                        }));
                    }
                }
                /*
                  }else if( tab[i][1]==='' && tab[i][2]==='f' && tab[tab[i][7]][1].toLowerCase()==='javascriptdanshtml' ){
                  if(tab[i][9]===1){
                  var obj=window.__module_html1.insere_javascript_dans_html(tab,i-1,0);
                  if(obj.status === true){
                  t+=''+obj.value+'';
                  }else{
                  return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur js_tabTojavascript1 1243'}));
                  }
                  }else{
                  debugger
                  }
                */
            }else if( ("non" === tab[i][1]) && (tab[i][2] === 'f')){
                /*
                  dans le cas d'un !function(){} !!!
                */
             
                var objtestLi = js_tabTojavascript1(tab,(i + 1),false,true,niveau,false);
                if(objtestLi.status === true){
                    if(objtestLi.value.substr(0,2)===CRLF){
                     objtestLi.value=objtestLi.value.substr(2);
                    }
                    t+='!' + objtestLi.value + '';
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur js_tabTojavascript1 1647'
                    }));
                }
             
            }else{
                return(logerreur({
                    status:false,
                    value:t,
                    id:i,
                    tab:tab,
                    'message':'javascript.js traitement non prévu 1057 ' + JSON.stringify(tab[i])
                }));
            }
        }
    }

    if(t!=='' && dansInitialisation===true && "initialisation" === tab[tab[id][7]][1] && tab[id][8]>1 && t.substr(0,1)===','){
        t=t.substr(1);
    }
    
    
    return({status:true,value:t});
}
/*
  =====================================================================================================================
*/
function js_traiteDefinitionTableau(tab,id,niveau,options={}){
    var t='';
    var j=0;
    var obje={};
    var textObj='';
    var l01=tab.length;
    var mettre_des_sauts=false;
    var precedent_est_commentaire=false;
    var proprietes='';
    for(j=id + 1;(j < l01) && (tab[j][3] > tab[id][3]);j++){
        if(tab[j][3] === (tab[id][3] + 1)){
            if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                mettre_des_sauts=true;
                break;
            }
        }
    }
    if(tab[id][8] > 5){
        mettre_des_sauts=true;
    }
    for(j=id + 1;(j < l01) && (tab[j][3] > tab[id][3]);j++){
        if(tab[j][7] === id){
            if((tab[j][1] === 'p') && (tab[j][2] === 'f')){
                var k = (j + 1);
                for(k=j + 1;(k < l01) && (tab[k][3] > tab[j][3]);k++){
                    if(tab[k][7] === j){
                        if((tab[k][1] === '#') && (tab[k][2] === 'f')){
                            mettre_des_sauts=true;
                            textObj+=espacesn(true,(niveau + 1));
                            var commt = traiteCommentaire2(tab[k][13],niveau,j);
                            textObj+='/*' + commt + '*/';
                        }else{
                            obje=js_traiteInstruction1(tab,(niveau + 2),k);
                            if(obje.status === true){
                                if(precedent_est_commentaire === true){
                                    precedent_est_commentaire=false;
                                }else{
                                    textObj+=',';
                                }
                                if(mettre_des_sauts){
                                    textObj+=espacesn(true,(niveau + 1));
                                }
                                textObj+=obje.value + '';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    'message':'js_traiteDefinitionTableau 1140 '
                                }));
                            }
                        }
                    }
                }
            }else if((tab[j][1] === 'prop') && (tab[j][2] === 'f')){
                if((tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                    proprietes+='.' + maConstante(tab[j + 1]);
                }else{
                    if((tab[j][8] === 1) && (tab[j + 1][2] === 'f')){
                        if(tab[j + 1][1] === 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=js_traiteAppelFonction(tab,(j + 1),true,niveau,true);
                            if(obj.status === true){
                                proprietes+='.' + obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'1359 erreur dans js_traiteDefinitionTableau'
                                }));
                            }
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:j,
                                tab:tab,
                                'message':'1361 erreur dans js_traiteDefinitionTableau ' + tab[j][1]
                            }));
                        }
                    }
                }
            }else if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                mettre_des_sauts=true;
                textObj+=espacesn(true,(niveau + 1));
                var commt = traiteCommentaire2(tab[j][13],niveau,j);
                textObj+='/*' + commt + '*/';
                precedent_est_commentaire=true;
            }
        }
    }
    t+='[';
    if(textObj.length > 1){
        t+=textObj.substr(1);
    }
    if(mettre_des_sauts){
        t+=espacesn(true,niveau);
    }
    t+=']' + proprietes;
    return({status:true,value:t});
}
/*
  =====================================================================================================================
*/
function js_traiteTableau1(tab,i,dansConditionOuDansFonction,niveau,recursif){
    var t='';
    var j=0;
    var k=0;
    var obj={};
    var nomTableau='';
    var positionAppelTableau=0;
    var argumentsFonction='';
    var reprise=0;
    var max=0;
    var objTxt='';
    var proprietesTableau='';
    var aDesAppelsRecursifs=false;
    var nbEnfants=0;
    var forcerNvelleLigneEnfant=false;
    var l01=tab.length;
    var contenu='';
    var termineParUnePropriete=false;
    var enfantTermineParUnePropriete=false;
    positionAppelTableau=-1;
    for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
        if((tab[j][1] === 'nomt') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
            positionAppelTableau=j;
            var obj1 = js_traiteInstruction1(tab,niveau,(j + 1));
            if(obj1.status === true){
                nomTableau=obj1.value;
            }else{
                return(logerreur({
                    status:false,
                    value:t,
                    id:i,
                    tab:tab,
                    message:'864 js_traiteTableau1 nomt'
                }));
            }
            break;
            /*
              
              if((tab[j][8] === 1) && (tab[j+1][2] === 'c')){
              nomTableau=tab[j+1][1];
              if(nomTableau === 'Array'){
              nbEnfants=tab[tab[tab[j+1][7]][7]][8]-1;
              }
              }else if((tab[j][8] === 1) && (tab[j+1][2] === 'f') && (tab[j+1][1] === 'tableau')){
              var obj = js_traiteTableau1(tab,(j+1),true,niveau,true);
              if(obj.status === true){
              nomTableau=obj.value;
              }else{
              logerreur({status:false,value:t,id:i,tab:tab,message:'1045 problème dans un tableau de tableau '});
              }
              }else{
              }
            */
        }
    }
    if((positionAppelTableau > 0) && (nomTableau !== '')){
        for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
            if(tab[j][3] === tab[i][3]){
                break;
            }
            if((tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
                if((tab[j][1] === 'nomt') || (tab[j][1] === 'p') || (tab[j][1] === '#') || (tab[j][1] === 'prop')){
                    continue;
                }else{
                    logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        'message':'1361 js_traiteTableau1 les seuls paramètres de tableau sont nomt,p,prop "' + tab[j][1] + '"'
                    });
                }
            }
        }
        argumentsFonction='';
        for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
            if((tab[j][1] === 'p') && (tab[j][3] === (tab[i][3] + 1))){
                if((tab[j][8] === 0) && (tab[j + 1][2] === 'f')){
                    argumentsFonction+=',';
                }else if((tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                    argumentsFonction+='[' + maConstante(tab[j + 1]) + ']';
                }else if((tab[j][8] > 1) && (tab[j + 1][2] === 'c')){
                    for(k=j + 1;k < l01;k=k + 1){
                        if(tab[k][3] <= tab[j][3]){
                            break;
                        }else{
                            if(nomTableau === 'concat'){
                                if(tab[k][1] === '+'){
                                    argumentsFonction+=',';
                                }else{
                                    argumentsFonction+=maConstante(tab[k]);
                                }
                            }else{
                                debugger;
                            }
                        }
                    }
                }else{
                    if((tab[j][8] === 1) && (tab[j + 1][1] === 'obj')){
                        obj=js_traiteDefinitionObjet(tab,(j + 1),true,niveau);
                        if(obj.status === true){
                            argumentsFonction+='[' + obj.value + ']';
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:i,
                                tab:tab,
                                message:'dans js_traiteTableau1 Objet il y a un problème'
                            }));
                        }
                    }else if((tab[j][8] === 1) && (tab[j + 1][2] === 'f')){
                        if(tab[j + 1][1] === 'p'){
                            obj=js_tabTojavascript1(tab,(j + 1),false,false,niveau);
                            if(obj.status === true){
                                if((nomTableau === 'Array') && (nbEnfants >= 4)){
                                    forcerNvelleLigneEnfant=true;
                                }
                                argumentsFonction+='[' + obj.value + ']';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur dans un appel de fonction imbriqué 1'
                                }));
                            }
                        }else if(
                             (tab[j + 1][1] === 'mult') 
                          || (tab[j + 1][1] === 'plus') 
                          || (tab[j + 1][1] === 'moins') 
                          || (tab[j + 1][1] === 'concat')
                          || (tab[j + 1][1] === 'decalDroite')
                          || (tab[j + 1][1] === 'ou_bin')
                          
                        ){
                            var objOperation = TraiteOperations1(tab,(j + 1),niveau);
                            if(objOperation.status === true){
                                var droite=objOperation.value;
                                if((droite.length >= 2) && (droite.substr(0,1) === '(') && (droite.substr((droite.length - 1),1) === ')')){
                                    /*
                                      pas besoin de parenthèses en plus pour un concat
                                    */
                                    droite=droite.substr(1,(droite.length - 2));
                                }
                                argumentsFonction+='[' + droite + ']';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1421 js_traiteTableau1 sur des opérations '
                                }));
                            }
                        }else if(tab[j + 1][1] === 'tableau'){
                            var objTableau = js_traiteTableau1(tab,(j + 1),true,niveau,false);
                            if(objTableau.status === true){
                                argumentsFonction+='[' + objTableau.value + ']';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1007 js_traiteTableau1 sur declaration '
                                }));
                            }
                        }else if(tab[j + 1][1] === 'postinc'){
                            var obj1 = js_tabTojavascript1(tab,(j + 1),true,true,niveau);
                            if(obj1.status === true){
                                argumentsFonction+='[' + obj1.value + ']';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1215 js_traiteTableau1 sur declaration '
                                }));
                            }
                        }else if(tab[j + 1][1] === 'appelf'){
                            var obj = js_traiteAppelFonction(tab,(j + 1),true,niveau,false);
                            if(obj.status === true){
                                argumentsFonction+='[' + obj.value + ']';
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:id,
                                    tab:tab,
                                    message:'dans js_traiteTableau1 1404 '
                                }));
                            }
                        }else{
                            debugger;
                            return(logerreur({
                                status:false,
                                value:t,
                                id:j,
                                tab:tab,
                                'message':'erreur js_traiteTableau1 1145 pour ' + tab[j + 1][1]
                            }));
                        }
                    }
                }
            }else if((tab[j][1] === 'prop') && (tab[j][3] === (tab[i][3] + 1))){
                termineParUnePropriete=true;
                if((tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                    proprietesTableau+='.' + maConstante(tab[j + 1]);
                }else{
                    if((tab[j][8] === 1) && (tab[j + 1][2] === 'f')){
                        if(tab[j + 1][1] === 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=js_traiteAppelFonction(tab,(j + 1),true,niveau,true);
                            if(obj.status === true){
                                proprietesTableau+='.' + obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur dans un appel de fonction imbriqué 1'
                                }));
                            }
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:j,
                                tab:tab,
                                'message':'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue ' + tab[j][1]
                            }));
                        }
                    }
                }
            }
        }
        t+=nomTableau;
        t+=argumentsFonction;
        t+=proprietesTableau;
        if( !(dansConditionOuDansFonction)){
            t+='' + terminateur + '';
        }
    }else{
        return(logerreur({
            status:false,
            value:t,
            id:i,
            tab:tab,
            message:' dans js_traiteTableau1 1024 il faut un nom de tableau nomt(xxxx)'
        }));
    }
    return({status:true,value:t,'forcerNvelleLigneEnfant':forcerNvelleLigneEnfant,'termineParUnePropriete':termineParUnePropriete});
}
/*
  =====================================================================================================================
*/
function js_traiteInstruction1(tab,niveau,id){
    var t='';
    if(tab[id][2] === 'c'){
        t+=maConstante(tab[id]);
    }else if((tab[id][2] === 'f') && (tab[id][1] === 'appelf')){
        var obj = js_traiteAppelFonction(tab,tab[id][0],true,niveau,false);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:id,
                tab:tab,
                message:'dans js_traiteInstruction1 1043 '
            }));
        }
    }else if((tab[id][1] === 'plus')
     || (tab[id][1] === 'mult')
     || (tab[id][1] === 'divi')
     || (tab[id][1] === 'modulo')
     || (tab[id][1] === 'moins')
     || (tab[id][1] === 'etBin')
     || (tab[id][1] === 'ou_ex_bin')
     || (tab[id][1] === 'ou_bin')
     || (tab[id][1] === 'nonBin')
     || (tab[id][1] === 'puissance')
     || (tab[id][1] === 'decalDroite')
     || (tab[id][1] === 'decal_droite_non_signe')
     || (tab[id][1] === 'decalGauche')
     || (tab[id][1] === 'concat')){
        var objOperation = TraiteOperations1(tab,tab[id][0]);
        if(objOperation.status === true){
            t+=objOperation.value;
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:id,
                tab:tab,
                message:'erreur sur js_traiteInstruction1 1050 '
            }));
        }
    }else if(tab[id][1] === 'obj'){
        var obj = js_traiteDefinitionObjet(tab,tab[id][0],true,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:id,
                tab:tab,
                message:'erreur sur js_traiteInstruction1 1064 '
            }));
        }
    }else if(tab[id][1] === 'tableau'){
        var objTableau = js_traiteTableau1(tab,tab[id][0],true,niveau,false);
        if(objTableau.status === true){
            t+=objTableau.value;
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:j,
                tab:tab,
                message:'erreur 1007 sur declaration '
            }));
        }
    }else if(tab[id][1] === 'testEnLigne'){
        var testEnLigne = [];
        var j = (id + 1);
        for(j=id + 1;(j < tab.length) && (tab[j][3] > tab[id][3]);j=j + 1){
            if(tab[j][3] === (tab[id][3] + 1)){
                if(tab[j][1] === 'condition'){
                    testEnLigne.push([j,tab[j][1],id]);
                }else if(tab[j][1] === 'siVrai'){
                    testEnLigne.push([j,tab[j][1],id]);
                }else if(tab[j][1] === 'siFaux'){
                    testEnLigne.push([j,tab[j][1],id]);
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:id,
                        tab:tab,
                        message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'
                    }));
                }
            }
        }
        if(testEnLigne.length !== 3){
            return(logerreur({status:false,message:'fonction js_traiteInstruction1 1524 il faut un format testEnLigne(condition() , siVrai(1) , siFaux(2))"'}));
        }
        var j=0;
        for(j=0;j < testEnLigne.length;j=j + 1){
            if(testEnLigne[j][1] === 'condition'){
                var objCondition = js_condition0(tab,testEnLigne[j][0],(niveau + 1));
                if(objCondition.status === true){
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:testEnLigne[j][0],
                        tab:tab,
                        'message':'1 js_traiteInstruction1 sur condition 1533 ' + testEnLigne[j][0]
                    }));
                }
            }else if(testEnLigne[j][1] === 'siVrai'){
                var objSiVrai = js_traiteInstruction1(tab,(niveau + 1),(testEnLigne[j][0] + 1));
                if(objSiVrai.status === true){
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:testEnLigne[j][0],
                        tab:tab,
                        'message':'1 js_traiteInstruction1 sur siVrai 1542 ' + testEnLigne[j][0]
                    }));
                }
            }else if(testEnLigne[j][1] === 'siFaux'){
                var objSiFaux = js_traiteInstruction1(tab,(niveau + 1),(testEnLigne[j][0] + 1));
                if(objSiFaux.status === true){
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:testEnLigne[j][0],
                        tab:tab,
                        'message':'1 js_traiteInstruction1 sur objSiFaux 1716 ' + testEnLigne[j][0]
                    }));
                }
            }
        }
        t='(' + objCondition.value + '?' + objSiVrai.value + ':' + objSiFaux.value + ')';
    }else if(tab[id][1] === 'condition'){
        var objcond = js_condition0(tab,tab[id][0],niveau);
        if(objcond.status === true){
            t+=objcond.value;
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:id,
                tab:tab,
                message:'js_traiteInstruction1 1313'
            }));
        }
    }else if(tab[id][1] === 'new'){
        /* todo faire un traitement de "new" à la place de +1 çi dessous */
        obj=js_traiteAppelFonction(tab,(id + 1),true,niveau,false);
        if(obj.status === true){
            t+=' new ' + obj.value + '';
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:i,
                tab:tab,
                message:'erreur dans une déclaration'
            }));
        }
    }else if(('inf' === tab[id][1])
     || ('non' === tab[id][1])
     || ('supeg' === tab[id][1])
     || ('diffstricte' === tab[id][1])
     || ('egalstricte' === tab[id][1])
     || ('egal' === tab[id][1])
     || ('ou_bin' === tab[id][1])){
        obj=js_condition1(tab,id,niveau);
        if(obj.status === true){
            t+='(' + obj.value + ')';
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:i,
                tab:tab,
                message:'erreur dans une déclaration'
            }));
        }
    }else if(tab[id][1] === 'defTab'){
        var obj1 = js_traiteDefinitionTableau(tab,id,niveau,{});
        if(obj1.status === true){
            t+=obj1.value;
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:id,
                tab:tab,
                message:'erreur sur declaration 0803'
            }));
        }
    }else if((tab[id][1] === 'affecte') || (tab[id][1] === 'cascade')){
        var obj = js_tabTojavascript1(tab,id,true,true,niveau);
        if(obj.status === true){
            t+=obj.value + '';
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:id,
                tab:tab,
                'message':'erreur sur js_traiteInstruction1 1230 pour ' + tab[id][1]
            }));
        }
    }else if((tab[id][1] === 'definition_de_classe') && (tab[id][2] === 'f')){
        var obj = js_traiteDefinitionClasse(tab,id,niveau);
        if(obj.status === true){
            t+=obj.value;
        }else{
            return(logerreur({
                status:false,
                value:t,
                id:id,
                tab:tab,
                message:'erreur sur js_traiteInstruction1 1064 '
            }));
        }
    }else{
        return(logerreur({
            status:false,
            value:t,
            id:id,
            tab:tab,
            'message':'erreur sur js_traiteInstruction1 1412 pour ' + tab[id][1]
        }));
    }
    return({status:true,value:t});
}
/*
  =====================================================================================================================
*/
function js_traiteDefinitionClasse(tab,id,niveau){
    var t='';
    var i=0;
    var j=0;
    var k=0;
    var l01=tab.length;
    var nom_classe='';
    var contenu_classe='';
    for(i=id + 1;(i < l01) && (tab[i][3] > tab[id][3]);i++){
        if(tab[i][7] === id){
            if((tab[i][1] === 'nom_classe') && (tab[i][2] === 'f')){
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
                    if(tab[j][7] === i){
                        if(tab[j][2] === 'c'){
                            nom_classe=tab[j][1];
                        }
                    }
                }
            }else if((tab[i][1] === 'contenu') && (tab[i][2] === 'f')){
                var obj = js_tabTojavascript1(tab,(i + 1),false,false,(niveau + 1));
                if(obj.status === true){
                    contenu_classe+=obj.value;
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:j,
                        tab:tab,
                        message:'erreur dans le contenu d\'une classe '
                    }));
                }
            }
        }
    }
    t+=espacesn(true,niveau);
    t+='class ' + nom_classe + '{';
    t+=contenu_classe;
    t+=espacesn(true,niveau);
    t+='}';
    return({status:true,value:t});
}
/*
  =====================================================================================================================
*/
function js_traiteDefinitionObjet(tab,id,dansConditionOuDansFonction,niveau){
    var t='';
    var j=0;
    var obj={};
    var textObj='';
    var precedent_est_commentaire=false;
    var a_des_commentaires=false;
    for(j=id + 1;(j < tab.length) && (tab[j][3] > tab[id][3]) && (a_des_commentaires === false);j=j + 1){
        if(tab[j][3] === (tab[id][3] + 1)){
            if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                a_des_commentaires=true;
                break;
            }
        }
    }
    if((a_des_commentaires === false) && (tab[id][8] > 5)){
        a_des_commentaires=true;
    }
    for(j=id + 1;(j < tab.length) && (tab[j][3] > tab[id][3]);j=j + 1){
        if(tab[j][3] === (tab[id][3] + 1)){
            if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                if(textObj === ''){
                    textObj+=',';
                }else{
                    if(precedent_est_commentaire === false){
                        textObj+=',';
                    }
                }
                textObj+=espacesn(true,(niveau + 1));
                var commt = traiteCommentaire2(tab[j][13],(niveau + 1),j);
                textObj+='/*' + commt + '*/';
                textObj+=espacesn(true,(niveau + 1));
                precedent_est_commentaire=true;
            }else if((tab[j][1] === '') && (tab[j][2] === 'f')){
                if(tab[j][8] === 2){
                    if(precedent_est_commentaire){
                        precedent_est_commentaire=false;
                    }else{
                        textObj+=',';
                        if(a_des_commentaires){
                            textObj+=espacesn(true,(niveau + 1));
                        }
                    }
                    if(tab[j + 2][2] === 'f'){
                        if(tab[j + 2][1] === 'obj'){
                            obj=js_traiteDefinitionObjet(tab,(j + 2),true,(niveau + 1));
                            if(obj.status === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:id,
                                    tab:tab,
                                    message:'dans js_traiteDefinitionObjet il y a un problème'
                                }));
                            }
                        }else if((tab[j + 2][1] === 'plus') || (tab[j + 2][1] === 'moins') || (tab[j + 2][1] === 'concat')){
                            var objOperation = TraiteOperations1(tab,(j + 2),0);
                            if(objOperation.status === true){
                                var droite=objOperation.value;
                                if((droite.length >= 2) && (tab[j + 2][1] === 'concat') && (droite.substr(0,1) === '(') && (droite.substr((droite.length - 1),1) === ')')){
                                    droite=droite.substr(1,(droite.length - 2));
                                }
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + droite;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur js_traiteDefinitionObjet 1496 sur des opérations '
                                }));
                            }
                        }else if(tab[j + 2][1] === 'appelf'){
                            var dans_condition=true;
                            if(a_des_commentaires === true){
                                dans_condition=false;
                            }
                            var objfnt1 = js_traiteAppelFonction(tab,(j + 2),dans_condition,(niveau + 1),false);
                            if(objfnt1.status === true){
                                if(objfnt1.value.substr((objfnt1.value.length - 1),1) === ';'){
                                    textObj+=maConstante(tab[j + 1]) + ':' + objfnt1.value.substr(0,(objfnt1.value.length - 1));
                                }else{
                                    textObj+=maConstante(tab[j + 1]) + ':' + objfnt1.value;
                                }
                            }else{
                                logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    'message':'1069 erreur sur appel de fonction nom "' + tab[j][1] + '"'
                                });
                            }
                        }else if(tab[j + 2][1] === 'tableau'){
                            var objTableau = js_traiteTableau1(tab,(j + 2),true,0,false);
                            if(objTableau.status === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + objTableau.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1392 sur js_traiteDefinitionObjet '
                                }));
                            }
                        }else if(tab[j + 2][1] === 'defTab'){
                            var objTableau = js_traiteDefinitionTableau(tab,(j + 2),0,{});
                            if(objTableau.status === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + objTableau.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:tabdeclare[0][0],
                                    tab:tab,
                                    message:'erreur sur declaration 0803'
                                }));
                            }
                        }else if(tab[j + 2][1] === 'condition'){
                            obj=js_condition0(tab,(j + 2),niveau);
                            if(obj.status === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    'message':'erreur dans js_traiteDefinitionObjet, 1438 '
                                }));
                            }
                        }else if(tab[j + 2][1] === 'testEnLigne'){
                            var objtestLi = js_traiteInstruction1(tab,niveau,(j + 2));
                            if(objtestLi.status === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + objtestLi.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur js_traiteDefinitionObjet 1476'
                                }));
                            }
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:id,
                                tab:tab,
                                'message':'dans js_traiteDefinitionObjet, 1492 "' + tab[j + 2][1] + '"'
                            }));
                        }
                    }else{
                        textObj+=maConstante(tab[j + 1]) + ':' + maConstante(tab[j + 2]);
                    }
                }
            }
        }
    }
    t+='{';
    if(textObj !== ''){
        t+=textObj.substr(1);
    }
    if(a_des_commentaires){
        t+=espacesn(true,niveau);
    }
    t+='}';
    return({status:true,value:t});
}
function js_traiteAppelFonction(tab,i,dansConditionOuDansFonction,niveau,recursif){
    var t='';
    var j=0;
    var k=0;
    var obj={};
    var nomFonction='';
    var positionAppelFonction=0;
    var nomRetour='';
    var nomElement='';
    var positionRetour=-1;
    var argumentsFonction='';
    var reprise=0;
    var max=0;
    var objTxt='';
    var proprietesFonction='';
    var aDesAppelsRecursifs=false;
    var nbEnfants=0;
    var forcerNvelleLigneEnfant=false;
    var l01=tab.length;
    var contenu='';
    var termineParUnePropriete=false;
    var enfantTermineParUnePropriete=false;
    var flechee=false;
    positionAppelFonction=-1;
    var id_de_la_fonction='';
    for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
        if((tab[j][1] === 'nomf') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
            positionAppelFonction=j;
            if((tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                nomFonction=tab[j + 1][1];
                if(nomFonction === 'Array'){
                    nbEnfants=tab[tab[tab[j + 1][7]][7]][8] - 1;
                }
            }else if((tab[j][8] === 2) && (tab[j + 1][1] === 'new')){
                nomFonction=tab[j + 1][1] + ' ' + tab[j + 2][1];
            }else if((tab[j + 1][1] === 'appelf') && (tab[j + 1][2] === 'f')){
                var obj1 = js_traiteAppelFonction(tab,(j + 1),true,niveau,true);
                if(obj1.status === true){
                    nomFonction=obj1.value;
                    enfantTermineParUnePropriete=obj1.termineParUnePropriete;
                    aDesAppelsRecursifs=true;
                }else{
                    logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        'message':'1069 erreur sur appel de fonction nom "' + tab[j][1] + '"'
                    });
                }
            }
            break;
        }else if((tab[j][1] === 'flechee') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
            flechee=true;
        }else if((tab[j][1] === 'id') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
            /*
              *
              exemple d'utilisation : 
              PluginManager.pluginEvent.bind(Sortable)(
              eventName, 
              sortable, 
              _objectSpread2(
              {
              unhideGhostForTarget: _unhideGhostForTarget,
              cloneNowHidden: function cloneNowHidden() {
              cloneHidden = true;
              },
              }, 
              data
              )
              );
              
            */
            id_de_la_fonction=' ' + tab[j + 1][1];
        }
    }
    if((positionAppelFonction > 0) && (nomFonction !== '')){
        nomRetour='';
        positionRetour=-1;
        for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
            if((tab[j][1] === 'r') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
                if(tab[j][8] === 1){
                    nomRetour=tab[j + 1][1];
                }
                positionRetour=j;
                break;
            }
        }
        for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
            if((tab[j][1] === 'element') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
                if(tab[j][8] === 1){
                    if(tab[j + 1][2] === 'c'){
                        /*
                          if[tab[j+1][4]==true]{
                          nomElement='\''+tab[j+1][1]+'\'';
                          }else{
                          nomElement=tab[j+1][1];
                          }
                        */
                        nomElement=maConstante(tab[j + 1]);
                    }else if(tab[j + 1][2] === 'f'){
                        var objinst = js_traiteInstruction1(tab,niveau,(j + 1));
                        if(objinst.status === true){
                            nomElement=objinst.value;
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:i,
                                tab:tab,
                                message:'element incorrecte dans appelf 1592 '
                            }));
                        }
                    }
                }
                break;
            }
        }
        for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
            if(tab[j][3] === tab[i][3]){
                break;
            }
            if((tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
                if((tab[j][1] === 'element')
                 || (tab[j][1] === 'nomf')
                 || (tab[j][1] === 'p')
                 || (tab[j][1] === 'appelf')
                 || (tab[j][1] === 'r')
                 || (tab[j][1] === 'prop')
                 || (tab[j][1] === '#')
                 || (tab[j][1] === 'contenu')
                 || (tab[j][1] === 'id')
                 || (tab[j][1] === 'flechee')){
                    continue;
                }else{
                    logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        'message':'1852 les seuls paramètres de appelf sont nomf,p,r,element,flechee et non pas "' + tab[j][1] + '"'
                    });
                }
            }
        }
        argumentsFonction='';
        for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
            if((tab[j][1] === 'obj') && (tab[j][3] === (tab[i][3] + 1))){
                obj=js_traiteDefinitionObjet(tab,j,true,niveau);
                if(obj.status === true){
                    argumentsFonction+=',' + obj.value + '';
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'dans js_traiteAppelFonction Objet il y a un problème'
                    }));
                }
                reprise=j + 1;
                max=j + 1;
                for(k=max;(k < l01) && (tab[j][3] > tab[j][3]);k=k + 1){
                    reprise=j;
                }
                j=reprise;
            }else if((tab[j][1] === 'prop') && (tab[j][3] === (tab[i][3] + 1))){
                termineParUnePropriete=true;
                if((tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                    proprietesFonction+='.' + maConstante(tab[j + 1]);
                }else{
                    if((tab[j][8] === 1) && (tab[j + 1][2] === 'f')){
                        if(tab[j + 1][1] === 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=js_traiteAppelFonction(tab,(j + 1),true,niveau,true);
                            if(obj.status === true){
                                proprietesFonction+='.' + obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur dans un appel de fonction imbriqué 1'
                                }));
                            }
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:j,
                                tab:tab,
                                'message':'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue ' + tab[j][1]
                            }));
                        }
                    }
                }
                reprise=j + 1;
                max=j + 1;
                for(k=max;(k < l01) && (tab[k][3] > tab[j][3]);k=k + 1){
                    reprise=k;
                }
                j=reprise;
            }else if((tab[j][1] === 'appelf') && (tab[j][3] === (tab[i][3] + 1))){
                aDesAppelsRecursifs=true;
                if(tab[j + 1][1] === 'cascade'){
                    obj=js_tabTojavascript1(tab,j,false,false,niveau);
                }else{
                    obj=js_traiteAppelFonction(tab,j,true,niveau,true);
                }
                if(obj.status === true){
                    argumentsFonction+=',';
                    if((nomFonction === 'Array') && (nbEnfants >= 4)){
                        forcerNvelleLigneEnfant=true;
                        argumentsFonction+=espacesn(true,(niveau + 1));
                    }
                    argumentsFonction+=obj.value;
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:j,
                        tab:tab,
                        message:'erreur dans un appel de fonction imbriqué 1'
                    }));
                }
            }else if((tab[j][1] === 'contenu') && (tab[j][3] === (tab[i][3] + 1))){
                if((true) || (nomFonction === 'function')){
                    contenu='';
                    if(tab[j][8] === 0){
                        contenu='/* vide */';
                    }else{
                        obj=js_tabTojavascript1(tab,(j + 1),false,false,(niveau + 1));
                        if(obj.status === true){
                            contenu+=obj.value;
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:j,
                                tab:tab,
                                message:'erreur dans un appelf sur  le contenu d\'une fonction "function" '
                            }));
                        }
                        reprise=j + 1;
                        max=j + 1;
                        for(k=max;(k < l01) && (tab[j][3] > tab[j][3]);k=k + 1){
                            reprise=j;
                        }
                        j=reprise;
                    }
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:j,
                        tab:tab,
                        message:'erreur dans un appelf, seule une fonction "function" peut avoir un contenu '
                    }));
                }
            }else if((tab[j][1] === 'p') && (tab[j][3] === (tab[i][3] + 1))){
                if((tab[j][8] === 0) && (tab[j + 1][2] === 'f')){
                    argumentsFonction+=',';
                }else if((tab[j][8] === 1) && (tab[j + 1][2] === 'c')){
                    argumentsFonction+=',' + maConstante(tab[j + 1]);
                }else if((tab[j][8] > 1) && (tab[j + 1][2] === 'c')){
                    for(k=j + 1;k < l01;k=k + 1){
                        if(k === (j + 1)){
                            argumentsFonction+=',';
                        }
                        if(tab[k][3] <= tab[j][3]){
                            break;
                        }else{
                            if(nomFonction === 'concat'){
                                if(tab[k][1] === '+'){
                                    argumentsFonction+=',';
                                }else{
                                    argumentsFonction+='' + maConstante(tab[k]);
                                }
                            }else{
                                debugger;
                            }
                        }
                    }
                }else{
                    if((tab[j][8] === 1) && (tab[j + 1][1] === 'obj')){
                        obj=js_traiteDefinitionObjet(tab,(j + 1),true,niveau);
                        if(obj.status === true){
                            argumentsFonction+=',' + obj.value + '';
                        }else{
                            return(logerreur({
                                status:false,
                                value:t,
                                id:i,
                                tab:tab,
                                message:'dans js_traiteAppelFonction Objet il y a un problème'
                            }));
                        }
                    }else if(tab[j + 1][2] === 'f'){
                        if(tab[j][8] > 1){
                            var a_un_commentaire=false;
                            var k = (j + 1);
                            for(k=j + 1;(k < l01) && (tab[k][3] > tab[j][3]) && (a_un_commentaire === false);k++){
                                if(tab[k][7] === j){
                                    if((tab[k][1] === '#') && (tab[k][2] === 'f')){
                                        a_un_commentaire=true;
                                    }
                                }
                            }
                            if(a_un_commentaire === false){
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'2036 erreur un paramètre p() a trop d\'arguments '
                                }));
                            }
                        }
                        var precedent_est_un_commentaire=false;
                        var k = (j + 1);
                        for(k=j + 1;(k < l01) && (tab[k][3] > tab[j][3]);k++){
                            if(tab[k][7] === j){
                                if(precedent_est_un_commentaire === true){
                                    /* on ne met pas de virgule */
                                    precedent_est_un_commentaire=false;
                                }else{
                                    argumentsFonction+=',';
                                }
                                if((tab[k][1] === '#') && (tab[k][2] === 'f')){
                                    if(argumentsFonction === ','){
                                        /* */
                                        argumentsFonction=',/* */';
                                    }else{
                                        argumentsFonction+='/* */';
                                    }
                                    precedent_est_un_commentaire=true;
                                }else if(((tab[k][2] === 'f') && (tab[k][1] === 'appelf')) || (tab[k][1] === 'cascade')){
                                    aDesAppelsRecursifs=true;
                                    if(tab[k][1] === 'cascade'){
                                        obj=js_tabTojavascript1(tab,k,false,false,niveau);
                                    }else{
                                        obj=js_traiteAppelFonction(tab,k,true,niveau,true);
                                    }
                                    if(obj.status === true){
                                        if((nomFonction === 'Array') && (nbEnfants >= 4)){
                                            forcerNvelleLigneEnfant=true;
                                            argumentsFonction+=espacesn(true,(niveau + 1));
                                        }
                                        argumentsFonction+=obj.value;
                                    }else{
                                        return(logerreur({
                                            status:false,
                                            value:t,
                                            id:k,
                                            tab:tab,
                                            message:'erreur dans un appel de fonction imbriqué 1'
                                        }));
                                    }
                                    /*
                                      }else if(tab[k][2] === 'f' && tab[k][1] === 'p'){
                                      obj=js_tabTojavascript1(tab,(k),false,false,niveau);
                                      if(obj.status === true){
                                      if((nomFonction === 'Array') && (nbEnfants >= 4)){
                                      forcerNvelleLigneEnfant=true;
                                      argumentsFonction+=espacesn(true,(niveau+1));
                                      }
                                      argumentsFonction+=obj.value;
                                      }else{
                                      return(logerreur({status:false,value:t,id:k,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                                      }
                                    */
                                }else if((tab[k][2] === 'f') && (tab[k][1] === '@')){
                                    argumentsFonction+=tab[k][13];
                                }else if(((tab[k][2] === 'f')
                                 && (tab[k][1] === 'mult'))
                                 || (tab[k][1] === 'plus')
                                 || (tab[k][1] === 'divi')
                                 || (tab[k][1] === 'moins')
                                 || (tab[k][1] === 'concat')
                                 || (tab[k][1] === 'etBin')
                                 || (tab[k][1] === 'ou_bin')
                                 || (tab[k][1] === 'ou_ex_bin')
                                ){
                                    var objOperation = TraiteOperations1(tab,k,niveau);
                                    if(objOperation.status === true){
                                        if((tab[k][1] === 'concat') && (objOperation.value.substr(0,1) === '(') && (objOperation.value.substr((objOperation.value.length - 1),1) === ')')){
                                            objOperation.value=objOperation.value.substr(1,(objOperation.value.length - 2));
                                        }
                                        argumentsFonction+=objOperation.value;
                                    }else{
                                        return(logerreur({
                                            status:false,
                                            value:t,
                                            id:k,
                                            tab:tab,
                                            message:'erreur 2107 sur des opérations '
                                        }));
                                    }
                                }else if((tab[k][2] === 'f') && (tab[k][1] === 'tableau')){
                                    var objTableau = js_traiteTableau1(tab,tab[k][0],true,niveau,false);
                                    if(objTableau.status === true){
                                        argumentsFonction+=objTableau.value;
                                    }else{
                                        return(logerreur({
                                            status:false,
                                            value:t,
                                            id:k,
                                            tab:tab,
                                            message:'erreur 1007 sur declaration '
                                        }));
                                    }
                                }else if(tab[k][2] === 'c'){
                                    argumentsFonction+=maConstante(tab[k]);
                                }else{
                                    
                                    var objJs = js_tabTojavascript1(tab,tab[k][0],true,true,niveau);
                                    if(objJs.status === true){
                                        argumentsFonction+=objJs.value;
                                    }else{
                                        return(logerreur({
                                            status:false,
                                            value:t,
                                            id:tab[k][0],
                                            tab:tab,
                                            'message':'erreur 1425 dans js_traiteAppelFonction '
                                        }));
                                    }
                                }
                            }
                        }
                    }else{
                        /* on a deux éléments dans le paramètre p(), c'est bizarre sauf si un des éléments est un commentaire*/
                        debugger;
                    }
                }
            }
        }
        if( !(dansConditionOuDansFonction)){
            t+=espacesn(true,niveau);
        }
        t+=((nomRetour !== '')?(nomRetour + '='):'');
        if((recursif === true) && (nomRetour === '') && ( !(dansConditionOuDansFonction))){
            t+=espacesn(true,(niveau + 1)) + ((nomElement === '')?'':(nomElement + '.'));
        }else{
            t+=((nomElement === '')?'':(nomElement + '.'));
        }
        /*
          le nom de la fonction ici 
        */
        if((nomFonction === 'Array') && ( !(enfantTermineParUnePropriete))){
            t+='';
            /* */
        }else{
            if(id_de_la_fonction !== ''){
                t+='(';
            }
            if((nomFonction === 'function') && (flechee === true)){
                t+=id_de_la_fonction;
            }else{
                t+=nomFonction + id_de_la_fonction;
            }
        }
        if( !(enfantTermineParUnePropriete)){
            if(nomFonction === 'Array'){
                t+='[';
            }else{
                if((nomFonction === 'super') && (argumentsFonction === '')){
                    /* pas de parenthèses pour la fonction super */
                    t+='';
                }else{
                    t+='(';
                }
            }
        }
        t+=((argumentsFonction !== '')?argumentsFonction.substr(1):'');
        if(((aDesAppelsRecursifs) && ( !(dansConditionOuDansFonction)) && (nomRetour === '') && (nomElement === '') && (enfantTermineParUnePropriete === false)) || (forcerNvelleLigneEnfant)){
            t+=espacesn(true,niveau);
        }
        if( !(enfantTermineParUnePropriete)){
            if(nomFonction === 'Array'){
                t+=']';
            }else{
                if((nomFonction === 'super') && (argumentsFonction === '')){
                    /* pas de parenthèses pour la fonction super */
                    t+='';
                }else{
                    t+=')';
                    if((nomFonction === 'function') && (flechee === true)){
                        t+=' => ';
                    }
                }
            }
        }
        if(nomFonction === 'function'){
            t+='{' + contenu;
            t+=espacesn(true,niveau);
            t+='}';
            if(id_de_la_fonction !== ''){
                t+=')';
            }
        }
        t+=proprietesFonction;
        if( !(dansConditionOuDansFonction)){
            t+=';';
        }
    }else{
        return(logerreur({
            status:false,
            value:t,
            id:i,
            tab:tab,
            message:' dans js_traiteAppelFonction il faut un nom de fonction à appeler nomf(xxxx)'
        }));
    }
    return({status:true,value:t,'forcerNvelleLigneEnfant':forcerNvelleLigneEnfant,'termineParUnePropriete':termineParUnePropriete});
}
/*
  =====================================================================================================================
*/
function recupere_operateur(n){
    if(n === 'mult'){
        return '*';
    }else if(n === 'divi'){
        return '/';
    }else if(n === 'modulo'){
        return '%';
    }else if(n === 'puissance'){
        return '**';
    }else if(n === 'plus'){
        return '+';
    }else if(n === 'concat'){
        return '+';
    }else if(n === 'moins'){
        return '-';
    }else if(n === 'etBin'){
        return '&';
    }else if(n === 'ou_ex_bin'){
        return '^';
    }else if(n === 'nonBin'){
        return '~';
    }else if(n === 'ou_bin'){
        return '|';
    }else if(n === 'decalDroite'){
        return '>>';
    }else if(n === 'decal_droite_non_signe'){
        return '>>>';
    }else if(n === 'decalGauche'){
        return '<<';
    }else if(n === 'egalstricte'){
        return '===';
    }else if(n === 'egal'){
        return '==';
    }else if(n === 'Typeof'){
        return 'typeof ';
    }else{
        debugger;
        logerreur({status:false,'message':'2118 recupere_operateur pour "' + n + '" '});
        return(('2118 BUG recupere_operateur pour "' + n + '"'));
    }
}
/*
  =====================================================================================================================
*/
function TraiteOperations1(tab,id,niveau){
    var t='';
    var i=0;
    var j=0;
    var l01=tab.length;
    var ajoute_parentheses=false;
    var premier_operande=true;
    /*
      
      opération simple avec qu'un operande
      moins(117)
    */
    if(tab[id][8] === 1){
        var operateur = recupere_operateur(tab[id][1]);
        if(tab[id + 1][2] === 'c'){
            t=operateur + tab[id + 1][1];
            return({value:t,status:true});
        }else{
            if((tab[id + 1][1] === 'mult')
             || (tab[id + 1][1] === 'plus')
             || (tab[id + 1][1] === 'concat')
             || (tab[id + 1][1] === 'moins')
             || (tab[id + 1][1] === 'mult')
             || (tab[id + 1][1] === 'divi')
             || (tab[id + 1][1] === 'modulo')
             || (tab[id + 1][1] === 'etBin')
             || (tab[id + 1][1] === 'ou_ex_bin')
             || (tab[id + 1][1] === 'ou_bin')
             || (tab[id + 1][1] === 'nonBin')             
             || (tab[id + 1][1] === 'decalDroite')
             || (tab[id + 1][1] === 'decalGauche')
             || (tab[id + 1][1] === 'decal_droite_non_signe')
            ){
                var obj = TraiteOperations1(tab,(id + 1),niveau);
                if(obj.status === true){
                    t=operateur + obj.value;
                    return({value:t,status:true});
                }else{
                    return(logerreur({status:false,message:' erreur sur TraiteOperations1 2175'}));
                }
            }else{
                var obj = js_traiteInstruction1(tab,niveau,(id + 1));
                if(obj.status === true){
                    t=operateur + obj.value;
                    return({value:t,status:true});
                }else{
                    return(logerreur({status:false,message:' erreur sur TraiteOperations1 2271'}));
                }
            }
        }
    }
    /*
      moins(117,mult(mult(2,niveau),nbEspacesSrc1))
    */
    if(tab[id][1] !== tab[tab[id][7]][1]){
        /* à priori, si l'opé parent est différente, on ajoute des parenthèses */
        ajoute_parentheses=true;
    }
    var operateur = recupere_operateur(tab[id][1]);
    var i = (id + 1);
    for(i=id + 1;(i < l01) && (tab[i][3] > tab[id][3]);i++){
        if(tab[i][7] === id){
            if(premier_operande === true){
                /* on ne met pas l'opérateur */
                premier_operande=false;
                if(ajoute_parentheses){
                    t+='(';
                }
            }else{
                t+=' ' + operateur + ' ';
            }
            if(tab[i][2] === 'c'){
                t+=maConstante(tab[i]);
            }else{
                if((tab[i][1] === 'mult')
                 || (tab[i][1] === 'plus')
                 || (tab[i][1] === 'concat')
                 || (tab[i][1] === 'moins')
                 || (tab[i][1] === 'mult')
                 || (tab[i][1] === 'divi')
                 || (tab[i][1] === 'modulo')
                 || (tab[i][1] === 'etBin')
                 || (tab[i][1] === 'ou_ex_bin')
                 || (tab[i][1] === 'ou_bin')
                 || (tab[i][1] === 'nonBin')
                 || (tab[i][1] === 'decalDroite')
                 || (tab[i][1] === 'decal_droite_non_signe')
                 || (tab[i][1] === 'decalGauche')
                ){
                    var objOperation = TraiteOperations1(tab,i,niveau);
                    if(objOperation.status === true){
                        if((tab[i][1] === 'plus') || (tab[i][1] === 'moins')){
                            t+='(' + objOperation.value + ')';
                        }else{
                            t+=objOperation.value;
                        }
                    }else{
                        return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                    }
                }else if(tab[i][1] === ''){
                    var objOperation = TraiteOperations1(tab,(i + 1));
                    if(objOperation.status === true){
                        t+='(' + objOperation.value + ')';
                    }else{
                        return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                    }
                }else if(tab[i][1] === 'appelf'){
                    var obj = js_traiteAppelFonction(tab,i,true,niveau,false);
                    if(obj.status === true){
                        t+=obj.value;
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:id,
                            tab:tab,
                            message:'erreur TraiteOperations1 1609'
                        }));
                    }
                }else if(tab[i][1] === 'tableau'){
                    var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                    if(objTableau.status === true){
                        t+=objTableau.value;
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            message:'erreur 1844 sur TraiteOperations1 '
                        }));
                    }
                }else if(tab[i][1] === 'testEnLigne'){
                    var objtestLi = js_traiteInstruction1(tab,niveau,i);
                    if(objtestLi.status === true){
                        t+=objtestLi.value;
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            message:'erreur TraiteOperations1 1808'
                        }));
                    }
                }else if(tab[i][1] === 'new'){
                    obj=js_traiteAppelFonction(tab,(i + 1),true,niveau,false);
                    if(obj.status === true){
                        t+=' new ' + obj.value;
                    }else{
                        return(logerreur({
                            status:false,
                            value:t,
                            id:i,
                            tab:tab,
                            message:'2367 erreur dans TraiteOperations1'
                        }));
                    }
                }else{
                    return(logerreur({status:false,'message':'fonction du premier paramètre non reconnue TraiteOperations1 2361 "' + tab[i][1] + '"'}));
                }
            }
            /* si c'est le dernier enfant */
            if(tab[i][9] === tab[id][8]){
                if(ajoute_parentheses){
                    t+=')';
                }
            }
        }
    }
    return({value:t,status:true});
}
/*
  ancienne version
*/
function TraiteOperations2_ancien_a_supprimer(tab,id,niveau){
    var t='';
    var i=0;
    var j=0;
    /*
      dans le cas d'un "plus" simple on est peut être au milieu d'une concaténation de chaine.
      Si un des deux paramètre est numérique il est plus prudent d'ajouter une parenthèse
      a+='e['+[f+1]+'] g '+h+' i';
    */
    var condi0 = ((tab[id][8] === 2) && (tab[id][1] === 'plus')) && (((tab[id + 1][2] === 'c') && (isNumeric(tab[id + 1][1]))) || ((tab[id + 2][2] === 'c') && (isNumeric(tab[id + 2][1]))));
    var l01=tab.length;
    var parentId=tab[id][0];
    var numEnfant=1;
    var i = (id + 1);
    var parentheseEnPremier=false;
    for(i=id + 1;i < l01;i=i + 1){
        if(tab[i][3] <= tab[parentId][3]){
            break;
        }
        if(tab[i][7] === parentId){
            if((tab[i][1] === '#') && (tab[i][2] === 'f')){
            }else if((tab[i][1] === '') && (tab[i][2] === 'f')){
                var objOperation = TraiteOperations1(tab,(i + 1));
                if(objOperation.status === true){
                    if(tab[parentId][1] === 'mult'){
                        t+='*';
                    }else if(tab[parentId][1] === 'plus'){
                        t+='+';
                    }else if(tab[parentId][1] === 'concat'){
                        t+='+';
                    }else if(tab[parentId][1] === 'modulo'){
                        t+='%';
                    }else if(tab[parentId][1] === 'moins'){
                        t+='-';
                    }else if(tab[parentId][1] === 'decalDroite'){
                        t+='>>';
                    }else if(tab[parentId][1] === 'decal_droite_non_signe'){
                        t+='>>>';
                    }else if(tab[parentId][1] === 'decalGauche'){
                        t+='<<';
                    }else if(tab[parentId][1] === 'etBin'){
                        t+='&';
                    }else if(tab[parentId][1] === 'ou_ex_bin'){
                        t+='^';
                    }else if(tab[parentId][1] === 'ou_bin'){
                        t+='|';
                    }else if(tab[parentId][1] === 'nonBin'){
                        t+='~';
                    }
                    t+='(' + objOperation.value + ')';
                }else{
                    return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                }
            }else{
                if(numEnfant === 1){
                    numEnfant=numEnfant + 1;
                    if(tab[i][2] === 'c'){
                        if((tab[i][4] === 1) || (tab[i][4] === 2) || (tab[i][4] === 3) || (tab[i][4] === 4)){
                            if((tab[tab[i][7]][1] === 'plus') || (tab[tab[i][7]][1] === 'moins')){
                                /* cas des opérations unaires */
                                t+='(' + maConstante(tab[i]);
                            }else{
                                t+=maConstante(tab[i]);
                            }
                        }else{
                            if(condi0){
                                t+='(' + tab[i][1];
                            }else{
                                if(((tab[id][1] === 'mult') || (tab[id][1] === 'divi') || (tab[id][1] === 'modulo')) && ((tab[i][1].indexOf('+') > 0) || (tab[i][1].indexOf('-') > 0))){
                                    t+='(' + tab[i][1] + ')';
                                }else{
                                    if((tab[id][1] === 'moins') && (tab[id][8] === 1)){
                                        t+='-' + tab[i][1];
                                    }else{
                                        if(tab[i][2] === 'c'){
                                            if((tab[tab[i][7]][1] === 'plus') || (tab[tab[i][7]][1] === 'moins')){
                                                t+='(' + tab[i][1];
                                            }else{
                                                t+=tab[i][1];
                                            }
                                        }else{
                                            console.error('à vérifier');
                                            debugger;
                                        }
                                    }
                                }
                            }
                        }
                    }else if(tab[i][2] === 'f'){
                        if(tab[i][1] === '#'){
                        }else if((tab[i][1] === 'mult')
                         || (tab[i][1] === 'plus')
                         || (tab[i][1] === 'concat')
                         || (tab[i][1] === 'moins')
                         || (tab[i][1] === 'mult')
                         || (tab[i][1] === 'divi')
                         || (tab[i][1] === 'modulo')
                         || (tab[i][1] === 'etBin')
                         || (tab[i][1] === 'ou_ex_bin')
                         || (tab[i][1] === 'ou_bin')
                         || (tab[i][1] === 'nonBin')
                         || (tab[i][1] === 'decalDroite')
                         || (tab[i][1] === 'decal_droite_non_signe')
                         || (tab[i][1] === 'decalGauche')
                        ){
                            var objOperation = TraiteOperations1(tab,i);
                            if(objOperation.status === true){
                                if(tab[i][1] === 'moins'){
                                    if(tab[i][8] === 1){
                                        t+='-' + objOperation.value + '';
                                    }else{
                                        t+='-(' + objOperation.value + ')';
                                    }
                                }else{
                                    if(tab[tab[i][7]][1] === 'plus'){
                                        t+='(' + objOperation.value + '';
                                    }else{
                                        t+='' + objOperation.value + '';
                                    }
                                }
                            }else{
                                return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                            }
                        }else if(tab[i][1] === ''){
                            var objOperation = TraiteOperations1(tab,(i + 1));
                            if(objOperation.status === true){
                                t+='(' + objOperation.value + ')';
                            }else{
                                return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                            }
                        }else if(tab[i][1] === 'appelf'){
                            obj=js_traiteAppelFonction(tab,i,true,niveau,false);
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:id,
                                    tab:tab,
                                    message:'erreur TraiteOperations1 1609'
                                }));
                            }
                        }else if(tab[i][1] === 'tableau'){
                            var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                            if(objTableau.status === true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 1844 sur TraiteOperations1 '
                                }));
                            }
                        }else if(tab[i][1] === 'testEnLigne'){
                            var objtestLi = js_traiteInstruction1(tab,niveau,i);
                            if(objtestLi.status === true){
                                t+=objtestLi.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur TraiteOperations1 1808'
                                }));
                            }
                        }else{
                            return(logerreur({status:false,'message':'fonction du premier paramètre non reconnue TraiteOperations1 2519 "' + tab[i][1] + '"'}));
                        }
                    }else{
                        return(logerreur({status:false,message:'TraiteOperations1 pour une opération, le premier paramètre doit être une constante'}));
                    }
                }else{
                    if(tab[parentId][1] === ''){
                        var objOperation = TraiteOperations1(tab,(i + 1));
                        if(objOperation.status === true){
                            t+='(' + objOperation.value + ')';
                        }else{
                            return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                        }
                    }else if(tab[parentId][1] === 'mult'){
                        t+='*(';
                    }else if(tab[parentId][1] === 'divi'){
                        t+='/(';
                    }else if(tab[parentId][1] === 'modulo'){
                        t+='%';
                    }else if(tab[parentId][1] === 'plus'){
                        t+='+';
                    }else if(tab[parentId][1] === 'concat'){
                        t+='+';
                    }else if(tab[parentId][1] === 'moins'){
                        t+='-';
                    }else if(tab[parentId][1] === 'etBin'){
                        t+='&';
                    }else if(tab[parentId][1] === 'ou_ex_bin'){
                        t+='^';
                    }else if(tab[parentId][1] === 'ou_bin'){
                        t+='|';
                    }else if(tab[parentId][1] === 'nonBin'){
                        t+='~';
                    }else if(tab[parentId][1] === 'decalDroite'){
                        t+='>>';
                    }else if(tab[parentId][1] === 'decal_droite_non_signe'){
                        t+='>>>';
                        
                    }else if(tab[parentId][1] === 'decalGauche'){
                        t+='<<';
                    }
                    if(tab[i][2] === 'f'){
                        if((tab[i][1] === 'mult')
                         || (tab[i][1] === 'divi')
                         || (tab[i][1] === 'modulo')
                         || (tab[i][1] === 'plus')
                         || (tab[i][1] === 'concat')
                         || (tab[i][1] === 'moins')
                         || (tab[i][1] === 'etBin')
                         || (tab[i][1] === 'ou_ex_bin')
                         || (tab[i][1] === 'ou_bin')
                         || (tab[i][1] === 'nonBin')
                         || (tab[i][1] === 'decalDroite')
                         || (tab[i][1] === 'decal_droite_non_signe')
                         || (tab[i][1] === 'decalGauche')
                        ){
                            var objOperation = TraiteOperations1(tab,i);
                            if(objOperation.status === true){
                                t+=objOperation.value;
                                if((tab[parentId][1] === 'mult') || (tab[parentId][1] === 'divi') || (tab[parentId][1] === 'modulo')){
                                    t+=')';
                                }
                            }else{
                                return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                            }
                        }else if(tab[i][1] === 'appelf'){
                            var obj = js_traiteAppelFonction(tab,i,true,niveau,false);
                            if(obj.status === true){
                                t+=obj.value;
                                if((tab[parentId][1] === 'mult') || (tab[parentId][1] === 'divi') || (tab[parentId][1] === 'modulo')){
                                    t+=')';
                                }
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:id,
                                    tab:tab,
                                    message:'erreur TraiteOperations1 1854'
                                }));
                            }
                        }else if(tab[i][1] === 'testEnLigne'){
                            var obj = js_traiteInstruction1(tab,niveau,i);
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:id,
                                    tab:tab,
                                    message:'erreur TraiteOperations1 1862'
                                }));
                            }
                        }else if(tab[i][1] === 'tableau'){
                            var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                            if(objTableau.status === true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1844 sur TraiteOperations1 '
                                }));
                            }
                        }else{
                            return(logerreur({status:false,'message':'fonction paramètre non reconnu 1391 "' + tab[i][1] + '"'}));
                        }
                    }else{
                        if(tab[i][4] !== 0){
                            t+=maConstante(tab[i]);
                            if((tab[parentId][1] === 'mult') || (tab[parentId][1] === 'divi')){
                                t+=')';
                            }
                        }else{
                            if(condi0){
                                t+=tab[i][1] + ')';
                            }else{
                                if((tab[i][1].indexOf('+') >= 0) || (tab[i][1].indexOf('-') >= 0) || (tab[i][1].indexOf('*') >= 0) || (tab[i][1].indexOf('/') >= 0)){
                                    /*
                                      dans le cas ou l'élément de l'opération est lui même une opération, il vaut mieux ajouter une parenthèse
                                      Par exemple : plus['par' , numeroPar-1]
                                    */
                                    t+='(' + tab[i][1] + ')';
                                }else{
                                    /*
                                      si c'est le dernier enfant 
                                    */
                                    if(((tab[tab[i][7]][1] === 'plus') || (tab[tab[i][7]][1] === 'moins')) && (tab[tab[i][7]][8] === tab[i][9])){
                                        t+=tab[i][1] + ')';
                                    }else{
                                        t+=tab[i][1];
                                    }
                                }
                            }
                            if((tab[parentId][1] === 'mult') || (tab[parentId][1] === 'divi')){
                                t+=')';
                            }
                        }
                    }
                }
            }
        }
    }
    return({value:t,status:true});
}
function js_condition1(tab,id,niveau){
    var i=0;
    var j=0;
    var btrouve=false;
    var reprise=0;
    var obj={};
    var l=tab.length;
    var t='';
    var max=0;
    var tabPar = [];
    var premiereCondition=true;
    for(i=id + 1;i < l;i=i + 1){
        max=i;
        if(tab[i][3] < tab[id][3]){
            break;
        }
    }
    if(max === 0){
        i=id;
        /*
          if[[tab[i][1]=='vrai' || tab[i][1]=='faux'] && tab[i][4]==false ]{ 
          t+=tab[i][1]=='vrai'?'true':'false'; 
          }else if[tab[i][4]==true]{
          t+='\'';
          t+=tab[i][1];
          t+='\'';
          }else{
          t+=tab[i][1];
          }
        */
        t+=maConstante(tab[i]);
    }else{
        for(i=id;i < max;i=i + 1){
            if(((tab[i][1] === 'non') || (tab[i][1] === 'et') || (tab[i][1] === 'ou') || ((premiereCondition === true) && (tab[i][1] === ''))) && (tab[i][8] > 0) && (tab[i][2] === 'f')){
                if(tab[i][1] === 'non'){
                    t+=' !';
                }else if(tab[i][1] === 'et'){
                    t+=' && ';
                    if(tab[i][8] > 1){
                        t+=' ( ';
                    }
                }else if(tab[i][1] === 'ou'){
                    t+=' || ';
                    if(tab[i][8] > 1){
                        t+=' ( ';
                    }
                }
                obj=js_condition1(tab,(i + 1),niveau);
                if(obj.status === false){
                    return(logerreur({status:false,value:t,id:id,message:'erreur 1928 dans une condition'}));
                }
                if((tab[i][1] === '') || (tab[i][1] === 'non')){
                    t+='(';
                }
                t+=obj.value;
                if((tab[i][1] === '') || (tab[i][1] === 'non')){
                    t+=')';
                }
                var reprise = (i + 1);
                var j = (i + 1);
                for(j=i + 1;j < max;j=j + 1){
                    if(tab[j][3] <= tab[i][3]){
                        break;
                    }
                    reprise=j;
                }
                i=reprise;
            }else if((tab[i][1] === '') && (tab[i][8] > 0) && (tab[i][2] === 'f')){
                obj=js_condition1(tab,(i + 1),niveau);
                if(obj.status === false){
                    return(logerreur({status:false,value:t,id:id,message:'erreur 1951 dans une condition'}));
                }
                t+=obj.value;
                i=max - 1;
            }else if((tab[i][1] === 'tableau') && (tab[i][2] === 'f')){
                var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                if(objTableau.status === true){
                    t+=objTableau.value;
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'erreur 1997 sur declaration '
                    }));
                }
                i=max - 1;
            }else if((tab[i][1] === 'defTab') && (tab[i][2] === 'f')){
                var objtestLi = js_traiteDefinitionTableau(tab,i,niveau,{});
                if(objtestLi.status === true){
                    t+=objtestLi.value;
                }else{
                    return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 3561 sur declaration '}));                 
                }
                var reprise = (i + 1);
                var j = (i + 1);
                for(j=i + 1;j < max;j=j + 1){
                    if(tab[j][3] <= tab[i][3]){
                        break;
                    }
                    reprise=j;
                }
                i=reprise;
            }else if((tab[i][1] === 'appelf') && (tab[i][2] === 'f')){
                obj=js_traiteAppelFonction(tab,i,true,niveau,false);
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:id,
                        tab:tab,
                        message:'erreur 1964 dans une condition'
                    }));
                }
                i=max - 1;
            }else if(((tab[i][1] === 'egal') || (tab[i][1] === 'egalstricte') || (tab[i][1] === 'diff') || (tab[i][1] === 'diffstricte') || (tab[i][1] === 'sup') || (tab[i][1] === 'inf') || (tab[i][1] === 'supeg') || (tab[i][1] === 'infeg') || (tab[i][1] === 'Instanceof') || (tab[i][1] === 'in') || (tab[i][1] === 'ou_bin')) && (tab[i][2] === 'f')){
                if(tab[i][8] === 2){
                    tabPar=[];
                    for(j=id + 1;j <= max;j=j + 1){
                        if(tab[j][3] === (tab[i][3] + 1)){
                            tabPar.push(j);
                        }
                    }
                    if(tab[tabPar[0]][2] === 'c'){
                        t+=maConstante(tab[tabPar[0]]);
                    }else{
                        if((tab[tabPar[0]][2] === 'f') && (tab[tabPar[0]][1] === 'appelf')){
                            obj=js_traiteAppelFonction(tab,tabPar[0],true,niveau,false);
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:id,
                                    tab:tab,
                                    message:'il faut un nom de fonction à appeler n(xxxx)'
                                }));
                            }
                        }else if((tab[tabPar[0]][2] === 'f') && (tab[tabPar[0]][1] === 'Typeof')){
                            t+='typeof ' + tab[tabPar[0] + 1][1];
                        }else if((tab[tabPar[0]][2] === 'f') && ((tab[tabPar[0]][1] === 'plus') || (tab[tabPar[0]][1] === 'concat') || (tab[tabPar[0]][1] === 'moins') || (tab[tabPar[0]][1] === 'modulo'))){
                            var objOperation = TraiteOperations1(tab,tab[tabPar[0]][0]);
                            if(objOperation.status === true){
                                t+=objOperation.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    'id':tabAffecte['par1'][0],
                                    tab:tab,
                                    message:'erreur 1607 sur js_condition1 '
                                }));
                            }
                        }else if((tab[tabPar[0]][2] === 'f') && (tab[tabPar[0]][1] === 'tableau')){
                            var objTableau = js_traiteTableau1(tab,tab[tabPar[0]][0],true,niveau,false);
                            if(objTableau.status === true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1007 sur js_condition1 '
                                }));
                            }
                        }else if((tab[tabPar[0]][2] === 'f') && (tab[tabPar[0]][1] === 'obj')){
                            obj=js_traiteDefinitionObjet(tab,tab[tabPar[0]][0],true,niveau);
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'1964 js_condition1 '
                                }));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:id,'message':'erreur 1528 dans une condition pour un test egal, diff... cas à traiter : "' + tab[tabPar[0]][1] + '"'}));
                        }
                    }
                    if(tab[i][1] === 'egal'){
                        t+=' '+'=='+' ';
                    }else if(tab[i][1] === 'egalstricte'){
                        t+=' === ';
                    }else if(tab[i][1] === 'diff'){
                        t+=' '+'!='+' ';
                    }else if(tab[i][1] === 'diffstricte'){
                        t+=' !== ';
                    }else if(tab[i][1] === 'sup'){
                        t+=' > ';
                    }else if(tab[i][1] === 'inf'){
                        t+=' < ';
                    }else if(tab[i][1] === 'supeg'){
                        t+=' >= ';
                    }else if(tab[i][1] === 'infeg'){
                        t+=' <= ';
                    }else if(tab[i][1] === 'Instanceof'){
                        t+=' instanceof ';
                    }else if(tab[i][1] === 'in'){
                        t+=' in ';
                    }else if(tab[i][1] === 'ou_bin'){
                        t+=' | ';
                    }
                    if(tab[tabPar[1]][2] === 'c'){
                        t+=maConstante(tab[tabPar[1]]);
                    }else{
                        if((tab[tabPar[1]][2] === 'f') && (tab[tabPar[1]][1] === 'appelf')){
                            obj=js_traiteAppelFonction(tab,tabPar[1],true,niveau,false);
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:id,
                                    tab:tab,
                                    message:'il faut un nom de fonction à appeler n(xxxx)'
                                }));
                            }
                        }else if((tab[tabPar[1]][2] === 'f') && ((tab[tabPar[1]][1] === 'moins') || (tab[tabPar[1]][1] === 'plus') || (tab[tabPar[1]][1] === 'mult') || (tab[tabPar[1]][1] === 'divi') || (tab[tabPar[1]][1] === 'concat') || (tab[tabPar[1]][1] === 'Typeof'))){
                            var objOperation = TraiteOperations1(tab,tab[tabPar[1]][0]);
                            if(objOperation.status === true){
                                t+=objOperation.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    'id':tabAffecte['par1'][0],
                                    tab:tab,
                                    message:'erreur 824 sur des opérations '
                                }));
                            }
                        }else if((tab[tabPar[1]][2] === 'f') && (tab[tabPar[1]][1] === 'tableau')){
                            var objTableau = js_traiteTableau1(tab,tab[tabPar[1]][0],true,niveau,false);
                            if(objTableau.status === true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 2065 sur condition '
                                }));
                            }
                        }else{
                            var obj = js_tabTojavascript1(tab,tab[tabPar[1]][0],true,true,niveau);
                            if(obj.status === true){
                                t+=obj.value;
                            }else{
                                return(logerreur({
                                    status:false,
                                    value:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 2173 sur condition '
                                }));
                            }
                        }
                    }
                    i=max - 1;
                }else{
                    return(logerreur({status:false,value:t,id:id,'message':'erreur 2077 dans une condition ' + tab[i][1]}));
                }
            }else if((tab[i][1] === 'condition') && (tab[i][2] === 'f')){
                niveau=niveau + 1;
                obj=js_condition0(tab,i,niveau);
                niveau=niveau - 1;
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        'message':'2046 problème sur la condition '
                    }));
                }
                i=max - 1;
            }else if((tab[i][1] === 'obj') && (tab[i][2] === 'f')){
                obj=js_traiteDefinitionObjet(tab,i,true,niveau);
                if(obj.status === true){
                    t+=obj.value;
                }else{
                    return(logerreur({
                        status:false,
                        value:t,
                        id:i,
                        tab:tab,
                        message:'2057 dans obj de "return" ou "dans" il y a un problème'
                    }));
                }
            }else if((tab[i][1] !== '') && (tab[i][2] === 'c')){
                t+=maConstante(tab[i]);
            }else if(tab[i][1] === '#'){
                if(tab[i][13].indexOf('\n') >= 0){
                    t+=espacesn(true,niveau);
                }
                var commt = traiteCommentaire2(tab[i][13],niveau,i);
                t+='/*' + commt + '*/';
            }else{
                return(logerreur({status:false,value:t,id:i,'message':'1973 les tests sont pour le moment egal,egalstricte,diff,diffstricte,sup,inf,supeg,infeg,InstanceOf en non pas "' + tab[i][1] + '"'}));
            }
        }
    }
    return({value:t,status:true,'max':max});
}
function js_condition0(tab,id,niveau){
    var t='';
    var i=0;
    var j=0;
    var premiereCondition=true;
    var newTab = [];
    var obj={};
    for(i=id + 1;(i < tab.length) && (tab[i][3] > tab[id][3]);i=i + 1){
        if(tab[i][7] === tab[id][0]){
            if((tab[i][1] === '') || (tab[i][1] === 'non')){
                if(premiereCondition){
                    obj=js_condition1(tab,i,niveau);
                    if(obj.status === false){
                        return(logerreur({status:false,value:t,id:id,message:'erreur 2123 dans une condition racine'}));
                    }
                    t+=obj.value;
                    premiereCondition=false;
                    i=obj.max;
                }else{
                    return(logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'}));
                }
            }else if((tab[i][1] === 'et') || (tab[i][1] === 'ou')){
                if(premiereCondition){
                    return(logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'}));
                }else{
                    obj=js_condition1(tab,i,niveau);
                    if(obj.status === false){
                        return(logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'}));
                    }
                    t+=obj.value;
                    i=obj.max;
                }
            }else if((tab[i][1] === 'egal')
             || (tab[i][1] === 'diff')
             || (tab[i][1] === 'sup')
             || (tab[i][1] === 'inf')
             || (tab[i][1] === 'supeg')
             || (tab[i][1] === 'infeg')){
                if( !(premiereCondition)){
                    return({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est soit "()", soit [egal|sup|inf|diff]'});
                }else{
                    obj=js_condition1(tab,i,niveau);
                    if(obj.status === false){
                        return(logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'}));
                    }
                    t+=obj.value;
                    i=obj.max;
                }
            }else if(tab[i][1] === '#'){
                if(tab[i][13].indexOf('\n') >= 0){
                    t+=espacesn(true,niveau);
                }
                var commt = traiteCommentaire2(tab[i][13],niveau,i);
                t+='/*' + commt + '*/';
                if(tab[i][13].indexOf('\n') >= 0){
                    t+=espacesn(true,niveau);
                }
            }else{
                return(logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou()'}));
            }
        }
    }
    return({status:true,value:t});
}