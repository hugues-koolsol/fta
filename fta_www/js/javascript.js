
"use strict";
/*
  var global_enteteTableau=[
  ['id','id'                                 ,''], // 00
  ['val','__xva'                             ,''],
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
    var retJS = js_tabTojavascript1(tab,id,false,false,niveau);
    if(retJS.__xst === true){
        return({__xst:true,__xva:retJS.__xva});
    }else{
        console.error(retJS);
        return(retJS);
    }
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
    const l01=tab.length;
    if(l01 <= 1){
        return({__xst:true,__xva:''});
    }
    var id_du_parent=tab[id][7];
    var espcLigne = espacesn(true,niveau);
    var terminateur=';';
    if(dansInitialisation===true){
         terminateur='';
         espcLigne='';
    }
    
    if(dansCascade === true){
        console.log('%c dans cascade','color:red;background:lightgreen;')
        terminateur=',';
        espcLigne='';
        dansInitialisation=false;
    }
    for(i=id;(i < l01) && (tab[i][3] >= tab[id][3]);i=i + 1){
        if(tab[i][7] === id_du_parent){
         
         
            if(dansInitialisation===true || ( ( "initialisation" === tab[tab[id][7]][1] ||  "increment" === tab[tab[id][7]][1] ) && tab[tab[id][7]][8]>1 ) ){
                if(t!==''){
                    t+=',';
                }
            }
         
            if( tab[i][1] === 'identifiant' && tab[i][2] === 'f'  && tab[i][8] === 1  && tab[i+1][2] === 'c' ){
                t+=espcLigne;
                t+=maConstante(tab[i + 1])+ terminateur;             
                t+=espcLigne;
            }else if(((tab[i][1] === 'break') || (tab[i][1] === 'continue') || ('useStrict' === tab[i][1]) || ('debugger' === tab[i][1])) && (tab[i][2] === 'f')){
                if('useStrict' === tab[i][1]){
                    t+=espcLigne;
                    t+='"use strict"' + terminateur + '';
                }else{
                    if(tab[i][8] === 0){
                        t+=espcLigne;
                        t+=tab[i][1] + '' + terminateur + '';
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
                            id:i,
                            tab:tab,
                            __xme:'erreur dans un ' + tab[i][1] + ' qui doit être sous le format ' + tab[i][1] + '() strictement'
                        }));
                    }
                }
            }else if((tab[i][1] === 'revenir') && (tab[i][2] === 'f')){
                if(tab[i][8] === 0){
                    t+=espcLigne;
                    t+='return' + terminateur + '';
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
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
                            if(obj.__xst === true){
                                t+='return(' + obj.__xva + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:id,
                                    tab:tab,
                                    message:'il faut un nom de fonction à appeler n(xxxx)'
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'obj')){
                            t+=espcLigne;
                            obj=js_traiteDefinitionObjet(tab,tab[i + 1][0],true,niveau);
                            if(obj.__xst === true){
                                t+='return(' + obj.__xva + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    message:'dans obj de "return" ou "dans" il y a un problème'
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'condition')){
                            t+=espcLigne;
                            obj=TraiteOperations2(tab,(i + 1),niveau);

                            if(obj.__xst === true){
                                t+='return(' + obj.__xva + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    __xme:'erreur 0076 sur return '
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && ((tab[i + 1][1] === 'testEnLigne') || (tab[i + 1][1] === 'egalstricte') || (tab[i + 1][1] === 'supeg'))){
                            var objtestLi = js_traiteInstruction1(tab,niveau,(i + 1));
                            if(objtestLi.__xst === true){
                                t+='return(' + objtestLi.__xva + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0092 sur return'
                                }));
                            }
                        }else if((tab[i+1][2] === 'f') && ( (tab[i+1][1] === 'new') || (tab[i+1][1] === 'affecte') )){
                            t+=espcLigne;
                            var objtestLi = js_tabTojavascript1(tab,(i + 1),false,true,niveau,false);
                            if(objtestLi.__xst === true){
                                t+='return(' + objtestLi.__xva + ')';
                                if( !(dansInitialisation)){
                                    t+=terminateur;
                                }
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0092 sur return'
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f')
                         && (
                            (tab[i + 1][1] === 'plus')
                         || (tab[i + 1][1] === 'moins')
                         || (tab[i + 1][1] === 'mult')
                         || (tab[i + 1][1] === 'divi')
                         || (tab[i + 1][1] === 'concat')
                         || (tab[i + 1][1] === 'ou_bin')
                         || (tab[i + 1][1] === 'oppose_binaire')
                         || (tab[i + 1][1] === 'decalDroite')
                         || (tab[i + 1][1] === 'decal_droite_non_signe')
                         || (tab[i + 1][1] === 'puissance')
                         || (tab[i + 1][1] === 'decalGauche')
                         || (tab[i + 1][1] === 'ou_ex_bin')
                         || (tab[i + 1][1] === 'etBin')
                         || (tab[i + 1][1] === 'modulo')
                         || (tab[i + 1][1] === 'Typeof')
                         || (tab[i + 1][1] === 'non')
                        )){
                            
                            t+=espcLigne;

                            var objOperation = TraiteOperations2(tab,tab[i + 1][0],niveau);
                            if(objOperation.__xst === true){
                                t+='return(' + objOperation.__xva + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0076 sur return '
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'defTab')){
                            var objtestLi = js_traiteDefinitionTableau(tab,tab[i + 1][0],niveau,{});
                            if(objtestLi.__xst === true){
                                t+=espcLigne;
                                t+='return(' + objtestLi.__xva + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur 0183 sur return'
                                }));
                            }
                        }else if((tab[i + 1][2] === 'f') && (tab[i + 1][1] === 'tableau')){
                            var objTableau = js_traiteTableau1(tab,i+1,true,niveau,false);

                            if(objTableau.__xst === true){
                                t+=espcLigne;
                                t+='return(' + objTableau.__xva + ')' + terminateur + '';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur tableau 261 sur return'
                                }));
                            }

                        }else{
                            debugger
                            return(logerreur({__xst:false,__xva:t,id:i,tab:tab,__xme:'javascript retour non traité 0083 "' + tab[i + 1][1] + '"'}));
                        }
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
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
                        __xst:false,
                        __xva:t,
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
                                        __xst:false,
                                        __xva:t,
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
                                        __xst:false,
                                        __xva:t,
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
                                        __xst:false,
                                        __xva:t,
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
                                        __xst:false,
                                        __xva:t,
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
                                        if(objdef.__xst === true){
                                            argumentsFonction+='=' + objdef.__xva;
                                        }else{
                                            return(logerreur({
                                                __xst:false,
                                                __xva:t,
                                                id:id,
                                                tab:tab,
                                                message:'0220 les arguments passés à la fonction doivent être sous la forme argument(xxx,[defaut(yyy)]) '
                                            }));
                                        }
                                    }else{
                                        return(logerreur({
                                            __xst:false,
                                            __xva:t,
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
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                    t+=espcLigne;
                                    t+='}';
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
                                        id:id,
                                        tab:tab,
                                        __xme:'problème sur le contenu de la fonction "' + nomFonction + '"'
                                    }));
                                }
                            }
                        }
                    }else{
                        return({
                            __xst:false,
                            __xva:t,
                            id:id,
                            tab:tab,
                            message:'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'
                        });
                    }
                    dansFonction=false;
                }
            }else if((tab[i][1] === 'appelf') && (tab[i][2] === 'f')){
                obj=js_traiteAppelFonction(tab,i,true,niveau,false);
                if(obj.__xst === true){
                    t+=espcLigne;
                    t+=obj.__xva + '' + terminateur + '';
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:id,
                        tab:tab,
                        message:'il faut un nom de fonction à appeler n(xxxx)'
                    }));
                }
            }else if(false && ((tab[i][1] === 'cascade') && (tab[i][2] === 'f'))){
                var obj = js_tabTojavascript1(tab,(i + 1),false,true,niveau,true);
                if(obj.__xst === true){
                    t+=espcLigne;
                    if(obj.__xva.length > 0){
                        t+=obj.__xva.substr(0,(obj.__xva.length - 1));
                    }else{
                        t+=obj.__xva;
                    }
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
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
                                __xst:false,
                                __xva:t,
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
                        obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,true,niveau+1);
                        if(obj.__xst === true){
                            pourChaque+=obj.__xva;
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                __xme:'problème sur la pour de boucleSurObjet en indice ' + tabchoix[j][0]
                            }));
                        }
                    }else if(tabchoix[j][1] === 'faire'){

                        if(tab[tabchoix[j][0]][8]===0){
                            faire+='';
                        }else{
                            obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,false,niveau+1);
                            if(obj.__xst === true){
                                faire+=obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur le alors de boucleSurObjet en indice ' + tabchoix[j][0]
                                }));
                            }
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
                                            if(obj.__xst === true){
                                                valeurCas=obj.__xva;
                                            }else{
                                                return(logerreur({
                                                    __xst:false,
                                                    __xva:t,
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
                                            if(obj.__xst === true){
                                                InstructionsCas=obj.__xva;
                                            }else{
                                                return(logerreur({
                                                    __xst:false,
                                                    __xva:t,
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
                                            __xst:false,
                                            __xva:t,
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
                                __xst:false,
                                __xva:t,
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
            }else if((tab[i][1] === 'faire_tant_que') && (tab[i][2] === 'f')){
                tabchoix=[];
                for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
                    if(tab[j][3] === (tab[i][3] + 1)){
                        if(tab[j][1] === 'condition'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'instructions'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:id,
                                tab:tab,
                                message:'la syntaxe de faire_tant_que est faire_tant_que(instructions(),conditions())'
                            }));
                        }
                    }
                }
                
                var condition='';
                var instructions='';
                for(j=0;j < tabchoix.length;j=j + 1){
                    if(tabchoix[j][1] === 'condition'){
                        obj=TraiteOperations2(tab,tabchoix[j][0],niveau+1);

                        if(obj.__xst === true){
                            condition+=obj.__xva;
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                __xme:'1 problème sur la condition du faire_tant_que en indice ' + tabchoix[j][0]
                            }));
                        }
                    }else if(tabchoix[j][1] === 'instructions'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            /* pas d'enfants, ne rien faire !*/
                        }else{
                            niveau=niveau + 1;
                            obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,false,niveau);
                            niveau=niveau - 1;
                            if(obj.__xst === true){
                                instructions+=obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur les instructions du faire_tant_que en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }
                }
                if((condition.substr(0,1) === '(') && (condition.substr((condition.length - 1),1) === ')')){
                    condition=condition.substr(1,(condition.length - 2));
                }
                t+=espcLigne; // faire
                t+='do{' + instructions + espcLigne+'}while(' + condition + ');';
                
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
                                __xst:false,
                                __xva:t,
                                id:id,
                                tab:tab,
                                message:'la syntaxe de tantQue est incorrecte'
                            }));
                        }
                    }
                }
                var condition='';
                var faire='';
                for(j=0;j < tabchoix.length;j=j + 1){
                    if(tabchoix[j][1] === 'condition'){
                        niveau=niveau + 1;
                        obj=TraiteOperations2(tab,tabchoix[j][0],niveau);

                        niveau=niveau - 1;
                        if(obj.__xst === true){
                            condition+=obj.__xva;
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                __xme:'1 problème sur la condition du choix en indice ' + tabchoix[j][0]
                            }));
                        }
                    }else if(tabchoix[j][1] === 'faire'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            /* pas d'enfants, ne rien faire !*/
                        }else{
                            niveau=niveau + 1;
                            obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,false,niveau);
                            niveau=niveau - 1;
                            if(obj.__xst === true){
                                faire+=obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur le alors du choix en indice ' + tabchoix[j][0]
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
                                __xst:false,
                                __xva:t,
                                id:id,
                                tab:tab,
                                message:'0798 la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'
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
                            if(obj.__xst === true){
                                initialisation+=obj.__xva;
                                if(initialisation.substr((initialisation.length - 1),1) === ';'){
                                    initialisation=initialisation.substr(0,(initialisation.length - 1));
                                }
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }else if(tabchoix[j][1] === 'condition'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            condition='';
                        }else{
                            obj=TraiteOperations2(tab,tabchoix[j][0],(niveau + 1));
                            if(obj.__xst === true){
                                condition+=obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'1 problème sur la condition du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }else if(tabchoix[j][1] === 'increment'){
                        if(tab[tabchoix[j][0]][8] === 0){
                            increment='';
                        }else{
                            obj=js_tabTojavascript1(tab,(tabchoix[j][0] + 1),dansFonction,true,(niveau + 1));
                            if(obj.__xst === true){
                                increment+=obj.__xva;
                                if(increment.substr((increment.length - 1),1) === ';'){
                                    increment=increment.substr(0,(increment.length - 1));
                                }
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur le alors du choix en indice ' + tabchoix[j][0]
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
                            if(obj.__xst === true){
                                faire+=obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur le alors du choix en indice ' + tabchoix[j][0]
                                }));
                            }
                        }
                    }
                }
