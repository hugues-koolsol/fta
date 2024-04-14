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
function js_tabTojavascript1(tab,id,dansFonction,dansInitialisation,niveau){
    var t='';
    var i=0;
    var j=0;
    var k=0;
    var obj={};
    var positionDeclarationFonction=-1;
    var positionContenu=-1;
    var nomFonction='';
    var argumentsFonction='';
    var max=0;
    var reprise=0;
    var tabchoix=[];
    var l01=tab.length;
    for(i=id;(i < l01) && (tab[i][3] >= tab[id][3]);i=i+1){
        if(((tab[i][1] == 'break') || (tab[i][1] == 'continue') || ('useStrict' === tab[i][1]) || ('debugger' === tab[i][1])) && (tab[i][2] == 'f')){
            if('useStrict' === tab[i][1]){
                t+=espacesn(true,niveau);
                t+='"use strict";';
            }else{
                if(tab[i][8] == 0){
                    t+=espacesn(true,niveau);
                    t+=tab[i][1]+';';
                }else{
                    return(logerreur({status:false,value:t,id:id,tab:tab,'message':'erreur dans un '+tab[i][1]+' qui doit être sous le format '+tab[i][1]+'() strictement'}));
                }
            }
        }else if((tab[i][1] == 'revenir') && (tab[i][2] == 'f')){
            if(tab[i][8] == 0){
                try{
                    t+=espacesn(true,niveau);
                    t+='return;';
                }catch(e){
                    debugger;
                }
            }else{
                if(tab[i][8] == 1){
                    if(tab[i+1][2] == 'c'){
                        t+=espacesn(true,niveau);
                        t+='return '+maConstante(tab[i+1])+';';
                    }else if((tab[i+1][2] == 'f') && (tab[i+1][1] == 'appelf')){
                        t+=espacesn(true,niveau);
                        obj=js_traiteAppelFonction(tab,(i+1),true,niveau,false);
                        if(obj.status == true){
                            t+='return('+obj.value+');';
                        }else{
                            return(logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'}));
                        }
                    }else if((tab[i+1][2] == 'f') && (tab[i+1][1] == 'obj')){
                        t+=espacesn(true,niveau);
                        obj=js_traiteDefinitionObjet(tab,tab[i+1][0],true);
                        if(obj.status == true){
                            t+='return('+obj.value+');';
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans obj de "return" ou "dans" il y a un problème'}));
                        }
                    }else if((tab[i+1][2] == 'f') && (tab[i+1][1] == 'plus')){
                        t+=espacesn(true,niveau);
                        var objOperation = TraiteOperations1(tab,tab[i+1][0],niveau);
                        if(objOperation.status == true){
                            t+='return('+objOperation.value+');';
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1249 sur declaration '}));
                        }
                    }else{
                        return(logerreur({status:false,value:t,id:i,tab:tab,'message':'javascript non traité 0083 "'+(tab[i+1][1])+'"'}));
                    }
                }else{
                    return(logerreur({status:false,value:t,id:i,tab:tab,message:'javascript non traité 0088'}));
                }
                reprise=(i+1);
                max=(i+1);
                for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                    reprise=j;
                }
                i=reprise;
            }
        }else if((tab[i][1] == 'fonction') && (tab[i][2] == 'f')){
            if(dansFonction == true){
                return(logerreur({status:false,value:t,id:id,tab:tab,message:'on ne peut pas déclarer une fonction dans une fonction'}));
            }else{
                dansFonction=true;
                positionDeclarationFonction=-1;
                for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                    if((tab[j][1] == 'definition') && (tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
                        positionDeclarationFonction=j;
                        break;
                    }
                }
                positionContenu=-1;
                for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                    if((tab[j][1] == 'contenu') && (tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
                        positionContenu=j;
                        break;
                    }
                }
                if((positionDeclarationFonction >= 0) && (positionContenu >= 0)){
                    for(j=(positionDeclarationFonction+1);(j < l01) && (tab[j][3] > tab[positionDeclarationFonction][3]);j=j+1){
                        if((tab[j][1] == 'nom') && (tab[j][3] == (tab[positionDeclarationFonction][3]+1))){
                            if(tab[j][8] == 1){
                                nomFonction=tab[j+1][1];
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'le nom de la fonction doit être sous la forme  n(xxx) '}));
                            }
                        }
                    }
                    argumentsFonction='';
                    for(j=(positionDeclarationFonction+1);(j < l01) && (tab[j][3] > tab[positionDeclarationFonction][3]);j=j+1){
                        if((tab[j][1] == 'argument') && (tab[j][3] == (tab[positionDeclarationFonction][3]+1))){
                            if(tab[j][8] == 1){
                                argumentsFonction+=','+(tab[j+1][1]);
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'les arguments passés à la fonction doivent être sous la forme  a(xxx) '}));
                            }
                        }
                    }
                    if(nomFonction != ''){
                        t+='\nfunction '+nomFonction+'('+((argumentsFonction == '')?'':argumentsFonction.substr(1))+'){';
                        if(tab[positionContenu][8] == 0){
                            t+='\n';
                            t+='  // void';
                            t+='\n}';
                        }else{
                            niveau=niveau+1;
                            obj=js_tabTojavascript1(tab,(positionContenu+1),dansFonction,false,niveau);
                            niveau=niveau-1;
                            if(obj.status == true){
                                t+=obj.value;
                                t+='\n}';
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,'message':'problème sur le contenu de la fonction "'+nomFonction+'"'}));
                            }
                        }
                        max=Math.max(positionDeclarationFonction,positionContenu);
                        for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                            reprise=j;
                        }
                        i=reprise;
                    }
                }else{
                    return({status:false,value:t,id:id,tab:tab,message:'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'});
                }
                dansFonction=false;
            }
        }else if((tab[i][1] == 'appelf') && (tab[i][2] == 'f')){
            obj=js_traiteAppelFonction(tab,i,true,niveau,false);
            if(obj.status == true){
                t+=espacesn(true,niveau);
                t+=obj.value+';';
            }else{
                return(logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'}));
            }
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if((tab[i][1] == 'cascade') && (tab[i][2] == 'f')){
            var nbEnfantsCascade=tab[i][5];
            for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                if(tab[j][7] == tab[i][0]){
                    if(tab[j][1] == 'appelf'){
                        obj=js_traiteAppelFonction(tab,j,true,niveau,false);
                        if(obj.status == true){
                            if(tab[j][9] > 1){
                                t+='.';
                            }
                            t+=obj.value;
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans flux cascade, erreur dans appelf'}));
                        }
                    }else{
                        return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans flux cascade, il ne peut y avoir que des "appelf"'}));
                    }
                }
            }
            t+='';
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if((tab[i][1] == 'boucleSurObjet') && (tab[i][2] == 'f')){
            tabchoix=[];
            for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                if(tab[j][3] == (tab[i][3]+1)){
                    if(tab[j][1] == 'pourChaque'){
                        tabchoix.push(Array(j,tab[j][1],i));
                    }else if(tab[j][1] == 'faire'){
                        tabchoix.push(Array(j,tab[j][1],i));
                    }else if(tab[j][1] == '#'){
                        tabchoix.push(Array(j,tab[j][1],i));
                    }else{
                        return(logerreur({status:false,value:t,id:i,tab:tab,message:'la syntaxe de boucleSurObjet est boucleSurObjet(pourChaque(dans(a , b)),faire())'}));
                    }
                }
            }
            var pourChaque='';
            var faire='';
            for(j=0;j < tabchoix.length;j=j+1){
                if(tabchoix[j][1] == 'pourChaque'){
                    niveau=niveau+1;
                    obj=js_tabTojavascript1(tab,(tabchoix[j][0]+1),dansFonction,true,niveau);
                    niveau=niveau-1;
                    if(obj.status == true){
                        pourChaque+=obj.value;
                    }else{
                        return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'problème sur la pour de boucleSurObjet en indice '+tabchoix[j][0]}));
                    }
                }else if(tabchoix[j][1] == 'faire'){
                    niveau=niveau+1;
                    obj=js_tabTojavascript1(tab,(tabchoix[j][0]+1),dansFonction,false,niveau);
                    niveau=niveau-1;
                    if(obj.status == true){
                        faire+=obj.value;
                    }else{
                        return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'problème sur le alors de boucleSurObjet en indice '+tabchoix[j][0]}));
                    }
                }
            }
            t+=espacesn(true,niveau);
            t+='for(';
            t+=pourChaque;
            t+='){';
            t+=faire;
            t+=espacesn(true,niveau);
            t+='}';
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if((tab[i][1] == 'boucle') && (tab[i][2] == 'f')){
            tabchoix=[];
            for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                if(tab[j][3] == (tab[i][3]+1)){
                    if(tab[j][1] == 'condition'){
                        tabchoix.push(Array(j,tab[j][1],i));
                    }else if(tab[j][1] == 'initialisation'){
                        tabchoix.push(Array(j,tab[j][1],i));
                    }else if(tab[j][1] == 'increment'){
                        tabchoix.push(Array(j,tab[j][1],i));
                    }else if(tab[j][1] == 'faire'){
                        tabchoix.push(Array(j,tab[j][1],i));
                    }else if(tab[j][1] == '#'){
                        tabchoix.push(Array(j,tab[j][1],i));
                    }else{
                        return(logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'}));
                    }
                }
            }
            var initialisation='';
            var condition='';
            var increment='';
            var faire='';
            for(j=0;j < tabchoix.length;j=j+1){
                if(tabchoix[j][1] == 'initialisation'){
                    niveau=niveau+1;
                    obj=js_tabTojavascript1(tab,(tabchoix[j][0]+1),dansFonction,true,niveau);
                    niveau=niveau-1;
                    if(obj.status == true){
                        initialisation+=obj.value;
                        if(initialisation.substr(initialisation.length-1,1) === ';'){
                            initialisation=initialisation.substr(0,initialisation.length-1);
                        }
                    }else{
                        return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'problème sur le alors du choix en indice '+tabchoix[j][0]}));
                    }
                }else if(tabchoix[j][1] == 'condition'){
                    niveau=niveau+1;
                    obj=js_condition0(tab,tabchoix[j][0],niveau);
                    niveau=niveau-1;
                    if(obj.status === true){
                        condition+=obj.value;
                    }else{
                        return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'1 problème sur la condition du choix en indice '+tabchoix[j][0]}));
                    }
                }else if(tabchoix[j][1] == 'increment'){
                    niveau=niveau+1;
                    obj=js_tabTojavascript1(tab,(tabchoix[j][0]+1),true,true,niveau);
                    niveau=niveau-1;
                    if(obj.status == true){
                        increment+=obj.value;
                        if(increment.substr(increment.length-1,1) === ';'){
                            increment=increment.substr(0,increment.length-1);
                        }
                    }else{
                        return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'problème sur le alors du choix en indice '+tabchoix[j][0]}));
                    }
                }else if(tabchoix[j][1] == 'faire'){
                    niveau=niveau+1;
                    obj=js_tabTojavascript1(tab,(tabchoix[j][0]+1),dansFonction,false,niveau);
                    niveau=niveau-1;
                    if(obj.status == true){
                        faire+=obj.value;
                    }else{
                        return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'problème sur le alors du choix en indice '+tabchoix[j][0]}));
                    }
                }
            }
            if((initialisation.substr(0,1) === '(') && (initialisation.substr(initialisation.length-1,1) === ')')){
                initialisation=initialisation.substr(1,initialisation.length-2);
            }
            if((condition.substr(0,1) === '(') && (condition.substr(condition.length-1,1) === ')')){
                condition=condition.substr(1,condition.length-2);
            }
            t+=espacesn(true,niveau);
            t+='for('+initialisation+';'+condition+';'+increment+'){';
            t+=faire;
            t+=espacesn(true,niveau);
            t+='}';
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if((tab[i][1] == 'essayer') && (tab[i][2] == 'f')){
            var contenu='';
            var sierreur='';
            var nomErreur='';
            for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                if(tab[j][3] == (tab[i][3]+1)){
                    if((tab[j][1] == 'faire') && (tab[j][2] == 'f')){
                        niveau=niveau+1;
                        obj=js_tabTojavascript1(tab,(j+1),dansFonction,false,niveau);
                        niveau=niveau-1;
                        if(obj.status == true){
                            contenu+=obj.value;
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le contenu du "essayer" '}));
                        }
                    }else if((tab[j][1] == 'sierreur') && (tab[j][2] == 'f')){
                        if(tab[j][8] == 2){
                            if(tab[j+1][2] == 'c'){
                                nomErreur=tab[j+1][1];
                                if((tab[j+2][1] == 'faire') && (tab[j+2][2] == 'f')){
                                    if(tab[j+2][8] == 0){
                                    }else{
                                        niveau=niveau+1;
                                        obj=js_tabTojavascript1(tab,(j+3),dansFonction,false,niveau);
                                        niveau=niveau-1;
                                        if(obj.status == true){
                                            sierreur+=obj.value;
                                        }else{
                                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" du "essayer" '}));
                                        }
                                    }
                                }else{
                                    return(logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" le deuxième argiment doit être "faire"'}));
                                }
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" le premier argiment doit être une variable'}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'problème sur le "sierreur" du "essayer" il doit contenir 2 arguments sierreur(e,faire)'}));
                        }
                    }
                }
            }
            t+=espacesn(true,niveau);
            t+='try{';
            t+=contenu;
            t+=espacesn(true,niveau);
            t+='}catch('+nomErreur+'){';
            t+=sierreur;
            t+=espacesn(true,niveau);
            t+='}';
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if((tab[i][1] == 'choix') && (tab[i][2] == 'f')){
            tabchoix=[];
            var aDesSinonSi=false;
            var aUnSinon=false;
            for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                if(tab[j][3] == (tab[i][3]+1)){
                    if(tab[j][1] == 'si'){
                        tabchoix.push(Array(j,tab[j][1],0,tab[j],0));
                        for(k=(j+1);k < l01;k=k+1){
                            if((tab[k][1] == 'alors') && (tab[k][3] == (tab[j][3]+1))){
                                tabchoix[tabchoix.length-1][2]=(k+1);
                                tabchoix[tabchoix.length-1][4]=tab[k][8];
                                break;
                            }
                            if(tab[k][3] < tab[j][3]){
                                break;
                            }
                        }
                    }else if(tab[j][1] == 'sinonsi'){
                        aDesSinonSi=true;
                        tabchoix.push(Array(j,tab[j][1],0,tab[j],0));
                        for(k=(j+1);k < l01;k=k+1){
                            if((tab[k][1] == 'alors') && (tab[k][3] == (tab[j][3]+1))){
                                tabchoix[tabchoix.length-1][2]=(k+1);
                                tabchoix[tabchoix.length-1][4]=tab[k][8];
                                break;
                            }
                            if(tab[k][3] < tab[j][3]){
                                break;
                            }
                        }
                    }else if(tab[j][1] == 'sinon'){
                        aUnSinon=true;
                        tabchoix.push(Array(j,tab[j][1],0,tab[j],0));
                        for(k=(j+1);k < l01;k=k+1){
                            if((tab[k][1] == 'alors') && (tab[k][3] == (tab[j][3]+1))){
                                tabchoix[tabchoix.length-1][2]=(k+1);
                                tabchoix[tabchoix.length-1][4]=tab[k][8];
                                break;
                            }
                            if(tab[k][3] < tab[j][3]){
                                break;
                            }
                        }
                    }else if(tab[j][1] == '#'){
                        tabchoix.push(Array(j,tab[j][1],0,tab[j]));
                    }else{
                        return(logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de choix est choix(si(condition(),alors()),sinonsi(condition(),alors()),sinon(alors()))'}));
                    }
                }
            }
            var tabTemp=[];
            for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                if((tab[i][0] == tab[tab[j][7]][7]) || (tab[i][0] == tab[j][7])){
                    if(((tab[j][1] == 'si') || (tab[j][1] == 'condition') || (tab[j][1] == 'alors') || (tab[j][1] == 'sinonsi') || (tab[j][1] == 'sinon') || (tab[j][1] == '#')) && (tab[j][2] == 'f')){
                        if(tab[j][1] == '#'){
                        }else{
                            tabTemp.push(tab[j]);
                        }
                    }else{
                        return(logerreur({status:false,value:t,id:j,tab:tab,'message':'file javascript.js : dans un choix, les niveaux doivent etre "si" "sinonsi" "sinon" et les sous niveaux "alors" et "condition" et non pas "'+JSON.stringify(tab[j])+'" '}));
                    }
                }
            }
            for(j=0;j < tabTemp.length;j=j+1){
                if(j == 0){
                    if((tabTemp[j][1] == 'si') && (tabTemp[j+1][1] == 'condition') && (tabTemp[j+2][1] == 'alors')){
                        j+=2;
                    }else{
                        return(logerreur({status:false,value:t,id:tabTemp[j][0],tab:tab,message:'un choix doit contenir au moins un "si" , une "condition" et un "alors" en première position [""]'}));
                    }
                }else{
                    if(tabTemp[j][1] == 'sinon'){
                        if((tabTemp[j+1][1] == 'alors') && ((j+2) == tabTemp.length)){
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans un choix le sinon doit être en derniere position'}));
                        }
                    }
                }
            }
            for(j=0;j < tabchoix.length;j=j+1){
                if(tabchoix[j][1] == '#'){
                    var niveauSi = (niveau+2);
                    var k = (j+1);
                    for(k=(j+1);k < tabchoix.length;k=k+1){
                        if(tabchoix[k][1] == 'si'){
                            niveauSi=(niveau+1);
                            break;
                        }
                    }
                    if(tab[tabchoix[j][0]][13].indexOf('\n') >= 0){
                        t+=espacesn(true,niveauSi);
                    }
                    var commt = traiteCommentaire2(tab[tabchoix[j][0]][13],niveauSi,tabchoix[j][0]);
                    t+='/*'+commt+'*/';
                    if(tab[j][13].indexOf('\n') >= 0){
                        t+=espacesn(true,niveauSi);
                    }
                }else if(tabchoix[j][1] == 'si'){
                    var tabComment=[];
                    var debutCondition=0;
                    var k = (i+1);
                    for(k=(i+1);(k < l01) && (tab[k][3] > tab[i][3]);k=k+1){
                        if(tab[k][1] == 'condition'){
                            debutCondition=k;
                            break;
                        }else if((tab[k][1] == '#') && (tab[k][3] == (tab[i][3]+2))){
                            tabComment.push(tab[k][13]);
                        }
                    }
                    var k=0;
                    for(k=0;k < tabComment.length;k=k+1){
                        if(tabComment[k].indexOf('\n') >= 0){
                            t+=espacesn(true,(niveau+1));
                        }
                        var commt = traiteCommentaire2(tabComment[k],(niveau+1),tabchoix[j][0]);
                        t+='/*'+commt+'*/';
                        if(tabComment[k].indexOf('\n') >= 0){
                            t+=espacesn(true,(niveau+1));
                        }
                    }
                    t+=espacesn(true,niveau);
                    t+='if(';
                    niveau=niveau+1;
                    obj=js_condition0(tab,debutCondition,niveau);
                    niveau=niveau-1;
                    if(obj.status === true){
                        if((obj.value.substr(0,1) === '(') && (obj.value.substr(obj.value.length-1,1) === ')')){
                            obj.value=obj.value.substr(1,obj.value.length-2);
                        }
                        t+=obj.value;
                    }else{
                        return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'2 problème sur la condition du choix en indice '+tabchoix[j][0]}));
                    }
                    t+='){';
                    if((tabchoix[j][2] > 0) && (tabchoix[j][4] > 0)){
                        niveau=niveau+1;
                        obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
                        niveau=niveau-1;
                        if(obj.status == true){
                            t+=obj.value;
                        }else{
                            return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'problème sur le alors du choix en indice '+tabchoix[j][0]}));
                        }
                    }
                    if(aDesSinonSi){
                    }else{
                        if(aUnSinon){
                        }else{
                            t+=espacesn(true,niveau);
                            t+='}';
                        }
                    }
                }else if(tabchoix[j][1] == 'sinonsi'){
                    var tabComment=[];
                    var debutCondition=0;
                    var k=tabchoix[j][0];
                    for(k=tabchoix[j][0];(k < l01) && (tab[k][3] > tab[i][3]);k=k+1){
                        if(tab[k][1] == 'condition'){
                            debutCondition=k;
                            break;
                        }else if(tab[k][1] == '#'){
                            tabComment.push(tab[k][13]);
                        }
                    }
                    var k=0;
                    for(k=0;k < tabComment.length;k=k+1){
                        if(tabComment[k].indexOf('\n') >= 0){
                            t+=espacesn(true,(niveau+1));
                        }
                        var commt = traiteCommentaire2(tabComment[k],(niveau+1),tabchoix[j][0]);
                        t+='/*'+commt+'*/';
                        if(tabComment[k].indexOf('\n') >= 0){
                            t+=espacesn(true,(niveau+1));
                        }
                    }
                    t+=espacesn(true,niveau);
                    t+='}else if(';
                    niveau=niveau+1;
                    obj=js_condition0(tab,debutCondition,niveau);
                    niveau=niveau-1;
                    if(obj.status === true){
                        if((obj.value.substr(0,1) === '(') && (obj.value.substr(obj.value.length-1,1) === ')')){
                            obj.value=obj.value.substr(1,obj.value.length-2);
                        }
                        t+=obj.value;
                    }else{
                        return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'3 problème sur la condition du choix en indice '+tabchoix[j][0]}));
                    }
                    t+='){';
                    if((tabchoix[j][2] > 0) && (tabchoix[j][4] > 0)){
                        niveau=niveau+1;
                        obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
                        niveau=niveau-1;
                        if(obj.status == true){
                            t+=obj.value;
                        }else{
                            return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'problème sur le alors du choix en indice '+tabchoix[j][0]}));
                        }
                    }
                    if(aUnSinon){
                    }else{
                        if(j == tabchoix.length-1){
                            t+=espacesn(true,niveau);
                            t+='}';
                        }
                    }
                }else{
                    t+=espacesn(true,niveau);
                    t+='}else{';
                    if((tabchoix[j][2] > 0) && (tabchoix[j][4] > 0)){
                        niveau=niveau+1;
                        obj=js_tabTojavascript1(tab,tabchoix[j][2],dansFonction,false,niveau);
                        niveau=niveau-1;
                        if(obj.status == true){
                            t+=obj.value;
                        }else{
                            return(logerreur({status:false,value:t,id:tabchoix[j][0],tab:tab,'message':'problème sur le alors du choix en indice '+tabchoix[j][0]}));
                        }
                    }
                    t+=espacesn(true,niveau);
                    t+='}';
                }
            }
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if((tab[i][1] == 'affecteFonction') && (tab[i][2] == 'f')){
            if((tab[i+1][2] == 'c') && (tab[i][8] >= 2)){
            }else{
                return(logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'}));
            }
            if((tab[i+2][2] == 'f') && (tab[i+2][1] == 'appelf') && (tab[i][8] >= 2)){
            }else{
                return(logerreur({status:false,value:t,id:id,tab:tab,message:'dans affecteFonction il faut au moins deux parametres affecteFonction(xxx,appelf(n(function),p(x),contenu()))'}));
            }
            obj=js_traiteAppelFonction(tab,(i+2),true,niveau,false);
            if(obj.status == true){
                t+=espacesn(true,niveau);
                t+=''+(tab[i+1][1])+'='+obj.value+';';
            }else{
                return(logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'}));
            }
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if(((tab[i][1] == 'affecte') || (tab[i][1] == 'dans') || (tab[i][1] == 'affectop')) && (tab[i][2] == 'f')){
            var tabAffecte={};
            var signe='=';
            var numeroPar=0;
            var j = (i+1);
            for(j=(i+1);j < l01;j=j+1){
                if(tab[j][3] <= tab[i][3]){
                    break;
                }
                if(tab[j][7] === tab[i][0]){
                    if((tab[j][1] == '#') && (tab[j][2] == 'f')){
                    }else{
                        if(tab[i][1] == 'affectop'){
                            if(numeroPar == 0){
                                signe=tab[j][1];
                                numeroPar=numeroPar+1;
                            }else{
                                tabAffecte['par'+(numeroPar-1)]=tab[j];
                                numeroPar=numeroPar+1;
                            }
                        }else{
                            tabAffecte['par'+numeroPar]=tab[j];
                            numeroPar=numeroPar+1;
                        }
                    }
                }
            }
            if(tab[i][1] == 'dans'){
                signe=' in ';
            }else if(tab[i][1] == 'affecte'){
                signe='=';
            }
            if( !(dansInitialisation)){
                t+=espacesn(true,niveau);
            }
            if( !(tabAffecte['par1'])){
                debugger;
            }
            var objInstructionGauche = js_traiteInstruction1(tab,niveau,tabAffecte['par0'][0]);
            if(objInstructionGauche.status === true){
                var objInstructionDroite = js_traiteInstruction1(tab,niveau,tabAffecte['par1'][0]);
                if(objInstructionDroite.status === true){
                    t+=''+objInstructionGauche.value+signe+objInstructionDroite.value;
                    if( !(dansInitialisation)){
                        t+=';';
                    }
                }else{
                    return(logerreur({status:false,value:t,id:id,tab:tab,message:'dans appelf de "affecte" ou "dans" 0802 '}));
                }
            }else{
                return(logerreur({status:false,value:t,id:id,tab:tab,message:'dans appelf de "affecte" ou "dans" 0805 '}));
            }
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if((tab[i][1] == 'declare') && (tab[i][2] == 'f')){
            t+=espacesn(true,niveau);
            var tabdeclare=[];
            for(j=(i+1);j < l01;j=j+1){
                if(tab[j][3] <= tab[i][3]){
                    break;
                }
                if(tab[j][7] == tab[i][0]){
                    if((tab[j][1] === '#') && (tab[j][2] === 'f')){
                    }else{
                        tabdeclare.push(tab[j]);
                    }
                }
            }
            if(tabdeclare.length == 2){
                if((tabdeclare[0][2] == 'c') && (tabdeclare[1][2] == 'c')){
                    /*
                      if[ [tabdeclare[1][1]=='vrai' || tabdeclare[1][1]=='faux' ] && tabdeclare[1][4]===false]{
                      t+='var '+tabdeclare[0][1]+'='+[tabdeclare[1][1]==='vrai'?'true':'false']+';';
                      
                      }else{
                      t+='var '+tabdeclare[0][1]+'='+[tabdeclare[1][4]===true?'\''+tabdeclare[1][1]+'\';' : tabdeclare[1][1]+';'];
                      }
                    */
                    t+='var '+tabdeclare[0][1]+'='+maConstante(tabdeclare[1])+';';
                }else{
                    if((tabdeclare[0][2] == 'c') && (tabdeclare[1][2] == 'f')){
                        if((tabdeclare[1][1] == 'new') && (tabdeclare[1][8] == 1) && (tab[i+3][1] == 'appelf')){
                            t+='var '+tabdeclare[0][1]+'= new ';
                            obj=js_traiteAppelFonction(tab,(tabdeclare[1][0]+1),true,niveau,false);
                            if(obj.status == true){
                                t+=obj.value+';';
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans une déclaration'}));
                            }
                        }else if(tabdeclare[1][1] == 'obj'){
                            if(tabdeclare[1][8] == 0){
                                t+='var '+tabdeclare[0][1]+'={};';
                            }else{
                                obj=js_traiteDefinitionObjet(tab,tabdeclare[1][0],true);
                                if(obj.status == true){
                                    t+='var '+tabdeclare[0][1]+'='+obj.value+';';
                                }else{
                                    return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans obj de "declare" ou "dans" il y a un problème'}));
                                }
                            }
                        }else if(tabdeclare[1][1] == 'appelf'){
                            obj=js_traiteAppelFonction(tab,tabdeclare[1][0],true,niveau,false);
                            if(obj.status == true){
                                t+='var '+tabdeclare[0][1]+' = '+obj.value+';';
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans une déclaration'}));
                            }
                        }else if((tabdeclare[1][1] == 'condition') && (tabdeclare[1][2] === 'f')){
                            obj=js_condition1(tab,(tabdeclare[1][0]+1),niveau);
                            if(obj.status == true){
                                t+='var '+tabdeclare[0][1]+' = '+obj.value+';';
                            }else{
                                return(logerreur({status:false,value:t,id:id,message:'erreur dans une condition'}));
                            }
                        }else if((tabdeclare[1][2] === 'f') && ((tabdeclare[1][1] == 'plus') || (tabdeclare[1][1] == 'moins') || (tabdeclare[1][1] == 'mult') || (tabdeclare[1][1] == 'divi'))){
                            var objOperation = TraiteOperations1(tab,tabdeclare[1][0],niveau);
                            if(objOperation.status == true){
                                t+='var '+tabdeclare[0][1]+' = '+objOperation.value+';';
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1249 sur declaration '}));
                            }
                        }else if((tabdeclare[1][1] == 'tableau') && (tabdeclare[1][2] === 'f')){
                            var objTableau = js_traiteTableau1(tab,tabdeclare[1][0],true,niveau,false);
                            if(objTableau.status == true){
                                t+='var '+tabdeclare[0][1]+' = '+objTableau.value+';';
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1007 sur declaration '}));
                            }
                        }else if((tabdeclare[1][1] == 'testEnLigne') && (tabdeclare[1][2] === 'f')){
                            var objtestLi = js_traiteInstruction1(tab,niveau,tabdeclare[1][0]);
                            if(obj.status == true){
                                t+='var '+tabdeclare[0][1]+' = '+objtestLi.value+';';
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur TraiteOperations1 1351'}));
                            }
                        }else{
                            return(logerreur({status:false,id:i,message:'javascript.js 0957 : cas dans declare non prévu'}));
                        }
                    }else{
                        return(logerreur({status:false,id:i,message:'javascript.js 0960 : cas dans declare non prévu'}));
                    }
                }
            }else{
                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans une déclaration 0996, declare  doit avoir 2 paramètres'}));
            }
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else if((tab[i][1] == '#') && (tab[i][2] == 'f')){
            if(tab[i][13].substr(0,1) == '#'){
                t+='\n';
            }else{
                t+=espacesn(true,niveau);
            }
            var commt = traiteCommentaire2(tab[i][13],niveau,i);
            t+='/*'+commt;
            if(tab[i][13].substr(0,1) == '#'){
                t+='\n';
            }
            t+='*/';
        }else if((tab[i][1] == 'throw') && (tab[i][2] == 'f')){
            t+=espacesn(true,niveau);
            if((tab[i+1][1] == 'new') && (tab[i+1][8] == 1) && (tab[i+2][1] == 'appelf')){
                obj=js_traiteAppelFonction(tab,(i+2),true,niveau,false);
                if(obj.status == true){
                    t+='throw new '+obj.value+';';
                }else{
                    return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans une déclaration'}));
                }
            }else{
                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur dans throw 0953'}));
            }
            reprise=(i+1);
            max=(i+1);
            for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                reprise=j;
            }
            i=reprise;
        }else{
            t+=espacesn(true,niveau);
            logerreur({status:false,value:t,id:i,tab:tab,'message':'javascript.js traitement non prévu 1057 '+JSON.stringify(tab[i])});
        }
    }
    return({status:true,value:t});
}
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
    for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
        if((tab[j][1] == 'nomt') && (tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
            positionAppelTableau=j;
            if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                nomTableau=tab[j+1][1];
                if(nomTableau == 'Array'){
                    nbEnfants=tab[tab[tab[j+1][7]][7]][8]-1;
                }
            }else if((tab[j][8] == 1) && (tab[j+1][2] == 'f') && (tab[j+1][1] == 'tableau')){
                var obj = js_traiteTableau1(tab,(j+1),true,niveau,true);
                if(obj.status === true){
                    nomTableau=obj.value;
                }else{
                    logerreur({status:false,value:t,id:i,tab:tab,message:'1045 problème dans un tableau de tableau '});
                }
            }
            break;
        }
    }
    if((positionAppelTableau > 0) && (nomTableau != '')){
        for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
            if(tab[j][3] == tab[i][3]){
                break;
            }
            if((tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
                if((tab[j][1] == 'nomt') || (tab[j][1] == 'p') || (tab[j][1] == '#') || (tab[j][1] == 'prop')){
                    continue;
                }else{
                    logerreur({status:false,value:t,id:i,tab:tab,'message':'1107 les seuls paramètres de tableau sont nomt,p,prop "'+tab[j][1]+'"'});
                }
            }
        }
        argumentsFonction='';
        for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
            if((tab[j][1] == 'p') && (tab[j][3] == (tab[i][3]+1))){
                if((tab[j][8] == 0) && (tab[j+1][2] == 'f')){
                    argumentsFonction+=',';
                }else if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                    argumentsFonction+='['+maConstante(tab[j+1])+']';
                }else if((tab[j][8] > 1) && (tab[j+1][2] == 'c')){
                    var opPrecedente='';
                    for(k=(j+1);k < l01;k=k+1){
                        if(tab[k][3] <= tab[j][3]){
                            break;
                        }else{
                            if(nomTableau == 'concat'){
                                if(tab[k][1] == '+'){
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
                    if((tab[j][8] == 1) && (tab[j+1][1] == 'obj')){
                        obj=js_traiteDefinitionObjet(tab,(j+1),true);
                        if(obj.status == true){
                            argumentsFonction+='['+obj.value+']';
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans js_traiteTableau1 Objet il y a un problème'}));
                        }
                    }else if((tab[j][8] == 1) && (tab[j+1][2] == 'f')){
                        if(tab[j+1][1] == 'p'){
                            obj=js_tabTojavascript1(tab,(j+1),false,false,niveau);
                            if(obj.status == true){
                                if((nomTableau == 'Array') && (nbEnfants >= 4)){
                                    forcerNvelleLigneEnfant=true;
                                }
                                argumentsFonction+='['+obj.value+']';
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else if((tab[j+1][1] == 'mult') || (tab[j+1][1] == 'plus') || (tab[j+1][1] == 'moins')){
                            var objOperation = TraiteOperations1(tab,(j+1),niveau);
                            if(objOperation.status == true){
                                argumentsFonction+='['+objOperation.value+']';
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1249 sur des opérations '}));
                            }
                        }else if(tab[j+1][1] == 'tableau'){
                            var objTableau = js_traiteTableau1(tab,(j+1),true,niveau,false);
                            if(objTableau.status === true){
                                argumentsFonction+='['+objTableau.value+']';
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1007 sur declaration '}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:j,tab:tab,'message':'erreur 1145 dans un appel de fonction imbriqué pour la fonction inconnue '+(tab[j+1][1])}));
                        }
                    }
                }
            }else if((tab[j][1] == 'prop') && (tab[j][3] == (tab[i][3]+1))){
                termineParUnePropriete=true;
                if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                    proprietesTableau+='.'+maConstante(tab[j+1]);
                }else{
                    if((tab[j][8] == 1) && (tab[j+1][2] == 'f')){
                        if(tab[j+1][1] == 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=js_traiteAppelFonction(tab,(j+1),true,niveau,true);
                            if(obj.status == true){
                                proprietesTableau+='.'+obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:j,tab:tab,'message':'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[j][1]}));
                        }
                    }
                }
            }
        }
        t+=nomTableau;
        t+=argumentsFonction;
        t+=proprietesTableau;
        if( !(dansConditionOuDansFonction)){
            t+=';';
        }
    }else{
        return(logerreur({status:false,value:t,id:i,tab:tab,message:' dans js_traiteTableau1 il faut un nom de tableau nomt(xxxx)'}));
    }
    return({status:true,value:t,'forcerNvelleLigneEnfant':forcerNvelleLigneEnfant,'termineParUnePropriete':termineParUnePropriete});
}
function js_traiteInstruction1(tab,niveau,id){
    var t='';
    if(tab[id][2] === 'c'){
        t+=maConstante(tab[id]);
    }else if((tab[id][2] == 'f') && (tab[id][1] == 'appelf')){
        var obj = js_traiteAppelFonction(tab,tab[id][0],true,niveau,false);
        if(obj.status == true){
            t+=obj.value;
        }else{
            return(logerreur({status:false,value:t,id:id,tab:tab,message:'dans js_traiteInstruction1 1043 '}));
        }
    }else if((tab[id][1] == 'plus') || (tab[id][1] == 'mult') || (tab[id][1] == 'moins') || (tab[id][1] == 'etBin')){
        var objOperation = TraiteOperations1(tab,tab[id][0]);
        if(objOperation.status == true){
            t+=objOperation.value;
        }else{
            return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur sur js_traiteInstruction1 1050 '}));
        }
    }else if(tab[id][1] == 'obj'){
        var obj = js_traiteDefinitionObjet(tab,tab[id][0],true);
        if(obj.status == true){
            t+=obj.value;
        }else{
            return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur sur js_traiteInstruction1 1064 '}));
        }
    }else if(tab[id][1] == 'tableau'){
        var objTableau = js_traiteTableau1(tab,tab[id][0],true,niveau,false);
        if(objTableau.status == true){
            t+=objTableau.value;
        }else{
            return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1007 sur declaration '}));
        }
    }else if(tab[id][1] == 'testEnLigne'){
        var testEnLigne=[];
        var j = (id+1);
        for(j=(id+1);(j < tab.length) && (tab[j][3] > tab[id][3]);j=j+1){
            if(tab[j][3] == (tab[id][3]+1)){
                if(tab[j][1] == 'condition'){
                    testEnLigne.push(Array(j,tab[j][1],id));
                }else if(tab[j][1] == 'siVrai'){
                    testEnLigne.push(Array(j,tab[j][1],id));
                }else if(tab[j][1] == 'siFaux'){
                    testEnLigne.push(Array(j,tab[j][1],id));
                }else{
                    return(logerreur({status:false,value:t,id:id,tab:tab,message:'la syntaxe de boucle est boucle(condition(),initialisation(),increment(),faire())'}));
                }
            }
        }
        if(testEnLigne.length !== 3){
            return(logerreur({status:false,message:'fonction js_traiteInstruction1 1524 il faut un format testEnLigne(condition() , siVrai(1) , siFaux(2))"'}));
        }
        var j=0;
        for(j=0;j < testEnLigne.length;j=j+1){
            if(testEnLigne[j][1] === 'condition'){
                niveau=niveau+1;
                var objCondition = js_condition0(tab,testEnLigne[j][0],niveau);
                niveau=niveau-1;
                if(objCondition.status === true){
                }else{
                    return(logerreur({status:false,value:t,id:testEnLigne[j][0],tab:tab,'message':'1 js_traiteInstruction1 sur condition 1533 '+testEnLigne[j][0]}));
                }
            }else if(testEnLigne[j][1] === 'siVrai'){
                niveau=niveau+1;
                var objSiVrai = js_traiteInstruction1(tab,niveau,(testEnLigne[j][0]+1));
                niveau=niveau-1;
                if(objSiVrai.status === true){
                }else{
                    return(logerreur({status:false,value:t,id:testEnLigne[j][0],tab:tab,'message':'1 js_traiteInstruction1 sur siVrai 1542 '+testEnLigne[j][0]}));
                }
            }else if(testEnLigne[j][1] === 'siFaux'){
                niveau=niveau+1;
                var objSiFaux = js_traiteInstruction1(tab,niveau,(testEnLigne[j][0]+1));
                niveau=niveau-1;
                if(objSiFaux.status === true){
                }else{
                    return(logerreur({status:false,value:t,id:testEnLigne[j][0],tab:tab,'message':'1 js_traiteInstruction1 sur objSiFaux 1716 '+testEnLigne[j][0]}));
                }
            }
        }
        t='('+objCondition.value+'?'+objSiVrai.value+':'+objSiFaux.value+')';
    }else if(tab[id][1] === 'condition'){
        var objcond = js_condition0(tab,tab[id][0],niveau);
        if(objcond.status == true){
            t+=objcond.value;
        }else{
            return(logerreur({status:false,value:t,id:id,tab:tab,message:'js_traiteInstruction1 1313'}));
        }
    }else{
        return(logerreur({status:false,value:t,id:id,tab:tab,'message':'erreur sur js_traiteInstruction1 1230 pour '+tab[id][1]}));
    }
    return({status:true,value:t});
}
function js_traiteDefinitionObjet(tab,id,dansConditionOuDansFonction){
    var t='';
    var j=0;
    var obj={};
    var textObj='';
    for(j=(id+1);(j < tab.length) && (tab[j][3] > tab[id][3]);j=j+1){
        if(tab[j][3] == (tab[id][3]+1)){
            if((tab[j][1] == '') && (tab[j][2] == 'f')){
                if(tab[j][8] == 2){
                    if(tab[j+2][2] === 'f'){
                        if(tab[j+2][1] == 'obj'){
                            obj=js_traiteDefinitionObjet(tab,(j+2),true);
                            if(obj.status == true){
                                textObj+=','+'\''+(tab[j+1][1])+'\''+':'+obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'dans js_traiteDefinitionObjet il y a un problème'}));
                            }
                        }else if(tab[j+2][1] == 'plus'){
                            var objOperation = TraiteOperations1(tab,(j+2),0);
                            if(objOperation.status == true){
                                textObj+=','+'\''+(tab[j+1][1])+'\''+':'+objOperation.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur js_traiteDefinitionObjet 1496 sur des opérations '}));
                            }
                        }else if(tab[j+2][1] == 'appelf'){
                            var objfnt1 = js_traiteAppelFonction(tab,(j+2),true,0,true);
                            if(objfnt1.status === true){
                                textObj+=','+'\''+(tab[j+1][1])+'\''+':'+objfnt1.value;
                            }else{
                                logerreur({status:false,value:t,id:j,tab:tab,'message':'1069 erreur sur appel de fonction nom "'+tab[j][1]+'"'});
                            }
                        }else if(tab[j+2][1] == 'tableau'){
                            var objTableau = js_traiteTableau1(tab,(j+2),true,0,false);
                            if(objTableau.status == true){
                                textObj+=','+'\''+(tab[j+1][1])+'\''+':'+objTableau.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1392 sur js_traiteDefinitionObjet '}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:id,tab:tab,'message':'dans js_traiteDefinitionObjet, 1492 "'+(tab[j+2][1])+'"'}));
                        }
                    }else{
                        textObj+=','+maConstante(tab[j+1])+':'+maConstante(tab[j+2]);
                    }
                }
            }
        }
    }
    t+='{';
    if(textObj != ''){
        t+=textObj.substr(1);
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
    positionAppelFonction=-1;
    for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
        if((tab[j][1] == 'nomf') && (tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
            positionAppelFonction=j;
            if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                nomFonction=tab[j+1][1];
                if(nomFonction == 'Array'){
                    nbEnfants=tab[tab[tab[j+1][7]][7]][8]-1;
                }
            }else if((tab[j][8] == 2) && (tab[j+1][1] == 'new')){
                nomFonction=tab[j+1][1]+' '+(tab[j+2][1]);
            }else if((tab[j+1][1] == 'appelf') && (tab[j+1][2] == 'f')){
                var obj1 = js_traiteAppelFonction(tab,(j+1),true,niveau,true);
                if(obj1.status === true){
                    nomFonction=obj1.value;
                    enfantTermineParUnePropriete=obj1.termineParUnePropriete;
                    aDesAppelsRecursifs=true;
                }else{
                    logerreur({status:false,value:t,id:i,tab:tab,'message':'1069 erreur sur appel de fonction nom "'+tab[j][1]+'"'});
                }
            }
            break;
        }
    }
    if((positionAppelFonction > 0) && (nomFonction != '')){
        nomRetour='';
        positionRetour=-1;
        for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
            if((tab[j][1] == 'r') && (tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
                if(tab[j][8] == 1){
                    nomRetour=tab[j+1][1];
                }
                positionRetour=j;
                break;
            }
        }
        for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
            if((tab[j][1] == 'element') && (tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
                if(tab[j][8] == 1){
                    if(tab[j+1][2] === 'c'){
                        /*
                          if[tab[j+1][4]==true]{
                          nomElement='\''+tab[j+1][1]+'\'';
                          }else{
                          nomElement=tab[j+1][1];
                          }
                        */
                        nomElement=maConstante(tab[j+1]);
                    }else if(tab[j+1][2] === 'f'){
                        var objinst = js_traiteInstruction1(tab,niveau,(j+1));
                        if(objinst.status === true){
                            nomElement=objinst.value;
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'element incorrecte dans appelf 1592 '}));
                        }
                    }
                }
                break;
            }
        }
        for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
            if(tab[j][3] == tab[i][3]){
                break;
            }
            if((tab[j][2] == 'f') && (tab[j][3] == (tab[i][3]+1))){
                if((tab[j][1] == 'element') || (tab[j][1] == 'nomf') || (tab[j][1] == 'p') || (tab[j][1] == 'appelf') || (tab[j][1] == 'r') || (tab[j][1] == 'prop') || (tab[j][1] == '#') || (tab[j][1] == 'contenu')){
                    continue;
                }else{
                    logerreur({status:false,value:t,id:i,tab:tab,'message':'1107 les seuls paramètres de appelf sont nomf,p,r,element et non pas "'+tab[j][1]+'"'});
                }
            }
        }
        argumentsFonction='';
        for(j=(i+1);(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
            if((tab[j][1] == 'obj') && (tab[j][3] == (tab[i][3]+1))){
                obj=js_traiteDefinitionObjet(tab,j,true);
                if(obj.status == true){
                    argumentsFonction+=','+obj.value+'';
                }else{
                    return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans js_traiteAppelFonction Objet il y a un problème'}));
                }
                reprise=(i+1);
                max=(i+1);
                for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                    reprise=j;
                }
                i=reprise;
            }else if((tab[j][1] == 'prop') && (tab[j][3] == (tab[i][3]+1))){
                termineParUnePropriete=true;
                if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                    proprietesFonction+='.'+maConstante(tab[j+1]);
                }else{
                    if((tab[j][8] == 1) && (tab[j+1][2] == 'f')){
                        if(tab[j+1][1] == 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=js_traiteAppelFonction(tab,(j+1),true,niveau,true);
                            if(obj.status == true){
                                proprietesFonction+='.'+obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:j,tab:tab,'message':'erreur dans un appel de fonction imbriqué 2 pour la fonction inconnue '+tab[j][1]}));
                        }
                    }
                }
            }else if((tab[j][1] == 'appelf') && (tab[j][3] == (tab[i][3]+1))){
                aDesAppelsRecursifs=true;
                if(tab[j+1][1] == 'cascade'){
                    obj=js_tabTojavascript1(tab,j,false,false,niveau);
                }else{
                    obj=js_traiteAppelFonction(tab,j,true,niveau,true);
                }
                if(obj.status == true){
                    argumentsFonction+=',';
                    if((nomFonction == 'Array') && (nbEnfants >= 4)){
                        forcerNvelleLigneEnfant=true;
                        argumentsFonction+=espacesn(true,(niveau+1));
                    }
                    argumentsFonction+=obj.value;
                }else{
                    return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                }
            }else if((tab[j][1] == 'contenu') && (tab[j][3] == (tab[i][3]+1))){
                if(nomFonction == 'function'){
                    contenu='';
                    obj=js_tabTojavascript1(tab,(j+1),false,false,(niveau+1));
                    if(obj.status == true){
                        contenu+=obj.value;
                    }else{
                        return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appelf sur  le contenu d\'une fonction "function" '}));
                    }
                }else{
                    return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appelf, seule une fonction "function" peut avoir un contenu '}));
                }
            }else if((tab[j][1] == 'p') && (tab[j][3] == (tab[i][3]+1))){
                if((tab[j][8] == 0) && (tab[j+1][2] == 'f')){
                    argumentsFonction+=',';
                }else if((tab[j][8] == 1) && (tab[j+1][2] == 'c')){
                    argumentsFonction+=','+maConstante(tab[j+1]);
                }else if((tab[j][8] > 1) && (tab[j+1][2] == 'c')){
                    var opPrecedente='';
                    for(k=(j+1);k < l01;k=k+1){
                        if(k == (j+1)){
                            argumentsFonction+=',';
                        }
                        if(tab[k][3] <= tab[j][3]){
                            break;
                        }else{
                            if(nomFonction == 'concat'){
                                if(tab[k][1] == '+'){
                                    argumentsFonction+=',';
                                }else{
                                    argumentsFonction+=''+maConstante(tab[k]);
                                }
                            }else{
                                debugger;
                            }
                        }
                    }
                }else{
                    if((tab[j][8] == 1) && (tab[j+1][1] == 'obj')){
                        obj=js_traiteDefinitionObjet(tab,(j+1),true);
                        if(obj.status == true){
                            argumentsFonction+=','+obj.value+'';
                        }else{
                            return(logerreur({status:false,value:t,id:i,tab:tab,message:'dans js_traiteAppelFonction Objet il y a un problème'}));
                        }
                    }else if((tab[j][8] == 1) && (tab[j+1][2] == 'f')){
                        if((tab[j+1][1] == 'appelf') || (tab[j+1][1] == 'cascade')){
                            aDesAppelsRecursifs=true;
                            if(tab[j+1][1] == 'cascade'){
                                obj=js_tabTojavascript1(tab,(j+1),false,false,niveau);
                            }else{
                                obj=js_traiteAppelFonction(tab,(j+1),true,niveau,true);
                            }
                            if(obj.status == true){
                                argumentsFonction+=',';
                                if((nomFonction == 'Array') && (nbEnfants >= 4)){
                                    forcerNvelleLigneEnfant=true;
                                    argumentsFonction+=espacesn(true,(niveau+1));
                                }
                                argumentsFonction+=obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else if(tab[j+1][1] == 'p'){
                            obj=js_tabTojavascript1(tab,(j+1),false,false,niveau);
                            if(obj.status == true){
                                argumentsFonction+=',';
                                if((nomFonction == 'Array') && (nbEnfants >= 4)){
                                    forcerNvelleLigneEnfant=true;
                                    argumentsFonction+=espacesn(true,(niveau+1));
                                }
                                argumentsFonction+=obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur dans un appel de fonction imbriqué 1'}));
                            }
                        }else if(tab[j+1][1] == '@'){
                            argumentsFonction+=',';
                            argumentsFonction+=tab[j+1][13];
                        }else if((tab[j+1][1] == 'mult') || (tab[j+1][1] == 'plus') || (tab[j+1][1] == 'moins')){
                            var objOperation = TraiteOperations1(tab,(j+1),niveau);
                            if(objOperation.status == true){
                                argumentsFonction+=',';
                                argumentsFonction+=objOperation.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1249 sur des opérations '}));
                            }
                        }else if(tab[j+1][1] == 'tableau'){
                            var objTableau = js_traiteTableau1(tab,tab[j+1][0],true,niveau,false);
                            if(objTableau.status == true){
                                argumentsFonction+=',';
                                argumentsFonction+=objTableau.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1007 sur declaration '}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:j,tab:tab,'message':'erreur 1651 dans un appel de fonction imbriqué pour la fonction inconnue '+(tab[j+1][1])}));
                        }
                    }
                }
            }
        }
        if( !(dansConditionOuDansFonction)){
            t+=espacesn(true,niveau);
        }
        t+=((nomRetour != '')?nomRetour+'=':'');
        if((recursif === true) && (nomRetour == '') &&  !(dansConditionOuDansFonction)){
            t+=espacesn(true,(niveau+1))+((nomElement == '')?'':nomElement+'.')+nomFonction;
        }else{
            t+=((nomElement == '')?'':nomElement+'.')+nomFonction;
        }
        if( !(enfantTermineParUnePropriete)){
            t+='(';
        }
        t+=((argumentsFonction !== '')?argumentsFonction.substr(1):'');
        if(((aDesAppelsRecursifs) &&  !(dansConditionOuDansFonction) && (nomRetour == '') && (nomElement == '') && (enfantTermineParUnePropriete === false)) || (forcerNvelleLigneEnfant)){
            t+=espacesn(true,niveau);
        }
        if( !(enfantTermineParUnePropriete)){
            t+=')';
        }
        if(nomFonction == 'function'){
            t+='{'+contenu;
            t+=espacesn(true,niveau);
            t+='}';
        }
        t+=proprietesFonction;
        if( !(dansConditionOuDansFonction)){
            t+=';';
        }
    }else{
        return(logerreur({status:false,value:t,id:i,tab:tab,message:' dans js_traiteAppelFonction il faut un nom de fonction à appeler nomf(xxxx)'}));
    }
    return({status:true,value:t,'forcerNvelleLigneEnfant':forcerNvelleLigneEnfant,'termineParUnePropriete':termineParUnePropriete});
}
function TraiteOperations1(tab,id,niveau){
    var t='';
    var i=0;
    var j=0;
    /*
      dans le cas d'un "plus" simple on est peut être au milieu d'une concaténation de chaine.
      Si un des deux paramètre est numérique il est plus prudent d'ajouter une parenthèse
      a+='e['+[f+1]+'] g '+h+' i';
    */
    var condi0 = ((tab[id][8] === 2) && (tab[id][1] === 'plus')) && (((tab[id+1][2] === 'c') && (isNumeric(tab[id+1][1]))) || ((tab[id+2][2] === 'c') && (isNumeric(tab[id+2][1]))));
    var l01=tab.length;
    var parentId=tab[id][0];
    var numEnfant=1;
    var i = (id+1);
    for(i=(id+1);i < l01;i=i+1){
        if(tab[i][3] <= tab[parentId][3]){
            break;
        }
        if(tab[i][7] == parentId){
            if(tab[i][1] == '#'){
            }else if((tab[i][1] == '') && (tab[i][2] == 'f')){
                var objOperation = TraiteOperations1(tab,(i+1));
                if(objOperation.status == true){
                    if(tab[parentId][1] == 'mult'){
                        t+='*';
                    }else if(tab[parentId][1] == 'plus'){
                        t+='+';
                    }else if(tab[parentId][1] == 'moins'){
                        t+='-';
                    }else if(tab[parentId][1] == 'etBin'){
                        t+='&';
                    }
                    t+='('+objOperation.value+')';
                }else{
                    return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                }
            }else{
                if(numEnfant == 1){
                    numEnfant=numEnfant+1;
                    if(tab[i][2] == 'c'){
                        if((tab[i][4] === 1) || (tab[i][4] === 2)){
                            t+=maConstante(tab[i]);
                        }else{
                            if(condi0){
                                t+='('+tab[i][1];
                            }else{
                                t+=tab[i][1];
                            }
                        }
                    }else if(tab[i][2] == 'f'){
                        if(tab[i][1] == '#'){
                        }else if((tab[i][1] == 'mult') || (tab[i][1] == 'plus') || (tab[i][1] == 'moins') || (tab[i][1] == 'mult') || (tab[i][1] == 'divi') || (tab[i][1] == 'etBin')){
                            var objOperation = TraiteOperations1(tab,i);
                            if(objOperation.status == true){
                                t+=''+objOperation.value+'';
                            }else{
                                return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                            }
                        }else if(tab[i][1] == ''){
                            var objOperation = TraiteOperations1(tab,(i+1));
                            if(objOperation.status == true){
                                t+='('+objOperation.value+')';
                            }else{
                                return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                            }
                        }else if(tab[i][1] == 'appelf'){
                            obj=js_traiteAppelFonction(tab,i,true,niveau,false);
                            if(obj.status == true){
                                t+=obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur TraiteOperations1 1351'}));
                            }
                        }else if(tab[i][1] == 'tableau'){
                            var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                            if(objTableau.status == true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1844 sur TraiteOperations1 '}));
                            }
                        }else if(tab[i][1] == 'testEnLigne'){
                            var objtestLi = js_traiteInstruction1(tab,niveau,i);
                            if(objtestLi.status == true){
                                t+=objtestLi.value;
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur TraiteOperations1 1808'}));
                            }
                        }else{
                            return(logerreur({status:false,'message':'fonction du premier paramètre non reconnue TraiteOperations1 1347 "'+tab[i][1]+'"'}));
                        }
                    }else{
                        return(logerreur({status:false,message:'TraiteOperations1 pour une opération, le premier paramètre doit être une constante'}));
                    }
                }else{
                    if(tab[parentId][1] == ''){
                        var objOperation = TraiteOperations1(tab,(i+1));
                        if(objOperation.status == true){
                            t+='('+objOperation.value+')';
                        }else{
                            return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                        }
                    }else if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                        t+='*(';
                    }else if(tab[parentId][1] == 'plus'){
                        t+='+';
                    }else if(tab[parentId][1] == 'moins'){
                        t+='-';
                    }else if(tab[parentId][1] == 'etBin'){
                        t+='&';
                    }
                    if(tab[i][2] === 'f'){
                        if((tab[i][1] == 'mult') || (tab[i][1] == 'plus') || (tab[i][1] == 'moins') || (tab[i][1] == 'etBin')){
                            var objOperation = TraiteOperations1(tab,i);
                            if(objOperation.status == true){
                                t+=objOperation.value;
                                if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                                    t+=')';
                                }
                            }else{
                                return(logerreur({status:false,message:' erreur sur TraiteOperations1 1324'}));
                            }
                        }else if(tab[i][1] == 'appelf'){
                            var obj = js_traiteAppelFonction(tab,i,true,niveau,false);
                            if(obj.status == true){
                                t+=obj.value;
                                if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                                    t+=')';
                                }
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur TraiteOperations1 1854'}));
                            }
                        }else if(tab[i][1] == 'testEnLigne'){
                            var obj = js_traiteInstruction1(tab,niveau,i);
                            if(obj.status == true){
                                t+=obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur TraiteOperations1 1862'}));
                            }
                        }else if(tab[i][1] == 'tableau'){
                            var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                            if(objTableau.status == true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1844 sur TraiteOperations1 '}));
                            }
                        }else{
                            return(logerreur({status:false,'message':'fonction paramètre non reconnu 1391 "'+tab[i][1]+'"'}));
                        }
                    }else{
                        if((tab[i][4] === 1) || (tab[i][4] === 2)){
                            t+=maConstante(tab[i]);
                            if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
                                t+=')';
                            }
                        }else{
                            if(condi0){
                                t+=tab[i][1]+')';
                            }else{
                                if((tab[i][1].indexOf('+') >= 0) || (tab[i][1].indexOf('-') >= 0) || (tab[i][1].indexOf('*') >= 0) || (tab[i][1].indexOf('/') >= 0)){
                                    /*
                                      dans le cas ou l'élément de l'opération est lui même une opération, il vaut mieux ajouter une parenthèse
                                      Par exemple : plus['par' , numeroPar-1]
                                    */
                                    t+='('+tab[i][1]+')';
                                }else{
                                    t+=tab[i][1];
                                }
                            }
                            if((tab[parentId][1] == 'mult') || (tab[parentId][1] == 'divi')){
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
    var tabPar=[];
    var premiereCondition=true;
    for(i=(id+1);i < l;i=i+1){
        max=i;
        if(tab[i][3] < tab[id][3]){
            break;
        }
    }
    if(max == 0){
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
        for(i=id;i < max;i=i+1){
            if(((tab[i][1] == 'non') || (tab[i][1] == 'et') || (tab[i][1] == 'ou') || ((premiereCondition == true) && (tab[i][1] == ''))) && (tab[i][8] > 0) && (tab[i][2] == 'f')){
                if(tab[i][1] == 'non'){
                    t+=' !';
                }else if(tab[i][1] == 'et'){
                    t+=' && ';
                    if(tab[i][8] > 1){
                        t+=' ( ';
                    }
                }else if(tab[i][1] == 'ou'){
                    t+=' || ';
                    if(tab[i][8] > 1){
                        t+=' ( ';
                    }
                }
                obj=js_condition1(tab,(i+1),niveau);
                if(obj.status == false){
                    return(logerreur({status:false,value:t,id:id,message:'erreur 1928 dans une condition'}));
                }
                if((tab[i][1] == '') || (tab[i][1] == 'non')){
                    t+='(';
                }
                t+=obj.value;
                if((tab[i][1] == '') || (tab[i][1] == 'non')){
                    t+=')';
                }
                var reprise = (i+1);
                var j = (i+1);
                for(j=(i+1);j < max;j=j+1){
                    if(tab[j][3] <= tab[i][3]){
                        break;
                    }
                    reprise=j;
                }
                i=reprise;
            }else if((tab[i][1] == '') && (tab[i][8] > 0) && (tab[i][2] == 'f')){
                obj=js_condition1(tab,(i+1),niveau);
                if(obj.status == false){
                    return(logerreur({status:false,value:t,id:id,message:'erreur 1951 dans une condition'}));
                }
                t+=obj.value;
                i=max-1;
            }else if((tab[i][1] == 'tableau') && (tab[i][2] == 'f')){
                var objTableau = js_traiteTableau1(tab,i,true,niveau,false);
                if(objTableau.status == true){
                    t+=objTableau.value;
                }else{
                    return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 1997 sur declaration '}));
                }
                i=max-1;
            }else if((tab[i][1] == 'appelf') && (tab[i][2] == 'f')){
                obj=js_traiteAppelFonction(tab,i,true,niveau,false);
                if(obj.status == true){
                    t+=obj.value;
                }else{
                    return(logerreur({status:false,value:t,id:id,tab:tab,message:'erreur 1964 dans une condition'}));
                }
                i=max-1;
            }else if(((tab[i][1] == 'egal') || (tab[i][1] == 'egalstricte') || (tab[i][1] == 'diff') || (tab[i][1] == 'diffstricte') || (tab[i][1] == 'sup') || (tab[i][1] == 'inf') || (tab[i][1] == 'supeg') || (tab[i][1] == 'infeg') || (tab[i][1] == 'Instanceof')) && (tab[i][2] == 'f')){
                if(tab[i][8] == 2){
                    tabPar=[];
                    for(j=(id+1);j <= max;j=j+1){
                        if(tab[j][3] == (tab[i][3]+1)){
                            tabPar.push(j);
                        }
                    }
                    if(tab[tabPar[0]][2] == 'c'){
                        /*
                          if[tab[tabPar[0]][4]==true]{
                          t+='\''+tab[tabPar[0]][1]+'\'';
                          }else{
                          if[tab[tabPar[0]][1]=='vrai' || tab[tabPar[0]][1]=='faux']{
                          t+=[tab[tabPar[0]][1]=='vrai'?'true':'false'];
                          }else{
                          t+=tab[tabPar[0]][1];
                          }
                          }
                        */
                        t+=maConstante(tab[tabPar[0]]);
                    }else{
                        if((tab[tabPar[0]][2] == 'f') && (tab[tabPar[0]][1] == 'appelf')){
                            obj=js_traiteAppelFonction(tab,tabPar[0],true,niveau,false);
                            if(obj.status == true){
                                t+=obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'}));
                            }
                        }else if((tab[tabPar[0]][2] == 'f') && (tab[tabPar[0]][1] == 'Typeof')){
                            t+='typeof '+(tab[tabPar[0]+1][1]);
                        }else if((tab[tabPar[0]][2] == 'f') && ((tab[tabPar[0]][1] == 'plus') || (tab[tabPar[0]][1] == 'moins'))){
                            var objOperation = TraiteOperations1(tab,tab[tabPar[0]][0]);
                            if(objOperation.status == true){
                                t+=objOperation.value;
                            }else{
                                return(logerreur({status:false,value:t,'id':tabAffecte['par1'][0],tab:tab,message:'erreur 1607 sur des opérations '}));
                            }
                        }else if((tab[tabPar[0]][2] == 'f') && (tab[tabPar[0]][1] == 'tableau')){
                            var objTableau = js_traiteTableau1(tab,tab[tabPar[0]][0],true,niveau,false);
                            if(objTableau.status == true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({status:false,value:t,id:j,tab:tab,message:'erreur 1007 sur declaration '}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:id,'message':'erreur 1528 dans une condition pour un test egal, diff...'+tab[tabPar[0]][1]}));
                        }
                    }
                    if(tab[i][1] == 'egal'){
                        t+=' == ';
                    }else if(tab[i][1] == 'egalstricte'){
                        t+=' === ';
                    }else if(tab[i][1] == 'diff'){
                        t+=' != ';
                    }else if(tab[i][1] == 'diffstricte'){
                        t+=' !== ';
                    }else if(tab[i][1] == 'sup'){
                        t+=' > ';
                    }else if(tab[i][1] == 'inf'){
                        t+=' < ';
                    }else if(tab[i][1] == 'supeg'){
                        t+=' >= ';
                    }else if(tab[i][1] == 'infeg'){
                        t+=' <= ';
                    }else if(tab[i][1] == 'Instanceof'){
                        t+=' instanceof ';
                    }
                    if(tab[tabPar[1]][2] == 'c'){
                        /*
                          if[tab[tabPar[1]][4]==true]{
                          t+='\''+tab[tabPar[1]][1]+'\'';
                          }else{
                          if[tab[tabPar[1]][1]=='vrai' || tab[tabPar[1]][1]=='faux']{
                          t+=[tab[tabPar[1]][1]=='vrai'?'true':'false'];
                          }else{
                          t+=tab[tabPar[1]][1];
                          }
                          }
                        */
                        t+=maConstante(tab[tabPar[1]]);
                    }else{
                        if((tab[tabPar[1]][2] == 'f') && (tab[tabPar[1]][1] == 'appelf')){
                            obj=js_traiteAppelFonction(tab,tabPar[1],true,niveau,false);
                            if(obj.status == true){
                                t+=obj.value;
                            }else{
                                return(logerreur({status:false,value:t,id:id,tab:tab,message:'il faut un nom de fonction à appeler n(xxxx)'}));
                            }
                        }else if((tab[tabPar[1]][2] == 'f') && ((tab[tabPar[1]][1] == 'moins') || (tab[tabPar[1]][1] == 'plus'))){
                            var objOperation = TraiteOperations1(tab,tab[tabPar[1]][0]);
                            if(objOperation.status == true){
                                t+=objOperation.value;
                            }else{
                                return(logerreur({status:false,value:t,'id':tabAffecte['par1'][0],tab:tab,message:'erreur 824 sur des opérations '}));
                            }
                        }else if((tab[tabPar[1]][2] == 'f') && (tab[tabPar[1]][1] == 'tableau')){
                            var objTableau = js_traiteTableau1(tab,tab[tabPar[1]][0],true,niveau,false);
                            if(objTableau.status == true){
                                t+=objTableau.value;
                            }else{
                                return(logerreur({status:false,value:t,id:i,tab:tab,message:'erreur 2065 sur condition '}));
                            }
                        }else{
                            return(logerreur({status:false,value:t,id:id,'message':'erreur 1568 dans une condition pour un test egal, diff...'+tab[tabPar[0]][1]}));
                        }
                    }
                    i=max-1;
                }else{
                    return(logerreur({status:false,value:t,id:id,'message':'erreur 2077 dans une condition '+tab[i][1]}));
                }
            }else if((tab[i][1] != '') && (tab[i][2] == 'c')){
                t+=maConstante(tab[i]);
            }else if(tab[i][1] == '#'){
                if(tab[i][13].indexOf('\n') >= 0){
                    t+=espacesn(true,niveau);
                }
                var commt = traiteCommentaire2(tab[i][13],niveau,i);
                t+='/*'+commt+'*/';
            }else{
                logerreur({status:false,value:t,id:i,'message':'les tests sont pour l\'instant egal,egalstricte,diff,diffstricte,sup,inf,supeg,infeg,InstanceOf en non pas "'+tab[i][1]+'"'});
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
    var newTab=[];
    var obj={};
    for(i=(id+1);(i < tab.length) && (tab[i][3] > tab[id][3]);i=i+1){
        if(tab[i][7] == tab[id][0]){
            if((tab[i][1] == '') || (tab[i][1] == 'non')){
                if(premiereCondition){
                    obj=js_condition1(tab,i,niveau);
                    if(obj.status == false){
                        return(logerreur({status:false,value:t,id:id,message:'erreur 2123 dans une condition racine'}));
                    }
                    t+=obj.value;
                    premiereCondition=false;
                    i=obj.max;
                }else{
                    return(logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'}));
                }
            }else if((tab[i][1] == 'et') || (tab[i][1] == 'ou')){
                if(premiereCondition){
                    return(logerreur({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est "()"'}));
                }else{
                    obj=js_condition1(tab,i,niveau);
                    if(obj.status == false){
                        return(logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'}));
                    }
                    t+=obj.value;
                    i=obj.max;
                }
            }else if((tab[i][1] == 'egal') || (tab[i][1] == 'diff') || (tab[i][1] == 'sup') || (tab[i][1] == 'inf') || (tab[i][1] == 'supeg') || (tab[i][1] == 'infeg')){
                if( !(premiereCondition)){
                    return({status:false,value:t,message:'dans une condition il ne peut y avoir que des fonctions et() ou bien ou() sauf la première qui est soit "()", soit [egal|sup|inf|diff]'});
                }else{
                    obj=js_condition1(tab,i,niveau);
                    if(obj.status == false){
                        return(logerreur({status:false,value:t,id:id,message:'erreur dans une condition racine'}));
                    }
                    t+=obj.value;
                    i=obj.max;
                }
            }else if(tab[i][1] == '#'){
                if(tab[i][13].indexOf('\n') >= 0){
                    t+=espacesn(true,niveau);
                }
                var commt = traiteCommentaire2(tab[i][13],niveau,i);
                t+='/*'+commt+'*/';
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