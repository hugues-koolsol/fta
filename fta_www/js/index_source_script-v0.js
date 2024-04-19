"use strict";
var global_editeur_derniere_valeur_selecStart=0;
var global_editeur_derniere_valeur_selectEnd=0;
var global_editeur_debut_texte='';
var global_editeur_fin_texte='';
var global_editeur_debut_texte_tab=[];
var global_editeur_scrolltop=0;
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
  Recherche du bloc dans la parenthèse courante et décale le bloc à droite ou à gauche
  =====================================================================================================================
*/
function decaler(direction){
    parentheses();
    return;
    if(global_editeur_derniere_valeur_selecStart < global_editeur_derniere_valeur_selectEnd){
        console.log(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd);
        var zoneSource = document.getElementById('zonesource');
        var texteDebut = zoneSource.value.substr(0,global_editeur_derniere_valeur_selecStart);
        console.log('"'+texteDebut+'"');
        var texteFin = zoneSource.value.substr(global_editeur_derniere_valeur_selectEnd);
        console.log('"'+texteFin+'"');
        var texteSelectionne = zoneSource.value.substr(global_editeur_derniere_valeur_selecStart,global_editeur_derniere_valeur_selectEnd-global_editeur_derniere_valeur_selecStart);
        var tab = texteSelectionne.split('\n');
        var i=0;
        for(i=0;i < tab.length;i=i+1){
            if(tab[i].length > 0){
                tab[i]='  '+tab[i];
            }
        }
        var nouveauTexteDecale = tab.join('\n');
        var nouveauTexte = texteDebut+nouveauTexteDecale+texteFin;
        zoneSource.value=nouveauTexte;
        zoneSource.select();
        zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
    }
}
/*
  =====================================================================================================================
*/
function parentheses(){
    if(global_editeur_derniere_valeur_selecStart < 0){
        return;
    }
    var zoneSource = document.getElementById('zonesource');
    var texte=zoneSource.value;
    if(texte.substr(global_editeur_derniere_valeur_selecStart-1,1) == '('){
        var arr = functionToArray(texte,false);
        var i=0;
        for(i=0;i < arr.value.length;i=i+1){
            if(global_editeur_derniere_valeur_selecStart-1 == arr.value[i][11]){
                zoneSource.select();
                zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
                zoneSource.selectionEnd=arr.value[i][12];
                initialisationEditeur();
                return;
            }
        }
    }
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
    for(x=0;x < lines.length;x=x+1){
        if(x == lineNum){
            break;
        }
        startPos+=(lines[x].length+1);
    }
    var endPos = lines[lineNum].length+startPos;
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
function jumpToError(i){
    selectTextareaLine(document.getElementById('zonesource'),i);
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
    var conversion={'status':false};
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    document.getElementById('nomDuSource').disabled=true;
    clearMessages('zone_global_messages');
    document.getElementById('arrayed').innerHTML='';
    var zonedonneesComplementaires = document.getElementById('donneesComplementaires');
    zonedonneesComplementaires.innerHTML='';
    var a = document.getElementById('zonesource');
    var startMicro = performance.now();
    var tableau1 = iterateCharacters2(a.value);
    global_messages.data.tableau=tableau1;
    var endMicro = performance.now();
    console.log('\n\n=============\nmise en tableau endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
    var startMicro = performance.now();
    var matriceFonction = functionToArray2(tableau1.out,true,false);
    global_messages.data.matrice=matriceFonction;
    var endMicro = performance.now();
    console.log('analyse syntaxique et mise en matrice endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
    console.log('matriceFonction=',matriceFonction);
    if(matriceFonction.status === true){
        var startMicro = performance.now();
        var fonctionReecriteAvecRetour1 = arrayToFunct1(matriceFonction.value,true,false);
        var endMicro = performance.now();
        console.log('reconstitution du source endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
        var diResultatsCompactes = document.createElement('pre');
        if(fonctionReecriteAvecRetour1.status === true){
            document.getElementById('normalise').value=fonctionReecriteAvecRetour1.value;
            ajusteTailleTextareaContenantSource('normalise');
            memeHauteur('normalise','zonesource');
            var startMicro = performance.now();
            var compacteOriginal = arrayToFunct1(matriceFonction.value,false,false);
            var tableau2 = iterateCharacters2(fonctionReecriteAvecRetour1.value);
            var matriceDeLaFonctionReecrite = functionToArray2(tableau2.out,true,false);
            var compacteReecrit = arrayToFunct1(matriceDeLaFonctionReecrite.value,false,false);
            var endMicro = performance.now();
            console.log('comparaison des compactés=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
            if((compacteOriginal.status == true) && (compacteReecrit.status === true)){
                if(compacteOriginal.value == compacteReecrit.value){
                    sourcesCompactesIdentiques=true;
                    logerreur({status:true,message:'<b>👍 sources compactés Egaux</b>'});
                    var conversion = convertSource(matriceFonction);
                }else{
                    logerreur({status:false,message:'sources compactés différents'});
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">💥sources compactés différents</b>';
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br />o='+compacteOriginal.value;
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br />r='+compacteReecrit.value;
                }
            }else{
                diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">compacteOriginal='+JSON.stringify(compacteOriginal)+'</b>';
                diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br /><b style="color:red;">compacteReecrit='+JSON.stringify(compacteReecrit)+'</b>';
            }
            var fonctionReecriteAvecRetour1 = arrayToFunct1(matriceFonction.value,true,false);
        }else{
            diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">Erreur de réécriture du source original</b>';
        }
        zonedonneesComplementaires.appendChild(diResultatsCompactes);
        if(sourcesCompactesIdentiques){
            if(a.value == fonctionReecriteAvecRetour1.value){
                logerreur({status:true,message:'<b>👍👍 sources Egaux</b>'});
                document.getElementById('sauvegarderLeNormalise').disabled=false;
                document.getElementById('nomDuSource').disabled=false;
                if(conversion.status == true){
                    global_messages.data.sourceGenere=conversion.value;
                    var arr = writeSourceFile(conversion);
                    if(arr.status == false){
                        logerreur({status:false,message:'il y a eu un problème d\'écriture sur disque'});
                        console.log(arr);
                    }else{
                        logerreur({status:true,message:'<b>👍👍👍 programme écrit sur disque</b>'});
                        document.getElementById('sauvegarderLeNormalise').disabled=false;
                        document.getElementById('nomDuSource').disabled=false;
                    }
                }
            }else{
                logerreur({status:false,message:'les sources sont différents mais les compactés sont égaux : <a href="javascript:reprendre()" style="border:2px lawngreen outset;background:lawngreen;">reprendre</a>&nbsp;<a style="border:2px lawngreen outset;background:lawngreen;" href="javascript:reprendreEtRecompiler()">reprendre et recompiler</a>  '});
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
    if(conversion.status == true){
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
    if(conversion.status == true){
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
    displayMessages('zone_global_messages');
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
    if(source.status == true){
        var zoneSource = document.getElementById(source.nomZone);
        zoneSource.value=source.value;
        ajusteTailleTextareaContenantSource(source.nomZone);
        razEditeur();
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
    clearMessages('zone_global_messages');
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    document.getElementById('nomDuSource').disabled=true;
    document.getElementById('normalise').value='';
    document.getElementById('zonesource').value='';
    loadRevFile(nomFichierSource,afficherFichierSource,'zonesource',enregistrer2);
}
/*
  =====================================================================================================================
*/
function createSelection(field,start,end){
    if(field.createTextRange){
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character',start);
        selRange.moveEnd('character',end-start);
        selRange.select();
    }else if(field.setSelectionRange){
        field.setSelectionRange(start,end);
    }else if(field.selectionStart){
        field.selectionStart=start;
        field.selectionEnd=end;
    }
    field.focus();
}
/*
  =====================================================================================================================
*/
function mettreEnCommentaire(){
    var zoneSource = document.getElementById('zonesource');
    console.log(zoneSource.selectionStart,zoneSource.selectionEnd);
    var debut=0;
    var fin=zoneSource.value.length;
    var obj = iterateCharacters2(zoneSource.value);
    console.log('obj=',obj);
    var i=zoneSource.selectionStart-1;
    for(i=zoneSource.selectionStart-1;i >= 0;i=i-1){
        if(obj.out[i][0] == '\n'){
            debut=(i+1);
            break;
        }
        if(i == 0){
            debut=0;
            break;
        }
    }
    var debutBoucle=zoneSource.selectionEnd;
    if(zoneSource.selectionEnd > 1){
        if(zoneSource.value.substr(zoneSource.selectionEnd-1,1) == '\n'){
            debutBoucle=zoneSource.selectionEnd-1;
        }
    }
    var i=debutBoucle;
    for(i=debutBoucle;i < obj.out.length;i=i+1){
        console.log('i='+i+' , c="'+obj.out[i][0]+'"');
        if(obj.out[i][0] == '\n'){
            fin=i;
            break;
        }else if(i == obj.out.length-1){
            fin=i;
            break;
        }
    }
    console.log('debut='+debut+', fin='+fin);
    var txtDeb = zoneSource.value.substr(0,debut);
    var selectionARemplacer = zoneSource.value.substr(debut,fin-debut);
    var txtFin = zoneSource.value.substr(fin);
    console.log('\n======\ntxtDeb="'+txtDeb+'"\n\n\nselectionARemplacer="'+selectionARemplacer+'"\n\n\ntxtFin="'+txtFin+'"');
    var nouveauCommentaire = '#('+selectionARemplacer+')';
    if(txtFin !== ''){
    }
    var nouveauTexte = txtDeb+nouveauCommentaire+txtFin;
    console.log('nouveauTexte="'+nouveauTexte+'"');
    zoneSource.value=nouveauTexte;
    createSelection(zoneSource,debut,(fin+3));
}
/*
  =====================================================================================================================
*/
function insertSource(nomFonction){
    var i=0;
    var j=0;
    var k=0;
    var t='';
    var toAdd='';
    var espaces='';
    var zoneSource = document.getElementById('zonesource');
    if((nomFonction == 'choix') || (nomFonction == 'boucle') || (nomFonction == 'appelf') || (nomFonction == 'affecte')){
        if(global_editeur_derniere_valeur_selecStart == global_editeur_derniere_valeur_selectEnd){
            j=-1;
            if(global_editeur_debut_texte_tab.length > 0){
                espaces=global_editeur_debut_texte_tab[global_editeur_debut_texte_tab.length-1][0];
                for(i=0;i < espaces.length;i=i+1){
                    if((espaces.substr(i,1) == ' ') || (espaces.substr(i,1) == '\t')){
                        k=(i+1);
                    }else{
                        j=i;
                    }
                }
            }
            var de1 = ' '.repeat(NBESPACESREV);
            if((j < 0) && (espaces.length == k)){
                if(nomFonction == 'choix'){
                    toAdd='choix(';
                    toAdd+='\n'+espaces+de1+'si(';
                    toAdd+='\n'+espaces+de1+de1+'condition(';
                    toAdd+='\n'+espaces+de1+de1+de1+'non(';
                    toAdd+='\n'+espaces+de1+de1+de1+de1+'( egal(vrai , vrai) ),';
                    toAdd+='\n'+espaces+de1+de1+de1+de1+'et( egal( vrai , vrai ) )';
                    toAdd+='\n'+espaces+de1+de1+de1+')';
                    toAdd+='\n'+espaces+de1+de1+'),';
                    toAdd+='\n'+espaces+de1+de1+'alors(';
                    toAdd+='\n'+espaces+de1+de1+de1+'affecte( a , 1 )';
                    toAdd+='\n'+espaces+de1+de1+')';
                    toAdd+='\n'+espaces+de1+'),';
                    toAdd+='\n'+espaces+de1+'sinonsi(';
                    toAdd+='\n'+espaces+de1+de1+'condition( (true) ),';
                    toAdd+='\n'+espaces+de1+de1+'alors(';
                    toAdd+='\n'+espaces+de1+de1+de1+'affecte(a , 1)';
                    toAdd+='\n'+espaces+de1+de1+')';
                    toAdd+='\n'+espaces+de1+'),';
                    toAdd+='\n'+espaces+de1+'sinon(';
                    toAdd+='\n'+espaces+de1+de1+'alors(';
                    toAdd+='\n'+espaces+de1+de1+de1+'affecte(a , 1)';
                    toAdd+='\n'+espaces+de1+de1+')';
                    toAdd+='\n'+espaces+de1+de1+'#(finsinon)';
                    toAdd+='\n'+espaces+de1+'),';
                    toAdd+='\n'+espaces+'),';
                    toAdd+='\n'+espaces+'#(finchoix suite du source)';
                }else if(nomFonction == 'boucle'){
                    toAdd='boucle(';
                    toAdd+='\n'+espaces+de1+'initialisation(affecte(i , 0)),';
                    toAdd+='\n'+espaces+de1+'condition(inf(i , tab.length)),';
                    toAdd+='\n'+espaces+de1+'increment(affecte(i , i+1)),';
                    toAdd+='\n'+espaces+de1+'faire(';
                    toAdd+='\n'+espaces+de1+de1+'affecte(a , 1)';
                    toAdd+='\n'+espaces+de1+')';
                    toAdd+='\n'+espaces+'),';
                    toAdd+='\n'+espaces+'#(fin boucle, suite du source)';
                }else if(nomFonction == 'appelf'){
                    toAdd='appelf(';
                    toAdd+='\n'+espaces+de1+'r(variableDeRetour),';
                    toAdd+='\n'+espaces+de1+'element(nomElement),';
                    toAdd+='\n'+espaces+de1+'nomf(nomFonction),';
                    toAdd+='\n'+espaces+de1+'p(parametre1),';
                    toAdd+='\n'+espaces+de1+'p(parametre2)';
                    toAdd+='\n'+espaces+'),';
                    toAdd+='\n'+espaces+'#(fin appelf),';
                }else if(nomFonction == 'affecte'){
                    toAdd='affecte(nomVariable , valeurVariable),';
                }
                t=global_editeur_debut_texte+toAdd+global_editeur_fin_texte;
                zoneSource.value=t;
                zoneSource.select();
                zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
                zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart;
                initialisationEditeur();
                return;
            }
        }
    }
}
/*
  =====================================================================================================================
*/
function initialisationEditeur(){
    var i=0;
    var j=0;
    var tabtext=[];
    var toAdd='';
    var zoneSource = document.getElementById('zonesource');
    global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
    global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
    global_editeur_debut_texte=zoneSource.value.substr(0,zoneSource.selectionStart);
    tabtext=global_editeur_debut_texte.split('\n');
    global_editeur_debut_texte_tab=[];
    j=0;
    for(i=0;i < tabtext.length;i=i+1){
        global_editeur_debut_texte_tab.push(Array(tabtext[i],j));
        j+=(tabtext[i].length+1);
    }
    global_editeur_fin_texte=zoneSource.value.substr(zoneSource.selectionStart);
}
/*
  =====================================================================================================================
*/
function razEditeur(){
    var zoneSource = document.getElementById('zonesource');
    global_editeur_derniere_valeur_selecStart=0;
    global_editeur_derniere_valeur_selectEnd=0;
    global_editeur_debut_texte='';
    global_editeur_debut_texte_tab=[];
    global_editeur_fin_texte=zoneSource.value.substr(zoneSource.selectionStart);
    global_editeur_scrolltop=0;
}
/*
  =====================================================================================================================
*/
document.getElementById('zonesource').onkeydown=function(e){
    initialisationEditeur();
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    return;
};
/*
  =====================================================================================================================
*/
document.getElementById('zonesource').onclick=function(e){
    initialisationEditeur();
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    return;
};
/*
  =====================================================================================================================
*/
document.getElementById('zonesource').onkeydown=function(e){
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    global_editeur_scrolltop=this.scrollTop;
    return;
};
/*
  =====================================================================================================================
*/
document.getElementById('normalise').onclick=function(e){
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    return;
};
/*
  =====================================================================================================================
*/
document.getElementById('normalise').onkeydown=function(e){
    document.getElementById('sauvegarderLeNormalise').disabled=true;
    return;
};
/*
  =====================================================================================================================
*/
document.getElementById('zonesource').onkeyup=analyseKeyUp;
/*
  =====================================================================================================================
*/
var globale_timeoutEditeur=null;
function analyseKeyUp(e){
    clearTimeout(globale_timeoutEditeur);
    var i=0;
    var j=0;
    var tabtext=[];
    if(e.keyCode == 13){
        var zoneSource = document.getElementById('zonesource');
        global_editeur_derniere_valeur_selecStart=zoneSource.selectionStart;
        global_editeur_derniere_valeur_selectEnd=zoneSource.selectionEnd;
        global_editeur_debut_texte=zoneSource.value.substr(0,zoneSource.selectionStart);
        global_editeur_fin_texte=zoneSource.value.substr(global_editeur_derniere_valeur_selectEnd);
        tabtext=global_editeur_debut_texte.split('\n');
        global_editeur_debut_texte_tab=[];
        j=0;
        for(i=0;i < tabtext.length;i=i+1){
            global_editeur_debut_texte_tab.push(Array(tabtext[i],j));
            j+=(tabtext[i].length+1);
        }
        if(global_editeur_debut_texte_tab.length >= 2){
            var textPrec=global_editeur_debut_texte_tab[global_editeur_debut_texte_tab.length-2][0];
            if(textPrec != ''){
                var pos=0;
                var toAdd='';
                for(i=0;i < textPrec.length;i=i+1){
                    if(textPrec.substr(i,1) != ' '){
                        pos=i;
                        break;
                    }
                    toAdd+=' ';
                }
                if(pos >= 0){
                    var offSetBack=0;
                    if(textPrec.substr(textPrec.length-1,1) == '('){
                        if(global_editeur_fin_texte.substr(0,1) == ')'){
                            offSetBack=(toAdd.length+1);
                            toAdd+=' '.repeat(NBESPACESREV)+'\n'+toAdd;
                        }else{
                            toAdd+=' '.repeat(NBESPACESREV);
                        }
                    }else{
                        if(global_editeur_fin_texte.substr(0,1) == ')'){
                            if(toAdd.length > 2){
                            }
                        }
                    }
                    this.value=global_editeur_debut_texte+toAdd+global_editeur_fin_texte;
                    global_editeur_derniere_valeur_selecStart=global_editeur_derniere_valeur_selecStart+toAdd.length-offSetBack;
                    this.selectionStart=global_editeur_derniere_valeur_selecStart;
                    this.selectionEnd=global_editeur_derniere_valeur_selecStart;
                    global_editeur_derniere_valeur_selecStart=this.selectionStart;
                    global_editeur_derniere_valeur_selectEnd=this.selectionEnd;
                    initialisationEditeur();
                    this.scrollTop=global_editeur_scrolltop;
                }
            }
        }else{
        }
        zoneSource.scrollTo({left:0});
        window.scrollTo({left:0});
    }else if((e.keyCode == 86) && (e.ctrlKey == true)){
        var zoneSource = document.getElementById('zonesource');
        globale_timeoutEditeur=setTimeout(function(){
            zoneSource.scrollTop=global_editeur_scrolltop;
        },1);
    }else if(e.keyCode == 36){
        var zoneSource = document.getElementById('zonesource');
        zoneSource.scrollTo({left:0});
        window.scrollTo({left:0});
    }else{
        initialisationEditeur();
    }
    return false;
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
                        displayMessages('zone_global_messages');
                        console.log(global_messages);
                    }catch(e){
                    }
                }
            }
            return;
        }
        try{
            var jsonRet = JSON.parse(r.responseText);
            if(jsonRet.status == 'OK'){
                var t='';
                var idFile={};
                for(idFile in jsonRet.files){
                    t+='<button onclick="chargerFichierRev(\''+jsonRet.files[idFile]+'\')" title="'+jsonRet.files[idFile]+'">'+jsonRet.files[idFile]+'</button>';
                }
                document.getElementById('zoneRevFiles').innerHTML=t;
            }else{
                display_ajax_error_in_cons(jsonRet);
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
            displayMessages('zone_global_messages');
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
    return(logerreur({status:true}));
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