//                if((initialisation.substr(0,1) === '(') && (initialisation.substr((initialisation.length - 1),1) === ')')){
//                    initialisation=initialisation.substr(1,(initialisation.length - 2));
//                }
                if(condition==='()'){
                 condition='';
                }
/*                
                if((condition !== '') && (condition.substr(0,1) === '(') && (condition.substr((condition.length - 1),1) === ')')){
                    condition=condition.substr(1,(condition.length - 2));
                }
*/                
                t+=espcLigne;
                t+='for( ' + initialisation + ' ; ' + condition + ' ; ' + increment + ' ){';
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
                                if(obj.__xst === true){
                                    contenu+=obj.__xva;
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
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
                                            if(obj.__xst === true){
                                                sierreur+=obj.__xva;
                                            }else{
                                                return(logerreur({
                                                    __xst:false,
                                                    __xva:t,
                                                    id:i,
                                                    tab:tab,
                                                    message:'problème sur le "sierreur" du "essayer" '
                                                }));
                                            }
                                        }
                                    }else{
                                        return(logerreur({
                                            __xst:false,
                                            __xva:t,
                                            id:i,
                                            tab:tab,
                                            message:'problème sur le "sierreur" le deuxième argiment doit être "faire"'
                                        }));
                                    }
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
                                        id:i,
                                        tab:tab,
                                        message:'problème sur le "sierreur" le premier argiment doit être une variable'
                                    }));
                                }
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
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
                            for(k=j + 1;k < l01 && tab[k][3] > tab[j][3];k=k + 1){
                                if((tab[k][1] === 'alors') && (tab[k][3] === (tab[j][3] + 1))){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                            }
                        }else if(tab[j][1] === 'sinonsi'){
                            aDesSinonSi=true;
                            tabchoix.push([j,tab[j][1],0,tab[j],0]);
                            for(k=j + 1;k < l01 && tab[k][3] > tab[j][3];k=k + 1){
                                if((tab[k][1] === 'alors') && (tab[k][3] === (tab[j][3] + 1))){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                            }
                        }else if(tab[j][1] === 'sinon'){
                            aUnSinon=true;
                            tabchoix.push([j,tab[j][1],0,tab[j],0]);
                            for(k=j + 1;k < l01 && tab[k][3] > tab[j][3];k=k + 1){
                                if((tab[k][1] === 'alors') && (tab[k][3] === (tab[j][3] + 1))){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                            }
                        }else if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                            tabchoix.push([j,tab[j][1],0,tab[j]]);
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
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
                                __xst:false,
                                __xva:t,
                                id:j,
                                tab:tab,
                                __xme:'file javascript.js : dans un choix, les niveaux doivent etre "si" "sinonsi" "sinon" et les sous niveaux "alors" et "condition" et non pas "' + JSON.stringify(tab[j]) + '" '
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
                                __xst:false,
                                __xva:t,
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
                                    __xst:false,
                                    __xva:t,
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
                        obj=TraiteOperations2(tab,debutCondition,(niveau + 1));
                        if(obj.__xst === true){
                            if(tab[debutCondition + 1][8] >= 5){
                                /*
                                  on a une suite de et/ou 
                                */
                                obj.__xva=obj.__xva.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                                t+=obj.__xva;
                                t+='){';
                            }else{
                                if(obj.__xva.length>120 && obj.__xva.indexOf('\n')<0){
                                    
                                    obj.__xva=obj.__xva.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                                    t+=obj.__xva;
                                    t+=espcLigne +'){';
                                }else{
                                    t+=obj.__xva;
                                    t+='){';
                                }
                            }
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                __xme:'2 problème sur la condition du choix en indice ' + tabchoix[j][0]
                            }));
                        }
                        if((tabchoix[j][2] > 0) && (tabchoix[j][4] > 0)){
                            niveau=niveau + 1;
                            obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
                            niveau=niveau - 1;
                            if(obj.__xst === true){
                                t+=obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur le alors du choix en indice ' + tabchoix[j][0]
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
                        obj=TraiteOperations2(tab,debutCondition,(niveau + 1));

                        if(obj.__xst === true){
                            if(tab[debutCondition + 1][8] >= 5){
                                /*
                                  on a une suite de et/ou 
                                */
                                obj.__xva=obj.__xva.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                            }
                            t+=obj.__xva;
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:tabchoix[j][0],
                                tab:tab,
                                __xme:'3 problème sur la condition du choix en indice ' + tabchoix[j][0]
                            }));
                        }
                        t+='){';
                        if((tabchoix[j][2] > 0) && (tabchoix[j][4] > 0)){
                            obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau+1);
                            if(obj.__xst === true){
                                t+=obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur le alors du choix en indice ' + tabchoix[j][0]
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
                            obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau+1);
                            if(obj.__xst === true){
                                t+=obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabchoix[j][0],
                                    tab:tab,
                                    __xme:'problème sur le alors du choix en indice ' + tabchoix[j][0]
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
                        __xst:false,
                        __xva:t,
                        id:id,
                        tab:tab,
                        message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'
                    }));
                }
                if((tab[i + 2][2] === 'f') && (tab[i + 2][1] === 'appelf') && (tab[i][8] >= 2)){
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:id,
                        tab:tab,
                        message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'
                    }));
                }
                obj=js_traiteAppelFonction(tab,(i + 2),true,niveau,false);
                if(obj.__xst === true){
                    t+=espcLigne;
                    t+='' + tab[i + 1][1] + '=' + obj.__xva + '' + terminateur + '';
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:id,
                        tab:tab,
                        message:'il faut un nom de fonction à appeler n(xxxx)'
                    }));
                }
            }else if(((tab[i][1] === 'affecte') || (tab[i][1] === 'dans') || (tab[i][1] === 'affectop')) && (tab[i][2] === 'f')){
                var obj=js_traite_affecte(tab,i,niveau,dansInitialisation,terminateur,espcLigne);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:id,
                        tab:tab,
                        message:'1318 affecte'
                    }));
                }
 
            }else if(( (tab[i][1] === 'declare') || (tab[i][1] === 'declare_constante') || (tab[i][1] === 'declare_variable') || ("variable_privée" === tab[i][1]) || ("variable_publique" === tab[i][1])) && (tab[i][2] === 'f')){
                t+=espcLigne;
                var tabdeclare = [];
                for(j=i + 1;j < l01 && tab[j][3] > tab[i][3];j++){
                    if(tab[j][7] === tab[i][0]){
                        if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                        }else{
                            tabdeclare.push(tab[j]);
                        }
                    }
                }

                if(tabdeclare.length === 2){
                    var prefixe_declaration='var ';
                    if("declare_constante" === tab[i][1]){
                        prefixe_declaration='const ';
                    }else if("declare_variable" === tab[i][1]){
                        prefixe_declaration='let ';
                    }else if("variable_privée" === tab[i][1]){
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
                                if(obj.__xst === true){
                                    t+=obj.__xva + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
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
                                    if(obj.__xst === true){
                                        t+=((prefixe_declaration + tabdeclare[0][1])) + '=' + obj.__xva + '' + terminateur + '';
                                    }else{
                                        return(logerreur({
                                            __xst:false,
                                            __xva:t,
                                            id:i,
                                            tab:tab,
                                            message:'dans obj de "declare" ou "dans" il y a un problème'
                                        }));
                                    }
                                }
                            }else if(tabdeclare[1][1] === 'await'){
                                t+=((prefixe_declaration + tabdeclare[0][1])) + '= await ';
                                obj=js_traiteAppelFonction(tab,(tabdeclare[1][0] + 1),true,niveau,false);
                                if(obj.__xst === true){
                                    t+=obj.__xva + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur dans une déclaration'
                                    }));
                                }
                            }else if(tabdeclare[1][1] === 'appelf'){
                                obj=js_traiteAppelFonction(tab,tabdeclare[1][0],true,niveau,false);
                                if(obj.__xst === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + obj.__xva + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur dans une déclaration'
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'condition') && (tabdeclare[1][2] === 'f')){
                                obj=TraiteOperations2(tab,(tabdeclare[1][0] + 1),niveau);

                                if(obj.__xst === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + obj.__xva + '' + terminateur + '';
                                }else{
                                    return(logerreur({__xst:false,__xva:t,id:id,__xme:'erreur dans une condition'}));
                                }
                            }else if(
                                      (tabdeclare[1][2] === 'f')
                                   && ((tabdeclare[1][1] === 'plus')
                                   || (tabdeclare[1][1] === 'moins')
                                   || (tabdeclare[1][1] === 'mult')
                                   || (tabdeclare[1][1] === 'divi')
                                   || (tabdeclare[1][1] === 'modulo')
                                   || (tabdeclare[1][1] === 'concat')
                                   || (tabdeclare[1][1] === 'egalstricte')
                                   || (tabdeclare[1][1] === 'egal')
                                   || (tabdeclare[1][1] === 'diffstricte')
                                   || (tabdeclare[1][1] === 'infeg')
                                   || (tabdeclare[1][1] === 'Typeof')
                                   
                                   )
                                  ){

                                var objOperation = TraiteOperations2(tab,tabdeclare[1][0],niveau);
                                if(objOperation.__xst === true){
                                    var droite=objOperation.__xva;
                                    if((droite.length >= 2) && (tabdeclare[1][1] === 'concat') && (droite.substr(0,1) === '(') && (droite.substr((droite.length - 1),1) === ')')){
                                        droite=droite.substr(1,(droite.length - 2));
                                    }
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + droite + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur 1048 sur declaration '
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'tableau') && (tabdeclare[1][2] === 'f')){
                                var objTableau = js_traiteTableau1(tab,tabdeclare[1][0],true,niveau,false);
                                if(objTableau.__xst === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + objTableau.__xva + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
                                        id:i,
                                        tab:tab,
                                        message:'erreur 1007 sur declaration '
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'non') && (tabdeclare[1][2] === 'f')){
                             
                                obj=TraiteOperations2(tab,tabdeclare[1][0],niveau);

                                if(obj.__xst === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + obj.__xva + '' + terminateur + '';
                                }else{
                                    return(logerreur({__xst:false,__xva:t,id:tabdeclare[0][0],tab:tab,message:'erreur sur declaration 1444'}));
                                }
                             
                            }else if((tabdeclare[1][1] === 'testEnLigne') && (tabdeclare[1][2] === 'f')){
                                var objtestLi = js_traiteInstruction1(tab,niveau,tabdeclare[1][0]);
                                if(objtestLi.__xst === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = (' + objtestLi.__xva + ')' + terminateur + '';
                                }else{
                                    return(logerreur({__xst:false,__xva:t,id:tabdeclare[0][0],tab:tab,message:'erreur sur declaration 0796'}));
                                }
                                
                            }else if((tabdeclare[1][2] === 'f') && ( (tabdeclare[1][1] === 'affecte') || (tabdeclare[1][1] === 'postinc')  || (tabdeclare[1][1] === 'void') )){
                                var objtestLi = js_tabTojavascript1(tab,tabdeclare[1][0],true,true,niveau);
                                if(objtestLi.__xst === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + objtestLi.__xva + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
                                        id:tabdeclare[0][0],
                                        tab:tab,
                                        message:'erreur sur declaration 0803'
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'defTab') && (tabdeclare[1][2] === 'f')){
                                var objtestLi = js_traiteDefinitionTableau(tab,tabdeclare[1][0],niveau,{});
                                if(objtestLi.__xst === true){
                                    t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + objtestLi.__xva + '' + terminateur + '';
                                }else{
                                    return(logerreur({
                                        __xst:false,
                                        __xva:t,
                                        id:tabdeclare[0][0],
                                        tab:tab,
                                        message:'erreur sur declaration 0803'
                                    }));
                                }
                            }else if((tabdeclare[1][1] === 'new') && (tabdeclare[1][2] === 'f')){
                               var objtestLi = js_tabTojavascript1(tab,tabdeclare[1][0]+1,false,true,niveau,false);
                               if(objtestLi.__xst === true){
                                    if(tab[tabdeclare[1][0]+1][1]==='defTab'){
                                     t+=((prefixe_declaration + tabdeclare[0][1])) + ' = ' + objtestLi.__xva + '' + terminateur + '';
                                    }else{
                                     t+=((prefixe_declaration + tabdeclare[0][1])) + ' = new ' + objtestLi.__xva + '' + terminateur + '';
                                    }
                               }
                             
                            }else{
                                return(logerreur({__xst:false,id:i,__xme:'javascript.js 0957 : cas dans declare non prévu ' + tabdeclare[1][1]}));
                            }
                        }else{
                            return(logerreur({__xst:false,id:i,__xme:'javascript.js 0960 : cas dans declare non prévu'}));
                        }
                    }
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
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
                        __xst:false,
                        __xva:t,
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
                    if(obj.__xst === true){
                        t+='throw new ' + obj.__xva;
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
                            id:i,
                            tab:tab,
                            message:'erreur dans une déclaration'
                        }));
                    }
                }else if((tab[i + 1][1] === 'appelf') && (tab[i + 1][2] === 'f')){
                    obj=js_traiteAppelFonction(tab,(i + 1),true,niveau,false);
                    if(obj.__xst === true){
                        t+='throw ' + obj.__xva;
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
                            id:i,
                            tab:tab,
                            message:'erreur dans une déclaration'
                        }));
                    }
                }else if(tab[i + 1][2] === 'c'){
                    t+='throw ' + maConstante(tab[i + 1]);
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
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
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        message:'erreur dans supprimer 0955'
                    }));
                }
            }else if((tab[i][1] === 'new') && (tab[i][2] === 'f')){
                if((tab[i][8] === 1) && (tab[i + 1][1] === 'appelf')){
                    obj=js_traiteAppelFonction(tab,(i + 1),true,niveau,false);
                    if(obj.__xst === true){
                        t+='new ' + obj.__xva;
                        if( !(dansInitialisation)){
                            t+=terminateur;
                        }
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
                            id:i,
                            tab:tab,
                            message:'erreur dans une déclaration'
                        }));
                    }
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        message:'erreur dans new 1074'
                    }));
                }
            }else if((tab[i][1] === 'defTab') && (tab[i][2] === 'f')){
                obj=js_traiteDefinitionTableau(tab,i,niveau,{});
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        message:'erreur js_tabTojavascript1 1037'
                    }));
                }
            }else if((tab[i][1] === 'void') && (tab[i][2] === 'f')){
                var objtestLi = js_traiteInstruction1(tab,niveau,(i + 1));
                if(objtestLi.__xst === true){
                    t+='void(' + objtestLi.__xva + ')';
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        message:'erreur js_tabTojavascript1 1047'
                    }));
                }
            }else if((tab[i][2] === 'f') && ((tab[i][1] === 'inf') || (tab[i][1] === 'sup') || (tab[i][1] === 'egalstricte') || (tab[i][1] === 'testEnLigne') || (tab[i][1] === 'condition'))){
                var objtestLi = js_traiteInstruction1(tab,niveau,i);
                if(objtestLi.__xst === true){
                    t+='(' + objtestLi.__xva + ')'+terminateur;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
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
                    if(objtestLi.__xst === true){
                        t+='' + objtestLi.__xva + '';
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
                            id:i,
                            tab:tab,
                            message:'erreur js_tabTojavascript1 1233'
                        }));
                    }
                }
            }else if( ("directive" === tab[i][1]) && (tab[i][2] === 'f') && (tab[i][8] === 1) && (tab[i+1][2] === 'c')){
                t+=maConstante(tab[i+1])+';'+espcLigne;
            }else if( ("non" === tab[i][1]) && (tab[i][2] === 'f')){
                /*
                  dans le cas d'un !function(){} !!! si si , ça existe !!!
                */
             
                var objtestLi = js_tabTojavascript1(tab,(i + 1),false,true,niveau,false);
                if(objtestLi.__xst === true){
                    if(objtestLi.__xva.substr(0,2)===CRLF){
                     objtestLi.__xva=objtestLi.__xva.substr(2);
                    }
                    t+='!' + objtestLi.__xva + '';
                }else{
                    return(logerreur({__xst:false,__xva:t,id:i,tab:tab,message:'erreur js_tabTojavascript1 1647'}));
                }
             
             
            }else if( ("obj" === tab[i][1]) && (tab[i][2] === 'f')){
                obj=js_traiteDefinitionObjet(tab,(i + 1),true,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva+terminateur;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        message:'dans js_tabTojavascript1 Objet il y a un problème'
                    }));
                }
             
             
            }else if( tab[i][2] === 'c'){
                    t+=maConstante(tab[i]);
            }else{
                /* en dernier lieu, on teste une opération */
                var objOperation = TraiteOperations2(tab,i,niveau+1);
                if(objOperation.__xst === true){
                    if(dansInitialisation===true || (objOperation.hasOwnProperty('annuler_terminateur') && objOperation.annuler_terminateur===true)){
                        t+=objOperation.__xva ;
                    }else{
                        t+=objOperation.__xva + terminateur;
                    }
                }else{
                    return(logerreur({__xst:false,__xva:t,id:i,tab:tab,__xme:'javascript.js traitement non prévu 1057 ' + JSON.stringify(tab[i])}));
                }
             
             
            }
        }
    }

    if(t!=='' && dansInitialisation===true && "initialisation" === tab[tab[id][7]][1] && tab[id][8]>1 && t.substr(0,1)===','){
        t=t.substr(1);
    }
    
    
    return({__xst:true,__xva:t});
}

             
function js_traite_affecte(tab,i,niveau,dansInitialisation,terminateur,espcLigne){
    
    const l01=tab.length;
    var t='';
    var tabAffecte={};
    var signe='=';
    var numeroPar=0;
    var j = (i + 1);
    for(j=i + 1;j < l01 && tab[j][3] > tab[i][3];j++){
        if(tab[j][7] === tab[i][0]){
            if((tab[j][1] === '#') && (tab[j][2] === 'f')){
            }else{
                if(tab[i][1] === 'affectop'){
                    if(numeroPar === 0){
                        signe=tab[j][1];
                        numeroPar++;
                    }else{
                        tabAffecte['par' + (numeroPar - 1)]=tab[j];
                        numeroPar++;
                    }
                }else{
                    tabAffecte['par' + numeroPar]=tab[j];
                    numeroPar++;
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
    if(objInstructionGauche.__xst === true){

        var objInstructionDroite = js_traiteInstruction1(tab,niveau,tabAffecte['par1'][0]);
        if(objInstructionDroite.__xst === true){
            /*
              on écrit l'affectation ici 
            */
            if((signe === '=') && (objInstructionGauche.__xva === objInstructionDroite.__xva.substr(0,objInstructionGauche.__xva.length)) && (objInstructionDroite.__xva.substr(objInstructionGauche.__xva.length,1) === '+')){
                var droite = objInstructionDroite.__xva.substr((objInstructionGauche.__xva.length + 1));
                if((droite.substr(0,1) === '(') && (droite.substr((droite.length - 1),1) === ')') && (tab[tabAffecte['par1'][0]][1] !== 'condition')){
                    droite=droite.substr(1,(droite.length - 2));
                }
                t+='' + objInstructionGauche.__xva + '+=' + droite;
            }else{
                var droite=objInstructionDroite.__xva;
                if((droite.length >= 2) && (droite.substr(0,1) === '(') && (droite.substr((droite.length - 1),1) === ')') && ((tab[tabAffecte['par1'][0]][1] === 'concat') || (tab[tabAffecte['par1'][0]][1] === 'plus') || (tab[tabAffecte['par1'][0]][1] === 'moins'))){
                    /*
                      pas besoin de parenthèses en plus pour un concat
                    */
                    droite=droite.substr(1,(droite.length - 2));
                }
                t+=objInstructionGauche.__xva + signe + droite;
            }
            if( !(dansInitialisation)){
                t+='' + terminateur + '';
            }
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:i,
                tab:tab,
                message:'dans appelf de "affecte" ou "dans" 0802 '
            }));
        }
    }else{
        return(logerreur({
            __xst:false,
            __xva:t,
            id:id,
            tab:tab,
            message:'dans appelf de "affecte" ou "dans" 0805 '
        }));
    }
    return({__xst:true,__xva:t})



}

/*
  =====================================================================================================================
*/
function js_traiteDefinitionTableau(tab,id,niveau,options={}){
    var t='';
    var j=0;
    var obje={};
    var textObj='';
    const l01=tab.length;
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
                            if(obje.__xst === true){
                                if(precedent_est_commentaire === true){
                                    precedent_est_commentaire=false;
                                }else{
                                    textObj+=',';
                                }
                                if(mettre_des_sauts){
                                    textObj+=espacesn(true,(niveau + 1));
                                }
                                textObj+=obje.__xva + '';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    __xme:'js_traiteDefinitionTableau 1140 '
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
                            if(obj.__xst === true){
                                proprietes+='.' + obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    message:'1359 erreur dans js_traiteDefinitionTableau'
                                }));
                            }
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:j,
                                tab:tab,
                                __xme:'1361 erreur dans js_traiteDefinitionTableau ' + tab[j][1]
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
    return({__xst:true,__xva:t});
}
/*
  =====================================================================================================================
*/
function js_traiteTableau1(tab,i,dansConditionOuDansFonction,niveau,recursif){
    const l01=tab.length;
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
    var contenu='';
    var termineParUnePropriete=false;
    var enfantTermineParUnePropriete=false;
    positionAppelTableau=-1;
    for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
        if((tab[j][1] === 'nomt') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
            positionAppelTableau=j;
            var obj1 = js_traiteInstruction1(tab,niveau,(j + 1));
            if(obj1.__xst === true){
                nomTableau=obj1.__xva;
            }else{
                return(logerreur({
                    __xst:false,
                    __xva:t,
                    id:i,
                    tab:tab,
                    message:'864 js_traiteTableau1 nomt'
                }));
            }
            break;
        }
    }
    if((positionAppelTableau > 0) && (nomTableau !== '')){
        for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j++){
            if((tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
                if((tab[j][1] === 'nomt') || (tab[j][1] === 'p') || (tab[j][1] === '#') || (tab[j][1] === 'prop')){
                    continue;
                }else{
                    logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        __xme:'1361 js_traiteTableau1 les seuls paramètres de tableau sont nomt,p,prop "' + tab[j][1] + '"'
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
                    for(k=j + 1;k < l01 && tab[k][3] <= tab[j][3];k=k + 1){
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
                }else{
                    if((tab[j][8] === 1) && (tab[j + 1][1] === 'obj')){
                        obj=js_traiteDefinitionObjet(tab,(j + 1),true,niveau);
                        if(obj.__xst === true){
                            argumentsFonction+='[' + obj.__xva + ']';
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:i,
                                tab:tab,
                                message:'dans js_traiteTableau1 Objet il y a un problème'
                            }));
                        }
                    }else if((tab[j][8] === 1) && (tab[j + 1][2] === 'f')){
                        if(tab[j + 1][1] === 'p'){
                            obj=js_tabTojavascript1(tab,(j + 1),false,false,niveau);
                            if(obj.__xst === true){
                                if((nomTableau === 'Array') && (nbEnfants >= 4)){
                                    forcerNvelleLigneEnfant=true;
                                }
                                argumentsFonction+='[' + obj.__xva + ']';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
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
                            var objOperation = TraiteOperations2(tab,(j + 1),niveau);
                            if(objOperation.__xst === true){
                                var droite=objOperation.__xva;
                                argumentsFonction+='[' + droite + ']';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1421 js_traiteTableau1 sur des opérations '
                                }));
                            }
                        }else if(tab[j + 1][1] === 'tableau'){
                            var objTableau = js_traiteTableau1(tab,(j + 1),true,niveau,false);
                            if(objTableau.__xst === true){
                                argumentsFonction+='[' + objTableau.__xva + ']';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1007 js_traiteTableau1 sur declaration '
                                }));
                            }
                        }else if(tab[j + 1][1] === 'postinc'){
                            var obj1 = js_tabTojavascript1(tab,(j + 1),true,true,niveau);
                            if(obj1.__xst === true){
                                argumentsFonction+='[' + obj1.__xva + ']';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1215 js_traiteTableau1 sur declaration '
                                }));
                            }
                        }else if(tab[j + 1][1] === 'appelf'){
                            var obj = js_traiteAppelFonction(tab,(j + 1),true,niveau,false);
                            if(obj.__xst === true){
                                argumentsFonction+='[' + obj.__xva + ']';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:id,
                                    tab:tab,
                                    message:'dans js_traiteTableau1 1404 '
                                }));
                            }
                        }else{
                            debugger;
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:j,
                                tab:tab,
                                __xme:'erreur js_traiteTableau1 1145 pour ' + tab[j + 1][1]
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
                            if(obj.__xst === true){
                                proprietesTableau+='.' + obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur dans un appel de fonction imbriqué 1'
                                }));
                            }
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:j,
                                tab:tab,
                                __xme:'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue ' + tab[j][1]
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
            __xst:false,
            __xva:t,
            id:i,
            tab:tab,
            message:' dans js_traiteTableau1 1024 il faut un nom de tableau nomt(xxxx)'
        }));
    }
    return({__xst:true,__xva:t,'forcerNvelleLigneEnfant':forcerNvelleLigneEnfant,'termineParUnePropriete':termineParUnePropriete});
}
/*
  =====================================================================================================================
*/
function js_traiteInstruction1(tab,niveau,id){
    const l01=tab.length;
    var t='';
    if(tab[id][2] === 'c'){
        t+=maConstante(tab[id]);
    }else if((tab[id][2] === 'f') && (tab[id][1] === 'appelf')){
        var obj = js_traiteAppelFonction(tab,tab[id][0],true,niveau,false);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:id,
                tab:tab,
                message:'dans js_traiteInstruction1 1043 '
            }));
        }
    }else if(('inf' === tab[id][1])
     || ('non' === tab[id][1])
     || ('supeg' === tab[id][1])
     || ('sup' === tab[id][1])
     || ('infeg' === tab[id][1])
     || ('diffstricte' === tab[id][1])
     || ('egalstricte' === tab[id][1])
     || ('egal' === tab[id][1])
     || ('ou_bin' === tab[id][1])){
        var obj = TraiteOperations2(tab,tab[id][0]);
        if(obj.__xst === false){
            return(logerreur({__xst:false,__xva:t,id:id,tab:tab,message:'erreur js_traiteInstruction1 2268'}));
        }
        t+='' + obj.__xva + '';
    }else if((tab[id][1] === 'plus')
     || (tab[id][1] === 'mult')
     || (tab[id][1] === 'divi')
     || (tab[id][1] === 'modulo')
     || (tab[id][1] === 'moins')
     || (tab[id][1] === 'etBin')
     || (tab[id][1] === 'ou_ex_bin')
     || (tab[id][1] === 'ou_bin')
     || (tab[id][1] === 'oppose_binaire')
     || (tab[id][1] === 'puissance')
     || (tab[id][1] === 'decalDroite')
     || (tab[id][1] === 'decal_droite_non_signe')
     || (tab[id][1] === 'decalGauche')
     || (tab[id][1] === 'concat')
     || (tab[id][1] === 'void')
     || (tab[id][1] === 'Typeof')
     ){
        var objOperation = TraiteOperations2(tab,tab[id][0]);
        if(objOperation.__xst === true){
            t+=objOperation.__xva;
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:id,
                tab:tab,
                message:'erreur sur js_traiteInstruction1 1050 '
            }));
        }
    }else if(tab[id][1] === 'obj'){
        var obj = js_traiteDefinitionObjet(tab,tab[id][0],true,niveau);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:id,
                tab:tab,
                message:'erreur sur js_traiteInstruction1 1064 '
            }));
        }
    }else if(tab[id][1] === 'tableau'){
        var objTableau = js_traiteTableau1(tab,tab[id][0],true,niveau,false);
        if(objTableau.__xst === true){
            t+=objTableau.__xva;
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:j,
                tab:tab,
                message:'erreur 1007 sur declaration '
            }));
        }
    }else if(tab[id][1] === 'testEnLigne'){
        var si_faux='';
        var si_vrai='';
        var testlignecondition='';
        var j = (id + 1);
        for(j=id + 1;(j < l01) && (tab[j][3] > tab[id][3]);j=j + 1){
            if(tab[j][3] === (tab[id][3] + 1)){
                if(tab[j][1] === 'condition'){
                 
                    var objCondition = TraiteOperations2(tab,j,(niveau + 1));

                    if(objCondition.__xst === true){
                         testlignecondition=objCondition.__xva;
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
                            id:j,
                            tab:tab,
                            __xme:'1 js_traiteInstruction1 sur testEnLigne 2297 ' 
                        }));
                    }
                 
                 
                }else if(tab[j][1] === 'siVrai'){
                    var obj_si=js_tabTojavascript1(tab,j+1,true,true,niveau,false);
                    if(obj_si.__xst === true){
                     
                       if(si_vrai!==''){
                        si_vrai+=' , ';
                       }
                       si_vrai+=obj_si.__xva;
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
                            id:j,
                            tab:tab,
                            __xme:'1 js_traiteInstruction1 sur testEnLigne 2316 ' 
                        }));
                    }
                }else if(tab[j][1] === 'siFaux'){
                 
                    var obj_si=js_tabTojavascript1(tab,j+1,true,true,niveau,false);
                    if(obj_si.__xst === true){
                     
                       if(si_faux!==''){
                        si_faux+=' , ';
                       }
                       si_faux+=obj_si.__xva;
                    }else{
                        return(logerreur({
                            __xst:false,
                            __xva:t,
                            id:j,
                            tab:tab,
                            __xme:'1 js_traiteInstruction1 sur testEnLigne 2334 ' 
                        }));
                    }
                 
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:id,
                        tab:tab,
                        message:'la syntaxe de test en ligne est  testEnLigne(condition(),siVrai(),siFaux())'
                    }));
                }
            }
        }

        t=testlignecondition + ' ? ( ' + si_vrai + ' ) : ( ' + si_faux + ' )';
    }else if(tab[id][1] === 'condition'){
        var objcond = TraiteOperations2(tab,id,niveau);
        if(objcond.__xst === true){
            t+=objcond.__xva;
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:id,
                tab:tab,
                message:'js_traiteInstruction1 1313'
            }));
        }
    }else if(tab[id][1] === 'new'){
        /* todo faire un traitement de "new" à la place de +1 çi dessous */
        if(tab[id+1][1]==='defTab'){
            var obj1 = js_traiteDefinitionTableau(tab,id+1,niveau,{});
            if(obj1.__xst === true){

                if(obj1.__xva.substr(0,1)==='[' && obj1.__xva.substr(obj1.__xva.length-1,1)===']'){
                 t+=' new Array(' + obj1.__xva.substr(1,obj1.__xva.length-2) + ')';
                }else{
                 t+=' new ' + obj1.__xva + '';
                }
            }else{
                return(logerreur({
                    __xst:false,
                    __xva:t,
                    id:id,
                    tab:tab,
                    message:'erreur sur declaration 0803'
                }));
            }
        }else{
            obj=js_traiteAppelFonction(tab,(id + 1),true,niveau,false);
            if(obj.__xst === true){
                t+=' new ' + obj.__xva + '';
            }else{
                return(logerreur({
                    __xst:false,
                    __xva:t,
                    id:id,
                    tab:tab,
                    message:'erreur dans une déclaration'
                }));
            }
        }
    }else if(tab[id][1] === 'defTab'){
        var obj1 = js_traiteDefinitionTableau(tab,id,niveau,{});
        if(obj1.__xst === true){
            t+=obj1.__xva;
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:id,
                tab:tab,
                message:'erreur sur declaration 0803'
            }));
        }
    }else if((tab[id][1] === 'affecte') || ( false && tab[id][1] === 'cascade')){
        var obj = js_tabTojavascript1(tab,id,true,true,niveau);
        if(obj.__xst === true){
            t+=obj.__xva + '';
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:id,
                tab:tab,
                __xme:'erreur sur js_traiteInstruction1 1230 pour ' + tab[id][1]
            }));
        }
    }else if((tab[id][1] === 'definition_de_classe') && (tab[id][2] === 'f')){
        var obj = js_traiteDefinitionClasse(tab,id,niveau);
        if(obj.__xst === true){
            t+=obj.__xva;
        }else{
            return(logerreur({
                __xst:false,
                __xva:t,
                id:id,
                tab:tab,
                message:'erreur sur js_traiteInstruction1 1064 '
            }));
        }
    }else{
        return(logerreur({
            __xst:false,
            __xva:t,
            id:id,
            tab:tab,
            __xme:'erreur sur js_traiteInstruction1 1412 pour ' + tab[id][1]
        }));
    }
    return({__xst:true,__xva:t});
}
/*
  =====================================================================================================================
*/
function js_traiteDefinitionClasse(tab,id,niveau){
    var t='';
    var i=0;
    var j=0;
    var k=0;
    const l01=tab.length;
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
                if(obj.__xst === true){
                    contenu_classe+=obj.__xva;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
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
    return({__xst:true,__xva:t});
}
/*
  =====================================================================================================================
*/
function js_traiteDefinitionObjet(tab,id,dansConditionOuDansFonction,niveau){
    const l01=tab.length;
    var t='';
    var j=0;
    var obj={};
    var textObj='';
    var precedent_est_commentaire=false;
    var a_des_commentaires=false;
    var propriete='';
    for(j=id + 1;(j < l01) && (tab[j][3] > tab[id][3]) && (a_des_commentaires === false);j=j + 1){
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
    for(j=id + 1;(j < l01) && (tab[j][3] > tab[id][3]);j=j + 1){
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
            }else if((tab[j][1] === 'prop') && (tab[j][2] === 'f')){
                if(tab[j][8]===1 && tab[j+1][2]==='c'){
                    propriete+='.'+tab[j+1][1];
                }else{
                     return(logerreur({
                         __xst:false,
                         __xva:t,
                         id:j,
                         tab:tab,
                         message:'erreur js_traiteDefinitionObjet 2412 sur propriete d\'objet '
                     }));
                 
                }
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
                            if(obj.__xst === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:id,
                                    tab:tab,
                                    message:'dans js_traiteDefinitionObjet il y a un problème'
                                }));
                            }
                        }else if((tab[j + 2][1] === 'plus') || (tab[j + 2][1] === 'moins') || (tab[j + 2][1] === 'concat')){
                            var objOperation = TraiteOperations2(tab,(j + 2),0);
                            if(objOperation.__xst === true){
                                var droite=objOperation.__xva;
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + droite;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
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
                            if(objfnt1.__xst === true){
                                if(objfnt1.__xva.substr((objfnt1.__xva.length - 1),1) === ';'){
                                    objfnt1.__xva=objfnt1.__xva.substr(0,objfnt1.__xva.length - 1);
                                }
                                if(objfnt1.__xva.length<100 && (objfnt1.__xva.substr(0,1)==='\n' || objfnt1.__xva.substr(0,1)==='\r' ) ){
                                  /* */
                                  var c1='';
                                  var indTxt=0;
                                  for(indTxt=0;indTxt<objfnt1.__xva.length;indTxt++){
                                   c1=objfnt1.__xva.substr(indTxt,1);
                                   if( !(c1==='\n' ||  c1==='\r' ||  c1===' ')  ){
                                    objfnt1.__xva=' '+objfnt1.__xva.substr(indTxt);
                                    break;
                                   }
                                  }
                                }
                                textObj+=maConstante(tab[j + 1]) + ':' + objfnt1.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    __xme:'1069 erreur sur appel de fonction nom "' + tab[j][1] + '"'
                                }));
                            }
                        }else if(tab[j + 2][1] === 'tableau'){
                            var objTableau = js_traiteTableau1(tab,(j + 2),true,0,false);
                            if(objTableau.__xst === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + objTableau.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur 1392 sur js_traiteDefinitionObjet '
                                }));
                            }
                        }else if(tab[j + 2][1] === 'defTab'){
                            var objTableau = js_traiteDefinitionTableau(tab,(j + 2),0,{});
                            if(objTableau.__xst === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + objTableau.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:tabdeclare[0][0],
                                    tab:tab,
                                    message:'erreur sur declaration 0803'
                                }));
                            }
                        }else if(tab[j + 2][1] === 'condition'){
                            obj=TraiteOperations2(tab,(j + 2),niveau);

                            if(obj.__xst === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ':' + obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    __xme:'erreur dans js_traiteDefinitionObjet, 1438 '
                                }));
                            }
                        }else if(tab[j + 2][1] === 'testEnLigne'){
                            var objtestLi = js_traiteInstruction1(tab,niveau,(j + 2));
                            if(objtestLi.__xst === true){
                                textObj+='\'' + tab[j + 1][1] + '\'' + ': (' + objtestLi.__xva+')';
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:i,
                                    tab:tab,
                                    message:'erreur js_traiteDefinitionObjet 1476'
                                }));
                            }
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:id,
                                tab:tab,
                                __xme:'dans js_traiteDefinitionObjet, 1492 "' + tab[j + 2][1] + '"'
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
    t+='}'+propriete;
    return({__xst:true,__xva:t});
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
    const l01=tab.length;
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
                if(obj1.__xst === true){
                    nomFonction=obj1.__xva;
                    enfantTermineParUnePropriete=obj1.termineParUnePropriete;
                    aDesAppelsRecursifs=true;
                }else{
                    logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        __xme:'1069 erreur sur appel de fonction nom "' + tab[j][1] + '"'
                    });
                }
            }else{
             debugger
            }
            break;
        }else if((tab[j][1] === 'flechee') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
            flechee=true;
        }else if((tab[j][1] === 'id') && (tab[j][2] === 'f') && (tab[j][3] === (tab[i][3] + 1))){
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
                        nomElement=maConstante(tab[j + 1]);
                    }else if(tab[j + 1][2] === 'f'){
                        var objinst = js_traiteInstruction1(tab,niveau,(j + 1));
                        if(objinst.__xst === true){
                            nomElement=objinst.__xva;
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
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
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        __xme:'1852 les seuls paramètres de appelf sont nomf,p,r,element,flechee et non pas "' + tab[j][1] + '"'
                    });
                }
            }
        }
        argumentsFonction='';
        for(j=i + 1;(j < l01) && (tab[j][3] > tab[i][3]);j=j + 1){
            if((tab[j][1] === 'obj') && (tab[j][3] === (tab[i][3] + 1))){
                obj=js_traiteDefinitionObjet(tab,j,true,niveau);
                if(obj.__xst === true){
                    argumentsFonction+=',' + obj.__xva + '';
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
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
                            if(obj.__xst === true){
                                proprietesFonction+='.' + obj.__xva;
                            }else{
                                return(logerreur({
                                    __xst:false,
                                    __xva:t,
                                    id:j,
                                    tab:tab,
                                    message:'erreur dans un appel de fonction imbriqué 1'
                                }));
                            }
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
                                id:j,
                                tab:tab,
                                __xme:'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue ' + tab[j][1]
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
                if(false &&(tab[j + 1][1] === 'cascade')){
                    obj=js_tabTojavascript1(tab,j,false,false,niveau);
                }else{
                    obj=js_traiteAppelFonction(tab,j,true,niveau,true);
                }
                if(obj.__xst === true){
                    argumentsFonction+=',';
                    if((nomFonction === 'Array') && (nbEnfants >= 4)){
                        forcerNvelleLigneEnfant=true;
                        argumentsFonction+=espacesn(true,(niveau + 1));
                    }
                    argumentsFonction+=obj.__xva;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
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
                        if(obj.__xst === true){
                            contenu+=obj.__xva;
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
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
                        __xst:false,
                        __xva:t,
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
                        if(obj.__xst === true){
                            argumentsFonction+=',' + obj.__xva + '';
                        }else{
                            return(logerreur({
                                __xst:false,
                                __xva:t,
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
                                    __xst:false,
                                    __xva:t,
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
                                }else if(((tab[k][2] === 'f') && (tab[k][1] === 'appelf')) || (false && (tab[k][1] === 'cascade'))){
                                    aDesAppelsRecursifs=true;
                                    if(false && (tab[k][1] === 'cascade')){
                                        obj=js_tabTojavascript1(tab,k,false,false,niveau);
                                    }else{
                                        obj=js_traiteAppelFonction(tab,k,true,niveau,true);
                                    }
                                    if(obj.__xst === true){
                                        if((nomFonction === 'Array') && (nbEnfants >= 4)){
                                            forcerNvelleLigneEnfant=true;
                                            argumentsFonction+=espacesn(true,(niveau + 1));
                                        }
                                        argumentsFonction+=obj.__xva;
                                    }else{
                                        return(logerreur({
                                            __xst:false,
                                            __xva:t,
                                            id:k,
                                            tab:tab,
                                            message:'erreur dans un appel de fonction imbriqué 1'
                                        }));
                                    }
                                    /*
                                      }else if(tab[k][2] === 'f' && tab[k][1] === 'p'){
                                      obj=js_tabTojavascript1(tab,(k),false,false,niveau);
                                      if(obj.__xst === true){
                                      if((nomFonction === 'Array') && (nbEnfants >= 4)){
                                      forcerNvelleLigneEnfant=true;
                                      argumentsFonction+=espacesn(true,(niveau+1));
                                      }
                                      argumentsFonction+=obj.__xva;
                                      }else{
                                      return(logerreur({__xst:false,__xva:t,id:k,tab:tab,__xme:'erreur dans un appel de fonction imbriqué 1'}));
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
                                    var objOperation = TraiteOperations2(tab,k,niveau);
                                    if(objOperation.__xst === true){
                                        if((tab[k][1] === 'concat') && (objOperation.__xva.substr(0,1) === '(') && (objOperation.__xva.substr((objOperation.__xva.length - 1),1) === ')')){
                                            objOperation.__xva=objOperation.__xva.substr(1,(objOperation.__xva.length - 2));
                                        }
                                        argumentsFonction+=objOperation.__xva;
                                    }else{
                                        return(logerreur({
                                            __xst:false,
                                            __xva:t,
                                            id:k,
                                            tab:tab,
                                            message:'erreur 2107 sur des opérations '
                                        }));
                                    }
                                }else if((tab[k][2] === 'f') && (tab[k][1] === 'tableau')){
                                    var objTableau = js_traiteTableau1(tab,tab[k][0],true,niveau,false);
                                    if(objTableau.__xst === true){
                                        argumentsFonction+=objTableau.__xva;
                                    }else{
                                        return(logerreur({
                                            __xst:false,
                                            __xva:t,
                                            id:k,
                                            tab:tab,
                                            message:'erreur 1007 sur declaration '
                                        }));
                                    }
                                }else if(tab[k][2] === 'c'){
                                    argumentsFonction+=maConstante(tab[k]);
                                }else{
                                    
                                    var objJs = js_tabTojavascript1(tab,tab[k][0],true,true,niveau); // dansFonction,dansInitialisation,niveau,dansCascade
                                    if(objJs.__xst === true){
                                        argumentsFonction+=objJs.__xva;
                                    }else{
                                        return(logerreur({
                                            __xst:false,
                                            __xva:t,
                                            id:tab[k][0],
                                            tab:tab,
                                            __xme:'erreur 1425 dans js_traiteAppelFonction '
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
        return(logerreur({__xst:false,__xva:t,id:i,tab:tab,message:' dans 3085 js_traiteAppelFonction il faut un nom de fonction à appeler nomf(xxxx)' }));
    }
    return({__xst:true,__xva:t,'forcerNvelleLigneEnfant':forcerNvelleLigneEnfant,'termineParUnePropriete':termineParUnePropriete});
}



/*
https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Operator_precedence
type_operateur=1  => un seul    : il ne doit y avoir qu'une seule opérande , exemple : non(x), typeof(y), void(z) ...
type_operateur=2  => deux       : il ne doit y avoir 2 opérandes strictement exemple : modulo(x,y), puissance(x,y)....
type_operateur=m2 => multiple 2 : il doit y avoir au moins 2 opérandes exemple : mult(2,3,4) = 24
type_operateur=m1 => multiple 1 : il doit y avoir au moins 1 opérande exemple : moins(1) = -1, moins(2,1,1)=2-1-1=0
*/
var tableau_des_opérateurs_js={
 'mult'                   : {__xva:'*',type_operateur:'m2',precedence:13},
 'divi'                   : {__xva:'/',type_operateur:'m2',precedence:13},
 'modulo'                 : {__xva:'%',type_operateur:2,precedence:13},
 'plus'                   : {__xva:'+',type_operateur:'m1',precedence:12},
 'moins'                  : {__xva:'-',type_operateur:'m1',precedence:12},
 'concat'                 : {__xva:'+',type_operateur:'m2',precedence:12},
 'puissance'              : {__xva:'**',type_operateur:2,precedence:14},
 'etBin'                  : {__xva:'&',type_operateur:2,precedence:8},
 'ou_ex_bin'              : {__xva:'^',type_operateur:2,precedence:7},
 'oppose_binaire'         : {__xva:'~',type_operateur:1,precedence:15},
 'ou_bin'                 : {__xva:'|',type_operateur:2,precedence:6},
 'decalDroite'            : {__xva:'>>',type_operateur:2,precedence:11},
 'decal_droite_non_signe' : {__xva:'>>>',type_operateur:2,precedence:11},
 'decalGauche'            : {__xva:'<<',type_operateur:2,precedence:11},
 'Instanceof'             : {__xva:'instanceof ',type_operateur:2,precedence:15},
 'postdec'                : {__xva:'--',type_operateur:1,precedence:16},
 'postinc'                : {__xva:'++',type_operateur:1,precedence:16},
 'predec'                 : {__xva:'--',type_operateur:1,precedence:15},
 'preinc'                 : {__xva:'++',type_operateur:1,precedence:15},
 /* logiques */
 'et'                     : {__xva:'&&'     ,type_operateur:'m2',precedence:5},        
 'ou'                     : {__xva:'||'     ,type_operateur:'m2',precedence:4},        
 /* opérateurs unaires */
 'void'                   : {__xva:'void'       ,type_operateur:1,precedence:15},        
 'Typeof'                 : {__xva:'typeof '    ,type_operateur:1,precedence:15},
 'non'                    : {__xva:'!'      ,type_operateur:1,precedence:15},
 'condition'              : {__xva:''       ,type_operateur:1,precedence:19},
 /* opérateurs comparaison */
 'egalstricte'            : {__xva:'===',type_operateur:2,precedence:9},
 'egal'                   : {__xva:'==',type_operateur:2,precedence:9},
 'diffstricte'            : {__xva:'!==',type_operateur:2,precedence:9},
 'diff'                   : {__xva:'!=',type_operateur:2,precedence:9},
 'inf'                    : {__xva:'<',type_operateur:2,precedence:10},
 'sup'                    : {__xva:'>',type_operateur:2,precedence:10},
 'infeg'                  : {__xva:'<=',type_operateur:2,precedence:10},
 'supeg'                  : {__xva:'>=',type_operateur:2,precedence:10},
 'cle_dans_objet'         : {__xva:'in',type_operateur:2,precedence:10},
};


/*
  =====================================================================================================================
*/
function TraiteOperations2(tab,id,niveau){
//    console.log('%c on passe par TraiteOperations2','color:blue;background:lightpink;')
    var t='';
    var i=0;
    var j=0;
    const l01=tab.length;
    var ajoute_parentheses=false;
    var premier_operande=true;
    /*
      =============================================================================================================
      cas très spécial d'appel aux fonctions avec la syntaxe très bizarre de js pour les objets.
      exemple : S o r t a b le
      =============================================================================================================
    */

    if(tab[id][8] === 1 && tab[id][1]==='' && tab[id][2]==='f' && tab[id][10]>0 && tab[id+1][1]==='appelf'){
        console.log('%cappel fonction initialisation ','color:red;background:yellow;');
        var obj = js_traiteAppelFonction(tab,id+1,true,niveau,false);
        if(obj.__xst === false){
            return(logerreur({__xst:false,__xva:t,id:id,tab:tab,message:'erreur TraiteOperations2 3283'}));
        }

        return({__xva:'('+obj.__xva+')',__xst:true,annuler_terminateur:true});
         
    }

    oop={};
    if(tab[id][1]==='' && tab[id][2]==='f'){
        oop={__xva:'',type_operateur:1,precedence:19};
    }else{
        if(!tableau_des_opérateurs_js.hasOwnProperty(tab[id][1])){
            if(tab[id][2]==='f' && ( tab[id][1]==='tableau' || tab[id][1]==='appelf'   || tab[id][1]==='affecte'  || tab[id][1]==='defTab'  || tab[id][1]==='testEnLigne'  )){ //  
                if(tab[id][1]==='tableau'){
                 
                   var objTableau = js_traiteTableau1(tab,id,true,niveau,false);
                   if(objTableau.__xst === true){
                       return({__xva:objTableau.__xva,__xst:true});
                   }else{
                       return(logerreur({
                           __xst:false,
                           __xva:t,
                           id:i,
                           tab:tab,
                           message:'erreur 1844 sur TraiteOperations2 '
                       }));
                   }
                }else if(tab[id][1]==='appelf'){
                
                    var objfnt = js_traiteAppelFonction(tab,id,true,niveau,false);
                    if(objfnt.__xst === true){
                        return({__xva:objfnt.__xva,__xst:true});
                    }else{
                        return(logerreur({__xst:false,__xva:t,id:id,tab:tab,message:'erreur TraiteOperations2 4251'}));
                    }
                }else if(tab[id][1]==='affecte'){
                    var obj = js_traite_affecte(tab,id,niveau,true,'','');
                    if(obj.__xst === true){
                        return({__xva:obj.__xva,__xst:true});
                    }else{
                        return(logerreur({__xst:false,__xva:t,id:id,__xme:'erreur 3493 dans une operation pour un affecte "' + tab[id][1] + '"'}));
                    }
                }else if(tab[id][1]==='defTab'){
                    var obj = js_traiteDefinitionTableau(tab,id,niveau,{});
                    if(obj.__xst === true){
                        return({__xva:obj.__xva,__xst:true});
                    }else{
                        return(logerreur({__xst:false,__xva:t,id:id,__xme:'erreur 3279 dans une operation pour un defTab "' + tab[id][1] + '"'}));
                    }
                }else if(tab[id][1]==='testEnLigne'){
                    var obj = js_traiteInstruction1(tab,niveau,id);
                    if(obj.__xst === true){
                        return({__xva:obj.__xva,__xst:true});
                    }else{
                        return(logerreur({__xst:false,__xva:t,id:id,__xme:'erreur 3279 dans une operation pour un testEnLigne "' + tab[id][1] + '"'}));
                    }
                }
                
                
                
            }else{
                debugger
                return(logerreur({__xst:false,__xme:'4232 TraiteOperations2 pour "' + tab[id][1] + '" ',id:id}));
            }
        }else{
            var oop = tableau_des_opérateurs_js[tab[id][1]];
        }
    }
    var operateur_principal=oop.__xva;
    
    for(i=id + 1;(i < l01) && (tab[i][3] > tab[id][3]);i++){
        if(tab[i][7] === id){
            if(premier_operande === true){
                 if(!(
                      (oop.type_operateur===1 && tab[id][8]===1) 
                      || (oop.type_operateur===2 && tab[id][8]===2) 
                      || (oop.type_operateur==='m2' && tab[id][8]>=2)
                      || (oop.type_operateur==='m1' && tab[id][8]>=1)
                     )
                 ){
                     debugger
                     return(logerreur({__xst:false,__xme:' erreur sur TraiteOperations2 4246 le nombre d\'opérandes est incorrecte',id:i}));
                 }
                 if(oop.type_operateur===1 || (oop.type_operateur==='m1' && tab[id][8]===1) ){
                   /* si c'est un opérateur avec qu'une seule opérande */
                     if(tab[i][2]==='c'){
                         if(tab[tab[i][7]][8]===1 && operateur_principal==='' ){
                             t+=maConstante(tab[i]);
                         }else{
                             if(tab[id][1]==='postdec' || tab[id][1]==='postinc'  || tab[id][1]==='predec'  || tab[id][1]==='preinc' ){
                                 var objOperation = js_tabTojavascript1(tab,id+1,true,true,niveau+1,false)
                                 if(objOperation.__xst === false){
                                     return(logerreur({__xst:false,__xme:' erreur sur TraiteOperations2 3334'}));
                                 }
                                 if(objOperation.__xva.substr(0,1)==='(' && objOperation.__xva.substr(objOperation.length-1,1)===')'){
                                     objOperation.__xva=objOperation.__xva.substr(1,objOperation.__xva.length-2);
                                 }
                                 if(tab[id][1]==='postdec' || tab[id][1]==='postinc'){
                                     t+=objOperation.__xva + operateur_principal;
                                 }else{
                                     t+=operateur_principal + objOperation.__xva;
                                 }
                             }else if(operateur_principal==='typeof '){
                                 t+=operateur_principal+maConstante(tab[i]);
                             }else{
                                 t+=operateur_principal+'('+maConstante(tab[i])+')';
                             }
                         }
                     }else{
                         if(tab[id][1]==='postdec' || tab[id][1]==='postinc'  || tab[id][1]==='predec'  || tab[id][1]==='preinc' ){
                             var objOperation = js_tabTojavascript1(tab,id,true,true,niveau+1,false)
                             if(objOperation.__xst === false){
                                 return(logerreur({__xst:false,__xme:' erreur sur TraiteOperations2 3334'}));
                             }
                             if(objOperation.__xva.substr(0,1)==='(' && objOperation.__xva.substr(objOperation.length-1,1)===')'){
                                 objOperation.__xva=objOperation.__xva.substr(1,objOperation.__xva.length-2);
                             }
                             if(tab[id][1]==='postdec' || tab[id][1]==='postinc'){
                                 t+=objOperation.__xva + operateur_principal;
                             }else{
                                 t+=operateur_principal + objOperation.__xva;
                             }
                         }else{
                             var objOperation = TraiteOperations2(tab,i,niveau);
                             if(objOperation.__xst === false){
                                 return(logerreur({__xst:false,__xme:' erreur sur TraiteOperations2 4248'}));
                             }
                             if(tab[tab[i][7]][8]===1 && operateur_principal==='' ){
                                 t+=objOperation.__xva;
                             }else{
                                 t+=operateur_principal+'('+objOperation.__xva+')';
                             }
                         }
                     }
                     return({__xva:t,__xst:true});
                   
                 }else{
                   /* rien de spécial, on continue le flux */
                 }
                 premier_operande=false;
            }else{
                t+=' ' + operateur_principal + ' ';
            }
            if(tab[i][2] === 'c'){
                t+=maConstante(tab[i]);
            }else if( tableau_des_opérateurs_js.hasOwnProperty(tab[i][1])){
             
                var objOperation = TraiteOperations2(tab,i,niveau);
                if(objOperation.__xst === false){
                    return(logerreur({__xst:false,__xme:' erreur sur TraiteOperations2 4267'}));
                }
                if(tableau_des_opérateurs_js[tab[i][1]].precedence<oop.precedence){
                    /*
                    à priori, il faut mettre des parenthèses mais
                    mais si c'est le seul elément dans la condition
                    */
                    if(tab[tab[i][7]][8]===1 && tab[tab[i][7]][1]==='condition'){
                        t+=objOperation.__xva;
                    }else{
                        t+='('+objOperation.__xva+')';
                    }
                }else{
                    if(tab[tab[i][7]][1]==='concat' && tab[tab[i][7]][2]==='f'){
                        t+='('+objOperation.__xva+')';
                    }else{
                        t+=objOperation.__xva;
                    }
                }
             
            }else if(tab[i][1] === '' || tab[i][1] === 'condition'){
                var objOperation = TraiteOperations2(tab,i,niveau);
                if(objOperation.__xst === true){
                    t+='(' + objOperation.__xva + ')';
                }else{
                    return(logerreur({__xst:false,__xme:' erreur sur TraiteOperations2 4276'}));
                }
            }else if(tab[i][1] === 'appelf'){
                var obj = js_traiteAppelFonction(tab,i,true,niveau,false);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:id,
                        tab:tab,
                        message:'erreur TraiteOperations2 1609'
                    }));
                }
            }else if(tab[i][1] === 'tableau'){
                var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                if(objTableau.__xst === true){
                    t+=objTableau.__xva;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        message:'erreur 1844 sur TraiteOperations2 '
                    }));
                }
            }else if(tab[i][1]==='defTab'){
                var obj = js_traiteDefinitionTableau(tab,i,niveau,{});
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({__xst:false,__xva:t,id:id,__xme:'erreur 3403 dans une operation pour un defTab "' + tab[i][1] + '"'}));
                }
            }else if(tab[i][1] === 'testEnLigne'){
                var objtestLi = js_traiteInstruction1(tab,niveau,i);
                if(objtestLi.__xst === true){
                    t+='('+objtestLi.__xva+')';
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        message:'erreur TraiteOperations2 1808'
                    }));
                }
            }else if(tab[i][1] === 'new'){
                obj=js_traiteAppelFonction(tab,(i + 1),true,niveau,false);
                if(obj.__xst === true){
                    t+=' new ' + obj.__xva;
                }else{
                    return(logerreur({
                        __xst:false,
                        __xva:t,
                        id:i,
                        tab:tab,
                        message:'2367 erreur dans TraiteOperations2'
                    }));
                }
             
            }else if(tab[i][1] === 'affecte'){
                var obj = js_traite_affecte(tab,i,niveau,true,'','');

//                    var obj = js_tabTojavascript1(tab,i,true,true,niveau,false); // (tab,id,dansFonction,dansInitialisation,niveau,dansCascade){
                 
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({__xst:false,__xva:t,id:id,__xme:'erreur 3434 dans une operation pour un affecte "' + tab[i][1] + '"'}));
                }
             
             
            }else{
                return(logerreur({__xst:false,__xme:'fonction du premier paramètre non reconnue TraiteOperations2 4392 "' + JSON.stringify(tab[i]) + '"',tab:tab,id,i}));
            }
        }
    }
    
    return({__xva:t,__xst:true});

}
