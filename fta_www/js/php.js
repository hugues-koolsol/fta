"use strict";

/*
  entête[
  ['id','id'                                 ,''], // 00
  ['val','__xva'                             ,''],
  ['typ','type'                              ,''],
  ['niv','niveau'                            ,''],
  ['coQ','constante quotee'                  ,''],
  ['pre','position du premier caractère'     ,''], // 05
  ['der','position du dernier caractère'     ,''],
  ['pId','Id du parent'                      ,''], // 10 ->  7
  ['nbE','nombre d\'enfants'                 ,''], // 11 ->  8
  ['nuE','numéro enfants'                    ,''], // 12 ->  9
  ['pro','profondeur'                        ,''], // 15 -> 10
  ['pop','position ouverture parenthese'     ,''], // 22 -> 11
  ['pfp','position fermeture parenthese'     ,''], // 23 -> 12
  ['com','commentaire'                       ,''],  
  
  ];
  
  point d'entrée : parsePhp0 / parsePhp1 + php_traiteElement
  
*/
function ma_cst_pour_php(elt){
    var r=maConstante(elt);
    if(elt[4] === 1){
        /* apostrophe */
        r=r.replace(/\\\\d/g,'\\d').replace(/\\\\o/g,'\\o').replace(/\\\\\./g,'\\.').replace(/\\\\\-/g,'\\-').replace(/\\\\\//g,'\\/');
        r=r.replace(/\\\\x/g,'\\x').replace(/\\\\A/g,'\\A').replace(/\\\\z/g,'\\z').replace(/\\\\s/g,'\\s').replace(/\\\\\?/g,'\\?').replace(/\\\\f/g,'\\f');
        r=r.replace(/\\\\w/g,'\\w').replace(/\\\\{/g,'\\{').replace(/\\\\}/g,'\\}');
    }else if(elt[4] === 3){
        /* guillemet */
        r=r.replace(/\\\\d/g,'\\d').replace(/\\\\o/g,'\\o').replace(/\\\\\./g,'\\.').replace(/\\\\\-/g,'\\-').replace(/\\\\\//g,'\\/');
        r=r.replace(/\\\\x/g,'\\x').replace(/\\\\A/g,'\\A').replace(/\\\\z/g,'\\z').replace(/\\\\s/g,'\\s').replace(/\\\\\?/g,'\\?').replace(/\\\\f/g,'\\f');
        r=r.replace(/\\\\w/g,'\\w');
        r=r.replace(/\\\$/g,'$').replace(/\\\\0/g,'\\0').replace(/\\\\v/g,'\\v');
    }else if(elt[4] === 3){
        r=r.replace(/\\\\\$/g,'\\$');
    }
    return r;
}
/*
  =====================================================================================================================
*/
function php_logerr(o){
    if(o.hasOwnProperty('id')){
        if(o.hasOwnProperty('tab')){
            o['position_caractere']=o.tab[o.id][5];
            if(o.__xst === false && o.hasOwnProperty(__xme)){
                o.__xme+=', en position ' + o.tab[o.id][5] + ' du rev';
            }
        }else{
            console.log('Attention, le tableau(tab) n\'est pas indiqué pour cette erreur');
        }
    }else{
        console.log('Attention, l\'id n\'est pas indiqué pour cette erreur');
    }
    return(logerreur(o));
}
/*
  =====================================================================================================================
*/
function parsePhp0(tab,id,niveau){
    var i=0;
    var t='';
    var obj={};
    const l01=tab.length;
    if(l01 === 2 && tab[1][1] === 'php' && tab[1][2] === 'f'){
        return({"__xst" : true ,"__xva" : '<?' + 'php'});
    }
    var retJS=php_tabToPhp1(tab,id + 1,false,false,niveau);
    if(retJS.__xst === true){
        var contenu=retJS.__xva;
        var indice_a_sauter=0;
        for( var i=0 ; i < contenu.length ; i++ ){
            var c=contenu.substr(i,1);
            if(c === ' ' || c === '\r' || c === '\n' || c === '\t'){
                indice_a_sauter++;
            }else{
                if(indice_a_sauter > 0){
                    contenu=contenu.substr(indice_a_sauter);
                }
                break;
            }
        }
        if(l01 >= 1){
            if(tab[1][1] === 'html_dans_php' && contenu.substr(0,2) === '?' + '>'){
                contenu=contenu.substr(2);
            }else{
                if(contenu.substr(0,5) !== '<?' + 'php'){
                    contenu='<?' + 'php\n' + contenu;
                }
            }
        }
        indice_a_sauter=0;
        for( var i=0 ; i < contenu.length ; i++ ){
            var c=contenu.substr(i,1);
            if(c === ' ' || c === '\r' || c === '\n' || c === '\t'){
                indice_a_sauter++;
            }else{
                if(indice_a_sauter > 0){
                    contenu=contenu.substr(indice_a_sauter);
                }
                break;
            }
        }
        t+=contenu.replace(/<\?php\?>/g,'');
    }else{
        console.error(retJS);
        return({"__xst" : false ,"__xva" : t});
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_tabToPhp1(tab,id,dansFonction,dansInitialisation,niveau){
    var t='';
    var i=0;
    var j=0;
    var k=0;
    var obj={};
    var positionDeclarationFonction=-1;
    var positionContenu=-1;
    var nomFonction='';
    var argumentsFonction='';
    var tabchoix=[];
    const l01=tab.length;
    var id_parent=tab[id][7];
    const un_espace=espacesn(true,niveau);
    for( i=id ; i < l01 ; i=tab[i][12] ){
        if(tab[i][2] === 'c'){
            if(!(tab[i][1].indexOf('++') >= 0 || tab[i][1].indexOf('--') >= 0)){
                console.log('%c pourquoi une constante en ligne','background:yellow;color:red;');
            }
            t+=un_espace;
            t+=ma_cst_pour_php(tab[i]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r') + ';';
        }else if(tab[i][2] === 'f'){
            switch (tab[i][1]){
                case 'php' :
                    obj=php_tabToPhp1(tab,i + 1,false,false,niveau);
                    /* ✍ tab,id,dansFonction,dansInitialisation,niveau]{ */
                    if(obj.__xst === true){
                        if(tab[tab[i][7]][1] === 'php' && tab[tab[i][7]][2] === 'f'){
                            t+=obj.__xva + CRLF;
                        }else{
                            /* si la dernière ou l'avant dernière instruction est un halt, on ne met pas le tag php de fin */
                            if(tab[l01 - 1][1] === "__halt_compiler"
                                       && tab[l01 - 1][2] === 'f'
                                       && tab[l01 - 1][8] === 0
                                   || tab[l01 - 2][1] === "__halt_compiler"
                                       && tab[l01 - 2][2] === 'f'
                                       && tab[l01 - 2][8] === 1
                                       && tab[l01 - 1][2] === 'c'
                            ){
                                t+='<?' + 'php' + obj.__xva;
                            }else{
                                /*
                                  si il existe un indice dont le niveau est inférieur à ce php()
                                  alors on ne ferme pas le tag php ... non, on ne ferme pas le tag
                                  t+='<?' + 'php' + obj.__xva + CRLF + '?>';
                                */
                                t+='<?' + 'php' + obj.__xva;
                            }
                        }
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php.js erreur 621'}));
                    }
                    break;
                case 'definir' :
                    t+=un_espace;
                    t+='define(';
                    t+='\'' + tab[i + 1][1] + '\'';
                    t+=' , ';
                    if(tab[i + 2][2] === 'f' && tab[i + 2][1] === 'appelf'){
                        obj=php_traiteAppelFonction(tab,i + 2,true,niveau);
                        if(obj.__xst === true){
                            t+=obj.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0145 il faut un nom de fonction à appeler n(xxxx)'}));
                        }
                    }else if(tab[i + 2][2] === 'c'){
                        t+=ma_cst_pour_php(tab[i + 2]);
                    }else{
                        var obj1=php_traiteElement(tab,i + 2,niveau,{});
                        if(obj1.__xst === true){
                            t+=obj1.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0114'}));
                        }
                    }
                    t+=');';
                    break;
                    
                case 'break' :
                    if(tab[i][8] === 0){
                        t+=un_espace;
                        t+='break;';
                    }else if(tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                        t+='break ' + tab[i + 1][1] + ';';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0171 dans php_tabToPhp1'}));
                    }
                    break;
                    
                case 'continue' :
                    if(tab[i][8] === 0){
                        t+=un_espace;
                        t+='continue;';
                    }else if(tab[i][8] === 1){
                        t+=un_espace;
                        t+='continue ' + ma_cst_pour_php(tab[i + 1]) + ';';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0140'}));
                    }
                    break;
                    
                case 'sortir' :
                    if(tab[i][8] === 0){
                        t+=un_espace;
                        t+='exit;';
                    }else if(tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                        t+=un_espace;
                        t+='exit(' + maConstante(tab[i + 1]) + ');';
                        i++;
                    }else{
                        var obj1=php_traiteElement(tab,i + 1,niveau,{});
                        if(obj1.__xst === true){
                            t+='exit(' + obj1.__xva + ');';
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0267'}));
                        }
                    }
                    break;
                    
                case 'mourir' :
                    if(tab[i][8] === 0){
                        t+=un_espace;
                        t+='die;';
                    }else if(tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                        t+=un_espace;
                        t+='die(' + maConstante(tab[i + 1]) + ');';
                        i++;
                    }else{
                        var obj1=php_traiteElement(tab,i + 1,niveau,{});
                        if(obj1.__xst === true){
                            t+='die(' + obj1.__xva + ');';
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0267'}));
                        }
                    }
                    break;
                    
                case 'revenir' :
                    if(tab[i][8] === 0){
                        t+=un_espace;
                        t+='return;';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0165 dans php_tabToPhp1 revenir ne doit pas avoir de paramètres'}));
                    }
                    break;
                    
                case 'retourner' :
                    if(tab[i][8] === 0){
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0173 dans php_tabToPhp1 retourner doit avoir un paramètre'}));
                    }else if(tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                        t+=un_espace;
                        t+='return ' + ma_cst_pour_php(tab[i + 1]) + ';';
                        i++;
                    }else{
                        t+=un_espace;
                        var obj1=php_traiteElement(tab,i + 1,niveau,{});
                        if(obj1.__xst === true){
                            if(obj1.__xva.length > 120){
                                var obj1=php_traiteElement(tab,i + 1,niveau,{"retour_de_ligne" : true});
                                if(obj1.__xst === true){
                                    t+='return ' + obj1.__xva + ';';
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0249 php_tabToPhp1'}));
                                }
                            }else{
                                t+='return ' + obj1.__xva + ';';
                            }
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0289'}));
                        }
                    }
                    break;
                    
                case 'fonction' :
                    dansFonction=true;
                    positionDeclarationFonction=-1;
                    positionContenu=-1;
                    var type_retour='';
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'definition' && tab[j][2] === 'f'){
                            positionDeclarationFonction=j;
                        }
                        if(tab[j][1] === 'contenu' && tab[j][2] === 'f'){
                            positionContenu=j;
                        }
                    }
                    if(positionDeclarationFonction >= 0 && positionContenu >= 0){
                        for( j=positionDeclarationFonction + 1 ; j < l01 ; j=tab[j][12] ){
                            if(tab[j][1] === 'nom'){
                                if(tab[j][8] === 1){
                                    nomFonction=tab[j + 1][1];
                                }else{
                                    return({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'le nom de la fonction doit être sous la forme  n(xxx) '});
                                }
                            }else if(tab[j][1] === 'type_retour'){
                                type_retour=':' + tab[j + 1][1].replace(/\\\\/g,'\\');
                            }
                        }
                        argumentsFonction='';
                        for( j=positionDeclarationFonction + 1 ; j < l01 ; j=tab[j][12] ){
                            if((tab[j][1] === 'argument' || tab[j][1] === 'adresseArgument') && tab[j][2] === 'f'){
                                var nom_argument='';
                                var type_argument='';
                                var valeur_argument='';
                                for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                    if(tab[k][2] === 'c'){
                                        nom_argument=tab[j + 1][1];
                                        if(tab[j][1] === 'adresseArgument'){
                                            nom_argument='&' + nom_argument;
                                        }
                                    }else if(tab[k][2] === 'f'){
                                        if(tab[k][1] === 'valeur_defaut'){
                                            var obj1=php_traiteElement(tab,k + 1,niveau,{});
                                            if(obj1.__xst === true){
                                                valeur_argument='=' + obj1.__xva;
                                            }else{
                                                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans les arguments passés à la fonction 0333'}));
                                            }
                                        }else if(tab[k][1] === 'type_argument' && tab[k][8] === 1 && tab[k + 1][2] === 'c'){
                                            type_argument=tab[k + 1][1].replace(/\\\\/g,'\\') + ' ';
                                        }else if(tab[k][1] === '#'){
                                        }else{
                                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0330 les arguments passés à la fonction '}));
                                        }
                                    }
                                }
                                argumentsFonction+=',' + type_argument + nom_argument + valeur_argument;
                            }
                        }
                        if(nomFonction != ''){
                            t+=CRLF;
                            t+=un_espace;
                            t+='function ' + nomFonction + '(' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr(1) )) + ')' + type_retour + '{';
                            t+=CRLF;
                            if(tab[positionContenu][8] === 0){
                                /* c'est une fonction vide */
                                t+='}';
                            }else{
                                obj=php_tabToPhp1(tab,positionContenu + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                    t+=CRLF;
                                    t+=un_espace;
                                    t+='}';
                                }else{
                                    return({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'problème sur le contenu de la fonction "' + nomFonction + '"'});
                                }
                            }
                        }
                    }else{
                        return({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'});
                    }
                    dansFonction=false;
                    break;
                    
                case 'caststring' :
                    var obj1=php_traiteElement(tab,i + 1,niveau,{});
                    if(obj1.__xst === true){
                        t+='(string)' + obj1.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0336'}));
                    }
                    break;
                    
                case 'castfloat' :
                    var obj1=php_traiteElement(tab,i + 1,niveau,{});
                    if(obj1.__xst === true){
                        t+='(float)' + obj1.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0425'}));
                    }
                    break;
                    
                case 'castint' :
                    var obj1=php_traiteElement(tab,i + 1,niveau,{});
                    if(obj1.__xst === true){
                        t+='(int)' + obj1.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0441'}));
                    }
                    break;
                    
                case 'appelf' :
                    obj=php_traiteAppelFonction(tab,i,dansInitialisation,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0368 il faut un nom de fonction à appeler n(xxxx)'}));
                    }
                    break;
                    
                case 'faire_tant_que' :
                    tabchoix=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'condition'){
                            tabchoix.push([j,tab[j][1],i,[]]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i,[]]);
                        }else if(tab[j][1] === '#'){
                            if(tabchoix.length === 0){
                                tabchoix.push([j,tab[j][1],i,[]]);
                            }else{
                                tabchoix[tabchoix.length - 1][3].push([j,tab[j][1],i,[]]);
                            }
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'la syntaxe de boucle est boucle(condition(),initialisation(),incrément(),faire())'}));
                        }
                    }
                    var condition='';
                    var faire='';
                    for( j=0 ; j < tabchoix.length ; j++ ){
                        if(tabchoix[j][1] === '#'){
                            t+=un_espace;
                        }
                    }
                    for( j=0 ; j < tabchoix.length ; j++ ){
                        if(tabchoix[j][1] === '#'){
                        }else if(tabchoix[j][1] === 'condition'){
                            if(tab[tabchoix[j][0]][8] > 0){
                                obj=php_traiteOperation(tab,tabchoix[j][0],niveau,false);
                                if(obj.__xst === true){
                                    if(obj.__xva.length > 120){
                                        obj=php_traiteOperation(tab,tabchoix[j][0],niveau,true);
                                        if(obj.__xst === true){
                                            condition+=un_espace + '      ';
                                            condition+=obj.__xva;
                                        }else{
                                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '0406 faire_tant_que condition '}));
                                        }
                                    }else{
                                        condition+=obj.__xva;
                                    }
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '1 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }else if(tabchoix[j][1] === 'faire'){
                            if(tab[tabchoix[j][0]][8] > 0){
                                obj=php_tabToPhp1(tab,tabchoix[j][0] + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    faire+=obj.__xva;
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le faire en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }
                    }
                    t+=un_espace;
                    t+='do{';
                    t+=faire;
                    t+=un_espace;
                    t+='}while(' + condition + ');';
                    break;
                    
                case 'boucle' :
                    tabchoix=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'condition'){
                            tabchoix.push([j,tab[j][1],i,[]]);
                        }else if(tab[j][1] === 'initialisation'){
                            tabchoix.push([j,tab[j][1],i,[]]);
                        }else if(tab[j][1] === 'increment'){
                            tabchoix.push([j,tab[j][1],i,[]]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i,[]]);
                        }else if(tab[j][1] === '#'){
                            if(tabchoix.length === 0){
                                tabchoix.push([j,tab[j][1],i,[]]);
                            }else{
                                tabchoix[tabchoix.length - 1][3].push([j,tab[j][1],i,[]]);
                            }
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'la syntaxe de boucle est boucle(condition(),initialisation(),incrément(),faire())'}));
                        }
                    }
                    var initialisation='';
                    var condition='';
                    var increment='';
                    var faire='';
                    for( j=0 ; j < tabchoix.length ; j++ ){
                        if(tabchoix[j][1] === '#'){
                            t+=un_espace;
                        }
                    }
                    for( j=0 ; j < tabchoix.length ; j++ ){
                        if(tabchoix[j][1] === '#'){
                        }else if(tabchoix[j][1] === 'initialisation'){
                            if(tab[tabchoix[j][0]][8] > 0){
                                for( k=tabchoix[j][0] + 1 ; k < l01 ; k=tab[k][12] ){
                                    var obj1=php_traiteElement(tab,k,niveau,{});
                                    if(obj1.__xst === true){
                                        if(initialisation !== ''){
                                            initialisation+='  ,  ';
                                        }
                                        initialisation+=obj1.__xva;
                                    }else{
                                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0457 dans php_tabToPhp1 boucle '}));
                                    }
                                }
                            }
                        }else if(tabchoix[j][1] === 'condition'){
                            if(tab[tabchoix[j][0]][8] > 0){
                                obj=php_traiteOperation(tab,tabchoix[j][0],niveau,false);
                                if(obj.__xst === true){
                                    condition+=obj.__xva;
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '1 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                                }
                                condition=condition.replace(/\n/g,'').replace(/\r/g,'');
                            }
                        }else if(tabchoix[j][1] === 'increment'){
                            if(tab[tabchoix[j][0]][8] > 0){
                                obj=php_tabToPhp1(tab,tabchoix[j][0] + 1,dansFonction,true,niveau);
                                if(obj.__xst === true){
                                    obj.__xva=obj.__xva.replace(/\r/g,'').replace(/\n/g,'');
                                    if(obj.__xva.substr(obj.__xva.length - 1,1) === ';'){
                                        increment+=obj.__xva.substr(0,obj.__xva.length - 1);
                                    }else{
                                        increment+=obj.__xva;
                                    }
                                    increment=increment.replace(/\n/g,'').replace(/\r/g,'').trim();
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '0396 problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }else if(tabchoix[j][1] === 'faire'){
                            if(tab[tabchoix[j][0]][8] > 0){
                                obj=php_tabToPhp1(tab,tabchoix[j][0] + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    faire+=obj.__xva;
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le faire en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }
                    }
                    t+=un_espace;
                    t+='for(' + initialisation + ';' + condition + ';' + increment + '){';
                    t+=faire;
                    t+=un_espace;
                    t+='}';
                    break;
                    
                case 'essayer' :
                    var contenu='';
                    var sierreur=[];
                    var nomErreur='';
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'faire' && tab[j][2] === 'f'){
                            obj=php_tabToPhp1(tab,j + 1,dansFonction,false,niveau + 1);
                            if(obj.__xst === true){
                                contenu+=obj.__xva;
                            }else{
                                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'problème sur le contenu du "essayer" '}));
                            }
                        }else if(tab[j][1] === 'sierreur' && tab[j][2] === 'f'){
                            sierreur.push({"nom_erreur" : '' ,"contenu" : ''});
                            if(tab[j][8] === 2){
                                for( var k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                    if(tab[k][1] === 'faire' && tab[k][2] === 'f'){
                                        obj=php_tabToPhp1(tab,k + 1,dansFonction,false,niveau + 1);
                                        if(obj.__xst === true){
                                            sierreur[sierreur.length - 1].contenu=obj.__xva;
                                        }else{
                                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'problème sur le "sierreur" du "essayer" '}));
                                        }
                                    }else if(tab[k][1] === 'err'
                                           && tab[k][2] === 'f'
                                           && tab[k][8] === 2
                                           && tab[k + 1][2] === 'c'
                                           && tab[k + 2][2] === 'c'
                                    ){
                                        var nomErreur=tab[k + 1][1] + ' ' + tab[k + 2][1];
                                        sierreur[sierreur.length - 1].nom_erreur=nomErreur.replace(/\\\\/g,'\\');
                                    }else{
                                        debugger;
                                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0543 sierreur le deuxième argiment doit être "faire"'}));
                                    }
                                }
                            }else{
                                return(php_logerr({
                                    "__xst" : false ,
                                    "__xva" : t ,
                                    "id" : i ,
                                    "tab" : tab ,
                                    "__xme" : 'problème  0495 sur le "sierreur" du "essayer" il doit contenir 2 arguments sierreur(err(Error $e),faire())'
                                }));
                            }
                        }
                    }
                    t+=un_espace;
                    t+='try{';
                    t+=contenu;
                    t+=un_espace;
                    for( j=0 ; j < sierreur.length ; j++ ){
                        if(j>0){
                            t+='catch(' + sierreur[j].nom_erreur + '){';
                        }else{
                            t+='}catch(' + sierreur[j].nom_erreur + '){';
                        }
                        t+=sierreur[j].contenu;
                        t+=un_espace;
                        t+='}';
                    }
                    break;
                    
                case 'tantQue' :
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'condition'){
                            obj=php_traiteOperation(tab,j,niveau,false);
                            if(obj.__xva.length > 120){
                                obj=php_traiteOperation(tab,j,niveau,true);
                                if(obj.__xst === true){
                                    t+=un_espace;
                                    t+='while(' + un_espace + '  ' + obj.__xva + un_espace + '){';
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '0583 tantQue condition '}));
                                }
                            }else{
                                t+=un_espace;
                                t+='while(' + obj.__xva + '){';
                            }
                        }else if(tab[j][1] === 'faire'){
                            if(tab[j][8] === 0){
                                t+='}';
                            }else{
                                obj=php_tabToPhp1(tab,j + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                    t+=un_espace;
                                    t+='}';
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '0516 problème sur le faire tantQue '}));
                                }
                            }
                        }else if(tab[j][1] === '#'){
                            t+=un_espace;
                            t+='/*' + traiteCommentaire2(tab[j][13],niveau,j) + '*/';
                        }
                    }
                    break;
                    
                case 'choix' :
                    var tabchoix=[];
                    var aDesSinonSi=false;
                    var aUnSinon=false;
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'si'){
                            tabchoix.push([j,tab[j][1],0,[],0]);
                            /* ✍ position type position du contenu du alors */
                            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                /* ✍ chercher la position du alors dans le si */
                                if(tab[k][1] === 'alors'){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    /* ✍ nombre d'enfants du alors */
                                    break;
                                }
                            }
                        }else if(tab[j][1] === 'sinonsi'){
                            aDesSinonSi=true;
                            tabchoix.push([j,tab[j][1],0,[],0]);
                            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                /* ✍ chercher la position du alors dans le sinonsi */
                                if(tab[k][1] === 'alors'){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    /* ✍ nombre d'enfants du alors */
                                    break;
                                }
                            }
                        }else if(tab[j][1] === 'sinon'){
                            aUnSinon=true;
                            tabchoix.push([j,tab[j][1],0,[],0]);
                            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                /* ✍ chercher la position du alors dans le sinon */
                                if(tab[k][1] === 'alors'){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    /* ✍ nombre d'enfants du alors */
                                    break;
                                }
                            }
                        }else if(tab[j][1] === '#'){
                            if(tabchoix.length === 0){
                                tabchoix.push([j,tab[j][1],0,[]]);
                            }else{
                                tabchoix[tabchoix.length - 1][3].push([j,tab[j][1],0,[],0]);
                            }
                        }else{
                            return(php_logerr({
                                "__xst" : false ,
                                "__xva" : t ,
                                "id" : id ,
                                "tab" : tab ,
                                "__xme" : 'la syntaxe de choix est choix(si(condition(),alors()),sinonsi(condition(),alors()),sinon(alors()))'
                            }));
                        }
                    }
                    /* ✍ tests divers */
                    var tabTemp=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if((tab[j][1] === 'si'
                                   || tab[j][1] === 'condition'
                                   || tab[j][1] === 'alors'
                                   || tab[j][1] === 'sinonsi'
                                   || tab[j][1] === 'sinon'
                                   || tab[j][1] === '#')
                               && tab[j][2] === 'f'
                        ){
                            tabTemp.push(tab[j]);
                        }else{
                            return(php_logerr({
                                "__xst" : false ,
                                "__xva" : t ,
                                "id" : i ,
                                "tab" : tab ,
                                "__xme" : 'dans un choix, les niveaux doivent etre "si" "sinonsi" "sinon" et les sous niveaux "alors" et "condition" et non pas "' + tab[j][1] + '" '
                            }));
                        }
                    }
                    /* ✍   console.log('tabTemp='+JSON.stringify(tabTemp)); */
                    for( j=0 ; j < tabchoix.length ; j++ ){
                        if(tabchoix[j][1] === '#'){
                            t+=un_espace;
                            t+='/*' + traiteCommentaire2(tab[tabchoix[j][0]][13],niveau,tabchoix[j][0]) + '*/';
                        }else if(tabchoix[j][1] === 'si'){
                            t+=CRLF;
                            t+=un_espace;
                            t+='if(';
                            var debutCondition=0;
                            for( var k=tabchoix[j][0] + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'condition'){
                                    debutCondition=k;
                                    break;
                                }
                            }
                            obj=php_traiteOperation(tab,debutCondition,niveau,false);
                            if(obj.__xst === true){
                                if(obj.__xva.length > 120){
                                    obj=php_traiteOperation(tab,debutCondition,niveau,true);
                                    if(obj.__xst === true){
                                        t+=obj.__xva;
                                        t+=un_espace;
                                    }else{
                                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '2 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                                    }
                                }else{
                                    t+=obj.__xva;
                                }
                            }else{
                                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '2 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                            }
                            t+='){';
                            t+=CRLF;
                            if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                /* ✍ si on a trouve un "alors" et qu'il contient des enfants */
                                obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '0643 problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                            if(aDesSinonSi){
                            }else{
                                if(aUnSinon){
                                }else{
                                    t+=CRLF;
                                    t+=un_espace;
                                    t+='}';
                                    t+=CRLF;
                                }
                            }
                        }else if(tabchoix[j][1] === 'sinonsi'){
                            t+=CRLF;
                            t+=un_espace;
                            /* ✍ espaces */
                            t+='}else if(';
                            var debutCondition=0;
                            for( var k=tabchoix[j][0] + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'condition'){
                                    debutCondition=k;
                                    break;
                                }
                            }
                            obj=php_traiteOperation(tab,debutCondition,niveau,false);
                            if(obj.__xst === true){
                                if(obj.__xva.length > 120){
                                    obj=php_traiteOperation(tab,debutCondition,niveau,true);
                                    if(obj.__xst === true){
                                        t+=obj.__xva;
                                        t+=un_espace;
                                    }else{
                                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '2 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                                    }
                                }else{
                                    t+=obj.__xva;
                                }
                            }else{
                                /* ✍      console.log(tab[tabchoix[j][0]],tab); */
                                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '3 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                            }
                            t+='){';
                            t+=CRLF;
                            if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                /* ✍ si on a trouve un "alors" et qu'il contient des enfants */
                                obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '0690 problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                            if(aUnSinon){
                            }else{
                                if(j === tabchoix.length - 1){
                                    /* ✍ si c'est le dernier sinonsi */
                                    t+=CRLF;
                                    t+=un_espace;
                                    t+='}';
                                    t+=CRLF;
                                }
                            }
                        }else{
                            t+=CRLF;
                            t+=un_espace;
                            t+='}else{';
                            t+=CRLF;
                            if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                /* ✍ si on a trouve un "alors" et qu'il contient des enfants */
                                obj=php_tabToPhp1(tab,tabchoix[j][2],dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '0716 problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                            t+=un_espace;
                            t+='}';
                            t+=CRLF;
                        }
                    }
                    break;
                    
                case 'affecteFonction' :
                    if(tab[i + 1][2] === 'c' && tab[i][8] >= 2){
                    }else{
                        return(php_logerr({
                            "__xst" : false ,
                            "__xva" : t ,
                            "id" : id ,
                            "tab" : tab ,
                            "__xme" : 'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,[p(yyy),]contenu())'
                        }));
                    }
                    var tabTemp=[];
                    var listeParametres;
                    var positionContenu=-1;
                    argumentsFonction='';
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        /* ✍ 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE */
                        if(tab[j][1] === 'contenu' && tab[j][2] === 'f'){
                            positionContenu=j;
                        }else{
                            if(tab[j][1] === 'p'){
                                if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                                    argumentsFonction+=',' + tab[j + 1][1];
                                }else{
                                    return(php_logerr({
                                        "__xst" : false ,
                                        "__xva" : t ,
                                        "id" : i ,
                                        "tab" : tab ,
                                        "__xme" : 'dans affecteFonction, les parametres doivent être des variables affecteFonction(xxx,[p(yyy),]contenu()) '
                                    }));
                                }
                            }
                        }
                    }
                    if(positionContenu > 0){
                        obj=php_tabToPhp1(tab,positionContenu + 1,dansFonction,false,niveau);
                        if(obj.__xst === true){
                            if(!dansInitialisation){
                                t+=un_espace;
                            }
                            t+='' + tab[i + 1][1] + '=function(' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr(1) )) + '){';
                            t+=obj.__xva;
                            if(!dansInitialisation){
                                t+=un_espace;
                            }
                            t+='}';
                        }else{
                            debugger;
                        }
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans affecteFonction, il faut un contenu() : affecteFonction(xxx,[p(yyy),]contenu())'}));
                    }
                    break;
                    
                case 'affecte_reference' : 
                case 'affecte' :
                    obj=php_traiteAffecte(tab,i,dansInitialisation,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0894 erreur affecte'}));
                    }
                    break;
                    
                case 'affecteop' :
                    obj=php_traiteAffectOp(tab,i,dansInitialisation,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0894 erreur affecte'}));
                    }
                    break;
                    
                case 'static' : 
                case 'declare' :
                    t+=un_espace;
                    if(tab[i][8] === 2 && tab[i + 1][2] === 'c' && tab[i + 2][2] === 'c'){
                        if(tab[i][1] === 'static'){
                            t+='static ';
                        }
                        t+=ma_cst_pour_php(tab[i + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r') + ' = ' + ma_cst_pour_php(tab[i + 2]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r') + ';';
                    }else if(tab[i][8] === 2 && tab[i + 1][2] === 'c' && tab[i + 2][2] === 'f'){
                        if(tab[i][1] === 'static'){
                            t+='static ';
                        }
                        var obj1=php_traiteElement(tab,i + 2,niveau,{});
                        if(obj1.__xst === true){
                            t+=ma_cst_pour_php(tab[i + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r') + ' = ' + obj1.__xva + ';';
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans php_tabToPhp1 0829'}));
                        }
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans un php en 0967'}));
                    }
                    break;
                    
                    
                case 'html_dans_php' :
                    var tag_de_fin='<?' + 'php';
                    /* si c'est la dernière instruction alors on ne met pas de tag de fin */
                    if(tab[i][8] === 0){
                        if(i === l01 - 1){
                            t+='';
                        }else{
                            var trouve=false;
                            for( var j=i + 1 ; j < l01 ; j++ ){
                                if(tab[j][3] <= tab[i][3]){
                                    /* trouve */
                                    trouve=true;
                                    break;
                                }
                            }
                            if(trouve === false){
                                t+='?>';
                            }else{
                                t+='?><?php';
                            }
                        }
                    }else{
                        var trouve=false;
                        for( var j=i + 1 ; j < l01 ; j++ ){
                            if(tab[j][3] <= tab[i][3]){
                                /* trouve */
                                trouve=true;
                                break;
                            }
                        }
                        if(trouve === false){
                            tag_de_fin='';
                        }else{
                            tag_de_fin=CRLF + '<?' + 'php';
                        }
                        obj=__module_html1.tabToHtml1(tab,i,true,niveau);
                        if(obj.__xst === true){
                            if(obj.__xva.substr(obj.__xva.length - 2,2) === '\r\n'){
                                obj.__xva=obj.__xva.substr(0,obj.__xva.length - 2);
                            }else if(obj.__xva.substr(obj.__xva.length - 1,1) === '\r' || obj.__xva.substr(obj.__xva.length - 1,1) === '\n'){
                                obj.__xva=obj.__xva.substr(0,obj.__xva.length - 1);
                            }
                            t+='?>' + CRLF + obj.__xva + tag_de_fin;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur ( php.js ) dans un html en 643'}));
                        }
                    }
                    break;
                    
                case 'bascule' :
                    /*
                      equivalent du switch
                    */
                    var valeurQuand='';
                    var valeursCase='';
                    var le_cas='';
                    var tableau_des_cas=[{"le_cas" : '' ,"les_commentaires" : []}];
                    var les_commentaires_avant=[];
                    for( var j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'quand' && tab[j][2] === 'f'){
                            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                                valeurQuand=ma_cst_pour_php(tab[j + 1]);
                            }else{
                                var obj=php_traiteElement(tab,j + 1,niveau,{});
                                if(obj.__xst === true){
                                    valeurQuand=obj.__xva;
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php dans bascule 0980'}));
                                }
                            }
                        }else if(tab[j][1] === 'est'){
                            var valeurCas='';
                            var InstructionsCas='';
                            for( var k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'valeurNonPrevue' && tab[k][2] === 'f' && tab[k][8] === 0){
                                    valeurCas=null;
                                }else if(tab[k][1] === 'valeur' && tab[k][2] === 'f'){
                                    if(tab[k + 1][2] === 'f'){
                                        var obj=php_traiteElement(tab,k + 1,niveau,{});
                                        if(obj.__xst === true){
                                            valeurCas=obj.__xva;
                                        }else{
                                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'php dans bascule 1069'}));
                                        }
                                    }else{
                                        valeurCas=ma_cst_pour_php(tab[k + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                                    }
                                }else if(tab[k][1] === 'faire' && tab[k][2] === 'f'){
                                    if(tab[k][8] >= 1){
                                        obj=php_tabToPhp1(tab,k + 1,false,false,niveau + 2);
                                        if(obj.__xst === true){
                                            InstructionsCas=obj.__xva;
                                        }else{
                                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur ( php.js ) dans faire  '}));
                                        }
                                    }else{
                                        InstructionsCas='';
                                    }
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur ( php.js ) dans bascule/est  il ne doit y avoir que "valeur" et "faire" '}));
                                }
                            }
                            valeursCase+=espacesn(true,niveau + 1);
                            if(valeurCas === null){
                                valeursCase+='default:';
                            }else{
                                valeursCase+='case ' + valeurCas + ':';
                            }
                            valeursCase+=InstructionsCas;
                            valeursCase+=espacesn(true,niveau + 2);
                            le_cas=espacesn(true,niveau + 1);
                            if(valeurCas === null){
                                le_cas+='default:';
                            }else{
                                le_cas+='case ' + valeurCas + ':';
                            }
                            le_cas+=InstructionsCas;
                            le_cas+=espacesn(true,niveau + 2);
                            tableau_des_cas[tableau_des_cas.length - 1]={"le_cas" : le_cas ,"les_commentaires" : les_commentaires_avant};
                            tableau_des_cas.push({"le_cas" : '' ,"les_commentaires" : []});
                            les_commentaires_avant=[];
                        }else if(tab[j][1] === '#'){
                            les_commentaires_avant.push(tab[j]);
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur ( php.js ) dans bascule il ne doit y avoir que "quand" et "est" '}));
                        }
                    }
                    t+=un_espace;
                    t+='switch (' + valeurQuand + '){';
                    for( var j=0 ; j < tableau_des_cas.length ; j++ ){
                        if(tableau_des_cas[j].le_cas !== ''){
                            for( var k=0 ; k < tableau_des_cas[j].les_commentaires.length ; k++ ){
                                t+=espacesn(true,niveau + 2) + '/*' + traiteCommentaire2(tableau_des_cas[j].les_commentaires[k][13],niveau + 2,i) + '*/';
                            }
                            t+=tableau_des_cas[j].le_cas;
                        }
                    }
                    /* ✍                    t+=valeursCase; */
                    t+=un_espace;
                    t+='}';
                    break;
                    
                case 'boucleSurTableau' :
                    /* ✍ for( $nom as $k1 => $v1) */
                    var cleEtOuValeur='';
                    var Instructions='';
                    for( var j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'pourChaque' && tab[j][2] === 'f' && tab[j][8] === 1){
                            for( var k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'dans' && tab[k][2] === 'f'){
                                    for( var l=k + 1 ; l < l01 ; l=tab[l][12] ){
                                        var obj1=php_traiteElement(tab,l,niveau,{});
                                        if(obj1.__xst === true){
                                            if(tab[k][8] === 3){
                                                if(tab[l][9] === 1){
                                                    cleEtOuValeur+=obj1.__xva;
                                                }else if(tab[l][9] === 2){
                                                    cleEtOuValeur+=' => ' + obj1.__xva;
                                                }else if(tab[l][9] === 3){
                                                    cleEtOuValeur=obj1.__xva + ' as ' + cleEtOuValeur;
                                                }
                                            }else if(tab[k][8] === 2){
                                                if(tab[l][9] === 1){
                                                    cleEtOuValeur+=obj1.__xva;
                                                }else if(tab[l][9] === 2){
                                                    cleEtOuValeur=obj1.__xva + ' as ' + cleEtOuValeur;
                                                }
                                            }else{
                                                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : k ,"tab" : tab ,"__xme" : 'erreur ( php.js ) dans boucleSurTableau 1024 '}));
                                            }
                                        }else{
                                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : k ,"tab" : tab ,"__xme" : 'erreur ( php.js ) dans boucleSurTableau 1014 '}));
                                        }
                                    }
                                }
                            }
                        }else if(tab[j][1] === 'faire' && tab[j][2] === 'f'){
                            if(tab[j][8] >= 1){
                                obj=php_tabToPhp1(tab,j + 1,false,false,niveau + 1);
                                if(obj.__xst === true){
                                    Instructions=obj.__xva;
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur ( php.js ) dans faire  '}));
                                }
                            }else{
                                Instructions='';
                            }
                        }
                    }
                    t+=un_espace;
                    t+='foreach(' + cleEtOuValeur + '){';
                    t+=Instructions;
                    t+=un_espace;
                    t+='}';
                    break;
                    
                case '__halt_compiler' :
                    t+=un_espace;
                    if(tab[i][8] === 0){
                        t+='__halt_compiler()';
                    }else{
                        /* remaining */
                        if(tab[i + 1][4] === 1){
                            /* constante quotée avec ' */
                            var a=ma_cst_pour_php(tab[i + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r').replace(/\\\'/g,'\'').replace(/\\\\/g,'\\');
                            a=a.substr(1);
                            a=a.substr(0,a.length - 1);
                            t+='__halt_compiler();' + a;
                        }else if(tab[i + 1][4] === 3){
                            var a=ma_cst_pour_php(tab[i + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r').replace(/\\"/g,'"').replace(/\\\\/g,'\\');
                            a=a.substr(1);
                            a=a.substr(0,a.length - 1);
                            t+='__halt_compiler();' + a;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php dans php_tabToPhp1 1130'}));
                        }
                        i++;
                    }
                    break;
                    
                case 'globale' :
                    var les_globales='';
                    t+=un_espace;
                    t+='global ';
                    for( var j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][2] === 'c'){
                            les_globales+=',' + maConstante(tab[j]);
                        }else if(tab[j][2] === 'f' && tab[j][1] === '#'){
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php dans php_tabToPhp1 1136'}));
                        }
                    }
                    if(les_globales !== ''){
                        les_globales=les_globales.substr(1);
                        t+=les_globales + ';';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php dans php_tabToPhp1 1147'}));
                    }
                    break;
                    
                case '#' : t+=un_espace + '/*' + traiteCommentaire2(tab[i][13],niveau,i) + '*/';
                    break;
                case 'interface' : 
                case 'definition_de_classe' : 
                case 'méthode' :
                    var obj=php_traiteElement(tab,i,niveau,{});
                    if(obj.__xst === true){
                        t+=un_espace;
                        t+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php dans php_tabToPhp1 1134 pour i=' + i + ' et tab[i][1]="' + tab[i][1] + '"'}));
                    }
                    break;
                    
                case 'sql_inclure_reference' :
                    if(tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                        t+=un_espace;
                        t+='sql_inclure_reference(' + tab[i + 1][1] + ');';
                        t+=un_espace;
                        t+='/*sql_inclure_deb*/';
                        t+=un_espace;
                        t+='require_once(INCLUDE_PATH.\'/sql/sql_' + tab[i + 1][1] + '.php\');';
                        if( typeof __aa_js_sql !== 'undefined' && __aa_js_sql[tab[i + 1][1]]){
                            t+=un_espace;
                            var contenu='/*' + un_espace + __aa_js_sql[tab[i + 1][1]].replace(/\/\*/g,'/ *').replace(/\*\//g,'* /').replace(/\r/g,'').replace(/\n/g,un_espace);
                            contenu=contenu.replace(/\n\n/g,'\n');
                            contenu=contenu.replace(/ AND /g,un_espace + ' AND ');
                            contenu=contenu.replace(/ ORDER BY /,un_espace + ' ORDER BY ');
                            contenu=contenu.replace(/ LIMIT /,un_espace + ' LIMIT ');
                            t+=(contenu + CRLF + un_espace) + '*/';
                        }else{
                            t+=un_espace;
                            t+='/* === ATTENTION === ' + CRLF + 'Le fichier des requêtes sql js est à regénérer et/ou à intégrer ' + CRLF + '*/';
                        }
                        t+=un_espace;
                        t+='/*sql_inclure_fin*/';
                        t+=un_espace;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php_tabToPhp1 dans sql_inclure_reference 1649'}));
                    }
                    break;
                    
                default:
                    if((tab[tab[i][7]][1] === 'et_logique' || tab[tab[i][7]][1] === 'ou_logique') && tab[tab[i][7]][2] === 'f'){
                        debugger;
                        t+='';
                    }else{
                        var option={};
                        if(dansInitialisation === true){
                        }else{
                            option={"terminateur" : ';'};
                        }
                        var obj=php_traiteElement(tab,i,niveau,option);
                        if(obj.__xst === true){
                            /*
                              t+=un_espace;
                            */
                            t+=obj.__xva;
                            /* + ';'; faut-il vraiment ajouter un ";" ? */
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php dans php_tabToPhp1 1230 pour i=' + i + ''}));
                        }
                    }
                    
            }
        }
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traiteConstante1(tab,id,niveau){
    const l01=tab.length;
    var t='';
    var nom_constante='';
    var valeur_constante='';
    var privee_constante='';
    var protegee_constante='';
    var publique_constante='';
    for( var i=id + 1 ; i < l01 ; i=tab[i][12] ){
        if(tab[i][2] === 'c'){
            nom_constante=tab[i][1];
        }else if(tab[i][2] === 'f'){
            if(tab[i][1] === 'valeur'){
                var obj1=php_traiteElement(tab,i + 1,niveau,{});
                if(obj1.__xst === true){
                    valeur_constante+=obj1.__xva;
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1233 dans php_traiteConstante1'}));
                }
            }else if(tab[i][1] === 'privee'){
                privee_constante='private ';
            }else if(tab[i][1] === 'protégée'){
                protegee_constante='protected ';
            }else if(tab[i][1] === 'publique'){
                publique_constante='public ';
            }else if(tab[i][1] === '#'){
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1239 dans php_traiteConstante1 "' + tab[i][1] + '"'}));
            }
        }
    }
    t+=(protegee_constante + privee_constante + publique_constante) + 'const ' + nom_constante + ' = ' + valeur_constante;
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traiteTableau1(tab,i,niveau){
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
    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === 'nomt' && tab[j][2] === 'f'){
            positionAppelTableau=j;
            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                nomTableau=tab[j + 1][1];
                if(nomTableau === 'Array'){
                    nbEnfants=tab[tab[tab[j + 1][7]][7]][8] - 1;
                }
            }else if(tab[j][8] === 1 && tab[j + 1][2] === 'f' && tab[j + 1][1] === 'tableau'){
                var obj=php_traiteTableau1(tab,j + 1,niveau);
                if(obj.__xst === true){
                    nomTableau=obj.__xva;
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1045 problème dans un tableau de tableau '}));
                }
            }else{
                var obj1=php_traiteElement(tab,j + 1,niveau,{});
                if(obj1.__xst === true){
                    nomTableau=obj1.__xva;
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'dans php_traiteTableau1 0110'}));
                }
            }
            break;
        }
    }
    if(positionAppelTableau > 0 && nomTableau !== ''){
        for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
            if(tab[j][2] === 'f'){
                if(tab[j][1] === 'nomt' || tab[j][1] === 'p' || tab[j][1] === '#' || tab[j][1] === 'prop'){
                    continue;
                }else{
                    php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1107 les seuls paramètres de tableau sont nomt,p,prop "' + tab[j][1] + '"'});
                }
            }
        }
        argumentsFonction='';
        for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
            if(tab[j][1] === 'nomt' && tab[j][3] === tab[i][3] + 1){
                /* déjà traité */
            }else if(tab[j][1] === 'p' && tab[j][3] === tab[i][3] + 1){
                if(tab[j][8] === 0 && tab[j][2] === 'f'){
                    argumentsFonction+='[]';
                }else if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                    argumentsFonction+='[' + ma_cst_pour_php(tab[j + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r') + ']';
                }else if(tab[j][8] > 1 && tab[j + 1][2] === 'c'){
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans php_traiteTableau1 0083'}));
                }else{
                    var obj1=php_traiteElement(tab,j + 1,niveau,{});
                    if(obj1.__xst === true){
                        argumentsFonction+='[' + obj1.__xva + ']';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'dans php_traiteTableau1 0110'}));
                    }
                }
            }else if(tab[j][1] === '#' && tab[j][2] === 'f' && tab[j][3] === tab[i][3] + 1){
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans php_traiteTableau1 0170'}));
            }
        }
        t+=nomTableau;
        t+=argumentsFonction;
        t+=proprietesTableau;
    }else{
        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : ' dans php_traiteTableau1 '}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/* ✍===================================================================================================================== */
