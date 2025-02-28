"use strict";
/*
  =====================================================================================================================
  conversion de rev en js
  point d'entrée = c_rev_vers_js
  =====================================================================================================================
*/
class c_rev_vers_js1{
    #nom_de_la_variable='';
    #tb=[];
    #l02=0;
    #tbleau_precedences_js={
        "" : {"priorite" : 0 ,"operateur" : '' ,"operandes" : '1' ,"commentaire" : 'parenthèse !'} ,
        "nouveau" : {"priorite" : 3 ,"operateur" : 'new ' ,"operandes" : '1' ,"commentaire" : ''} ,
        "chainé" : {"priorite" : 4 ,"operateur" : '?.' ,"operandes" : '2' ,"commentaire" : ''} ,
        "clone" : {"priorite" : 5 ,"operateur" : 'clone ' ,"operandes" : '1' ,"commentaire" : ''} ,
         /*  */
        "puissance" : {"priorite" : 10 ,"operateur" : '**' ,"operandes" : '2' ,"commentaire" : ''} ,
         /*  */
        "non" : {"priorite" : 15 ,"operateur" : '!' ,"operandes" : '1' ,"commentaire" : ''} ,
        "instance_de" : {"priorite" : 20 ,"operateur" : ' instanceof ' ,"operandes" : '1' ,"commentaire" : ''} ,
        "Typeof" : {"priorite" : 21 ,"operateur" : ' typeof ' ,"operandes" : '1' ,"commentaire" : ''} ,
        "void" : {"priorite" : 22 ,"operateur" : ' void ' ,"operandes" : '1' ,"commentaire" : ''} ,
        "oppose_binaire" : {"priorite" : 22 ,"operateur" : ' ~' ,"operandes" : '1' ,"commentaire" : ''} ,
         /*  */
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
        "decal_droite_non_signe" : {"priorite" : 60 ,"operateur" : '>>>' ,"operandes" : '2' ,"commentaire" : ''} ,
         /*  */
        "concat" : {"priorite" : 70 ,"operateur" : ' + ' ,"operandes" : '2n' ,"commentaire" : ''} ,
         /*  */
        "inf" : {"priorite" : 80 ,"operateur" : ' < ' ,"operandes" : '2' ,"commentaire" : ''} ,
        "infeg" : {"priorite" : 80 ,"operateur" : ' <= ' ,"operandes" : '2' ,"commentaire" : ''} ,
        "sup" : {"priorite" : 80 ,"operateur" : ' > ' ,"operandes" : '2' ,"commentaire" : ''} ,
        "supeg" : {"priorite" : 80 ,"operateur" : ' >= ' ,"operandes" : '2' ,"commentaire" : ''} ,
        "cle_dans_objet" : {"priorite" : 81 ,"operateur" : ' in ' ,"operandes" : '2' ,"commentaire" : ''} ,
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
        "condition" : {"priorite" : 160 ,"operateur" : '' ,"operandes" : '1' ,"commentaire" : ''} ,
         /* "virgule" : {"priorite" : 170 ,"operateur" : ',' ,"operandes" : '2n' ,"commentaire" : ''} */
        };
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
    #rev_js_le( o ){
        if(o.hasOwnProperty( 'id' )){
            try{
                o.plage=[this.#tb[o.id][5],this.#tb[o.id][6]];
                /* o['plage']=[this.#tb[o.id][5],this.#tb[o.id][6]]; */
            }catch(e){}
        }
        __m_rev1.empiler_erreur( o );
        return o;
    }
    /*
      =============================================================================================================
    */
    #macst_pour_javascript( elt ){
        let r=__m_rev1.ma_constante( elt );
        if(elt[4] === 1 || elt[4] === 3){
            const cr1=new RegExp( '¶' + 'CR' + '¶' , "g" );
            const lf1=new RegExp( '¶' + 'LF' + '¶' , "g" );
            r=r.replace( lf1 , '\\n' ).replace( cr1 , '\\r' );
        }
        return r;
    }
    /*
      =============================================================================================================
      conversion pour les enfants de id de la racine
      =============================================================================================================
    */
    #rev_js1( id , niveau , opt ){
        /* term_final : false , retour_ligne : false , separateur : ',' , dans_initialisation : true */
        if(this.#l02 <= 1){
            return({"__xst" : __xsu ,"__xva" : ''});
        }
        let t='';
        let obj=null;
        let les_cas=[];
        let i=0;
        let j=0;
        let terminateur=';';
        let retour_ligne=true;
        let dans_initialisation=false;
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
                t+=this.#macst_pour_javascript( this.#tb[i] );
            }else{
                switch (this.#tb[i][1]){
                    case "directive" :
                        if(this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                            t+=this.#macst_pour_javascript( this.#tb[i + 1] );
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' un seul argument'} ));
                        }
                        break;
                        
                    case 'identifiant' :
                        if(this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                            t+=this.#macst_pour_javascript( this.#tb[i + 1] );
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' "' + this.#tb[i][1] + '" doit avoir un seul paramètre '} ));
                        }
                        break;
                        
                    case 'break' : 
                    case 'continue' : 
                    case 'useStrict' : 
                    case 'debugger' :
                        if('useStrict' === this.#tb[i][1]){
                            t+='"use strict"';
                        }else{
                            if(this.#tb[i][8] === 0){
                                t+=this.#tb[i][1] + '';
                            }else if(this.#tb[i][8] === 1 && this.#tb[i][1] === 'break' && this.#tb[i + 1][2] === 'c'){
                                t+=this.#tb[i][1] + ' ' + this.#tb[i + 1][1];
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' doit être sous le format ' + this.tb[i][1] + '() strictement'} ));
                            }
                        }
                        break;
                        
                    case 'revenir' :
                        if(this.#tb[i][8] === 0){
                            t+='return';
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' ne doit pas avoir de paramètre'} ));
                        }
                        break;
                        
                    case 'retourner' :
                        if(this.#tb[i][8] === 0){
                            t+='return';
                        }else{
                            var contenu_retour='';
                            var constante_simple=true;
                            for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                                if(this.#tb[j][2] === 'c'){
                                    contenu_retour+=this.#macst_pour_javascript( this.#tb[j] );
                                }else{
                                    obj=this.#js_traiteInstruction1( niveau + 1 , j , {} );
                                    if(obj.__xst === __xsu){
                                        contenu_retour+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + 'retourner '} ));
                                    }
                                    constante_simple=false;
                                }
                            }
                            if(contenu_retour.substr( contenu_retour.length - 1 , 1 ) === ';'){
                                contenu_retour=contenu_retour.substr( 0 , contenu_retour.length - 1 );
                            }
                            if(constante_simple === true){
                                t+='return ' + contenu_retour + '';
                            }else{
                                t+='return(' + contenu_retour + ')';
                            }
                        }
                        break;
                        
                    case 'appelf' :
                        obj=this.#js_traiteAppelFonction( i , true , niveau + 1 , false , '' );
                        if(obj.__xst === __xsu){
                            if(obj.hasOwnProperty( 'arguments_a_ajouter_au_retour' ) && obj.arguments_a_ajouter_au_retour !== ''){
                                if(obj.__xva.substr( obj.__xva.length - 1 , 1 ) === ';'){
                                    obj.__xva=obj.__xva.substr( 0 , obj.__xva.length - 1 );
                                }
                                t+=obj.__xva + obj.arguments_a_ajouter_au_retour;
                            }else{
                                t+=obj.__xva;
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'il faut un nom de fonction à appeler n(xxxx)'} ));
                        }
                        break;
                        
                    case 'cascade' :
                        obj=this.#rev_js1( i , niveau , {} );
                        if(obj.__xst === __xsu){
                            if(obj.__xva.length > 0){
                                t+=obj.__xva.substr( 0 , obj.__xva.length - 1 );
                            }else{
                                t+=obj.__xva;
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'cascade'} ));
                        }
                        break;
                        
                    case 'boucle_sur_objet_dans' :
                        les_cas=[];
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'pourChaque'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === 'faire'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else{
                                return(this.#rev_js_le( {
                                        "__xst" : __xer ,
                                        "id" : i ,
                                        "__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'la syntaxe est boucle_sur_objet_dans(pourChaque(dans(a , b)),faire())'
                                    } ));
                            }
                        }
                        var pourChaque='';
                        var faire='';
                        for( j=0 ; j < les_cas.length ; j=j + 1 ){
                            if(les_cas[j][1] === 'pourChaque'){
                                obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {"term_final" : false} );
                                if(obj.__xst === __xsu){
                                    pourChaque+=obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                }
                            }else if(les_cas[j][1] === 'faire'){
                                if(this.#tb[les_cas[j][0]][8] === 0){
                                    faire+='';
                                }else{
                                    obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        faire+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }
                        }
                        t+='for(';
                        t+=pourChaque;
                        t+='){';
                        t+=un_espace_p1;
                        t+=faire;
                        t+=un_espace_p0;
                        t+='}';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'boucle_sur_objet_de' :
                        var pourChaque='';
                        var faire='';
                        les_cas=[];
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'pourChaque'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === 'faire'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'syntaxe = boucle_sur_objet_dans(pourChaque(dans(a , b)),faire())'} ));
                            }
                        }
                        for( j=0 ; j < les_cas.length ; j=j + 1 ){
                            if(les_cas[j][1] === 'pourChaque'){
                                obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {"term_final" : false} );
                                if(obj.__xst === __xsu){
                                    pourChaque+=obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                }
                            }else if(les_cas[j][1] === 'faire'){
                                if(this.#tb[les_cas[j][0]][8] === 0){
                                    faire+='';
                                }else{
                                    obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        faire+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'faire'} ));
                                    }
                                }
                            }
                        }
                        t+='for(';
                        t+=pourChaque;
                        t+='){';
                        t+=un_espace_p1;
                        t+=faire;
                        t+=un_espace_p0;
                        t+='}';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'bascule' :
                        var valeurQuand='';
                        var valeursCase='';
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][7] === i){
                                if(this.#tb[j][1] === 'quand' && this.#tb[j][2] === 'f'){
                                    if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                                        valeurQuand=this.#tb[j + 1][1];
                                    }else{
                                        obj=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                                        if(obj.__xst === __xsu){
                                            valeurQuand=obj.__xva;
                                        }else{
                                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                        }
                                    }
                                }else if(this.#tb[j][1] === 'est'){
                                    var valeurCas='';
                                    var InstructionsCas='';
                                    var k=j + 1;
                                    for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                        if(this.#tb[k][1] === 'valeurNonPrevue' && this.#tb[k][2] === 'f' && this.#tb[k][8] === 0){
                                            valeurCas=null;
                                        }else if(this.#tb[k][1] === 'valeur' && this.#tb[k][2] === 'f'){
                                            if(this.#tb[k + 1][2] === 'f'){
                                                obj=this.#js_traiteInstruction1( niveau , k + 1 , {} );
                                                if(obj.__xst === __xsu){
                                                    valeurCas=obj.__xva;
                                                }else{
                                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : ind ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                                }
                                            }else{
                                                valeurCas=this.#macst_pour_javascript( this.#tb[k + 1] ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
                                            }
                                        }else if(this.#tb[k][1] === 'faire' && this.#tb[k][2] === 'f'){
                                            if(this.#tb[k][8] >= 1){
                                                niveau+=2;
                                                obj=this.#rev_js1( k , niveau , {} );
                                                niveau-=2;
                                                if(obj.__xst === __xsu){
                                                    InstructionsCas=__m_rev1.resps( niveau + 2 ) + obj.__xva;
                                                }else{
                                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : k ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                                }
                                            }else{
                                                InstructionsCas='';
                                            }
                                        }else{
                                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                        }
                                    }
                                    valeursCase+=__m_rev1.resps( niveau + 1 );
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
                                        valeursCase+=__m_rev1.resps( niveau + 2 );
                                    }
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                }
                            }
                        }
                        t+='switch (' + valeurQuand + '){';
                        t+=valeursCase;
                        t+=un_espace_p0;
                        t+='}';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'faire_tant_que' :
                        les_cas=[];
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'condition'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === 'instructions'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'syntaxe=faire_tant_que(instructions(),conditions())'} ));
                            }
                        }
                        var condition='';
                        var instructions='';
                        for( j=0 ; j < les_cas.length ; j=j + 1 ){
                            if(les_cas[j][1] === 'condition'){
                                if(this.#tb[les_cas[j][0] + 1][8] >= 5){
                                    obj=this.#TraiteOperations2( les_cas[j][0] , niveau + 1 , 0 , true );
                                    if(obj.__xst === __xsu){
                                        condition+=obj.__xva + un_espace_p0;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }else{
                                    obj=this.#TraiteOperations2( les_cas[j][0] , niveau + 1 , 0 , false );
                                    if(obj.__xst === __xsu){
                                        if(obj.__xva.length >= 120){
                                            obj=this.#TraiteOperations2( les_cas[j][0] , niveau + 1 , 0 , true );
                                            condition+=obj.__xva + un_espace_p0;
                                        }else{
                                            condition+=obj.__xva;
                                        }
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }else if(les_cas[j][1] === 'instructions'){
                                if(this.#tb[les_cas[j][0]][8] === 0){
                                    /* pas d'enfants, ne rien faire ! */
                                }else{
                                    obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        instructions+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }
                        }
                        t+='do{' + un_espace_p1 + instructions + un_espace_p0 + '}while(' + condition + ')';
                        break;
                        
                    case 'tantQue' :
                        les_cas=[];
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'condition'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === 'faire'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        var condition='';
                        var faire='';
                        for( j=0 ; j < les_cas.length ; j=j + 1 ){
                            if(les_cas[j][1] === 'condition'){
                                if(this.#tb[les_cas[j][0] + 1][8] >= 5){
                                    obj=this.#TraiteOperations2( les_cas[j][0] , niveau + 1 , 0 , true );
                                    if(obj.__xst === __xsu){
                                        condition+=obj.__xva + un_espace_p0;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }else{
                                    obj=this.#TraiteOperations2( les_cas[j][0] , niveau + 1 , 0 , false );
                                    if(obj.__xst === __xsu){
                                        if(obj.__xva.length >= 120){
                                            obj=this.#TraiteOperations2( les_cas[j][0] , niveau + 1 , 0 , true );
                                            condition+=obj.__xva + un_espace_p0;
                                        }else{
                                            condition+=obj.__xva;
                                        }
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }else if(les_cas[j][1] === 'faire'){
                                if(this.#tb[les_cas[j][0]][8] === 0){
                                    /* pas d'enfants, ne rien faire ! */
                                }else{
                                    obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        faire+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }
                        }
                        t+='while(' + condition + '){';
                        t+=un_espace_p1;
                        t+=faire;
                        t+=un_espace_p0;
                        t+='}';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'boucle' :
                        les_cas=[];
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'condition'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === 'initialisation'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === 'increment'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === 'faire'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                                les_cas.push( [j,this.#tb[j][1],i] );
                            }else{
                                return(this.#rev_js_le( {
                                        "__xst" : __xer ,
                                        "id" : id ,
                                        "__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'syntaxe = boucle(condition(),initialisation(),increment(),faire())'
                                    } ));
                            }
                        }
                        var initialisation='';
                        var condition='';
                        var increment='';
                        var faire='';
                        for( j=0 ; j < les_cas.length ; j++ ){
                            if(les_cas[j][1] === 'initialisation'){
                                if(this.#tb[les_cas[j][0]][8] === 0){
                                    initialisation='';
                                }else{
                                    obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {"term_final" : false ,"retour_ligne" : false ,"separateur" : ',' ,"dans_initialisation" : true} );
                                    if(obj.__xst === __xsu){
                                        initialisation+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }else if(les_cas[j][1] === 'condition'){
                                if(this.#tb[les_cas[j][0]][8] === 0){
                                    condition='';
                                }else{
                                    obj=this.#TraiteOperations2( les_cas[j][0] , niveau + 1 , 0 , false );
                                    if(obj.__xst === __xsu){
                                        condition+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }else if(les_cas[j][1] === 'increment'){
                                if(this.#tb[les_cas[j][0]][8] === 0){
                                    increment='';
                                }else{
                                    obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {"term_final" : false ,"retour_ligne" : false ,"separateur" : ',' ,"dans_initialisation" : true} );
                                    if(obj.__xst === __xsu){
                                        increment+=obj.__xva;
                                        if(increment.substr( increment.length - 1 , 1 ) === ';'){
                                            increment=increment.substr( 0 , increment.length - 1 );
                                        }
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }else if(les_cas[j][1] === 'faire'){
                                if(this.#tb[les_cas[j][0]][8] === 0){
                                    /* pas d'enfants, ne rien faire ! */
                                }else{
                                    obj=this.#rev_js1( les_cas[j][0] , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        faire+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }
                        }
                        if(condition === '()'){
                            condition='';
                        }
                        t+='for( ' + initialisation + ' ; ' + condition + ' ; ' + increment + ' ){';
                        t+=un_espace_p1;
                        t+=faire;
                        t+=un_espace_p0;
                        t+='}';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'essayer' :
                        var contenu='';
                        var sierreur='';
                        var nomErreur='';
                        var finalement='';
                        var contenu_catch_est_vide=true;
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'faire' && this.#tb[j][2] === 'f'){
                                if(this.#tb[j][8] > 0){
                                    obj=this.#rev_js1( j , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        contenu+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }else if(this.#tb[j][1] === 'sierreur' && this.#tb[j][2] === 'f'){
                                if(this.#tb[j][8] === 0){
                                }else if(this.#tb[j][8] === 2){
                                    if(this.#tb[j + 1][2] === 'c' || ( this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === 'null' && this.#tb[j + 2][8] === 0 ) ){
                                        nomErreur=this.#tb[j + 1][1];
                                        if(this.#tb[j + 2][1] === 'faire' && this.#tb[j + 2][2] === 'f'){
                                            if(this.#tb[j + 2][8] === 0){
                                                sierreur+= nomErreur === 'null' ? ' catch {}' : 'catch('+nomErreur+'){}'  ;
                                            }else{
                                                obj=this.#rev_js1( j + 2 , niveau + 1 , {} );
                                                if(obj.__xst === __xsu){
                                                    sierreur+='catch(' + nomErreur + '){' + un_espace_p1 + obj.__xva + un_espace_p0 + '}';
                                                    contenu_catch_est_vide=false;
                                                }else{
                                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'sierreur'} ));
                                                }
                                            }
                                        }else{
                                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'sierreur le deuxième argument doit être "faire"'} ));
                                        }
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'sierreur le premier argument doit être une variable'} ));
                                    }
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'sierreur doit contenir 2 arguments sierreur(e,faire())'} ));
                                }
                            }else if(this.#tb[j][1] === 'finalement' && this.#tb[j][2] === 'f'){
                                obj=this.#rev_js1( j , niveau + 1 , {} );
                                if(obj.__xst === __xsu){
                                    if(contenu_catch_est_vide === true){
                                        finalement+=un_espace_p0;
                                    }
                                    finalement+='finally{' + un_espace_p1 + obj.__xva + un_espace_p0 + '}';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'finalement'} ));
                                }
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        t+='try{';
                        t+=un_espace_p1;
                        t+=contenu;
                        t+=un_espace_p0;
                        t+='}';
                        t+=sierreur;
                        t+=finalement;
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'choix' :
                        les_cas=[];
                        var aDesSinonSi=false;
                        var aUnSinon=false;
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'si'){
                                les_cas.push( [j,this.#tb[j][1],0,this.#tb[j],0] );
                                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'alors'){
                                        les_cas[les_cas.length - 1][2]=k;
                                        les_cas[les_cas.length - 1][4]=this.#tb[k][8];
                                        break;
                                    }
                                }
                            }else if(this.#tb[j][1] === 'sinonsi'){
                                aDesSinonSi=true;
                                les_cas.push( [j,this.#tb[j][1],0,this.#tb[j],0] );
                                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'alors'){
                                        les_cas[les_cas.length - 1][2]=k;
                                        les_cas[les_cas.length - 1][4]=this.#tb[k][8];
                                        break;
                                    }
                                }
                            }else if(this.#tb[j][1] === 'sinon'){
                                aUnSinon=true;
                                les_cas.push( [j,this.#tb[j][1],0,this.#tb[j],0] );
                                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'alors'){
                                        les_cas[les_cas.length - 1][2]=k;
                                        les_cas[les_cas.length - 1][4]=this.#tb[k][8];
                                        break;
                                    }
                                }
                            }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                                les_cas.push( [j,this.#tb[j][1],0,this.#tb[j]] );
                            }else{
                                return(this.#rev_js_le( {
                                        "__xst" : __xer ,
                                        "id" : id ,
                                        "__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'syntaxe = choix(si(condition(),alors()),sinonsi(condition(),alors()),sinon(alors()))'
                                    } ));
                            }
                        }
                        for( j=0 ; j < les_cas.length ; j=j + 1 ){
                            if(les_cas[j][1] === '#'){
                                var niveauSi=niveau + 2;
                                var k=j + 1;
                                for( k=j + 1 ; k < les_cas.length ; k=k + 1 ){
                                    if(les_cas[k][1] === 'si'){
                                        niveauSi=niveau + 1;
                                        break;
                                    }
                                }
                                if(this.#tb[les_cas[j][0]][13].indexOf( '\n' ) >= 0){
                                    t+=__m_rev1.resps( niveauSi );
                                }
                                var commt=__m_rev1.tr_co_src( this.#tb[les_cas[j][0]][13] , niveauSi , les_cas[j][0] );
                                t+='/*' + commt + '*/';
                                if(this.#tb[j][13].indexOf( '\n' ) >= 0){
                                    t+=__m_rev1.resps( niveauSi );
                                }
                            }else if(les_cas[j][1] === 'si'){
                                var les_comts=[];
                                var debutCondition=0;
                                var k=i + 1;
                                for( k=les_cas[j][0] + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'condition'){
                                        debutCondition=k;
                                        break;
                                    }else if(this.#tb[k][1] === '#' && this.#tb[k][2] === 'f'){
                                        les_comts.push( this.#tb[k][13] );
                                    }
                                }
                                if(debutCondition === 0){
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition est manquante dans un si'} ));
                                }
                                for( k=0 ; k < les_comts.length ; k=k + 1 ){
                                    if(les_comts[k].indexOf( '\n' ) >= 0){
                                        t+=__m_rev1.resps( niveau + 1 );
                                    }
                                    var commt=__m_rev1.tr_co_src( les_comts[k] , niveau + 1 , les_cas[j][0] );
                                    t+='/*' + commt + '*/';
                                    if(les_comts[k].indexOf( '\n' ) >= 0){
                                        t+=__m_rev1.resps( niveau + 1 );
                                    }
                                }
                                t+='if(';
                                if(this.#tb[debutCondition + 1][8] >= 5){
                                    obj=this.#TraiteOperations2( debutCondition , niveau + 1 , 0 , true );
                                    if(obj.__xst === __xsu){
                                        t+=obj.__xva;
                                        t+=un_espace_p0 + '){';
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' condition '} ));
                                    }
                                }else{
                                    obj=this.#TraiteOperations2( debutCondition , niveau + 1 , 0 , false );
                                    if(obj.__xst === __xsu){
                                        if(obj.__xva.length > 120){
                                            obj=this.#TraiteOperations2( debutCondition , niveau + 1 , 0 , true );
                                            t+=obj.__xva;
                                            t+=un_espace_p0 + '){';
                                        }else{
                                            t+=obj.__xva;
                                            t+='){';
                                        }
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'condition'} ));
                                    }
                                }
                                if(les_cas[j][2] > 0 && les_cas[j][4] > 0){
                                    obj=this.#rev_js1( les_cas[j][2] , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        t+=un_espace_p1;
                                        t+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                                if(aDesSinonSi){
                                }else{
                                    if(aUnSinon){
                                    }else{
                                        t+=un_espace_p0;
                                        t+='}';
                                    }
                                }
                            }else if(les_cas[j][1] === 'sinonsi'){
                                var les_comts=[];
                                var debutCondition=0;
                                for( k=les_cas[j][0] + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][1] === 'condition'){
                                        debutCondition=k;
                                        break;
                                    }else if(this.#tb[k][1] === '#' && this.#tb[k][2] === 'f'){
                                        les_comts.push( this.#tb[k][13] );
                                    }
                                }
                                if(debutCondition === 0){
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'condition manquante dans le sinon'} ));
                                }
                                for( k=0 ; k < les_comts.length ; k=k + 1 ){
                                    if(les_comts[k].indexOf( '\n' ) >= 0){
                                        t+=__m_rev1.resps( niveau + 1 );
                                    }
                                    var commt=__m_rev1.tr_co_src( les_comts[k] , niveau + 1 , les_cas[j][0] );
                                    t+='/*' + commt + '*/';
                                    if(les_comts[k].indexOf( '\n' ) >= 0){
                                        t+=__m_rev1.resps( niveau + 1 );
                                    }
                                }
                                t+=un_espace_p0;
                                t+='}else if(';
                                if(this.#tb[debutCondition + 1][8] >= 5){
                                    obj=this.#TraiteOperations2( debutCondition , niveau + 1 , 0 , true );
                                    if(obj.__xst === __xsu){
                                        t+=obj.__xva;
                                        t+=un_espace_p0 + '){';
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'sinonsi '} ));
                                    }
                                }else{
                                    obj=this.#TraiteOperations2( debutCondition , niveau + 1 , 0 , false );
                                    if(obj.__xst === __xsu){
                                        if(obj.__xva.length > 120){
                                            obj=this.#TraiteOperations2( debutCondition , niveau + 1 , 0 , true );
                                            t+=obj.__xva;
                                            t+=un_espace_p0 + '){';
                                        }else{
                                            t+=obj.__xva + '){';
                                        }
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + 'sinonsi '} ));
                                    }
                                }
                                /* contenu du else if */
                                if(les_cas[j][2] > 0 && les_cas[j][4] > 0){
                                    obj=this.#rev_js1( les_cas[j][2] , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        t+=un_espace_p1;
                                        t+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                                if(aUnSinon){
                                }else{
                                    if(j === les_cas.length - 1){
                                        t+=un_espace_p0;
                                        t+='}';
                                    }
                                }
                            }else{
                                t+=un_espace_p0;
                                t+='}else{';
                                if(les_cas[j][2] > 0 && les_cas[j][4] > 0){
                                    obj=this.#rev_js1( les_cas[j][2] , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        t+=un_espace_p1;
                                        t+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : les_cas[j][0] ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                                t+=un_espace_p0;
                                t+='}';
                            }
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'affecte' : 
                    case 'dans' : 
                    case 'de' : 
                    case 'affectop' :
                        obj=this.#js_traite_affecte( i , niveau , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'declare' : 
                    case 'declare_constante' : 
                    case 'declare_variable' : 
                    case 'variable_privée' : 
                    case 'variable_publique' :
                        var les_declarations=[];
                        var le_commentaire='';
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                                le_commentaire='/*' + __m_rev1.tr_co_src( this.#tb[j][13] , niveau , j ) + '*/' + __m_rev1.resps( niveau );
                            }else{
                                les_declarations.push( this.#tb[j] );
                            }
                        }
                        if(les_declarations.length === 2){
                            var prefixe_declaration='var ';
                            if("declare" === this.#tb[i][1]){
                                prefixe_declaration='var ';
                            }else if("declare_constante" === this.#tb[i][1]){
                                prefixe_declaration='const ';
                            }else if("declare_variable" === this.#tb[i][1]){
                                prefixe_declaration='let ';
                            }else if("variable_privée" === this.#tb[i][1]){
                                prefixe_declaration='#';
                            }else if("variable_publique" === this.#tb[i][1]){
                                prefixe_declaration='';
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' prefixe  inconnu'} ));
                            }
                            var debut='';
                            var debut2='';
                            obj=this.#js_traiteInstruction1( niveau , les_declarations[0][0] , {} );
                            if(obj.__xst === __xsu){
                                debut=le_commentaire + prefixe_declaration + obj.__xva;
                                debut2=le_commentaire + obj.__xva;
                            }else{
                                this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} );
                            }
                            obj=this.#js_traiteInstruction1( niveau , les_declarations[1][0] , {} );
                            if(obj.__xst === __xsu){
                                if(dans_initialisation === true && t !== ''){
                                    if(obj.__xva === ''){
                                        t+=debut2;
                                    }else{
                                        t+=debut2 + '=' + obj.__xva;
                                    }
                                }else{
                                    if(obj.__xva === ''){
                                        t+=debut;
                                    }else{
                                        t+=debut + '=' + obj.__xva;
                                    }
                                }
                            }else{
                                this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} );
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : (__m_rev1.nl2() + this.#tb[i][1]) + ' declare  doit avoir 2 paramètres'} ));
                        }
                        break;
                        
                    case '#' :
                        var commt=__m_rev1.tr_co_src( this.#tb[i][13] , niveau , i );
                        t+='/*' + commt + '*/';
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'postinc' : 
                    case 'postdec' : 
                    case 'preinc' : 
                    case 'predec' :
                        var valeur='';
                        if(this.#tb[i + 1][2] === 'c' && this.#tb[i][8] === 1){
                            valeur=this.#tb[i + 1][1];
                        }else{
                            obj=this.#js_traiteInstruction1( niveau , i + 1 , {} );
                            if(obj.__xst === __xsu){
                                valeur=obj.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        if(this.#tb[i][1] === 'preinc'){
                            t+='++';
                        }else if(this.#tb[i][1] === 'predec'){
                            t+='--';
                        }
                        /* on met la valeur */
                        t+=valeur;
                        if(this.#tb[i][1] === 'postinc'){
                            t+='++';
                        }else if(this.#tb[i][1] === 'postdec'){
                            t+='--';
                        }
                        break;
                        
                    case 'throw' :
                        /* todo trouver un mot pour throw */
                        if(this.#tb[i + 1][1] === 'new'){
                            obj=this.#js_traite_new( i + 1 , niveau , {} );
                            if(obj.__xst === __xsu){
                                t+='throw ' + obj.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                            if(this.#tb[i + 1][8] === 1 && this.#tb[i + 2][1] === 'appelf'){
                                obj=this.#js_traiteAppelFonction( i + 2 , true , niveau , false , '' );
                            }
                        }else if('testEnLigne' === this.#tb[i + 1][1] && this.#tb[i + 1][2] === 'f'){
                            obj=this.#js_traiteInstruction1( niveau , i + 1 , {} );
                            if(obj.__xst === __xsu){
                                t+='throw ' + obj.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }else if(this.#tb[i + 1][1] === 'virgule' && this.#tb[i + 1][2] === 'f'){
                            /* huguesobjOperation=this.#TraiteOperations2(i + 1,niveau,0,false); */
                            objOperation=this.#js_traiteInstruction1( niveau , i + 1 , {} );
                            if(objOperation.__xst === __xsu){
                                t+='throw ' + objOperation.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }else if(this.#tb[i + 1][1] === 'appelf' && this.#tb[i + 1][2] === 'f'){
                            obj=this.#js_traiteAppelFonction( i + 1 , true , niveau , false , '' );
                            if(obj.__xst === __xsu){
                                t+='throw ' + obj.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }else if(this.#tb[i + 1][2] === 'c'){
                            t+='throw ' + this.#macst_pour_javascript( this.#tb[i + 1] );
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'supprimer' :
                        if(this.#tb[i + 1][8] === 0 && this.#tb[i + 1][2] === 'c'){
                            t+='delete ' + this.#tb[i + 1][1];
                        }else{
                            obj=this.#js_traiteInstruction1( niveau , i + 1 , {} );
                            if(obj.__xst === __xsu){
                                t+='delete ' + obj.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                            }
                        }
                        break;
                        
                    case 'new' :
                        obj=this.#js_traite_new( i , niveau , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'defTab' :
                        obj=this.#js_traiteDefinitiontableau( i , niveau , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'void' :
                        obj=this.#js_traiteInstruction1( niveau , i + 1 , {} );
                        if(obj.__xst === __xsu){
                            t+='void(' + obj.__xva + ')';
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'inf' : 
                    case 'sup' : 
                    case 'egalstricte' : 
                    case 'testEnLigne' : 
                    case 'condition' :
                        obj=this.#js_traiteInstruction1( niveau , i , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case 'fonction' : 
                    case 'méthode' : 
                    case "definition_de_classe" :
                        obj=this.#js_traiteInstruction1( niveau , i , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case 'exporter_par_defaut' : 
                    case 'exporter' :
                        if(this.#tb[i][8] === 1 && "nom_de_classe" === this.#tb[i + 1][1] && this.#tb[i + 1][8] === 1){
                            t+='export{' + this.#tb[i + 2][1] + '}';
                        }else{
                            var nom_de_classe='';
                            var valeur='';
                            var locale='';
                            for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                                if(this.#tb[j][2] === 'c'){
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                }
                                if(this.#tb[j][1] === 'nom_de_classe' && this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                                    nom_de_classe=this.#macst_pour_javascript( this.#tb[j + 1] );
                                }else if(this.#tb[j][1] === 'valeur'){
                                    valeur=' ' + this.#macst_pour_javascript( this.#tb[j + 1] );
                                }else if(this.#tb[j][1] === 'locale'){
                                    locale=this.#macst_pour_javascript( this.#tb[j + 1] ) + ' as ';
                                }else if(this.#tb[j][1] === '#'){
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                }
                            }
                            if(this.#tb[i][1] === 'exporter_par_defaut'){
                                t+='export default ' + valeur;
                            }else{
                                t+='export{' + locale + nom_de_classe + valeur + '}';
                            }
                        }
                        break;
                        
                    case "non" :
                        /*
                          dans le cas d'un !function(){} !!! si si , ça existe !!!
                        */
                        obj=this.#js_traiteInstruction1( niveau , i , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case "obj" :
                        obj=this.#js_traiteDefinitionObjet( i , niveau , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case "etiquette" :
                        var nom_etiquette='';
                        var contenu_etiquette='';
                        for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][2] === 'c'){
                                nom_etiquette=this.#tb[j][1];
                            }else if(this.#tb[j][1] === 'contenu' && this.#tb[j][2] === 'f'){
                                if(this.#tb[j][8] > 0){
                                    obj=this.#rev_js1( j , niveau + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        contenu_etiquette+=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                                    }
                                }
                            }
                        }
                        if(nom_etiquette !== ''){
                            t+=nom_etiquette + ':' + un_espace_p1 + contenu_etiquette;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        ne_pas_mettre_de_terminateur=true;
                        break;
                        
                    case "importer" :
                        obj=this.#js_traite_import( i , niveau , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    case "" :
                        /* un bloc, ça arrive de temps en temps */
                        obj=this.#rev_js1( i , niveau + 1 , {} );
                        if(obj.__xst === __xsu){
                            t+='{' + un_espace_p1 + obj.__xva + un_espace_p0 + '}';
                            ne_pas_mettre_de_terminateur=true;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
                    default:
                        /* en dernier lieu, on teste une instruction */
                        var objOperation=this.#js_traiteInstruction1( niveau + 1 , i , {} );
                        if(objOperation.__xst === __xsu){
                            t+=objOperation.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[i][1]} ));
                        }
                        break;
                        
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
    #js_traiteInstruction1( niveau , id , opt ){
        var t='';
        if(this.#tb[id][2] === 'c'){
            t+=this.#macst_pour_javascript( this.#tb[id] );
        }else{
            /* c'est une fonction */
            switch (this.#tb[id][1]){
                case '#' :
                    t+='/*' + __m_rev1.tr_co_src( this.#tb[id][13] , niveau + 1 , id ) + '*/';
                    break;
                    
                case 'appelf' :
                    var obj=this.#js_traiteAppelFonction( this.#tb[id][0] , true , niveau , false , '' );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'defTab' :
                    var obj=this.#js_traiteDefinitiontableau( id , niveau , {} );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'tableau' :
                    var objtableau=this.#js_traitetableau1( id , niveau , {} );
                    if(objtableau.__xst === __xsu){
                        t+=objtableau.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'testEnLigne' :
                    var si_faux='';
                    var si_vrai='';
                    var testlignecondition='';
                    var un_trop_long=false;
                    var j=id + 1;
                    for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][1] === 'condition'){
                            var objCondition=this.#TraiteOperations2( j , niveau + 1 , 0 , false );
                            if(objCondition.__xst === __xsu){
                                testlignecondition=objCondition.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }else if(this.#tb[j][1] === 'siVrai'){
                            var obj_si=this.#rev_js1( j , niveau + 1 , {"retour_ligne" : false ,"term_final" : false} );
                            if(obj_si.__xst === __xsu){
                                if(obj_si.__xva.length > 50){
                                    if(obj_si.__xva.indexOf( '\n' ) < 0){
                                        var obj_si=this.#rev_js1( j , niveau + 1 , {"retour_ligne" : true ,"term_final" : false} );
                                    }
                                    un_trop_long=true;
                                }
                                if(si_vrai !== ''){
                                    si_vrai+=' , ';
                                }
                                si_vrai+=obj_si.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }else if(this.#tb[j][1] === 'siFaux'){
                            var obj_si=this.#rev_js1( j , niveau + 1 , {"retour_ligne" : true ,"term_final" : false} );
                            if(obj_si.__xst === __xsu){
                                if(obj_si.__xva.length > 50){
                                    if(obj_si.__xva.indexOf( '\n' ) < 0){
                                        var obj_si=this.#rev_js1( j , niveau + 1 , {"retour_ligne" : true ,"term_final" : false} );
                                    }
                                    un_trop_long=true;
                                }
                                if(si_faux !== ''){
                                    si_faux+=' , ';
                                }
                                si_faux+=obj_si.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : (__m_rev1.nl2() + this.#tb[id][1]) + 'la syntaxe =testEnLigne(condition(),siVrai(),siFaux())'} ));
                        }
                    }
                    if(un_trop_long === true){
                        t=testlignecondition + ' ?' + __m_rev1.resps( niveau ) + '  ( ' + __m_rev1.resps( niveau + 1 ) + si_vrai + __m_rev1.resps( niveau ) + '  ) : ( ' + __m_rev1.resps( niveau + 1 ) + si_faux + __m_rev1.resps( niveau ) + '  )';
                    }else{
                        t=testlignecondition + ' ? ( ' + si_vrai + ' ) : ( ' + si_faux + ' )';
                    }
                    break;
                    
                case 'obj' :
                    var obj=this.#js_traiteDefinitionObjet( id , niveau , {} );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'new' :
                    var obj=this.#js_traite_new( id , niveau , {} );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'definition_de_classe' :
                    var obj=this.#js_traiteDefinitionClasse( id , niveau , {} );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'declare' :
                    if(this.#tb[this.#tb[id][7]][1] === 'dans' || this.#tb[this.#tb[id][7]][1] === 'de'){
                        for( var j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][2] === 'c'){
                                return({"__xst" : __xsu ,"__xva" : 'var ' + this.#macst_pour_javascript( this.#tb[j] )});
                            }
                        }
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'declare_variable' : 
                case 'declare_constante' :
                    var type='';
                    if(this.#tb[id][1] === 'declare_constante'){
                        type='const';
                    }else{
                        type='let';
                    }
                    if(this.#tb[this.#tb[id][7]][1] === 'de'){
                        for( var j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][2] === 'c'){
                                return({"__xst" : __xsu ,"__xva" : type + ' ' + this.#macst_pour_javascript( this.#tb[j] )});
                            }else if(this.#tb[j][2] === 'f'){
                                var objOperation=this.#js_traiteInstruction1( niveau + 1 , j , {} );
                                if(objOperation.__xst === __xsu){
                                    return({"__xst" : __xsu ,"__xva" : type + ' ' + objOperation.__xva});
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                                break;
                            }
                        }
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }else if(this.#tb[this.#tb[id][7]][1] === 'dans'){
                        for( var j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][2] === 'c'){
                                return({"__xst" : __xsu ,"__xva" : type + ' ' + this.#macst_pour_javascript( this.#tb[j] )});
                            }
                        }
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }else{
                        debugger;
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case '' :
                    var obj=this.#rev_js1( id , niveau + 1 , {} );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : (__m_rev1.nl2() + this.#tb[id][1]) + ' bloc'} ));
                    }
                    break;
                    
                case 'null' : t+='';
                    break;
                case 'await' :
                    t+='await ';
                    if(this.#tb[id][8] === 1 && this.#tb[id + 1][2] === 'c'){
                        t+=this.#macst_pour_javascript( this.#tb[id + 1] );
                    }else{
                        obj=this.#js_traiteInstruction1( niveau , id + 1 , {} );
                        if(obj.__xst === __xsu){
                            t+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                        }
                    }
                    break;
                    
                case 'valeur_constante' :
                    /* cas (rare) a=' '.length  trouvé dans htmx => affecte(a , valeur_constante(' ',prop(length) ) ) */
                    var valeur_constante='';
                    var propriete='';
                    for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][2] === 'c'){
                            valeur_constante=this.#macst_pour_javascript( this.#tb[j] );
                        }else{
                            if(this.#tb[j][1] === '#'){
                            }else if(this.#tb[j][1] === 'prop'){
                                obj=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                                if(obj.__xst === __xsu){
                                    propriete+='.' + obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }
                    }
                    t+=valeur_constante + propriete;
                    break;
                    
                case 'postinc' : 
                case 'postdec' : 
                case 'preinc' : 
                case 'predec' :
                    var valeur='';
                    if(this.#tb[id + 1][2] === 'c' && this.#tb[id][8] === 1){
                        valeur=this.#tb[id + 1][1];
                    }else{
                        var obj=this.#js_traiteInstruction1( niveau , id + 1 , {} );
                        if(obj.__xst === __xsu){
                            valeur=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                        }
                    }
                    if(this.#tb[id][1] === 'preinc'){
                        t+='++';
                    }else if(this.#tb[id][1] === 'predec'){
                        t+='--';
                    }
                    /* on met la valeur */
                    t+=valeur;
                    if(this.#tb[id][1] === 'postinc'){
                        t+='++';
                    }else if(this.#tb[id][1] === 'postdec'){
                        t+='--';
                    }
                    break;
                    
                case 'dans' : 
                case 'de' : 
                case 'affectop' : 
                case 'affecte' :
                    var obj=this.#js_traite_affecte( id , niveau , {} );
                    if(obj.__xst === __xsu){
                        t+=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'supprimer' :
                    if(this.#tb[id][8] === 0 && this.#tb[id + 1][2] === 'c'){
                        t+='delete ' + this.#tb[id + 1][1];
                    }else{
                        obj=this.#js_traiteInstruction1( niveau , id + 1 , {} );
                        if(obj.__xst === __xsu){
                            t+='delete ' + obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                        }
                    }
                    break;
                    
                case 'classe' :
                    var contenu='';
                    var etend='';
                    for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][2] === 'c'){
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                        }else{
                            if(this.#tb[j][1] === '#'){
                            }else if(this.#tb[j][1] === 'etend'){
                                obj=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                                if(obj.__xst === __xsu){
                                    etend='extends ' + obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }else if(this.#tb[j][1] === 'contenu'){
                                obj=this.#rev_js1( j , niveau + 1 , {} );
                                if(obj.__xst === __xsu){
                                    contenu=obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }
                    }
                    t+=' class ' + etend + ' {' + contenu + '}';
                    break;
                    
                case 'modèle_annoté' :
                    var contenu='';
                    var le_nom='';
                    var position=0;
                    for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][2] === 'c'){
                            if(position === 0){
                                le_nom=this.#macst_pour_javascript( this.#tb[j] );
                                position++;
                            }else{
                                contenu=this.#macst_pour_javascript( this.#tb[j] );
                            }
                        }else if(this.#tb[j][2] === 'f'){
                            if(this.#tb[j][1] === 'concat' && position > 0){
                                for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][2] === 'c' && this.#tb[k][4] !== 0){
                                        contenu+=this.#tb[k][1].replace( /\\"/g , '"' ).replace( /¶LF¶/g , '\n' ).replace( /¶CR¶/g , '\r' );
                                        /* replace(/\\n/g,'\n'). */
                                    }else if(this.#tb[k][2] === 'c' && this.#tb[k][4] === 0){
                                        contenu+='${' + this.#tb[k][1] + '}';
                                    }else{
                                        obj=this.#js_traiteInstruction1( niveau , k , {} );
                                        if(obj.__xst === __xsu){
                                            contenu+='${' + obj.__xva + '}';
                                        }else{
                                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                        }
                                    }
                                }
                                contenu='`' + contenu + '`';
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                        }
                    }
                    t+=le_nom + contenu;
                    break;
                    
                case 'exporter_declaration' :
                    if(this.#tb[id][8] === 1){
                        obj=this.#js_traiteInstruction1( niveau , id + 1 , {} );
                        if(obj.__xst === __xsu){
                            t+='export ' + obj.__xva + '';
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                        }
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                case 'valeur' :
                    var propriété='';
                    var valeur='';
                    for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                        }else if(this.#tb[j][1] === 'prop' && this.#tb[j][2] === 'f'){
                            obj=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                            if(obj.__xst === __xsu){
                                propriété+='.' + obj.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }else{
                            obj=this.#js_traiteInstruction1( niveau , j , {} );
                            if(obj.__xst === __xsu){
                                valeur+=obj.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }
                    }
                    t+='(' + valeur + ')' + propriété;
                    break;
                    
                case 'céder' :
                    var valeur='';
                    var fnt='';
                    for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                        }else{
                            if(this.#tb[j][1] === 'délégué' && this.#tb[j][2] === 'f'){
                                fnt='yield* ';
                                obj=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                                if(obj.__xst === __xsu){
                                    valeur+=obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }else{
                                fnt='yield ';
                                obj=this.#js_traiteInstruction1( niveau , j , {} );
                                if(obj.__xst === __xsu){
                                    valeur+=obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }
                        }
                    }
                    t+=fnt + valeur;
                    break;
                    
                case 'virgule' :
                    var virgule='';
                    var precedent_est_commentaire=false;
                    for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                            virgule+='/*' + __m_rev1.tr_co_src( this.#tb[j][13] , niveau , j ) + '*/';
                            precedent_est_commentaire=true;
                        }else{
                            obj=this.#js_traiteInstruction1( niveau , j , {} );
                            if(obj.__xst === __xsu){
                                if(virgule !== '' && precedent_est_commentaire === false){
                                    virgule+=',';
                                }
                                virgule+=obj.__xva;
                                precedent_est_commentaire=false;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                            }
                        }
                    }
                    if(virgule.length > 120){
                        virgule='';
                        precedent_est_commentaire=false;
                        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                                virgule+='/*' + __m_rev1.tr_co_src( this.#tb[j][13] , niveau , j ) + '*/';
                                precedent_est_commentaire=true;
                            }else{
                                obj=this.#js_traiteInstruction1( niveau , j , {} );
                                if(obj.__xst === __xsu){
                                    if(virgule !== '' && precedent_est_commentaire === false){
                                        virgule+=',' + __m_rev1.resps( niveau - 1 );
                                    }
                                    virgule+=obj.__xva;
                                    precedent_est_commentaire=false;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }
                        }
                    }
                    t+=virgule;
                    /* debugger; */
                    break;
                    
                case 'fonction' : 
                case 'méthode' :
                    var nomFonction='';
                    var typeFonction='';
                    var modeFonction='';
                    var asynchrone='';
                    var generateur='';
                    var statique='';
                    var positionDeclarationFonction=-1;
                    var positionContenu=-1;
                    var argumentsFonction='';
                    var format_tableau=false;
                    for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                        if(this.#tb[j][1] === 'definition' && this.#tb[j][2] === 'f'){
                            positionDeclarationFonction=j;
                        }else if(this.#tb[j][1] === 'contenu' && this.#tb[j][2] === 'f'){
                            positionContenu=j;
                        }
                    }
                    if(positionDeclarationFonction >= 0 && positionContenu >= 0){
                        for( j=positionDeclarationFonction + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'nom'){
                                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                                    nomFonction=this.#tb[j + 1][1];
                                }else{
                                    obj=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                                    if(obj.__xst === __xsu){
                                        nomFonction=obj.__xva;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                    }
                                }
                            }else if(this.#tb[j][1] === 'asynchrone' && this.#tb[j][2] === 'f'){
                                if(this.#tb[j][8] === 0){
                                    asynchrone='async ';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }else if(this.#tb[j][1] === 'générateur' && this.#tb[j][2] === 'f'){
                                if(this.#tb[j][8] === 0){
                                    generateur='*';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }else if(this.#tb[j][1] === 'mode'){
                                if(this.#tb[j][8] === 1 && this.#tb[j + 1][1] === 'privée'){
                                    modeFonction='#';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                }
                            }else if(this.#tb[j][1] === 'statique'){
                                statique='static ';
                            }else if(this.#tb[j][1] === 'format_tableau'){
                                format_tableau=true;
                            }else if(this.#tb[j][1] === 'type'){
                                if(this.#tb[j][8] === 1 && this.#tb[j + 1][1] === 'lire'){
                                    typeFonction='get ';
                                }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][1] === 'écrire'){
                                    typeFonction='set ';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : (__m_rev1.nl2() + this.#tb[id][1]) + 'type méthode doit être écrire ou lire '} ));
                                }
                            }
                        }
                        argumentsFonction='';
                        var le_commentaire='';
                        for( j=positionDeclarationFonction + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                            if(this.#tb[j][1] === 'argument'){
                                if(this.#tb[j + 1][2] === 'f' && this.#tb[j][1] === '#'){
                                    le_commentaire=' /*' + __m_rev1.tr_co_src( this.#tb[j][13] , niveau , j ) + '*/ ';
                                }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                                    argumentsFonction+=', ' + le_commentaire + this.#tb[j + 1][1] + ' ';
                                    le_commentaire='';
                                }else{
                                    var nom_argument='';
                                    var valeur_par_defaut='';
                                    var commentaire='';
                                    for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                        if(this.#tb[k][2] === 'c'){
                                            nom_argument=this.#macst_pour_javascript( this.#tb[k] );
                                        }else if(this.#tb[k][2] === 'f' && this.#tb[k][1] === 'defaut' && this.#tb[k][8] === 1){
                                            obj=this.#js_traiteInstruction1( niveau , k + 1 , {} );
                                            if(obj.__xst === __xsu){
                                                valeur_par_defaut=obj.__xva;
                                            }else{
                                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : (__m_rev1.nl2() + this.#tb[id][1]) + 'argument(xxx,[defaut(yyy)]) '} ));
                                            }
                                        }else if(this.#tb[k][2] === 'f' && this.#tb[k][1] === 'obj'){
                                            obj=this.#js_traiteInstruction1( niveau , k , {} );
                                            if(obj.__xst === __xsu){
                                                if(nom_argument === ''){
                                                    nom_argument=obj.__xva;
                                                }else{
                                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                                                }
                                            }else{
                                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : (__m_rev1.nl2() + this.#tb[id][1]) + 'argument(xxx,[defaut(yyy)]) '} ));
                                            }
                                        }else if(this.#tb[k][2] === 'f' && this.#tb[k][1] === '#'){
                                            commentaire=this.#tb[k][13].trim().replace( /\n/g , ' ' ).replace( /\r/g , ' ' );
                                        }else{
                                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                                        }
                                    }
                                    argumentsFonction+=', ' + le_commentaire + (commentaire !== '' ? ( '/' + '* ' + commentaire + ' *' + '/ ' ) : ( '' )) + nom_argument + (valeur_par_defaut !== '' ? ( '=' + valeur_par_defaut ) : ( '' )) + ' ';
                                    le_commentaire='';
                                }
                            }
                        }
                        if(nomFonction !== ''){
                            if('méthode' === this.#tb[id][1] && !(this.#tb[id - 1][1] === '#' && this.#tb[id - 1][2] === 'f')){
                                /*
                                  j'impose l'écriture d'un commentaire minimal devant une méthode
                                */
                                t+=__m_rev1.resps( niveau ) + '/* function' + generateur + ' ' + nomFonction + ' */' + __m_rev1.resps( niveau );
                            }
                            if('méthode' === this.#tb[id][1]){
                                if(format_tableau === true){
                                    if(typeFonction === 'get '){
                                        t+=(statique + asynchrone + modeFonction) + 'get[' + nomFonction + '](' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr( 1 ) )) + '){';
                                    }else if(typeFonction === 'set '){
                                        t+=(statique + asynchrone + modeFonction) + 'set[' + nomFonction + '](' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr( 1 ) )) + '){';
                                    }else if(typeFonction === ''){
                                        t+=(statique + asynchrone + modeFonction) + '[' + nomFonction + '](' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr( 1 ) )) + '){';
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : (__m_rev1.nl2() + this.#tb[id][1]) + ' ' + typeFonction} ));
                                    }
                                }else{
                                    t+=(statique + typeFonction + asynchrone + modeFonction + nomFonction) + '(' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr( 1 ) )) + '){';
                                }
                            }else{
                                t+=asynchrone + 'function' + generateur + ' ' + nomFonction + '(' + (argumentsFonction === '' ? ( '' ) : ( argumentsFonction.substr( 1 ) )) + '){';
                            }
                            if(this.#tb[positionContenu][8] === 0){
                                t+=__m_rev1.resps( niveau + 1 );
                                t+='/* rien ici */';
                                t+=__m_rev1.resps( niveau );
                                t+='}';
                            }else{
                                obj=this.#rev_js1( positionContenu , niveau + 1 , {} );
                                if(obj.__xst === __xsu){
                                    t+=__m_rev1.resps( niveau + 1 );
                                    t+=obj.__xva;
                                    t+=__m_rev1.resps( niveau );
                                    t+='}';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : positionContenu ,"__xme" : (__m_rev1.nl2() + this.#tb[id][1]) + ' contenu de "' + nomFonction + '"'} ));
                                }
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                        }
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                    }
                    break;
                    
                default:
                    /* if(tableau_des_opérateurs_js.hasOwnProperty(this.#tb[id][1])){ */
                    if(this.#tbleau_precedences_js.hasOwnProperty( this.#tb[id][1] )){
                        var obj=this.#TraiteOperations2( this.#tb[id][0] , niveau + 1 , 0 , false );
                        if(obj.__xst === __xer){
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + this.#tb[id][1]} ));
                        }
                        t+='' + obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + ' non traité "' + this.#tb[id][1] + '"'} ));
                    }
                    
            }
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #js_traite_import( id , niveau , opt ){
        let t='';
        let j=0;
        let obj=null;
        let specifie='';
        let provenance='';
        let par_defaut='';
        let espace_de_noms='';
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
            }else if(this.#tb[j][1] === 'provenance'){
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    provenance+=this.#macst_pour_javascript( this.#tb[j + 1] );
                }else{
                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[j][1] === 'espace_de_noms'){
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    espace_de_noms+=this.#macst_pour_javascript( this.#tb[j + 1] );
                }else{
                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[j][1] === 'bibliotheque_spécifiée'){
                if(specifie !== ''){
                    specifie+=' , ';
                }
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    specifie+=this.#macst_pour_javascript( this.#tb[j + 1] );
                }else if(this.#tb[j][8] === 2 && this.#tb[j + 1][2] === 'c' && this.#tb[j + 2][2] === 'c'){
                    specifie+=this.#macst_pour_javascript( this.#tb[j + 1] ) + ' as ' + this.#macst_pour_javascript( this.#tb[j + 2] );
                }else{
                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[j][1] === 'bibliotheque_par_défaut'){
                if(par_defaut !== ''){
                    par_defaut+=' , ';
                }
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    par_defaut+=this.#macst_pour_javascript( this.#tb[j + 1] );
                }else{
                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                }
            }else{
                return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
            }
        }
        t+='import ' + (espace_de_noms !== '' ?
              ( 
                ' * as ' + espace_de_noms + '' + (par_defaut !== '' || specifie !== '' ? ( ' , ' ) : ( '' ))
              ) : ( 
                ''
              )) + (par_defaut !== '' ?
              ( 
                ' ' + par_defaut + ' ' + (specifie !== '' ? ( ' , ' ) : ( '' ))
              ) : ( 
                ''
              )) + (specifie !== '' ? ( '{' + specifie + '}' ) : ( '' )) + ' from ' + provenance;
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #js_traite_affecte( id , niveau , opt ){
        var t='';
        var l_objet_affecte={};
        var signe='=';
        var numeroPar=0;
        var j=0;
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
            }else{
                if(this.#tb[id][1] === 'affectop'){
                    if(numeroPar === 0){
                        signe=this.#tb[j][1];
                        numeroPar++;
                    }else{
                        l_objet_affecte['par' + (numeroPar - 1)]=this.#tb[j];
                        numeroPar++;
                    }
                }else{
                    l_objet_affecte['par' + numeroPar]=this.#tb[j];
                    numeroPar++;
                }
            }
        }
        if(this.#tb[id][1] === 'de'){
            signe=' of ';
        }else if(this.#tb[id][1] === 'dans'){
            signe=' in ';
        }else if(this.#tb[id][1] === 'affecte'){
            signe='=';
        }
        if(!l_objet_affecte['par1']){
            debugger;
        }
        var objInstructionGauche=this.#js_traiteInstruction1( niveau , l_objet_affecte['par0'][0] , {} );
        if(objInstructionGauche.__xst === __xsu){
            var objInstructionDroite=this.#js_traiteInstruction1( niveau , l_objet_affecte['par1'][0] , {} );
            if(objInstructionDroite.__xst === __xsu){
                /*
                  on écrit l'affectation ici 
                */
                if(signe === '='
                       && objInstructionGauche.__xva === objInstructionDroite.__xva.substr( 0 , objInstructionGauche.__xva.length )
                       && objInstructionDroite.__xva.substr( objInstructionGauche.__xva.length , 1 ) === '+'
                ){
                    var droite=objInstructionDroite.__xva.substr( objInstructionGauche.__xva.length + 1 );
                    if(droite.substr( 0 , 1 ) === '('
                           && droite.substr( droite.length - 1 , 1 ) === ')'
                           && this.#tb[l_objet_affecte['par1'][0]][1] !== 'condition'
                    ){
                        droite=droite.substr( 1 , droite.length - 2 );
                    }
                    t+='' + objInstructionGauche.__xva + '+=' + droite;
                }else{
                    var droite=objInstructionDroite.__xva;
                    t+=objInstructionGauche.__xva + signe + droite;
                }
                if(l_objet_affecte['par2']){
                    if(l_objet_affecte['par2'][1] === 'prop'){
                        if(l_objet_affecte['par2'][2] === 'f'){
                            if(this.#tb[l_objet_affecte['par2'][0] + 1][2] === 'c'){
                                t='(' + t + ').' + this.#tb[l_objet_affecte['par2'][0] + 1][1];
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                    }
                }
            }else{
                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
            }
        }else{
            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #js_traiteDefinitiontableau( id , niveau , opt ){
        var t='';
        var j=0;
        var obje={};
        var textObj='';
        var mettre_des_sauts=false;
        var contient_un_tbel=false;
        var precedent_est_commentaire=false;
        var proprietes='';
        var nombre_de_parametres=0;
        var nombre_de_proprietes=0;
        var seul_element='';
        var comptage=0;
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                if(this.#tb[j][13].indexOf( 'tbel' ) >= 0){
                    mettre_des_sauts=false;
                    contient_un_tbel=true;
                }else{
                    mettre_des_sauts=true;
                }
                break;
            }
        }
        if(this.#tb[id][8] > 5 && contient_un_tbel === false){
            mettre_des_sauts=true;
        }
        var valeur='';
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            valeur='';
            if(this.#tb[j][1] === 'p' && this.#tb[j][2] === 'f'){
                if(this.#tb[j][8] === 0){
                    nombre_de_parametres++;
                    if(precedent_est_commentaire === true){
                        precedent_est_commentaire=false;
                    }else{
                        textObj+=',';
                    }
                    if(mettre_des_sauts){
                        textObj+=__m_rev1.resps( niveau + 1 );
                    }
                    textObj+='';
                    this.#rev_js_le( {"__xst" : __xal ,"id" : j ,"__xme" : __m_rev1.nl2() + '<br />attention CE N\'EST PAS UNE ERREUR MAIS... paramètre vide dans un tableau'} );
                }else{
                    for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                        if(this.#tb[k][1] === '#' && this.#tb[k][2] === 'f'){
                            if(nombre_de_parametres === 0 || precedent_est_commentaire === true){
                            }else{
                                textObj+=',';
                            }
                            mettre_des_sauts=true;
                            textObj+=__m_rev1.resps( niveau + 1 );
                            valeur=__m_rev1.resps( niveau + 1 );
                            var commt=__m_rev1.tr_co_src( this.#tb[k][13] , niveau , j );
                            textObj+='/*' + commt + '*/';
                            valeur+='/*' + commt + '*/';
                            precedent_est_commentaire=true;
                        }else{
                            nombre_de_parametres++;
                            obje=this.#js_traiteInstruction1( niveau + 2 , k , {} );
                            if(obje.__xst === __xsu){
                                if(precedent_est_commentaire === true){
                                    precedent_est_commentaire=false;
                                }else{
                                    textObj+=',';
                                }
                                if(mettre_des_sauts){
                                    textObj+=__m_rev1.resps( niveau + 1 );
                                }
                                textObj+=obje.__xva;
                                /* textObj+=','; */
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                            }
                            if(this.#tb[k][2] === 'c'){
                                seul_element=this.#macst_pour_javascript( this.#tb[k] );
                            }
                        }
                    }
                }
            }else if(this.#tb[j][1] === 'prop' && this.#tb[j][2] === 'f'){
                nombre_de_proprietes++;
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    proprietes+='.' + this.#macst_pour_javascript( this.#tb[j + 1] );
                }else{
                    if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'f'){
                        if(this.#tb[j + 1][1] === 'appelf'){
                            aDesAppelsRecursifs=true;
                            obj=this.#js_traiteAppelFonction( j + 1 , true , niveau , true , '' );
                            if(obj.__xst === __xsu){
                                proprietes+='.' + obj.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }
                }
            }else if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                if(nombre_de_parametres === 0 || precedent_est_commentaire === true){
                }else{
                    textObj+=',';
                }
                textObj+=__m_rev1.resps( niveau + 1 );
                var commt=__m_rev1.tr_co_src( this.#tb[j][13] , niveau , j );
                textObj+='/*' + commt + '*/';
                precedent_est_commentaire=true;
            }
            comptage++;
            if(contient_un_tbel){
                if(comptage% 20 === 0){
                    textObj+=__m_rev1.resps( niveau + 1 );
                }else if(comptage% 10 === 0){
                    textObj+='                ';
                }
            }
        }
        if(nombre_de_parametres === 1 && nombre_de_proprietes === 0 && seul_element !== '' && __m_rev1.est_num( seul_element )){
            if(this.#tb[this.#tb[id][7]][1] === 'new' && this.#tb[this.#tb[id][7]][2] === 'f'){
                t='Array(' + seul_element + ')';
            }else{
                t='new Array(' + seul_element + ')';
            }
        }else{
            t+='[';
            if(textObj.length > 1){
                t+=textObj.substr( 1 );
            }
            if(mettre_des_sauts){
                t+=__m_rev1.resps( niveau );
            }
            t+=']' + proprietes;
        }
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #js_traitetableau1( id , niveau , opt ){
        var t='';
        var j=0;
        var k=0;
        var obj={};
        var nom_du_tableau='';
        var position_de_l_appel=0;
        var argumentsFonction='';
        var proprietes_du_tableau='';
        var nbEnfants=0;
        var forcerNvelleLigneEnfant=false;
        var termineParUnePropriete=false;
        position_de_l_appel=-1;
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === 'nomt' && this.#tb[j][2] === 'f'){
                position_de_l_appel=j;
                if(this.#tb[j][8] === 0){
                    /* le nom tableau peut être vide dans le cas ou on a : "a ?. [b]" */
                    nom_du_tableau='';
                }else{
                    var obj1=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                    if(obj1.__xst === __xsu){
                        nom_du_tableau=obj1.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + 'nomt'} ));
                    }
                }
                break;
            }
        }
        if(position_de_l_appel > 0){
            for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                if(this.#tb[j][2] === 'f'){
                    if(this.#tb[j][1] === 'nomt' || this.#tb[j][1] === 'p' || this.#tb[j][1] === '#' || this.#tb[j][1] === 'prop'){
                        continue;
                    }else{
                        this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + 'nomt,p,prop mai pas "' + this.#tb[j][1] + '"'} );
                    }
                }
            }
            argumentsFonction='';
            for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                if(this.#tb[j][1] === 'p'){
                    if(this.#tb[j][8] === 0 && this.#tb[j + 1][2] === 'f'){
                        argumentsFonction+=',';
                    }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                        argumentsFonction+='[' + this.#macst_pour_javascript( this.#tb[j + 1] ) + ']';
                    }else if(this.#tb[j][8] > 1 && this.#tb[j + 1][2] === 'c'){
                        for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                            if(nom_du_tableau === 'concat'){
                                if(this.#tb[k][1] === '+'){
                                    argumentsFonction+=',';
                                }else{
                                    argumentsFonction+=this.#macst_pour_javascript( this.#tb[k] );
                                }
                            }else{
                                debugger;
                            }
                        }
                    }else{
                        if(this.#tb[j][8] === 1 && this.#tb[j + 1][1] === 'obj'){
                            obj=this.#js_traiteDefinitionObjet( j , niveau , {} );
                            if(obj.__xst === __xsu){
                                argumentsFonction+='[' + obj.__xva + ']';
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + 'obj'} ));
                            }
                        }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'f'){
                            if(this.#tb[j + 1][1] === 'p'){
                                obj=this.#rev_js1( j , niveau , {} );
                                if(obj.__xst === __xsu){
                                    if(nom_du_tableau === 'Array' && nbEnfants >= 4){
                                        forcerNvelleLigneEnfant=true;
                                    }
                                    argumentsFonction+='[' + obj.__xva + ']';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                                }
                            }else if(this.#tbleau_precedences_js.hasOwnProperty( this.#tb[j + 1][1] )){
                                var objOperation=this.#TraiteOperations2( j + 1 , niveau , 0 , false );
                                if(objOperation.__xst === __xsu){
                                    argumentsFonction+='[' + objOperation.__xva + ']';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                                }
                            }else{
                                var obj2=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                                if(obj2.__xst === __xsu){
                                    argumentsFonction+='[' + obj2.__xva + ']';
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                                }
                            }
                        }
                    }
                }else if(this.#tb[j][1] === 'prop'){
                    termineParUnePropriete=true;
                    if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                        proprietes_du_tableau+='.' + this.#macst_pour_javascript( this.#tb[j + 1] );
                    }else{
                        if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'f'){
                            if(this.#tb[j + 1][1] === 'appelf'){
                                obj=this.#js_traiteAppelFonction( j + 1 , true , niveau , true , '' );
                                if(obj.__xst === __xsu){
                                    proprietes_du_tableau+='.' + obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + 'prop'} ));
                                }
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + 'fonction inconnue ' + this.#tb[j][1]} ));
                            }
                        }
                    }
                }
            }
            t+=nom_du_tableau;
            t+=argumentsFonction;
            t+=proprietes_du_tableau;
        }else{
            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'nomt(xxxx)'} ));
        }
        return({"__xst" : __xsu ,"__xva" : t ,"forcerNvelleLigneEnfant" : forcerNvelleLigneEnfant ,"termineParUnePropriete" : termineParUnePropriete});
    }
    /*
      =============================================================================================================
    */
    #js_traite_new( id , niveau , opt ){
        var valeur='';
        var props='';
        var t='';
        for( var i=id + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(this.#tb[i][2] === 'c'){
                valeur+=this.#macst_pour_javascript( this.#tb[i] );
            }else if(this.#tb[i][1] === 'appelf' && this.#tb[i][2] === 'f'){
                var obj=this.#js_traiteAppelFonction( i , true , niveau , false , '' );
                /* ✍ this.#tb,id,dansConditionOuDansFonction,niveau,recursif,nom_de_la_fonction_parente */
                if(obj.__xst === __xsu){
                    valeur+=obj.__xva;
                }else{
                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[i][1] === 'defTab' && this.#tb[i][2] === 'f'){
                var obj1=this.#js_traiteDefinitiontableau( this.#tb , i , niveau , {} );
                if(obj1.__xst === __xsu){
                    if(obj1.__xva.startsWith( '[' ) && obj1.__xva.endsWith( ']' )){
                        debugger;
                        if(obj1.__xva.trim().replace( /\r/g , '' ).replace( /\n/g , '' ) === '[]'){
                            valeur+='[]';
                        }else{
                            valeur+='Array(' + obj1.__xva.substr( 1 , obj1.__xva.length - 2 ) + ')';
                        }
                    }else{
                        valeur+=obj1.__xva;
                    }
                }else{
                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[i][1] === 'prop' && this.#tb[i][2] === 'f'){
                for( var j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                    var obj2=this.#js_traiteInstruction1( niveau , j , {} );
                    if(obj2.__xst === __xsu){
                        props+='.' + obj2.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + 'prop'} ));
                    }
                }
            }else{
                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + 'inconnu "' + this.#tb[i][1] + '"'} ));
            }
        }
        if(valeur + props === '[]'){
            return({"__xst" : __xsu ,"__xva" : '[]'});
        }else{
            if(props !== ''){
                t='(new ' + valeur + ')' + props;
            }else{
                t='new ' + valeur;
            }
            return({"__xst" : __xsu ,"__xva" : t});
        }
    }
    /*
      =============================================================================================================
    */
    #js_traiteDefinitionClasse( id , niveau , opt ){
        var t='';
        var i=0;
        var j=0;
        var k=0;
        var nom_classe='';
        var contenu_classe='';
        var etend='';
        for( i=id + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(this.#tb[i][1] === 'nom_classe' && this.#tb[i][2] === 'f'){
                for( j=i + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
                    if(this.#tb[j][2] === 'c'){
                        nom_classe=this.#tb[j][1];
                    }else{
                        if(this.#tb[j][1] === 'étend' && this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                            debugger;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2() + ' "' + this.#tb[j][1] + '" inconnu'} ));
                        }
                    }
                }
            }else if(this.#tb[i][1] === 'contenu' && this.#tb[i][2] === 'f'){
                if(this.#tb[i][8] === 0){
                    contenu_classe+='';
                }else{
                    /* var obj=js_this.#tbTojavascript1(this.#tb,i + 1,false,false,niveau + 1); */
                    var obj=this.#rev_js1( i , niveau + 1 , {} );
                    if(obj.__xst === __xsu){
                        contenu_classe+=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                    }
                }
            }else if(this.#tb[i][1] === 'étend' && this.#tb[i][2] === 'f' && this.#tb[i][8] === 1 && this.#tb[i + 1][2] === 'c'){
                etend=' extends ' + this.#tb[i + 1][1];
            }else{
                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
            }
        }
        t+='class ' + nom_classe + etend + '{';
        t+=__m_rev1.resps( niveau + 1 );
        t+=contenu_classe;
        t+=__m_rev1.resps( niveau );
        t+='}';
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
    */
    #js_traiteDefinitionObjet( id , niveau , opt ){
        if(this.#tb[id][8] === 0){
            return({"__xst" : __xsu ,"__xva" : "{}"});
        }
        var commt='';
        var t='';
        var j=0;
        var obj={};
        var a_des_commentaires=false;
        var longueur_totale=0;
        var propriete='';
        var numero=0;
        var cle='';
        var valeur='';
        var défaut=null;
        for( j=id + 1 ; j < this.#l02 && a_des_commentaires === false ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                a_des_commentaires=true;
                break;
            }
        }
        if(a_des_commentaires === false && this.#tb[id][8] > 5){
            a_des_commentaires=true;
        }
        var tableau_prop_objet=[];
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === '#' && this.#tb[j][2] === 'f'){
                commt=__m_rev1.tr_co_src( this.#tb[j][13] , niveau + 1 , j );
                if(commt.indexOf( '\n' ) >= 0){
                    valeur=' /*' + commt + ' ' + '*/';
                    tableau_prop_objet.push( {"type" : 'comm' ,"valeur" : valeur} );
                    longueur_totale+=valeur.length;
                }else{
                    valeur=' /*' + commt + '*/';
                    tableau_prop_objet.push( {"type" : 'comm' ,"valeur" : valeur} );
                    longueur_totale+=valeur.length;
                }
            }else if(this.#tb[j][1] === 'prop' && this.#tb[j][2] === 'f'){
                if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    propriete+='.' + this.#tb[j + 1][1];
                }else{
                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                }
            }else if(this.#tb[j][1] === '' && this.#tb[j][2] === 'f'){
                valeur='';
                numero=0;
                cle='';
                défaut=null;
                for( var k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                    if(this.#tb[k][2] === 'c'){
                        if(numero === 0){
                            cle=this.#tb[k][1];
                            numero++;
                        }else{
                            valeur=this.#macst_pour_javascript( this.#tb[k] );
                        }
                    }else if(this.#tb[k][2] === 'f'){
                        if(this.#tb[k][1] === '#'){
                            commt=__m_rev1.tr_co_src( this.#tb[k][13] , niveau + 1 , j );
                            if(commt.indexOf( '\n' ) >= 0){
                                valeur=' /*' + commt + ' ' + '*/';
                                tableau_prop_objet.push( {"type" : 'comm' ,"valeur" : valeur} );
                                longueur_totale+=valeur.length;
                            }else{
                                valeur=' /*' + commt + '*/';
                                tableau_prop_objet.push( {"type" : 'comm' ,"valeur" : valeur} );
                                longueur_totale+=valeur.length;
                            }
                        }else if(this.#tb[k][1] === 'defaut'){
                            var objOperation=this.#js_traiteInstruction1( niveau + 1 , k + 1 , {} );
                            if(objOperation.__xst === __xsu){
                                défaut=objOperation.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                            }
                        }else if(numero === 0){
                            /* o={...super.getContainerClasses()} */
                            var objOperation=this.#js_traiteInstruction1( niveau + 1 , k , {} );
                            if(objOperation.__xst === __xsu){
                                cle=objOperation.__xva;
                                valeur=null;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                            }
                        }else if(numero === 1){
                            var objOperation=this.#js_traiteInstruction1( niveau + 1 , k , {} );
                            if(objOperation.__xst === __xsu){
                                valeur=objOperation.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                            }
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + 'dans js_traiteDefinitionObjet il y a un problème'} ));
                        }
                    }
                }
                tableau_prop_objet.push( {"type" : 'cv' ,"cle" : cle ,"valeur" : valeur ,"défaut" : défaut ,"niveau" : niveau} );
                if(valeur === null){
                    longueur_totale+=cle.length;
                }else{
                    longueur_totale+=cle.length + valeur.length;
                }
            }
        }
        var tt='{';
        if(a_des_commentaires || longueur_totale > 120){
            a_des_commentaires=true;
        }
        for( var i=0 ; i < tableau_prop_objet.length ; i++ ){
            if(i === 0 && a_des_commentaires){
                tt+=__m_rev1.resps( niveau + 1 );
            }
            if(tableau_prop_objet[i].type === 'comm'){
                tt+=tableau_prop_objet[i].valeur;
                tt+=__m_rev1.resps( niveau + 1 );
            }else{
                if(tableau_prop_objet[i].cle.substr( 0 , 3 ) === '...' && tableau_prop_objet[i].valeur === ''){
                    /* car t={...z} */
                    tt+=' ' + tableau_prop_objet[i].cle + ' ';
                }else if(tableau_prop_objet[i].cle !== '' && tableau_prop_objet[i].valeur === null){
                    tt+=' ' + tableau_prop_objet[i].cle + ' ';
                }else if(tableau_prop_objet[i].cle.substr( 0 , 1 ) === '{' || tableau_prop_objet[i].cle.substr( 0 , 1 ) === '['){
                    tt+=tableau_prop_objet[i].cle + ' : ' + tableau_prop_objet[i].valeur;
                }else{
                    tt+='"' + tableau_prop_objet[i].cle + '" : ' + tableau_prop_objet[i].valeur;
                }
                if(tableau_prop_objet[i].défaut !== null){
                    tt+='=' + tableau_prop_objet[i].défaut;
                }
                if(i < tableau_prop_objet.length - 1){
                    tt+=' ,';
                }
                if(a_des_commentaires){
                    if(i === tableau_prop_objet.length - 1){
                        tt+=__m_rev1.resps( niveau );
                    }else{
                        tt+=__m_rev1.resps( niveau + 1 );
                    }
                }
            }
        }
        tt+='}' + propriete;
        return({"__xst" : __xsu ,"__xva" : tt});
    }
    /*
      =============================================================================================================
    */
    #js_traiteAppelFonction( id , dansConditionOuDansFonction , niveau , recursif , nom_de_la_fonction_parente ){
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
        var asynchrone=false;
        var fonction_dans_tableau_avec_constante=false;
        positionAppelFonction=-1;
        var id_de_la_fonction='';
        var auto_appelee=false;
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][1] === 'nomf' && this.#tb[j][2] === 'f'){
                positionAppelFonction=j;
                if(this.#tb[j][8] === 0){
                    /*
                      nom fonction vide 
                      declare_variable( x0 , chainé( a.b , appelf( nomf() , p() ) )),
                    */
                }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                    nomFonction=this.#tb[j + 1][1];
                    if(nomFonction === 'Array'){
                        nbEnfants=this.#tb[this.#tb[this.#tb[j + 1][7]][7]][8] - 1;
                    }
                }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][1] === 'cst'){
                    if(this.#tb[j + 2][4] !== 0){
                        fonction_dans_tableau_avec_constante=true;
                    }
                    nomFonction=this.#tb[j + 2][1];
                }else if(this.#tb[j + 1][1] === 'appelf' && this.#tb[j + 1][2] === 'f'){
                    var obj1=this.#js_traiteAppelFonction( j + 1 , true , niveau , true , nom_de_la_fonction_parente );
                    if(obj1.__xst === __xsu){
                        if(obj1.__xva.substr( obj1.__xva.length - 1 , 1 ) === ';'){
                            obj1.__xva=obj1.__xva.substr( 0 , obj1.__xva.length - 1 );
                        }
                        nomFonction=obj1.__xva;
                        enfantTermineParUnePropriete=obj1.termineParUnePropriete;
                        aDesAppelsRecursifs=true;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }else if(this.#tb[j + 1][1] === 'tableau' && this.#tb[j + 1][2] === 'f'){
                    var obj_tableau=this.#js_traitetableau1( j + 1 , niveau , {} );
                    if(obj_tableau.__xst === __xsu){
                        nomFonction=obj_tableau.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }else if(this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === 'testEnLigne'){
                    var obj_tableau=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                    if(obj_tableau.__xst === __xsu){
                        nomFonction='(' + obj_tableau.__xva + ')';
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }else if(this.#tb[j + 1][2] === 'f' && this.#tb[j + 1][1] === 'chainé'){
                    var obj_tableau=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                    if(obj_tableau.__xst === __xsu){
                        nomFonction=obj_tableau.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }else if(this.#tb[j + 1][1] === 'virgule' && this.#tb[j + 1][2] === 'f'){
                    /* hugues var objOperation=this.#TraiteOperations2(j + 1,niveau,0,false); */
                    var objOperation=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                    if(objOperation.__xst === __xsu){
                        nomFonction='(' + objOperation.__xva + ')';
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }else if(this.#tb[j + 1][1] === '' && this.#tb[j + 1][2] === 'f'){
                    var objtestLi=this.#rev_js1( j + 1 , niveau + 1 , {} );
                    if(objtestLi.__xst === __xsu){
                        nomFonction=objtestLi.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }else if(this.#tb[j + 1][1] === 'new' && this.#tb[j + 1][2] === 'f'){
                    var objtestLi=this.#js_traite_new( j + 1 , niveau , {} );
                    if(objtestLi.__xst === __xsu){
                        nomFonction=objtestLi.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }else if(this.#tb[j + 1][1] === 'defTab' && this.#tb[j + 1][2] === 'f'){
                    var obj=this.#js_traiteDefinitiontableau( this.#tb , j + 1 , niveau , {} );
                    if(obj.__xst === __xsu){
                        nomFonction=obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }else{
                    var obj_tableau=this.#js_traiteInstruction1( niveau , j + 1 , {} );
                    if(obj_tableau.__xst === __xsu){
                        nomFonction=obj_tableau.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + '"' + this.#tb[j][1] + '"'} ));
                    }
                }
            }else if(this.#tb[j][1] === 'flechee' && this.#tb[j][2] === 'f'){
                flechee=true;
            }else if(this.#tb[j][1] === 'asynchrone' && this.#tb[j][2] === 'f'){
                asynchrone=true;
            }else if(this.#tb[j][1] === 'id' && this.#tb[j][2] === 'f'){
                id_de_la_fonction=' ' + this.#tb[j + 1][1];
            }else if(this.#tb[j][1] === 'auto_appelee' && this.#tb[j][2] === 'f'){
                auto_appelee=true;
            }else if(this.#tb[j][1] === 'r' && this.#tb[j][2] === 'f'){
                if(this.#tb[j][8] === 1){
                    nomRetour=this.#tb[j + 1][1];
                }
                positionRetour=j;
            }else if(this.#tb[j][1] === 'element' && this.#tb[j][2] === 'f'){
                for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                    if(this.#tb[k][2] === 'c'){
                        nomElement+=this.#macst_pour_javascript( this.#tb[k] );
                    }else if(this.#tb[k][2] === 'f'){
                        if(this.#tb[k][1] === '#'){
                        }else if(this.#tb[k][1] === 'tableau'){
                            var obj_tableau=this.#js_traitetableau1( k , niveau , {} );
                            if(obj_tableau.__xst === __xsu){
                                nomElement+=obj_tableau.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + 'element'} ));
                            }
                        }else if(this.#tb[k][2] === 'f' && this.#tbleau_precedences_js.hasOwnProperty( this.#tb[k][1] )){
                            var obj=this.#TraiteOperations2( this.#tb[k][0] , niveau + 1 , 0 , false );
                            if(obj.__xst === __xer){
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + 'element'} ));
                            }
                            nomElement+='(' + obj.__xva + ')';
                        }else{
                            var objinst=this.#js_traiteInstruction1( niveau , k , {} );
                            if(objinst.__xst === __xsu){
                                nomElement+=objinst.__xva;
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + 'element incorrecte dans appelf '} ));
                            }
                        }
                    }
                }
            }
        }
        if(!(positionAppelFonction > 0) && nomFonction !== ''){
            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + ' il faut un nom de fonction à appeler nomf(xxxx)'} ));
        }
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][2] === 'f'){
                if(this.#tb[j][1] === 'element'
                       || this.#tb[j][1] === 'nomf'
                       || this.#tb[j][1] === 'p'
                       || this.#tb[j][1] === 'appelf'
                       || this.#tb[j][1] === 'r'
                       || this.#tb[j][1] === 'prop'
                       || this.#tb[j][1] === '#'
                       || this.#tb[j][1] === 'contenu'
                       || this.#tb[j][1] === 'id'
                       || this.#tb[j][1] === 'flechee'
                       || this.#tb[j][1] === 'asynchrone'
                       || this.#tb[j][1] === 'auto_appelee'
                ){
                    continue;
                }else{
                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + ' l\'argument de appelf "' + this.#tb[j][1] + '" n\'est pas pris en compte'} ));
                }
            }
        }
        argumentsFonction='';
        for( j=id + 1 ; j < this.#l02 ; j=this.#tb[j][12] ){
            if(this.#tb[j][7] === id){
                if(this.#tb[j][1] === 'obj'){
                    obj=this.#js_traiteDefinitionObjet( j , niveau , {} );
                    if(obj.__xst === __xsu){
                        argumentsFonction+=', ' + obj.__xva;
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
                    }
                }else if(this.#tb[j][1] === 'prop'){
                    termineParUnePropriete=true;
                    if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                        proprietesFonction+='.' + this.#macst_pour_javascript( this.#tb[j + 1] );
                    }else{
                        if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'f'){
                            if(this.#tb[j + 1][1] === 'appelf'){
                                aDesAppelsRecursifs=true;
                                obj=this.#js_traiteAppelFonction( j + 1 , true , niveau , true , nomFonction );
                                if(obj.__xst === __xsu){
                                    proprietesFonction+='.' + obj.__xva;
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                                }
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                            }
                        }
                    }
                }else if(this.#tb[j][1] === 'appelf'){
                    aDesAppelsRecursifs=true;
                    obj=this.#js_traiteAppelFonction( j , true , niveau , true , nomFonction );
                    if(obj.__xst === __xsu){
                        argumentsFonction+=', ';
                        if(nomFonction === 'Array' && nbEnfants >= 4){
                            forcerNvelleLigneEnfant=true;
                            argumentsFonction+=__m_rev1.resps( niveau + 1 );
                        }
                        argumentsFonction+=obj.__xva + ' ';
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                    }
                }else if(this.#tb[j][1] === 'contenu'){
                    contenu='';
                    if(this.#tb[j][8] === 0){
                        contenu='/* vide */';
                    }else{
                        /* obj=js_this.#tbTojavascript1(this.#tb,j + 1,false,false,niveau + 1); */
                        obj=this.#rev_js1( j , niveau + 1 , {} );
                        if(obj.__xst === __xsu){
                            contenu+=__m_rev1.resps( niveau + 1 );
                            contenu+=obj.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }
                }else if(this.#tb[j][1] === 'p'){
                    if(this.#tb[j][8] === 0){
                        argumentsFonction+=', ';
                    }else if(this.#tb[j][8] === 1 && this.#tb[j + 1][2] === 'c'){
                        argumentsFonction+=', ' + this.#macst_pour_javascript( this.#tb[j + 1] ) + ' ';
                    }else if(this.#tb[j][8] > 1 && this.#tb[j + 1][2] === 'c'){
                        argumentsFonction+=', ';
                        var numero_position=0;
                        for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                            if(nomFonction === 'concat'){
                                if(this.#tb[k][1] === '+'){
                                    argumentsFonction+=', ';
                                }else{
                                    argumentsFonction+='' + this.#macst_pour_javascript( this.#tb[k] ) + ' ';
                                }
                            }else{
                                if(this.#tb[k][2] === 'c'){
                                    if(numero_position === 0){
                                        argumentsFonction+=this.#macst_pour_javascript( this.#tb[k] );
                                        numero_position++;
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                                    }
                                }else if(this.#tb[k][2] === 'f' && this.#tb[k][1] === 'defaut'){
                                    if(this.#tb[k][8] === 1 && this.#tb[k + 1][2] === 'c'){
                                        argumentsFonction+='=' + this.#macst_pour_javascript( this.#tb[k + 1] );
                                    }else{
                                        var objJs=this.#js_traiteInstruction1( niveau , k + 1 , {} );
                                        if(objJs.__xst === __xsu){
                                            argumentsFonction+='=' + objJs.__xva + ' ';
                                        }else{
                                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : this.#tb[k][0] ,"__xme" : __m_rev1.nl2()} ));
                                        }
                                    }
                                }else{
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                                }
                            }
                        }
                    }else{
                        if(this.#tb[j][8] === 1 && this.#tb[j + 1][1] === 'obj'){
                            obj=this.#js_traiteDefinitionObjet( j + 1 , niveau , {} );
                            if(obj.__xst === __xsu){
                                argumentsFonction+=', ' + obj.__xva + ' ';
                            }else{
                                return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                            }
                        }else if(this.#tb[j + 1][2] === 'f'){
                            if(this.#tb[j][8] > 1){
                                var a_un_commentaire=false;
                                var k=j + 1;
                                for( k=j + 1 ; k < this.#l02 && a_un_commentaire === false ; k=this.#tb[k][12] ){
                                    if(this.#tb[k][7] === j){
                                        if(this.#tb[k][1] === '#' && this.#tb[k][2] === 'f'){
                                            a_un_commentaire=true;
                                        }
                                    }
                                }
                                if(a_un_commentaire === false){
                                    return(this.#rev_js_le( {"__xst" : __xer ,"id" : j ,"__xme" : __m_rev1.nl2()} ));
                                }
                            }
                            var precedent_est_un_commentaire=false;
                            for( k=j + 1 ; k < this.#l02 ; k=this.#tb[k][12] ){
                                if(precedent_est_un_commentaire === true){
                                    /* on ne met pas de séparateur */
                                    precedent_est_un_commentaire=false;
                                }else{
                                    argumentsFonction+=', ';
                                }
                                if(this.#tb[k][1] === '#' && this.#tb[k][2] === 'f'){
                                    if(argumentsFonction === ', '){
                                        /*  */
                                        argumentsFonction=', /*' + this.#tb[k][13] + '*/ ';
                                    }else{
                                        argumentsFonction+=' /*' + this.#tb[k][13] + '*/ ';
                                    }
                                    precedent_est_un_commentaire=true;
                                }else if(this.#tb[k][2] === 'f' && this.#tb[k][1] === '@'){
                                    argumentsFonction+=this.#tb[k][13];
                                }else if(this.#tb[k][2] === 'f' && this.#tb[k][1] === 'appelf'){
                                    objOperation=this.#js_traiteAppelFonction( k , true , niveau , true , nomFonction );
                                    if(objOperation.__xst === __xsu){
                                        if(objOperation.__xva.substr( objOperation.__xva.length - 1 , 1 ) === ';'){
                                            objOperation.__xva=objOperation.__xva.substr( 0 , objOperation.__xva.length - 1 );
                                        }
                                        argumentsFonction+=objOperation.__xva + ' ';
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : k ,"__xme" : __m_rev1.nl2()} ));
                                    }
                                }else if(this.#tb[k][2] === 'c'){
                                    argumentsFonction+=this.#macst_pour_javascript( this.#tb[k] ) + ' ';
                                }else if(this.#tbleau_precedences_js.hasOwnProperty( this.#tb[k][1] )){
                                    var objOperation=this.#TraiteOperations2( k , niveau , 0 , false );
                                    if(objOperation.__xst === __xsu){
                                        argumentsFonction+=objOperation.__xva + ' ';
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : k ,"__xme" : __m_rev1.nl2()} ));
                                    }
                                }else{
                                    var objJs=this.#js_traiteInstruction1( niveau , k , {} );
                                    if(objJs.__xst === __xsu){
                                        argumentsFonction+=objJs.__xva + ' ';
                                    }else{
                                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : this.#tb[k][0] ,"__xme" : __m_rev1.nl2()} ));
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
        if(argumentsFonction === ', '){
            argumentsFonction=',';
        }
        var transformer_point_en_tableau=false;
        if(!dansConditionOuDansFonction){
            t+=__m_rev1.resps( niveau );
        }
        t+=nomRetour !== '' ? ( nomRetour + '=' ) : ( '' );
        if(recursif === true && nomRetour === '' && !dansConditionOuDansFonction){
            t+=__m_rev1.resps( niveau + 1 ) + (nomElement === '' ? ( '' ) : ( nomElement + '.' ));
        }else{
            if(nomElement !== ''){
                if(nomElement.substr( nomElement.length - 1 , 1 ) === ']'){
                    var tab_mots_cles_a_ne_pas_transformer=[
                        'abort',
                        'addEventListener',
                        'animate',
                        'appendChild',
                        'apply',
                        'at',
                        'bind',
                        'call',
                        'callback',
                        'charAt',
                        'charCodeAt',
                        'cloneNode',
                        'codePointAt',
                        'concat',
                        'delete',
                        'endsWith',
                        'exec',
                        'execute',
                        'focus',
                        'forEach',
                        'fromCharCode',
                        'fromCodePoint',
                        'getAnimations',
                        'getAttribute',
                        'getBBox',
                        'getBoundingClientRect',
                        'getTime',
                        'has',
                        'hasOwnProperty',
                        'includes',
                        'indexOf',
                        'isWellFormed',
                        'join',
                        'lastIndexOf',
                        'localeCompare',
                        'map',
                        'match',
                        'matchAll',
                        'normalize',
                        'padEnd',
                        'padStart',
                        'pop',
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
                        'unshift',
                        'valueOf'
                    ];
                    if(tab_mots_cles_a_ne_pas_transformer.includes( nomFonction )){
                        t=nomElement + '.';
                    }else{
                        /* a-t-on défini une fonction "prototype" plus haut ? */
                        var trouvé=false;
                        for( var h=0 ; h < this.#tb.length ; h++ ){
                            if(this.#tb[h][1].indexOf( nomFonction ) >= 0){
                                if(this.#tb[h][1].indexOf( 'prototype' ) >= 0){
                                    trouvé=true;
                                    break;
                                }else{
                                    if(this.#tb[this.#tb[h][7]][1] === 'id'){
                                        trouvé=true;
                                        break;
                                    }else if(this.#tb[this.#tb[this.#tb[h][7]][7]][1] === 'obj'
                                           && this.#tb[h][12] !== this.#l02
                                           && this.#tb[this.#tb[h][12]][1] === 'appelf'
                                    ){
                                        trouvé=true;
                                        break;
                                    }else if(this.#tb[this.#tb[this.#tb[h][7]][7]][1] === 'definition' && this.#tb[this.#tb[h][7]][1] === 'nom'){
                                        trouvé=true;
                                        break;
                                    }
                                }
                            }
                        }
                        if(trouvé === true){
                            t=nomElement + '.';
                        }else{
                            console.log( '%c => on garde la forme "." pour ' + nomElement + '"' + nomFonction + '"' + ' car ce n\'est pas une fonction connue' , 'background:yellow;color:red;' );
                            transformer_point_en_tableau=true;
                            t=nomElement;
                        }
                    }
                }else{
                    t=nomElement + '.';
                }
            }
        }
        /*
          le nom de la fonction ici 
        */
        if(nomFonction === 'Array' && !enfantTermineParUnePropriete){
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
            /* console.log('auto_appelee=',auto_appelee); */
            t='(' + t + ')';
        }
        var arguments_a_ajouter_au_retour='';
        argumentsFonction=argumentsFonction !== '' ? ( argumentsFonction.substr( 1 ) ) : ( '' );
        if(!enfantTermineParUnePropriete){
            if(nomFonction === 'Array' && nbEnfants <= 1){
                if(argumentsFonction === '' || __m_rev1.est_num( argumentsFonction )){
                    t+='[';
                }else{
                    t+='Array(';
                }
            }else if(nomFonction === 'Array' && nbEnfants > 1){
                t+='Array(';
            }else{
                if(nomFonction === 'super' && argumentsFonction === ''){
                    /* pas de parenthèses pour la fonction super */
                    t+='';
                }else{
                    if(this.#tb[this.#tb[id][7]][1] === '' && this.#tb[this.#tb[id][7]][2] === 'f'){
                        /* on le mettra plus tard au retour */
                        if(this.#tb[id][3] >= 2 && this.#tb[this.#tb[this.#tb[id][7]][7]][1] && this.#tb[this.#tb[this.#tb[id][7]][7]][2] === 'f'){
                            t+=(asynchrone === true ? ( 'async ' ) : ( '' )) + '(';
                        }else{
                            /* on le mettra plus tard au retour */
                            arguments_a_ajouter_au_retour='(' + argumentsFonction + ')';
                        }
                    }else{
                        t+=(asynchrone === true ? ( 'async ' ) : ( '' )) + '(';
                    }
                }
            }
        }
        if(arguments_a_ajouter_au_retour !== ''){
            /* on le mettra plus tard au retour */
        }else{
            t+=argumentsFonction;
        }
        if(aDesAppelsRecursifs
                   && !dansConditionOuDansFonction
                   && nomRetour === ''
                   && nomElement === ''
                   && enfantTermineParUnePropriete === false
               || forcerNvelleLigneEnfant
        ){
            t+=__m_rev1.resps( niveau );
        }
        if(!enfantTermineParUnePropriete){
            if(nomFonction === 'Array' && nbEnfants <= 1){
                if(argumentsFonction === '' || __m_rev1.est_num( argumentsFonction )){
                    t+=']';
                }else{
                    t+=')';
                }
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
            var espaces_avant_contenu=__m_rev1.resps( niveau );
            if(contenu.substr( 0 , 2 ) === CRLF){
                espaces_avant_contenu='';
            }
            if(flechee === false){
                if(this.#tb[id][3] >= 2 && this.#tb[this.#tb[id][7]][1] === 'p' && this.#tb[this.#tb[this.#tb[id][7]][7]][1] === 'appelf'){
                    /*
                      quand un paramètre d'une fonction est lui même une fonction anonyme :
                      par exemple 
                      this.#tb.sort(function(a,b){return(b - a);});
                    */
                    t+='{' + espaces_avant_contenu + contenu + __m_rev1.resps( niveau ) + '}';
                }else{
                    if(this.#tb[this.#tb[id][7]][1] === 'affecte' && this.#tb[this.#tb[id][7]][2] === 'f'){
                        t+='{' + espaces_avant_contenu + contenu + __m_rev1.resps( niveau ) + '}';
                    }else if(this.#tb[this.#tb[id][7]][1] === 'nomf' && this.#tb[this.#tb[id][7]][2] === 'f'){
                        t+='{' + espaces_avant_contenu + contenu + __m_rev1.resps( niveau - 1 ) + '}';
                    }else{
                        t+='{' + espaces_avant_contenu + contenu + __m_rev1.resps( niveau ) + '}';
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
                    t+='{' + espaces_avant_contenu + contenu + __m_rev1.resps( niveau ) + '}';
                }else if(nom_de_la_fonction_parente === 'filter' || nom_de_la_fonction_parente === 'map'){
                    t+=contenu;
                }else if(nom_de_la_fonction_parente === ''){
                    t+='{' + espaces_avant_contenu + contenu + __m_rev1.resps( niveau ) + '}';
                }else{
                    var temp=nom_de_la_fonction_parente.trim();
                    if(temp.substr( 0 , 8 ) === 'function'){
                        t+='{' + contenu + __m_rev1.resps( niveau ) + '}';
                    }else{
                        if(nom_de_la_fonction_parente === 'filter' || nom_de_la_fonction_parente === 'map'){
                            console.log( 'flechée nom_de_la_fonction_parente="' + nom_de_la_fonction_parente + '"' + ' donc sans accolades ' );
                            t+='' + contenu + '';
                        }else{
                            t+='{' + contenu + '}';
                        }
                    }
                }
            }
        }
        t+=proprietesFonction;
        /*
          if(!dansConditionOuDansFonction || auto_appelee === true){
          t+=__m_rev1.resps(niveau);
          }
        */
        if(transformer_point_en_tableau === true){
            console.log( '%c cas spécial de transformer_point_en_tableau ' , 'background:yellow;color:red;' , t );
        }
        return({
                "__xst" : __xsu ,
                "__xva" : t ,
                "forcerNvelleLigneEnfant" : forcerNvelleLigneEnfant ,
                "termineParUnePropriete" : termineParUnePropriete ,
                "arguments_a_ajouter_au_retour" : arguments_a_ajouter_au_retour
            });
    }
    /*
      https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Operator_precedence
      type_operateur=1  => un seul    : il ne doit y avoir qu'une seule opérande , exemple : non(x), typeof(y), void(z) ...
      type_operateur=2  => deux       : il ne doit y avoir 2 opérandes strictement exemple : modulo(x,y), puissance(x,y)....
      type_operateur=m2 => multiple 2 : il doit y avoir au moins 2 opérandes exemple : mult(2,3,4) = 24
      type_operateur=m1 => multiple 1 : il doit y avoir au moins 1 opérande  exemple : moins(1) = -1, moins(2,1,1)=2-1-1=0
      type_operateur=m0 => multiple 0 : les opérandes ne sont pas obligatoires exemple : condition()
      
      associativitée gauche droite = gd : a OP b OP c => (a OP b) OP c
      associativitée droite gauche = dg : a OP b OP c => a OP (b OP c)
      absents : delete , plus unaire , moins unaire ,  new dans argument , await , yield , virgule
      
    */
    /*
      "Typeof" : {"__xva" : 'typeof ' ,"type_operateur" : 1 ,"precedence" : 15 ,"associativitee" : "dg"} ,
      "virgule" : {"__xva" : ',' ,"type_operateur" : 'm2' ,"precedence" : 1 ,"associativitee" : "gd"} ,
      "void" : {"__xva" : 'void' ,"type_operateur" : 1 ,"precedence" : 15 ,"associativitee" : "dg"} ,
      "cle_dans_objet" : {"__xva" : 'in' ,"type_operateur" : 2 ,"precedence" : 10 ,"associativitee" : "gd"} ,
      "oppose_binaire" : {"__xva" : '~' ,"type_operateur" : 1 ,"precedence" : 15 ,"associativitee" : "dg"} ,
      
      
      
    */
    /* les autres, je ne les ai pas encore rencontrés */
    /*
      
      this.#tb[this.#tb[this.#tb[id][7]][7]] + ' ' + this.#tb[this.#tb[id][7]] + ' ' + this.#tb[id]
      $a=$b?$c:$d+1; testenligne sifaux plus
      // function TraiteOperations2_old(this.#tb,id,niveau,niveauOp,ajouter_des_sauts){
      // cle_dans_objet
      
    */
    #TraiteOperations2( id , niveau , niveauOp , ajouter_des_sauts_de_lignes ){
        var t='';
        var i=0;
        var obj=null;
        var sauts=false;
        let un_espace='';
        let un_espacem1='';
        let un_espacem2='';
        let propriete='';
        if(!this.#tbleau_precedences_js.hasOwnProperty( this.#tb[id][1] )){
            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2() + ' pour "' + this.#tb[id][1] + '"'} ));
            /* return(php_logerr({"__xst" : __xer ,"id" : i ,"__xme" : '2259 php_traiteOperation 1633 "' + this.#tb[id][1] + '"'})); */
        }
        var operateur_courant=this.#tbleau_precedences_js[this.#tb[id][1]];
        var operandes=[];
        for( i=id + 1 ; i < this.#l02 ; i=this.#tb[i][12] ){
            if(this.#tb[i][1] === '#' && this.#tb[i][2] === 'f'){
            }else if(this.#tb[i][2] === 'c'){
                if(this.#tb[id][1] === 'Instanceof'){
                    operandes.push( {"valeur" : this.#tb[i][1].replace( /\\\\/g , '\\' )} );
                }else{
                    operandes.push( {"valeur" : this.#macst_pour_javascript( this.#tb[i] )} );
                }
            }else{
                if(this.#tbleau_precedences_js.hasOwnProperty( this.#tb[i][1] )){
                    var sous_operateur=this.#tbleau_precedences_js[this.#tb[i][1]];
                    var objOperation=this.#TraiteOperations2( i , niveau + 1 , niveauOp , ajouter_des_sauts_de_lignes );
                    if(objOperation.__xst === __xsu){
                        if(sous_operateur.priorite >= operateur_courant.priorite || this.#tb[id][1] === 'concat' && this.#tb[i][1] !== 'concat'){
                            if(this.#tb[i][1] === 'plus' && this.#tb[id][1] === 'plus' || this.#tb[i][1] === 'non' && this.#tb[id][1] === 'non'){
                                /*
                                  (d + e) - (30+5) ne doit pas être simplifié
                                */
                                operandes.push( {"valeur" : objOperation.__xva} );
                            }else{
                                operandes.push( {"valeur" : '(' + objOperation.__xva + ')'} );
                            }
                        }else{
                            if(operateur_courant.operateur === ''){
                                operandes.push( {"valeur" : objOperation.__xva} );
                            }else{
                                operandes.push( {"valeur" : objOperation.__xva} );
                            }
                        }
                    }else{
                        return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                        /* return(php_logerr({"__xst" : __xer ,"id" : i ,"__xme" : '2282 php_traiteOperation'})); */
                    }
                }else{
                    if(this.#tb[i][1] === 'prop' && this.#tb[i][2] === 'f'){
                        /* cas très très très spécial (a||b).c */
                        var obj1=this.#js_traiteInstruction1( niveau , i + 1 , {} );
                        if(obj1.__xst === __xsu){
                            propriete=obj1.__xva;
                        }else{
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                        }
                    }else{
                        var obj1=this.#js_traiteInstruction1( niveau , i , {} );
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
                            return(this.#rev_js_le( {"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2()} ));
                            /* return(php_logerr({"__xst" : __xer ,"id" : i ,"__xme" : '2291 php_traiteOperation '})); */
                        }
                    }
                }
            }
        }
        if(operandes.length === 0){
            return(this.#rev_js_le( {"__xst" : __xer ,"id" : id ,"__xme" : __m_rev1.nl2()} ));
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
                un_espace=__m_rev1.resps( niveau );
                un_espacem1=__m_rev1.resps( niveau - 1 );
                un_espacem2=__m_rev1.resps( niveau - 2 );
            }
            for( var i=0 ; i < operandes.length ; i++ ){
                if(i > 0){
                    if(sauts === true && (operateur_courant.operateur === ' && ' || operateur_courant.operateur === ' || ')){
                        t+=un_espacem1 + '  ';
                    }else if(sauts === true && 'virgule' === this.#tb[id][1]){
                        t+=un_espace;
                    }
                    t+=operateur_courant.operateur;
                }
                t+=operandes[i].valeur;
            }
        }
        if(propriete !== ''){
            t='(' + t + ').' + propriete;
        }
        /*
          hugues
          if('virgule' === this.#tb[id][1] && ajouter_des_sauts_de_lignes !== true){
          if(t.length > 120){
          obj=this.#TraiteOperations2(id,niveau,niveauOp,true);
          t=obj.__xva;
          }
          }
        */
        /* console.log('operandes=' , operandes ); */
        /* debugger */
        return({"__xst" : __xsu ,"__xva" : t});
    }
    /*
      =============================================================================================================
      point d'entrée : convertion du texte au format tableau rev vers un texte format js
      =============================================================================================================
    */
    c_tab_vers_js( tab , les_options ){
        let t='';
        let obj=null;
        let indice_de_debut=0;
        this.#tb=tab;
        this.#l02=tab.length;
        if(les_options.hasOwnProperty( 'indice_de_debut' )){
            indice_de_debut=les_options.indice_de_debut;
        }
        obj=this.#rev_js1( indice_de_debut , 0 , {} );
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
            return(this.#rev_js_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur de conversion en js'} ));
        }
    }
    /*
      =============================================================================================================
      point d'entrée : convertion du texte au format texte rev vers un texte format js
      =============================================================================================================
    */
    c_rev_vers_js( source_rev , les_options ){
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
            obj=this.#rev_js1( 0 , 0 , {} );
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
                return(this.#rev_js_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur de conversion en js'} ));
            }
        }else{
            return(this.#rev_js_le( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + 'erreur dans un rev'} ));
        }
    }
}
export{c_rev_vers_js1 as c_rev_vers_js1};