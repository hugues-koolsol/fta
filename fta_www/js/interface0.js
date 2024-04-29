
/*
  
  
  
  
  ===========================================
  ===========================================
  ===========================================
  fonction qui produit un tableau html de  la
  liste des caractères du source du programme
  ===========================================
  ===========================================
  ===========================================
*/
function ConstruitHtmlTableauCaracteres(t2,texteSource,objTableau){
    var numeroLigne=0;
    var debut=0;
    var i=0;
    var j=0;
    var l01=0;
    var tmps='';
    var out = [];
    t2.setAttribute('class','tableau2');
    if(objTableau === null){
        /*On construit le tableau à partir du texte source*/
        var outo={};
        outo=iterateCharacters2(texteSource);
        out=outo.out;
    }else{
        out=objTableau.out;
    }
    /*
      première case du tableau = numéro de ligne
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.innerHTML=numeroLigne;
    tr1.appendChild(td1);
    /*boucle principale*/
    l01=out.length;
    for(i=0;i < l01;i++){
        var td1={};
        td1=document.createElement('td');
        td1.innerHTML=out[i][0].replace('\n','\\n');
        tmps=out[i][0].codePointAt(0);
        td1.title=concat('&amp;#',tmps,'; (',out[i][1],')');
        tr1.appendChild(td1);
        /*
          ============================================
          Si on a un retour chariot, on écrit les 
          cases contenant les positions des caractères
          ============================================
        */
        if(out[i][0] == '\n'){
            t2.appendChild(tr1);
            /*
              
              
              =================================================
              indice dans tableau = première ligne des chiffres
              =================================================
            */
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML='&nbsp;';
            tr1.appendChild(td1);
            for(j=debut;j < i;j++){
                var td1={};
                td1=document.createElement('td');
                if(out[j][1] == 1){
                    td1.setAttribute('class','td2');
                }else{
                    td1.setAttribute('class','td4');
                }
                td1.innerHTML=j;
                tr1.appendChild(td1);
            }
            /*
              
              =====================
              position du backslash
              =====================
            */
            var td1={};
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML=j;
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            /*
              
              ========================================================
              position dans la chaine = deuxième ligne des chiffres
              car certains caractères utf8 sont codées sur 2 positions
              ========================================================
            */
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML='&nbsp;';
            tr1.appendChild(td1);
            for(j=debut;j < i;j++){
                var td1={};
                td1=document.createElement('td');
                if(out[j][1] == 1){
                    td1.setAttribute('class','td2');
                }else{
                    td1.setAttribute('class','td4');
                }
                td1.innerHTML=out[j][2];
                tr1.appendChild(td1);
            }
            /*
              
              =====================
              position du backslash
              =====================
            */
            var td1={};
            td1=document.createElement('td');
            td1.setAttribute('class','td2');
            td1.innerHTML=out[j][2];
            tr1.appendChild(td1);
            t2.appendChild(tr1);
            /*
              
              
              ======================================
              fin des lignes contenant les positions
              ======================================
            */
            debut=(i+1);
            numeroLigne=(numeroLigne+1);
            var tr1={};
            var td1={};
            tr1=document.createElement('tr');
            td1=document.createElement('td');
            td1.innerHTML=numeroLigne;
            tr1.appendChild(td1);
            t2.appendChild(tr1);
        }
    }
    /*
      ============================================
      FIN Si on a un retour chariot, on écrit les 
      cases contenant les positions des caractères
      ============================================
    */
    /*dernière ligne de faire boucle*/
    /*
      dernière ligne des positions des caractères
    */
    t2.appendChild(tr1);
    /*
      
      
      =================================================
      indice dans tableau = première ligne des chiffres
      =================================================
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    for(j=debut;j < i;j++){
        var td1={};
        td1=document.createElement('td');
        if(out[j][1] == 1){
            td1.setAttribute('class','td2');
        }else{
            td1.setAttribute('class','td4');
        }
        td1.innerHTML=j;
        tr1.appendChild(td1);
    }
    /*finchoix suite du source*/
    t2.appendChild(tr1);
    /*
      =====================
      pas de position du backslash
      =====================
    */
    /*
      =====================================================
      position dans la chaine = deuxième ligne des chiffres
      =====================================================
    */
    var tr1={};
    var td1={};
    tr1=document.createElement('tr');
    td1=document.createElement('td');
    td1.setAttribute('class','td2');
    td1.innerHTML='&nbsp;';
    tr1.appendChild(td1);
    for(j=debut;j < i;j++){
        var td1={};
        td1=document.createElement('td');
        if(out[j][1] == 1){
            td1.setAttribute('class','td2');
        }else{
            td1.setAttribute('class','td4');
        }
        td1.innerHTML=out[j][2];
        tr1.appendChild(td1);
    }
    /*finchoix suite du source*/
    /*et enfin, on ajoute la dernière ligne*/
    t2.appendChild(tr1);
}
/*
  ==========================================
  ==========================================
  ==========================================
  fonction qui produit un tableau html de la
  forme matricielle du programme
  ==========================================
  ==========================================
  ==========================================
*/
function ConstruitHtmlMatrice(t1,matriceFonction){
    /**/
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
    var r6= new RegExp("\\\\'",'g');
    var r7= new RegExp('\r','g');
    var largeurTable1EnPx='1000';
    var largeurColonne1EnPx='400';
    t1.className='yytableauMatrice1';
    tr1=document.createElement('tr');
    /*
      =================
      entête du tableau
      =================
    */
    l01=global_enteteTableau.length;
    for(i=0;i < l01;i++){
        var td1={};
        td1=document.createElement('th');
        td1.innerHTML=concat(i,global_enteteTableau[i][0]);
        /**/
        td1.setAttribute('title',concat(global_enteteTableau[i][1],'(',i,')'));
        tr1.appendChild(td1);
    }
    t1.appendChild(tr1);
    /*
      
      
      ===================
      éléments du tableau
      ===================
    */
    l01=matriceFonction.value.length;
    for(i=0;i < l01;i++){
        var tr1={};
        tr1=document.createElement('tr');
        for(j=0;j < matriceFonction.value[i].length;j++){
            var td1={};
            td1=document.createElement('td');
            if((j == 1) || (j == 13)){
                /*Pour la valeur ou les commentaires*/
                temp=String(matriceFonction.value[i][j]);
                temp=temp.replace(r1,'░');
                temp=temp.replace(r2,'¶');
                temp=temp.replace(r3,'&amp;');
                temp=temp.replace(r4,'&lt;');
                temp=temp.replace(r5,'&gt;');
                temp=temp.replace(r7,'r');
                if(matriceFonction.value[i][4] === 3){
                    temp=temp.replace(r6,"'");
                }
                td1.innerHTML=temp;
                td1.style.whiteSpace='pre-wrap';
                td1.style.verticalAlign='baseline';
                td1.style.maxWidth=largeurColonne1EnPx+'px';
                td1.style.overflowWrap='break-word';
            }else if(j == 4){
                td1.innerHTML=matriceFonction.value[i][j];
                if(matriceFonction.value[i][j] === 1){
                }else if(matriceFonction.value[i][j] === 2){
                    td1.style.background='lightgrey';
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
/*
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
  Quand on clique sur un lien ou sur un bouton, on ne sait pas combien de temps va prendre le traitement.
  1°] On désactive les boutons et les liens quand l'utilisateur clique
  2°] Au bout de 1.5 secondes, on affiche une boite pour prévenir qu'il se passe quelque chose
  =====================================================================================================================
  =====================================================================================================================
  =====================================================================================================================
*/
var globale_timeout_serveur_lent=1500;
var globale_timeout_reference_timer_serveur_lent=null;
function miseAjourAffichageServeurLent(){
    try{
        var elem = document.getElementById('sloserver1');
        if(elem){
            var opa = parseInt(elem.style.opacity*(100),10);
            if(opa < 100){
                var newOpa = opa/(100)+0.1;
                if(newOpa > 1){
                    newOpa=1;
                }
                document.getElementById('sloserver1').style.opacity=newOpa;
                setTimeout(miseAjourAffichageServeurLent,50);
            }
        }else{
        }
    }catch(e){
    }
}
/*
  =====================================================================================================================
*/
function affichageBoiteServeurLent(){
    var divId = document.createElement('div');
    divId.id='sloserver1';
    divId.style.top='55px';
    divId.style.left='0px';
    divId.style.position='fixed';
    divId.style.padding='8px';
    divId.style.zIndex=10000;
    divId.style.textAlign='center';
    divId.style.fontSize='2em';
    divId.style.width='99.99%';
    divId.style.borderRadius='3px';
    divId.className='yyerror';
    divId.style.opacity=0.0;
    divId.innerHTML='désolé, le serveur est lent, veuillez patienter';
    document.getElementsByTagName('body')[0].appendChild(divId);
    setTimeout(miseAjourAffichageServeurLent,0);
}

/*
  =====================================================================================================================
*/
function reactiverLesBoutons(){
    var i=0;
    var refBody = document.getElementsByTagName('body')[0];
    clearTimeout(globale_timeout_reference_timer_serveur_lent);
    var lstb1 = refBody.getElementsByTagName('button');
    for(i=0;i < lstb1.length;i++){
        if( !(lstb1[i].onclick)){
            if((lstb1[i].className) && (lstb1[i].className.indexOf('noHide') >= 0)){
            }else{
                lstb1[i].style.visibility="";
            }
        }
    }
    var lstb1 = refBody.getElementsByTagName('input');
    for(i=0;i < lstb1.length;i++){
        if( !(lstb1[i].onclick)){
            if((lstb1[i].className) && (lstb1[i].className.indexOf('noHide') >= 0)){
            }else{
                if(lstb1[i].type === 'submit'){
                    lstb1[i].style.visibility="";
                }
            }
        }
    }
    var lsta1 = refBody.getElementsByTagName('a');
    for(i=0;i < lsta1.length;i++){
        if((lsta1[i].href) && ( !(lsta1[i].href.indexOf('javascript') >= 0))){
            if((lsta1[i].className) && (lsta1[i].className.indexOf('noHide') >= 0)){
            }else{
                lsta1[i].addEventListener("click",clickLink1,false);
                lsta1[i].classList.remove("yyunset");
            }
        }
    }
    try{
        var elem = document.getElementById('sloserver1');
        elem.remove();
    }catch(e){
    }
}
/*
  =====================================================================================================================
  quand on clique sur un lien, on affiche la boite 1.5 secondes plus tard
  =====================================================================================================================
*/
function clickLink1(e){
    try{
        e.target.className="yyunset";
    }catch(e1){
    }
    globale_timeout_reference_timer_serveur_lent=setTimeout(affichageBoiteServeurLent,globale_timeout_serveur_lent);
}
/*
  =====================================================================================================================
  quand on clique sur un bouton, on affiche la boite 1.5 secondes plus tard
  =====================================================================================================================
*/
function clickButton1(e){
    try{
        e.target.style.visibility="hidden";
    }catch(e1){
    }
    globale_timeout_reference_timer_serveur_lent=setTimeout(affichageBoiteServeurLent,globale_timeout_serveur_lent);
}
/*
  =====================================================================================================================
  supprime les messages de la zone global_messages et efface la zone de texte qui contient les message
  =====================================================================================================================
*/
function clearMessages(nomZone){
    try{
        document.getElementById(nomZone).innerHTML='';
        /* display a pu être mis à "none" ailleurs */
        document.getElementById(nomZone).style.display=''; 
    }catch(e){
    }
    global_messages={'errors':[],'warnings':[],'infos':[],'lines':[],'tabs':[],'ids':[],'ranges':[],'calls':'','data':{'matrice':[],'tableau':[],'sourceGenere':''}};
}
/*
  =====================================================================================================================
  affiche les messages contenus dans la variable global_messages
  =====================================================================================================================
*/
function displayMessages(nomZone,zoneScriptOriginal){
    reactiverLesBoutons();
    var i=0;
    var affichagesPresents=false;
    var zon = document.getElementById(nomZone);
    for(i=0;i < global_messages.errors.length;i++){
        zon.innerHTML+='<div class="yyerror">'+global_messages.errors[i]+'</div>';
        affichagesPresents=true;
    }
    for(i=0;i < global_messages.warnings.length;i++){
        zon.innerHTML+='<div class="yywarning">'+global_messages.warnings[i]+'</div>';
        affichagesPresents=true;
    }
    for(i=0;i < global_messages.infos.length;i++){
        zon.innerHTML+='<div class="yysuccess">'+global_messages.infos[i]+'</div>';
        affichagesPresents=true;
    }
    for(i=0;i < global_messages.lines.length;i++){
        zon.innerHTML+='<a href="javascript:jumpToError('+(global_messages.lines[i]+1)+',\''+zoneScriptOriginal+'\')" class="yyerror" style="border:2px red outset;">go to line '+global_messages.lines[i]+'</a>&nbsp;';
        affichagesPresents=true;
    }
    if((global_messages.data.matrice) && (global_messages.data.matrice.value)){
        var numLignePrecedente=-1;
        for(i=0;i < global_messages.ids.length;i++){
            var id=global_messages.ids[i];
            if((global_messages.data.matrice) && (id < global_messages.data.matrice.value.length)){
                var ligneMatrice=global_messages.data.matrice.value[id];
                var caractereDebut=ligneMatrice[5];
                var numeroDeLigne=0;
                var j=caractereDebut;
                for(j=caractereDebut;j >= 0;j--){
                    if(global_messages.data.tableau.out[j][0] == '\n'){
                        numeroDeLigne=(numeroDeLigne+1);
                    }
                }
            }
            if(numeroDeLigne > 0){
                if(numeroDeLigne != numLignePrecedente){
                    zon.innerHTML+='<a href="javascript:jumpToError('+(numeroDeLigne+1)+',\''+zoneScriptOriginal+'\')" class="yyerror" style="border:2px red outset;">go to line '+numeroDeLigne+'</a>&nbsp;';
                    affichagesPresents=true;
                    numLignePrecedente=numeroDeLigne;
                }
            }
        }
    }
    for(i=0;i < global_messages.ranges.length;i++){
        zon.innerHTML+='<a href="javascript:jumpToRange('+global_messages.ranges[i][0]+','+global_messages.ranges[i][1]+')" class="yyerror" style="border:2px red outset;">go to range '+global_messages.ranges[i][0]+','+global_messages.ranges[i][1]+'</a>&nbsp;';
        affichagesPresents=true;
    }
    if(affichagesPresents){
     var ttt='<a class="yywarning" style="float:inline-end" href="javascript:masquerLesMessage(&quot;'+nomZone+'&quot;)">masquer les messages</a>';
     zon.innerHTML=ttt+zon.innerHTML;
    }
}
/*
  =====================================================================================================================
*/
function masquerLesMessage(nomZone){
    var zon = document.getElementById(nomZone);
    zon.style.display='none'; 
}
/*
  =====================================================================================================================
*/
function afficherOuMasquerLesMessages(){
    var nomZone='zone_global_messages';
    var zon = document.getElementById(nomZone);
    if(zon.style.display==='none' || zon.innerHTML===''){ 
     zon.style.display='';
     if(zon.innerHTML==''){
      var ttt='<a class="yywarning" style="float:inline-end" href="javascript:masquerLesMessage(&quot;'+nomZone+'&quot;)">masquer les messages</a>';
      zon.innerHTML=ttt+zon.innerHTML;
     } 
    }else{
     zon.style.display='none';
    }
}

/*
  =====================================================================================================================
  Pour les appels ajax qui ne fonctionnent pas, on affiche qqch
  todo, à revoir
  =====================================================================================================================
*/
function display_ajax_error_in_cons(jsonRet){
    var txt='';
    if(jsonRet.hasOwnProperty('status')){
        txt+='status:'+jsonRet.status+'\n';
    }
    if(jsonRet.hasOwnProperty('messages')){
        if((typeof jsonRet.messages === 'string') || (jsonRet.messages instanceof String)){
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
    console.log('%c'+txt,'color:red;background:orange;');
    console.log('jsonRet=',jsonRet);
}
/*
  =====================================================================================================================
*/
function selectTextareaLine(tarea,lineNum){
    lineNum=((lineNum <= 0)?1:lineNum);
    lineNum=lineNum-1;
    var lines = tarea.value.split('\n');
    var startPos=0;
    var endPos=tarea.value.length;
    var x=0;
    for(x=0;x < lines.length;x++){
        if(x == lineNum){
            break;
        }
        startPos+=(lines[x].length+1);
    }
    var endPos = lines[lineNum-1].length+startPos;
    if(typeof tarea.selectionStart != 'undefined'){
        tarea.focus();
        tarea.selectionStart=startPos;
        tarea.selectionEnd=endPos;
        var debut=startPos;
        var fin=endPos;
        tarea.select();
        tarea.selectionStart=debut;
        tarea.selectionEnd=fin;
        var texteDebut = tarea.value.substr(0,debut);
        var texteFin = tarea.value.substr(debut);
        tarea.value=texteDebut;
        tarea.scrollTo(0,9999999);
        var nouveauScroll=tarea.scrollTop;
        tarea.value=texteDebut+texteFin;
        if(nouveauScroll > 50){
            tarea.scrollTo(0,(nouveauScroll+50));
        }else{
            tarea.scrollTo(0,0);
        }
        tarea.selectionStart=debut;
        tarea.selectionEnd=fin;
        return true;
    }
    if((document.selection) && (document.selection.createRange)){
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd('character',endPos);
        range.moveStart('character',startPos);
        range.select();
        return true;
    }
    return false;
}
/*
  =====================================================================================================================
*/
function jumpToError(i,nomTextAreaSource){
    selectTextareaLine(document.getElementById(nomTextAreaSource),i);
}
/*
  =====================================================================================================================
*/

function deplace_la_zone_de_message(){
 var i=0;
 var haut=0;
 var bod = document.getElementsByTagName('body')[0];
 var paddingTopBody=0;
 
 var bodyComputed=getComputedStyle(bod);
// console.log('bodyComputed=',bodyComputed);
 for( var elem in bodyComputed){
  if('paddingTop'===elem){
//   console.log( elem , bodyComputed[elem]);
   paddingTopBody=parseInt(bodyComputed[elem],10);
//   console.log(paddingTopBody)
  }
 }

 var contenuPrincipal=dogid('contenuPrincipal');
 var lesDivs=contenuPrincipal.getElementsByTagName('div');
 for(i=0;i < lesDivs.length;i++){
  if(lesDivs[i].className==='menuScroller'){
   var menuUtilisateurCalcule=getComputedStyle(lesDivs[i]);
   hauteurMenuUtilisateur=parseInt(menuUtilisateurCalcule['height'],10);
   
   lesDivs[i].style.top=paddingTopBody+'px';
   lesDivs[i].style.position='fixed';
   lesDivs[i].style.width='90vw';
   lesDivs[i].style.marginLeft='5vw';
   lesDivs[i].style.backgroundImage='linear-gradient(to bottom, #B0BEC5, #607D8B)';
   
   paddingTopBody=paddingTopBody+hauteurMenuUtilisateur;
   dogid('zone_global_messages').style.top=paddingTopBody+'px';
   
   bod.style.paddingTop=paddingTopBody+'px';
   
   
   
   
   
  }
 }
 
 
}

function ajouteDeQuoiFaireDisparaitreLesBoutonsEtLesLiens(){
  
    /*
      equivalent de window.onload = function() {
      fixMenu1();
    */
    var i=0;
    var bod = document.getElementsByTagName('body')[0];
    var lstb1 = bod.getElementsByTagName('button');
    for(i=0;i < lstb1.length;i++){
        if( !(lstb1[i].onclick)){
            if((lstb1[i].className) && (lstb1[i].className.indexOf('noHide') >= 0)){
            }else{
                lstb1[i].addEventListener("click",clickButton1,false);
            }
        }
    }
    var lstb1 = bod.getElementsByTagName('input');
    for(i=0;i < lstb1.length;i++){
        if( !(lstb1[i].onclick)){
            if((lstb1[i].className) && (lstb1[i].className.indexOf('noHide') >= 0)){
            }else{
                if(lstb1[i].type === 'submit'){
                    lstb1[i].addEventListener("click",clickButton1,false);
                }
            }
        }
    }
    var lsta1 = bod.getElementsByTagName('a');
    for(i=0;i < lsta1.length;i++){
        if((lsta1[i].href) && ( !(lsta1[i].href.indexOf('javascript') >= 0))){
            if((lsta1[i].className) && (lsta1[i].className.indexOf('noHide') >= 0)){
            }else{
                lsta1[i].addEventListener("click",clickLink1,false);
            }
        }
    }
  
/*
  getScrollWidth();
  getPageSize();
*/
  
  
}

window.addEventListener('load', function () {
 console.log("interface js")
 ajouteDeQuoiFaireDisparaitreLesBoutonsEtLesLiens();
 deplace_la_zone_de_message();
  //        pageFunction(); // this function calls finally a void function or doLocalPage ( see za_inc.php/function htmlFoot0 to see the implementation )
 
})
/*
  =====================================================================================================================
*/
window.addEventListener("load",function(evtWL){
});
