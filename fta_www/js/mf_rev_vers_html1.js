"use strict";
/*
  =====================================================================================================================
  conversion de rev en html
  point d'entrée = c_rev_vers_html
  =====================================================================================================================
*/
class c_rev_vers_html1{
    #nom_de_la_variable='';
    #tb=[];
    #l02=0;
    /*
      =============================================================================================================
    */
    constructor( nom_de_la_variable ){
        /* console.log('constructor'); */
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    /*
      =============================================================================================================
    */
    #rev_html_le( o ){
        if(o.hasOwnProperty( 'id' )){
            try{
                o.plage=[this.#tb[o.id][5],this.#tb[o.id][6]];
            }catch(e){}
        }
        __m_rev1.empiler_erreur( o );
        return o;
    }
    /*
      =============================================================================================================
    */
    #rev_html1( id , noHead , niveau ){
        var startId=id;
        for( var i=id ; i < this.#l02 ; i++ ){
            if(this.#tb[i][1] === 'html' || this.#tb[i][1] === 'html_dans_php'){
                startId=i;
                if(this.#tb[i][1] == 'html_dans_php'){
                    niveau-=1;
                }
                break;
            }
        }
        var ob=this.#tabToHtml2( startId ,  /* dansHead */ false ,  /* dansBody */ false ,  /* dansJs */ false , noHead ,  /* dansPhp */ false ,  /* dansCss */ false , niveau );
        if(ob.__xst === __xsu){
            if(ob.__xva.substr( 0 , 2 ) === CRLF){
                ob.__xva=ob.__xva.substr( 2 );
            }
        }
        return ob;
    }
    
    
    /* function tabToHtml2 */
    #tabToHtml2( id , dansHead , dansBody , dansJs , noHead , dansPhp , dansCss , niveau ){
        var t='';
        var i=0;
        var j=0;
        var contientEnfantsNonVides=false;
        var contientConstantes=false;
        var ob=null;
        var niveauNouvelleLigne=3;
        var doctype='';
        var temp='';
        if(this.#tb[id][1] == 'head'){
            dansHead=true;
        }
        if(this.#tb[id][1] == 'style'){
            dansCss=true;
        }
        if(this.#tb[id][1] == 'body'){
            dansBody=true;
        }
        if(this.#tb[id][1] == 'script'){
            dansJs=true;
        }
        if(this.#tb[id][1] == 'php'){
            dansPhp=true;
        }
        if(dansPhp && this.#tb[id][1] === 'source'){
            t+='<?php ';
            ob=__m_rev_vers_php1.c_tab_vers_php( objMatSrc.__xva , {"indice_de_debut" : id} );
            /* avrif il n'y a pas de raison de passer par ici */
            console.log( '%cpourquoi passe-t-on par ici ????' , 'background:yellow;color:red;' );
            debugger;
            if(ob.__xst === __xsu){
                t+=ob.__xva;
            }else{
                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"__xva" : t ,"__xme" : 'erreur de script dans un html'} ));
            }
            t+=' ?>';
            return({
                    "__xst" : __xsu ,
                    "__xva" : t ,
                    "dansHead" : dansHead ,
                    "dansBody" : dansBody ,
                    "dansJs" : dansJs ,
                    "dansPhp" : dansPhp ,
                    "dansCss" : dansCss
                });
        }else if(dansJs && this.#tb[id][1] === 'source'){
            ob=__m_rev_vers_js1.c_tab_vers_js( this.#tb , {"indice_de_debut" : id + 1} );
            if(ob.__xst === __xsu){
                t+=CRLF;
                t+='//<![CDATA[' + CRLF;
                t+='// = = = = <source javascript = = = =' + CRLF;
                if(ob.__xva.indexOf( 'use strict' ) >= 0){
                }else{
                    t+='"use strict";' + CRLF;
                }
                t+=ob.__xva;
                t+=CRLF + '// = = = = source javascript> = = = =' + CRLF;
                t+='//]]>' + CRLF;
            }else{
                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"__xva" : t ,"__xme" : 'erreur de script dans un html'} ));
            }
            return({
                    "__xst" : __xsu ,
                    "__xva" : t ,
                    "dansHead" : dansHead ,
                    "dansBody" : dansBody ,
                    "dansJs" : dansJs ,
                    "dansPhp" : dansPhp ,
                    "dansCss" : dansCss
                });
        }else{
            temp='';
            if(id === 0 || this.#tb[id][1] === 'html' || this.#tb[id][1] === 'html_dans_php'){
            }else{
                t+=__m_rev1.resps( niveau );
            }
            if(this.#tb[id][1] === '#' && this.#tb[id][2] === 'f'){
                if(this.#tb[id][13] === ''){
                    temp+='<!-- -->';
                }else{
                    var commentaire=__m_rev1.tr_co_src( this.#tb[id][13] , niveau , id );
                    if(commentaire !== ''){
                        /* si le commentaire html n'est pas vide, on lui ajoute au besoin un espace avant et après */
                        if(commentaire.substr( 0 , 1 ) !== ' '){
                            commentaire=' ' + commentaire;
                        }
                        if(commentaire.substr( commentaire.length - 1 , 1 ) !== ' '){
                            commentaire=commentaire + ' ';
                        }
                    }
                    temp+='<!--' + commentaire;
                }
            }else if(this.#tb[id][1] === 'php' && this.#tb[id][2] === 'f'){
                temp+='';
            }else{
                if(noHead && this.#tb[id][2] === 'f' && (this.#tb[id][1] == 'html' || this.#tb[id][1] == 'html_dans_php')){
                }else{
                    temp+='<' + this.#tb[id][1];
                }
            }
            doctype='';
            for( i=id + 1 ; i < this.#l02 && this.#tb[i][3] > this.#tb[id][3] ; i++ ){
                if(this.#tb[i][7] == id){
                    if(this.#tb[i][2] == 'f' && this.#tb[i][1] == ''){
                        if(this.#tb[i][8] <= 2){
                            if(this.#tb[i][8] == 2 && this.#tb[i + 1][2] == 'c' && this.#tb[i + 2][2] == 'c'){
                                /*
                                  =====================================================
                                  Ecriture de la propriété
                                  =====================================================
                                */
                                temp+=' ' + this.#tb[i + 1][1] + '="' + this.#tb[i + 2][1].replace( /\"/g , '&quot;' ).replace( /\\\'/g , '\'' ).replace( /\\\\/g , '\\' ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ) + '"';
                            }else if(this.#tb[i][8] == 1 && this.#tb[i + 1][2] == 'c'){
                                if(this.#tb[i + 1][1] == 'doctype'){
                                    doctype='<!DOCTYPE html>';
                                }else{
                                    temp+=' ' + this.#tb[i + 1][1] + '';
                                }
                            }else{
                                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : i ,"__xva" : t ,"__xme" : __m_rev1.nl2() +'les propriété d\'un tag html doivent contenir une ou deux constantes'} ));
                            }
                        }else{
                            debugger
                            return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"id" : i ,"__xva" : t ,"__xme" : __m_rev1.nl2() +'les propriété d\'un tag html doivent contenir une ou deux constantes'} ));
                        }
                    }
                    if(this.#tb[i][2] == 'f' && this.#tb[i][1] != ''){
                        contientEnfantsNonVides=true;
                    }
                    if(this.#tb[i][2] == 'c' && this.#tb[i][1] != ''){
                        contientConstantes=true;
                    }
                }
            }
            if((this.#tb[id][1] === 'html' || this.#tb[id][1] === 'html_dans_php') && doctype != ''){
                if(id > 0){
                    t+=doctype + CRLF;
                    t+=temp;
                }
            }else{
                if(id > 0){
                    t+=temp;
                }
            }
            if(contientEnfantsNonVides || contientConstantes){
                if(id > 0){
                    if(noHead && (this.#tb[id][1] == 'html' || this.#tb[id][1] === 'html_dans_php')){
                    }else if(this.#tb[id][1] == 'php'){
                    }else{
                        t+='>';
                    }
                }
                var contenuNiveauPlus1='';
                var ne_contient_que_des_constantes=true;
                for( i=id + 1 ; i < this.#l02 && this.#tb[i][3] > this.#tb[id][3] ; i=this.#tb[i][12] ){
                    if(this.#tb[i][2] == 'f' && this.#tb[i][1] != ''){
                        ne_contient_que_des_constantes=false;
                        if(this.#tb[i][1].toLowerCase() === '@'){
                            t+=this.#tb[i][13];
                        }else if(this.#tb[i][1].toLowerCase() === 'ldplusjsondanshtml'){
                            /*
                              dans ce cas, c'est un tag <script avec des propriétés 
                            */
                            var lesProprietes='';
                            var indiceDebutJs=-1;
                            for( var j=i + 1 ; j < this.#l02 && this.#tb[j][3] > this.#tb[i][3] ; j++ ){
                                if(this.#tb[j][7] === i){
                                    if(this.#tb[j][2] === 'f'){
                                        if(this.#tb[j][1] === ''){
                                            lesProprietes+=' ' + this.#tb[j + 1][1] + '="' + this.#tb[j + 2][1].replace( /\"/g , '&quot;' ).replace( /\\/g , '&#92;' ) + '"';
                                        }else{
                                            if(indiceDebutJs === -1){
                                                indiceDebutJs=j;
                                            }
                                        }
                                    }else{
                                        if(indiceDebutJs === -1){
                                            indiceDebutJs=j;
                                        }
                                    }
                                }
                            }
                            if(indiceDebutJs === -1){
                                /*
                                  c'est une balise <script src=""></script>
                                */
                                t+=CRLF;
                                t+='<script' + lesProprietes + '></script>' + CRLF;
                            }else{
                                /*
                                  c'est un script dans un html
                                */
                                ob=__m_rev_vers_js1.c_tab_vers_js( this.#tb , {"indice_de_debut" : indiceDebutJs - 1} );
                                if(ob.__xst === __xsu){
                                    /*
                                      =============================================
                                      ecriture de la valeur dans le cas d'un tag ldplusjsondanshtml
                                      =============================================
                                    */
                                    t+=CRLF;
                                    t+='<script' + lesProprietes + '>';
                                    var contenu=ob.__xva.substr( ob.__xva.indexOf( '=' ) + 1 );
                                    if(contenu.substr( contenu.length - 1 , 1 ) === ';'){
                                        contenu=contenu.substr( 0 , contenu.length - 1 );
                                    }
                                    t+=contenu + '</script>' + CRLF;
                                }else{
                                    return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur dans un javascript contenu dans un html par la fonction ldplusjsondanshtml 0783'} ));
                                }
                            }
                        }else if(this.#tb[i][1].toLowerCase() === 'javascriptdanshtml'){
                            var obj=this.#insere_javascript_dans_html1(  i , niveau );
                            if(obj.__xst === __xsu){
                                t+=obj.__xva;
                            }else{
                                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur dans un javascript contenu dans un html par la fonction javascriptdanshtml 0943'} ));
                            }
                        }else{
                            /*
                              =============================================================
                              entrée dans le récursif
                              =============================================================
                            */
                            if(this.#tb[i][1] === 'script' || id === 0){
                                /*
                                  dans le cas du script ou de la racine, on le met à la racine
                                */
                                ob=this.#tabToHtml2( i , dansHead , dansBody , dansJs , noHead , dansPhp , dansCss , /*niveau*/0 );
                            }else{
                                ob=this.#tabToHtml2( i , dansHead , dansBody , dansJs , noHead , dansPhp , dansCss , niveau + 1 );
                            }
                            if(ob.__xst === __xsu){
                                /*
                                  =====================================================
                                  ecriture de la valeur dans le cas d'un tag html normal
                                  =====================================================
                                */
                                t+=ob.__xva;
                                dansBody=ob.dansBody;
                                dansHead=ob.dansHead;
                                dansJs=ob.dansJs;
                            }else{
                                return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur dans un html 0659'} ));
                            }
                        }
                    }else{
                        if(this.#tb[i][2] === 'f' && this.#tb[i][1] === ''){
                        }else{
                            if(this.#tb[i][2] === 'c' && this.#tb[this.#tb[i][7]][8] === 1){
                                /* aucune propriété et qu'une constante */
                            }else{
                                if(this.#tb[this.#tb[i][7]][2] === 'f' && (this.#tb[this.#tb[i][7]][1] === 'textarea' || this.#tb[this.#tb[i][7]][1] === 'pre')){
                                    t+='';
                                }else{
                                    /* t+=__m_rev1.resps(niveau + 1); */
                                }
                            }
                            /*
                              =============================================================
                              ecriture de la valeur dans le cas d'une constante
                              =============================================================
                            */
                            var indcss=0;
                            if(dansCss === true){
                                if(t.substr( t.length - 1 , 1 ) === '>'){
                                }else{
                                    for( indcss=t.length - 1 ; indcss >= 0 ; indcss-- ){
                                        if(t.substr( indcss , 1 ) !== ' '){
                                            t=t.substr( 0 , indcss );
                                            break;
                                        }
                                    }
                                }
                                var contenuCss=this.#tb[i][1].replace( /&amp;gt;/g , '&gt;' ).replace( /&amp;lt;/g , '&lt;' ).replace( /&amp;amp;/g , '&amp;' ).replace( /\\\'/g , '\'' ).replace( /\\\\/g , '\\' ).replace( />/g , '&gt;' ).replace( /</g , '&lt;' ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ).replace( /&quot;/g , '"' );
                                /* on supprime les espaces de fin */
                                if(contenuCss !== ''){
                                    for( var indcss=contenuCss.length - 1 ; indcss >= 0 ; indcss-- ){
                                        if(!(contenuCss.substr( indcss , 1 ) === ' '
                                                   || contenuCss.substr( indcss , 1 ) === '\n'
                                                   || contenuCss.substr( indcss , 1 ) === '\r')
                                        ){
                                            contenuCss=contenuCss.substr( 0 , indcss + 1 );
                                            break;
                                        }
                                    }
                                }
                                t+=contenuCss;
                            }else{
                                if(this.#tb[this.#tb[i][7]][2] === 'f' && (this.#tb[this.#tb[i][7]][1] === 'textarea' || this.#tb[this.#tb[i][7]][1] === 'pre')){
                                    t+=this.#tb[i][1].replace( /&amp;gt;/g , '&gt;' ).replace( /&amp;lt;/g , '&lt;' ).replace( /&amp;amp;/g , '&amp;' ).replace( /\\\'/g , '\'' ).replace( /\\\\/g , '\\' ).replace( />/g , '&gt;' ).replace( /</g , '&lt;' ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
                                }else{
                                    t+=this.#tb[i][1].replace( /&amp;gt;/g , '&gt;' ).replace( /&amp;lt;/g , '&lt;' ).replace( /&amp;amp;/g , '&amp;' ).replace( /\\\'/g , '\'' ).replace( /\\\\/g , '\\' ).replace( />/g , '&gt;' ).replace( /</g , '&lt;' );
                                }
                            }
                            contenuNiveauPlus1=this.#tb[i][1];
                        }
                    }
                }
                if(id > 0){
                    if(noHead && (this.#tb[id][1] === 'html' || this.#tb[id][1] === 'html_dans_php')){
                        t+=CRLF;
                    }else{
                        if(this.#tb[id][2] === 'f' && this.#tb[id][8] === 1 && this.#tb[id + 1][2] === 'c'){
                            /* aucune propriété et qu'une constante */
                        }else{
                            if(id === 0 || this.#tb[id][2] === 'f' && (this.#tb[id][1] === 'textarea' || this.#tb[id][1] === 'pre')){
                            }else{
                                if(ne_contient_que_des_constantes === true){
                                }else{
                                    t+=__m_rev1.resps( niveau );
                                }
                            }
                        }
                        if(this.#tb[id][1] === 'php'){
                        }else{
                            t+='</' + this.#tb[id][1] + '>';
                            if((this.#tb[id][1] == 'td'
                                       || this.#tb[id][1] == 'a'
                                       || this.#tb[id][1] == 'span'
                                       || this.#tb[id][1] == 'button'
                                       || this.#tb[id][1] == 'title'
                                       || this.#tb[id][1] == 'h1'
                                       || this.#tb[id][1] == 'h2'
                                       || this.#tb[id][1] == 'h3')
                                   && contenuNiveauPlus1 != ''
                                   && contenuNiveauPlus1.indexOf( '<' ) < 0
                            ){
                                var tag=this.#tb[id][1];
                                const re1=new RegExp( "\<" + tag + "(.*)\>\r\n[ \t]+" , "g" );
                                const rp1='<' + tag + '$1>';
                                t=t.replace( re1 , rp1 );
                                const re2=new RegExp( "\r\n[ \t]+\<\/" + tag + "\>" , "g" );
                                const rp2='</' + tag + '>';
                                t=t.replace( re2 , rp2 );
                            }
                        }
                    }
                }
                if('style' === this.#tb[id][1]){
                    dansCss=false;
                }
                if('script' === this.#tb[id][1]){
                    dansJs=false;
                }
                if('php' === this.#tb[id][1]){
                    dansPhp=false;
                }
            }else{
                if(this.#tb[id][1] === 'script'){
                    t+='>' + '<' + '/script>';
                    dansJs=false;
                }else if(this.#tb[id][1] == 'php'){
                    t+='????PHP????';
                    dansPhp=false;
                }else{
                    if(id > 0){
                        if(this.#tb[id][1] == '#'){
                            if(this.#tb[id][13] === ''){
                                t+=CRLF;
                            }else{
                                t+='-->';
                            }
                        }else if(this.#tb[id][1] == 'br'
                               || this.#tb[id][1] == 'hr'
                               || this.#tb[id][1] == 'meta'
                               || this.#tb[id][1] == 'link'
                               || this.#tb[id][1] == 'input'
                        ){
                            t+=' />';
                        }else{
                            t+='></' + this.#tb[id][1] + '>';
                        }
                    }
                }
            }
            return({"__xst" : __xsu ,"__xva" : t ,"dansHead" : dansHead ,"dansBody" : dansBody ,"dansJs" : dansJs});
        }
    }
    #insere_javascript_dans_html1( ind , niveau ){
        var t='';
        var j=0;
        /*
          dans ce cas, c'est un tag <script avec des propriétés 
        */
        var lesProprietes='';
        var indiceDebutJs=-1;
        for( j=ind + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][2] === 'f'){
                if(this.#tb[j][1] === ''){
                    if((this.#tb[j + 1][1] === 'defer' || this.#tb[j + 1][1] === 'async') && this.#tb[j + 2][1] === '' || this.#tb[j][8] === 1){
                        lesProprietes+=' ' + this.#tb[j + 1][1];
                    }else{
                        try{
                            lesProprietes+=' ' + this.#tb[j + 1][1] + '="' + this.#tb[j + 2][1].replace( /\"/g , '&quot;' ).replace( /\\/g , '&#92;' ) + '"';
                        }catch(e){
                            debugger;
                        }
                    }
                }else{
                    if(indiceDebutJs === -1){
                        indiceDebutJs=j;
                    }
                }
            }else{
                if(indiceDebutJs === -1){
                    indiceDebutJs=j;
                }
            }
        }
        if(indiceDebutJs === -1){
            /*
              c'est une balise <script src=""></script>
            */
            t+=CRLF;
            t+='<script' + lesProprietes + '></script>' + CRLF;
        }else{
            /*
              c'est un script dans un html
            */
            if(this.#tb[indiceDebutJs][8] === 0){
                /* js vide ! */
                t+=CRLF;
                if(lesProprietes===''){
                    lesProprietes=' type="text/javascript"'
                }
                t+='<script' + lesProprietes + '>' + CRLF;
                t+='//<![CDATA[' + CRLF;
                t+='//<source_javascript_rev>' + CRLF;
                t+='/*vide*/' + CRLF;
                t+='//</source_javascript_rev>' + CRLF;
                t+='//]]>' + CRLF;
                t+='</script>' + CRLF;
            }else{
                var ob=__m_rev_vers_js1.c_tab_vers_js( this.#tb , {"indice_de_debut" : indiceDebutJs} );
                if(ob.__xst === __xsu){
                    /*
                      =============================================================================
                      ecriture de la valeur dans le cas d'un tag javascriptdanshtml
                      =============================================================================
                    */
                    t+=CRLF;
                    if(lesProprietes===''){
                        lesProprietes=' type="text/javascript"'
                    }
                    t+='<script' + lesProprietes + '>' + CRLF;
                    t+='//<![CDATA[' + CRLF;
                    t+='//<source_javascript_rev>' + CRLF;
                    t+=ob.__xva + CRLF;
                    t+='//</source_javascript_rev>' + CRLF;
                    t+='//]]>' + CRLF;
                    t+='</script>' + CRLF;
                }else{
                    debugger;
                    return(__m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'javascriptdanshtml'} ));
                }
            }
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    
    
    /*
      =============================================================================================================
      point d'entrée : convertion matrice vers un texte format html
      =============================================================================================================
    */
    c_tab_vers_html( matrice , options_traitement={} ){
        this.#tb=matrice;
        this.#l02=matrice.length;
        var nohead=false;
        var indice_de_debut=0;
        var niveau=0;
        if(options_traitement.hasOwnProperty('nohead')){
            nohead=options_traitement.nohead;
        }
        if(options_traitement.hasOwnProperty('indice_de_debut')){
            indice_de_debut=options_traitement.indice_de_debut;
        }
        if(options_traitement.hasOwnProperty('niveau')){
            niveau=options_traitement.niveau;
        }
        var obj=this.#rev_html1( indice_de_debut , nohead , niveau );
        if(obj.__xst === __xsu){
            if(obj.__xva.length >= 2 && obj.__xva.substr( 0 , 2 ) === '\r\n'){
                obj.__xva=obj.__xva.substr( 2 );
            }
            if(obj.__xva.length >= 1 && obj.__xva.substr( 0 , 1 ) === '\r'){
                obj.__xva=obj.__xva.substr( 1 );
            }
            if(obj.__xva.length >= 1 && obj.__xva.substr( 0 , 1 ) === '\n'){
                obj.__xva=obj.__xva.substr( 1 );
            }
            obj.matriceFonction=this.#tb;
            return obj;
        }else{
            return(this.#rev_html_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur de conversion en html'} ));
        }
        
     
    }
    /*
      =============================================================================================================
      point d'entrée : convertion du texte au format texte rev vers un texte format js
      =============================================================================================================
    */
    c_rev_vers_html( source_rev , options_traitement={} ){
        let t='';
        let obj=null;
        obj=__m_rev1.rev_tm( source_rev );
        if(obj.__xst === __xsu){
            this.#tb=obj.__xva;
            this.#l02=obj.__xva.length;
            var nohead=false;
            if(options_traitement.hasOwnProperty('nohead')){
                nohead=options_traitement.nohead;
            }
            obj=this.#rev_html1( 0 , nohead , 0 );
            if(obj.__xst === __xsu){
                if(obj.__xva.length >= 2 && obj.__xva.substr( 0 , 2 ) === '\r\n'){
                    obj.__xva=obj.__xva.substr( 2 );
                }
                if(obj.__xva.length >= 1 && obj.__xva.substr( 0 , 1 ) === '\r'){
                    obj.__xva=obj.__xva.substr( 1 );
                }
                if(obj.__xva.length >= 1 && obj.__xva.substr( 0 , 1 ) === '\n'){
                    obj.__xva=obj.__xva.substr( 1 );
                }
                obj.matriceFonction=this.#tb;
                return obj;
            }else{
                return(this.#rev_html_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur de conversion en html'} ));
            }
        }else{
            return(this.#rev_html_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur dans un rev'} ));
        }
    }
    
}
export{c_rev_vers_html1 as c_rev_vers_html1};