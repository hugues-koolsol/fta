
/*
  première ligne
*/
var DEBUTCOMMENTAIRE='#';
var DEBUTBLOC='@';
var CRLF='\r\n';
var NBESPACESREV=3;
var global_messages={'e500logged':false,'errors':[],'warnings':[],'infos':[],'lines':[],'tabs':[],'ids':[],'calls':'','data':{'matrice':[],'tableau':[],'sourceGenere':''}};
function clearMessages(nomZone){
    document.getElementById(nomZone).innerHTML='';
    global_messages={'errors':[],'warnings':[],'infos':[],'lines':[],'tabs':[],'ids':[],'calls':'','data':{'matrice':[],'tableau':[],'sourceGenere':''}};
}
function displayMessages(nomZone){
    var i=0;
    for(i=0;(i < global_messages.errors.length);i=i+1){
        document.getElementById(nomZone).innerHTML+='<div class="yyerror">'+global_messages.errors[i]+'</div>';
    }
    var i=0;
    for(i=0;(i < global_messages.warnings.length);i=i+1){
        document.getElementById(nomZone).innerHTML+='<div class="yywarning">'+global_messages.warnings[i]+'</div>';
    }
    var i=0;
    for(i=0;(i < global_messages.infos.length);i=i+1){
        document.getElementById(nomZone).innerHTML+='<div class="yyinfo">'+global_messages.infos[i]+'</div>';
    }
    var i=0;
    for(i=0;(i < global_messages.lines.length);i=i+1){
        document.getElementById(nomZone).innerHTML+='<a href="javascript:jumpToError('+global_messages.lines[i]+1+')" class="yyerror" style="border:2px red outset;">go to line '+global_messages.lines[i]+'</a>&nbsp;';
    }
    if((global_messages.data.matrice) && global_messages.data.matrice.value){
        var numLignePrecedente=-1;
        var i=0;
        for(i=0;(i < global_messages.ids.length);i=i+1){
            var id=global_messages.ids[i];
            if((global_messages.data.matrice) && id < global_messages.data.matrice.value.length){
                var ligneMatrice=global_messages.data.matrice.value[id];
                var caractereDebut=ligneMatrice[5];
                var numeroDeLigne=0;
                var j=caractereDebut;
                for(j=caractereDebut;(j >= 0);j=j-1){
                    if((global_messages.data.tableau.out[j][0] == '\n')){
                        numeroDeLigne=numeroDeLigne+1;
                    }
                }
            }
            if((numeroDeLigne > 0)){
                if((numeroDeLigne != numLignePrecedente)){
                    document.getElementById(nomZone).innerHTML+='<a href="javascript:jumpToError('+numeroDeLigne+1+')" class="yyerror" style="border:2px red outset;">go to line '+numeroDeLigne+'</a>&nbsp;';
                    numLignePrecedente=numeroDeLigne;
                }
            }
        }
    }
}
function logerreur(o){
    if((o.hasOwnProperty('status'))){
        if((o.status === false)){
            if((o.hasOwnProperty('message'))){
                global_messages[errors].push(o.message);
            }
            if((o.hasOwnProperty('id'))){
                global_messages[ids].push(o.id);
            }
        }else{
            if((o.hasOwnProperty('message'))){
                if((o.message != '')){
                    global_messages[infos].push(o.message);
                }
            }else if((o.hasOwnProperty('warning'))){
                if((o.warning != '')){
                    global_messages[warnings].push(o.warning);
                }
            }else{
            }
        }
    }
    if((o.hasOwnProperty('tabs'))){
        global_messages[tabs].push(o.tabs);
    }
    if((o.line)){
        global_messages[lines].push(o.line);
    }
    return o;
}
function dogid(n){
    return(document.getElementById(n));
}
function concat(){
    var t='';
    var a=null;
    var a={};
    for(a in arguments){
        t+=String(arguments[a]);
    }
    return t;
}
function isNumeric(str){
    if((typeof str != 'string')){
        return false;
    }
    var leTest=  !(isNaN(str)) !(undefined) &&  !(isNaN(parseFloat(str)));
    return leTest;
}
function espacesnrev(optionCRLF,i){
    var t='';
    if((optionCRLF)){
        t='\r\n';
    }else{
        t='\n';
    }
    if((i > 0)){
        t+=' '.repeat(NBESPACESREV*(i));
    }
    return t;
}
function display_ajax_error_in_cons(jsonRet){
    var txt='';
    if((jsonRet.hasOwnProperty('status'))){
        txt+='status:'+jsonRet.status+'\n';
    }
    if((jsonRet.hasOwnProperty('messages'))){
        if((typeof jsonRet.messages === 'string') || jsonRet.messages instanceof String){
            txt+='Please, put messages in an array in the server !!!!\n';
            txt+='messages='+jsonRet.messages;
            txt+='\n';
        }else{
            txt+='messages[]=\n';
            var elem={};
            for(elem in jsonRet.messages){
                global_messages[errors].push(jsonRet.messages[elem]);
                txt+=''+jsonRet.messages[elem]+'\n';
            }
            txt+='\n';
        }
    }
    displayMessages();
    console.log('%c'+txt,'color:red');
    console.log('jsonRet=',jsonRet);
}
function arrayToFunct1(matrice,retourLigne,coloration){
    var t='';
    var obj= a2F1(matrice,0,retourLigne,1,coloration);
    if((obj.status === true)){
    }
    return obj;
}
function arrayToFunctNormalize(matrice,bAvecCommentaires){
    var out= arrayToFunct1(matrice,bAvecCommentaires,false);
    return out;
}
function arrayToFunctNoComment(matrice){
    var out= arrayToFunct1(matrice,true,false);
    return out;
}
function functionToArray(src,quitterSiErreurNiveau){
    var tableau1= iterateCharacters2(src);
    var matriceFonction= functionToArray2(tableau1.out,quitterSiErreurNiveau,false);
    global_messages.data.matrice=matriceFonction;
    global_messages.data.tableau=tableau1;
    return matriceFonction;
}
function replaceAll(s,chaineAremplacer,chaineQuiRemplace){
    var r1= new RegExp(chaineAremplacer,'g');
    var ret= s.replace(r1,chaineQuiRemplace);
    return ret;
}
function myReplace(s,chaineAremplacer,chaineQuiRemplace){
    var r1= new RegExp(chaineAremplacer,'');
    var ret= s.replace(r1,chaineQuiRemplace);
    return ret;
}
function ttcomm1(texte,niveau,ind){
    var s='';
    s=traiteCommentaireSourceEtGenere1(texte,niveau,ind,NBESPACESREV,true);
    return s;
}
function traiteCommentaireSourceEtGenere1(texte,niveau,ind,nbEspacesSrc1,fichierRev0){
    var i=0;
    i=texte.indexOf('\n');
    if((i < 0)){
        return texte;
    }
    var i=0;
    var j=0;
    var l01=0;
    var min=0;
    var t='';
    var ligne='';
    var temps='';
    var unBloc='';
    var unBlocPlus1='';
    var newTab= Array();
    var tab= Array();
    unBloc=' '.repeat(nbEspacesSrc1*(niveau));
    tab=texte.split('\n');
    l01=tab.length;
    if((texte.length > 1)){
        temps=texte.substr(0,1);
        if((temps == '#')){
            t='';
            min=99999;
            for(i=1;(i < l01);i=i+1;){
                ligne=tab[i];
                for(j=0;(j < ligne.length);j=j+1;){
                    temps=ligne.substr(j,1);
                    if((temps != ' ')){
                        if((j < min)){
                            min=j;
                        }
                        break;
                    }
                }
            }
            if((min > 2)){
                for(i=1;(i < l01);i=i+1;){
                    tab[i]=tab[i].substr(min-2);
                }
            }
            if((fichierRev0)){
                ligne=tab[tab.length-1];
                ligne=replaceAll(ligne,' ','');
                if((ligne != '')){
                    tab.push(unBloc);
                }else{
                    tab[tab.length-1]=unBloc;
                }
            }
            texte=tab.join('\n');
            return texte;
        }
    }
    unBlocPlus1=' '.repeat(nbEspacesSrc1*(niveau)+2);
    var s1='';
    var s2='';
    for(i=0;(i < l01);i=i+1;){
        t='';
        for(j=0;(j < tab[i].length);j=j+1;){
            temps=tab[i].substr(j,1);
            if((temps != ' ')){
                temps=tab[i].substr(j);
                t=concat(t,temps);
                break;
            }
        }
        s1=concat(unBloc,t);
        s2=concat(unBlocPlus1,t);
        if((i == l01-1)){
            if((t == '')){
                newTab.push(unBloc);
            }else{
                newTab.push(s2);
                newTab.push(unBloc);
            }
        }else if((i == 0)){
            if((t == '')){
                newTab.push(t);
            }else{
                newTab.unshift('');
                newTab.push(s2);
            }
        }else{
            newTab.push(s2);
        }
    }
    t=newTab.join('\n');
    return t;
}
function strToHtml(s){
    var r1= new RegExp('&','g');
    var r2= new RegExp('<','g');
    var r3= new RegExp('>','g');
    s=s.replace(r1,'&amp;');
    s=s.replace(r2,'&lt;');
    s=s.replace(r3,'&gt;');
    return s;
}
function a2F1(arr,parentId,retourLigne,debut,coloration){
    var i=0;
    var j=0;
    var obj={};
    var t='';
    var profondeurLimite=3;
    var nombreEnfantsLimite=5;
    var forcerRetourLigne=false;
    var condition1=false;
    var commentaire='';
    var l01=0;
    l01=arr.length;
    for(i=debut;(i < l01);i=i+1;){
        if((arr[i][7] == parentId)){
        }else if((arr[i][3] <= arr[parentId][3])){
            break;
        }else{
            continue;
        }
        if((retourLigne == true) && arr[parentId][10] > profondeurLimite){
            forcerRetourLigne=true;
        }else if((retourLigne == true) && arr[parentId][2] == 'f' || arr[parentId][2] == 'INIT'){
            for(j=debut;(j < l01) && arr[j][3] > arr[parentId][3];j=j+1;){
                if((arr[j][1] == DEBUTCOMMENTAIRE) && arr[j][2] == 'f' && arr[j][3] < arr[parentId][3]+profondeurLimite){
                    forcerRetourLigne=true;
                    break;
                }
            }
            for(j=debut;(j < l01) && arr[j][3] > arr[parentId][3];j=j+1;){
                if((arr[j][8] > nombreEnfantsLimite)){
                    forcerRetourLigne=true;
                    break;
                }
            }
        }
        condition1=(arr[parentId][2] == 'f') && arr[parentId][8] <= nombreEnfantsLimite && arr[parentId][10] <= profondeurLimite;
        if((arr[i][9] > 1)){
            if( !(forcerRetourLigne) && retourLigne == true && condition1){
                t=concat(t,' , ');
            }else{
                t=concat(t,',');
            }
        }
        if((forcerRetourLigne) && arr[parentId][2] != 'INIT'){
            t=concat(t,espacesnrev(false,arr[i][3]));
        }else if((retourLigne)){
            if((arr[parentId][2] == 'INIT') && arr[i][9] == 1 || condition1){
            }else{
                t=concat(t,espacesnrev(false,arr[i][3]));
            }
        }
        if((arr[i][2] == 'c')){
            if((coloration)){
                if((arr[i][4] == true)){
                    t=concat(t,'\'',strToHtml(arr[i][1]),'\'');
                }else{
                    t=concat(t,strToHtml(arr[i][1]));
                }
            }else{
                if((arr[i][4] == true)){
                    t=concat(t,'\'',arr[i][1],'\'');
                }else{
                    t=concat(t,arr[i][1]);
                }
            }
            continue;
        }
        if((arr[i][2] == 'f') && arr[i][1] == DEBUTCOMMENTAIRE){
            commentaire=ttcomm1(arr[i][13],arr[i][3],i);
            if((coloration)){
                commentaire=strToHtml(commentaire);
                if((retourLigne)){
                    t=concat(t,'<span ','style="','color:darkgreen;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',commentaire,')','</span>');
                }else{
                    t=concat(t,'<span ','style="','color:darkgreen;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',')','</span>');
                }
            }else{
                if((retourLigne)){
                    t=concat(t,arr[i][1],'(',commentaire,')');
                }else{
                    t=concat(t,arr[i][1],'()');
                }
            }
            continue;
        }
        if((arr[i][2] == 'f') && arr[i][1] == DEBUTBLOC){
            commentaire=arr[i][13];
            if((coloration)){
                commentaire=strToHtml(commentaire);
                if((retourLigne)){
                    t=concat(t,'<span ','style="','color:navy;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',commentaire,')','</span>');
                }else{
                    t=concat(t,'<span ','style="','color:navy;','background-color:lightgrey;','"','>',strToHtml(arr[i][1]),'(',')','</span>');
                }
            }else{
                if((retourLigne)){
                    t=concat(t,arr[i][1],'(',commentaire,')');
                }else{
                    t=concat(t,arr[i][1],'()');
                }
            }
            continue;
        }
        var obj={};
        obj=a2F1(arr,i,retourLigne,i+1,coloration);
        if((obj.status === true)){
            if((coloration)){
                t=concat(t,strToHtml(arr[i][1]),'(');
            }else{
                t=concat(t,arr[i][1],'(');
            }
            t=concat(t,obj.value);
            if((forcerRetourLigne) && obj.forcerRetourLigne == true){
                t=concat(t,espacesnrev(false,arr[i][3]));
            }else if((retourLigne)){
                if( !((arr[i][8] <= nombreEnfantsLimite) && arr[i][10] <= profondeurLimite)){
                    t=concat(t,espacesnrev(false,arr[i][3]));
                }
            }
            t=concat(t,')');
        }else{
            obj={'status':faux,'message':'erreur','id':i};
            return obj;
        }
    }
    obj={'status':true,'value':t,'forcerRetourLigne':forcerRetourLigne};
    return obj;
}
function ConstruitHtmlTableauCaracteres(t2,texteSource,objTableau){
    var numeroLigne=0;
    var debut=0;
    var i=0;
    var j=0;
    var l01=0;
    var tmps='';
    var out= Array();
    t2.setAttribute('class','tableau2');
    if((objTableau === null)){
        var outo={};
        outo=iterateCharacters2(texteSource);
        out=outo.out;
    }else{
        out=objTableau.out;
    }
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.innerHTML=numeroLigne;
    tr1.appendChild(td1);
    l01=out.length;
    for(i=0;(i < l01);i=i+1;){
        var td1={};
        td1=document.createElement('td');
        td1.innerHTML=out[i][0].replace('\n','\\n');
        tmps=out[i][0].codePointAt(0);
        td1.title=concat('&amp;#',tmps,'; (',out[i][1],')');
        tr1.appendChild(td1);
        if((out[i][0] == '\n')){
            t2.appendChild(tr1);
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML='&nbsp;';
            tr1.appendChild(td1);
            for(j=debut;(j < i);j=j+1;){
                var td1={};
                td1=document.createElement('td');
                if((out[j][1] == 1)){
                    td1.setAttribute('class','td2');
                }else{
                    td1.setAttribute('class','td4');
                }
                td1.innerHTML=j;
                tr1.appendChild(td1);
            }
            var td1={};
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML=j;
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML='&nbsp;';
            tr1.appendChild(td1);
            for(j=debut;(j < i);j=j+1;){
                var td1={};
                td1=document.createElement('td');
                if((out[j][1] == 1)){
                    td1.setAttribute('class','td2');
                }else{
                    td1.setAttribute('class','td4');
                }
                td1.innerHTML=out[j][2];
                tr1.appendChild(td1);
            }
            var td1={};
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML=out[j][2];
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            debut=i+1;
            numeroLigne=numeroLigne+1;
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.innerHTML=numeroLigne;
            tr1.appendChild(td1);
            t2.appendChild(tr1);
        }
    }
    t2.appendChild(tr1);
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    for(j=debut;(j < i);j=j+1;){
        var td1={};
        td1=document.createElement('td');
        if((out[j][1] == 1)){
            td1.setAttribute('class','td2');
        }else{
            td1.setAttribute('class','td4');
        }
        td1.innerHTML=j;
        tr1.appendChild(td1);
    }
    t2.appendChild(tr1);
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    for(j=debut;(j < i);j=j+1;){
        var td1={};
        td1=document.createElement('td');
        if((out[j][1] == 1)){
            td1.setAttribute('class','td2');
        }else{
            td1.setAttribute('class','td4');
        }
        td1.innerHTML=out[j][2];
        tr1.appendChild(td1);
    }
    t2.appendChild(tr1);
}
function ConstruitHtmlMatrice(t1,matriceFonction){
    var i=0;
    var j=0;
    var l01=0;
    var temp='';
    var tr1={};
    var td1={};
    var r1= new RegExp(' ','g');
    var r2= new RegExp('\n','g');
    var r3= new RegExp('&','g');
    var r4= new RegExp('<','g');
    var r5= new RegExp('>','g');
    tr1=document.createElement('tr');
    l01=global_enteteTableau.length;
    for(i=0;(i < l01);i=i+1;){
        var td1={};
        td1=document.createElement('td');
        td1.innerHTML=concat(i,global_enteteTableau[i][0]);
        td1.setAttribute('title',concat(global_enteteTableau[i][1],'(',i,')')
        );
        tr1.appendChild(td1);
    }
    t1.appendChild(tr1);
    l01=matriceFonction.value.length;
    for(i=0;(i < l01);i=i+1;){
        var tr1={};
        tr1=document.createElement('tr');
        for(j=0;(j < matriceFonction.value[i].length);j=j+1;){
            var td1={};
            td1=document.createElement('td');
            if((j == 1) || j == 13){
                temp=String(matriceFonction.value[i][j]);
                temp=temp.replace(r1,'░');
                temp=temp.replace(r2,'¶');
                temp=temp.replace(r3,'&amp;');
                temp=temp.replace(r4,'&lt;');
                temp=temp.replace(r5,'&gt;');
                td1.innerHTML=temp;
                td1.style.whiteSpace='pre-wrap';
                td1.style.verticalAlign='baseline';
            }else if((j == 4)){
                if((matriceFonction.value[i][j] == true)){
                    td1.innerHTML='1';
                }else{
                    td1.innerHTML='';
                }
            }else{
                td1.innerHTML=String(matriceFonction.value[i][j]);
            }
            temp=concat(global_enteteTableau[j][1],'(',j,')');
            td1.setAttribute('title',temp);
            tr1.appendChild(td1);
        }
        t1.appendChild(tr1);
    }
}
function iterateCharacters2(str){
    var out= Array();
    var i=0;
    var exceptions=0;
    var numLigne=0;
    var l01=str.length;
    var codeCaractere='';
    var retour={};
    var temp=0;
    for(i=0;(i < l01);i=i+1;){
        codeCaractere=str.charCodeAt(i);
        if( !((codeCaractere === 8203) || codeCaractere === 11)){
            temp=codeCaractere&0xF800;
            if((temp === 55296)){
                out.push(Array(
                    str.substr(i,2),2,i,numLigne
                )
                );
                i=i+1;
            }else{
                out.push(Array(
                    str.substr(i,1),1,i,numLigne
                )
                );
                if((codeCaractere === 10)){
                    numLigne=numLigne+1;
                }
            }
        }else{
            exceptions=exceptions+1;
        }
    }
    retour={'out':out,'numLigne':numLigne,'exceptions':exceptions};
    return retour;
}
var global_enteteTableau= Array(
    Array('id','id'),
    Array('val','value'),
    Array('typ','type'),
    Array('niv','niveau'),
    Array('coQ','constante quotée'),
    Array('pre','position du premier caractère'),
    Array('der','position du dernier caractère'),
    Array('pId','Id du parent'),
    Array('nbE','nombre d\'enfants'),
    Array('nuE','numéro enfants'),
    Array('pro','profondeur'),
    Array('pop','position ouverture parenthese'),
    Array('pfp','position fermeture parenthese'),
    Array('com','commentaire')
);
/*
  dernière ligne
*/