
/*
  Début du source de test
  =====================================================================================================
*/
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
        if((tab[i][1] == 'break') || (tab[i][1] == 'debugger') || (tab[i][1] == 'continue') || ('useStrict' === tab[i][1]) || ('debugger' === tab[i][1]) && (tab[i][2] == 'f')){
            if(('useStrict' === tab[i][1])){
                t+=espacesn(true,niveau);
                t+='"use strict";';
            }else{
                if((tab[i][8] == 0)){
                    t+=espacesn(true,niveau);
                    t+=tab[i][1]+';';
                }else{
                    console.trace();
                    return(logerreur({}));
                }
            }
        }else if((tab[i][1] == 'revenir') && (tab[i][2] == 'f')){
            if((tab[i][8] == 0)){
                try{
                    t+=espacesn(true,niveau);
                    t+='return;';
                }catch(e){
                    debugger;
                }
            }else{
                if((tab[i][8] == 1)){
                    if((tab[i+1][2] == 'c')){
                        t+=espacesn(true,niveau);
                        t+='return '+((tab[i+1][4] === true)?'\''+tab[i+1][1]+'\'':((tab[i+1][1] == 'vrai')?'true':((tab[i+1][1] == 'faux')?'false':tab[i+1][1])))+';';
                    }else if((tab[i+1][2] == 'f') && (tab[i+1][1] == 'appelf')){
                        t+=espacesn(true,niveau);
                        obj=js_traiteAppelFonction(tab,i+1,true,niveau,false);
                        if((obj.status == true)){
                            t+='return('+obj.value+');';
                        }else{
                            console.trace();
                            return(logerreur({}));
                        }
                    }else if((tab[i+1][2] == 'f') && (tab[i+1][1] == 'obj')){
                        t+=espacesn(true,niveau);
                        obj=js_traiteDefinitionObjet(tab,tab[i+1][0],true);
                        if((obj.status == true)){
                            t+='return('+obj.value+');';
                        }else{
                            return(logerreur({}));
                        }
                    }else{
                        return(logerreur({}));
                    }
                }else{
                    return(logerreur({}));
                }
                reprise=(i+1);
                max=(i+1);
                for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                    reprise=j;
                }
                i=reprise;
            }
        }else if((tab[i][1] == 'fonction') && (tab[i][2] == 'f')){
            if((dansFonction == true)){
                return(logerreur({}));
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
                            if((tab[j][8] == 1)){
                                nomFonction=tab[j+1][1];
                            }else{
                                return(logerreur({}));
                            }
                        }
                    }
                    argumentsFonction='';
                    for(j=(positionDeclarationFonction+1);(j < l01) && (tab[j][3] > tab[positionDeclarationFonction][3]);j=j+1){
                        if((tab[j][1] == 'argument') && (tab[j][3] == (tab[positionDeclarationFonction][3]+1))){
                            if((tab[j][8] == 1)){
                                argumentsFonction+=','+tab[j+1][1];
                            }else{
                                return(logerreur({}));
                            }
                        }
                    }
                    if((nomFonction != '')){
                        t+='){';
                        if((tab[positionContenu][8] == 0)){
                            t+='\n';
                            t+='  // void';
                            t+='\n}';
                        }else{
                            niveau=niveau+1;
                            obj=js_tabTojavascript1(tab,positionContenu+1,dansFonction,false,niveau);
                            niveau=niveau-1;
                            if((obj.status == true)){
                                t+=obj.value;
                                t+='\n}';
                            }else{
                                return(logerreur({}));
                            }
                        }
                        max=Math.max(positionDeclarationFonction,positionContenu);
                        for(j=max;(j < l01) && (tab[j][3] > tab[i][3]);j=j+1){
                            reprise=j;
                        }
                        i=reprise;
                    }
                }else{
                    return({'status':false,'value':t,'id':id,'tab':tab,'message':'il faut une declaration d(n(),a()...) et un contenu c(...) pour définir une fonction f()'});
                }
                dansFonction=false;
            }
        }
    }
}
/*
  =====================================================================================================
  fin du source de test
  
*/