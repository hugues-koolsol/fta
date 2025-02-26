"use strict";
/*
  =====================================================================================================================
*/
function convertSource( objMatSrc ){
    var message='';
    var file_name='';
    var file_extension='';
    var file_path='';
    var type_source='';
    var tabConcatFichier=[];
    var retProgrammeSource={};
    var obj={};
    var l01=objMatSrc.__xva.length;
    var position_de_la_balise_source=-1;
    for( var i=1 ; i < l01 ; i=objMatSrc.__xva[i][12] ){
        if(objMatSrc.__xva[i][3] == 0){
            if(objMatSrc.__xva[i][1] == '#'){
            }else if(objMatSrc.__xva[i][1] === 'src_javascript'
                   || objMatSrc.__xva[i][1] == 'src_html'
                   || objMatSrc.__xva[i][1] == 'src_php'
                   || objMatSrc.__xva[i][1] == 'src_sql'
            ){
                type_source=objMatSrc.__xva[i][1];
                for( var j=i + 1 ; j < l01 ; j=objMatSrc.__xva[j][12] ){
                    if(objMatSrc.__xva[j][2] == 'f'){
                        if(objMatSrc.__xva[j][1] === ''){
                            for( var k=j + 1 ; k < objMatSrc.__xva.length ; k=objMatSrc.__xva[k][12] ){
                                if(objMatSrc.__xva[k][7] == objMatSrc.__xva[j][0] && objMatSrc.__xva[j][8] >= 2){
                                    if(objMatSrc.__xva[k][1] == 'file_name' && objMatSrc.__xva[k + 1][1] != ''){
                                        file_name=objMatSrc.__xva[k + 1][1];
                                    }
                                    if(objMatSrc.__xva[k][1] == 'file_extension' && objMatSrc.__xva[k + 1][1] != ''){
                                        file_extension=objMatSrc.__xva[k + 1][1];
                                    }
                                    if(objMatSrc.__xva[k][1] == 'file_path' && objMatSrc.__xva[k + 1][1] != ''){
                                        file_path=objMatSrc.__xva[k + 1][1];
                                    }
                                }
                            }
                        }else if(objMatSrc.__xva[j][1] === '#'){
                        }else if(objMatSrc.__xva[j][1] === 'source'){
                            position_de_la_balise_source=j;
                        }else if(objMatSrc.__xva[j][1] === 'concatFichier'){
                            if(objMatSrc.__xva[j][8] === 1 && objMatSrc.__xva[j + 1][2] === 'c'){
                                tabConcatFichier.push( objMatSrc.__xva[j + 1][1] );
                            }else{
                                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + ' concat fichjer ne doit avojr qu\'un seul argument '} ));
                            }
                        }else{
                            return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + 'l\'élément ne doit pas se trouver là ' + JSON.stringify( objMatSrc.__xva[j] )} ));
                        }
                    }
                }
            }
        }
    }
    if(type_source == ''){
        return(__m_rev1.empiler_erreur( {
                "__xst" : __xer ,
                "__xme" : __m_rev1.nl2() + 'la fonction racine doit être "src_javascript", "src_html" , "src_sql" ou bien "src_php" '
            } ));
    }
    var t='';
    if(file_name != '' && file_path != '' && position_de_la_balise_source > 0){
        if(type_source == 'src_php' && file_extension == 'php'){
            retProgrammeSource=__m_rev_vers_php1.c_tab_vers_php( objMatSrc.__xva , {"indice_de_debut" : position_de_la_balise_source + 1} );
            if(retProgrammeSource.__xst === __xsu){
                t+='<?php' + CRLF + retProgrammeSource.__xva + CRLF + '?>';
            }else{
                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'erreur dans un php'} ));
            }
            t=t.replace( /\/\*\*\//g , '' );
            t=t.replace( /\?><\?php/g , '' );
            t=t.replace( /<\?php\?>/g , '' );
            t=t.replace( /<\?php\r\?>/g , '' );
            t=t.replace( /<\?php\n\?>/g , '' );
            t=t.replace( /<\?php\r\n\?>/g , '' );
            if(t.substr( 0 , 2 ) === '\r\n'){
                t=t.substr( 2 );
            }else{
                if(t.substr( 0 , 1 ) === '\r' || t.substr( 0 , 1 ) === '\n'){
                    t=t.substr( 1 );
                }
            }
            return({
                    "__xst" : __xsu ,
                    "__xva" : t ,
                    "file_name" : file_name ,
                    "file_path" : file_path ,
                    "file_extension" : file_extension ,
                    "tabConcatFichier" : tabConcatFichier
                });
        }else if(type_source == 'src_javascript' && file_extension == 'js'){
            retProgrammeSource=__m_rev_vers_js1.c_tab_vers_js( objMatSrc.__xva , {"indice_de_debut" : position_de_la_balise_source + 1} );
            if(retProgrammeSource.__xst === __xsu){
                t+=retProgrammeSource.__xva;
            }else{
                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'erreur dans un javascript'} ));
            }
            return({
                    "__xst" : __xsu ,
                    "__xva" : t ,
                    "file_name" : file_name ,
                    "file_path" : file_path ,
                    "file_extension" : file_extension ,
                    "tabConcatFichier" : tabConcatFichier
                });
        }else if(type_source == 'src_html' && file_extension == 'html'){
            retProgrammeSource=__m_rev_vers_html1.c_tab_vers_html( objMatSrc.__xva , {"indice_de_debut" : position_de_la_balise_source + 1} );
            debugger
            if(retProgrammeSource.__xst === __xsu){
                t+=retProgrammeSource.__xva;
            }else{
                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'erreur dans un html'} ));
            }
            return({
                    "__xst" : __xsu ,
                    "__xva" : t ,
                    "file_name" : file_name ,
                    "file_path" : file_path ,
                    "file_extension" : file_extension ,
                    "tabConcatFichier" : tabConcatFichier
                });
        }else if(type_source == 'src_sql' && file_extension == 'sql'){
            retProgrammeSource=__m_rev_vers_sql1.c_tab_vers_js( objMatSrc.__xva , {"indice_de_debut" : position_de_la_balise_source + 1} );
            if(retProgrammeSource.__xst === __xsu){
                t+=retProgrammeSource.__xva;
            }else{
                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'erreur dans un sql'} ));
            }
            return({
                    "__xst" : __xsu ,
                    "__xva" : t ,
                    "file_name" : file_name ,
                    "file_path" : file_path ,
                    "file_extension" : file_extension ,
                    "tabConcatFichier" : tabConcatFichier
                });
        }
    }else{
        return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : 0 ,"__xme" : __m_rev1.nl2() + 'les noms et chemin du fichier doivent être complétés'} ));
    }
}
/*
  =====================================================================================================================
*/
function sauvegardeTexteSource(){
    __gi1.raz_des_messages();
    var i=0;
    var c='';
    var obj={};
    if(document.getElementById( 'sauvegarderLeNormalise' ).getAttribute( 'data-fichiertexte' ) != ''){
        var nomDuSource=document.getElementById( 'nomDuSource' ).value;
        for( i=0 ; i < nomDuSource.length ; i=i + 1 ){
            c=nomDuSource.substr( i , 1 );
            if(c == '/'
                   || c == '\\'
                   || c == ':'
                   || c == '*'
                   || c == '?'
                   || c == '"'
                   || c == '<'
                   || c == '>'
                   || c == '|'
            ){
                alert( 'Le caractère "' + c + '" n\'est pas autorisé ( tout comme /\\:*?"<>|' );
                return;
            }else{
                if(!(c.charCodeAt( 0 ) >= 32 && c.charCodeAt( 0 ) < 127)){
                    alert( 'Le caractère "' + c + '" n\'est pas autorisé ( tout comme /\\:*?"<>|' );
                    return;
                }
            }
        }
        var ajax_param={
            "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'sauvegarger_un_fichier_rev'} ,
            "contenu_du_fichier" : document.getElementById( 'normalise' ).value ,
            "file_name" : nomDuSource
        };
        async function sauvegarger_un_fichier_rev( url="" , ajax_param ){
            return(__gi1.recupérer_un_fetch( url , ajax_param ));
        }
        sauvegarger_un_fichier_rev( 'za_ajax.php?sauvegarger_un_fichier_rev' , ajax_param ).then( ( donnees ) => {
                if(donnees.__xst === __xsu){
                    __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : '👍 fichier sauvegardé 0'} );
                }
                __gi1.remplir_et_afficher_les_messages1( 'zonesource' );
            } );
        /* document.getElementById( 'sauvegarderLeNormalise' ).disabled=true; */
        document.getElementById( 'nomDuSource' ).disabled=true;
    }
}
/*
  =====================================================================================================================
*/
function reprendre(){
    document.getElementById( 'zonesource' ).value=document.getElementById( 'normalise' ).value;
}
/*
  =====================================================================================================================
*/
function reprendreEtRecompiler(){
    document.getElementById( 'zonesource' ).value=document.getElementById( 'normalise' ).value;
    enregistrer2();
}
/*
  =====================================================================================================================
*/
function memeHauteur( normalise , source ){
    var bou=document.getElementById( source ).getBoundingClientRect();
    document.getElementById( normalise ).style.height=bou.height + 'px';
}
/*
  =====================================================================================================================
*/
function ajusteTailleTextareaContenantSource( normalise ){
    try{
        var tab=document.getElementById( normalise ).value.split( '\n' );
        var largeur=0;
        var i=0;
        for( i=0 ; i < tab.length ; i=i + 1 ){
            if(tab[i].length > largeur){
                largeur=tab[i].length;
            }
        }
        largeur+=5;
        if(largeur > 150 || largeur <= 0){
            largeur=150;
        }
    }catch(e){}
}
/*
  =====================================================================================================================
*/
function concateneFichiers( tabConcatFichier , file_name , file_extension , file_path ){
    var fichierAConcatener='';
    if(Array.isArray( tabConcatFichier )){
        fichierAConcatener=tabConcatFichier.shift();
    }else{
        var nouveau_tableau=[];
        for(var i in tabConcatFichier){
            nouveau_tableau.push( tabConcatFichier[i] );
        }
        tabConcatFichier=nouveau_tableau;
        if(tabConcatFichier.length > 0){
            fichierAConcatener=tabConcatFichier.shift();
        }
    }
    if(fichierAConcatener !== ''){
        var ajax_param={
            "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'concatener_des_fichiers1'} ,
            "file_name" : file_name ,
            "file_extension" : file_extension ,
            "file_path" : file_path ,
            "fichierAConcatener" : fichierAConcatener ,
            "tabConcatFichier" : tabConcatFichier
        };
        async function concatener_des_fichiers1( url="" , ajax_param ){
            return(__gi1.recupérer_un_fetch( url , ajax_param ));
        }
        concatener_des_fichiers1( 'za_ajax.php?concatener_des_fichiers1' , ajax_param ).then( ( donnees ) => {
                if(donnees.__xst === __xsu){
                    __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : 'le fichier ' + fichierAConcatener + ' a été concaténé'} );
                    if(donnees.__entree.tabConcatFichier){
                        concateneFichiers( donnees.__entree.tabConcatFichier , donnees.__entree.file_name , donnees.__entree.file_extension , donnees.__entree.file_path );
                    }
                }
            } );
    }else{
        /* on a fini de concaténer , on peut aller chercher le source */
        var ajax_param={
            "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'recuperer_un_genere'} ,
            "file_name" : file_name ,
            "file_extension" : file_extension ,
            "file_path" : file_path
        };
        console.log( 'ajax_param=' , ajax_param );
        async function recuperer_un_genere( url="" , ajax_param ){
            return(__gi1.recupérer_un_fetch( url , ajax_param ));
        }
        recuperer_un_genere( 'za_ajax.php?recuperer_un_genere' , ajax_param ).then( ( donnees ) => {
                console.log( donnees );
                if(donnees.__xst === __xsu){
                    document.getElementById( 'zoneContenantLeSourceGenere2' ).value=donnees.__xva;
                }else{
                    debugger;
                }
            } );
    }
    __gi1.remplir_et_afficher_les_messages1( 'zonesource' );
}
/*
  =====================================================================================================================
*/
function enregistrer2(){
    var sourcesCompactesIdentiques=false;
    var sourcesIdentiques=false;
    var conversion={"__xst" : __xer};
    document.getElementById( 'bouton_voir_source' ).style.display='none';
    document.getElementById( 'bouton_voir_matrice' ).style.display='none';
    document.getElementById( 'bouton_voir_tableau' ).style.display='none';
    document.getElementById( 'zoneContenantLaMatrice' ).value='';
    document.getElementById( 'zoneContenantLaMatrice' ).style.display='none';
    document.getElementById( 'zoneContenantLeTableauCaracteres' ).value='';
    document.getElementById( 'zoneContenantLeTableauCaracteres' ).style.display='none';
    document.getElementById( 'zoneContenantLeSourceGenere2' ).value='';
    document.getElementById( 'zoneContenantLeSourceGenere2' ).style.display='none';
    /* document.getElementById( 'sauvegarderLeNormalise' ).disabled=true; */
    document.getElementById( 'nomDuSource' ).disabled=true;
    __gi1.raz_des_messages();
    document.getElementById( 'arrayed' ).innerHTML='';
    var zonedonneesComplementaires=document.getElementById( 'donneesComplementaires' );
    /* zonedonneesComplementaires.innerHTML=''; */
    var a=document.getElementById( 'zonesource' );
    var startMicro=performance.now();
    var matriceFonction=__m_rev1.rev_tm( a.value );
    var endMicro=performance.now();
    console.log( 'analyse syntaxique et mise en matrice endMicro=' , (parseInt( (endMicro - startMicro) * 1000 , 10 ) / 1000) + ' ms' );
    console.log( 'matriceFonction=' , matriceFonction );
    if(matriceFonction.__xst === __xsu){
        var startMicro=performance.now();
        var fonctionReecriteAvecRetour1=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
        var endMicro=performance.now();
        console.log( 'reconstitution du source endMicro=' , (parseInt( (endMicro - startMicro) * 1000 , 10 ) / 1000) + ' ms' );
        if(fonctionReecriteAvecRetour1.__xst === __xsu){
            document.getElementById( 'normalise' ).value=fonctionReecriteAvecRetour1.__xva;
            ajusteTailleTextareaContenantSource( 'normalise' );
            memeHauteur( 'normalise' , 'zonesource' );
            var startMicro=performance.now();
            var compacteOriginal=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , false , 1 );
            var matriceDeLaFonctionReecrite=__m_rev1.rev_tm( fonctionReecriteAvecRetour1.__xva );
            var compacteReecrit=__m_rev1.matrice_vers_source_rev1( matriceDeLaFonctionReecrite.__xva , 0 , false , 1 );
            var endMicro=performance.now();
            console.log( 'comparaison des compactés=' , (parseInt( (endMicro - startMicro) * 1000 , 10 ) / 1000) + ' ms' );
            if(compacteOriginal.__xst == true && compacteReecrit.__xst === __xsu){
                if(compacteOriginal.__xva == compacteReecrit.__xva){
                    sourcesCompactesIdentiques=true;
                    __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : '<b>👍 sources compactés Egaux</b>'} );
                    var conversion=convertSource( matriceFonction );
                }else{
                    __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'sources compactés différents'} );
                }
            }else{
            }
            var fonctionReecriteAvecRetour1=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
        }else{
        }
    }
    if(conversion.__xst === __xsu){
        document.getElementById( 'bouton_voir_source' ).style.display='inline-block';
        document.getElementById( 'bouton_voir_matrice' ).style.display='inline-block';
        document.getElementById( 'bouton_voir_tableau' ).style.display='inline-block';
        document.getElementById( 'zoneContenantLeSourceGenere2' ).value=conversion.__xva;
    }
    if(matriceFonction.__xst === __xsu && sourcesCompactesIdentiques){
        if(a.value == fonctionReecriteAvecRetour1.__xva.replace( /\r\n/g , '\n' )){
            __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : '<b>👍👍 sources Egaux</b>'} );
            document.getElementById( 'sauvegarderLeNormalise' ).disabled=false;
            document.getElementById( 'nomDuSource' ).disabled=false;
            if(conversion.__xst == true){
                var ajax_param={
                    "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'ecrire_fichier1'} ,
                    "contenu_du_fichier" : conversion.__xva ,
                    "file_name" : conversion.file_name ,
                    "file_extension" : conversion.file_extension ,
                    "file_path" : conversion.file_path
                };
                async function ecrire_fichier1( url="" , ajax_param ){
                    return(__gi1.recupérer_un_fetch( url , ajax_param ));
                }
                ecrire_fichier1( 'za_ajax.php?ecrire_fichier1' , ajax_param ).then( ( donnees ) => {
                        if(donnees.__xst === __xsu){
                            __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : '<b>👍👍👍 le programme résultant a été écrit sur le disque</b>'} );
                            if(conversion.tabConcatFichier.length > 0){
                                concateneFichiers( conversion.tabConcatFichier , conversion.file_name , conversion.file_extension , conversion.file_path );
                            }
                            document.getElementById( 'sauvegarderLeNormalise' ).disabled=false;
                            document.getElementById( 'nomDuSource' ).disabled=false;
                        }else{
                            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'il y a eu un problème d\'écriture sur disque'} );
                        }
                        __gi1.remplir_et_afficher_les_messages1( 'zonesource' );
                    } );
            }
        }else{
            __m_rev1.empiler_erreur( {
                    "__xst" : __xer ,
                    "__xme" : 'les sources sont différents mais les compactés sont égaux : <br /><a href="javascript:reprendre()" class="yysucces">reprendre</a>&nbsp;<a class="yysucces" href="javascript:reprendreEtRecompiler()">reprendre et recompiler</a>'
                } );
        }
    }
    __gi1.remplir_et_afficher_les_messages1( 'zonesource' );
}
/*
  =====================================================================================================================
*/
function voirSourceGenere(){
    document.getElementById( 'zoneContenantLaMatrice' ).style.display='none';
    document.getElementById( 'zoneContenantLeTableauCaracteres' ).style.display='none';
    if(document.getElementById( 'zoneContenantLeSourceGenere2' ).style.display === 'none'){
        document.getElementById( 'zoneContenantLeSourceGenere2' ).style.display='';
    }else{
        document.getElementById( 'zoneContenantLeSourceGenere2' ).style.display='none';
    }
}
/*
  =====================================================================================================================
*/
function voirMatrice1( div_de_la_zone_source ){
    document.getElementById( 'zoneContenantLeSourceGenere2' ).style.display='none';
    document.getElementById( 'zoneContenantLeTableauCaracteres' ).style.display='none';
    var zoneContenantLaMatrice=document.getElementById( 'zoneContenantLaMatrice' );
    if(zoneContenantLaMatrice && document.getElementById( 'zoneContenantLaMatrice' ).innerHTML === ''){
        var contenu=document.getElementById( div_de_la_zone_source ).value;
        var matrice=__m_rev1.rev_tm( contenu );
        if(matrice.__xst === __xsu){
            var zoneMatrice=document.createElement( 'table' );
            __gi1.construit_tableau_html_de_le_matrice_rev( zoneMatrice , matrice );
            zoneContenantLaMatrice.appendChild( zoneMatrice );
        }else{
            debugger;
        }
    }
    if(zoneContenantLaMatrice.style.display == 'none'){
        zoneContenantLaMatrice.style.display='';
    }else{
        zoneContenantLaMatrice.style.display='none';
    }
}
/*
  =====================================================================================================================
*/
function voirTableau1( div_de_la_zone_source ){
    document.getElementById( 'zoneContenantLaMatrice' ).style.display='none';
    document.getElementById( 'zoneContenantLeSourceGenere2' ).style.display='none';
    var zoneContenantLeTableauCaracteres=document.getElementById( 'zoneContenantLeTableauCaracteres' );
    if(zoneContenantLeTableauCaracteres && document.getElementById( 'zoneContenantLeTableauCaracteres' ).innerHTML === ''){
        var zoneTableauCaracteres=document.createElement( 'table' );
        var contenu=document.getElementById( div_de_la_zone_source ).value;
        var obj=__m_rev1.txt_en_tableau( contenu );
        __gi1.construit_un_html_du_tableau_des_caracteres( zoneTableauCaracteres , '' , obj );
        zoneContenantLeTableauCaracteres.appendChild( zoneTableauCaracteres );
    }
    if(zoneContenantLeTableauCaracteres.style.display == 'none'){
        zoneContenantLeTableauCaracteres.style.display='';
    }else{
        zoneContenantLeTableauCaracteres.style.display='none';
    }
}
/*
  =====================================================================================================================
*/
function chargerFichierRev( nomFichierSource ){
    __gi1.raz_des_messages();
    /* document.getElementById( 'sauvegarderLeNormalise' ).disabled=true; */
    document.getElementById( 'nomDuSource' ).disabled=true;
    document.getElementById( 'normalise' ).value='';
    document.getElementById( 'zonesource' ).value='';
    var ajax_param={
        "call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'charger_un_ficher_rev' ,"opt" : {"delais_admis" : 1500}} ,
        "file_name" : nomFichierSource
    };
    async function charger_fichier_rev1( url="" , ajax_param ){
        return(__gi1.recupérer_un_fetch( url , ajax_param ));
    }
    charger_fichier_rev1( 'za_ajax.php?charger_un_ficher_rev' , ajax_param ).then( ( donnees ) => {
            if(donnees.__xst === __xsu){
                localStorage.setItem( "fta_dernier_fichier_charge" , donnees.__entree.file_name );
                var zoneSource=document.getElementById( 'zonesource' );
                zoneSource.value=donnees.__xva;
                ajusteTailleTextareaContenantSource( 'zonesource' );
                /* document.getElementById( 'sauvegarderLeNormalise' ).disabled=true; */
                document.getElementById( 'sauvegarderLeNormalise' ).setAttribute( 'data-fichiertexte' , donnees.__entree.file_name );
                document.getElementById( 'nomDuSource' ).value=donnees.__entree.file_name;
                document.getElementById( 'nomDuSource' ).disabled=true;
                enregistrer2();
            }else{
                console.log( 'donnees=' , donnees );
                __gi1.remplir_et_afficher_les_messages1( 'zonesource' );
            }
        } );
}
/*
  =====================================================================================================================
*/
function initialisation_page_rev( par ){
    /*
      chargement de la liste des sources
    */
    async function charger_la_liste_des_sources1( url="" , ajax_param ){
        return(__gi1.recupérer_un_fetch( url , ajax_param ));
    }
    var ajax_param={"call" : {"lib" : 'core' ,"file" : 'file' ,"funct" : 'getRevFiles'}};
    charger_la_liste_des_sources1( 'za_ajax.php?getRevFiles' , ajax_param ).then( ( donnees ) => {
            if(donnees.__xst === __xsu){
                var fta_dernier_fichier_charge=localStorage.getItem( 'fta_dernier_fichier_charge' );
                var trouve='';
                var t='';
                var idFile={};
                for(idFile in donnees.files){
                    t+='<button onclick="chargerFichierRev(\'' + donnees.files[idFile] + '\')" title="' + donnees.files[idFile] + '">' + donnees.files[idFile] + '</button>';
                    if(fta_dernier_fichier_charge && donnees.files[idFile] === fta_dernier_fichier_charge){
                        trouve=fta_dernier_fichier_charge;
                    }
                }
                document.getElementById( 'zoneRevFiles' ).innerHTML=t;
                if(trouve !== ''){
                    chargerFichierRev( fta_dernier_fichier_charge );
                }
            }else{
                console.log( 'donnees=' , donnees );
                alert( 'BAD job !' );
                return;
            }
        } );
}