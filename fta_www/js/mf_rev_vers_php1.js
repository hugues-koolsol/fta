"use strict";
/*
  =====================================================================================================================
  conversion de rev en php
  point d'entrée = c_rev_vers_php , c_tab_vers_php
  =====================================================================================================================
*/
class c_rev_vers_php1{
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
    #rev_php_le( o ){
        if(o.hasOwnProperty( 'id' )){
            try{
                o['plage']=[this.#tb[o.id][5],this.#tb[o.id][6]];
            }catch(e){}
        }
        __m_rev1.empiler_erreur( o );
        return o;
    }
    /*
      =============================================================================================================
    */
    #macst_pour_php( elt ){
        let r=__m_rev1.ma_constante( elt );
        if(elt[4] === 1){
            /* apostrophe */
            r=r.replace( /\\\\d/g , '\\d' ).replace( /\\\\o/g , '\\o' ).replace( /\\\\\./g , '\\.' ).replace( /\\\\\-/g , '\\-' ).replace( /\\\\\//g , '\\/' );
            r=r.replace( /\\\\x/g , '\\x' ).replace( /\\\\A/g , '\\A' ).replace( /\\\\z/g , '\\z' ).replace( /\\\\s/g , '\\s' ).replace( /\\\\\?/g , '\\?' ).replace( /\\\\f/g , '\\f' );
            r=r.replace( /\\\\w/g , '\\w' ).replace( /\\\\{/g , '\\{' ).replace( /\\\\}/g , '\\}' );
        }else if(elt[4] === 3){
            /* guillemet */
            r=r.replace( /\\\\d/g , '\\d' ).replace( /\\\\o/g , '\\o' ).replace( /\\\\\./g , '\\.' ).replace( /\\\\\-/g , '\\-' ).replace( /\\\\\//g , '\\/' );
            r=r.replace( /\\\\x/g , '\\x' ).replace( /\\\\A/g , '\\A' ).replace( /\\\\z/g , '\\z' ).replace( /\\\\s/g , '\\s' ).replace( /\\\\\?/g , '\\?' ).replace( /\\\\f/g , '\\f' );
            r=r.replace( /\\\\w/g , '\\w' );
            r=r.replace( /\\\$/g , '$' ).replace( /\\\\0/g , '\\0' ).replace( /\\\\v/g , '\\v' );
        }else if(elt[4] === 3){
            r=r.replace( /\\\\\$/g , '\\$' );
        }
        return r;
    }
    /*
      =============================================================================================================
      conversion pour les enfants de id de la racine
      l 0 1                         => this.#l02
      p h p _ l o g e r r[          => this.#rev_php_logerreur[
      php_tabToPhp1                 => this.#rev_php1[
      m a _ c s t _ p o u r _ p h p => this.#macst_pour_php[
      t a b                         => this.#tb[
      =============================================================================================================
    */
    #rev_php1( id , niveau , opt ){
        /* term_final : false , retour_ligne : false , separateur : ',' , dans_initialisation : true */
        let t='';
        let obj=null;
        let i=0;
        let j=0;
        if(this.#l02 <= 1){
            return({"__xst" : __xsu ,"__xva" : ''});
        }
        let retour_ligne=true;
        let dans_initialisation=false;
        let terminateur=';';
        let ne_pas_mettre_de_terminateur=false;
        if(opt.hasOwnProperty( 'retour_ligne' ) && opt.retour_ligne === false){
            retour_ligne=false;
        }
        if(opt.hasOwnProperty( 'dans_initialisation' ) && opt.dans_initialisation === true){
            dans_initialisation=true;
        }
        if(opt.hasOwnProperty( 'separateur' )){
            terminateur=opt.separateur;
        }
        const un_espace_p0=__m_rev1.resps( niveau );
        const un_espace_p1=__m_rev1.resps( niveau + 1 );
        for( i=id + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            ne_pas_mettre_de_terminateur=false;
            if(t !== '' && retour_ligne === true){
                t+=un_espace_p0;
            }
            if(this.#tb[i][2] === 'c'){
                if(!(this.#tb[i][1].indexOf( '++' ) >= 0 || this.#tb[i][1].indexOf( '--' ) >= 0)){
                    console.log( '%c pourquoi une constante en ligne' , 'background:yellow;color:red;' );
                }
                t+=this.#macst_pour_php( this.#tb[i] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
            }else if(this.#tb[i][2] === 'f'){
                switch (this.#tb[i][1]){
                    case 'php' :
                        obj=this.#rev_php1( i , niveau , {} );
                        if(obj.__xst === __xsu){
                            if(this.#tb[this.#tb[i][7]][1] === 'php' && this.#tb[this.#tb[i][7]][2] === 'f'){
                                t+=obj.__xva + CRLF;
                            }else{
                                /* si la dernière ou l'avant dernière instruction est un halt, on ne met pas le tag php de fin */
                                if(this.#tb[this.#l02 - 1][1] === "__halt_compiler"
                                           && this.#tb[this.#l02 - 1][2] === 'f'
                                           && this.#tb[this.#l02 - 1][8] === 0
                                       || this.#tb[this.#l02 - 2][1] === "__halt_compiler"
                                           && this.#tb[this.#l02 - 2][2] === 'f'
                                           && this.#tb[this.#l02 - 2][8] === 1
                                           && this.#tb[this.#l02 - 1][2] === 'c'
                                ){
                                    t+='<?' + 'php' + un_espace_p0 + obj.__xva;
                                }else{
                                    /*
                                      si il existe un indice dont le niveau est inférieur à ce php()
                                      alors on ne ferme pas le tag php ... non, on ne ferme pas le tag
                                      t+='<?' + 'php' + obj.__xva + CRLF + '?>';
                                    */
                                    t+='<?' + 'php' + un_espace_p0 + obj.__xva;
                                }
                            }
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'definir' :
                        t+='define(';
                        t+='\'' + this.#tb[i + 1][1] + '\'';
                        t+=' , ';
                        if(this.#tb[i + 2][2] === 'f' && this.#tb[i + 2][1] === 'appelf'){
                            obj=this.#php_traiteAppelFonction( i + 2 , niveau );
                            if(obj.__xst === __xsu){
                                t+=obj.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }else if(this.#tb[i + 2][2] === 'c'){
                            t+=this.#macst_pour_php( this.#tb[i + 2] );
                        }else{
                            var obj1=this.#php_traiteElement( i + 2 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                t+=obj1.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        t+=');';
                        break;
                        
                    case 'break' :
                        if(this.#tb[i][8] === 0){
                            t+='break';
                        }else if(this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                            t+='break ' + this.#tb[i + 1][1];
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'continue' :
                        if(this.#tb[i][8] === 0){
                            t+='continue';
                        }else if(this.#tb[i][8] === 1){
                            t+='continue ' + this.#macst_pour_php( this.#tb[i + 1] );
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'sortir' :
                        if(this.#tb[i][8] === 0){
                            t+='exit';
                        }else if(this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                            t+='exit(' + __m_rev1.ma_constante( this.#tb[i + 1] ) + ')';
                        }else{
                            var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                t+='exit(' + obj1.__xva + ')';
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        break;
                        
                    case 'mourir' :
                        if(this.#tb[i][8] === 0){
                            t+='die';
                        }else if(this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                            t+='die(' + __m_rev1.ma_constante( this.#tb[i + 1] ) + ')';
                        }else{
                            var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                t+='die(' + obj1.__xva + ')';
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        break;
                        
                    case 'revenir' :
                        if(this.#tb[i][8] === 0){
                            t+='return';
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' pas d\'argument'} ));
                        }
                        break;
                        
                    case 'retourner' :
                        if(this.#tb[i][8] === 0){
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }else if(this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                            t+='return ' + this.#macst_pour_php( this.#tb[i + 1] );
                        }else{
                            var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                if(obj1.__xva.length > 120){
                                    var obj1=this.#php_traiteElement( i + 1 , niveau , {"retour_de_ligne" : true} );
                                    if(obj1.__xst === __xsu){
                                        t+='return ' + obj1.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }else{
                                    t+='return ' + obj1.__xva;
                                }
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        break;
                        
                    case 'fonction' :
                        var positionDeclarationFonction=-1;
                        var positionContenu=-1;
                        var type_retour='';
                        var nomFonction='';
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'definition' && this.#tb[j][2] === 'f'){
                                positionDeclarationFonction=j;
                            }
                            if(this.#tb[j][1] === 'contenu' && this.#tb[j][2] === 'f'){
                                positionContenu=j;
                            }
                        }
                        if(positionDeclarationFonction >= 0 && positionContenu >= 0){
                            for( j=positionDeclarationFonction + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                                if(this.#tb[j][1] === 'nom'){
                                    if(this.#tb[j][8] === 1){
                                        nomFonction=this.#tb[j + 1][1];
                                    }else{
                                        return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]});
                                    }
                                }else if(this.#tb[j][1] === 'type_retour'){
                                    type_retour=':' + this.#tb[j + 1][1].replace( /\\\\/g , '\\' );
                                }
                            }
                            var argumentsFonction='';
                            for( j=positionDeclarationFonction + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                                if((this.#tb[j][1] === 'argument' || this.#tb[j][1] === 'adresseArgument') && this.#tb[j][2] === 'f'){
                                    var nom_argument='';
                                    var type_argument='';
                                    var valeur_argument='';
                                    var comm='';
                                    for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                        if(this.#tb[k][2] === 'c'){
                                            nom_argument=this.#tb[k][1];
                                            if(this.#tb[j][1] === 'adresseArgument'){
                                                nom_argument='&' + nom_argument;
                                            }
                                        }else if(this.#tb[k][2] === 'f'){
                                            if(this.#tb[k][1] === 'valeur_defaut'){
                                                var obj1=this.#php_traiteElement( k + 1 , niveau , {} );
                                                if(obj1.__xst === __xsu){
                                                    valeur_argument='=' + obj1.__xva;
                                                }else{
                                                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                                }
                                            }else if(this.#tb[k][1] === 'type_argument' && this.#tb[k][8] === 1 && this.#tb[k + 1][2] === 'c'){
                                                type_argument=this.#tb[k + 1][1].replace( /\\\\/g , '\\' ) + ' ';
                                            }else if(this.#tb[k][1] === '#'){
                                                comm='/*' + __m_rev1.tr_co_src( this.#tb[k][13] , niveau , k ) + '*/';
                                            }else{
                                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                            }
                                        }
                                    }
                                    argumentsFonction+=',' + comm + type_argument + nom_argument + valeur_argument;
                                }
                            }
                            if(nomFonction != ''){
                                t+='function ' + nomFonction + '(' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr( 1 ) )) + ')' + type_retour + '{';
                                t+=CRLF;
                                if(this.#tb[positionContenu][8] === 0){
                                    /* c'est une fonction vide */
                                    t+='}';
                                }else{
                                    obj=this.#rev_php1( positionContenu , niveau + 1 , {} );
                                    /* dansFonction,false, */
                                    if(obj.__xst === __xsu){
                                        t+=un_espace_p1;
                                        t+=obj.__xva;
                                        t+=CRLF;
                                        t+=un_espace_p0;
                                        t+='}';
                                    }else{
                                        return({"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' problème sur le contenu de la fonction "' + nomFonction + '"'});
                                    }
                                }
                            }
                        }else{
                            return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]});
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'caststring' :
                        var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                        if(obj1.__xst === __xsu){
                            t+='(string)' + obj1.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'castfloat' :
                        var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                        if(obj1.__xst === __xsu){
                            t+='(float)' + obj1.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'castint' :
                        var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                        if(obj1.__xst === __xsu){
                            t+='(int)' + obj1.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'appelf' :
                        obj=this.#php_traiteAppelFonction( i , niveau );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'faire_tant_que' :
                        tabchoix=[];
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'condition'){
                                tabchoix.push( [j,this.#tb[j][1],i,[]] );
                            }else if(this.#tb[j][1] === 'faire'){
                                tabchoix.push( [j,this.#tb[j][1],i,[]] );
                            }else if(this.#tb[j][1] === '#'){
                                if(tabchoix.length === 0){
                                    tabchoix.push( [j,this.#tb[j][1],i,[]] );
                                }else{
                                    tabchoix[tabchoix.length - 1][3].push( [j,this.#tb[j][1],i,[]] );
                                }
                            }else{
                                return(this.#rev_php_le( {
                                        "__xst" : __xer ,
                                        "id" : id ,
                                        "__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + '<br />syntaxe : boucle(condition(),initialisation(),incrément(),faire())'
                                    } ));
                            }
                        }
                        var condition='';
                        var faire='';
                        for( j=0 ; j < tabchoix.length ; j++ ){
                            if(tabchoix[j][1] === '#'){
                            }else if(tabchoix[j][1] === 'condition'){
                                if(this.#tb[tabchoix[j][0]][8] > 0){
                                    obj=this.#php_traiteOperation( tabchoix[j][0] , niveau , false );
                                    if(obj.__xst === __xsu){
                                        if(obj.__xva.length > 120){
                                            obj=this.#php_traiteOperation( tabchoix[j][0] , niveau , true );
                                            if(obj.__xst === __xsu){
                                                condition+=un_espace_p0 + '      ';
                                                condition+=obj.__xva;
                                            }else{
                                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                            }
                                        }else{
                                            condition+=obj.__xva;
                                        }
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition '} ));
                                    }
                                }
                            }else if(tabchoix[j][1] === 'faire'){
                                if(this.#tb[tabchoix[j][0]][8] > 0){
                                    obj=this.#rev_php1( tabchoix[j][0] , niveau + 1 , {} );
                                    /* dansFonction,false, */
                                    if(obj.__xst === __xsu){
                                        faire+=un_espace_p1;
                                        faire+=obj.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' faire'} ));
                                    }
                                }
                            }
                        }
                        t+='do{';
                        t+=faire;
                        t+=un_espace_p0;
                        t+='}while(' + condition + ')';
                        break;
                        
                    case 'boucle' :
                        tabchoix=[];
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'condition'){
                                tabchoix.push( [j,this.#tb[j][1],i,[]] );
                            }else if(this.#tb[j][1] === 'initialisation'){
                                tabchoix.push( [j,this.#tb[j][1],i,[]] );
                            }else if(this.#tb[j][1] === 'increment'){
                                tabchoix.push( [j,this.#tb[j][1],i,[]] );
                            }else if(this.#tb[j][1] === 'faire'){
                                tabchoix.push( [j,this.#tb[j][1],i,[]] );
                            }else if(this.#tb[j][1] === '#'){
                                if(tabchoix.length === 0){
                                    tabchoix.push( [j,this.#tb[j][1],i,[]] );
                                }else{
                                    tabchoix[tabchoix.length - 1][3].push( [j,this.#tb[j][1],i,[]] );
                                }
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        var initialisation='';
                        var condition='';
                        var increment='';
                        var faire='';
                        for( j=0 ; j < tabchoix.length ; j++ ){
                            if(tabchoix[j][1] === '#'){
                            }else if(tabchoix[j][1] === 'initialisation'){
                                if(this.#tb[tabchoix[j][0]][8] > 0){
                                    for( k=tabchoix[j][0] + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                        var obj1=this.#php_traiteElement( k , niveau , {} );
                                        if(obj1.__xst === __xsu){
                                            if(initialisation !== ''){
                                                initialisation+='  ,  ';
                                            }
                                            initialisation+=obj1.__xva;
                                        }else{
                                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                        }
                                    }
                                }
                            }else if(tabchoix[j][1] === 'condition'){
                                if(this.#tb[tabchoix[j][0]][8] > 0){
                                    obj=this.#php_traiteOperation( tabchoix[j][0] , niveau , false );
                                    if(obj.__xst === __xsu){
                                        condition+=obj.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition'} ));
                                    }
                                    condition=condition.replace( /\n/g , '' ).replace( /\r/g , '' );
                                }
                            }else if(tabchoix[j][1] === 'increment'){
                                if(this.#tb[tabchoix[j][0]][8] > 0){
                                    obj=this.#rev_php1( tabchoix[j][0] , niveau , {"term_final" : false ,"retour_ligne" : false ,"separateur" : ',' ,"dans_initialisation" : true} );
                                    /* dansFonction,false, */
                                    if(obj.__xst === __xsu){
                                        if(obj.__xva.substr( obj.__xva.length - 1 , 1 ) === ';'){
                                            increment+=obj.__xva.substr( 0 , obj.__xva.length - 1 );
                                        }else{
                                            increment+=obj.__xva;
                                        }
                                        increment=increment.replace( /\n/g , '' ).replace( /\r/g , '' ).trim();
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' incrément'} ));
                                    }
                                }
                            }else if(tabchoix[j][1] === 'faire'){
                                if(this.#tb[tabchoix[j][0]][8] > 0){
                                    obj=this.#rev_php1( tabchoix[j][0] , niveau + 1 , {} );
                                    /* ,dansFonction,false */
                                    if(obj.__xst === __xsu){
                                        faire+=un_espace_p1;
                                        faire+=un_espace_p1;
                                        faire+=obj.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' faire '} ));
                                    }
                                }
                            }
                        }
                        t+='for( ' + initialisation + ' ; ' + condition + ' ; ' + increment + ' ){';
                        t+=faire;
                        t+=un_espace_p0;
                        t+='}';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'essayer' :
                        var contenu='';
                        var sierreur=[];
                        var nomErreur='';
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'faire' && this.#tb[j][2] === 'f'){
                                obj=this.#rev_php1( j , niveau + 1 , {} );
                                /* dansFonction,false, */
                                if(obj.__xst === __xsu){
                                    contenu+=un_espace_p1;
                                    contenu+=obj.__xva;
                                }else{
                                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                }
                            }else if(this.#tb[j][1] === 'sierreur' && this.#tb[j][2] === 'f'){
                                sierreur.push( {"nom_erreur" : '' ,"contenu" : ''} );
                                if(this.#tb[j][8] === 2){
                                    for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                        if(this.#tb[k][1] === 'faire' && this.#tb[k][2] === 'f'){
                                            obj=this.#rev_php1( k , niveau + 1 , {} );
                                            /* ,dansFonction,false */
                                            if(obj.__xst === __xsu){
                                                sierreur[sierreur.length - 1].contenu=un_espace_p1;
                                                sierreur[sierreur.length - 1].contenu+=obj.__xva;
                                            }else{
                                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                            }
                                        }else if(this.#tb[k][1] === 'err'
                                               && this.#tb[k][2] === 'f'
                                               && this.#tb[k][8] === 2
                                               && this.#tb[k + 1][2] === 'c'
                                               && this.#tb[k + 2][2] === 'c'
                                        ){
                                            var nomErreur=this.#tb[k + 1][1] + ' ' + this.#tb[k + 2][1];
                                            sierreur[sierreur.length - 1].nom_erreur=nomErreur.replace( /\\\\/g , '\\' );
                                        }else{
                                            debugger;
                                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                        }
                                    }
                                }else{
                                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' 2 arguments sierreur(err(Error $e),faire())'} ));
                                }
                            }
                        }
                        t+='try{';
                        t+=contenu;
                        t+=un_espace_p0;
                        for( j=0 ; j < sierreur.length ; j++ ){
                            if(j > 0){
                                t+='catch(' + sierreur[j].nom_erreur + '){';
                            }else{
                                t+='}catch(' + sierreur[j].nom_erreur + '){';
                            }
                            t+=sierreur[j].contenu;
                            t+=un_espace_p0;
                            t+='}';
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'tantQue' :
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'condition'){
                                obj=this.#php_traiteOperation( j , niveau , false );
                                if(obj.__xva.length > 120){
                                    obj=this.#php_traiteOperation( j , niveau , true );
                                    if(obj.__xst === __xsu){
                                        t+='while(' + un_espace_p0 + '  ' + obj.__xva + un_espace_p0 + '){';
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition '} ));
                                    }
                                }else{
                                    t+='while(' + obj.__xva + '){';
                                }
                            }else if(this.#tb[j][1] === 'faire'){
                                if(this.#tb[j][8] === 0){
                                    t+='}';
                                }else{
                                    obj=this.#rev_php1( j , niveau + 1 , {} );
                                    /* ,dansFonction,false */
                                    if(obj.__xst === __xsu){
                                        t+=un_espace_p1;
                                        t+=obj.__xva;
                                        t+=un_espace_p0;
                                        t+='}';
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : j ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' faire '} ));
                                    }
                                }
                            }else if(this.#tb[j][1] === '#'){
                                t+=un_espace_p0;
                                t+='/*' + __m_rev1.tr_co_src( this.#tb[j][13] , niveau , j ) + '*/';
                            }
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'choix' :
                        var tabchoix=[];
                        var aDesSinonSi=false;
                        var aUnSinon=false;
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'si'){
                                tabchoix.push( [j,this.#tb[j][1],0,[],0] );
                                /* position type position du contenu du alors */
                                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    /* chercher la position du alors dans le si */
                                    if(this.#tb[k][1] === 'alors'){
                                        tabchoix[tabchoix.length - 1][2]=k;
                                        /* ✍ nombre d'enfants du alors */
                                        tabchoix[tabchoix.length - 1][4]=this.#tb[k][8];
                                        break;
                                    }
                                }
                            }else if(this.#tb[j][1] === 'sinonsi'){
                                aDesSinonSi=true;
                                tabchoix.push( [j,this.#tb[j][1],0,[],0] );
                                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    /* chercher la position du alors dans le sinonsi */
                                    if(this.#tb[k][1] === 'alors'){
                                        tabchoix[tabchoix.length - 1][2]=k;
                                        tabchoix[tabchoix.length - 1][4]=this.#tb[k][8];
                                        /* nombre d'enfants du alors */
                                        break;
                                    }
                                }
                            }else if(this.#tb[j][1] === 'sinon'){
                                aUnSinon=true;
                                tabchoix.push( [j,this.#tb[j][1],0,[],0] );
                                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    /* ✍ chercher la position du alors dans le sinon */
                                    if(this.#tb[k][1] === 'alors'){
                                        tabchoix[tabchoix.length - 1][2]=k;
                                        tabchoix[tabchoix.length - 1][4]=this.#tb[k][8];
                                        /* ✍ nombre d'enfants du alors */
                                        break;
                                    }
                                }
                            }else if(this.#tb[j][1] === '#'){
                                if(tabchoix.length === 0){
                                    tabchoix.push( [j,this.#tb[j][1],0,[]] );
                                }else{
                                    tabchoix[tabchoix.length - 1][3].push( [j,this.#tb[j][1],0,[],0] );
                                }
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        var tabTemp=[];
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if((this.#tb[j][1] === 'si'
                                       || this.#tb[j][1] === 'condition'
                                       || this.#tb[j][1] === 'alors'
                                       || this.#tb[j][1] === 'sinonsi'
                                       || this.#tb[j][1] === 'sinon'
                                       || this.#tb[j][1] === '#')
                                   && this.#tb[j][2] === 'f'
                            ){
                                tabTemp.push( this.#tb[j] );
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' "' + this.#tb[j][1] + '" inconnu dans un choix '} ));
                            }
                        }
                        for( j=0 ; j < tabchoix.length ; j++ ){
                            if(tabchoix[j][1] === '#'){
                                t+=un_espace_p0;
                                t+='/*' + __m_rev1.tr_co_src( this.#tb[tabchoix[j][0]][13] , niveau , tabchoix[j][0] ) + '*/';
                            }else if(tabchoix[j][1] === 'si'){
                                t+=un_espace_p0;
                                t+='if(';
                                var debutCondition=0;
                                for( var k=tabchoix[j][0] + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'condition'){
                                        debutCondition=k;
                                        break;
                                    }
                                }
                                obj=this.#php_traiteOperation( debutCondition , niveau , false );
                                if(obj.__xst === __xsu){
                                    if(obj.__xva.length > 120){
                                        obj=this.#php_traiteOperation( debutCondition , niveau , true );
                                        if(obj.__xst === __xsu){
                                            t+=obj.__xva;
                                            t+=un_espace_p0;
                                        }else{
                                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition du choix '} ));
                                        }
                                    }else{
                                        t+=obj.__xva;
                                    }
                                }else{
                                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition du choix'} ));
                                }
                                t+='){';
                                t+=CRLF;
                                if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                    /* ✍ si on a trouve un "alors" et qu'il contient des enfants */
                                    obj=this.#rev_php1( tabchoix[j][2] , niveau + 1 , {} );
                                    /* ,dansFonction,false */
                                    if(obj.__xst === __xsu){
                                        t+=un_espace_p1;
                                        t+=obj.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' alors '} ));
                                    }
                                }
                                if(aDesSinonSi){
                                }else{
                                    if(aUnSinon){
                                    }else{
                                        t+=CRLF;
                                        t+=un_espace_p0;
                                        t+='}';
                                        t+=CRLF;
                                    }
                                }
                            }else if(tabchoix[j][1] === 'sinonsi'){
                                t+=CRLF;
                                t+=un_espace_p0;
                                t+='}else if(';
                                var debutCondition=0;
                                for( var k=tabchoix[j][0] + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'condition'){
                                        debutCondition=k;
                                        break;
                                    }
                                }
                                obj=this.#php_traiteOperation( debutCondition , niveau , false );
                                if(obj.__xst === __xsu){
                                    if(obj.__xva.length > 120){
                                        obj=this.#php_traiteOperation( debutCondition , niveau , true );
                                        if(obj.__xst === __xsu){
                                            t+=obj.__xva;
                                            t+=un_espace_p0;
                                        }else{
                                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition '} ));
                                        }
                                    }else{
                                        t+=obj.__xva;
                                    }
                                }else{
                                    /* ✍      console.log(this.#tb[tabchoix[j][0]],tab); */
                                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition '} ));
                                }
                                t+='){';
                                t+=CRLF;
                                if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                    /* ✍ si on a trouve un "alors" et qu'il contient des enfants */
                                    /* avrif */
                                    obj=this.#rev_php1( tabchoix[j][2] , niveau + 1 , {} );
                                    /* ,dansFonction,false */
                                    if(obj.__xst === __xsu){
                                        t+=un_espace_p1;
                                        t+=obj.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' alors'} ));
                                    }
                                }
                                if(aUnSinon){
                                }else{
                                    if(j === tabchoix.length - 1){
                                        /* ✍ si c'est le dernier sinonsi */
                                        t+=un_espace_p0;
                                        t+='}';
                                        t+=CRLF;
                                    }
                                }
                            }else{
                                t+=CRLF;
                                t+=un_espace_p0;
                                t+='}else{';
                                t+=CRLF;
                                if(tabchoix[j][2] > 0 && tabchoix[j][4] > 0){
                                    /* ✍ si on a trouve un "alors" et qu'il contient des enfants */
                                    obj=this.#rev_php1( tabchoix[j][2] , niveau + 1 , {} );
                                    /* ,dansFonction,false */
                                    if(obj.__xst === __xsu){
                                        t+=un_espace_p1;
                                        t+=obj.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : tabchoix[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' alors '} ));
                                    }
                                }
                                t+=un_espace_p0;
                                t+='}';
                                t+=CRLF;
                            }
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'affecteFonction' :
                        debugger;
                        /* afr est-ce utilisé ? */
                        if(this.#tb[i + 1][2] === 'c' && this.#tb[i][8] >= 2){
                        }else{
                            return(this.#rev_php_le( {
                                    "__xst" : __xer ,
                                    "id" : id ,
                                    "__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' il faut au moins deux parametres affecteFonction(xxx,[p(yyy),]contenu())'
                                } ));
                        }
                        var tabTemp=[];
                        var listeParametres;
                        var positionContenu=-1;
                        argumentsFonction='';
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            /* ✍ 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE */
                            if(this.#tb[j][1] === 'contenu' && this.#tb[j][2] === 'f'){
                                positionContenu=j;
                            }else{
                                if(this.#tb[j][1] === 'p'){
                                    if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                                        argumentsFonction+=',' + this.#tb[j + 1][1];
                                    }else{
                                        return(this.#rev_php_le( {
                                                "__xst" : __xer ,
                                                "id" : i ,
                                                "__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' les parametres doivent être des variables affecteFonction(xxx,[p(yyy),]contenu()) '
                                            } ));
                                    }
                                }
                            }
                        }
                        if(positionContenu > 0){
                            obj=this.#rev_php1( positionContenu , niveau , {} );
                            /* ,dansFonction,false */
                            if(obj.__xst === __xsu){
                                /* avrif */
                                debugger;
                                t+='' + this.#tb[i + 1][1] + '=function(' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr( 1 ) )) + '){';
                                t+=obj.__xva;
                                t+='}';
                            }else{
                                debugger;
                            }
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' il faut un contenu() : affecteFonction(xxx,[p(yyy),]contenu())'} ));
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'affecte_reference' : 
                    case 'affecte' :
                        obj=this.#php_traiteAffecte( i , niveau , {} );
                        /* ,dansInitialisation */
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'affecteop' :
                        obj=this.#php_traiteAffectOp( i , dans_initialisation , niveau );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'static' : 
                    case 'declare' :
                        if(this.#tb[i][8] === 2 && this.#tb[i + 1][2] === 'c' && this.#tb[i + 2][2] === 'c'){
                            if(this.#tb[i][1] === 'static'){
                                t+='static ';
                            }
                            t+=this.#macst_pour_php( this.#tb[i + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ) + ' = ' + this.#macst_pour_php( this.#tb[i + 2] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
                        }else if(this.#tb[i][8] === 2 && this.#tb[i + 1][2] === 'c' && this.#tb[i + 2][2] === 'f'){
                            if(this.#tb[i][1] === 'static'){
                                t+='static ';
                            }
                            var obj1=this.#php_traiteElement( i + 2 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                t+=this.#macst_pour_php( this.#tb[i + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ) + ' = ' + obj1.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'html_dans_php' :
                        var tag_de_fin='<?' + 'php';
                        /* si c'est la dernière instruction alors on ne met pas de tag de fin */
                        if(this.#tb[i][8] === 0){
                            if(i === this.#l02 - 1){
                                t+='';
                            }else{
                                var trouve=false;
                                for( j=i + 1 ; j < this.#l02 ; j++ ){
                                    if(this.#tb[j][3] <= this.#tb[i][3]){
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
                            for( j=i + 1 ; j < this.#l02 ; j++ ){
                                if(this.#tb[j][3] <= this.#tb[i][3]){
                                    /* trouve */
                                    trouve=true;
                                    break;
                                }
                            }
                            if(trouve === false && this.#tb[i][3] <= 1){
                                /* si on est à la racine php */
                                tag_de_fin='';
                            }else{
                                tag_de_fin=CRLF + '<?' + 'php';
                            }
                            obj=__m_rev_vers_html1.c_tab_vers_html( this.#tb , {"indice_de_debut" : i , "nohead" : true , "niveau" : niveau} );
                            if(obj.__xst === __xsu){
                                if(obj.__xva.substr( obj.__xva.length - 2 , 2 ) === '\r\n'){
                                    obj.__xva=obj.__xva.substr( 0 , obj.__xva.length - 2 );
                                }else if(obj.__xva.substr( obj.__xva.length - 1 , 1 ) === '\r' || obj.__xva.substr( obj.__xva.length - 1 , 1 ) === '\n'){
                                    obj.__xva=obj.__xva.substr( 0 , obj.__xva.length - 1 );
                                }
                                t+='?>' + CRLF + obj.__xva + tag_de_fin;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        ne_pas_mettre_de_terminateur=true;
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
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'quand' && this.#tb[j][2] === 'f'){
                                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                                    valeurQuand=this.#macst_pour_php( this.#tb[j + 1] );
                                }else{
                                    obj=this.#php_traiteElement( j + 1 , niveau , {} );
                                    if(obj.__xst === __xsu){
                                        valeurQuand=obj.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }else if(this.#tb[j][1] === 'est'){
                                var valeurCas='';
                                var InstructionsCas='';
                                for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'valeurNonPrevue' && this.#tb[k][2] === 'f' && this.#tb[k][8] === 0){
                                        valeurCas=null;
                                    }else if(this.#tb[k][1] === 'valeur' && this.#tb[k][2] === 'f'){
                                        if(this.#tb[k + 1][2] === 'f'){
                                            obj=this.#php_traiteElement( k + 1 , niveau , {} );
                                            if(obj.__xst === __xsu){
                                                valeurCas=obj.__xva;
                                            }else{
                                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                            }
                                        }else{
                                            valeurCas=this.#macst_pour_php( this.#tb[k + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
                                        }
                                    }else if(this.#tb[k][1] === 'faire' && this.#tb[k][2] === 'f'){
                                        if(this.#tb[k][8] >= 1){
                                            obj=this.#rev_php1( k , niveau + 2 , {} );
                                            /* false,false, */
                                            if(obj.__xst === __xsu){
                                                InstructionsCas+=un_espace_p1;
                                                InstructionsCas+=obj.__xva;
                                            }else{
                                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : j ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' faire  '} ));
                                            }
                                        }else{
                                            InstructionsCas='';
                                        }
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : j ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' il ne doit y avoir que "valeur" et "faire" '} ));
                                    }
                                }
                                valeursCase+=__m_rev1.resps( niveau + 1 );
                                if(valeurCas === null){
                                    valeursCase+='default:';
                                }else{
                                    valeursCase+='case ' + valeurCas + ':';
                                }
                                valeursCase+=InstructionsCas;
                                valeursCase+=__m_rev1.resps( niveau + 2 );
                                le_cas=__m_rev1.resps( niveau + 1 );
                                if(valeurCas === null){
                                    le_cas+='default:';
                                }else{
                                    le_cas+='case ' + valeurCas + ':';
                                }
                                le_cas+=InstructionsCas;
                                le_cas+=__m_rev1.resps( niveau + 2 );
                                tableau_des_cas[tableau_des_cas.length - 1]={"le_cas" : le_cas ,"les_commentaires" : les_commentaires_avant};
                                tableau_des_cas.push( {"le_cas" : '' ,"les_commentaires" : []} );
                                les_commentaires_avant=[];
                            }else if(this.#tb[j][1] === '#'){
                                les_commentaires_avant.push( this.#tb[j] );
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' il ne doit y avoir que "quand" et "est" '} ));
                            }
                        }
                        t+='switch (' + valeurQuand + '){';
                        for( j=0 ; j < tableau_des_cas.length ; j++ ){
                            if(tableau_des_cas[j].le_cas !== ''){
                                for( var k=0 ; k < tableau_des_cas[j].les_commentaires.length ; k++ ){
                                    t+=__m_rev1.resps( niveau + 2 ) + '/*' + __m_rev1.tr_co_src( tableau_des_cas[j].les_commentaires[k][13] , niveau + 2 , i ) + '*/';
                                }
                                t+=tableau_des_cas[j].le_cas;
                            }
                        }
                        /* ✍                    t+=valeursCase; */
                        t+=un_espace_p0;
                        t+='}';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'boucleSurTableau' :
                        /* ✍ for( $nom as $k1 => $v1) */
                        var cleEtOuValeur='';
                        var Instructions='';
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'pourChaque' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 1){
                                for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'dans' && this.#tb[k][2] === 'f'){
                                        for( var l=k + 1 ; l < this.#l02 ; l=this.#tb[l][12] ){
                                            var obj1=this.#php_traiteElement( l , niveau , {} );
                                            if(obj1.__xst === __xsu){
                                                if(this.#tb[k][8] === 3){
                                                    if(this.#tb[l][9] === 1){
                                                        cleEtOuValeur+=obj1.__xva;
                                                    }else if(this.#tb[l][9] === 2){
                                                        cleEtOuValeur+=' => ' + obj1.__xva;
                                                    }else if(this.#tb[l][9] === 3){
                                                        cleEtOuValeur=obj1.__xva + ' as ' + cleEtOuValeur;
                                                    }
                                                }else if(this.#tb[k][8] === 2){
                                                    if(this.#tb[l][9] === 1){
                                                        cleEtOuValeur+=obj1.__xva;
                                                    }else if(this.#tb[l][9] === 2){
                                                        cleEtOuValeur=obj1.__xva + ' as ' + cleEtOuValeur;
                                                    }
                                                }else{
                                                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : k ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                                }
                                            }else{
                                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : k ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                            }
                                        }
                                    }
                                }
                            }else if(this.#tb[j][1] === 'faire' && this.#tb[j][2] === 'f'){
                                if(this.#tb[j][8] >= 1){
                                    obj=this.#rev_php1( j , niveau + 1 , {} );
                                    /* false,false, */
                                    if(obj.__xst === __xsu){
                                        Instructions+=un_espace_p1;
                                        Instructions+=obj.__xva;
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }else{
                                    Instructions='';
                                }
                            }
                        }
                        t+='foreach(' + cleEtOuValeur + '){';
                        t+=Instructions;
                        t+=un_espace_p0;
                        t+='}';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case '__halt_compiler' :
                        if(this.#tb[i][8] === 0){
                            t+='__halt_compiler()';
                        }else{
                            /* remaining */
                            if(this.#tb[i + 1][4] === 1){
                                /* constante quotée avec ' */
                                var a=this.#macst_pour_php( this.#tb[i + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ).replace( /\\\'/g , '\'' ).replace( /\\\\/g , '\\' );
                                a=a.substr( 1 );
                                a=a.substr( 0 , a.length - 1 );
                                t+='__halt_compiler();' + a;
                            }else if(this.#tb[i + 1][4] === 3){
                                var a=this.#macst_pour_php( this.#tb[i + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ).replace( /\\"/g , '"' ).replace( /\\\\/g , '\\' );
                                a=a.substr( 1 );
                                a=a.substr( 0 , a.length - 1 );
                                t+='__halt_compiler();' + a;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'globale' :
                        var les_globales='';
                        t+='global ';
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][2] === 'c'){
                                les_globales+=',' + __m_rev1.ma_constante( this.#tb[j] );
                            }else if(this.#tb[j][2] === 'f' && this.#tb[j][1] === '#'){
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        if(les_globales !== ''){
                            les_globales=les_globales.substr( 1 );
                            t+=les_globales;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case '#' :
                        t+='/*' + __m_rev1.tr_co_src( this.#tb[i][13] , niveau , i ) + '*/';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'interface' : 
                    case 'definition_de_classe' : 
                    case 'méthode' :
                        obj=this.#php_traiteElement( i , niveau , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'sql_inclure_reference' :
                        if(this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                            t+='sql_inclure_reference(' + this.#tb[i + 1][1] + ');';
                            t+=un_espace_p0;
                            t+='/*sql_inclure_deb*/';
                            t+=un_espace_p0;
                            t+='require_once(INCLUDE_PATH.\'/sql/sql_' + this.#tb[i + 1][1] + '.php\');';
                            if( typeof __aa_js_sql !== 'undefined' && __aa_js_sql[this.#tb[i + 1][1]]){
                                t+=un_espace_p0;
                                var contenu='/*' + un_espace_p0 + __aa_js_sql[this.#tb[i + 1][1]].replace( /\/\*/g , '/ *' ).replace( /\*\//g , '* /' ).replace( /\r/g , '' ).replace( /\n/g , un_espace_p0 );
                                contenu=contenu.replace( /\n\n/g , '\n' );
                                contenu=contenu.replace( / AND /g , un_espace_p0 + ' AND ' );
                                contenu=contenu.replace( / ORDER BY / , un_espace_p0 + ' ORDER BY ' );
                                contenu=contenu.replace( / LIMIT / , un_espace_p0 + ' LIMIT ' );
                                t+=(contenu + CRLF + un_espace_p0) + '*/';
                            }else{
                                t+=un_espace_p0;
                                t+='/* === ATTENTION === ' + CRLF + 'Le fichier des requêtes sql js est à regénérer et/ou à intégrer ' + CRLF + '*/';
                            }
                            t+=un_espace_p0;
                            t+='/*sql_inclure_fin*/';
                            ne_pas_mettre_de_terminateur=true;
                            t+=un_espace_p0;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    default:
                        obj=this.#php_traiteElement( i , niveau , opt );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' cas non prévu'} ));
                        }
                        
                }
            }
            if(ne_pas_mettre_de_terminateur === false){
                t+=terminateur;
            }
        }
        if(opt.hasOwnProperty( 'term_final' ) && opt.term_final === false){
            t=t.substr( 0 , t.length - 1 );
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traiteElement( ind , niveau , options={} ){
        var t='';
        var obj={};
        var i=0;
        var j=0;
        if(this.#tb[ind][2] === 'c'){
            t=this.#macst_pour_php( this.#tb[ind] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
            return({"__xst" : __xsu ,"__xva" : t});
        }
        switch (this.#tb[ind][1]){
            case 'nouveau' :
                obj=this.#php_traiteNew( ind , niveau );
                if(obj.__xst === __xsu){
                    t=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'definition_de_classe' :
                obj=this.#php_traiteAppelDefinition_de_classe( ind , false , niveau );
                if(obj.__xst === __xsu){
                    t=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'casttableau' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+='(array)' + obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'constante' :
                var declaration='';
                var nom_variable='';
                var type_constante='';
                var valeur='';
                for( i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
                    if(this.#tb[i][2] === 'c'){
                        nom_variable=this.#tb[i][1];
                    }else if(this.#tb[i][2] === 'f'){
                        if(this.#tb[i][1] === 'nomc'){
                            var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                nom_variable=obj1.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                            }
                        }else if(this.#tb[i][1] === 'publique'){
                            type_constante='public ';
                        }else if(this.#tb[i][1] === 'privée'){
                            type_constante='private ';
                        }else if(this.#tb[i][1] === 'protégée'){
                            type_constante='protected ';
                        }else if(this.#tb[i][1] === 'valeur'){
                            var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                valeur=obj1.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                            }
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[ind][1]) + ' "' + this.#tb[i][1] + '"'} ));
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
                for( i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
                    if(this.#tb[i][2] === 'c'){
                        nom_variable=this.#tb[i][1];
                    }else if(this.#tb[i][2] === 'f'){
                        if(this.#tb[i][1] === 'valeur_defaut'){
                            var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                declaration+='=' + obj1.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                            }
                        }else if(this.#tb[i][1] === 'type_variable' && this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                            type_variable=this.#tb[i + 1][1].replace( /\\\\/g , '\\' ) + ' ';
                        }else if(this.#tb[i][1] === 'type_variable' && this.#tb[i][8] > 1){
                            var nom_type='';
                            var est_nullable='';
                            for( var j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                                if(this.#tb[j][2] === 'c'){
                                    nom_type=this.#tb[j][1].replace( /\\\\/g , '\\' );
                                }else if(this.#tb[j][2] === 'f'){
                                    if(this.#tb[j][1] === 'nullable'){
                                        est_nullable='?';
                                    }else{
                                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[ind][1]) + ' "' + this.#tb[i][1] + '"'} ));
                                    }
                                }
                            }
                            type_variable=(est_nullable + nom_type) + ' ';
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[ind][1]) + ' "' + this.#tb[i][1] + '"'} ));
                        }
                    }
                }
                if(this.#tb[ind][1] === 'variable_protégée'){
                    t+='protected ' + type_variable + nom_variable + declaration;
                }else if(this.#tb[ind][1] === 'variable_privée'){
                    t+='private ' + type_variable + nom_variable + declaration;
                }else if(this.#tb[ind][1] === 'variable_publique'){
                    t+='public ' + type_variable + nom_variable + declaration;
                }else if(this.#tb[ind][1] === 'variable_publique_statique'){
                    t+='public static ' + type_variable + nom_variable + declaration;
                }else if(this.#tb[ind][1] === 'variable_privée_statique'){
                    t+='private static ' + type_variable + nom_variable + declaration;
                }else if(this.#tb[ind][1] === 'variable_ptotégée_statique'){
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
                for( i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
                    if(this.#tb[i][1] === 'definition' && this.#tb[i][2] === 'f'){
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'nomm' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                                nom_methode=this.#tb[j + 1][1];
                            }else if(this.#tb[j][1] === 'privée' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 0){
                                privee='private ';
                            }else if(this.#tb[j][1] === 'finale' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 0){
                                finale='final ';
                            }else if(this.#tb[j][1] === 'publique' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 0){
                                publique='public ';
                            }else if(this.#tb[j][1] === 'statique' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 0){
                                statique='static ';
                            }else if(this.#tb[j][1] === 'abstraite' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 0){
                                abstraite='abstract ';
                            }else if(this.#tb[j][1] === 'protégée' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 0){
                                protegee='protected ';
                            }else if((this.#tb[j][1] === 'argument' || this.#tb[j][1] === 'adresseArgument') && this.#tb[j][2] === 'f'){
                                var nom_argument='';
                                var type_argument='';
                                var valeur_argument='';
                                var commentaire_argument='';
                                for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][2] === 'c'){
                                        nom_argument=this.#tb[k][1];
                                        if(this.#tb[j][1] === 'adresseArgument'){
                                            nom_argument='&' + nom_argument;
                                        }
                                    }else if(this.#tb[k][2] === 'f'){
                                        if(this.#tb[k][1] === 'valeur_defaut'){
                                            var obj1=this.#php_traiteElement( k + 1 , niveau , {} );
                                            if(obj1.__xst === __xsu){
                                                valeur_argument='=' + obj1.__xva;
                                            }else{
                                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[ind][1]) + ' arguments passés à la méthode'} ));
                                            }
                                        }else if(this.#tb[k][1] === 'type_argument'){
                                            if(this.#tb[k][8] === 1 && this.#tb[k + 1][2] === 'c'){
                                                type_argument=this.#tb[k + 1][1].replace( /\\\\/g , '\\' ) + ' ';
                                            }else if(this.#tb[k][8] === 1 && this.#tb[k + 1][2] === 'f' && this.#tb[k + 1][1] === 'valeur_constante'){
                                                type_argument=this.#tb[k + 2][1].replace( /\\\\/g , '\\' ) + ' ';
                                            }else{
                                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[ind][1]) + ' arguments passés à la méthode'} ));
                                            }
                                        }else if(this.#tb[k][1] === '#'){
                                            commentaire_argument='/*' + this.#tb[k][13] + '*/';
                                        }else{
                                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[ind][1]) + ' arguments passés à la méthode'} ));
                                        }
                                    }
                                }
                                les_arguments+=',' + commentaire_argument + type_argument + nom_argument + valeur_argument;
                            }else if(this.#tb[j][1] === 'type_retour' && this.#tb[j][2] === 'f' && this.#tb[j][8] === 1){
                                type_retour=this.#tb[j + 1][1];
                                type_retour=type_retour !== '' ? ( ':' + type_retour.replace( /\\\\/g , '\\' ) ) : ( '' );
                            }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                            }
                        }
                        if(nom_methode === ''){
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                        }
                        if(les_arguments !== ''){
                            les_arguments=les_arguments.substr( 1 );
                        }
                    }else if(this.#tb[i][1] === 'contenu' && this.#tb[i][2] === 'f'){
                        if(this.#tb[i][8] >= 1){
                            var obj1=this.#rev_php1( i , niveau + 1 , {} );
                            /* ,true,false */
                            if(obj1.__xst === __xsu){
                                contenu+=__m_rev1.resps( niveau + 1 );
                                contenu+=obj1.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                            }
                        }
                    }else if(this.#tb[i][1] === '#' && this.#tb[i][2] === 'f'){
                        les_commentaires_methode+=__m_rev1.resps( niveau );
                        les_commentaires_methode+='/*' + __m_rev1.tr_co_src( this.#tb[i][13] , niveau , i ) + '*/';
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                    }
                }
                if(type_retour !== ''
                       && this.#tb[this.#tb[this.#tb[ind][7]][7]][1] === 'interface'
                       && this.#tb[this.#tb[this.#tb[ind][7]][7]][2] === 'f'
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
                        t+=__m_rev1.resps( niveau );
                        t+='}';
                    }
                }
                break;
                
            case 'appelf' :
                obj=this.#php_traiteAppelFonction( ind , niveau );
                if(obj.__xst === __xsu){
                    t=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'tableau' :
                var objTableau=this.#php_traiteTableau1( ind , niveau );
                if(objTableau.__xst === __xsu){
                    t=objTableau.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'array' : 
            case 'defTab' :
                obj=this.#php_traiteDefinitionTableau( ind , niveau , {"retour_ligne" : true} );
                if(obj.__xst === __xsu){
                    t=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'html_dans_php' :
                debugger;
                /* afr dans quel cas passe-t-on par ici ? */
                obj=__m_rev_vers_html1.c_tab_vers_html( this.#tb , {"indice_de_debut" : ind , "nohead" : true , "niveau" : 0} );
                if(obj.__xst === __xsu){
                    t='html_dans_php(\'' + obj.__xva.replace( /\\/g , '\\\\' ).replace( /\'/g , '\\\'' ) + '\')';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'sql' :
                obj=__m_rev_vers_sql1.c_tab_vers_js( this.#tb , {"indice_de_debut" : ind} );
                if(obj.__xst === __xsu){
                    t='sql_dans_php(\'' + obj.__xva.replace( /\\/g , '\\\\' ).replace( /\'/g , '\\\'' ) + '\')';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case '??' :
                obj=this.#isNotSet( ind , niveau );
                if(obj.__xst === __xsu){
                    t=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'supprimeErreur' :
                var obj=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj.__xst === __xsu){
                    t+='@' + obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'liste' :
                var objListe=this.#php_traiteListe1( ind , true , niveau , false );
                if(objListe.__xst === __xsu){
                    t+=objListe.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'caststring' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+='(string)' + obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'castfloat' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+='(float)' + obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'postinc' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+=obj1.__xva + '++';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'preinc' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+='++' + obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'postdec' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+='' + obj1.__xva + '--';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'predec' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+='--' + obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'castint' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+='(int)(' + obj1.__xva + ')';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'affecte' : 
            case 'affecte_reference' :
                var obj1=this.#php_traiteAffecte( ind , niveau , {} );
                if(obj1.__xst === __xsu){
                    /* je supprime les parenthèses t+='(' + obj1.__xva + ')'; */
                    t+=obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'propriete' :
                if(this.#tb[ind][8] === 2){
                    var element='';
                    var propriete='';
                    var num=0;
                    for( var i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
                        var obj1=this.#php_traiteElement( i , niveau , {} );
                        if(obj1.__xst === __xsu){
                            if(num === 0){
                                element=obj1.__xva;
                                num++;
                            }else{
                                propriete=obj1.__xva;
                            }
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"ind" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                        }
                    }
                    t+=element + '->' + propriete;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"ind" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'testEnLigne' :
                var testEnLigne=[];
                for( j=ind + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                    if(this.#tb[j][1] === 'condition'){
                        testEnLigne.push( [j,this.#tb[j][1],ind] );
                    }else if(this.#tb[j][1] === 'siVrai'){
                        testEnLigne.push( [j,this.#tb[j][1],ind,this.#tb[j][8]] );
                    }else if(this.#tb[j][1] === 'siFaux'){
                        testEnLigne.push( [j,this.#tb[j][1],ind] );
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"ind" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                    }
                }
                if(testEnLigne.length !== 3){
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                var j=0;
                var si_vrai='';
                for( j=0 ; j < testEnLigne.length ; j++ ){
                    if(testEnLigne[j][1] === 'condition'){
                        var objCondition=this.#php_traiteOperation( testEnLigne[j][0] , niveau , true );
                        if(objCondition.__xst === __xsu){
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"ind" : testEnLigne[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                        }
                    }else if(testEnLigne[j][1] === 'siVrai'){
                        if(testEnLigne[j][3] === 0){
                            si_vrai='';
                        }else{
                            var objSiVrai=this.#php_traiteElement( testEnLigne[j][0] + 1 , niveau + 1 , {} );
                            if(objSiVrai.__xst === __xsu){
                                si_vrai=objSiVrai.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"ind" : testEnLigne[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                            }
                        }
                    }else if(testEnLigne[j][1] === 'siFaux'){
                        var objSiFaux=this.#php_traiteElement( testEnLigne[j][0] + 1 , niveau + 1 , {} );
                        if(objSiFaux.__xst === __xsu){
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"ind" : testEnLigne[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                        }
                    }
                }
                var par_gauche='';
                var par_droite='';
                if(this.#tb[this.#tb[ind][7]][1] === 'siVrai' || this.#tb[this.#tb[ind][7]][1] === 'siFaux'){
                    par_gauche='(';
                    par_droite=')';
                }
                if(options.hasOwnProperty( 'retour_de_ligne' ) && options.retour_de_ligne === true){
                    t=(par_gauche + objCondition.__xva) + ' ?' + (si_vrai === '' ? ( '' ) : ( __m_rev1.resps( niveau ) + ' ' + si_vrai + ' ' )) + ': ' + __m_rev1.resps( niveau ) + objSiFaux.__xva + par_droite;
                }else{
                    t=(par_gauche + objCondition.__xva) + ' ?' + (si_vrai === '' ? ( '' ) : ( ' ' + si_vrai + ' ' )) + ': ' + objSiFaux.__xva + par_droite;
                }
                break;
                
            case 'sql_inclure_source' :
                if(this.#tb[ind][8] === 1 && this.#tb[ind + 1][2] === 'c'){
                    t+='sql_inclure_source(' + this.#tb[ind + 1][1] + ')';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'heredoc' :
                if(this.#tb[ind][8] === 2){
                    t+='<<<' + this.#tb[ind + 1][1] + this.#tb[ind + 2][1].replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ).replace( /\\`/g , '`' ) + CRLF + this.#tb[ind + 1][1].trim() + '';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'nowdoc' :
                if(this.#tb[ind][8] === 2){
                    t+='<<<\'' + this.#tb[ind + 1][1] + '\'' + this.#tb[ind + 2][1].replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ).replace( /\\`/g , '`' ) + CRLF + this.#tb[ind + 1][1].trim() + '';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'sql_inclure_reference' :
                if(this.#tb[ind][8] === 1 && this.#tb[ind + 1][2] === 'c'){
                    t+='sql_inclure_reference(' + this.#tb[ind + 1][1] + ')';
                    t+=__m_rev1.resps( niveau );
                    t+='/*sql_inclure_deb*/';
                    t+=__m_rev1.resps( niveau );
                    t+='require_once(INCLUDE_PATH.\'/sql/sql_1.php\');';
                    t+=__m_rev1.resps( niveau );
                    t+='/*sql_inclure_fin*/';
                    t+=__m_rev1.resps( niveau );
                    debugger;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'directive' :
                var faire='';
                var texte='';
                for( i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
                    if(this.#tb[i][1] === 'texte' && this.#tb[i][2] === 'f' && this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                        texte=this.#tb[i + 1][1].replace( /\\\'/g , '"' );
                    }else if(this.#tb[i][1] === 'faire' && this.#tb[i][2] === 'f'){
                        obj=this.#rev_php1( i , niveau + 1 , {} );
                        /* ,false,false */
                        if(obj.__xst === __xsu){
                            faire+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                        }
                    }else if(this.#tb[i][1] === '#' && this.#tb[i][2] === 'f'){
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                    }
                }
                if(faire !== ''){
                    t+=__m_rev1.resps( niveau );
                    t+='declare(' + texte + '){' + faire + __m_rev1.resps( niveau ) + '}';
                }else{
                    t+='declare(' + texte + ')';
                }
                break;
                
            case 'espace_de_noms' :
                var faire='';
                var nom_espace='';
                for( i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
                    if(this.#tb[i][1] === 'nom_espace' && this.#tb[i][2] === 'f' && this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                        nom_espace=this.#tb[i + 1][1].replace( /\\\\/g , '\\' );
                    }else if(this.#tb[i][1] === 'faire' && this.#tb[i][2] === 'f'){
                        obj=this.#rev_php1( i , niveau , {} );
                        /* ,false,false */
                        if(obj.__xst === __xsu){
                            faire+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                        }
                    }else if(this.#tb[i][1] === '#' && this.#tb[i][2] === 'f'){
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                    }
                }
                if(nom_espace !== ''){
                    if(faire !== ''){
                        t+=__m_rev1.resps( niveau );
                        t+='namespace ' + nom_espace + ';';
                        t+=__m_rev1.resps( niveau );
                        t+=faire;
                    }else{
                        t+=__m_rev1.resps( niveau );
                        t+='namespace ' + nom_espace + ';';
                    }
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'interface' :
                var faire='';
                var nom_interface='';
                for( i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
                    if(this.#tb[i][1] === 'nom_interface' && this.#tb[i][2] === 'f' && this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                        nom_interface=this.#tb[i + 1][1];
                    }else if(this.#tb[i][1] === 'faire' && this.#tb[i][2] === 'f'){
                        obj=this.#rev_php1( i , niveau + 1 , {} );
                        /* ,false,false */
                        if(obj.__xst === __xsu){
                            faire+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                        }
                    }else if(this.#tb[i][1] === '#' && this.#tb[i][2] === 'f'){
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                    }
                }
                if(faire !== '' && nom_interface !== ''){
                    t+=__m_rev1.resps( niveau );
                    t+='interface  ' + nom_interface + '{';
                    t+=__m_rev1.resps( niveau );
                    t+=faire;
                    t+=__m_rev1.resps( niveau );
                    t+='}';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'throw' :
                var obj1=this.#php_traiteElement( ind + 1 , niveau , {} );
                if(obj1.__xst === __xsu){
                    t+='throw ' + obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"ind" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'constante' :
                var obj=this.#php_traiteConstante1( ind , niveau );
                if(obj.__xst === __xsu){
                    t+=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'valeur_constante' :
                if(this.#tb[ind][8] === 1 && this.#tb[ind + 1][2] === 'c'){
                    t+=this.#tb[ind + 1][1].replace( /\\\\/g , '\\' );
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'cloturée' :
                obj=this.#php_traiteAppelCloturee( ind , true , niveau );
                if(obj.__xst === __xsu){
                    t=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case '' :
                /*
                  éviter un ";" juste après "new ParserFactory()" dans cette ligne :
                  $parser=(new ParserFactory())->createForNewestSupportedVersion();
                */
                obj=this.#rev_php1( ind , niveau , {"term_final" : false} );
                /* ,true,true */
                /* ✍ dansFonction,dansInitialisation */
                if(obj.__xst === __xsu){
                    t='(' + obj.__xva + ')';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            case 'encapsulé' :
                if(this.#tb[ind][8] === 1 && this.#tb[ind + 1][2] === 'c'){
                    t+=this.#macst_pour_php( this.#tb[ind + 1] );
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[ind][1]} ));
                }
                break;
                
            default:
                obj=this.#php_traiteOperation( ind , niveau , false );
                if(obj.__xst === __xsu){
                    t=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : (__m_rev1.nl2() + this.#tb[ind][1]) + ' non traité'} ));
                }
                break;
                
        }
        if(options.hasOwnProperty( 'terminateur' ) && options.terminateur !== ''){
            t=__m_rev1.resps( niveau ) + t + options.terminateur;
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traiteConstante1( id , niveau ){
        var t='';
        var nom_constante='';
        var valeur_constante='';
        var privee_constante='';
        var protegee_constante='';
        var publique_constante='';
        for( var i=id + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(this.#tb[i][2] === 'c'){
                nom_constante=this.#tb[i][1];
            }else if(this.#tb[i][2] === 'f'){
                if(this.#tb[i][1] === 'valeur'){
                    var obj1=this.#php_traiteElement( i + 1 , niveau , {} );
                    if(obj1.__xst === __xsu){
                        valeur_constante+=obj1.__xva;
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                    }
                }else if(this.#tb[i][1] === 'privee'){
                    privee_constante='private ';
                }else if(this.#tb[i][1] === 'protégée'){
                    protegee_constante='protected ';
                }else if(this.#tb[i][1] === 'publique'){
                    publique_constante='public ';
                }else if(this.#tb[i][1] === '#'){
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' "' + this.#tb[i][1] + '"'} ));
                }
            }
        }
        t+=(protegee_constante + privee_constante + publique_constante) + 'const ' + nom_constante + ' = ' + valeur_constante;
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traiteTableau1( i , niveau ){
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
        var contenu='';
        var termineParUnePropriete=false;
        var enfantTermineParUnePropriete=false;
        positionAppelTableau=-1;
        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === 'nomt' && this.#tb[j][2] === 'f'){
                positionAppelTableau=j;
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    nomTableau=this.#tb[j + 1][1];
                    if(nomTableau === 'Array'){
                        nbEnfants=this.#tb[this.#tb[this.#tb[j + 1][7]][7]][8] - 1;
                    }
                }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === 'tableau'){
                    var obj=this.#php_traiteTableau1( j + 1 , niveau );
                    if(obj.__xst === __xsu){
                        nomTableau=obj.__xva;
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                    }
                }else{
                    var obj1=this.#php_traiteElement( j + 1 , niveau , {} );
                    if(obj1.__xst === __xsu){
                        nomTableau=obj1.__xva;
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                    }
                }
                break;
            }
        }
        if(positionAppelTableau > 0 && nomTableau !== ''){
            for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                if(this.#tb[j][2] === 'f'){
                    if(this.#tb[j][1] === 'nomt' || this.#tb[j][1] === 'p' || this.#tb[j][1] === '#' || this.#tb[j][1] === 'prop'){
                        continue;
                    }else{
                        this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' les seuls paramètres de tableau sont nomt,p,prop et pas "' + this.#tb[j][1] + '"'} );
                    }
                }
            }
            argumentsFonction='';
            for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                if(this.#tb[j][1] === 'nomt' && this.#tb[j][3] === this.#tb[i][3] + 1){
                    /* déjà traité */
                }else if(this.#tb[j][1] === 'p' && this.#tb[j][3] === this.#tb[i][3] + 1){
                    if(this.#tb[j][8] === 0 && this.#tb[j][2] === 'f'){
                        argumentsFonction+='[]';
                    }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                        argumentsFonction+='[' + this.#macst_pour_php( this.#tb[j + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ) + ']';
                    }else if(this.#tb[j][8] > 1 && this.#tb[j + 1][2] === 'c'){
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                    }else{
                        var obj1=this.#php_traiteElement( j + 1 , niveau , {} );
                        if(obj1.__xst === __xsu){
                            argumentsFonction+='[' + obj1.__xva + ']';
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }
                }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f' && this.#tb[j][3] === this.#tb[i][3] + 1){
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }
            t+=nomTableau;
            t+=argumentsFonction;
            t+=proprietesTableau;
        }else{
            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /* ✍===================================================================================================================== */
    #isNotSet( id , niveau ){
        var t='';
        var valeur='';
        var defaut='';
        for( var i=id + 1 ; i < this.#l02 && this.#tb[i][3] > this.#tb[id][3] ; i=this.#tb[i][12] ){
            if(this.#tb[i][9] === 1){
                var obj=this.#php_traiteElement( i , niveau , {} );
                if(obj.__xst === __xsu){
                    valeur=obj.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[i][9] === 2){
                var obj=this.#php_traiteElement( i , niveau , {} );
                if(obj.__xst === __xsu){
                    defaut=obj.__xva;
                    break;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                }
            }
        }
        t+=valeur + '??' + defaut;
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /* ✍===================================================================================================================== */
    #php_traiteNew( ind , niveau ){
        var t='';
        t+='new ';
        var obj=this.#php_traiteElement( ind + 1 , niveau , {} );
        if(obj.__xst === __xsu){
            t+=obj.__xva;
        }else{
            return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2()} ));
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /* ✍===================================================================================================================== */
    #php_traiteListe1( ind , niveau ){
        var t='';
        var lesParams='';
        for( var i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(this.#tb[i][1] === 'p' && this.#tb[i][2] === 'f'){
                if(lesParams !== ''){
                    lesParams+=' , ';
                }
                if(this.#tb[i][8] === 0){
                    /*
                      dans les list() de php, il peut y avoir un paramètre vide
                    */
                    lesParams+=' /* vide intentionnel */';
                }else{
                    var obj=this.#php_traiteElement( i + 1 , niveau , {} );
                    if(obj.__xst === __xsu){
                        lesParams+=obj.__xva;
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2()} ));
                    }
                }
            }
        }
        t+='list(' + lesParams + ')';
        return({"__xst" : __xsu ,"__xva" : t});
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
    #tableau_precedences_php={
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
      
      this.#tb[this.#tb[this.#tb[id][7]][7]] + ' ' + this.#tb[this.#tb[id][7]] + ' ' + this.#tb[id]
      $a=$b?$c:$d+1; testenligne sifaux plus
    */
    #php_traiteOperation( id , niveau , ajouter_des_sauts_de_lignes ){
        var t='';
        var i=0;
        var sauts=false;
        let un_espace_p0='';
        if(!this.#tableau_precedences_php.hasOwnProperty( this.#tb[id][1] )){
            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' "' + this.#tb[id][1] + '"'} ));
        }
        var operateur_courant=this.#tableau_precedences_php[this.#tb[id][1]];
        var operandes=[];
        for( i=id + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(this.#tb[i][1] === '#' && this.#tb[i][2] === 'f'){
            }else if(this.#tb[i][2] === 'c'){
                if(this.#tb[id][1] === 'instance_de'){
                    operandes.push( {"valeur" : this.#tb[i][1].replace( /\\\\/g , '\\' )} );
                }else{
                    operandes.push( {"valeur" : this.#macst_pour_php( this.#tb[i] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' )} );
                }
            }else{
                if(this.#tableau_precedences_php.hasOwnProperty( this.#tb[i][1] )){
                    var sous_operateur=this.#tableau_precedences_php[this.#tb[i][1]];
                    var objOperation=this.#php_traiteOperation( i , niveau + 1 , ajouter_des_sauts_de_lignes );
                    if(objOperation.__xst === __xsu){
                        if(sous_operateur.priorite >= operateur_courant.priorite
                               || operateur_courant.operateur === ' . '
                                   && sous_operateur.operateur !== ' . '
                        ){
                            operandes.push( {"valeur" : '(' + objOperation.__xva + ')'} );
                        }else{
                            if(operateur_courant.operateur === ''){
                                operandes.push( {"valeur" : objOperation.__xva} );
                            }else{
                                operandes.push( {"valeur" : objOperation.__xva} );
                            }
                        }
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                    }
                }else{
                    var obj1=this.#php_traiteElement( i , niveau , {} );
                    if(obj1.__xst === __xsu){
                        if(this.#tb[i][2] === 'c'
                               || this.#tb[i][2] === 'f'
                                   && (this.#tb[i][1] === 'appelf'
                                       || this.#tb[i][1] === 'tableau'
                                       || this.#tb[i][1] === 'defTab'
                                       || this.#tb[i][1] === 'valeur_constante'
                                       || this.#tb[i][1] === 'preinc'
                                       || this.#tb[i][1] === 'postinc'
                                       || this.#tb[i][1] === 'predec'
                                       || this.#tb[i][1] === 'postdec')
                        ){
                            operandes.push( {"valeur" : obj1.__xva} );
                        }else if(this.#tb[i][2] === 'f' && this.#tb[i][1] === 'affecte'){
                            /* il vaut mieux mettre un affectation dans une parenthèse sauf quand elle est à la racine d'une condition */
                            if(this.#tb[this.#tb[i][7]][1] === 'condition'){
                                operandes.push( {"valeur" : obj1.__xva} );
                            }else{
                                operandes.push( {"valeur" : '(' + obj1.__xva + ')'} );
                            }
                        }else{
                            operandes.push( {"valeur" : '(' + obj1.__xva + ')'} );
                        }
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                    }
                }
            }
        }
        if(operandes.length === 0){
            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
        }else if(operandes.length === 1){
            if(this.#tb[id][1] === 'moins'){
                t+='-' + operandes[0].valeur;
            }else if(this.#tb[id][1] === 'plus'){
                t+='+' + operandes[0].valeur;
            }else{
                t+=operateur_courant.operateur;
                t+=operandes[0].valeur;
            }
        }else{
            if(ajouter_des_sauts_de_lignes !== undefined && ajouter_des_sauts_de_lignes === true){
                sauts=true;
                un_espace_p0=__m_rev1.resps( niveau - 1 );
            }
            for( var i=0 ; i < operandes.length ; i++ ){
                if(i > 0){
                    if(sauts === true && (operateur_courant.operateur === ' && ' || operateur_courant.operateur === ' || ')){
                        t+=un_espace_p0 + '  ';
                    }
                    t+=operateur_courant.operateur;
                }
                t+=operandes[i].valeur;
            }
        }
        /* console.log('operandes=' , operandes ); */
        /* debugger */
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traiteAppelDefinition_de_classe( ind , dansConditionOuDansFonction , niveau ){
        var t='';
        var nom_de_classe='';
        var contenu='';
        var abstraite='';
        var implemente='';
        var finale='';
        var etend='';
        for( var i=ind + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(this.#tb[i][7] === ind && this.#tb[i][2] === 'f'){
                if(this.#tb[i][1] === "nom_classe" && this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                    nom_de_classe=__m_rev1.ma_constante( this.#tb[i + 1] );
                }else if(this.#tb[i][1] === "contenu" && this.#tb[i][2] === 'f'){
                    if(this.#tb[i][8] > 0){
                        var obj=this.#rev_php1( i , niveau + 1 , {} );
                        /* ,false,false */
                        if(obj.__xst === __xsu){
                            contenu+=__m_rev1.resps( niveau + 1 );
                            contenu+=obj.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }else{
                        contenu='';
                    }
                }else if(this.#tb[i][1] === "abstraite" && this.#tb[i][2] === 'f' && this.#tb[i][8] === 0){
                    abstraite='abstract ';
                }else if(this.#tb[i][1] === "finale" && this.#tb[i][2] === 'f' && this.#tb[i][8] === 0){
                    finale='final ';
                }else if(this.#tb[i][1] === "étend" && this.#tb[i][2] === 'f' && this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                    etend=' extends ' + this.#tb[i + 1][1].replace( /\\\\/g , '\\' ) + ' ';
                }else if(this.#tb[i][1] === "implemente" && this.#tb[i][2] === 'f' && this.#tb[i][8] > 0){
                    for( var j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][2] === 'c'){
                            implemente+=', ' + this.#tb[j][1].replace( /\\\\/g , '\\' );
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }
                    implemente=' implements ' + implemente.substr( 1 );
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' "' + this.#tb[i][1] + '"'} ));
                }
            }
        }
        if(nom_de_classe === ''){
            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
        }
        t+=(finale + abstraite) + 'class ' + nom_de_classe + etend + implemente + '{' + contenu;
        t+=__m_rev1.resps( niveau );
        t+='}';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traite_arguments_definition_fonction( i , niveau ){
        var t='';
        var j=0;
        var k=0;
        var argumentsFonction='';
        var elementFonction='';
        var dansNew=false;
        /* ✍ 0id	1val	2typ	3niv	4coQ	5pre	6der	7cAv	8cAp	9cDe	10pId	11nbE */
        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === 'defTab'){
                obj=this.#php_traiteDefinitionTableau( j , niveau , {} );
                if(obj.__xst === __xsu){
                    argumentsFonction+=',' + obj.__xva + '';
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[j][1] === 'element'){
                if(this.#tb[j + 1][1] === 'nouveau'){
                    dansNew=true;
                    var indice=j + 1;
                }else{
                    var indice=j;
                }
                if(this.#tb[indice + 1][2] === 'c'){
                    if(this.#tb[indice + 1][1].length >= 2 && this.#tb[indice + 1][1].substr( this.#tb[indice + 1][1].length - 2 , 2 ) === '::'){
                        /*
                          appel à une fonction statique de php, pas de flèche
                        */
                        if(this.#tb[indice + 1][1].indexOf( '\\' ) >= 0){
                            elementFonction=this.#tb[indice + 1][1].replace( /\\\\/g , '\\' ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ) + '';
                        }else{
                            elementFonction=this.#macst_pour_php( this.#tb[indice + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ) + '';
                        }
                    }else{
                        elementFonction=this.#macst_pour_php( this.#tb[indice + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' ) + '->';
                    }
                }else if(this.#tb[indice + 1][2] === 'f'){
                    if(this.#tb[indice + 1][1] === 'appelf'){
                        var obindice=this.#php_traiteAppelFonction( indice + 1 , niveau );
                        if(obindice.__xst === __xsu){
                            if(dansNew === true){
                                elementFonction='(new ' + obindice.__xva + ')->';
                            }else{
                                elementFonction=obindice.__xva + '->';
                            }
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : indice ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }else if(this.#tb[indice + 1][1] === 'tableau'){
                        var obindice=this.#php_traiteTableau1( indice + 1 , niveau );
                        if(obindice.__xst === __xsu){
                            elementFonction='' + obindice.__xva + '->';
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : indice ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }else{
                        var obje=this.#php_traiteElement( indice + 1 , niveau , {} );
                        if(obje.__xst === __xsu){
                            elementFonction=obje.__xva + '->';
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : indice ,"__xme" : __m_rev1.nl2() + ' inconnue ' + this.#tb[indice + 1][1]} ));
                        }
                    }
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : indice ,"__xme" : __m_rev1.nl2() + ' element'} ));
                }
            }else if(this.#tb[j][1] === 'p' && this.#tb[j][3] === this.#tb[i][3] + 1){
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    argumentsFonction+=',' + this.#macst_pour_php( this.#tb[j + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
                }else{
                    var le_commentaire='';
                    for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                        if(this.#tb[k][2] === 'f' && this.#tb[k][1] === '#'){
                            le_commentaire=' /*' + this.#tb[k][13].trim() + '*/ ';
                        }else{
                            var obj1=this.#php_traiteElement( k , niveau , {} );
                            if(obj1.__xst === __xsu){
                                argumentsFonction+=',' + le_commentaire + obj1.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + ' p() '} ));
                            }
                        }
                    }
                }
            }
        }
        if(argumentsFonction !== ''){
            argumentsFonction=argumentsFonction.substr( 1 );
        }
        return({"__xst" : __xsu ,"__xva" : argumentsFonction ,"elementFonction" : elementFonction});
    }
    /*
      =============================================================================================================
    */
    #php_traiteAppelCloturee( i , dansConditionOuDansFonction , niveau ){
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
        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === 'argument' || this.#tb[j][1] === 'adresseArgument'){
                var nom_argument='';
                var type_argument='';
                var valeur_argument='';
                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                    if(this.#tb[k][2] === 'c'){
                        nom_argument=this.#tb[j + 1][1];
                        if(this.#tb[j][1] === 'adresseArgument'){
                            nom_argument='&' + nom_argument;
                        }
                    }else if(this.#tb[k][2] === 'f'){
                        if(this.#tb[k][1] === 'valeur_defaut'){
                            var obj1=this.#php_traiteElement( k + 1 , niveau , {} );
                            if(obj1.__xst === __xsu){
                                valeur_argument='=' + obj1.__xva;
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[j][1]} ));
                            }
                        }else if(this.#tb[k][1] === 'type_argument' && this.#tb[k][8] === 1 && this.#tb[k + 1][2] === 'c'){
                            type_argument=this.#tb[k + 1][1].replace( /\\\\/g , '\\' ) + ' ';
                        }else if(this.#tb[k][1] === 'type_argument' && this.#tb[k][8] === 1 && this.#tb[k + 1][2] === 'f'){
                            if('valeur_constante' === this.#tb[k + 1][1]
                                   && this.#tb[k + 1][2] === 'f'
                                   && this.#tb[k + 1][8] === 1
                                   && this.#tb[k + 2][2] === 'c'
                            ){
                                type_argument=this.#tb[k + 2][1].replace( /\\\\/g , '\\' ) + ' ';
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' arguments "' + this.#tb[k][1] + '"'} ));
                            }
                        }else if(this.#tb[k][1] === '#'){
                        }else{
                            debugger;
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' arguments  "' + this.#tb[k][1] + '"'} ));
                        }
                    }
                }
                argumentsFonction+=',' + type_argument + nom_argument + valeur_argument;
            }else if(this.#tb[j][1] === 'statique'){
                statique='static ';
            }else if(this.#tb[j][1] === 'type_retour'){
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    type_retour=':' + this.#tb[j + 1][1].replace( /\\\\/g , '\\' );
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[j][1] === 'contenu'){
                obj=this.#rev_php1( j , niveau + 2 , {} );
                /* ,false,false */
                if(obj.__xst === __xsu){
                    contenu+=__m_rev1.resps( niveau + 1 );
                    contenu+=obj.__xva;
                }else{
                    return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' de la fonction "' + nomFonction + '"'});
                }
            }else if(this.#tb[j][1] === 'utilise' || this.#tb[j][1] === 'utilise_par_adresse'){
                var prefixe='';
                if(this.#tb[j][1] === 'utilise_par_adresse'){
                    prefixe='&';
                }
                var nom_argument='';
                var type_argument='';
                var valeur_argument='';
                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                    if(this.#tb[k][7] === j){
                        if(this.#tb[k][2] === 'c'){
                            nom_argument=prefixe + this.#tb[j + 1][1];
                        }else if(this.#tb[k][2] === 'f'){
                            if(this.#tb[k][1] === 'valeur_defaut'){
                                var obj1=this.#php_traiteElement( k + 1 , niveau , {} );
                                if(obj1.__xst === __xsu){
                                    valeur_argument='=' + obj1.__xva;
                                }else{
                                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' utilise '} ));
                                }
                            }else if(this.#tb[k][1] === 'type_argument' && this.#tb[k][8] === 1 && this.#tb[k + 1][2] === 'c'){
                                type_argument=this.#tb[k + 1][1].replace( /\\\\/g , '\\' ) + ' ';
                            }else if(this.#tb[k][1] === '#'){
                            }else{
                                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' utilise '} ));
                            }
                        }
                    }
                }
                les_utilisations+=',' + type_argument + nom_argument + valeur_argument;
            }else{
                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' "' + this.#tb[j][1] + '"'} ));
            }
        }
        if(argumentsFonction !== ''){
            argumentsFonction=argumentsFonction.substr( 1 );
        }
        if(les_utilisations !== ''){
            les_utilisations=' use (' + les_utilisations.substr( 1 ) + ')';
        }
        t=statique + 'function(' + argumentsFonction + ')' + type_retour + les_utilisations + '{' + contenu + __m_rev1.resps( niveau + 1 ) + '}';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traiteAffectOp( i , dansConditionOuDansFonction , niveau ){
        var t='';
        var operation='';
        var avantEgal='';
        var apresEgal='';
        var commentaire='';
        for( var j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            var elt='';
            if(this.#tb[j][2] === 'f' && this.#tb[j][1] === '#'){
                if(!dansConditionOuDansFonction){
                    commentaire+=__m_rev1.resps( niveau );
                }
                commentaire+='/' + '*' + __m_rev1.tr_co_src( this.#tb[j][13] , niveau , j ) + '*' + '/';
                continue;
            }else if(this.#tb[j][2] === 'c'){
                if(operation === ''){
                    operation=this.#tb[j][1];
                }else{
                    elt=this.#macst_pour_php( this.#tb[j] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
                }
            }else{
                var obj1=this.#php_traiteElement( j , niveau , {} );
                if(obj1.__xst === __xsu){
                    elt=obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }
            if(avantEgal === ''){
                avantEgal=elt;
            }else{
                if(apresEgal !== ''){
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' vérifiez les paramètres de affecteop   '} ));
                }else{
                    apresEgal=elt;
                }
            }
        }
        if(commentaire !== ''){
            t=commentaire + t;
        }
        t+=avantEgal + ' ' + operation + ' ' + apresEgal;
        if(this.#tb[i][8] === 4 && commentaire === ''){
            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' ne doit contenir que 2 ou 3 arguments et le 3ème doit être un commentaire'} ));
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traiteAffecte( i , niveau , opt ){
        var t='';
        var avantEgal='';
        var apresEgal='';
        var commentaire='';
        for( var j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            var elt='';
            if(this.#tb[j][2] === 'f' && this.#tb[j][1] === '#'){
                commentaire+='/*' + __m_rev1.tr_co_src( this.#tb[j][13] , niveau , j ) + '*/';
                continue;
            }else if(this.#tb[j][2] === 'c'){
                elt=this.#macst_pour_php( this.#tb[j] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
            }else{
                var obj1=this.#php_traiteElement( j , niveau , {} );
                if(obj1.__xst === __xsu){
                    elt=obj1.__xva;
                }else{
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }
            /* enfant 1 ou 2 */
            if(avantEgal === ''){
                avantEgal=elt;
            }else{
                if(apresEgal !== ''){
                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' paramètres de affecte ( 2 + commentaires uniquement )  '} ));
                }else{
                    apresEgal=elt;
                }
            }
        }
        if(apresEgal.substr( 0 , avantEgal.length ) === avantEgal && apresEgal.substr( avantEgal.length , 1 ) === '.'){
            if(this.#tb[i][1] === 'affecte_reference'){
                t+=avantEgal + '.=&' + apresEgal.substr( avantEgal.length + 1 );
            }else{
                t+=avantEgal + '.=' + apresEgal.substr( avantEgal.length + 1 );
            }
        }else{
            if(this.#tb[i][1] === 'affecte_reference'){
                t+=avantEgal + '=&' + apresEgal;
            }else{
                t+=avantEgal + '=' + apresEgal;
            }
        }
        if(commentaire !== ''){
            t=commentaire + t;
        }
        if(this.#tb[i][8] === 3 && commentaire === ''){
            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' 2 ou 3 arguments et le 3ème doit être un commentaire non vide '} ));
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traiteAppelFonction( i , niveau ){
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
        var sans_arguments=false;
        positionAppelFonction=-1;
        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === 'sans_arguments' && this.#tb[j][2] === 'f' && this.#tb[this.#tb[i][7]][1] === 'nouveau'){
                /* pour l'instant, je n'ai rencontré ce cas que dans les appels à new ($a = new P\A\B;) */
                sans_arguments=true;
            }else if(this.#tb[j][1] === 'nomf' && this.#tb[j][2] === 'f'){
                positionAppelFonction=j;
                if(this.#tb[j][8] === 1){
                    if(this.#tb[j + 1][2] === 'c'){
                        nomFonction=this.#tb[j + 1][1];
                        if(nomFonction.indexOf( '\\' ) >= 0){
                            nomFonction=nomFonction.replace( /\\\\/g , '\\' );
                        }
                    }else if(this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === 'tableau'){
                        var obj1=this.#php_traiteTableau1( j + 1 , niveau );
                        if(obj1.__xst === __xsu){
                            nomFonction=obj1.__xva;
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }else if(this.#tb[j + 1][2] === 'f'
                           && this.#tb[j + 1][1] === 'qualification_totale'
                           && this.#tb[j + 1][2] === 'f'
                           && this.#tb[j + 1][8] === 1
                           && this.#tb[j + 2][2] === 'c'
                    ){
                        nomFonction='\\' + this.#tb[j + 2][1];
                    }else if(this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === 'concat'){
                        var objf=this.#php_traiteElement( j + 1 , niveau + 2 , {} );
                        if(objf.__xst === __xsu){
                            nomFonction='{' + objf.__xva + '}';
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' nom fonction'} ));
                        }
                    }else if(this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === 'appelf'){
                        var objf2=this.#php_traiteElement( j + 1 , niveau + 2 , {} );
                        if(objf2.__xst === __xsu){
                            nomFonction='' + objf2.__xva + '';
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' nom fonction'} ));
                        }
                        debugger;
                    }else if(this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === 'propriete'){
                        var objf2=this.#php_traiteElement( j + 1 , niveau + 2 , {} );
                        if(objf2.__xst === __xsu){
                            nomFonction='' + objf2.__xva + '';
                        }else{
                            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' nom fonction'} ));
                        }
                    }else if(this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === "valeur_constante" && this.#tb[j + 1][8] === 1){
                        nomFonction=this.#tb[j + 2][1].replace( /\\\\/g , '\\' );
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' nom fonction  "' + this.#tb[j + 1][1] + '" '} ));
                    }
                }
            }
        }
        if(positionAppelFonction > 0 && nomFonction != ''){
            nomRetour='';
            positionRetour=-1;
            for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                if(this.#tb[j][1] === 'r' && this.#tb[j][2] === 'f'){
                    if(this.#tb[j][8] === 1){
                        nomRetour=this.#tb[j + 1][1];
                    }
                    positionRetour=j;
                    break;
                }
            }
            var obj=this.#php_traite_arguments_definition_fonction( i , niveau );
            if(obj.__xst === __xsu){
                argumentsFonction=obj.__xva;
                elementFonction=obj.elementFonction;
            }else{
                return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' arguments'} ));
            }
            t+=nomRetour != '' ? ( nomRetour + '=' ) : ( '' );
            if(nomFonction === 'use'){
                argumentsFonction=argumentsFonction.replace( /\\\\/g , '\\' );
                argumentsFonction=argumentsFonction.substr( 1 , argumentsFonction.length - 2 );
                t+=nomFonction + ' ' + argumentsFonction + '';
            }else if(nomFonction === 'echo'){
                t+=(elementFonction + nomFonction) + ' ' + argumentsFonction + ' ';
            }else{
                t+=elementFonction + nomFonction + (sans_arguments === true ? ( '' ) : ( '(' + argumentsFonction + ')' ));
            }
        }else{
            return(this.#rev_php_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' il faut un nom de fonction à appeler n(xxxx)'} ));
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #php_traiteDefinitionTableau( id , niveau , options={} ){
        /* ✍ id = position de 'obj' */
        var t='';
        var j=0;
        var obje={};
        var seuil_elements_dans_tableau=4;
        var commentaire='';
        var le_commentaire='';
        var nombre_elements_dans_tableau=0;
        var a_un_tbel=false;
        var contient_un_commentaire=false;
        var numero_enfant=0;
        var format_court=false;
        if(this.#tb[id][8] === 0){
            t+='array()';
            return({"__xst" : __xsu ,"__xva" : t});
        }
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            /* ✍ si on est au niveau +1 */
            nombre_elements_dans_tableau++;
            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                contient_un_commentaire=true;
                if(this.#tb[j][13].indexOf( 'tbel' ) >= 0){
                    a_un_tbel=true;
                }
            }
        }
        if(nombre_elements_dans_tableau > seuil_elements_dans_tableau){
            contient_un_commentaire=true;
        }
        var tableauSortie=[];
        var sortie='';
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            sortie='';
            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                if(nombre_elements_dans_tableau > seuil_elements_dans_tableau){
                    if(a_un_tbel === false){
                        sortie+=__m_rev1.resps( niveau + 1 );
                    }
                }
                sortie+='/*' + __m_rev1.tr_co_src( this.#tb[j][13] , niveau + 1 , j ) + '*/';
                tableauSortie.push( ["commentaire",sortie] );
                /* commentaire+=this.#tb[j][13]; */
            }else if(this.#tb[j][1] === 'format_court' && this.#tb[j][2] === 'f'){
                format_court=true;
            }else if(this.#tb[j][1] === '' && this.#tb[j][2] === 'f'){
                numero_enfant++;
                if(this.#tb[j][8] >= 2){
                    /* format clé => valeur */
                    var cle='';
                    var valeur='';
                    for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                        if(this.#tb[k][7] === j){
                            if(this.#tb[k][1] === '#' && this.#tb[k][2] === 'f'){
                                le_commentaire='/*' + this.#tb[k][13].trim().replace( /\n/g , '' ).replace( /\r/g , '' ) + '*/';
                            }else{
                                obje=this.#php_traiteElement( k , niveau + 2 , options );
                                if(obje.__xst === __xsu){
                                    if(cle === ''){
                                        cle=obje.__xva;
                                    }else{
                                        valeur=obje.__xva;
                                    }
                                }else{
                                    return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                                }
                            }
                        }
                    }
                    if(a_un_tbel){
                        sortie+=' ';
                    }else{
                        if(contient_un_commentaire === true){
                            sortie+=__m_rev1.resps( niveau + 1 );
                        }else{
                            sortie+=' ';
                        }
                    }
                    if(valeur === '' && cle !== ''){
                        sortie+=(le_commentaire + cle) + '';
                    }else if(valeur !== '' && cle !== ''){
                        sortie+=(le_commentaire + cle) + ' => ' + valeur + '';
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + ' clé valeur'} ));
                    }
                    tableauSortie.push( ["element",sortie] );
                    le_commentaire='';
                }else if(this.#tb[j][8] === 1){
                    /* en php, il peut n'y avoir qu'une dimention sans cle => valeur array['a','b'] */
                    obje=this.#php_traiteElement( j + 1 , niveau + 2 , options );
                    if(obje.__xst === __xsu){
                        if(a_un_tbel){
                            if(numero_enfant% 10 === 0){
                                sortie+=__m_rev1.resps( niveau + 1 );
                            }else{
                                sortie+=' ';
                            }
                        }else{
                            if(contient_un_commentaire){
                                sortie+=__m_rev1.resps( niveau + 1 );
                            }else{
                                sortie+=' ';
                            }
                        }
                        sortie+=obje.__xva;
                        tableauSortie.push( ["element",sortie] );
                    }else{
                        return(this.#rev_php_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
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
                t+=__m_rev1.resps( niveau );
            }
        }else{
            if(contient_un_commentaire === true){
                t+=__m_rev1.resps( niveau );
            }
        }
        if(format_court === true){
            t+=']';
        }else{
            t+=')';
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
      point d'entrée : convertion du tableau au format rev vers un texte format php
      =============================================================================================================
    */
    c_tab_vers_php( tbl_en_entree , les_options ){
        let t='';
        let obj=null;
        let indice_de_debut=0;
        this.#tb=tbl_en_entree;
        this.#l02=tbl_en_entree.length;
        if(les_options.hasOwnProperty( 'indice_de_debut' )){
            indice_de_debut=les_options.indice_de_debut;
        }
        obj=this.#rev_php1( indice_de_debut , 0 , {} );
        if(obj.__xst === __xsu){
            obj.__xva=obj.__xva.replace( /\<\?php\r\n\?\>/g , '' );
            obj.__xva=obj.__xva.replace( /\<\?php\n\?\>/g , '' );
            obj.__xva=obj.__xva.replace( /\<\?php\r?\>/g , '' );
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
            return(this.#rev_php_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
        }
    }
    /*
      =============================================================================================================
      point d'entrée : convertion du texte au format rev vers un texte format php
      =============================================================================================================
    */
    c_rev_vers_php( source_rev , les_options ){
        let t='';
        let obj=null;
        /*
          obj=__m_rev1.txt_en_tableau(source_rev);
          obj=functionToArray2(obj.__xva,true,false,'');
        */
        obj=__m_rev1.rev_tm( source_rev );
        if(obj.__xst === __xsu){
            this.#tb=obj.__xva;
            this.#l02=obj.__xva.length;
            obj=this.#rev_php1( 0 , 0 , {} );
            if(obj.__xst === __xsu){
                obj.__xva=obj.__xva.replace( /\<\?php\r\n\?\>/g , '' );
                obj.__xva=obj.__xva.replace( /\<\?php\n\?\>/g , '' );
                obj.__xva=obj.__xva.replace( /\<\?php\r?\>/g , '' );
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
                return(this.#rev_php_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
            }
        }else{
            return(this.#rev_php_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} ));
        }
    }
}
export{c_rev_vers_php1 as c_rev_vers_php1};