function isNotSet(tab,id,niveau){
    var t='';
    var valeur='';
    var defaut='';
    var l01=tab.length;
    for( var i=id + 1 ; i < l01 && tab[i][3] > tab[id][3] ; i=tab[i][12] ){
        if(tab[i][9] === 1){
            var obj=php_traiteElement(tab,i,niveau,{});
            if(obj.__xst === true){
                valeur=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans isNotSet 1143'}));
            }
        }else if(tab[i][9] === 2){
            var obj=php_traiteElement(tab,i,niveau,{});
            if(obj.__xst === true){
                defaut=obj.__xva;
                break;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans isNotSet 1154'}));
            }
        }
    }
    t+=valeur + '??' + defaut;
    return({"__xst" : true ,"__xva" : t});
}
/* ✍===================================================================================================================== */
function php_traiteNew(tab,ind,niveau){
    var t='';
    t+='new ';
    var obj=php_traiteElement(tab,ind + 1,niveau,{});
    if(obj.__xst === true){
        t+=obj.__xva;
    }else{
        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'dans appelf de php_traiteElement 1179'}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traiteElement(tab,ind,niveau,options={}){
    var t='';
    var obj={};
    var i=0;
    var j=0;
    var l01=tab.length;
    if(tab[ind][2] === 'c'){
        t=ma_cst_pour_php(tab[ind]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
        return({"__xst" : true ,"__xva" : t});
    }
    switch (tab[ind][1]){
        case 'nouveau' :
            obj=php_traiteNew(tab,ind,niveau);
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'dans nouveau de php_traiteElement 1179'}));
            }
            break;
            
        case 'definition_de_classe' :
            obj=php_traiteAppelDefinition_de_classe(tab,ind,false,niveau);
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1324 dans php_traiteElement'}));
            }
            break;
            
        case 'casttableau' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+='(array)' + obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans affecte 0425'}));
            }
            break;
            
        case 'constante' :
            var declaration='';
            var nom_variable='';
            var type_constante='';
            var valeur='';
            for( i=ind + 1 ; i < l01 ; i=tab[i][12] ){
                if(tab[i][2] === 'c'){
                    nom_variable=tab[i][1];
                }else if(tab[i][2] === 'f'){
                    if(tab[i][1] === 'nomc'){
                        var obj1=php_traiteElement(tab,i + 1,niveau,{});
                        if(obj1.__xst === true){
                            nom_variable=obj1.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1417 php_traiteElement'}));
                        }
                    }else if(tab[i][1] === 'publique'){
                        type_constante='public ';
                    }else if(tab[i][1] === 'privée'){
                        type_constante='private ';
                    }else if(tab[i][1] === 'protégée'){
                        type_constante='protected ';
                    }else if(tab[i][1] === 'valeur'){
                        var obj1=php_traiteElement(tab,i + 1,niveau,{});
                        if(obj1.__xst === true){
                            valeur=obj1.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1417 php_traiteElement'}));
                        }
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1437 php_traiteElement "' + tab[i][1] + '"'}));
                    }
                }
            }
            t+=type_constante + 'const ' + nom_variable + ' = ' + valeur;
            break;
            
        case 'variable_protégée' : 
        case 'variable_privée' : 
        case 'variable_publique' : 
        case 'variable_publique_statique' : 
        case 'variable_privée_statique' : 
        case 'variable_ptotégée_statique' :
            var declaration='';
            var nom_variable='';
            var type_variable='';
            for( i=ind + 1 ; i < l01 ; i=tab[i][12] ){
                if(tab[i][2] === 'c'){
                    nom_variable=tab[i][1];
                }else if(tab[i][2] === 'f'){
                    if(tab[i][1] === 'valeur_defaut'){
                        var obj1=php_traiteElement(tab,i + 1,niveau,{});
                        if(obj1.__xst === true){
                            declaration+='=' + obj1.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1460 php_traiteElement'}));
                        }
                    }else if(tab[i][1] === 'type_variable' && tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                        type_variable=tab[i + 1][1].replace(/\\\\/g,'\\') + ' ';
                    }else if(tab[i][1] === 'type_variable' && tab[i][8] > 1){
                        var nom_type='';
                        var est_nullable='';
                        for( var j=i + 1 ; j < l01 ; j=tab[j][12] ){
                            if(tab[j][2] === 'c'){
                                nom_type=tab[j][1].replace(/\\\\/g,'\\');
                            }else if(tab[j][2] === 'f'){
                                if(tab[j][1] === 'nullable'){
                                    est_nullable='?';
                                }else{
                                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1465 php_traiteElement "' + tab[i][1] + '"'}));
                                }
                            }
                        }
                        type_variable=(est_nullable + nom_type) + ' ';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1465 php_traiteElement "' + tab[i][1] + '"'}));
                    }
                }
            }
            if(tab[ind][1] === 'variable_protégée'){
                t+='protected ' + type_variable + nom_variable + declaration;
            }else if(tab[ind][1] === 'variable_privée'){
                t+='private ' + type_variable + nom_variable + declaration;
            }else if(tab[ind][1] === 'variable_publique'){
                t+='public ' + type_variable + nom_variable + declaration;
            }else if(tab[ind][1] === 'variable_publique_statique'){
                t+='public static ' + type_variable + nom_variable + declaration;
            }else if(tab[ind][1] === 'variable_privée_statique'){
                t+='private static ' + type_variable + nom_variable + declaration;
            }else if(tab[ind][1] === 'variable_ptotégée_statique'){
                t+='protected static ' + type_variable + nom_variable + declaration;
            }
            break;
            
        case 'méthode' :
            var nom_methode='';
            /* ✍ nomm */
            var les_arguments='';
            var les_commentaires_methode='';
            var contenu='';
            var type_retour='';
            var privee='';
            var publique='';
            var statique='';
            var protegee='';
            var finale='';
            var abstraite='';
            var nom_methode='';
            for( i=ind + 1 ; i < l01 ; i=tab[i][12] ){
                if(tab[i][1] === 'definition' && tab[i][2] === 'f'){
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'nomm' && tab[j][2] === 'f' && tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                            nom_methode=tab[j + 1][1];
                        }else if(tab[j][1] === 'privée' && tab[j][2] === 'f' && tab[j][8] === 0){
                            privee='private ';
                        }else if(tab[j][1] === 'finale' && tab[j][2] === 'f' && tab[j][8] === 0){
                            finale='final ';
                        }else if(tab[j][1] === 'publique' && tab[j][2] === 'f' && tab[j][8] === 0){
                            publique='public ';
                        }else if(tab[j][1] === 'statique' && tab[j][2] === 'f' && tab[j][8] === 0){
                            statique='static ';
                        }else if(tab[j][1] === 'abstraite' && tab[j][2] === 'f' && tab[j][8] === 0){
                            abstraite='abstract ';
                        }else if(tab[j][1] === 'protégée' && tab[j][2] === 'f' && tab[j][8] === 0){
                            protegee='protected ';
                        }else if((tab[j][1] === 'argument' || tab[j][1] === 'adresseArgument') && tab[j][2] === 'f'){
                            var nom_argument='';
                            var type_argument='';
                            var valeur_argument='';
                            var commentaire_argument='';
                            for( var k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][2] === 'c'){
                                    nom_argument=tab[k][1];
                                    if(tab[j][1] === 'adresseArgument'){
                                        nom_argument='&' + nom_argument;
                                    }
                                }else if(tab[k][2] === 'f'){
                                    if(tab[k][1] === 'valeur_defaut'){
                                        var obj1=php_traiteElement(tab,k + 1,niveau,{});
                                        if(obj1.__xst === true){
                                            valeur_argument='=' + obj1.__xva;
                                        }else{
                                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1490 dans les arguments passés à la fonction'}));
                                        }
                                    }else if(tab[k][1] === 'type_argument'){
                                        if(tab[k][8] === 1 && tab[k + 1][2] === 'c'){
                                            type_argument=tab[k + 1][1].replace(/\\\\/g,'\\') + ' ';
                                        }else if(tab[k][8] === 1 && tab[k + 1][2] === 'f' && tab[k + 1][1] === 'valeur_constante'){
                                            type_argument=tab[k + 2][1].replace(/\\\\/g,'\\') + ' ';
                                        }else{
                                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1595 dans les arguments passés à la fonction'}));
                                        }
                                    }else if(tab[k][1] === '#'){
                                        commentaire_argument=' /* ' + tab[k][13] + ' */ ';
                                    }else{
                                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1497 dans les arguments passés à la fonction "' + tab[k][1] + '"'}));
                                    }
                                }
                            }
                            les_arguments+=',' + commentaire_argument + type_argument + nom_argument + valeur_argument;
                        }else if(tab[j][1] === 'type_retour' && tab[j][2] === 'f' && tab[j][8] === 1){
                            type_retour=tab[j + 1][1];
                            type_retour=type_retour !== '' ? ( ':' + type_retour.replace(/\\\\/g,'\\') ) : ( '' );
                        }else if(tab[j][1] === '#' && tab[j][2] === 'f'){
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1358 dans php_traiteElement "' + tab[j][1] + '"'}));
                        }
                    }
                    if(nom_methode === ''){
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1353 dans php_traiteElement'}));
                    }
                    if(les_arguments !== ''){
                        les_arguments=les_arguments.substr(1);
                    }
                }else if(tab[i][1] === 'contenu' && tab[i][2] === 'f'){
                    if(tab[i][8] >= 1){
                        var obj1=php_tabToPhp1(tab,i + 1,true,false,niveau + 1);
                        if(obj1.__xst === true){
                            contenu=obj1.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement 1375'}));
                        }
                    }
                }else if(tab[i][1] === '#' && tab[i][2] === 'f'){
                    les_commentaires_methode+=espacesn(true,niveau);
                    les_commentaires_methode+='/*' + traiteCommentaire2(tab[i][13],niveau,i) + '*/';
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1344 dans php_traiteElement "' + tab[i][1] + '"'}));
                }
            }
            if(type_retour !== ''
                   && tab[tab[tab[ind][7]][7]][1] === 'interface'
                   && tab[tab[tab[ind][7]][7]][2] === 'f'
                   && contenu === ''
            ){
                t+=(finale + privee + publique + statique + abstraite + protegee) + 'function ' + nom_methode + '(' + les_arguments + ') ' + type_retour + ';';
            }else{
                if(abstraite !== '' && contenu === ''){
                    t+=(finale + privee + publique + statique + abstraite + protegee) + 'function ' + nom_methode + '(' + les_arguments + ')' + type_retour + ';';
                }else{
                    t+=(finale + privee + publique + statique + abstraite + protegee) + 'function ' + nom_methode + '(' + les_arguments + ')' + type_retour + '{';
                    t+=les_commentaires_methode;
                    t+=contenu;
                    t+=espacesn(true,niveau);
                    t+='}';
                }
            }
            break;
            
        case 'appelf' :
            obj=php_traiteAppelFonction(tab,ind,true,niveau);
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'dans appelf de php_traiteElement 0835'}));
            }
            break;
            
        case 'tableau' :
            var objTableau=php_traiteTableau1(tab,ind,niveau);
            if(objTableau.__xst === true){
                t=objTableau.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'erreur 1176 sur php_traiteElement '}));
            }
            break;
            
        case 'array' : 
        case 'defTab' :
            obj=php_traiteDefinitionTableau(tab,ind,niveau,{"retour_ligne" : true});
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'dans array de php_traiteElement 1373 il y a un problème'}));
            }
            break;
            
        case 'html_dans_php' :
            obj=__module_html1.tabToHtml1(tab,ind,true,0);
            if(obj.__xst === true){
                t='html_dans_php(\'' + obj.__xva.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'erreur php_traiteElement dans un html 1195 définit dans un php'}));
            }
            break;
            
        case 'sql' :
            obj=tabToSql1(tab,ind,niveau,false);
            if(obj.__xst === true){
                t='sql_dans_php(\'' + obj.__xva.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'erreur php_traiteElement dans un sql 1205 définit dans un php'}));
            }
            break;
            
        case '??' :
            obj=isNotSet(tab,ind,niveau);
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'erreur php_traiteElement dans un sql 1214 définit dans un php'}));
            }
            break;
            
        case 'supprimeErreur' :
            var obj=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj.__xst === true){
                t+='@' + obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement dans php_traiteElement 1322'}));
            }
            break;
            
        case 'liste' :
            var objListe=php_traiteListe1(tab,ind,true,niveau,false);
            if(objListe.__xst === true){
                t+=objListe.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement erreur 1330 sur php_traiteOperation '}));
            }
            break;
            
        case 'caststring' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+='(string)' + obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement 1551'}));
            }
            break;
            
        case 'castfloat' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+='(float)' + obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement 1551'}));
            }
            break;
            
        case 'postinc' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+=obj1.__xva + '++';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement 1727'}));
            }
            break;
            
        case 'preinc' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+='++' + obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement 1447'}));
            }
            break;
            
        case 'postdec' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+='' + obj1.__xva + '--';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement 1456'}));
            }
            break;
            
        case 'predec' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+='--' + obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement 1739'}));
            }
            break;
            
        case 'castint' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+='(int)(' + obj1.__xva + ')';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement dans castint 1436'}));
            }
            break;
            
        case 'affecte' : 
        case 'affecte_reference' :
            var obj1=php_traiteAffecte(tab,ind,true,niveau);
            if(obj1.__xst === true){
                /* je supprime les parenthèses t+='(' + obj1.__xva + ')'; */
                t+=obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement  1553'}));
            }
            break;
            
        case 'propriete' :
            if(tab[ind][8] === 2){
                var element='';
                var propriete='';
                var num=0;
                for( var i=ind + 1 ; i < l01 ; i=tab[i][12] ){
                    var obj1=php_traiteElement(tab,i,niveau,{});
                    if(obj1.__xst === true){
                        if(num === 0){
                            element=obj1.__xva;
                            num++;
                        }else{
                            propriete=obj1.__xva;
                        }
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"ind" : ind ,"tab" : tab ,"__xme" : '1626 php_traiteElement propriété '}));
                    }
                }
                t+=element + '->' + propriete;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"ind" : ind ,"tab" : tab ,"__xme" : '1622 php_traiteElement propriété '}));
            }
            break;
            
        case 'testEnLigne' :
            var testEnLigne=[];
            for( j=ind + 1 ; j < l01 ; j=tab[j][12] ){
                if(tab[j][1] === 'condition'){
                    testEnLigne.push([j,tab[j][1],ind]);
                }else if(tab[j][1] === 'siVrai'){
                    testEnLigne.push([j,tab[j][1],ind,tab[j][8]]);
                }else if(tab[j][1] === 'siFaux'){
                    testEnLigne.push([j,tab[j][1],ind]);
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"ind" : ind ,"tab" : tab ,"__xme" : '1639 php.js testEnLigne'}));
                }
            }
            if(testEnLigne.length !== 3){
                return(php_logerr({
                    "__xst" : false ,
                    "id" : id ,
                    "ind" : ind ,
                    "tab" : tab ,
                    "__xme" : 'php_traiteElement 1428 il faut un format testEnLigne(condition() , siVrai(1) , siFaux(2))"'
                }));
            }
            var j=0;
            var si_vrai='';
            for( j=0 ; j < testEnLigne.length ; j++ ){
                if(testEnLigne[j][1] === 'condition'){
                    var objCondition=php_traiteOperation(tab,testEnLigne[j][0],niveau,true);
                    if(objCondition.__xst === true){
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"ind" : testEnLigne[j][0] ,"tab" : tab ,"__xme" : '1 php_traiteElement sur condition 1438 ' + testEnLigne[j][0]}));
                    }
                }else if(testEnLigne[j][1] === 'siVrai'){
                    if(testEnLigne[j][3] === 0){
                        si_vrai='';
                    }else{
                        var objSiVrai=php_traiteElement(tab,testEnLigne[j][0] + 1,niveau + 1,{});
                        if(objSiVrai.__xst === true){
                            si_vrai=objSiVrai.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"ind" : testEnLigne[j][0] ,"tab" : tab ,"__xme" : '1 php_traiteElement sur siVrai 1446 ' + testEnLigne[j][0]}));
                        }
                    }
                }else if(testEnLigne[j][1] === 'siFaux'){
                    var objSiFaux=php_traiteElement(tab,testEnLigne[j][0] + 1,niveau + 1,{});
                    if(objSiFaux.__xst === true){
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"ind" : testEnLigne[j][0] ,"tab" : tab ,"__xme" : '1 php_traiteElement sur objSiFaux 1454 ' + testEnLigne[j][0]}));
                    }
                }
            }
            var par_gauche='';
            var par_droite='';
            if(tab[tab[ind][7]][1] === 'siVrai' || tab[tab[ind][7]][1] === 'siFaux'){
                par_gauche='(';
                par_droite=')';
            }
            if(options.hasOwnProperty('retour_de_ligne') && options.retour_de_ligne === true){
                t=(par_gauche + objCondition.__xva) + ' ?' + (si_vrai === '' ? ( '' ) : ( espacesn(true,niveau) + ' ' + si_vrai + ' ' )) + ': ' + espacesn(true,niveau) + objSiFaux.__xva + par_droite;
            }else{
                t=(par_gauche + objCondition.__xva) + ' ?' + (si_vrai === '' ? ( '' ) : ( ' ' + si_vrai + ' ' )) + ': ' + objSiFaux.__xva + par_droite;
            }
            break;
            
        case 'sql_inclure_source' :
            if(tab[ind][8] === 1 && tab[ind + 1][2] === 'c'){
                t+='sql_inclure_source(' + tab[ind + 1][1] + ')';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement dans sql_inclure_source 1643'}));
            }
            break;
            
        case 'heredoc' :
            if(tab[ind][8] === 2){
                t+='<<<' + tab[ind + 1][1] + tab[ind + 2][1].replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r').replace(/\\`/g,'`') + CRLF + tab[ind + 1][1].trim() + '';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement heredoc incorrecte 1698'}));
            }
            break;
            
        case 'nowdoc' :
            if(tab[ind][8] === 2){
                t+='<<<\'' + tab[ind + 1][1] + '\'' + tab[ind + 2][1].replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r').replace(/\\`/g,'`') + CRLF + tab[ind + 1][1].trim() + '';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1793 php_traiteElement nowdoc '}));
            }
            break;
            
        case 'sql_inclure_reference' :
            if(tab[ind][8] === 1 && tab[ind + 1][2] === 'c'){
                t+='sql_inclure_reference(' + tab[ind + 1][1] + ')';
                t+=espacesn(true,niveau);
                t+='/*sql_inclure_deb*/';
                t+=espacesn(true,niveau);
                t+='require_once(INCLUDE_PATH.\'/sql/sql_1.php\');';
                t+=espacesn(true,niveau);
                t+='/*sql_inclure_fin*/';
                t+=espacesn(true,niveau);
                debugger;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php_traiteElement dans sql_inclure_reference 1649'}));
            }
            break;
            
        case 'directive' :
            var faire='';
            var texte='';
            for( i=ind + 1 ; i < l01 ; i=tab[i][12] ){
                if(tab[i][1] === 'texte' && tab[i][2] === 'f' && tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                    texte=tab[i + 1][1].replace(/\\\'/g,'"');
                }else if(tab[i][1] === 'faire' && tab[i][2] === 'f'){
                    obj=php_tabToPhp1(tab,i + 1,false,false,niveau + 1);
                    if(obj.__xst === true){
                        faire+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1784 problème sur le faire dans directive'}));
                    }
                }else if(tab[i][1] === '#' && tab[i][2] === 'f'){
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1788 php_traiteElement dans directive'}));
                }
            }
            if(faire !== ''){
                t+=espacesn(true,niveau);
                t+='declare(' + texte + '){' + faire + espacesn(true,niveau) + '}';
            }else{
                t+='declare(' + texte + ')';
            }
            break;
            
        case 'espace_de_noms' :
            var faire='';
            var nom_espace='';
            for( i=ind + 1 ; i < l01 ; i=tab[i][12] ){
                if(tab[i][1] === 'nom_espace' && tab[i][2] === 'f' && tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                    nom_espace=tab[i + 1][1].replace(/\\\\/g,'\\');
                }else if(tab[i][1] === 'faire' && tab[i][2] === 'f'){
                    obj=php_tabToPhp1(tab,i + 1,false,false,niveau);
                    if(obj.__xst === true){
                        faire+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1812 problème sur le faire dans espace_de_noms'}));
                    }
                }else if(tab[i][1] === '#' && tab[i][2] === 'f'){
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1854 php_traiteElement dans directive "' + tab[i][1] + '"'}));
                }
            }
            if(nom_espace !== ''){
                if(faire !== ''){
                    t+=espacesn(true,niveau);
                    t+='namespace ' + nom_espace + ';';
                    t+=espacesn(true,niveau);
                    t+=faire;
                }else{
                    t+=espacesn(true,niveau);
                    t+='namespace ' + nom_espace + ';';
                }
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1831 php_traiteElement dans interface '}));
            }
            break;
            
        case 'interface' :
            var faire='';
            var nom_interface='';
            for( i=ind + 1 ; i < l01 ; i=tab[i][12] ){
                if(tab[i][1] === 'nom_interface' && tab[i][2] === 'f' && tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                    nom_interface=tab[i + 1][1];
                }else if(tab[i][1] === 'faire' && tab[i][2] === 'f'){
                    obj=php_tabToPhp1(tab,i + 1,false,false,niveau + 1);
                    if(obj.__xst === true){
                        faire+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1812 problème sur le faire dans espace_de_noms'}));
                    }
                }else if(tab[i][1] === '#' && tab[i][2] === 'f'){
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1847 php_traiteElement dans directive'}));
                }
            }
            if(faire !== '' && nom_interface !== ''){
                t+=espacesn(true,niveau);
                t+='interface  ' + nom_interface + '{';
                t+=espacesn(true,niveau);
                t+=faire;
                t+=espacesn(true,niveau);
                t+='}';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1861 php_traiteElement dans interface '}));
            }
            break;
            
        case 'throw' :
            var obj1=php_traiteElement(tab,ind + 1,niveau,{});
            if(obj1.__xst === true){
                t+='throw ' + obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"ind" : ind ,"tab" : tab ,"__xme" : '1626 php_traiteElement propriété '}));
            }
            break;
            
        case 'constante' :
            var obj=php_traiteConstante1(tab,ind,niveau);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '1983 php_traiteElement dans interface '}));
            }
            break;
            
        case 'valeur_constante' :
            if(tab[ind][8] === 1 && tab[ind + 1][2] === 'c'){
                t+=tab[ind + 1][1].replace(/\\\\/g,'\\');
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '2017 php_traiteElement dans valeur_constante '}));
            }
            break;
            
        case 'cloturée' :
            obj=php_traiteAppelCloturee(tab,ind,true,niveau);
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'dans appelf de php_traiteElement 0835'}));
            }
            break;
            
        case '' :
            obj=php_tabToPhp1(tab,ind + 1,true,true,niveau);
            /* ✍ dansFonction,dansInitialisation */
            if(obj.__xst === true){
                t='(' + obj.__xva + ')';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'dans appelf de php_traiteElement 0835'}));
            }
            break;
            
        case 'encapsulé' :
            if(tab[ind][8] === 1 && tab[ind + 1][2] === 'c'){
                t+=ma_cst_pour_php(tab[ind + 1]);
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : '2017 php_traiteElement dans valeur_constante '}));
            }
            break;
            
        default:
            /*#        
              case 'et' : 
              case 'ou' : 
              case 'et_logique' : 
              case 'ou_logique' :
              case 'non' : 
              case 'concat' : 
              case 'plus' : 
              case 'moins' : 
              case 'mult' : 
              case 'divi' : 
              case 'infeg' : 
              case 'egal' : 
              case 'egalstricte' : 
              case 'diffstricte' : 
              case 'sup' : 
              case 'egal' : 
              case 'supeg' : 
              case 'modulo' : 
              case 'div' : 
              case 'ou_binaire' : 
              case 'et_binaire' : 
              case 'xou_binaire' : 
              case 'decal_gauche' : 
              case 'decal_droite' : 
              case 'instance_de' :
            */
            obj=php_traiteOperation(tab,ind,niveau,false);
            if(obj.__xst === true){
                t=obj.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'dans php_traiteElement/php_traiteOperation "' + tab[ind][1] + '" 1166'}));
            }
            break;
            
    }
    if(options.hasOwnProperty('terminateur') && options.terminateur !== ''){
        t=espacesn(true,niveau) + t + options.terminateur;
    }
    return({"__xst" : true ,"__xva" : t});
}
/* ✍===================================================================================================================== */
function php_traiteListe1(tab,ind,niveau){
    var t='';
    var l01=tab.length;
    var lesParams='';
    for( var i=ind + 1 ; i < l01 ; i=tab[i][12] ){
        if(tab[i][1] === 'p' && tab[i][2] === 'f'){
            if(lesParams !== ''){
                lesParams+=' , ';
            }
            if(tab[i][8] === 0){
                /*
                  dans les list() de php, il peut y avoir un paramètre vide
                */
                lesParams+=' /* vide intentionnel */';
            }else{
                var obj=php_traiteElement(tab,i + 1,niveau,{});
                if(obj.__xst === true){
                    lesParams+=obj.__xva;
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'php dans php_traiteListe1 1423'}));
                }
            }
        }
    }
    t+='list(' + lesParams + ')';
    return({"__xst" : true ,"__xva" : t});
}
/*
  (n/a)	clone new	clone et new
  droite	**	arithmétique
  (n/a)	+ - ++ -- ~ (int) (float) (string) (array) (object) (bool) @	arithmétique (unitaire + et -), incrément/décrément bit à bit, casting de type et contrôle d'erreur
  gauche	instanceof	type
  (n/a)	!	logique
  gauche	* / %	arithmétique
  gauche	+ - .	arithmétique (binaire + et -), tableau et chaîne de caractères (. antérieur à PHP 8.0.0)
  gauche	<< >>	bitwise
  gauche	.	string (à partir de PHP 8.0.0)
  non-associatif	< <= > >=	comparaison
  non-associatif	== != === !== <> <=>	comparaison
  gauche	&	bitwise et références
  gauche	^	bitwise
  gauche	|	bitwise
  gauche	&&	logique
  gauche	||	logique
  droite	??	coalescence nul
  non-associatif	? :	ternaire (gauche--associatif antérieur à PHP 8.0.0)
  droite	= += -= *= **= /= .= %= &= |= ^= <<= >>= ??=	affectation
  (n/a)	yield from	yield from
  (n/a)	yield	yield
  (n/a)	print	print
  gauche	and	logique
  gauche	xor	logique
  gauche	or	logique
  
*/
/*
  // https://www.php.net/manual/fr/language.operators.precedence.php
  les plus et moins unaires sont gérés à part
  'plus'          : {priorite :  10 , operateur : '+'      , operandes : '1'  , commentaire : 'plus  unaire ( cad +1, +$a)' },
  'moins'         : {priorite :  10 , operateur : '-'      , operandes : '1'  , commentaire : 'poins unaire ( cad +1, +$a)' },
  
  <> <=> à gérer quand je verrai son utilisation !
  
*/
var tableau_precedences_php={
    "" : {"priorite" : 0 ,"operateur" : '' ,"operandes" : '1' ,"commentaire" : 'parenthèse !'} ,
    "nouveau" : {"priorite" : 3 ,"operateur" : 'new ' ,"operandes" : '1' ,"commentaire" : ''} ,
    "clone" : {"priorite" : 5 ,"operateur" : 'clone ' ,"operandes" : '1' ,"commentaire" : ''} ,
     /*  */
    "puissance" : {"priorite" : 10 ,"operateur" : '**' ,"operandes" : '2' ,"commentaire" : ''} ,
     /*  */
    "instance_de" : {"priorite" : 20 ,"operateur" : ' instanceof ' ,"operandes" : '1' ,"commentaire" : ''} ,
     /*  */
    "non" : {"priorite" : 30 ,"operateur" : '!' ,"operandes" : '1' ,"commentaire" : ''} ,
     /*  */
    "mult" : {"priorite" : 40 ,"operateur" : ' * ' ,"operandes" : '2n' ,"commentaire" : ''} ,
    "divi" : {"priorite" : 40 ,"operateur" : ' / ' ,"operandes" : '2n' ,"commentaire" : ''} ,
    "modulo" : {"priorite" : 40 ,"operateur" : '% ' ,"operandes" : '2n' ,"commentaire" : ''} ,
     /*  */
    "plus" : {"priorite" : 50 ,"operateur" : ' + ' ,"operandes" : '2n' ,"commentaire" : ''} ,
    "moins" : {"priorite" : 50 ,"operateur" : ' - ' ,"operandes" : '2n' ,"commentaire" : ''} ,
     /*  */
    "decal_gauche" : {"priorite" : 60 ,"operateur" : '<<' ,"operandes" : '2' ,"commentaire" : ''} ,
    "decal_droite" : {"priorite" : 60 ,"operateur" : '>>' ,"operandes" : '2' ,"commentaire" : ''} ,
     /*  */
    "concat" : {"priorite" : 70 ,"operateur" : ' . ' ,"operandes" : '2n' ,"commentaire" : ''} ,
     /*  */
    "inf" : {"priorite" : 80 ,"operateur" : ' < ' ,"operandes" : '2' ,"commentaire" : ''} ,
    "infeg" : {"priorite" : 80 ,"operateur" : ' <= ' ,"operandes" : '2' ,"commentaire" : ''} ,
    "sup" : {"priorite" : 80 ,"operateur" : ' > ' ,"operandes" : '2' ,"commentaire" : ''} ,
    "supeg" : {"priorite" : 80 ,"operateur" : ' >= ' ,"operandes" : '2' ,"commentaire" : ''} ,
     /*  */
    "egal" : {"priorite" : 90 ,"operateur" : ' == ' ,"operandes" : '2' ,"commentaire" : ''} ,
    "diff" : {"priorite" : 90 ,"operateur" : ' != ' ,"operandes" : '2' ,"commentaire" : ''} ,
    "egalstricte" : {"priorite" : 90 ,"operateur" : ' === ' ,"operandes" : '2' ,"commentaire" : ''} ,
    "diffstricte" : {"priorite" : 90 ,"operateur" : ' !== ' ,"operandes" : '2' ,"commentaire" : ''} ,
     /*  */
    "et_binaire" : {"priorite" : 100 ,"operateur" : ' & ' ,"operandes" : '2' ,"commentaire" : ''} ,
    "xou_binaire" : {"priorite" : 120 ,"operateur" : ' ^ ' ,"operandes" : '2' ,"commentaire" : ''} ,
    "ou_binaire" : {"priorite" : 130 ,"operateur" : ' | ' ,"operandes" : '2' ,"commentaire" : ''} ,
     /*  */
    "et" : {"priorite" : 130 ,"operateur" : ' && ' ,"operandes" : '2n' ,"commentaire" : ''} ,
    "ou" : {"priorite" : 140 ,"operateur" : ' || ' ,"operandes" : '2n' ,"commentaire" : ''} ,
    "??" : {"priorite" : 150 ,"operateur" : '??' ,"operandes" : '3' ,"commentaire" : ''} ,
    "condition" : {"priorite" : 150 ,"operateur" : '' ,"operandes" : '1' ,"commentaire" : ''}
};
/* les autres, je ne les ai pas encore rencontrés */
/*
  
  tab[tab[tab[id][7]][7]] + ' ' + tab[tab[id][7]] + ' ' + tab[id]
  $a=$b?$c:$d+1; testenligne sifaux plus
*/
function php_traiteOperation(tab,id,niveau,ajouter_des_sauts_de_lignes){
    var t='';
    var i=0;
    var l01=tab.length;
    var sauts=false;
    let un_espace='';
    if(!tableau_precedences_php.hasOwnProperty(tab[id][1])){
        return(php_logerr({"__xst" : false ,"id" : i ,"tab" : tab ,"__xme" : '2259 php_traiteOperation 1633 "' + tab[id][1] + '"'}));
    }
    var operateur_courant=tableau_precedences_php[tab[id][1]];
    var operandes=[];
    for( i=id + 1 ; i < l01 ; i=tab[i][12] ){
        if(tab[i][1] === '#' && tab[i][2] === 'f'){
        }else if(tab[i][2] === 'c'){
            if(tab[id][1] === 'instance_de'){
                operandes.push({"valeur" : tab[i][1].replace(/\\\\/g,'\\')});
            }else{
                operandes.push({"valeur" : ma_cst_pour_php(tab[i]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r')});
            }
        }else{
            if(tableau_precedences_php.hasOwnProperty(tab[i][1])){
                var sous_operateur=tableau_precedences_php[tab[i][1]];
                var objOperation=php_traiteOperation(tab,i,niveau + 1,ajouter_des_sauts_de_lignes);
                if(objOperation.__xst === true){
                    if(sous_operateur.priorite >= operateur_courant.priorite
                           || operateur_courant.operateur === ' . '
                               && sous_operateur.operateur !== ' . '
                    ){
                        operandes.push({"valeur" : '(' + objOperation.__xva + ')'});
                    }else{
                        if(operateur_courant.operateur === ''){
                            operandes.push({"valeur" : objOperation.__xva});
                        }else{
                            operandes.push({"valeur" : objOperation.__xva});
                        }
                    }
                }else{
                    return(php_logerr({"__xst" : false ,"id" : i ,"tab" : tab ,"__xme" : '2282 php_traiteOperation'}));
                }
            }else{
                var obj1=php_traiteElement(tab,i,niveau,{});
                if(obj1.__xst === true){
                    if(tab[i][2] === 'c'
                           || tab[i][2] === 'f'
                               && (tab[i][1] === 'appelf'
                                   || tab[i][1] === 'tableau'
                                   || tab[i][1] === 'defTab'
                                   || tab[i][1] === 'valeur_constante'
                                   || tab[i][1] === 'preinc'
                                   || tab[i][1] === 'postinc'
                                   || tab[i][1] === 'predec'
                                   || tab[i][1] === 'postdec')
                    ){
                        operandes.push({"valeur" : obj1.__xva});
                    }else if(tab[i][2] === 'f' && tab[i][1] === 'affecte'){
                        /* il vaut mieux mettre un affectation dans une parenthèse sauf quand elle est à la racine d'une condition */
                        if(tab[tab[i][7]][1] === 'condition'){
                            operandes.push({"valeur" : obj1.__xva});
                        }else{
                            operandes.push({"valeur" : '(' + obj1.__xva + ')'});
                        }
                    }else{
                        operandes.push({"valeur" : '(' + obj1.__xva + ')'});
                    }
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2291 php_traiteOperation '}));
                }
            }
        }
    }
    if(operandes.length === 0){
        return(php_logerr({"__xst" : false ,"id" : i ,"tab" : tab ,"__xme" : '2308 php_traiteOperation'}));
    }else if(operandes.length === 1){
        if(tab[id][1] === 'moins'){
            t+='-' + operandes[0].valeur;
        }else if(tab[id][1] === 'plus'){
            t+='+' + operandes[0].valeur;
        }else{
            t+=operateur_courant.operateur;
            t+=operandes[0].valeur;
        }
    }else{
        if(ajouter_des_sauts_de_lignes !== undefined && ajouter_des_sauts_de_lignes === true){
            sauts=true;
            un_espace=espacesn(true,niveau - 1);
        }
        for( var i=0 ; i < operandes.length ; i++ ){
            if(i > 0){
                if(sauts === true && (operateur_courant.operateur === ' && ' || operateur_courant.operateur === ' || ')){
                    t+=un_espace + '  ';
                }
                t+=operateur_courant.operateur;
            }
            t+=operandes[i].valeur;
        }
    }
    /* console.log('operandes=' , operandes ); */
    /* debugger */
    return({"__xva" : t ,"__xst" : true});
}
/*
  =====================================================================================================================
*/
function php_traiteAppelDefinition_de_classe(tab,ind,dansConditionOuDansFonction,niveau){
    var t='';
    var nom_de_classe='';
    var contenu='';
    var abstraite='';
    var implemente='';
    var finale='';
    var l01=tab.length;
    var etend='';
    for( var i=ind + 1 ; i < l01 ; i=tab[i][12] ){
        if(tab[i][7] === ind && tab[i][2] === 'f'){
            if(tab[i][1] === "nom_classe" && tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                nom_de_classe=maConstante(tab[i + 1]);
            }else if(tab[i][1] === "contenu" && tab[i][2] === 'f'){
                if(tab[i][8] > 0){
                    var obj=php_tabToPhp1(tab,i + 1,false,false,niveau + 1);
                    if(obj.__xst === true){
                        contenu=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans php_traiteAppelDefinition_de_classe 1856'}));
                    }
                }else{
                    contenu='';
                }
            }else if(tab[i][1] === "abstraite" && tab[i][2] === 'f' && tab[i][8] === 0){
                abstraite='abstract ';
            }else if(tab[i][1] === "finale" && tab[i][2] === 'f' && tab[i][8] === 0){
                finale='final ';
            }else if(tab[i][1] === "étend" && tab[i][2] === 'f' && tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                etend=' extends ' + tab[i + 1][1].replace(/\\\\/g,'\\') + ' ';
            }else if(tab[i][1] === "implemente" && tab[i][2] === 'f' && tab[i][8] > 0){
                for( var j=i + 1 ; j < l01 ; j=tab[j][12] ){
                    if(tab[j][2] === 'c'){
                        implemente+=', ' + tab[j][1].replace(/\\\\/g,'\\');
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2480 erreur dans php_traiteAppelDefinition_de_classe'}));
                    }
                }
                implemente=' implements ' + implemente.substr(1);
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2489 erreur dans php_traiteAppelDefinition_de_classe "' + tab[i][1] + '"'}));
            }
        }
    }
    if(nom_de_classe === ''){
        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans php_traiteAppelDefinition_de_classe 1862'}));
    }
    t+=(finale + abstraite) + 'class ' + nom_de_classe + etend + implemente + '{' + contenu;
    t+=espacesn(true,niveau);
    t+='}';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traite_arguments_definition_fonction(tab,i,niveau){
    const l01=tab.length;
    var t='';
    var j=0;
    var k=0;
    var argumentsFonction='';
    var elementFonction='';
    var dansNew=false;
    /* ✍ 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE */
    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === 'defTab'){
            obj=php_traiteDefinitionTableau(tab,j,niveau,{});
            if(obj.__xst === true){
                argumentsFonction+=',' + obj.__xva + '';
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans traiteAppelFonction Objet il y a un problème'}));
            }
        }else if(tab[j][1] === 'element'){
            if(tab[j + 1][1] === 'nouveau'){
                dansNew=true;
                var indice=j + 1;
            }else{
                var indice=j;
            }
            if(tab[indice + 1][2] === 'c'){
                if(tab[indice + 1][1].length >= 2 && tab[indice + 1][1].substr(tab[indice + 1][1].length - 2,2) === '::'){
                    /*
                      appel à une fonction statique de php, pas de flèche
                    */
                    if(tab[indice + 1][1].indexOf('\\') >= 0){
                        elementFonction=tab[indice + 1][1].replace(/\\\\/g,'\\').replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r') + '';
                    }else{
                        elementFonction=ma_cst_pour_php(tab[indice + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r') + '';
                    }
                }else{
                    elementFonction=ma_cst_pour_php(tab[indice + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r') + '->';
                }
            }else if(tab[indice + 1][2] === 'f'){
                if(tab[indice + 1][1] === 'appelf'){
                    var obindice=php_traiteAppelFonction(tab,indice + 1,true,niveau);
                    if(obindice.__xst === true){
                        if(dansNew === true){
                            elementFonction='(new ' + obindice.__xva + ')->';
                        }else{
                            elementFonction=obindice.__xva + '->';
                        }
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : indice ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction imbriqué 1'}));
                    }
                }else if(tab[indice + 1][1] === 'tableau'){
                    var obindice=php_traiteTableau1(tab,indice + 1,niveau);
                    if(obindice.__xst === true){
                        elementFonction='' + obindice.__xva + '->';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : indice ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction imbriqué 1'}));
                    }
                }else{
                    var obje=php_traiteElement(tab,indice + 1,niveau,{});
                    if(obje.__xst === true){
                        elementFonction=obje.__xva + '->';
                    }else{
                        return(php_logerr({
                            "__xst" : false ,
                            "__xva" : t ,
                            "id" : indice ,
                            "tab" : tab ,
                            "__xme" : '1614 erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue ' + tab[indice + 1][1]
                        }));
                    }
                }
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : indice ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction 1193 element '}));
            }
        }else if(tab[j][1] === 'p' && tab[j][3] === tab[i][3] + 1){
            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                argumentsFonction+=',' + ma_cst_pour_php(tab[j + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
            }else{
                var le_commentaire='';
                for( var k=j + 1 ; k < l01 ; k=tab[k][12] ){
                    if(tab[k][2] === 'f' && tab[k][1] === '#'){
                        le_commentaire=' /*' + tab[k][13].trim() + '*/ ';
                    }else{
                        var obj1=php_traiteElement(tab,k,niveau,{});
                        if(obj1.__xst === true){
                            argumentsFonction+=',' + le_commentaire + obj1.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur 1858 dans php_traiteAppelFonction '}));
                        }
                    }
                }
            }
        }
    }
    if(argumentsFonction !== ''){
        argumentsFonction=argumentsFonction.substr(1);
    }
    return({"__xst" : true ,"__xva" : argumentsFonction ,"elementFonction" : elementFonction});
}
/*
  =====================================================================================================================
*/
function php_traiteAppelCloturee(tab,i,dansConditionOuDansFonction,niveau){
    const l01=tab.length;
    var t='';
    var j=0;
    var k=0;
    var obj={};
    var nomFonction='';
    var elementFonction='';
    var nomRetour='';
    var positionRetour=-1;
    var argumentsFonction='';
    var les_utilisations='';
    var contenu='';
    var type_retour='';
    var statique='';
    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === 'argument' || tab[j][1] === 'adresseArgument'){
            var nom_argument='';
            var type_argument='';
            var valeur_argument='';
            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                if(tab[k][2] === 'c'){
                    nom_argument=tab[j + 1][1];
                    if(tab[j][1] === 'adresseArgument'){
                        nom_argument='&' + nom_argument;
                    }
                }else if(tab[k][2] === 'f'){
                    if(tab[k][1] === 'valeur_defaut'){
                        var obj1=php_traiteElement(tab,k + 1,niveau,{});
                        if(obj1.__xst === true){
                            valeur_argument='=' + obj1.__xva;
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2586 dans les arguments passés à la fonction'}));
                        }
                    }else if(tab[k][1] === 'type_argument' && tab[k][8] === 1 && tab[k + 1][2] === 'c'){
                        type_argument=tab[k + 1][1].replace(/\\\\/g,'\\') + ' ';
                    }else if(tab[k][1] === 'type_argument' && tab[k][8] === 1 && tab[k + 1][2] === 'f'){
                        if('valeur_constante' === tab[k + 1][1] && tab[k + 1][2] === 'f' && tab[k + 1][8] === 1 && tab[k + 2][2] === 'c'){
                            type_argument=tab[k + 2][1].replace(/\\\\/g,'\\') + ' ';
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2591 les arguments passés à la fonction "' + tab[k][1] + '"'}));
                        }
                    }else if(tab[k][1] === '#'){
                    }else{
                        debugger;
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2591 les arguments passés à la fonction "' + tab[k][1] + '"'}));
                    }
                }
            }
            argumentsFonction+=',' + type_argument + nom_argument + valeur_argument;
        }else if(tab[j][1] === 'statique'){
            statique='static ';
        }else if(tab[j][1] === 'type_retour'){
            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                type_retour=':' + tab[j + 1][1].replace(/\\\\/g,'\\');
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2491 php_traiteAppelCloturee'}));
            }
        }else if(tab[j][1] === 'contenu'){
            obj=php_tabToPhp1(tab,j + 1,false,false,niveau + 2);
            if(obj.__xst === true){
                contenu+=obj.__xva;
            }else{
                return({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2646 problème sur le contenu de la fonction "' + nomFonction + '"'});
            }
        }else if(tab[j][1] === 'utilise' || tab[j][1] === 'utilise_par_adresse'){
            var prefixe='';
            if(tab[j][1] === 'utilise_par_adresse'){
                prefixe='&';
            }
            var nom_argument='';
            var type_argument='';
            var valeur_argument='';
            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                if(tab[k][7] === j){
                    if(tab[k][2] === 'c'){
                        nom_argument=prefixe + tab[j + 1][1];
                    }else if(tab[k][2] === 'f'){
                        if(tab[k][1] === 'valeur_defaut'){
                            var obj1=php_traiteElement(tab,k + 1,niveau,{});
                            if(obj1.__xst === true){
                                valeur_argument='=' + obj1.__xva;
                            }else{
                                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2620 dans les arguments passés à la fonction 0333'}));
                            }
                        }else if(tab[k][1] === 'type_argument' && tab[k][8] === 1 && tab[k + 1][2] === 'c'){
                            type_argument=tab[k + 1][1].replace(/\\\\/g,'\\') + ' ';
                        }else if(tab[k][1] === '#'){
                        }else{
                            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2626 les arguments passés à la fonction '}));
                        }
                    }
                }
            }
            les_utilisations+=',' + type_argument + nom_argument + valeur_argument;
        }else{
            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2490 php_traiteAppelCloturee "' + tab[j][1] + '"'}));
        }
    }
    if(argumentsFonction !== ''){
        argumentsFonction=argumentsFonction.substr(1);
    }
    if(les_utilisations !== ''){
        les_utilisations=' use (' + les_utilisations.substr(1) + ')';
    }
    t=statique + 'function(' + argumentsFonction + ')' + type_retour + les_utilisations + '{' + contenu + espacesn(true,niveau + 1) + '}';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traiteAffectOp(tab,i,dansConditionOuDansFonction,niveau){
    const l01=tab.length;
    var t='';
    if(!dansConditionOuDansFonction){
        t+=espacesn(true,niveau);
    }
    var operation='';
    var avantEgal='';
    var apresEgal='';
    var commentaire='';
    for( var j=i + 1 ; j < l01 ; j=tab[j][12] ){
        var elt='';
        if(tab[j][2] === 'f' && tab[j][1] === '#'){
            if(!dansConditionOuDansFonction){
                commentaire+=espacesn(true,niveau);
            }
            commentaire+='/*' + traiteCommentaire2(tab[j][13],niveau,j) + '*/';
            continue;
        }else if(tab[j][2] === 'c'){
            if(operation === ''){
                operation=tab[j][1];
            }else{
                elt=ma_cst_pour_php(tab[j]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
            }
        }else{
            var obj1=php_traiteElement(tab,j,niveau,{});
            if(obj1.__xst === true){
                elt=obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans affecte 0804'}));
            }
        }
        /* enfant 1 ou 2 ou 3 */
        if(avantEgal === ''){
            avantEgal=elt;
        }else{
            if(apresEgal !== ''){
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php.js 2492 vérifiez les paramètres de affecte ( 2 + commentaires uniquement )  '}));
            }else{
                apresEgal=elt;
            }
        }
    }
    if(commentaire !== ''){
        t=commentaire + t;
    }
    t+=avantEgal + ' ' + operation + ' ' + apresEgal;
    if(!dansConditionOuDansFonction){
        t+=';';
    }
    if(tab[i][8] === 4 && commentaire === ''){
        return(php_logerr({
            "__xst" : false ,
            "__xva" : t ,
            "id" : i ,
            "tab" : tab ,
            "__xme" : 'php.js 2991 affecte ne doit contenir que 2 ou 3 arguments et le 3ème doit être un commentaire non vide '
        }));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traiteAffecte(tab,i,dansConditionOuDansFonction,niveau){
    const l01=tab.length;
    var t='';
    if(!dansConditionOuDansFonction){
        t+=espacesn(true,niveau);
    }
    var avantEgal='';
    var apresEgal='';
    var commentaire='';
    for( var j=i + 1 ; j < l01 ; j=tab[j][12] ){
        var elt='';
        if(tab[j][2] === 'f' && tab[j][1] === '#'){
            if(!dansConditionOuDansFonction){
                commentaire+=espacesn(true,niveau);
            }
            commentaire+='/*' + traiteCommentaire2(tab[j][13],niveau,j) + '*/';
            continue;
        }else if(tab[j][2] === 'c'){
            elt=ma_cst_pour_php(tab[j]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
        }else{
            var obj1=php_traiteElement(tab,j,niveau,{});
            if(obj1.__xst === true){
                elt=obj1.__xva;
            }else{
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans affecte 0804'}));
            }
        }
        /* enfant 1 ou 2 */
        if(avantEgal === ''){
            avantEgal=elt;
        }else{
            if(apresEgal !== ''){
                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'php.js 2492 vérifiez les paramètres de affecte ( 2 + commentaires uniquement )  '}));
            }else{
                apresEgal=elt;
            }
        }
    }
    if(apresEgal.substr(0,avantEgal.length) === avantEgal && apresEgal.substr(avantEgal.length,1) === '.'){
        if(tab[i][1] === 'affecte_reference'){
            t+=avantEgal + '.=&' + apresEgal.substr(avantEgal.length + 1);
        }else{
            t+=avantEgal + '.=' + apresEgal.substr(avantEgal.length + 1);
        }
    }else{
        if(tab[i][1] === 'affecte_reference'){
            t+=avantEgal + '=&' + apresEgal;
        }else{
            t+=avantEgal + '=' + apresEgal;
        }
    }
    if(commentaire !== ''){
        t=commentaire + t;
    }
    if(!dansConditionOuDansFonction){
        t+=';';
    }
    if(tab[i][8] === 3 && commentaire === ''){
        return(php_logerr({
            "__xst" : false ,
            "__xva" : t ,
            "id" : i ,
            "tab" : tab ,
            "__xme" : 'php.js 2991 affecte ne doit contenir que 2 ou 3 arguments et le 3ème doit être un commentaire non vide '
        }));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traiteAppelFonction(tab,i,dansConditionOuDansFonction,niveau){
    var t='';
    var j=0;
    var k=0;
    var obj={};
    var nomFonction='';
    var elementFonction='';
    var positionAppelFonction=0;
    var nomRetour='';
    var positionRetour=-1;
    var argumentsFonction='';
    var objTxt='';
    var l01=tab.length;
    var sans_arguments=false;
    positionAppelFonction=-1;
    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === 'sans_arguments' && tab[j][2] === 'f' && tab[tab[i][7]][1] === 'nouveau'){
            /* pour l'instant, je n'ai rencontré ce cas que dans les appels à new ($a = new P\A\B;) */
            sans_arguments=true;
        }else if(tab[j][1] === 'nomf' && tab[j][2] === 'f'){
            positionAppelFonction=j;
            if(tab[j][8] === 1){
                if(tab[j + 1][2] === 'c'){
                    nomFonction=tab[j + 1][1];
                    if(nomFonction.indexOf('\\') >= 0){
                        nomFonction=nomFonction.replace(/\\\\/g,'\\');
                    }
                }else if(tab[j + 1][2] === 'f' && tab[j + 1][1] === 'tableau'){
                    var obj1=php_traiteTableau1(tab,j + 1,niveau);
                    if(obj1.__xst === true){
                        nomFonction=obj1.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans php_traiteAppelFonction 1364'}));
                    }
                }else if(tab[j + 1][2] === 'f'
                       && tab[j + 1][1] === 'qualification_totale'
                       && tab[j + 1][2] === 'f'
                       && tab[j + 1][8] === 1
                       && tab[j + 2][2] === 'c'
                ){
                    nomFonction='\\' + tab[j + 2][1];
                }else if(tab[j + 1][2] === 'f' && tab[j + 1][1] === 'concat'){
                    var objf=php_traiteElement(tab,j + 1,niveau + 2,{});
                    if(objf.__xst === true){
                        nomFonction='{' + objf.__xva + '}';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2749 nom fonction incorrecte '}));
                    }
                }else if(tab[j + 1][2] === 'f' && tab[j + 1][1] === 'appelf'){
                    var objf2=php_traiteElement(tab,j + 1,niveau + 2,{});
                    if(objf2.__xst === true){
                        nomFonction='' + objf2.__xva + '';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2511 nom fonction incorrecte '}));
                    }
                    debugger;
                }else if(tab[j + 1][2] === 'f' && tab[j + 1][1] === 'propriete'){
                    var objf2=php_traiteElement(tab,j + 1,niveau + 2,{});
                    if(objf2.__xst === true){
                        nomFonction='' + objf2.__xva + '';
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2511 nom fonction incorrecte '}));
                    }
                }else if(tab[j + 1][2] === 'f' && tab[j + 1][1] === "valeur_constante" && tab[j + 1][8] === 1){
                    nomFonction=tab[j + 2][1].replace(/\\\\/g,'\\');
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2147 nom fonction incorrecte "' + tab[j + 1][1] + '" '}));
                }
            }
        }
    }
    if(positionAppelFonction > 0 && nomFonction != ''){
        nomRetour='';
        positionRetour=-1;
        for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
            if(tab[j][1] === 'r' && tab[j][2] === 'f'){
                if(tab[j][8] === 1){
                    nomRetour=tab[j + 1][1];
                }
                positionRetour=j;
                break;
            }
        }
        var obj=php_traite_arguments_definition_fonction(tab,i,niveau);
        if(obj.__xst === true){
            argumentsFonction=obj.__xva;
            elementFonction=obj.elementFonction;
        }else{
            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2566 erreur dans un appel de fonction pour les arguments'}));
        }
        if(!dansConditionOuDansFonction){
            t+=espacesn(true,niveau);
        }
        t+=nomRetour != '' ? ( nomRetour + '=' ) : ( '' );
        if(nomFonction === 'use'){
            argumentsFonction=argumentsFonction.replace(/\\\\/g,'\\');
            argumentsFonction=argumentsFonction.substr(1,argumentsFonction.length - 2);
            t+=nomFonction + ' ' + argumentsFonction + '';
        }else if(nomFonction === 'echo'){
            t+=(elementFonction + nomFonction) + ' ' + argumentsFonction + ' ';
        }else{
            t+=elementFonction + nomFonction + (sans_arguments === true ? ( '' ) : ( '(' + argumentsFonction + ')' ));
        }
        if(!dansConditionOuDansFonction){
            t+=';';
        }
    }else{
        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : ' 2283 il faut un nom de fonction à appeler n(xxxx)'}));
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traiteConcat(tab,id,niveau){
    var l01=tab.length;
    var t='';
    for( var j=id + 1 ; j < l01 ; j=tab[j][12] ){
        /*
          ✍ si on est au niveau +1
          
          on ajoute systématiquement un "."
        */
        t+='.';
        if(tab[j][2] === 'c'){
            t+=ma_cst_pour_php(tab[j]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
        }else if(tab[j][2] === 'f'){
            switch (tab[j][1]){
                case 'appelf' :
                    obj=php_traiteAppelFonction(tab,j,true,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un php_traiteConcat 1025'}));
                    }
                    break;
                    
                case 'concat' :
                    obj=php_traiteConcat(tab,j,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un php_traiteConcat 1033'}));
                    }
                    break;
                    
                case 'tableau' :
                    var obj=php_traiteTableau1(tab,j,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1541 problème dans un tableau php_traiteConcat '});
                    }
                    break;
                    
                default:
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un php_traiteConcat 1036'}));
                    
            }
        }else{
            return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un php_traiteConcat 1028'}));
        }
    }
    if(t !== ''){
        /*
          on supprime le premier  "."
        */
        t=t.substr(1);
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function php_traiteDefinitionTableau(tab,id,niveau,options={}){
    /* ✍ id = position de 'obj' */
    var t='';
    var j=0;
    var obje={};
    var l01=tab.length;
    var seuil_elements_dans_tableau=4;
    var commentaire='';
    var le_commentaire='';
    var nombre_elements_dans_tableau=0;
    var a_un_tbel=false;
    var contient_un_commentaire=false;
    var numero_enfant=0;
    var format_court=false;
    if(tab[id][8] === 0){
        t+='array()';
        return({"__xst" : true ,"__xva" : t});
    }
    for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
        /* ✍ si on est au niveau +1 */
        nombre_elements_dans_tableau++;
        if(tab[j][1] === '#' && tab[j][2] === 'f'){
            contient_un_commentaire=true;
            if(tab[j][13].indexOf('tbel') >= 0){
                a_un_tbel=true;
            }
        }
    }
    if(nombre_elements_dans_tableau > seuil_elements_dans_tableau){
        contient_un_commentaire=true;
    }
    var tableauSortie=[];
    var sortie='';
    for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
        sortie='';
        if(tab[j][1] === '#' && tab[j][2] === 'f'){
            if(nombre_elements_dans_tableau > seuil_elements_dans_tableau){
                if(a_un_tbel === false){
                    sortie+=espacesn(true,niveau + 1);
                }
            }
            sortie+='/*' + traiteCommentaire2(tab[j][13],niveau + 1,j) + '*/';
            tableauSortie.push(["commentaire",sortie]);
            /* commentaire+=tab[j][13]; */
        }else if(tab[j][1] === 'format_court' && tab[j][2] === 'f'){
            format_court=true;
        }else if(tab[j][1] === '' && tab[j][2] === 'f'){
            numero_enfant++;
            if(tab[j][8] >= 2){
                /* format clé => valeur */
                var cle='';
                var valeur='';
                for( var k=j + 1 ; k < l01 ; k=tab[k][12] ){
                    if(tab[k][7] === j){
                        if(tab[k][1] === '#' && tab[k][2] === 'f'){
                            le_commentaire='/*' + tab[k][13].trim().replace(/\n/g,'').replace(/\r/g,'') + '*/';
                        }else{
                            obje=php_traiteElement(tab,k,niveau + 2,options);
                            if(obje.__xst === true){
                                if(cle === ''){
                                    cle=obje.__xva;
                                }else{
                                    valeur=obje.__xva;
                                }
                            }else{
                                return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2357 php_traiteDefinitionTableau il y a un problème'}));
                            }
                        }
                    }
                }
                if(a_un_tbel){
                    sortie+=' ';
                }else{
                    if(contient_un_commentaire === true){
                        sortie+=espacesn(true,niveau + 1);
                    }else{
                        sortie+=' ';
                    }
                }
                if(valeur === '' && cle !== ''){
                    sortie+=(le_commentaire + cle) + '';
                }else if(valeur !== '' && cle !== ''){
                    sortie+=(le_commentaire + cle) + ' => ' + valeur + '';
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2800 php_traiteDefinitionTableau problème clé valeur'}));
                }
                tableauSortie.push(["element",sortie]);
                le_commentaire='';
            }else if(tab[j][8] === 1){
                /* en php, il peut n'y avoir qu'une dimention sans cle => valeur array['a','b'] */
                obje=php_traiteElement(tab,j + 1,niveau + 2,options);
                if(obje.__xst === true){
                    if(a_un_tbel){
                        if(numero_enfant% 10 === 0){
                            sortie+=espacesn(true,niveau + 1);
                        }else{
                            sortie+=' ';
                        }
                    }else{
                        if(contient_un_commentaire){
                            sortie+=espacesn(true,niveau + 1);
                        }else{
                            sortie+=' ';
                        }
                    }
                    sortie+=obje.__xva;
                    tableauSortie.push(["element",sortie]);
                }else{
                    return(php_logerr({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2378 php_traiteDefinitionTableau il y a un problème'}));
                }
            }
        }
    }
    var tt='';
    var dernier_element=true;
    /* on démarre la lecture du tableau à la fin */
    for( var i=tableauSortie.length - 1 ; i >= 0 ; i-- ){
        if(tableauSortie[i][0] === 'commentaire'){
            tt=tableauSortie[i][1] + tt;
        }else{
            /* et on ne met pas de firgule après le dernier élément */
            tt=tableauSortie[i][1] + (dernier_element === true ? ( '' ) : ( ',' )) + tt;
            dernier_element=false;
        }
    }
    if(format_court === true){
        t='[' + tt;
    }else{
        t+='array(' + tt;
    }
    if(a_un_tbel){
        if(numero_enfant >= 10){
            t+=espacesn(true,niveau);
        }
    }else{
        if(contient_un_commentaire === true){
            t+=espacesn(true,niveau);
        }
    }
    if(format_court === true){
        t+=']';
    }else{
        t+=')';
    }
    return({"__xst" : true ,"__xva" : t});
}