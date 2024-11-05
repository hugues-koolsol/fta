"use strict";
/*
  =====================================================================================================================
*/
function sauvegardeTexteSource(){
    var i=0;
    var c='';
    var obj={};
    if(document.getElementById('sauvegarderLeNormalise').getAttribute('data-fichiertexte') != ''){
        var nomDuSource = document.getElementById('nomDuSource').value;
        for(i=0;i < nomDuSource.length;i=i+1){
            c=nomDuSource.substr(i,1);
            if((c == '/') || (c == '\\') || (c == ':') || (c == '*') || (c == '?') || (c == '"') || (c == '<') || (c == '>') || (c == '|')){
                alert('Le caractère "'+c+'" n\'est pas autorisé ( tout comme /\\:*?"<>|');
                return;
            }else{
                if( !((c.charCodeAt(0) >= 32) && (c.charCodeAt(0) < 127))){
                    alert('Le caractère "'+c+'" n\'est pas autorisé ( tout comme /\\:*?"<>|');
                    return;
                }
            }
        }
        obj=writeRevFile(nomDuSource,document.getElementById('normalise').value);
    }
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    document.getElementById('nomDuSource').disabled=true;
}

/*
  =====================================================================================================================
*/
function reprendre(){
    document.getElementById('zonesource').value=document.getElementById('normalise').value;
}
/*
  =====================================================================================================================
*/
function reprendreEtRecompiler(){
    document.getElementById('zonesource').value=document.getElementById('normalise').value;
    enregistrer2();
}
function compareNormalise(zoneSource,zoneNormalisee,comparaisonSourcesSansCommentairesOK){
    var lienReprendre='<div class="yywarning">les codes produits sont équivalent : <a href="javascript:reprendre()">reprendre</a> </div>';
    var tab1 = document.getElementById(zoneSource).value.split('\n');
    var tab2 = document.getElementById(zoneNormalisee).value.split('\n');
    if(tab1.length == tab2.length){
        var i=0;
        for(i=0;i < tab1.length;i=i+1){
            if(tab1[i] != tab2[i]){
                global_messages.lines.push(i);
                document.getElementById('global_messages').innerHTML+='<div class="yywarning">différence dans des sources en ligne '+(i+1)+'</div>';
                document.getElementById('global_messages').innerHTML+='<div class="yywarning">'+replaceAll(tab1[i],' ','░')+'</div>';
                document.getElementById('global_messages').innerHTML+='<div class="yywarning">'+replaceAll(tab2[i],' ','░')+'</div>';
                if(comparaisonSourcesSansCommentairesOK === true){
                    document.getElementById('global_messages').innerHTML+=lienReprendre;
                }
                return false;
            }
        }
        document.getElementById('global_messages').innerHTML+='<div class="yyinfo">Le source et le normalisé sont les mêmes</div>';
        document.getElementById('sauvegarderLeNormalise').disabled=false;
        document.getElementById('nomDuSource').disabled=false;
    }else{
        var goOn=true;
        var i=0;
        for(i=0;(goOn) && (i < tab1.length) && (i < tab2.length);i=i+1){
            if(tab1[i] != tab2[i]){
                global_messages.lines.push(i);
                document.getElementById('global_messages').innerHTML+='<div class="yywarning">ligne : '+(i+1)+'<br />'+replaceAll(tab1[i],' ','░')+'<br />'+replaceAll(tab2[i],' ','░')+'</div>';
                goOn=false;
            }
        }
        document.getElementById('global_messages').innerHTML+='<div class="yywarning">différence dans des sources en ligne </div>';
        if(comparaisonSourcesSansCommentairesOK === true){
            document.getElementById('global_messages').innerHTML+=lienReprendre;
        }
        return false;
    }
    return true;
}
/*
  =====================================================================================================================
*/
function memeHauteur(normalise,source){
    var bou = document.getElementById(source).getBoundingClientRect();
    document.getElementById(normalise).style.height=bou.height+'px';
}
/*
  =====================================================================================================================
*/
function ajusteTailleTextareaContenantSource(normalise){
    try{
        var tab = document.getElementById(normalise).value.split('\n');
        var largeur=0;
        var i=0;
        for(i=0;i < tab.length;i=i+1){
            if(tab[i].length > largeur){
                largeur=tab[i].length;
            }
        }
        largeur+=5;
        if((largeur > 150) || (largeur <= 0)){
            largeur=150;
        }
    }catch(e){
    }
}
/*
  =====================================================================================================================
*/
function enregistrer2(){
    var sourcesCompactesIdentiques=false;
    var sourcesIdentiques=false;
    var conversion={__xst:false};
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    document.getElementById('nomDuSource').disabled=true;
    __gi1.raz_des_messages();
    document.getElementById('arrayed').innerHTML='';
    var zonedonneesComplementaires = document.getElementById('donneesComplementaires');
    console.clear();
    zonedonneesComplementaires.innerHTML='';
    var a = document.getElementById('zonesource');
    var startMicro = performance.now();
    var tableau1 = iterateCharacters2(a.value);
    global_messages.data.tableau=tableau1;
    var endMicro = performance.now();
    console.log('\n\n=============\nmise en tableau endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
    
    
    var startMicro = performance.now();
    var matriceFonction = functionToArray2(tableau1.out,true,false,'');
    var endMicro = performance.now();
    console.log('analyse syntaxique et mise en matrice endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
    global_messages.data.matrice=matriceFonction;
    
    
    
    console.log('matriceFonction=',matriceFonction);
    if(matriceFonction.__xst === true){
        var startMicro = performance.now();
        var fonctionReecriteAvecRetour1 = arrayToFunct1(matriceFonction.__xva,true,false);
        var endMicro = performance.now();
        console.log('reconstitution du source endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
        var diResultatsCompactes = document.createElement('pre');
        if(fonctionReecriteAvecRetour1.__xst === true){
            document.getElementById('normalise').value=fonctionReecriteAvecRetour1.__xva;
            ajusteTailleTextareaContenantSource('normalise');
            memeHauteur('normalise','zonesource');
            var startMicro = performance.now();
            var compacteOriginal = arrayToFunct1(matriceFonction.__xva,false,false);
            var tableau2 = iterateCharacters2(fonctionReecriteAvecRetour1.__xva);
            var matriceDeLaFonctionReecrite = functionToArray2(tableau2.out,true,false,'');
            var compacteReecrit = arrayToFunct1(matriceDeLaFonctionReecrite.__xva,false,false);
            var endMicro = performance.now();
            console.log('comparaison des compactés=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
            if((compacteOriginal.__xst == true) && (compacteReecrit.__xst === true)){
                if(compacteOriginal.__xva == compacteReecrit.__xva){
                    sourcesCompactesIdentiques=true;
                    logerreur({__xst:true,__xme:'<b>👍 sources compactés Egaux</b>'});
                    var conversion = convertSource(matriceFonction);
                }else{
                    logerreur({__xst:false,__xme:'sources compactés différents'});
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">💥sources compactés différents</b>';
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br />o='+compacteOriginal.__xva;
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br />r='+compacteReecrit.__xva;
                }
            }else{
                diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">compacteOriginal='+JSON.stringify(compacteOriginal)+'</b>';
                diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br /><b style="color:red;">compacteReecrit='+JSON.stringify(compacteReecrit)+'</b>';
            }
            var fonctionReecriteAvecRetour1 = arrayToFunct1(matriceFonction.__xva,true,false);
        }else{
            diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">Erreur de réécriture du source original</b>';
        }
        zonedonneesComplementaires.appendChild(diResultatsCompactes);
        if(sourcesCompactesIdentiques){
            if(a.value == fonctionReecriteAvecRetour1.__xva.replace(/\r\n/g,'\n')){
                logerreur({__xst:true,__xme:'<b>👍👍 sources Egaux</b>'});
                document.getElementById('sauvegarderLeNormalise').disabled=false;
                document.getElementById('nomDuSource').disabled=false;
                if(conversion.__xst == true){
                    global_messages.data.sourceGenere=conversion.__xva;
                    var arr = writeSourceFile(conversion);
                    if(arr.__xst == false){
                        logerreur({__xst:false,__xme:'il y a eu un problème d\'écriture sur disque'});
                        console.log(arr);
                    }else{
                        logerreur({__xst:true,__xme:'<b>👍👍👍 programme écrit sur disque</b>'});
                        document.getElementById('sauvegarderLeNormalise').disabled=false;
                        document.getElementById('nomDuSource').disabled=false;
                    }
                }
            }else{
                logerreur({__xst:false,__xme:'les sources sont différents mais les compactés sont égaux : <a href="javascript:reprendre()" style="border:2px lawngreen outset;background:lawngreen;">reprendre</a>&nbsp;<a style="border:2px lawngreen outset;background:lawngreen;" href="javascript:reprendreEtRecompiler()">reprendre et recompiler</a>  '});
            }
        }
    }
    var lienVoitTableau = document.createElement('a');
    lienVoitTableau.innerHTML='Voir tableau';
    lienVoitTableau.href='javascript:voirTableau1(0)';
    lienVoitTableau.style.cssText='display:inline-block;padding:2px;border:2px red solid;margin:2px;';
    zonedonneesComplementaires.appendChild(lienVoitTableau);
    var lienVoitMatrice = document.createElement('a');
    lienVoitMatrice.innerHTML='Voir matrice';
    lienVoitMatrice.href='javascript:voirMatrice1(0)';
    lienVoitMatrice.style.cssText='display:inline-block;padding:2px;border:2px red solid;margin:2px;';
    zonedonneesComplementaires.appendChild(lienVoitMatrice);
    if(conversion.__xst == true){
        var lienVoitSourceGenere = document.createElement('a');
        lienVoitSourceGenere.innerHTML='Voir source généré';
        lienVoitSourceGenere.href='javascript:voirSourceGenere(0)';
        lienVoitSourceGenere.style.cssText='display:inline-block;padding:2px;border:2px red solid;margin:2px;';
        zonedonneesComplementaires.appendChild(lienVoitSourceGenere);
    }
    var zoneContenantLeTableauCaracteres = document.createElement('div');
    zoneContenantLeTableauCaracteres.style.display='none';
    zoneContenantLeTableauCaracteres.id='zoneContenantLeTableauCaracteres';
    zonedonneesComplementaires.appendChild(zoneContenantLeTableauCaracteres);
    var zoneContenantLaMatrice = document.createElement('div');
    zoneContenantLaMatrice.style.display='none';
    zoneContenantLaMatrice.id='zoneContenantLaMatrice';
    zoneContenantLaMatrice.className='tableau1';
    zonedonneesComplementaires.appendChild(zoneContenantLaMatrice);
    if(conversion.__xst == true){
        var zoneContenantLeSourceGenere = document.createElement('div');
        zoneContenantLeSourceGenere.style.display='none';
        zoneContenantLeSourceGenere.id='zoneContenantLeSourceGenere';
        zonedonneesComplementaires.appendChild(zoneContenantLeSourceGenere);
        var zoneContenantLeSourceGenere2 = document.createElement('textarea');
        zoneContenantLeSourceGenere2.rows=30;
        zoneContenantLeSourceGenere2.cols=120;
        zoneContenantLeSourceGenere2.style.background='lightcyan';
        zoneContenantLeSourceGenere2.style.display='none';
        zoneContenantLeSourceGenere2.id='zoneContenantLeSourceGenere2';
        zonedonneesComplementaires.appendChild(zoneContenantLeSourceGenere2);
        voirSourceGenere();
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages' , 'zonesource');
}
/*
  =====================================================================================================================
*/
function voirSourceGenere(){
    var zoneContenantLeSourceGenere = dogid('zoneContenantLeSourceGenere');
    if((zoneContenantLeSourceGenere) && (zoneContenantLeSourceGenere.innerHTML == '')){
        var zoneSourceGenere = document.createElement('pre');
        zoneSourceGenere.style.fontSize='0.8em';
        zoneSourceGenere.innerHTML=global_messages.data.sourceGenere.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('<','&gt;').replaceAll('"','&quot;');
        zoneContenantLeSourceGenere.appendChild(zoneSourceGenere);
        zoneContenantLeSourceGenere.style.display='';
        zoneContenantLeSourceGenere2.value=global_messages.data.sourceGenere;
        zoneContenantLeSourceGenere2.style.display='';
    }else{
        if(zoneContenantLeSourceGenere.style.display == 'none'){
            zoneContenantLeSourceGenere.style.display='';
        }else{
            zoneContenantLeSourceGenere.style.display='none';
        }
    }
}
/*
  =====================================================================================================================
*/
function voirMatrice1(){
    var zoneContenantLaMatrice = dogid('zoneContenantLaMatrice');
    if((zoneContenantLaMatrice) && (dogid('zoneContenantLaMatrice').innerHTML == '')){
        var zoneMatrice = document.createElement('table');
        ConstruitHtmlMatrice(zoneMatrice,global_messages.data.matrice);
        zoneContenantLaMatrice.appendChild(zoneMatrice);
        zoneContenantLaMatrice.style.display='';
    }else{
        if(zoneContenantLaMatrice.style.display == 'none'){
            zoneContenantLaMatrice.style.display='';
        }else{
            zoneContenantLaMatrice.style.display='none';
        }
    }
}
/*
  =====================================================================================================================
*/
function voirTableau1(){
    var zoneContenantLeTableauCaracteres = dogid('zoneContenantLeTableauCaracteres');
    if((zoneContenantLeTableauCaracteres) && (dogid('zoneContenantLeTableauCaracteres').innerHTML == '')){
        var zoneTableauCaracteres = document.createElement('table');
        ConstruitHtmlTableauCaracteres(zoneTableauCaracteres,'',global_messages.data.tableau);
        zoneContenantLeTableauCaracteres.appendChild(zoneTableauCaracteres);
        zoneContenantLeTableauCaracteres.style.display='';
    }else{
        if(zoneContenantLeTableauCaracteres.style.display == 'none'){
            zoneContenantLeTableauCaracteres.style.display='';
        }else{
            zoneContenantLeTableauCaracteres.style.display='none';
        }
    }
}
/*
  =====================================================================================================================
*/
function afficherFichierSource(source){
    if(source.__xst == true){
        var zoneSource = document.getElementById(source.nomZone);
        zoneSource.value=source.__xva;
        ajusteTailleTextareaContenantSource(source.nomZone);
        document.getElementById('sauvegarderLeNormalise').disabled=true;
        document.getElementById('sauvegarderLeNormalise').setAttribute('data-fichiertexte',source.nomFichierSource);
        document.getElementById('nomDuSource').value=source.nomFichierSource;
        document.getElementById('nomDuSource').disabled=true;
    }else{
        console.log(source);
    }
}
/*
  =====================================================================================================================
*/
function chargerFichierRev(nomFichierSource){
    __gi1.raz_des_messages();
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    document.getElementById('nomDuSource').disabled=true;
    document.getElementById('normalise').value='';
    document.getElementById('zonesource').value='';
    loadRevFile(nomFichierSource,afficherFichierSource,'zonesource',enregistrer2);
}



/*
  =====================================================================================================================
*/
function chargerLaListeDesSourcesRev(){
    var r= new XMLHttpRequest();
    r.open('POST','za_ajax.php?getRevFiles',true);
    r.timeout=6000;
    r.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=utf-8');
    r.onreadystatechange=function(){
        if((r.readyState != 4) || (r.status != 200)){
            if(r.status == 500){
                if(global_messages['e500logged'] == false){
                    try{
                        var errors = JSON.parse(r.responseText);
                        var t='';
                        var elem={};
                        for(elem in errors.messages){
                            global_messages['errors'].push(errors.messages[elem]);
                        }
                        global_messages['e500logged']=true;
                        __gi1.remplir_et_afficher_les_messages1('zone_global_messages' , 'zonesource');
                        console.log(global_messages);
                    }catch(e){
                    }
                }
            }
            return;
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            if(jsonRet.__xst == 'OK'){
                var t='';
                var idFile={};
                for(idFile in jsonRet.files){
                    t+='<button onclick="chargerFichierRev(\''+jsonRet.files[idFile]+'\')" title="'+jsonRet.files[idFile]+'">'+jsonRet.files[idFile]+'</button>';
                }
                document.getElementById('zoneRevFiles').innerHTML=t;
            }else{
                console.log(r);
                alert('BAD job !');
                return;
            }
        }catch(e){
            var errors = JSON.parse(r.responseText);
            var t='';
            var elem={};
            for(elem in errors.messages){
                global_messages['errors'].push(errors.messages[elem]);
            }
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages' , 'zonesource');
            console.error('Go to the network panel and look the preview tab\n\n',e,'\n\n',r,'\n\n');
            return;
        }
    };
    r.onerror=function(e){
        console.error('e=',e);
        /* whatever(); */
        return;
    };
    r.ontimeout=function(e){
        console.error('e=',e);
        /* whatever(); */
        return;
    };
    var ajax_param={'call':{lib:'core',file:'file',funct:'getRevFiles'}};
    try{
        r.send('ajax_param='+encodeURIComponent(JSON.stringify(ajax_param)));
    }catch(e){
        console.error('e=',e);
    }
    /* whatever(); */
    return(logerreur({__xst:true}));
}
/*
  =====================================================================================================================
*/
function chargerLeDernierSourceChargePrecedemment(){
    var fta_dernier_fichier_charge = localStorage.getItem('fta_dernier_fichier_charge');
    if(fta_dernier_fichier_charge !== null){
        loadRevFile(fta_dernier_fichier_charge,afficherFichierSource,'zonesource');
    }
}
/*
  =====================================================================================================================
*/
document.addEventListener('DOMContentLoaded',function(){
    chargerLaListeDesSourcesRev('source1.txt');
    chargerLeDernierSourceChargePrecedemment();
});