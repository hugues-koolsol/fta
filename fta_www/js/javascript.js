"use strict";

/*
  =====================================================================================================================
  point d'entrée parseJavascript0 js_traiteInstruction1
  =====================================================================================================================
*/
function ma_cst_pour_javascript(elt){
    var r=maConstante(elt);
    if(elt[4] === 1 || elt[4] === 3){
        const cr1=new RegExp('¶' + 'CR' + '¶',"g");
        const lf1=new RegExp('¶' + 'LF' + '¶',"g");
        r=r.replace(lf1,'\\n').replace(cr1,'\\r');
    }
    return r;
}
/*
  =====================================================================================================================
*/
function parseJavascript0(tab,id,niveau){
    var t='';
    /*
      var startMicro = performance.now();
    */
    var retJS=js_tabTojavascript1(tab,id,false,false,niveau);
    /*
      var endMicro = performance.now();
      var temps=parseInt((endMicro - startMicro) * 1000,10) / 1000;
      console.log(' temps = '+temps +'ms' );
    */
    if(retJS.__xst === true){
        if(retJS.__xva.length >= 2 && retJS.__xva.substr(0,2) === '\r\n'){
            retJS.__xva=retJS.__xva.substr(2);
        }
        if(retJS.__xva.length >= 1 && retJS.__xva.substr(0,1) === '\r'){
            retJS.__xva=retJS.__xva.substr(1);
        }
        if(retJS.__xva.length >= 1 && retJS.__xva.substr(0,1) === '\n'){
            retJS.__xva=retJS.__xva.substr(1);
        }
        return({"__xst" : true ,"__xva" : retJS.__xva});
    }else{
        /* console.error(retJS); */
        return retJS;
    }
}
/*
  =====================================================================================================================
  todo augmenter l'utilisation de js_traiteInstruction1
  =====================================================================================================================
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
    var tabchoix=[];
    const l01=tab.length;
    if(l01 <= 1){
        return({"__xst" : true ,"__xva" : ''});
    }
    var id_du_parent=tab[id][7];
    var espcLigne=espacesn(true,niveau);
    var terminateur=';';
    if(dansInitialisation === true){
        terminateur='';
        espcLigne='';
    }
    if(dansCascade === true){
        console.log('%c dans cascade','color:red;background:lightgreen;');
        terminateur=',';
        espcLigne='';
        dansInitialisation=false;
    }
    for( i=id ; i < l01 ; i=tab[i][12] ){
        if(dansInitialisation === true
         || ("initialisation" === tab[tab[id][7]][1]
         || "increment" === tab[tab[id][7]][1])
         && tab[tab[id][7]][8] > 1
        ){
            if(t !== ''){
                t+=',';
            }
        }
        if(tab[i][2] === 'c'){
            t+=ma_cst_pour_javascript(tab[i]);
        }else{
            switch (tab[i][1]){
                case 'identifiant' :
                    if(tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                        t+=espcLigne;
                        t+=ma_cst_pour_javascript(tab[i + 1]) + terminateur;
                        t+=espcLigne;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : nl1() + 'js_tabTojavascript1 "' + tab[i][1] + '" doit avoir un seul paramètre '}));
                    }
                    break;
                    
                case 'break' : 
                case 'continue' : 
                case 'useStrict' : 
                case 'debugger' :
                    if('useStrict' === tab[i][1]){
                        t+=espcLigne;
                        t+='"use strict"' + terminateur;
                    }else{
                        t+=espcLigne;
                        if(tab[i][8] === 0){
                            t+=tab[i][1] + '' + terminateur;
                        }else if(tab[i][8] === 1 && tab[i][1] === 'break' && tab[i + 1][2] === 'c'){
                            t+=tab[i][1] + ' ' + (tab[i + 1][1]) + ' ' + terminateur;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans un ' + tab[i][1] + ' qui doit être sous le format ' + tab[i][1] + '() strictement'}));
                        }
                    }
                    break;
                    
                case 'revenir' :
                    if(tab[i][8] === 0){
                        t+=espcLigne;
                        t+='return' + terminateur;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : ' revenir ne doit pas avoir de paramètre'}));
                    }
                    break;
                    
                case 'retourner' :
                    if(tab[i][8] === 0){
                        try{
                            t+=espcLigne;
                            t+='return' + terminateur;
                        }catch(e){
                            debugger;
                        }
                    }else{
                        var contenu_retour='';
                        var constante_simple=true;
                        for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                            if(tab[j][2] === 'c'){
                                contenu_retour+=ma_cst_pour_javascript(tab[j]);
                            }else{
                                var objdef=js_traiteInstruction1(tab,niveau,j);
                                if(objdef.__xst === true){
                                    contenu_retour+=objdef.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '0138 retourner '}));
                                }
                                constante_simple=false;
                            }
                        }
                        if(contenu_retour.substr(contenu_retour.length - 1,1) === ';'){
                            contenu_retour=contenu_retour.substr(0,contenu_retour.length - 1);
                        }
                        if(constante_simple === true){
                            t+=espcLigne + 'return ' + contenu_retour + '' + terminateur;
                        }else{
                            t+=espcLigne + 'return(' + contenu_retour + ')' + terminateur;
                        }
                    }
                    break;
                    
                case 'fonction' : 
                case 'méthode' :
                    var nomFonction='';
                    var typeFonction='';
                    var modeFonction='';
                    var asynchrone='';
                    dansFonction=true;
                    positionDeclarationFonction=-1;
                    positionContenu=-1;
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'definition' && tab[j][2] === 'f'){
                            positionDeclarationFonction=j;
                        }else if(tab[j][1] === 'contenu' && tab[j][2] === 'f'){
                            positionContenu=j;
                        }
                    }
                    if(positionDeclarationFonction >= 0 && positionContenu >= 0){
                        for( j=positionDeclarationFonction + 1 ; j < l01 ; j=tab[j][12] ){
                            if(tab[j][1] === 'nom'){
                                if(tab[j][8] === 1){
                                    nomFonction=tab[j + 1][1];
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0206 le nom de la fonction doit être sous la forme   '}));
                                }
                            }else if(tab[j][1] === 'asynchrone'){
                                if(tab[j][8] === 0){
                                    asynchrone='async ';
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0223 asynchrone doit être une fonction sans paramètres   '}));
                                }
                            }else if(tab[j][1] === 'mode'){
                                if(tab[j][8] === 1 && tab[j + 1][1] === 'privée'){
                                    modeFonction='#';
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0212  mode de la classe '}));
                                }
                            }else if(tab[j][1] === 'type'){
                                if(tab[j][8] === 1 && tab[j + 1][1] === 'lire'){
                                    typeFonction='get ';
                                }else if(tab[j][8] === 1 && tab[j + 1][1] === 'écrire'){
                                    typeFonction='set ';
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : ' 0220 le type de la classe doit être écrire ou lire '}));
                                }
                            }
                        }
                        argumentsFonction='';
                        for( j=positionDeclarationFonction + 1 ; j < l01 ; j=tab[j][12] ){
                            if(tab[j][1] === 'argument'){
                                if(tab[j][8] === 1){
                                    argumentsFonction+=',' + (tab[j + 1][1]);
                                }else{
                                    var nom_argument='';
                                    var valeur_par_defaut='';
                                    var commentaire='';
                                    for( var k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                        if(tab[k][2] === 'c'){
                                            nom_argument=ma_cst_pour_javascript(tab[k]);
                                            /* un point virgule est-il en trop ? */
                                        }else if(tab[k][2] === 'f' && tab[k][1] === 'defaut' && tab[k][8] === 1){
                                            var objdef=js_traiteInstruction1(tab,niveau,k + 1);
                                            if(objdef.__xst === true){
                                                valeur_par_defaut=objdef.__xva;
                                            }else{
                                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0364 les arguments passés à la fonction doivent être sous la forme argument(xxx,[defaut(yyy)]) '}));
                                            }
                                        }else if(tab[k][2] === 'f' && tab[k][1] === '#'){
                                            commentaire=tab[k][13].trim().replace(/\n/g,' ').replace(/\r/g,' ');
                                        }
                                    }
                                    argumentsFonction+=',' + (commentaire !== '' ? ( '/' + '* ' + commentaire + ' *' + '/' ) : ( '' )) + nom_argument + (valeur_par_defaut !== '' ? ( '=' + valeur_par_defaut ) : ( '' ));
                                }
                            }
                        }
                        if(nomFonction !== ''){
                            if('méthode' === tab[i][1] && !(tab[i - 1][1] === '#' && tab[i - 1][2] === 'f')){
                                /*
                                  j'impose l'écriture d'un commentaire minimal devant une méthode
                                */
                                t+=espcLigne;
                                t+='/* function ' + nomFonction + ' */';
                            }
                            t+=espcLigne;
                            if('méthode' === tab[i][1]){
                                t+=(typeFonction + asynchrone + modeFonction + nomFonction) + '(' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr(1) )) + '){';
                            }else{
                                t+=asynchrone + 'function ' + nomFonction + '(' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr(1) )) + '){';
                            }
                            if(tab[positionContenu][8] === 0){
                                t+=espcLigne;
                                t+='  /* rien ici */';
                                t+=espcLigne;
                                t+='}';
                            }else{
                                obj=js_tabTojavascript1(tab,positionContenu + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                    t+=espcLigne;
                                    t+='}';
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'problème sur le contenu de la fonction "' + nomFonction + '"'}));
                                }
                            }
                        }
                    }else{
                        return({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'});
                    }
                    dansFonction=false;
                    break;
                    
                case 'appelf' :
                    obj=js_traiteAppelFonction(tab,i,true,niveau + 1,false,'');
                    if(obj.__xst === true){
                        t+=espcLigne;
                        if(obj.hasOwnProperty('arguments_a_ajouter_au_retour') && obj.arguments_a_ajouter_au_retour !== ''){
                            if(obj.__xva.substr(obj.__xva.length - 1,1) === ';'){
                                obj.__xva=obj.__xva.substr(0,obj.__xva.length - 1);
                            }
                            t+=obj.__xva + obj.arguments_a_ajouter_au_retour + terminateur;
                        }else{
                            if(terminateur === ';' && obj.__xva.substr(obj.__xva.length - 1,1) === ';'){
                                t+=obj.__xva;
                            }else{
                                t+=obj.__xva + terminateur;
                            }
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'il faut un nom de fonction à appeler n(xxxx)'}));
                    }
                    break;
                    
                case 'cascade' :
                    var obj=js_tabTojavascript1(tab,i + 1,false,true,niveau,true);
                    if(obj.__xst === true){
                        t+=espcLigne;
                        if(obj.__xva.length > 0){
                            t+=obj.__xva.substr(0,obj.__xva.length - 1);
                        }else{
                            t+=obj.__xva;
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans flux cascade, 0216'}));
                    }
                    break;
                    
                case 'boucle_sur_objet_dans' :
                    tabchoix=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'pourChaque'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === '#' && tab[j][2] === 'f'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'la syntaxe de boucle_sur_objet_dans est boucle_sur_objet_dans(pourChaque(dans(a , b)),faire())'}));
                        }
                    }
                    var pourChaque='';
                    var faire='';
                    for( j=0 ; j < tabchoix.length ; j=j + 1 ){
                        if(tabchoix[j][1] === 'pourChaque'){
                            obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,true,niveau + 1);
                            if(obj.__xst === true){
                                pourChaque+=obj.__xva;
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '0491 problème sur la pour de boucle_sur_objet_dans en indice ' + tabchoix[j][0]}));
                            }
                        }else if(tabchoix[j][1] === 'faire'){
                            if(tab[tabchoix[j][0]][8] === 0){
                                faire+='';
                            }else{
                                obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    faire+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors de boucle_sur_objet_dans en indice ' + tabchoix[j][0]}));
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
                    break;
                    
                case 'boucle_sur_objet_de' :
                    tabchoix=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'pourChaque'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === '#' && tab[j][2] === 'f'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'la syntaxe de boucle_sur_objet_dans est boucle_sur_objet_dans(pourChaque(dans(a , b)),faire())'}));
                        }
                    }
                    var pourChaque='';
                    var faire='';
                    for( j=0 ; j < tabchoix.length ; j=j + 1 ){
                        if(tabchoix[j][1] === 'pourChaque'){
                            obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,true,niveau + 1);
                            if(obj.__xst === true){
                                pourChaque+=obj.__xva;
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '0491 problème sur la pour de boucle_sur_objet_dans en indice ' + tabchoix[j][0]}));
                            }
                        }else if(tabchoix[j][1] === 'faire'){
                            if(tab[tabchoix[j][0]][8] === 0){
                                faire+='';
                            }else{
                                obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    faire+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors de boucle_sur_objet_dans en indice ' + tabchoix[j][0]}));
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
                    break;
                    
                case 'bascule' :
                    var valeurQuand='';
                    var valeursCase='';
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][7] === i){
                            if(tab[j][1] === 'quand' && tab[j][2] === 'f'){
                                if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                                    valeurQuand=tab[j + 1][1];
                                }else{
                                    var obj=js_traiteInstruction1(tab,niveau,j + 1);
                                    if(obj.__xst === true){
                                        valeurQuand=obj.__xva;
                                    }else{
                                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'javascript dans bascule 0274'}));
                                    }
                                }
                            }else if(tab[j][1] === 'est'){
                                var valeurCas='';
                                var InstructionsCas='';
                                var k=j + 1;
                                for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                    if(tab[k][1] === 'valeurNonPrevue' && tab[k][2] === 'f' && tab[k][8] === 0){
                                        valeurCas=null;
                                    }else if(tab[k][1] === 'valeur' && tab[k][2] === 'f'){
                                        if(tab[k + 1][2] === 'f'){
                                            var obj=js_traiteInstruction1(tab,niveau,k + 1);
                                            if(obj.__xst === true){
                                                valeurCas=obj.__xva;
                                            }else{
                                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : ind ,"tab" : tab ,"__xme" : 'javascript dans bascule 0274'}));
                                            }
                                        }else{
                                            valeurCas=ma_cst_pour_javascript(tab[k + 1]).replace(/¶LF¶/g,'\n').replace(/¶CR¶/g,'\r');
                                        }
                                    }else if(tab[k][1] === 'faire' && tab[k][2] === 'f'){
                                        if(tab[k][8] >= 1){
                                            niveau+=2;
                                            var obj=js_tabTojavascript1(tab,k + 1,true,false,niveau);
                                            niveau-=2;
                                            if(obj.__xst === true){
                                                InstructionsCas=obj.__xva;
                                            }else{
                                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : k ,"tab" : tab ,"__xme" : 'javascript dans bascule 0287'}));
                                            }
                                        }else{
                                            InstructionsCas='';
                                        }
                                    }else{
                                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'javascript dans bascule 0293'}));
                                    }
                                }
                                valeursCase+=espacesn(true,niveau + 1);
                                if(valeurCas === null){
                                    valeursCase+='default:';
                                }else{
                                    valeursCase+='case ' + valeurCas + ' :';
                                }
                                if(InstructionsCas.length < 120){
                                    InstructionsCas=InstructionsCas.trim();
                                    valeursCase+=' ' + InstructionsCas;
                                }else{
                                    valeursCase+=InstructionsCas;
                                    valeursCase+=espacesn(true,niveau + 2);
                                }
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'javascript dans bascule 0307 '}));
                            }
                        }
                    }
                    t+=espcLigne;
                    t+='switch (' + valeurQuand + '){';
                    t+=valeursCase;
                    t+=espcLigne;
                    t+='}';
                    break;
                    
                case 'faire_tant_que' :
                    tabchoix=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'condition'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'instructions'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === '#' && tab[j][2] === 'f'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'la syntaxe de faire_tant_que est faire_tant_que(instructions(),conditions())'}));
                        }
                    }
                    var condition='';
                    var instructions='';
                    for( j=0 ; j < tabchoix.length ; j=j + 1 ){
                        if(tabchoix[j][1] === 'condition'){
                            obj=TraiteOperations2(tab,tabchoix[j][0],niveau + 1,0);
                            if(obj.__xst === true){
                                condition+=obj.__xva;
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '1 problème sur la condition du faire_tant_que en indice ' + tabchoix[j][0]}));
                            }
                        }else if(tabchoix[j][1] === 'instructions'){
                            if(tab[tabchoix[j][0]][8] === 0){
                                /* pas d'enfants, ne rien faire ! */
                            }else{
                                obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    instructions+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur les instructions du faire_tant_que en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }
                    }
                    t+=espcLigne;
                    t+='do{' + instructions + espcLigne + '}while(' + condition + ');';
                    break;
                    
                case 'tantQue' :
                    tabchoix=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'condition'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === '#' && tab[j][2] === 'f'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'la syntaxe de tantQue est incorrecte'}));
                        }
                    }
                    var condition='';
                    var faire='';
                    for( j=0 ; j < tabchoix.length ; j=j + 1 ){
                        if(tabchoix[j][1] === 'condition'){
                            niveau=niveau + 1;
                            obj=TraiteOperations2(tab,tabchoix[j][0],niveau,0);
                            niveau=niveau - 1;
                            if(obj.__xst === true){
                                condition+=obj.__xva;
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '1 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                            }
                        }else if(tabchoix[j][1] === 'faire'){
                            if(tab[tabchoix[j][0]][8] === 0){
                                /* pas d'enfants, ne rien faire ! */
                            }else{
                                obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    faire+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }
                    }
                    t+=espcLigne;
                    t+='while(' + condition + '){';
                    t+=faire;
                    t+=espcLigne;
                    t+='}';
                    break;
                    
                case 'boucle' :
                    tabchoix=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'condition'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'initialisation'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'increment'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === 'faire'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else if(tab[j][1] === '#' && tab[j][2] === 'f'){
                            tabchoix.push([j,tab[j][1],i]);
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0798 la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'}));
                        }
                    }
                    var initialisation='';
                    var condition='';
                    var increment='';
                    var faire='';
                    for( j=0 ; j < tabchoix.length ; j=j + 1 ){
                        if(tabchoix[j][1] === 'initialisation'){
                            if(tab[tabchoix[j][0]][8] === 0){
                                initialisation='';
                            }else{
                                obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,true,niveau + 1);
                                if(obj.__xst === true){
                                    obj.__xva=obj.__xva.replace(/,var /g,',');
                                    obj.__xva=obj.__xva.replace(/,let /g,',');
                                    initialisation+=obj.__xva;
                                    if(initialisation.substr(initialisation.length - 1,1) === ';'){
                                        initialisation=initialisation.substr(0,initialisation.length - 1);
                                    }
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }else if(tabchoix[j][1] === 'condition'){
                            if(tab[tabchoix[j][0]][8] === 0){
                                condition='';
                            }else{
                                obj=TraiteOperations2(tab,tabchoix[j][0],niveau + 1,0);
                                if(obj.__xst === true){
                                    condition+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '1 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }else if(tabchoix[j][1] === 'increment'){
                            if(tab[tabchoix[j][0]][8] === 0){
                                increment='';
                            }else{
                                obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,true,niveau + 1);
                                if(obj.__xst === true){
                                    increment+=obj.__xva;
                                    if(increment.substr(increment.length - 1,1) === ';'){
                                        increment=increment.substr(0,increment.length - 1);
                                    }
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }else if(tabchoix[j][1] === 'faire'){
                            if(tab[tabchoix[j][0]][8] === 0){
                                /* pas d'enfants, ne rien faire ! */
                            }else{
                                obj=js_tabTojavascript1(tab,tabchoix[j][0] + 1,dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    faire+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                        }
                    }
                    if(condition === '()'){
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
                    break;
                    
                case 'essayer' :
                    var contenu='';
                    var sierreur='';
                    var nomErreur='';
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'faire' && tab[j][2] === 'f'){
                            if(tab[j][8] > 0){
                                niveau=niveau + 1;
                                obj=js_tabTojavascript1(tab,j + 1,dansFonction,false,niveau);
                                niveau=niveau - 1;
                                if(obj.__xst === true){
                                    contenu+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'problème sur le contenu du "essayer" '}));
                                }
                            }
                        }else if(tab[j][1] === 'sierreur' && tab[j][2] === 'f'){
                            if(tab[j][8] === 2){
                                if(tab[j + 1][2] === 'c'){
                                    nomErreur=tab[j + 1][1];
                                    if(tab[j + 2][1] === 'faire' && tab[j + 2][2] === 'f'){
                                        if(tab[j + 2][8] === 0){
                                        }else{
                                            niveau=niveau + 1;
                                            obj=js_tabTojavascript1(tab,j + 3,dansFonction,false,niveau);
                                            niveau=niveau - 1;
                                            if(obj.__xst === true){
                                                sierreur+=obj.__xva;
                                            }else{
                                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'problème sur le "sierreur" du "essayer" '}));
                                            }
                                        }
                                    }else{
                                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'problème sur le "sierreur" le deuxième argiment doit être "faire"'}));
                                    }
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'problème sur le "sierreur" le premier argiment doit être une variable'}));
                                }
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'problème sur le "sierreur" du "essayer" il doit contenir 2 arguments sierreur(e,faire)'}));
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
                    break;
                    
                case 'choix' :
                    tabchoix=[];
                    var aDesSinonSi=false;
                    var aUnSinon=false;
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === 'si'){
                            tabchoix.push([j,tab[j][1],0,tab[j],0]);
                            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'alors'){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                            }
                        }else if(tab[j][1] === 'sinonsi'){
                            aDesSinonSi=true;
                            tabchoix.push([j,tab[j][1],0,tab[j],0]);
                            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'alors'){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                            }
                        }else if(tab[j][1] === 'sinon'){
                            aUnSinon=true;
                            tabchoix.push([j,tab[j][1],0,tab[j],0]);
                            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'alors'){
                                    tabchoix[tabchoix.length - 1][2]=k + 1;
                                    tabchoix[tabchoix.length - 1][4]=tab[k][8];
                                    break;
                                }
                            }
                        }else if(tab[j][1] === '#' && tab[j][2] === 'f'){
                            tabchoix.push([j,tab[j][1],0,tab[j]]);
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'la syntaxe de choix est choix(si(condition(),alors()),sinonsi(condition(),alors()),sinon(alors()))'}));
                        }
                    }
                    for( j=0 ; j < tabchoix.length ; j=j + 1 ){
                        if(tabchoix[j][1] === '#'){
                            var niveauSi=niveau + 2;
                            var k=j + 1;
                            for( k=j + 1 ; k < tabchoix.length ; k=k + 1 ){
                                if(tabchoix[k][1] === 'si'){
                                    niveauSi=niveau + 1;
                                    break;
                                }
                            }
                            if(tab[tabchoix[j][0]][13].indexOf('\n') >= 0){
                                t+=espacesn(true,niveauSi);
                            }
                            var commt=traiteCommentaire2(tab[tabchoix[j][0]][13],niveauSi,tabchoix[j][0]);
                            t+='/*' + commt + '*/';
                            if(tab[j][13].indexOf('\n') >= 0){
                                t+=espacesn(true,niveauSi);
                            }
                        }else if(tabchoix[j][1] === 'si'){
                            var tabComment=[];
                            var debutCondition=0;
                            var k=i + 1;
                            for( k=tabchoix[j][0] + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'condition'){
                                    debutCondition=k;
                                    break;
                                }else if(tab[k][1] === '#' && tab[k][2] === 'f'){
                                    tabComment.push(tab[k][13]);
                                }
                            }
                            if(debutCondition === 0){
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0784 la condition est manquante dans un si'}));
                            }
                            for( k=0 ; k < tabComment.length ; k=k + 1 ){
                                if(tabComment[k].indexOf('\n') >= 0){
                                    t+=espacesn(true,niveau + 1);
                                }
                                var commt=traiteCommentaire2(tabComment[k],niveau + 1,tabchoix[j][0]);
                                t+='/*' + commt + '*/';
                                if(tabComment[k].indexOf('\n') >= 0){
                                    t+=espacesn(true,niveau + 1);
                                }
                            }
                            t+=espcLigne;
                            t+='if(';
                            obj=TraiteOperations2(tab,debutCondition,niveau + 1,0);
                            if(obj.__xst === true){
                                if(tab[debutCondition + 1][8] >= 5){
                                    /*
                                      on a une suite de et/ou 
                                      todo0861 remplacer ça 
                                    */
                                    obj.__xva=obj.__xva.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                                    t+=obj.__xva;
                                    t+='){';
                                }else{
                                    if(obj.__xva.length > 120 && obj.__xva.indexOf('\n') < 0){
                                        /*
                                          on a une suite de et/ou 
                                          todo0870 remplacer ça 
                                        */
                                        obj.__xva=obj.__xva.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                                        t+=obj.__xva;
                                        t+=espcLigne + '){';
                                    }else{
                                        t+=obj.__xva;
                                        t+='){';
                                    }
                                }
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '2 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                            }
                            if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                niveau=niveau + 1;
                                obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
                                niveau=niveau - 1;
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors du choix en indice ' + tabchoix[j][0]}));
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
                            var tabComment=[];
                            var debutCondition=0;
                            for( k=tabchoix[j][0] + 1 ; k < l01 ; k=tab[k][12] ){
                                if(tab[k][1] === 'condition'){
                                    debutCondition=k;
                                    break;
                                }else if(tab[k][1] === '#' && tab[k][2] === 'f'){
                                    tabComment.push(tab[k][13]);
                                }
                            }
                            if(debutCondition === 0){
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0858 la condition est manquante dans un sinonsi'}));
                            }
                            for( k=0 ; k < tabComment.length ; k=k + 1 ){
                                if(tabComment[k].indexOf('\n') >= 0){
                                    t+=espacesn(true,niveau + 1);
                                }
                                var commt=traiteCommentaire2(tabComment[k],niveau + 1,tabchoix[j][0]);
                                t+='/*' + commt + '*/';
                                if(tabComment[k].indexOf('\n') >= 0){
                                    t+=espacesn(true,niveau + 1);
                                }
                            }
                            t+=espcLigne;
                            t+='}else if(';
                            obj=TraiteOperations2(tab,debutCondition,niveau + 1,0);
                            if(obj.__xst === true){
                                if(tab[debutCondition + 1][8] >= 5){
                                    /*
                                      on a une suite de et/ou 
                                    */
                                    obj.__xva=obj.__xva.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                                    t+=obj.__xva + '){';
                                }else{
                                    if(obj.__xva.length > 120 && obj.__xva.indexOf('\n') < 0){
                                        obj.__xva=obj.__xva.replace(/ \|\| /g,espcLigne + ' || ').replace(/ && /g,espcLigne + ' && ');
                                        t+=obj.__xva;
                                        t+=espcLigne + '){';
                                    }else{
                                        t+=obj.__xva + '){';
                                    }
                                }
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : '3 problème sur la condition du choix en indice ' + tabchoix[j][0]}));
                            }
                            if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                            if(aUnSinon){
                            }else{
                                if(j === tabchoix.length - 1){
                                    t+=espcLigne;
                                    t+='}';
                                }
                            }
                        }else{
                            t+=espcLigne;
                            t+='}else{';
                            if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau + 1);
                                if(obj.__xst === true){
                                    t+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tabchoix[j][0] ,"tab" : tab ,"__xme" : 'problème sur le alors du choix en indice ' + tabchoix[j][0]}));
                                }
                            }
                            t+=espcLigne;
                            t+='}';
                        }
                    }
                    break;
                    
                case 'affecteFonction' :
                    if(tab[i + 1][2] === 'c' && tab[i][8] >= 2){
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'}));
                    }
                    if(tab[i + 2][2] === 'f' && tab[i + 2][1] === 'appelf' && tab[i][8] >= 2){
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'}));
                    }
                    obj=js_traiteAppelFonction(tab,i + 2,true,niveau,false,'');
                    if(obj.__xst === true){
                        t+=espcLigne;
                        t+='' + (tab[i + 1][1]) + '=' + obj.__xva + '' + terminateur;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'il faut un nom de fonction à appeler n(xxxx)'}));
                    }
                    break;
                    
                case 'affecte' : 
                case 'dans' : 
                case 'de' : 
                case 'affectop' :
                    var obj=js_traite_affecte(tab,i,niveau,dansInitialisation,terminateur,espcLigne);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1318 affecte'}));
                    }
                    break;
                    
                case 'declare' : 
                case 'declare_constante' : 
                case 'declare_variable' : 
                case 'variable_privée' : 
                case 'variable_publique' :
                    t+=espcLigne;
                    var tabdeclare=[];
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][1] === '#' && tab[j][2] === 'f'){
                        }else{
                            tabdeclare.push(tab[j]);
                        }
                    }
                    if(tabdeclare.length === 2){
                        var prefixe_declaration='var ';
                        if("declare" === tab[i][1]){
                            prefixe_declaration='var ';
                        }else if("declare_constante" === tab[i][1]){
                            prefixe_declaration='const ';
                        }else if("declare_variable" === tab[i][1]){
                            prefixe_declaration='let ';
                        }else if("variable_privée" === tab[i][1]){
                            prefixe_declaration='#';
                        }else if("variable_publique" === tab[i][1]){
                            prefixe_declaration='';
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '0965 prefixe déclaration inconnu "' + tab[i][1] + '"'}));
                        }
                        var debut='';
                        var obj=js_traiteInstruction1(tab,niveau,tabdeclare[0][0]);
                        if(obj.__xst === true){
                            debut=prefixe_declaration + obj.__xva;
                        }else{
                            logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0937 js_tabTojavascript1 "' + (tab[tabdeclare[1][0]][1]) + '"'});
                        }
                        var obj=js_traiteInstruction1(tab,niveau,tabdeclare[1][0]);
                        if(obj.__xst === true){
                            if(obj.__xva === ''){
                                t+=debut + terminateur;
                            }else{
                                if(obj.__xva.endsWith(';') && terminateur === ';'){
                                    t+=debut + '=' + obj.__xva;
                                }else{
                                    t+=debut + '=' + obj.__xva + terminateur;
                                }
                            }
                        }else{
                            logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0937 js_tabTojavascript1 "' + (tab[tabdeclare[1][0]][1]) + '"'});
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans une déclaration 0996, declare  doit avoir 2 paramètres'}));
                    }
                    break;
                    
                case '#' :
                    t+=espcLigne;
                    var commt=traiteCommentaire2(tab[i][13],niveau,i);
                    t+='/*' + commt + '*/';
                    break;
                    
                case 'postinc' : 
                case 'postdec' : 
                case 'preinc' : 
                case 'predec' :
                    if(!(dansInitialisation)){
                        t+=espcLigne;
                    }
                    if(tab[i + 1][2] === 'c' && tab[i][8] === 1){
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
                        if(!(dansInitialisation)){
                            t+='' + terminateur;
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans un postinc'}));
                    }
                    break;
                    
                case 'throw' :
                    /* todo trouver un mot pour throw */
                    if(!(dansInitialisation)){
                        t+=espcLigne;
                    }
                    if(tab[i + 1][1] === 'new'){
                        var obj=js_traite_new(tab,i + 1,niveau);
                        if(obj.__xst === true){
                            t+='throw ' + obj.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans une déclaration'}));
                        }
                        if(tab[i + 1][8] === 1 && tab[i + 2][1] === 'appelf'){
                            obj=js_traiteAppelFonction(tab,i + 2,true,niveau,false,'');
                        }
                    }else if((tab[i + 1][1] === 'virgule' || 'testEnLigne' === tab[i + 1][1]) && tab[i + 1][2] === 'f'){
                        var objOperation=TraiteOperations2(tab,tab[i + 1][0],niveau,0);
                        if(objOperation.__xst === true){
                            t+='throw ' + objOperation.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur 1371 sur throw '}));
                        }
                    }else if(tab[i + 1][1] === 'appelf' && tab[i + 1][2] === 'f'){
                        obj=js_traiteAppelFonction(tab,i + 1,true,niveau,false,'');
                        if(obj.__xst === true){
                            t+='throw ' + obj.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans une déclaration'}));
                        }
                    }else if(tab[i + 1][2] === 'c'){
                        t+='throw ' + ma_cst_pour_javascript(tab[i + 1]);
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans throw 1040'}));
                    }
                    if(!(dansInitialisation)){
                        t+=terminateur;
                    }
                    break;
                    
                case 'supprimer' :
                    t+=espcLigne;
                    if(tab[i + 1][8] === 0 && tab[i + 1][2] === 'c'){
                        t+='delete ' + (tab[i + 1][1]) + '' + terminateur;
                    }else{
                        var objtestLi=js_traiteInstruction1(tab,niveau,i + 1);
                        if(objtestLi.__xst === true){
                            t+='delete ' + objtestLi.__xva + '' + terminateur;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans supprimer 0955'}));
                        }
                    }
                    break;
                    
                case 'new' :
                    var obj=js_traite_new(tab,id,niveau);
                    if(obj.__xst === true){
                        if(!(dansInitialisation)){
                            t+=espcLigne;
                        }
                        t+=obj.__xva + terminateur;
                        if(!(dansInitialisation)){
                            t+=terminateur;
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur dans une déclaration'}));
                    }
                    break;
                    
                case 'defTab' :
                    obj=js_traiteDefinitionTableau(tab,i,niveau,{});
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur js_tabTojavascript1 1037'}));
                    }
                    break;
                    
                case 'void' :
                    var objtestLi=js_traiteInstruction1(tab,niveau,i + 1);
                    if(objtestLi.__xst === true){
                        t+='void(' + objtestLi.__xva + ')';
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur js_tabTojavascript1 1047'}));
                    }
                    break;
                    
                case 'inf' : 
                case 'sup' : 
                case 'egalstricte' : 
                case 'testEnLigne' : 
                case 'condition' :
                    var objtestLi=js_traiteInstruction1(tab,niveau,i);
                    if(objtestLi.__xst === true){
                        if(!(dansInitialisation)){
                            t+=espcLigne;
                        }
                        if(terminateur === ''){
                            t+='(' + objtestLi.__xva + ')';
                        }else{
                            t+=objtestLi.__xva + terminateur;
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur js_tabTojavascript1 1056'}));
                    }
                    break;
                    
                case "definition_de_classe" :
                    var objtestLi=js_traiteInstruction1(tab,niveau,i);
                    if(objtestLi.__xst === true){
                        t+='' + objtestLi.__xva;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : nl1()}));
                    }
                    break;
                    
                case "exporter" :
                    if(tab[i][8] === 1 && "nom_de_classe" === tab[i + 1][1] && tab[i + 1][8] === 1){
                        t+=espcLigne;
                        t+='export{' + (tab[i + 2][1]) + '}' + terminateur;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : (nl1() + tab[i][1]) + '  le format doit être "exporter(nom_de_classe(xxx))"'}));
                    }
                    break;
                    
                case "directive" :
                    if(tab[i][8] === 1 && tab[i + 1][2] === 'c'){
                        t+=ma_cst_pour_javascript(tab[i + 1]) + ';' + espcLigne;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : nl1() + ' un seul argument pour directive '}));
                    }
                    break;
                    
                case "non" :
                    /*
                      dans le cas d'un !function(){} !!! si si , ça existe !!!
                    */
                    var objtestLi=js_tabTojavascript1(tab,i + 1,false,true,niveau,false);
                    if(objtestLi.__xst === true){
                        if(objtestLi.__xva.substr(0,2) === CRLF){
                            objtestLi.__xva=objtestLi.__xva.substr(2);
                        }
                        t+='!' + objtestLi.__xva;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur js_tabTojavascript1 1647'}));
                    }
                    break;
                    
                case "obj" :
                    obj=js_traiteDefinitionObjet(tab,i + 1,true,niveau);
                    if(obj.__xst === true){
                        t+=obj.__xva + terminateur;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans js_tabTojavascript1 Objet il y a un problème'}));
                    }
                    break;
                    
                case "etiquette" :
                    var nom_etiquette='';
                    var contenu_etiquette='';
                    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][2] === 'c'){
                            nom_etiquette=tab[j][1];
                        }else if(tab[j][1] === 'contenu' && tab[j][2] === 'f'){
                            if(tab[j][8] > 0){
                                var obj=js_tabTojavascript1(tab,j + 1,false,false,niveau + 1);
                                if(obj.__xst === true){
                                    contenu_etiquette+=obj.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'javascript.js traitement etiquette contenu mauvais ' + JSON.stringify(tab[i])}));
                                }
                            }
                        }
                    }
                    if(nom_etiquette !== ''){
                        t+=espcLigne;
                        t+=nom_etiquette + ':' + contenu_etiquette;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'javascript.js traitement etiquette contenu mauvais ' + JSON.stringify(tab[i])}));
                    }
                    break;
                    
                case "importer" :
                    t+=espcLigne;
                    var obj=js_traite_import(tab,i,niveau,dansInitialisation,terminateur,espcLigne);
                    if(obj.__xst === true){
                        t+=obj.__xva;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'javascript.js traitement importer ' + JSON.stringify(tab[i])}));
                    }
                    if(!(dansInitialisation)){
                        t+=terminateur;
                    }
                    break;
                    
                case "" :
                    /* un bloc, ça arrive de temps en temps */
                    var obj=js_tabTojavascript1(tab,i + 1,false,false,niveau + 1,false);
                    if(obj.__xst === true){
                        t+=espcLigne + '{' + obj.__xva + espcLigne + '}';
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1210 javascript.js traitement bloc ' + JSON.stringify(tab[i])}));
                    }
                    break;
                    
                default:
                    /* en dernier lieu, on teste une opération */
                    var objOperation=TraiteOperations2(tab,i,niveau + 1,0);
                    if(objOperation.__xst === true){
                        if(dansInitialisation === true
                         || objOperation.hasOwnProperty('annuler_terminateur')
                         && objOperation.annuler_terminateur === true
                        ){
                            t+=objOperation.__xva;
                        }else{
                            if(terminateur === ';'){
                                /* de temps en temps, on a une opération directe comme par exemple : aa && b(); */
                                t+=espcLigne;
                            }
                            t+=objOperation.__xva + terminateur;
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'javascript.js traitement non prévu 1057 ' + JSON.stringify(tab[i])}));
                    }
                    break;
                    
            }
        }
    }
    if(t !== ''
     && dansInitialisation === true
     && "initialisation" === tab[tab[id][7]][1]
     && tab[id][8] > 1
     && t.substr(0,1) === ','
    ){
        t=t.substr(1);
    }
    if(t.length > 4 && t.substr(0,4) === CRLF + CRLF){
        t=t.substr(2);
    }
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function js_traite_import(tab,id,niveau,dansInitialisation,terminateur,espcLigne){
    const l01=tab.length;
    let t='';
    let j=0;
    let obj=null;
    let specifie='';
    let provenance='';
    let par_defaut='';
    let espace_de_noms='';
    for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === '#' && tab[j][2] === 'f'){
        }else if(tab[j][1] === 'provenance'){
            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                provenance+=ma_cst_pour_javascript(tab[j + 1]);
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1201 js_traite_import '}));
            }
        }else if(tab[j][1] === 'espace_de_noms'){
            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                espace_de_noms+=ma_cst_pour_javascript(tab[j + 1]);
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1222 js_traite_import '}));
            }
        }else if(tab[j][1] === 'bibliotheque_spécifiée'){
            if(specifie !== ''){
                specifie+=' , ';
            }
            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                specifie+=ma_cst_pour_javascript(tab[j + 1]);
            }else if(tab[j][8] === 2 && tab[j + 1][2] === 'c' && tab[j + 2][2] === 'c'){
                specifie+=ma_cst_pour_javascript(tab[j + 1]) + ' as ' + ma_cst_pour_javascript(tab[j + 2]);
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1200 js_traite_import '}));
            }
        }else if(tab[j][1] === 'bibliotheque_par_défaut'){
            if(par_defaut !== ''){
                par_defaut+=' , ';
            }
            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                par_defaut+=ma_cst_pour_javascript(tab[j + 1]);
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1229 js_traite_import '}));
            }
        }else{
            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1195 js_traite_import '}));
        }
    }
    t+='import ' + (espace_de_noms !== '' ?
      ( 
            ' * as ' + espace_de_noms + '' + (par_defaut !== '' || specifie !== '' ? ( ' , ' ) : ( '' )) )
    : ( '' 
    )) + (par_defaut !== '' ?
      ( 
            ' ' + par_defaut + ' ' + (specifie !== '' ? ( ' , ' ) : ( '' )) )
    : ( '' 
    )) + (specifie !== '' ? ( '{' + specifie + '}' ) : ( '' )) + ' from ' + provenance;
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function js_traite_affecte(tab,i,niveau,dansInitialisation,terminateur,espcLigne){
    const l01=tab.length;
    var t='';
    var tabAffecte={};
    var signe='=';
    var numeroPar=0;
    var j=0;
    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === '#' && tab[j][2] === 'f'){
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
    if(tab[i][1] === 'de'){
        signe=' of ';
    }else if(tab[i][1] === 'dans'){
        signe=' in ';
    }else if(tab[i][1] === 'affecte'){
        signe='=';
    }
    if(!(dansInitialisation)){
        t+=espcLigne;
    }
    if(!(tabAffecte['par1'])){
        debugger;
    }
    var objInstructionGauche=js_traiteInstruction1(tab,niveau,tabAffecte['par0'][0]);
    if(objInstructionGauche.__xst === true){
        var objInstructionDroite=js_traiteInstruction1(tab,niveau,tabAffecte['par1'][0]);
        if(objInstructionDroite.__xst === true){
            /*
              on écrit l'affectation ici 
            */
            if(signe === '='
             && objInstructionGauche.__xva === objInstructionDroite.__xva.substr(0,objInstructionGauche.__xva.length)
             && objInstructionDroite.__xva.substr(objInstructionGauche.__xva.length,1) === '+'
            ){
                var droite=objInstructionDroite.__xva.substr(objInstructionGauche.__xva.length + 1);
                if(droite.substr(0,1) === '('
                 && droite.substr(droite.length - 1,1) === ')'
                 && tab[tabAffecte['par1'][0]][1] !== 'condition'
                ){
                    droite=droite.substr(1,droite.length - 2);
                }
                t+='' + objInstructionGauche.__xva + '+=' + droite;
            }else{
                var droite=objInstructionDroite.__xva;
                t+=objInstructionGauche.__xva + signe + droite;
            }
            if(tabAffecte['par2']){
                if(tabAffecte['par2'][1] === 'prop'){
                    if(tabAffecte['par2'][2] === 'f'){
                        if(tab[tabAffecte['par2'][0] + 1][2] === 'c'){
                            t='(' + t + ').' + (tab[tabAffecte['par2'][0] + 1][1]);
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1610 dans js_traite_affecte '}));
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1613 dans js_traite_affecte '}));
                    }
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1616 dans js_traite_affecte '}));
                }
            }
            if(!(dansInitialisation)){
                if(t.endsWith(';') && terminateur === ';'){
                    /*#
                      a.b=((e,t) => { return 2})(t.value,n);;
                      il faur enlever le double ;; à la fin
                    */
                }else{
                    t+='' + terminateur;
                }
            }
        }else{
            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1611 dans js_traite_affecte de "affecte" ou "dans" '}));
        }
    }else{
        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans appelf de "affecte" ou "dans" 0805 '}));
    }
    return({"__xst" : true ,"__xva" : t});
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
    var contient_un_tbel=false;
    var precedent_est_commentaire=false;
    var proprietes='';
    var nombre_de_parametres=0;
    var nombre_de_proprietes=0;
    var seule_propriete='';
    var comptage=0;
    for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === '#' && tab[j][2] === 'f'){
            if(tab[j][13].indexOf('tbel') >= 0){
                mettre_des_sauts=false;
                contient_un_tbel=true;
            }else{
                mettre_des_sauts=true;
            }
            break;
        }
    }
    if(tab[id][8] > 5 && contient_un_tbel === false){
        mettre_des_sauts=true;
    }
    for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][7] === id){
            if(tab[j][1] === 'p' && tab[j][2] === 'f'){
                nombre_de_parametres++;
                var k=j + 1;
                for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                    if(tab[k][7] === j){
                        if(tab[k][1] === '#' && tab[k][2] === 'f'){
                            mettre_des_sauts=true;
                            textObj+=espacesn(true,niveau + 1);
                            var commt=traiteCommentaire2(tab[k][13],niveau,j);
                            textObj+='/*' + commt + '*/';
                        }else{
                            obje=js_traiteInstruction1(tab,niveau + 2,k);
                            if(obje.__xst === true){
                                if(precedent_est_commentaire === true){
                                    precedent_est_commentaire=false;
                                }else{
                                    textObj+=',';
                                }
                                if(mettre_des_sauts){
                                    textObj+=espacesn(true,niveau + 1);
                                }
                                textObj+=obje.__xva;
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'js_traiteDefinitionTableau 1140 '}));
                            }
                            if(tab[k][2] === 'c'){
                                seule_propriete=ma_cst_pour_javascript(tab[k]);
                            }
                        }
                    }
                }
            }else if(tab[j][1] === 'prop' && tab[j][2] === 'f'){
                nombre_de_proprietes++;
                if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                    proprietes+='.' + ma_cst_pour_javascript(tab[j + 1]);
                }else{
                    if(tab[j][8] === 1 && tab[j + 1][2] === 'f'){
                        if(tab[j + 1][1] === 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=js_traiteAppelFonction(tab,j + 1,true,niveau,true,'');
                            if(obj.__xst === true){
                                proprietes+='.' + obj.__xva;
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1359 erreur dans js_traiteDefinitionTableau'}));
                            }
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1361 erreur dans js_traiteDefinitionTableau ' + tab[j][1]}));
                        }
                    }
                }
            }else if(tab[j][1] === '#' && tab[j][2] === 'f'){
                textObj+=espacesn(true,niveau + 1);
                var commt=traiteCommentaire2(tab[j][13],niveau,j);
                textObj+='/*' + commt + '*/';
                precedent_est_commentaire=true;
            }
            comptage++;
            if(contient_un_tbel){
                if(comptage % 20 === 0){
                    textObj+=espacesn(true,niveau + 1);
                }else if(comptage % 10 === 0){
                    textObj+='                ';
                }
            }
        }
    }
    if(nombre_de_parametres === 1 && nombre_de_proprietes === 0 && seule_propriete !== '' && isNumeric(seule_propriete)){
        if(tab[tab[id][7]][1] === 'new' && tab[tab[id][7]][2] === 'f'){
            t='Array(' + seule_propriete + ')';
        }else{
            t='new Array(' + seule_propriete + ')';
        }
    }else{
        t+='[';
        if(textObj.length > 1){
            t+=textObj.substr(1);
        }
        if(mettre_des_sauts){
            t+=espacesn(true,niveau);
        }
        t+=']' + proprietes;
    }
    return({"__xst" : true ,"__xva" : t});
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
    var proprietesTableau='';
    var nbEnfants=0;
    var forcerNvelleLigneEnfant=false;
    var termineParUnePropriete=false;
    positionAppelTableau=-1;
    for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === 'nomt' && tab[j][2] === 'f'){
            positionAppelTableau=j;
            if(tab[j][8] === 0){
                /* le nom tableau peut être vide dans le cas ou on a a ?. [b] */
                nomTableau='';
            }else{
                var obj1=js_traiteInstruction1(tab,niveau,j + 1);
                if(obj1.__xst === true){
                    nomTableau=obj1.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '864 js_traiteTableau1 nomt'}));
                }
            }
            break;
        }
    }
    if(positionAppelTableau > 0){
        for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
            if(tab[j][2] === 'f'){
                if(tab[j][1] === 'nomt' || tab[j][1] === 'p' || tab[j][1] === '#' || tab[j][1] === 'prop'){
                    continue;
                }else{
                    logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1361 js_traiteTableau1 les seuls paramètres de tableau sont nomt,p,prop "' + tab[j][1] + '"'});
                }
            }
        }
        argumentsFonction='';
        for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
            if(tab[j][1] === 'p'){
                if(tab[j][8] === 0 && tab[j + 1][2] === 'f'){
                    argumentsFonction+=',';
                }else if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                    argumentsFonction+='[' + ma_cst_pour_javascript(tab[j + 1]) + ']';
                }else if(tab[j][8] > 1 && tab[j + 1][2] === 'c'){
                    for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                        if(nomTableau === 'concat'){
                            if(tab[k][1] === '+'){
                                argumentsFonction+=',';
                            }else{
                                argumentsFonction+=ma_cst_pour_javascript(tab[k]);
                            }
                        }else{
                            debugger;
                        }
                    }
                }else{
                    if(tab[j][8] === 1 && tab[j + 1][1] === 'obj'){
                        obj=js_traiteDefinitionObjet(tab,j + 1,true,niveau);
                        if(obj.__xst === true){
                            argumentsFonction+='[' + obj.__xva + ']';
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'dans js_traiteTableau1 Objet il y a un problème'}));
                        }
                    }else if(tab[j][8] === 1 && tab[j + 1][2] === 'f'){
                        if(tab[j + 1][1] === 'p'){
                            obj=js_tabTojavascript1(tab,j + 1,false,false,niveau);
                            if(obj.__xst === true){
                                if(nomTableau === 'Array' && nbEnfants >= 4){
                                    forcerNvelleLigneEnfant=true;
                                }
                                argumentsFonction+='[' + obj.__xva + ']';
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else if(tableau_des_opérateurs_js.hasOwnProperty(tab[j + 1][1])){
                            var objOperation=TraiteOperations2(tab,j + 1,niveau,0);
                            if(objOperation.__xst === true){
                                var droite=objOperation.__xva;
                                argumentsFonction+='[' + droite + ']';
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur 1421 js_traiteTableau1 sur des opérations '}));
                            }
                        }else{
                            debugger;
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur js_traiteTableau1 1145 pour ' + (tab[j + 1][1])}));
                        }
                    }
                }
            }else if(tab[j][1] === 'prop'){
                termineParUnePropriete=true;
                if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                    proprietesTableau+='.' + ma_cst_pour_javascript(tab[j + 1]);
                }else{
                    if(tab[j][8] === 1 && tab[j + 1][2] === 'f'){
                        if(tab[j + 1][1] === 'appelf'){
                            obj=js_traiteAppelFonction(tab,j + 1,true,niveau,true,'');
                            if(obj.__xst === true){
                                proprietesTableau+='.' + obj.__xva;
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue ' + tab[j][1]}));
                        }
                    }
                }
            }
        }
        t+=nomTableau;
        t+=argumentsFonction;
        t+=proprietesTableau;
        if(!(dansConditionOuDansFonction)){
            t+='' + terminateur;
        }
    }else{
        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : ' dans js_traiteTableau1 1024 il faut un nom de tableau nomt(xxxx)'}));
    }
    return({"__xst" : true ,"__xva" : t ,"forcerNvelleLigneEnfant" : forcerNvelleLigneEnfant ,"termineParUnePropriete" : termineParUnePropriete});
}
/*
  =====================================================================================================================
*/
function js_traite_new(tab,id,niveau){
    var valeur='';
    var props='';
    var t='';
    var l01=tab.length;
    for( var i=id + 1 ; i < l01 ; i=tab[i][12] ){
        if(tab[i][2] === 'c'){
            valeur+=ma_cst_pour_javascript(tab[i]);
        }else if(tab[i][1] === 'appelf' && tab[i][2] === 'f'){
            var obj=js_traiteAppelFonction(tab,i,true,niveau,false,'');
            /* ✍ tab,id,dansConditionOuDansFonction,niveau,recursif,nom_de_la_fonction_parente */
            if(obj.__xst === true){
                valeur+=obj.__xva;
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1694 js_traite_new'}));
            }
        }else if(tab[i][1] === 'defTab' && tab[i][2] === 'f'){
            var obj1=js_traiteDefinitionTableau(tab,i,niveau,{});
            if(obj1.__xst === true){
                if(obj1.__xva.startsWith('[') && obj1.__xva.endsWith(']')){
                    debugger;
                    if(obj1.__xva.trim().replace(/\r/g,'').replace(/\n/g,'') === '[]'){
                        valeur+='[]';
                    }else{
                        valeur+='Array(' + obj1.__xva.substr(1,obj1.__xva.length - 2) + ')';
                    }
                }else{
                    valeur+=obj1.__xva;
                }
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '0803 js_traiteInstruction1 new'}));
            }
        }else if(tab[i][1] === 'prop' && tab[i][2] === 'f'){
            for( var j=i + 1 ; j < l01 ; j=tab[j][12] ){
                var obj2=js_traiteInstruction1(tab,niveau,j);
                if(obj2.__xst === true){
                    props+='.' + obj2.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1703 js_traite_new propriété : "' + tab[j][1] + '"'}));
                }
            }
        }else{
            return(logerreur({"__xst" : false ,"id" : id ,"tab" : tab ,"__xme" : '1699 js_traite_new element non prévu : "' + tab[i][1] + '"'}));
        }
    }
    if(valeur + props === '[]'){
        return({"__xst" : true ,"__xva" : '[]'});
    }else{
        if(props !== ''){
            t='(new ' + valeur + ')' + props;
        }else{
            t='new ' + valeur;
        }
        return({"__xst" : true ,"__xva" : t});
    }
}
/*
  =====================================================================================================================
*/
function js_traiteInstruction1(tab,niveau,id){
    const l01=tab.length;
    var t='';
    if(tab[id][2] === 'c'){
        t+=ma_cst_pour_javascript(tab[id]);
    }else{
        /* c'est une 'f' */
        switch (tab[id][1]){
            case '#' : t+='/*' + traiteCommentaire2(tab[id][13],niveau + 1,id) + '*/';
                break;
            case 'appelf' :
                var obj=js_traiteAppelFonction(tab,tab[id][0],true,niveau,false,'');
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans js_traiteInstruction1 1043 '}));
                }
                break;
                
            case 'testEnLigne' :
                var si_faux='';
                var si_vrai='';
                var testlignecondition='';
                var un_trop_long=false;
                var j=id + 1;
                for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
                    if(tab[j][1] === 'condition'){
                        var objCondition=TraiteOperations2(tab,j,niveau + 1,0);
                        if(objCondition.__xst === true){
                            testlignecondition=objCondition.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1 js_traiteInstruction1 sur testEnLigne 2297 '}));
                        }
                    }else if(tab[j][1] === 'siVrai'){
                        var obj_si=js_tabTojavascript1(tab,j + 1,true,true,niveau,false);
                        if(obj_si.__xst === true){
                            if(obj_si.__xva.length > 50){
                                var obj_si=js_tabTojavascript1(tab,j + 1,false,false,niveau + 2,false);
                                /* tab,id,dansFonction,dansInitialisation,niveau,dansCascade */
                                if(obj_si.__xva.endsWith(';')){
                                    obj_si.__xva=obj_si.__xva.substr(0,obj_si.__xva.length - 1);
                                    un_trop_long=true;
                                }
                            }
                            if(si_vrai !== ''){
                                si_vrai+=' , ';
                            }
                            si_vrai+=obj_si.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1 js_traiteInstruction1 sur testEnLigne 2316 '}));
                        }
                    }else if(tab[j][1] === 'siFaux'){
                        var obj_si=js_tabTojavascript1(tab,j + 1,true,true,niveau,false);
                        if(obj_si.__xst === true){
                            if(obj_si.__xva.length > 50){
                                var obj_si=js_tabTojavascript1(tab,j + 1,false,false,niveau + 2,false);
                                /* tab,id,dansFonction,dansInitialisation,niveau,dansCascade */
                                if(obj_si.__xva.endsWith(';')){
                                    obj_si.__xva=obj_si.__xva.substr(0,obj_si.__xva.length - 1);
                                    un_trop_long=true;
                                }
                            }
                            if(si_faux !== ''){
                                si_faux+=' , ';
                            }
                            si_faux+=obj_si.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1 js_traiteInstruction1 sur testEnLigne 2334 '}));
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'la syntaxe de test en ligne est  testEnLigne(condition(),siVrai(),siFaux())'}));
                    }
                }
                if(un_trop_long === true){
                    t=testlignecondition + ' ?' + espacesn(true,niveau) + '  ( ' + si_vrai + ' )' + espacesn(true,niveau) + ': ( ' + si_faux + ' ' + espacesn(true,niveau) + ')';
                }else{
                    t=testlignecondition + ' ? ( ' + si_vrai + ' ) : ( ' + si_faux + ' )';
                }
                break;
                
            case 'obj' :
                var obj=js_traiteDefinitionObjet(tab,id,true,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur sur js_traiteInstruction1 1064 '}));
                }
                break;
                
            case 'new' :
                var obj=js_traite_new(tab,id,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1723 erreur sur js_traiteInstruction1 pour new '}));
                }
                break;
                
            case 'definition_de_classe' :
                var obj=js_traiteDefinitionClasse(tab,id,niveau);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur sur js_traiteInstruction1 1064 '}));
                }
                break;
                
            case 'declare' :
                if(tab[tab[id][7]][1] === 'dans'){
                    for( var j=id + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][2] === 'c'){
                            return({"__xst" : true ,"__xva" : 'var ' + ma_cst_pour_javascript(tab[j])});
                        }
                    }
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1704 erreur sur js_traiteInstruction1 pour ' + tab[id][1]}));
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1644 erreur sur js_traiteInstruction1 pour ' + tab[id][1]}));
                }
                break;
                
            case 'declare_variable' : 
            case 'declare_constante' :
                var type='';
                if(tab[id][1] === 'declare_constante'){
                    type='const';
                }else{
                    type='let';
                }
                if(tab[tab[id][7]][1] === 'de'){
                    for( var j=id + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][2] === 'c'){
                            return({"__xst" : true ,"__xva" : type + ' ' + ma_cst_pour_javascript(tab[j])});
                        }
                    }
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1717 erreur sur js_traiteInstruction1 pour ' + tab[id][1]}));
                }else if(tab[tab[id][7]][1] === 'dans'){
                    for( var j=id + 1 ; j < l01 ; j=tab[j][12] ){
                        if(tab[j][2] === 'c'){
                            return({"__xst" : true ,"__xva" : type + ' ' + ma_cst_pour_javascript(tab[j])});
                        }
                    }
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2439 erreur sur js_traiteInstruction1 pour ' + tab[id][1]}));
                }else{
                    debugger;
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2432 erreur sur js_traiteInstruction1 pour ' + tab[id][1]}));
                }
                break;
                
            case '' :
                var obj=js_tabTojavascript1(tab,id + 1,true,true,niveau + 1,false);
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1736 erreur js_traiteInstruction1 '}));
                }
                break;
                
            case 'null' : t+='';
                break;
            case 'await' :
                t+='await ';
                obj=js_traiteAppelFonction(tab,id + 1,true,niveau,false,'');
                if(obj.__xst === true){
                    t+=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '1815 js_traiteInstruction1 await'}));
                }
                break;
                
            default:
                if(tableau_des_opérateurs_js.hasOwnProperty(tab[id][1])){
                    var obj=TraiteOperations2(tab,tab[id][0],niveau,0);
                    if(obj.__xst === false){
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur js_traiteInstruction1 2268'}));
                    }
                    t+='' + obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : nl1() + ' "' + tab[id][1] + '"'}));
                }
                
        }
    }
    return({"__xst" : true ,"__xva" : t});
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
    var etend='';
    for( i=id + 1 ; i < l01 ; i=tab[i][12] ){
        if(tab[i][1] === 'nom_classe' && tab[i][2] === 'f'){
            for( j=i + 1 ; j < l01 ; j=tab[j][12] ){
                if(tab[j][2] === 'c'){
                    nom_classe=tab[j][1];
                }else{
                    if(tab[j][1] === 'étend' && tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1808 js_traiteDefinitionClasse "' + tab[j][1] + '" inconnu'}));
                    }
                }
            }
        }else if(tab[i][1] === 'contenu' && tab[i][2] === 'f'){
            if(tab[i][8] === 0){
                contenu_classe+='';
            }else{
                var obj=js_tabTojavascript1(tab,i + 1,false,false,niveau + 1);
                if(obj.__xst === true){
                    contenu_classe+=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1866 js_traiteDefinitionClasse '}));
                }
            }
        }else if(tab[i][1] === 'étend' && tab[i][2] === 'f' && tab[i][8] === 1 && tab[i + 1][2] === 'c'){
            etend=' extends ' + (tab[i + 1][1]);
        }else{
            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '1819 js_traiteDefinitionClasse "' + tab[i][1] + '" inconnu'}));
        }
    }
    t+=espacesn(true,niveau);
    t+='class ' + nom_classe + etend + '{';
    t+=contenu_classe;
    t+=espacesn(true,niveau);
    t+='}';
    return({"__xst" : true ,"__xva" : t});
}
/*
  =====================================================================================================================
*/
function js_traiteDefinitionObjet(tab,id,dansConditionOuDansFonction,niveau){
    if(tab[id][8] === 0){
        return({"__xst" : true ,"__xva" : "{}"});
    }
    const l01=tab.length;
    var contient_une_limite_longueur=false;
    var t='';
    var j=0;
    var obj={};
    var a_des_commentaires=false;
    var longueur_totale=0;
    var valeur='';
    var propriete='';
    for( j=id + 1 ; j < l01 && a_des_commentaires === false ; j=tab[j][12] ){
        if(tab[j][1] === '#' && tab[j][2] === 'f'){
            a_des_commentaires=true;
            break;
        }
    }
    if(a_des_commentaires === false && tab[id][8] > 5){
        a_des_commentaires=true;
    }
    var tableau_prop_objet=[];
    for( j=id + 1 ; j < l01 ; j=j=tab[j][12] ){
        if(tab[j][1] === '#' && tab[j][2] === 'f'){
            var commt=traiteCommentaire2(tab[j][13],niveau + 1,j);
            if(commt.indexOf('\n') >= 0){
                valeur=' /*' + commt + ' ' + '*/';
                tableau_prop_objet.push({"type" : 'comm' ,"valeur" : valeur});
                longueur_totale+=valeur.length;
            }else{
                valeur=' /*' + commt + '*/';
                tableau_prop_objet.push({"type" : 'comm' ,"valeur" : valeur});
                longueur_totale+=valeur.length;
            }
        }else if(tab[j][1] === 'prop' && tab[j][2] === 'f'){
            if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                propriete+='.' + (tab[j + 1][1]);
            }else{
                return(logerreur({"__xst" : false ,"id" : j ,"tab" : tab ,"__xme" : 'erreur js_traiteDefinitionObjet 2412 sur propriete d\'objet '}));
            }
        }else if(tab[j][1] === '' && tab[j][2] === 'f'){
            if(tab[j][8] === 2){
                if(tab[j + 2][2] === 'f'){
                    if(tab[j + 2][1] === 'obj'){
                        obj=js_traiteDefinitionObjet(tab,j + 2,true,niveau + 1);
                        if(obj.__xst === true){
                            tableau_prop_objet.push({"type" : 'cv' ,"cle" : tab[j + 1][1] ,"valeur" : obj.__xva});
                            longueur_totale+=obj.__xva.length;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans js_traiteDefinitionObjet il y a un problème'}));
                        }
                    }else if(tab[j + 2][1] === 'new'){
                        obj=js_traite_new(tab,j + 2,niveau + 1);
                        if(obj.__xst === true){
                            valeur=obj.__xva;
                            tableau_prop_objet.push({"type" : 'cv' ,"cle" : tab[j + 1][1] ,"valeur" : valeur});
                            longueur_totale+=obj.__xva.length;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2367 erreur dans TraiteOperations2'}));
                        }
                    }else if(tab[j + 2][1] === 'appelf'){
                        objOperation=js_traiteAppelFonction(tab,j + 2,true,niveau + 1,true,'');
                        if(objOperation.__xst === true){
                            if(objOperation.hasOwnProperty('arguments_a_ajouter_au_retour')){
                                if(objOperation.__xva.substr(objOperation.__xva.length - 1,1) === ';'){
                                    objOperation.__xva.substr(0,objOperation.__xva.length - 1);
                                }
                                objOperation.__xva=objOperation.__xva + objOperation.arguments_a_ajouter_au_retour;
                            }
                            var droite=objOperation.__xva;
                            if(droite.substr(droite.length - 1,1) === '}'){
                                droite=(droite.substr(0,droite.length - 1) + espacesn(true,niveau + 1)) + '}';
                            }
                            tableau_prop_objet.push({"type" : 'cv' ,"cle" : tab[j + 1][1] ,"valeur" : droite});
                            longueur_totale+=droite.length;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j + 2 ,"tab" : tab ,"__xme" : 'erreur 2104 sur des opérations '}));
                        }
                    }else if(tableau_des_opérateurs_js.hasOwnProperty(tab[j + 2][1])){
                        var objOperation=TraiteOperations2(tab,j + 2,niveau + 1,0);
                        if(objOperation.__xst === true){
                            var droite=objOperation.__xva;
                            tableau_prop_objet.push({"type" : 'cv' ,"cle" : tab[j + 1][1] ,"valeur" : droite});
                            longueur_totale+=droite.length;
                            contient_une_limite_longueur=true;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur js_traiteDefinitionObjet 1496 sur des opérations '}));
                        }
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1492 dans js_traiteDefinitionObjet "' + (tab[j + 2][1]) + '"'}));
                    }
                }else{
                    valeur=ma_cst_pour_javascript(tab[j + 2]);
                    tableau_prop_objet.push({"type" : 'cv' ,"cle" : tab[j + 1][1] ,"valeur" : valeur});
                    longueur_totale+=valeur.length;
                }
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1492 dans js_traiteDefinitionObjet "' + (tab[j + 2][1]) + '"'}));
            }
        }
    }
    var tt='{';
    if(a_des_commentaires || longueur_totale > 150){
        a_des_commentaires=true;
    }
    for( var i=0 ; i < tableau_prop_objet.length ; i++ ){
        if(i === 0 && a_des_commentaires){
            tt+=espacesn(true,niveau + 1);
        }
        if(tableau_prop_objet[i].type === 'comm'){
            tt+=tableau_prop_objet[i].valeur;
            tt+=espacesn(true,niveau + 1);
        }else{
            tt+='"' + tableau_prop_objet[i].cle + '" : ' + tableau_prop_objet[i].valeur;
            if(i < tableau_prop_objet.length - 1){
                tt+=' ,';
            }
            if(a_des_commentaires){
                if(i === tableau_prop_objet.length - 1){
                    tt+=espacesn(true,niveau);
                }else{
                    tt+=espacesn(true,niveau + 1);
                }
            }
        }
    }
    tt+='}' + propriete;
    return({"__xst" : true ,"__xva" : tt});
}
/*
  =====================================================================================================================
*/
function js_traiteAppelFonction(tab,id,dansConditionOuDansFonction,niveau,recursif,nom_de_la_fonction_parente){
    const l01=tab.length;
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
    var objTxt='';
    var proprietesFonction='';
    var aDesAppelsRecursifs=false;
    var nbEnfants=0;
    var forcerNvelleLigneEnfant=false;
    var contenu='';
    var termineParUnePropriete=false;
    var enfantTermineParUnePropriete=false;
    var flechee=false;
    var fonction_dans_tableau_avec_constante=false;
    positionAppelFonction=-1;
    var id_de_la_fonction='';
    var auto_appelee=false;
    for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][1] === 'nomf' && tab[j][2] === 'f'){
            positionAppelFonction=j;
            if(tab[j][8] === 0){
                /*
                  nom fonction vide 
                  declare_variable( x0 , chainé( a.b , appelf( nomf() , p() ) )),
                */
            }else if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                nomFonction=tab[j + 1][1];
                if(nomFonction === 'Array'){
                    nbEnfants=tab[tab[tab[j + 1][7]][7]][8] - 1;
                }
            }else if(tab[j][8] === 1 && tab[j + 1][1] === 'cst'){
                if(tab[j + 2][4] !== 0){
                    fonction_dans_tableau_avec_constante=true;
                }
                nomFonction=tab[j + 2][1];
            }else if(tab[j + 1][1] === 'appelf' && tab[j + 1][2] === 'f'){
                var obj1=js_traiteAppelFonction(tab,j + 1,true,niveau,true,nom_de_la_fonction_parente);
                if(obj1.__xst === true){
                    if(obj1.__xva.substr(obj1.__xva.length - 1,1) === ';'){
                        obj1.__xva=obj1.__xva.substr(0,obj1.__xva.length - 1);
                    }
                    nomFonction=obj1.__xva;
                    enfantTermineParUnePropriete=obj1.termineParUnePropriete;
                    aDesAppelsRecursifs=true;
                }else{
                    logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1069 erreur sur appel de fonction "' + tab[j][1] + '"'});
                }
            }else if(tab[j + 1][1] === 'tableau' && tab[j + 1][2] === 'f'){
                var objTableau=js_traiteTableau1(tab,j + 1,true,niveau,false);
                if(objTableau.__xst === true){
                    nomFonction=objTableau.__xva;
                }else{
                    logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2349 erreur sur appel de tableau "' + tab[j][1] + '"'});
                }
            }else if(tab[j + 1][2] === 'f' && tab[j + 1][1] === 'testEnLigne'){
                var objTableau=js_traiteInstruction1(tab,niveau,j + 1);
                if(objTableau.__xst === true){
                    nomFonction='(' + objTableau.__xva + ')';
                }else{
                    logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2401 erreur sur test en ligne "' + tab[j][1] + '"'});
                }
            }else if(tab[j + 1][2] === 'f' && tab[j + 1][1] === 'chainé'){
                var objTableau=js_traiteInstruction1(tab,niveau,j + 1);
                if(objTableau.__xst === true){
                    nomFonction=objTableau.__xva;
                }else{
                    logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2401 erreur sur test en ligne "' + tab[j][1] + '"'});
                }
            }else if(tab[j + 1][1] === 'virgule' && tab[j + 1][2] === 'f'){
                var objOperation=TraiteOperations2(tab,j + 1,niveau,0);
                if(objOperation.__xst === true){
                    nomFonction='(' + objOperation.__xva + ')';
                }else{
                    logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '2409 erreur sur test en ligne "' + tab[j][1] + '"'});
                }
            }else if(tab[j + 1][1] === '' && tab[j + 1][2] === 'f'){
                var objtestLi=js_tabTojavascript1(tab,j + 2,false,true,niveau,false);
                if(objtestLi.__xst === true){
                    nomFonction=objtestLi.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur 1938 sur return'}));
                }
            }else if(tab[j + 1][1] === 'new' && tab[j + 1][2] === 'f'){
                var objtestLi=js_traite_new(tab,j + 1,niveau);
                if(objtestLi.__xst === true){
                    nomFonction=objtestLi.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur 1938 sur return'}));
                }
            }else if(tab[j + 1][1] === 'defTab' && tab[j + 1][2] === 'f'){
                var obj=js_traiteDefinitionTableau(tab,j + 1,niveau,{});
                if(obj.__xst === true){
                    nomFonction=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"__xme" : '2054 js_traiteAppelFonction'}));
                }
            }else{
                debugger;
            }
        }else if(tab[j][1] === 'flechee' && tab[j][2] === 'f'){
            flechee=true;
        }else if(tab[j][1] === 'id' && tab[j][2] === 'f'){
            id_de_la_fonction=' ' + (tab[j + 1][1]);
        }else if(tab[j][1] === 'auto_appelee' && tab[j][2] === 'f'){
            auto_appelee=true;
        }else if(tab[j][1] === 'r' && tab[j][2] === 'f'){
            if(tab[j][8] === 1){
                nomRetour=tab[j + 1][1];
            }
            positionRetour=j;
        }else if(tab[j][1] === 'element' && tab[j][2] === 'f'){
            for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                if(tab[k][2] === 'c'){
                    nomElement+=ma_cst_pour_javascript(tab[k]);
                }else if(tab[k][2] === 'f'){
                    if(tab[k][1] === '#'){
                    }else if(tab[k][1] === 'tableau'){
                        var objTableau=js_traiteTableau1(tab,k,true,niveau,false);
                        if(objTableau.__xst === true){
                            nomElement+=objTableau.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'element incorrecte dans tableau 1592 '}));
                        }
                    }else{
                        var objinst=js_traiteInstruction1(tab,niveau,k);
                        if(objinst.__xst === true){
                            if(tab[k][2] === 'f' && (tab[k][1] === 'concat' || tab[k][1] === 'plus')){
                                nomElement+='(' + objinst.__xva + ')';
                            }else{
                                nomElement+=objinst.__xva;
                            }
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'element incorrecte dans appelf 1954 '}));
                        }
                    }
                }
            }
        }
    }
    if(!(positionAppelFonction > 0) && nomFonction !== ''){
        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : ' dans 3085 js_traiteAppelFonction il faut un nom de fonction à appeler nomf(xxxx)'}));
    }
    for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][2] === 'f'){
            if(tab[j][1] === 'element'
             || tab[j][1] === 'nomf'
             || tab[j][1] === 'p'
             || tab[j][1] === 'appelf'
             || tab[j][1] === 'r'
             || tab[j][1] === 'prop'
             || tab[j][1] === '#'
             || tab[j][1] === 'contenu'
             || tab[j][1] === 'id'
             || tab[j][1] === 'flechee'
             || tab[j][1] === 'auto_appelee'
            ){
                continue;
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : '1852 l\'argument de appelf "' + tab[j][1] + '" n\'est pas pris en compte'}));
            }
        }
    }
    argumentsFonction='';
    for( j=id + 1 ; j < l01 ; j=tab[j][12] ){
        if(tab[j][7] === id){
            if(tab[j][1] === 'obj'){
                obj=js_traiteDefinitionObjet(tab,j,true,niveau);
                if(obj.__xst === true){
                    argumentsFonction+=',' + obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'dans js_traiteAppelFonction Objet il y a un problème'}));
                }
            }else if(tab[j][1] === 'prop'){
                termineParUnePropriete=true;
                if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                    proprietesFonction+='.' + ma_cst_pour_javascript(tab[j + 1]);
                }else{
                    if(tab[j][8] === 1 && tab[j + 1][2] === 'f'){
                        if(tab[j + 1][1] === 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=js_traiteAppelFonction(tab,j + 1,true,niveau,true,nomFonction);
                            if(obj.__xst === true){
                                proprietesFonction+='.' + obj.__xva;
                            }else{
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue ' + tab[j][1]}));
                        }
                    }
                }
            }else if(tab[j][1] === 'appelf'){
                aDesAppelsRecursifs=true;
                if(false && tab[j + 1][1] === 'cascade'){
                    obj=js_tabTojavascript1(tab,j,false,false,niveau);
                }else{
                    obj=js_traiteAppelFonction(tab,j,true,niveau,true,nomFonction);
                }
                if(obj.__xst === true){
                    argumentsFonction+=',';
                    if(nomFonction === 'Array' && nbEnfants >= 4){
                        forcerNvelleLigneEnfant=true;
                        argumentsFonction+=espacesn(true,niveau + 1);
                    }
                    argumentsFonction+=obj.__xva;
                }else{
                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un appel de fonction imbriqué 1'}));
                }
            }else if(tab[j][1] === 'contenu'){
                contenu='';
                if(tab[j][8] === 0){
                    contenu='/* vide */';
                }else{
                    obj=js_tabTojavascript1(tab,j + 1,false,false,niveau + 1);
                    if(obj.__xst === true){
                        contenu+=obj.__xva;
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'erreur dans un appelf sur  le contenu d\'une fonction "function" '}));
                    }
                }
            }else if(tab[j][1] === 'p'){
                if(tab[j][8] === 0){
                    argumentsFonction+=',';
                }else if(tab[j][8] === 1 && tab[j + 1][2] === 'c'){
                    argumentsFonction+=',' + ma_cst_pour_javascript(tab[j + 1]);
                }else if(tab[j][8] > 1 && tab[j + 1][2] === 'c'){
                    for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                        if(k === j + 1){
                            argumentsFonction+=',';
                        }
                        if(nomFonction === 'concat'){
                            if(tab[k][1] === '+'){
                                argumentsFonction+=',';
                            }else{
                                argumentsFonction+='' + ma_cst_pour_javascript(tab[k]);
                            }
                        }else{
                            debugger;
                        }
                    }
                }else{
                    if(tab[j][8] === 1 && tab[j + 1][1] === 'obj'){
                        obj=js_traiteDefinitionObjet(tab,j + 1,true,niveau);
                        if(obj.__xst === true){
                            argumentsFonction+=',' + obj.__xva;
                        }else{
                            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : 'dans js_traiteAppelFonction Objet il y a un problème'}));
                        }
                    }else if(tab[j + 1][2] === 'f'){
                        if(tab[j][8] > 1){
                            var a_un_commentaire=false;
                            var k=j + 1;
                            for( k=j + 1 ; k < l01 && a_un_commentaire === false ; k=tab[k][12] ){
                                if(tab[k][7] === j){
                                    if(tab[k][1] === '#' && tab[k][2] === 'f'){
                                        a_un_commentaire=true;
                                    }
                                }
                            }
                            if(a_un_commentaire === false){
                                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : j ,"tab" : tab ,"__xme" : '2036 erreur un paramètre p() a trop d\'arguments '}));
                            }
                        }
                        var precedent_est_un_commentaire=false;
                        for( k=j + 1 ; k < l01 ; k=tab[k][12] ){
                            if(precedent_est_un_commentaire === true){
                                /* on ne met pas de virgule */
                                precedent_est_un_commentaire=false;
                            }else{
                                argumentsFonction+=',';
                            }
                            if(tab[k][1] === '#' && tab[k][2] === 'f'){
                                if(argumentsFonction === ','){
                                    /*  */
                                    argumentsFonction=', /* ' + tab[k][13] + ' */ ';
                                }else{
                                    argumentsFonction+=' /* ' + tab[k][13] + ' */ ';
                                }
                                precedent_est_un_commentaire=true;
                            }else if(tab[k][2] === 'f' && tab[k][1] === '@'){
                                argumentsFonction+=tab[k][13];
                            }else if(tab[k][2] === 'f' && tab[k][1] === 'appelf'){
                                objOperation=js_traiteAppelFonction(tab,k,true,niveau,true,nomFonction);
                                if(objOperation.__xst === true){
                                    if(objOperation.__xva.substr(objOperation.__xva.length - 1,1) === ';'){
                                        objOperation.__xva=objOperation.__xva.substr(0,objOperation.__xva.length - 1);
                                    }
                                    argumentsFonction+=objOperation.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : k ,"tab" : tab ,"__xme" : 'erreur 2104 sur des opérations '}));
                                }
                            }else if(tableau_des_opérateurs_js.hasOwnProperty(tab[k][1])){
                                var objOperation=TraiteOperations2(tab,k,niveau,0);
                                if(objOperation.__xst === true){
                                    argumentsFonction+=objOperation.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : k ,"tab" : tab ,"__xme" : 'erreur 2107 sur des opérations '}));
                                }
                            }else if(tab[k][2] === 'c'){
                                argumentsFonction+=ma_cst_pour_javascript(tab[k]);
                            }else{
                                var objJs=js_tabTojavascript1(tab,tab[k][0],true,true,niveau);
                                if(objJs.__xst === true){
                                    argumentsFonction+=objJs.__xva;
                                }else{
                                    return(logerreur({"__xst" : false ,"__xva" : t ,"id" : tab[k][0] ,"tab" : tab ,"__xme" : 'erreur 1425 dans js_traiteAppelFonction '}));
                                }
                            }
                        }
                    }else{
                        /* on a deux éléments dans le paramètre p(), c'est bizarre sauf si un des éléments est un commentaire */
                        debugger;
                    }
                }
            }
        }
    }
    var transformer_point_en_tableau=false;
    if(!(dansConditionOuDansFonction)){
        t+=espacesn(true,niveau);
    }
    t+=nomRetour !== '' ? ( nomRetour + '=' ) : ( '' );
    if(recursif === true && nomRetour === '' && !(dansConditionOuDansFonction)){
        t+=espacesn(true,niveau + 1) + (nomElement === '' ? ( '' ) : ( nomElement + '.' ));
    }else{
        if(nomElement !== ''){
            if(nomElement.substr(nomElement.length - 1,1) === ']'){
                var tab_mots_cles_a_ne_pas_transformer=[
                    'addEventListener',
                    'appendChild',
                    'apply',
                    'at',
                    'bind',
                    'call',
                    'charAt',
                    'charCodeAt',
                    'codePointAt',
                    'concat',
                    'endsWith',
                    'forEach',
                    'fromCharCode',
                    'fromCodePoint',
                    'getAttribute',
                    'getBBox',
                    'has',
                    'hasOwnProperty',
                    'includes',
                    'indexOf',
                    'isWellFormed',
                    'lastIndexOf',
                    'localeCompare',
                    'map',
                    'match',
                    'matchAll',
                    'normalize',
                    'padEnd',
                    'padStart',
                    'push',
                    'raw',
                    'repeat',
                    'replace',
                    'replaceAll',
                    'search',
                    'setAttribute',
                    'slice',
                    'splice',
                    'split',
                    'startsWith',
                    'substr',
                    'substring',
                    'test',
                    'toLocaleLowerCase',
                    'toLocaleUpperCase',
                    'toLowerCase',
                    'toString',
                    'toUpperCase',
                    'toWellFormed',
                    'trim',
                    'trimEnd',
                    'trimStart',
                    'valueOf'
                ];
                if(tab_mots_cles_a_ne_pas_transformer.includes(nomFonction)){
                    t=nomElement + '.';
                }else{
                    console.log('%c => on garde la forme "." pour ' + nomElement + ' car ce n\'est pas une fonction connue','background:yellow;color:red;');
                    transformer_point_en_tableau=true;
                    t=nomElement;
                }
            }else{
                t=nomElement + '.';
            }
        }
    }
    /*
      le nom de la fonction ici 
    */
    if(nomFonction === 'Array' && !(enfantTermineParUnePropriete)){
        t+='';
        /*  */
    }else{
        /*
          if[id_de_la_fonction !== '']{
          t+='[';
          }
        */
        if(nomFonction === 'function' && flechee === true){
            t+=id_de_la_fonction;
        }else{
            if(transformer_point_en_tableau === true){
                if(fonction_dans_tableau_avec_constante === true){
                    t+='[\'' + nomFonction + '\']' + id_de_la_fonction;
                }else{
                    t+='[' + nomFonction + ']' + id_de_la_fonction;
                }
            }else{
                t+=nomFonction + id_de_la_fonction;
            }
        }
    }
    if(auto_appelee === true){
        console.log('auto_appelee=',auto_appelee);
        t='(' + t + ')';
    }
    var arguments_a_ajouter_au_retour='';
    if(!(enfantTermineParUnePropriete)){
        if(nomFonction === 'Array' && nbEnfants <= 1){
            t+='[';
        }else if(nomFonction === 'Array' && nbEnfants > 1){
            t+='Array(';
        }else{
            if(nomFonction === 'super' && argumentsFonction === ''){
                /* pas de parenthèses pour la fonction super */
                t+='';
            }else{
                if(tab[tab[id][7]][1] === '' && tab[tab[id][7]][2] === 'f'){
                    /* on le mettra plus tard au retour */
                    if(tab[id][3] >= 2 && tab[tab[tab[id][7]][7]][1] && tab[tab[tab[id][7]][7]][2] === 'f'){
                        t+='(';
                    }else{
                        /* on le mettra plus tard au retour */
                        arguments_a_ajouter_au_retour='(' + (argumentsFonction !== '' ? ( argumentsFonction.substr(1) ) : ( '' )) + ')';
                    }
                }else{
                    t+='(';
                }
            }
        }
    }
    if(arguments_a_ajouter_au_retour !== ''){
        /* on le mettra plus tard au retour */
    }else{
        t+=argumentsFonction !== '' ? ( argumentsFonction.substr(1) ) : ( '' );
    }
    if(aDesAppelsRecursifs
     && !(dansConditionOuDansFonction)
     && nomRetour === ''
     && nomElement === ''
     && enfantTermineParUnePropriete === false
     || forcerNvelleLigneEnfant
    ){
        t+=espacesn(true,niveau);
    }
    if(!(enfantTermineParUnePropriete)){
        if(nomFonction === 'Array' && nbEnfants <= 1){
            t+=']';
        }else if(nomFonction === 'Array' && nbEnfants > 1){
            t+=')';
        }else{
            if(nomFonction === 'super' && argumentsFonction === ''){
                /* pas de parenthèses pour la fonction super */
                t+='';
            }else{
                if(arguments_a_ajouter_au_retour !== ''){
                    /* on le mettra plus tard au retour */
                }else{
                    t+=')';
                }
                if((nomFonction === 'function' || nomFonction === '') && flechee === true){
                    t+=' => ';
                }
            }
        }
    }
    if(nomFonction === 'function' || nomFonction === '' && flechee === true){
        var espaces_avant_contenu=espacesn(true,niveau);
        if(contenu.substr(0,2) === CRLF){
            espaces_avant_contenu='';
        }
        if(flechee === false){
            if(tab[id][3] >= 2 && tab[tab[id][7]][1] === 'p' && tab[tab[tab[id][7]][7]][1] === 'appelf'){
                /*
                  quand un paramètre d'une fonction est lui même une fonction anonyme :
                  par exemple 
                  tab.sort(function(a,b){return(b - a);});
                */
                t+='{' + espaces_avant_contenu + contenu + espacesn(true,niveau) + '}';
            }else{
                if(tab[tab[id][7]][1] === 'affecte' && tab[tab[id][7]][2] === 'f'){
                    t+='{' + espaces_avant_contenu + contenu + espacesn(true,niveau) + '}';
                }else if(tab[tab[id][7]][1] === 'nomf' && tab[tab[id][7]][2] === 'f'){
                    t+='{' + espaces_avant_contenu + contenu + espacesn(true,niveau - 1) + '}';
                }else{
                    t+='{' + espaces_avant_contenu + contenu + espacesn(true,niveau) + '}';
                }
            }
        }else{
            /*#
              a.b=((e,t) => { return 2})(t.value,n);;
              il faut un ; apres le return 2
              if(contenu.substr(contenu.length - 1,1) === ';'){
                  contenu=contenu.substr(0,contenu.length - 1);
              }
              debugger
            */
            /*
              afr hdf faut-il faire ceci ou l'inverse ???
            */
            if(nom_de_la_fonction_parente === 'forEach'
             || nom_de_la_fonction_parente === 'then'
             || nom_de_la_fonction_parente === 'catch'
             || nom_de_la_fonction_parente === 'finally'
            ){
                t+='{' + espaces_avant_contenu + contenu + espacesn(true,niveau) + '}';
            }else if(nom_de_la_fonction_parente === 'filter' || nom_de_la_fonction_parente === 'map'){
                t+=contenu;
            }else if(nom_de_la_fonction_parente === ''){
                t+='{' + espaces_avant_contenu + contenu + espacesn(true,niveau) + '}';
            }else{
                var temp=nom_de_la_fonction_parente.trim();
                if(temp.substr(0,8) === 'function'){
                    t+='{' + contenu + '}';
                }else{
                    if(nom_de_la_fonction_parente === 'filter' || nom_de_la_fonction_parente === 'map'){
                        console.log('flechée nom_de_la_fonction_parente="' + nom_de_la_fonction_parente + '"' + ' donc sans accolades ');
                        t+='' + contenu + '';
                    }else{
                        t+='{' + contenu + '}';
                    }
                }
            }
        }
    }
    t+=proprietesFonction;
    if(!(dansConditionOuDansFonction) || auto_appelee === true){
        t+=';';
    }
    if(transformer_point_en_tableau === true){
        console.log('%c cas spécial de transformer_point_en_tableau ','background:yellow;color:red;',t);
    }
    return({"__xst" : true ,"__xva" : t ,"forcerNvelleLigneEnfant" : forcerNvelleLigneEnfant ,"termineParUnePropriete" : termineParUnePropriete ,"arguments_a_ajouter_au_retour" : arguments_a_ajouter_au_retour});
}
/*
  https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Operator_precedence
  type_operateur=1  => un seul    : il ne doit y avoir qu'une seule opérande , exemple : non(x), typeof(y), void(z) ...
  type_operateur=2  => deux       : il ne doit y avoir 2 opérandes strictement exemple : modulo(x,y), puissance(x,y)....
  type_operateur=m2 => multiple 2 : il doit y avoir au moins 2 opérandes exemple : mult(2,3,4) = 24
  type_operateur=m1 => multiple 1 : il doit y avoir au moins 1 opérande  exemple : moins(1) = -1, moins(2,1,1)=2-1-1=0
  type_operateur=m0 => multiple 0 : les opérandes ne sont pas obligatoires exemple : condition()
*/
var tableau_des_opérateurs_js={
    "mult" : {"__xva" : '*' ,"type_operateur" : 'm2' ,"precedence" : 13} ,
    "divi" : {"__xva" : '/' ,"type_operateur" : 'm2' ,"precedence" : 13} ,
    "modulo" : {"__xva" : '%' ,"type_operateur" : 2 ,"precedence" : 13} ,
    "plus" : {"__xva" : '+' ,"type_operateur" : 'm1' ,"precedence" : 12} ,
    "moins" : {"__xva" : '-' ,"type_operateur" : 'm1' ,"precedence" : 12} ,
    "concat" : {"__xva" : '+' ,"type_operateur" : 'm2' ,"precedence" : 12} ,
    "virgule" : {"__xva" : ',' ,"type_operateur" : 'm2' ,"precedence" : 1} ,
    "puissance" : {"__xva" : '**' ,"type_operateur" : 2 ,"precedence" : 14} ,
    "etBin" : {"__xva" : '&' ,"type_operateur" : 2 ,"precedence" : 8} ,
    "ou_ex_bin" : {"__xva" : '^' ,"type_operateur" : 2 ,"precedence" : 7} ,
    "oppose_binaire" : {"__xva" : '~' ,"type_operateur" : 1 ,"precedence" : 15} ,
    "ou_bin" : {"__xva" : '|' ,"type_operateur" : 2 ,"precedence" : 6} ,
    "decalDroite" : {"__xva" : '>>' ,"type_operateur" : 2 ,"precedence" : 11} ,
    "decal_droite_non_signe" : {"__xva" : '>>>' ,"type_operateur" : 2 ,"precedence" : 11} ,
    "decalGauche" : {"__xva" : '<<' ,"type_operateur" : 2 ,"precedence" : 11} ,
    "Instanceof" : {"__xva" : 'instanceof ' ,"type_operateur" : 2 ,"precedence" : 15} ,
    "postdec" : {"__xva" : '--' ,"type_operateur" : 1 ,"precedence" : 16} ,
    "postinc" : {"__xva" : '++' ,"type_operateur" : 1 ,"precedence" : 16} ,
    "predec" : {"__xva" : '--' ,"type_operateur" : 1 ,"precedence" : 15} ,
    "preinc" : {"__xva" : '++' ,"type_operateur" : 1 ,"precedence" : 15} ,
    "membre" : {"__xva" : '' ,"type_operateur" : 'm1' ,"precedence" : 15} ,
    "prop" : {"__xva" : '.' ,"type_operateur" : 1 ,"precedence" : 15} ,
     /* logiques */
    "et" : {"__xva" : '&&' ,"type_operateur" : 'm2' ,"precedence" : 5} ,
    "ou" : {"__xva" : '||' ,"type_operateur" : 'm2' ,"precedence" : 4} ,
    "??" : {"__xva" : '??' ,"type_operateur" : 'm2' ,"precedence" : 4} ,
     /* opérateurs unaires */
    "void" : {"__xva" : 'void' ,"type_operateur" : 1 ,"precedence" : 15} ,
    "Typeof" : {"__xva" : 'typeof ' ,"type_operateur" : 1 ,"precedence" : 15} ,
    "new" : {"__xva" : 'new ' ,"type_operateur" : 1 ,"precedence" : 18} ,
    "chainé" : {"__xva" : '?.' ,"type_operateur" : 2 ,"precedence" : 18} ,
    "non" : {"__xva" : '!' ,"type_operateur" : 1 ,"precedence" : 15} ,
    "condition" : {"__xva" : '' ,"type_operateur" : 'm0' ,"precedence" : 19} ,
     /* opérateurs comparaison */
    "egalstricte" : {"__xva" : '===' ,"type_operateur" : 2 ,"precedence" : 9} ,
    "egal" : {"__xva" : '==' ,"type_operateur" : 2 ,"precedence" : 9} ,
    "diffstricte" : {"__xva" : '!==' ,"type_operateur" : 2 ,"precedence" : 9} ,
    "diff" : {"__xva" : '!=' ,"type_operateur" : 2 ,"precedence" : 9} ,
    "inf" : {"__xva" : '<' ,"type_operateur" : 2 ,"precedence" : 10} ,
    "sup" : {"__xva" : '>' ,"type_operateur" : 2 ,"precedence" : 10} ,
    "infeg" : {"__xva" : '<=' ,"type_operateur" : 2 ,"precedence" : 10} ,
    "supeg" : {"__xva" : '>=' ,"type_operateur" : 2 ,"precedence" : 10} ,
    "cle_dans_objet" : {"__xva" : 'in' ,"type_operateur" : 2 ,"precedence" : 10} ,
     /* cas spéciaux */
    "appelf" : {"__xva" : '@' ,"type_operateur" : -1 ,"precedence" : 18} ,
    "defTab" : {"__xva" : '@' ,"type_operateur" : -1 ,"precedence" : 18} ,
    "tableau" : {"__xva" : '@' ,"type_operateur" : -1 ,"precedence" : 18} ,
    "testEnLigne" : {"__xva" : '@' ,"type_operateur" : -1 ,"precedence" : 3} ,
    "affecte" : {"__xva" : '@' ,"type_operateur" : -1 ,"precedence" : 2} ,
    "affectop" : {"__xva" : '@' ,"type_operateur" : -1 ,"precedence" : 2} ,
    "obj" : {"__xva" : '@' ,"type_operateur" : -1 ,"precedence" : 2} ,
    "#" : {"__xva" : '@' ,"type_operateur" : -1 ,"precedence" : 2}
};
/*
  =====================================================================================================================
*/
function TraiteOperations2(tab,id,niveau,niveauOp){
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
    if(tab[id][8] === 1 && tab[id][1] === '' && tab[id][2] === 'f' && tab[id][10] > 0 && tab[id + 1][1] === 'appelf'){
        console.log('%cappel fonction auto_appelée à priori ','color:red;background:yellow;');
        var obj=js_traiteAppelFonction(tab,id + 1,true,niveau,false,'');
        if(obj.__xst === false){
            return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur TraiteOperations2 3283'}));
        }
        if(obj.hasOwnProperty('arguments_a_ajouter_au_retour') && obj.arguments_a_ajouter_au_retour !== ''){
            obj.__xva=espacesn(true,niveau - 1) + obj.__xva;
            if(obj.__xva.substr(obj.__xva.length - 1,1) === ';'){
                obj.__xva=obj.__xva.substr(0,obj.__xva.length - 1);
            }
            obj.__xva+=obj.arguments_a_ajouter_au_retour + ';';
        }
        return({"__xva" : obj.__xva ,"__xst" : true ,"annuler_terminateur" : true});
    }
    oop={};
    if(tab[id][1] === '' && tab[id][2] === 'f'){
        oop={"__xva" : '' ,"type_operateur" : 1 ,"precedence" : 19};
    }else{
        if(!(tableau_des_opérateurs_js.hasOwnProperty(tab[id][1]))){
            debugger;
        }else{
            if(tab[id][2] === 'f'
             && (tab[id][1] === 'appelf'
             || tab[id][1] === 'defTab'
             || tab[id][1] === 'tableau'
             || tab[id][1] === 'testEnLigne'
             || tab[id][1] === 'affecte'
             || tab[id][1] === 'affectop'
             || tab[id][1] === 'obj')
            ){
                if(tab[id][1] === 'appelf'){
                    var objfnt=js_traiteAppelFonction(tab,id,true,niveau,false,'');
                    if(objfnt.__xst === true){
                        return({"__xva" : objfnt.__xva ,"__xst" : true});
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur TraiteOperations2 4251'}));
                    }
                }else if(tab[id][1] === 'defTab'){
                    var obj=js_traiteDefinitionTableau(tab,id,niveau,{});
                    if(obj.__xst === true){
                        return({"__xva" : obj.__xva ,"__xst" : true});
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"__xme" : 'erreur 3279 dans une operation pour un defTab "' + tab[id][1] + '"'}));
                    }
                }else if(tab[id][1] === 'tableau'){
                    var objTableau=js_traiteTableau1(tab,id,true,niveau,false);
                    if(objTableau.__xst === true){
                        return({"__xva" : objTableau.__xva ,"__xst" : true});
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur 1844 sur TraiteOperations2 '}));
                    }
                }else if(tab[id][1] === 'testEnLigne'){
                    var obj=js_traiteInstruction1(tab,niveau,id);
                    if(obj.__xst === true){
                        return({"__xva" : obj.__xva ,"__xst" : true});
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"__xme" : 'erreur 3279 dans une operation pour un testEnLigne "' + tab[id][1] + '"'}));
                    }
                }else if(tab[id][1] === 'affecte' || tab[id][1] === 'affectop'){
                    var obj=js_traite_affecte(tab,id,niveau,true,'','');
                    if(obj.__xst === true){
                        return({"__xva" : obj.__xva ,"__xst" : true});
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"__xme" : 'erreur 3493 dans une operation pour un affecte ou affectop "' + tab[id][1] + '"'}));
                    }
                }else if(tab[id][1] === 'obj'){
                    var obj=js_traiteDefinitionObjet(tab,id,true,niveau);
                    if(obj.__xst === true){
                        return({"__xva" : obj.__xva ,"__xst" : true});
                    }else{
                        return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"__xme" : 'erreur 3493 dans une operation pour un affecte ou affectop "' + tab[id][1] + '"'}));
                    }
                }
            }else{
                var oop=tableau_des_opérateurs_js[tab[id][1]];
            }
        }
    }
    var operateur_principal=oop.__xva;
    if(operateur_principal === ','){
        /*
          logerreur({"__xst" : true,"__xav" : '2972 l\'opérateur virgule est une plaie'});
        */
    }
    var element_precedent_est_commentaire=false;
    for( i=id + 1 ; i < l01 ; i=tab[i][12] ){
        if(premier_operande === true){
            if(!(oop.type_operateur === 1
             && tab[id][8] === 1
             || oop.type_operateur === 2
             && tab[id][8] === 2
             || oop.type_operateur === 'm2'
             && tab[id][8] >= 2
             || oop.type_operateur === 'm1'
             && tab[id][8] >= 1
             || oop.type_operateur === 'm0'
             && tab[id][8] >= 0)
            ){
                debugger;
                return(logerreur({"__xst" : false ,"__xme" : ' erreur sur TraiteOperations2 4246 le nombre d\'opérandes est incorrecte' ,"id" : i}));
            }
            if(oop.type_operateur === 1 || oop.type_operateur === 'm1' && tab[id][8] === 1){
                /* si c'est un opérateur avec qu'une seule opérande */
                if(tab[i][2] === 'c'){
                    if(tab[tab[i][7]][8] === 1 && operateur_principal === ''){
                        t+=ma_cst_pour_javascript(tab[i]);
                    }else{
                        if(tab[id][1] === 'postdec' || tab[id][1] === 'postinc' || tab[id][1] === 'predec' || tab[id][1] === 'preinc'){
                            var objOperation=js_tabTojavascript1(tab,id + 1,true,true,niveau + 1,false);
                            if(objOperation.__xst === false){
                                return(logerreur({"__xst" : false ,"__xme" : ' erreur sur TraiteOperations2 3334'}));
                            }
                            if(objOperation.__xva.substr(0,1) === '(' && objOperation.__xva.substr(objOperation.length - 1,1) === ')'){
                                objOperation.__xva=objOperation.__xva.substr(1,objOperation.__xva.length - 2);
                            }
                            if(tab[id][1] === 'postdec' || tab[id][1] === 'postinc'){
                                t+=objOperation.__xva + operateur_principal;
                            }else{
                                t+=operateur_principal + objOperation.__xva;
                            }
                        }else if(operateur_principal === 'typeof '){
                            t+=operateur_principal + ma_cst_pour_javascript(tab[i]);
                        }else{
                            if(tab[id][1] === 'prop' && tab[id][2] === 'f' && operateur_principal === '.'){
                                /* prop => . mais comme ça on est certain :-] */
                                t+=operateur_principal + ma_cst_pour_javascript(tab[i]);
                            }else{
                                t+=operateur_principal + '(' + ma_cst_pour_javascript(tab[i]) + ')';
                            }
                        }
                    }
                }else{
                    if(tab[id][1] === 'postdec' || tab[id][1] === 'postinc' || tab[id][1] === 'predec' || tab[id][1] === 'preinc'){
                        var objOperation=js_tabTojavascript1(tab,id,true,true,niveau + 1,false);
                        if(objOperation.__xst === false){
                            return(logerreur({"__xst" : false ,"__xme" : ' erreur sur TraiteOperations2 3334'}));
                        }
                        if(objOperation.__xva.substr(0,1) === '(' && objOperation.__xva.substr(objOperation.length - 1,1) === ')'){
                            objOperation.__xva=objOperation.__xva.substr(1,objOperation.__xva.length - 2);
                        }
                        if(tab[id][1] === 'postdec' || tab[id][1] === 'postinc'){
                            t+=objOperation.__xva + operateur_principal;
                        }else{
                            t+=operateur_principal + objOperation.__xva;
                        }
                    }else{
                        var objOperation=TraiteOperations2(tab,i,niveau,niveauOp + 1);
                        if(objOperation.__xst === false){
                            return(logerreur({"__xst" : false ,"__xme" : ' erreur sur TraiteOperations2 4248'}));
                        }
                        if(tab[tab[i][7]][8] === 1 && operateur_principal === ''){
                            t+=objOperation.__xva;
                        }else{
                            if(operateur_principal === 'new ' || tab[id] === 'prop' && operateur_principal === '.'){
                                if(operateur_principal === 'new ' && objOperation.__xva.substr(0,1) === '['){
                                    /* c'est un new Array('xxx') qu'on a transformé en ['xxx'] */
                                    t+=objOperation.__xva;
                                }else{
                                    t+=operateur_principal + objOperation.__xva;
                                }
                            }else{
                                if(operateur_principal === 'typeof '){
                                    t+=operateur_principal + objOperation.__xva;
                                }else{
                                    t+=operateur_principal + '(' + objOperation.__xva + ')';
                                }
                            }
                        }
                    }
                }
                return({"__xva" : t ,"__xst" : true});
            }else{
                /* rien de spécial, on continue le flux */
            }
            premier_operande=false;
        }else{
            if(operateur_principal === '||' && tab[i][1] === 'prop' && tab[i][2] === 'f'){
                /*
                  cas très spécial : on a un 
                  a=(b||c).d => affecte(a,ou(b,c,prop(d)))
                */
                t='(' + t + ')';
            }else if(operateur_principal !== ''){
                if(element_precedent_est_commentaire === true && operateur_principal === ','){
                    element_precedent_est_commentaire=false;
                }else{
                    t+=' ' + operateur_principal + ' ';
                }
            }
            if(operateur_principal === '' && tab[tab[i][7]][1] === 'condition' && tab[tab[i][7]][8] >= 2){
                /*
                  une condition peut être de la forme : 
                  for(i=0;i<5,j<3;i++,j++){} 
                  dans ce cas, à la fin j=3, ce n'est pas un ou car les 2 instructions sont exécutées 
                  l'opérateur virgule n'est vraiment pas à conseiller
                */
                t+=',';
            }
        }
        if(tab[i][2] === 'c'){
            t+=ma_cst_pour_javascript(tab[i]);
        }else if(operateur_principal === ',' && tab[i][1] === '#'){
            var commt=traiteCommentaire2(tab[i][13],niveau,i);
            t+=espacesn(true,niveau) + '/*' + commt + '*/' + espacesn(true,niveau);
            element_precedent_est_commentaire=true;
        }else if(tableau_des_opérateurs_js.hasOwnProperty(tab[i][1])){
            var objOperation=TraiteOperations2(tab,i,niveau,niveauOp + 1);
            if(objOperation.__xst === false){
                return(logerreur({"__xst" : false ,"__xme" : ' erreur sur TraiteOperations2 4267'}));
            }
            if(objOperation.__xva.endsWith(';')){
                objOperation.__xva=objOperation.__xva.substr(0,objOperation.__xva.length - 1);
            }
            if(tableau_des_opérateurs_js[tab[i][1]].precedence < oop.precedence){
                /*
                  à priori, il faut mettre des parenthèses mais
                  mais si c'est le seul elément dans la condition
                */
                if(tab[tab[i][7]][8] === 1 && tab[tab[i][7]][1] === 'condition' && niveauOp === 0){
                    t+=objOperation.__xva;
                }else{
                    t+='(' + objOperation.__xva + ')';
                }
            }else{
                if(tab[tab[i][7]][1] === 'concat' && tab[tab[i][7]][2] === 'f'){
                    if(tab[i][1] === 'appelf' && tab[i][2] === 'f'){
                        t+=objOperation.__xva;
                    }else{
                        t+='(' + objOperation.__xva + ')';
                    }
                }else{
                    if(tableau_des_opérateurs_js[tab[i][1]].__xva === ''){
                        if(tab[id][1] === 'condition' && tab[i][1] === 'condition'){
                            t+=objOperation.__xva;
                        }else{
                            t+='(' + objOperation.__xva + ')';
                        }
                    }else{
                        t+=objOperation.__xva;
                    }
                }
            }
        }else if(tab[i][1] === '' || tab[i][1] === 'condition'){
            if(tab[i][8] === 0){
                t+='';
            }else{
                var objOperation=TraiteOperations2(tab,i,niveau,niveauOp + 1);
                if(objOperation.__xst === true){
                    t+='(' + objOperation.__xva + ')';
                }else{
                    return(logerreur({"__xst" : false ,"__xme" : ' erreur sur TraiteOperations2 4276'}));
                }
            }
        }else if(tab[i][1] === 'appelf'){
            var obj=js_traiteAppelFonction(tab,i,true,niveau,false,'');
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"tab" : tab ,"__xme" : 'erreur TraiteOperations2 1609'}));
            }
        }else if(tab[i][1] === 'tableau'){
            var objTableau=js_traiteTableau1(tab,i,true,niveau,false);
            if(objTableau.__xst === true){
                t+=objTableau.__xva;
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur 1844 sur TraiteOperations2 '}));
            }
        }else if(tab[i][1] === 'defTab'){
            var obj=js_traiteDefinitionTableau(tab,i,niveau,{});
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"__xme" : 'erreur 3403 dans une operation pour un defTab "' + tab[i][1] + '"'}));
            }
        }else if(tab[i][1] === 'testEnLigne'){
            var objtestLi=js_traiteInstruction1(tab,niveau,i);
            if(objtestLi.__xst === true){
                t+='(' + objtestLi.__xva + ')';
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : 'erreur TraiteOperations2 2876'}));
            }
        }else if(tab[i][1] === 'new'){
            /* ✍            obj=js_traiteAppelFonction(tab,i + 1,true,niveau,false,''); */
            var obj=js_traite_new(tab,i + 1,niveau);
            if(obj.__xst === true){
                t+=obj.__xva;
                debugger;
                /* ✍ hugues vérifier le cas ou new contient une propriété et une fonction */
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : i ,"tab" : tab ,"__xme" : '2367 erreur dans TraiteOperations2'}));
            }
        }else if(tab[i][1] === 'affecte' || tab[i][1] === 'affectop'){
            var obj=js_traite_affecte(tab,i,niveau,true,'','');
            if(obj.__xst === true){
                t+='(' + obj.__xva + ')';
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"__xme" : 'erreur 3434 dans une operation pour un affecte ou affectop "' + tab[i][1] + '"'}));
            }
        }else if(tab[i][1] === 'obj'){
            var obj=js_traiteDefinitionObjet(tab,i,true,niveau);
            if(obj.__xst === true){
                t+=obj.__xva;
            }else{
                return(logerreur({"__xst" : false ,"__xva" : t ,"id" : id ,"__xme" : 'erreur 3493 dans une operation pour un obj "' + tab[id][1] + '"'}));
            }
        }else{
            debugger;
            return(logerreur({"__xst" : false ,"__xme" : '4392 fonction du premier paramètre non reconnue TraiteOperations2 "' + JSON.stringify(tab[i]) + '"' ,"tab" : tab ,"id" : id ,"i" : i}));
        }
    }
    return({"__xva" : t ,"__xst" : true});
}