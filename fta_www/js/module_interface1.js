/*
  =====================================================================================================================
  classe permettant de gérer les éléments d'interface de cet ensemble de programmes
  =====================================================================================================================
*/
class interface1{
    #nom_de_la_variable='';
    #nom_div_des_messages1='';
    #div_des_positions_du_curseur=null;
    /*
      à priori, les ascenseurs "thin" font 11px de large
    */
    #largeur_des_ascenseurs=11;
    /*
      
    */
    #programme_en_arriere_plan=null;
    /*
      modale
    */
    global_modale2=null;
    global_modale2_contenu=null;
    global_modale2_iframe=null;
    /*
      on affiche un message quand le serveur est lent, c'est à dire que la réponse n'est pas arrivée en 1.5 secondes
    */
    #globale_timeout_serveur_lent=1500;
    #globale_timeout_reference_timer_serveur_lent=null;
    #global_enteteTableau=[
        ['id','id',0],
        ['val','valeur',1],
        ['typ','type',2],
        ['niv','niveau',3],
        ['coQ','constante quotée',4],
        ['pre','position du premier caractère',5],
        ['der','position du dernier caractère',6],
        ['pId','Id du parent',7],
        ['nbE','nombre d\'enfants',8],
        ['nuE','numéro enfants',9],
        ['pro','profondeur',10],
        ['pop','position ouverture parenthese',11],
        ['efs','enfant suivant',12],
        ['com','commentaire',13]
    ];
    /*
      =============================================================================================================
      le seul argument est pour l'instant le nom de la variable qui est déclarée
    */
    constructor( nom_de_la_variable , nom_de_la_div_contenant_les_messages ){
        this.#nom_de_la_variable=nom_de_la_variable;
        this.#nom_div_des_messages1=nom_de_la_div_contenant_les_messages;
        this.global_modale2=document.getElementById( 'modale1' );
        this.global_modale2_contenu=document.getElementById( '__contenu_modale' );
        this.global_modale2_iframe=document.getElementById( 'iframe_modale_1' );
        this.global_modale2.addEventListener( 'click' , function( e ){
                var dim=e.target.getBoundingClientRect();
                if(e.clientX < dim.left || e.clientX > dim.right || e.clientY < dim.top || e.clientY > dim.bottom){
                    document.getElementById( '__message_modale' ).innerHTML='';
                    e.target.close();
                }
            } );
        this.#div_des_positions_du_curseur=document.createElement( 'div' );
        this.#div_des_positions_du_curseur.id='div_des_positions_du_curseur';
        this.#div_des_positions_du_curseur.setAttribute( 'style' , 'position:absolute;top:60px;left:0px;background:white;display:inline-block;min-height:12px!important;line-height:12px;' );
        this.#div_des_positions_du_curseur.innerHTML='';
        document.getElementsByTagName( 'body' )[0].appendChild( this.#div_des_positions_du_curseur );
    }
    /* function nom_de_la_variable */
    get nom_de_la_variable(){
        return this.#nom_de_la_variable;
    }
    /* function largeur_des_ascenseurs */
    get largeur_des_ascenseurs(){
        return this.#largeur_des_ascenseurs;
    }
    /*
      =============================================================================================================
    */
    afficher_les_erreurs_masquees(){
        var est_masque=parseInt( document.getElementById( 'bouton_voir_les_messages_masques' ).getAttribute( 'data-masque' ) , 10 );
        var div_parent=document.getElementById( this.#nom_div_des_messages1 );
        var lst=div_parent.getElementsByTagName( 'div' );
        for( var i=0 ; i < lst.length ; i++ ){
            if(lst[i].parentElement === div_parent
                   && lst[i].getAttribute( 'data-masquable' )
                   && lst[i].getAttribute( 'data-masquable' ) === '1'
            ){
                if(est_masque === 1){
                    lst[i].style.display='';
                }else{
                    lst[i].style.display='none';
                }
            }
        }
        if(est_masque === 1){
            document.getElementById( 'bouton_voir_les_messages_masques' ).setAttribute( 'data-masque' , '0' );
            document.getElementById( 'bouton_voir_les_messages_masques' ).innerHTML='masquer';
            document.getElementById( 'message_masquer_les_details' ).innerHTML='le détail des erreurs est visible ';
        }else{
            document.getElementById( 'bouton_voir_les_messages_masques' ).setAttribute( 'data-masque' , '1' );
            document.getElementById( 'bouton_voir_les_messages_masques' ).innerHTML='voir';
            document.getElementById( 'message_masquer_les_details' ).innerHTML='le détail des erreurs n\'est pas visible ';
        }
    }
    /*
      =============================================================================================================
      supprime les messages de la zone globale_messages et masque la zone de texte qui contient les message
      remplace clearMessages
      =============================================================================================================
    */
    raz_des_messages(){
        try{
            document.getElementById( this.#nom_div_des_messages1 ).innerHTML='';
            /* display a pu être mis à "none" ailleurs */
            document.getElementById( this.#nom_div_des_messages1 ).style.visibility='hidden';
        }catch(e){
            /* par vu, pas pris */
        }
        /* __m_rev1 */
        __m_rev1.globale_messages={"erreurs" : [] ,"succes" : [] ,"alarmes" : [] ,"infos" : []};
    }
    /*
      =============================================================================================================
      on remplir_et_afficher_les_messages1
    */
    remplir_et_afficher_les_messages1( nomDeLaTextAreaContenantLeTexteSource ){
        var i=0;
        var affichagesPresents=false;
        var zon=document.getElementById( this.#nom_div_des_messages1 );
        var temp='';
        var numLignePrecedente=-1;
        var nombre_de_boutons_affiches=0;
        var il_existe_des_messages_masques=false;
        var tt='';
        var tab_cas_erreur=[
            /*  */
            {"type" : 'erreurs' ,"css_cls" : 'yyerreur' ,"nom_zone" : '__xme'},
            {"type" : 'succes' ,"css_cls" : 'yyerreur' ,"nom_zone" : '__xme'},
            {"type" : 'alarmes' ,"css_cls" : 'yyalarme' ,"nom_zone" : '__xav'},
            {"type" : 'infos' ,"css_cls" : 'yysucces' ,"nom_zone" : '__xme'}
        ];
        for(let cas in tab_cas_erreur){
            var le_cas=tab_cas_erreur[cas];
            while(__m_rev1.globale_messages[le_cas.type].length > 0){
                tt='';
                if(__m_rev1.globale_messages[le_cas.type][i].hasOwnProperty( le_cas.nom_zone )){
                    if(__m_rev1.globale_messages[le_cas.type][i].hasOwnProperty( 'masquee' )
                           && __m_rev1.globale_messages[le_cas.type][i].masquee === true
                    ){
                        il_existe_des_messages_masques=true;
                        tt+='<div class="' + le_cas.css_cls + '" style="display:none;" data-masquable="1">';
                    }else{
                        tt+='<div class="' + le_cas.css_cls + '" >';
                    }
                    if(__m_rev1.globale_messages[le_cas.type][i].plage && nomDeLaTextAreaContenantLeTexteSource !== ''){
                        tt+='<a href="javascript:' + this.#nom_de_la_variable + '.selectionner_une_plage1(' + __m_rev1.globale_messages[le_cas.type][i].plage[0] + ',' + __m_rev1.globale_messages[le_cas.type][i].plage[1] + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" ';
                        tt+=' class="' + le_cas.css_cls + '" style="border:2px red outset;">plage ' + __m_rev1.globale_messages[le_cas.type][i].plage[0] + ',' + __m_rev1.globale_messages[le_cas.type][i].plage[1] + '</a>';
                    }
                    if(__m_rev1.globale_messages[le_cas.type][i].ligne && nomDeLaTextAreaContenantLeTexteSource !== ''){
                        tt+='<a href="javascript:' + this.#nom_de_la_variable + '.allerAlaLigne(' + __m_rev1.globale_messages[le_cas.type][i].ligne + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" ';
                        tt+=' class="' + le_cas.css_cls + '" style="border:2px red outset;">ligne ' + __m_rev1.globale_messages[le_cas.type][i].ligne + '</a>';
                    }
                    tt+=__m_rev1.globale_messages[le_cas.type][i][le_cas.nom_zone] + '</div>';
                    zon.innerHTML+=tt;
                    affichagesPresents=true;
                }
                __m_rev1.globale_messages[le_cas.type].splice( 0 , 1 );
            }
        }
        if(il_existe_des_messages_masques === true){
            zon.innerHTML+='<div class="yyalarme">' + '<span id="message_masquer_les_details">le détail des erreurs n\'est pas visible</span> <a id="bouton_voir_les_messages_masques" data-masque="1" class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.afficher_les_erreurs_masquees()">voir</a>' + '</div>';
        }
        if(zon.innerHTML !== ''){
            zon.style.visibility='visible';
            this.reactiver_les_boutons1();
        }
    }
    /*
      =============================================================================================================
      function recupérer_un_fetch
    */
    async recupérer_un_fetch( url , donnees ){
        var delais_admis=donnees.call.opt && donnees.call.opt.delais_admis ? ( donnees.call.opt.delais_admis ) : ( 6000 );
        var masquer_les_messages_du_serveur=donnees.call.opt && donnees.call.opt.hasOwnProperty( 'masquer_les_messages_du_serveur' ) ? ( donnees.call.opt.masquer_les_messages_du_serveur ) : ( true );
        var en_entree={
            "signal" : AbortSignal.timeout( delais_admis ) ,
            "method" : "POST" ,
            "mode" : "cors" ,
            "cache" : "no-cache" ,
            "credentials" : "same-origin" ,
            "headers" : {"Content-Type" : 'application/x-www-form-urlencoded'} ,
            "redirect" : "follow" ,
            "referrerPolicy" : "no-referrer" ,
            "body" : 'ajax_param=' + encodeURIComponent( JSON.stringify( donnees ) )
        };
        try{
            var response=await fetch( url , en_entree ).catch( ( err ) => {
                /* console.error('err interface recupérer_un_fetch ',err); */
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() + ' recupérer_un_fetch <br/>' + err} );
            } ).finally( () => {
                /* vide */
            } );
            /* vide */
            var t=await response.text().catch( ( err ) => {
                console.error( 'err text interface recupérer_un_fetch ' , err );
            } ).finally( () => {
                /* vide */
            } );
            /* vide */
            try{
                var le_json=JSON.parse( t );
                if(le_json.hasOwnProperty( '__xms' )){
                    for(var i in le_json.__xms){
                        __m_rev1.empiler_erreur( {"__xst" : le_json.__xst ,"__xme" : le_json.__xms[i] ,"masquee" : masquer_les_messages_du_serveur} );
                    }
                }
                return le_json;
            }catch(e){
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur sur convertion json, texte non json=' + t ,"masquee" : masquer_les_messages_du_serveur} );
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'url=' + url ,"masquee" : masquer_les_messages_du_serveur} );
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : JSON.stringify( en_entree ) ,"masquee" : masquer_les_messages_du_serveur} );
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : JSON.stringify( donnees ) ,"masquee" : masquer_les_messages_du_serveur} );
                return({
                        "__xst" : __xer ,
                        "__xme" : 'le retour n\'est pas en json pour ' + JSON.stringify( donnees ) + ' , t=' + t ,
                        "masquee" : masquer_les_messages_du_serveur
                    });
            }
        }catch(e){
            console.log( e );
            if(e.message === 'signal timed out'){
                __m_rev1.empiler_erreur( {
                        "__xst" : __xer ,
                        "__xme" : 'les données n\'ont pas pu être récupérées  en moins de ' + (parseInt( (delais_admis / 1000) * 10 , 10 ) / 10) + ' secondes '
                    } );
            }else{
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : e.message} );
            }
            return({"__xst" : __xer ,"__xme" : e.message});
        }
    }
    /*
      =============================================================================================================
      modale
    */
    fermerModale2(){
        document.getElementById( '__message_modale' ).innerHTML='';
        this.global_modale2.close();
    }
    /* function afficherModale2 */
    afficherModale2( parametres ){
        var jsn1=JSON.parse( parametres );
        if(jsn1.__fonction === 'recupérer_un_element_parent_en_bdd'){
            var paramatresModale={"__champs_texte_a_rapatrier" : jsn1['__champs_texte_a_rapatrier'] ,"__nom_champ_dans_parent" : jsn1['__nom_champ_dans_parent']};
            this.global_modale2_iframe.src=jsn1['__url'] + '?__parametres_choix=' + encodeURIComponent( JSON.stringify( paramatresModale ) );
            this.global_modale2.showModal();
        }
    }
    /* function annuler_champ_modale */
    annuler_champ_modale( parametres ){
        var jsn1=JSON.parse( parametres );
        document.getElementById( jsn1['__nom_champ_dans_parent'] ).value='';
        try{
            if(jsn1.__champs_texte_a_rapatrier){
                var i={};
                for(i in jsn1.__champs_texte_a_rapatrier){
                    window.parent.document.getElementById( i ).innerHTML=jsn1.__champs_texte_a_rapatrier[i].__libelle_si_vide;
                }
            }
        }catch(e){
            console.log( e );
        }
    }
    /* function choisir_de_iframe2 */
    choisir_de_iframe2( parametres ){
        var jsn1=JSON.parse( parametres );
        window.parent.document.getElementById( jsn1['__nom_champ_rapatrie'] ).value=jsn1['__valeur_champ_id_rapatrie'];
        try{
            if(jsn1.__champs_texte_a_rapatrier){
                var i={};
                for(i in jsn1.__champs_texte_a_rapatrier){
                    window.parent.document.getElementById( i ).innerHTML=jsn1.__champs_texte_a_rapatrier[i].__libelle_avant + jsn1.__champs_texte_a_rapatrier[i].__valeur + jsn1.__champs_texte_a_rapatrier[i].__libelle_apres;
                }
            }
        }catch(e){
            console.log( e );
        }
        window.parent[this.#nom_de_la_variable]['fermerModale2']();
    }
    /*
      =============================================================================================================
      function supprimer_ce_commentaire_et_recompiler
      =============================================================================================================
    */
    supprimer_ce_commentaire_et_recompiler( id_source , id_rev , provenance ){
        console.log( id_source + ' ' + id_rev );
        var param={
            "nom_du_travail_en_arriere_plan" : 'supprimer_un_commentaire1' ,
            "liste_des_taches" : [{"etat" : 'a_faire' ,"id_source" : id_source ,"id_rev" : id_rev ,"provenance" : provenance}]
        };
        this.lancer_un_travail_en_arriere_plan( JSON.stringify( param ) );
    }
    /*
      =============================================================================================================
      function reduire_la_text_area
      =============================================================================================================
    */
    reduire_la_text_area( nom_de_la_textarea ){
        var a=document.getElementById( nom_de_la_textarea );
        var b=a.getBoundingClientRect();
        if(a){
            a.rows=5;
            a.style.height='5em';
            a.focus();
        }
    }
    /*
      =============================================================================================================
      function raz_la_text_area
      =============================================================================================================
    */
    raz_la_text_area( nom_de_la_textarea ){
        var a=document.getElementById( nom_de_la_textarea );
        if(a){
            a.value='';
        }
    }
    /*
      =============================================================================================================
      function agrandir_la_text_area
      =============================================================================================================
    */
    agrandir_la_text_area( nom_de_la_textarea ){
        var a=document.getElementById( nom_de_la_textarea );
        if(a){
            var b=a.getBoundingClientRect();
            var c=a.value.split( '\n' );
            if(c.length < 100){
                a.rows=c.length + 1;
                /*
                  le "line-height d'une textarea est fixé à 1.2 
                */
                a.style.height=(parseInt( (c.length + 1) * 1.2 , 10 ) + 1) + 'em';
            }else{
                a.rows=100;
                a.style.height='100em';
            }
            /*
              on met la zone en haut
            */
            var d=parseInt( (b.top - 80) + window.pageYOffset , 10 );
            var lst=document.getElementsByClassName( 'menuScroller' );
            if(lst.length >= 2){
                d=d - (lst.length - 1) * CSS_TAILLE_REFERENCE_HAUTEUR_MIN_DIV;
            }
            window.scrollTo( 0 , d );
            a.focus();
        }
    }
    /*
      =============================================================================================================
      ajuste la taille d'une textarea
      =============================================================================================================
    */
    agrandir_ou_reduire_la_text_area( nom_de_la_textarea ){
        try{
            var a=document.getElementById( nom_de_la_textarea );
            var b=a.getBoundingClientRect();
            this.masquer_les_messages1( '' );
            if(a){
                if(a.rows <= 10){
                    var c=a.value.split( '\n' );
                    if(c.length < 100){
                        a.rows=c.length + 1;
                        /*
                          le "line-height d'une textarea est fixé à 1.2 
                        */
                        a.style.height=(parseInt( (c.length + 1) * 1.2 , 10 ) + 1) + 'em';
                    }else{
                        a.rows=100;
                        a.style.height='100em';
                    }
                    /*
                      on met la zone en haut
                    */
                    var d=parseInt( (b.top - 80) + window.pageYOffset , 10 );
                    var lst=document.getElementsByClassName( 'menuScroller' );
                    console.log( lst.length );
                    console.log( 'd=' , d );
                    if(lst.length >= 2){
                        d=d - (lst.length - 1) * CSS_TAILLE_REFERENCE_HAUTEUR_MIN_DIV;
                    }
                    window.scrollTo( 0 , d );
                    a.focus();
                }else{
                    a.rows=5;
                    a.style.height='5em';
                    a.focus();
                }
            }
        }catch(e){
            console.log( 'e=' , e );
        }
    }
    /*
      =============================================================================================================
      function remplacer_la_selection_par
    */
    remplacer_la_selection_par( nom_de_la_textarea ){
        var a=document.getElementById( nom_de_la_textarea );
        var x=a.selectionStart;
        var b=a.value.substr( a.selectionStart , a.selectionEnd - a.selectionStart );
        if(b === ''){
            alert( 'veuillez sélectionner une chaine à remplacer' );
            return;
        }
        var remplacer_par=window.prompt( 'remplacer par' , '??' );
        if(remplacer_par){
            var r1=new RegExp( b , 'g' );
            var c=a.value.replace( r1 , remplacer_par );
            a.value=c;
            this.agrandir_la_text_area( nom_de_la_textarea );
            a.focus();
            a.selectionStart=x;
        }
    }
    /*
      =============================================================================================================
      function aller_a_la_position
    */
    aller_a_la_position( nom_textarea ){
        var resultat=window.prompt( 'aller à la position' , 1 );
        if(resultat && __m_rev1.est_num( resultat )){
            var a=document.getElementById( nom_textarea );
            if(a.rows < 10 || a.getBoundingClientRect().height < 160){
                a.rows="100";
            }
            a.focus();
            a.selectionStart=0;
            a.selectionEnd=resultat;
        }
    }
    /*
      =============================================================================================================
      function aller_a_la_ligne
    */
    aller_a_la_ligne( nom_textarea , ajouter=0 ){
        var i=0;
        var position_fin=0;
        var position_debut=0;
        var numero_de_ligne=window.prompt( 'aller à la ligne n°?' , 1 );
        if(numero_de_ligne && __m_rev1.est_num( numero_de_ligne )){
            numero_de_ligne=parseInt( numero_de_ligne , 10 ) + ajouter;
            var a=document.getElementById( nom_textarea );
            var lignes=a.value.split( '\n' );
            if(lignes.length > numero_de_ligne){
                lignes.splice( numero_de_ligne - 1 , (lignes.length - numero_de_ligne) + 1 );
                position_fin=0;
                for( i=lignes.length - 1 ; i >= 0 ; i-- ){
                    position_fin+=lignes[i].length + 1;
                }
                position_debut=position_fin - lignes[lignes.length - 1].length - 1;
                a.focus();
                a.selectionStart=position_debut;
                a.selectionEnd=position_fin;
            }
        }
    }
    /*
      =============================================================================================================
      function aller_au_caractere_de_la_textarea
    */
    aller_au_caractere_de_la_textarea( id_textarea ){
        var valeur=prompt( 'aller au caractère n° :' );
        if(valeur !== null){
            var elem=document.getElementById( id_textarea );
            elem.focus();
            elem.selectionStart=parseInt( valeur , 10 );
            elem.selectionEnd=parseInt( valeur , 10 ) + 1;
        }
    }
    /*
      =============================================================================================================
      function definir_le_nombre_de_lignes_a_afficher_pour_une_liste
    */
    definir_le_nombre_de_lignes_a_afficher_pour_une_liste( nom_de_la_page , nombre_de_lignes ){
        var ajax_param={
            "call" : {"lib" : 'php' ,"file" : 'session' ,"funct" : 'definir_le_nombre_de_lignes_a_afficher_pour_une_liste'} ,
            "nom_de_la_page" : nom_de_la_page ,
            "nombre_de_lignes" : nombre_de_lignes
        };
        async function definir_le_nombre_de_lignes_a_afficher_pour_une_liste1( url="" , ajax_param ){
            var a=__gi1.recupérer_un_fetch( url , ajax_param );
            return a;
        }
        definir_le_nombre_de_lignes_a_afficher_pour_une_liste1( 'za_ajax.php?definir_le_nombre_de_lignes_a_afficher_pour_une_liste' , ajax_param ).then( ( donnees ) => {
                if(donnees.__xst === __xsu){
                    window.location.reload( true );
                    return;
                }else{
                    debugger;
                }
            } );
    }
    /*
      =============================================================================================================
      affichage de la modale permettant de fixer_les_parametres_pour_une_liste
      function fixer_les_parametres_pour_une_liste
    */
    fixer_les_parametres_pour_une_liste( nom_de_la_page ){
        this.global_modale2_iframe.style.visibility='none';
        var t='';
        t+='<h1>fixer les paramètres</h1>';
        var i=10;
        for( i=10 ; i <= 50 ; i+=10 ){
            t+='<a href="javascript:' + this.#nom_de_la_variable + '.definir_le_nombre_de_lignes_a_afficher_pour_une_liste(&quot;' + nom_de_la_page + '&quot;,' + i + ')">afficher ' + i + ' lignes</a>';
        }
        this.global_modale2_contenu.innerHTML=t;
        this.global_modale2.showModal();
    }
    /*
      =============================================================================================================
      quand on clique sur un lien javascript, , le traitement devrait être immédiat,
      On le réaffiche 300 ms apres
      =============================================================================================================
    */
    masquer_les_boutons(){
        var refBody=document.getElementsByTagName( 'body' )[0];
        var lsta1=refBody.getElementsByTagName( 'a' );
        for( var i=0 ; i < lsta1.length ; i++ ){
            if(lsta1[i].href){
                try{
                    if(lsta1[i].className && lsta1[i].className.indexOf( 'noHide' ) >= 0){
                    }else{
                        lsta1[i].classList.add( 'yyunset_temporaire' );
                    }
                }catch(e){}
            }
        }
    }
    reference_bouton_attendre=null;
    /*
      =============================================================================================================
      on action_quand_click_sur_lien_javascript
    */
    action_quand_click_sur_lien_javascript( e ){
        var attendre_message_avant_reactivation=false;
        try{
            if(e.target.getAttribute( 'data-attendre_message' ) && e.target.getAttribute( 'data-attendre_message' ) === 'oui'){
                attendre_message_avant_reactivation=true;
                __gi1.reference_bouton_attendre=e.target;
                __gi1.masquer_les_boutons();
            }
            e.target.classList.add( "yyunset_temporaire" );
        }catch(e1){}
        if(attendre_message_avant_reactivation === false){
            setTimeout( function(){
                    /*
                      Normalement, l'affichage des messages supprime les yyunset_temporaire
                      mais on ne sait jamais
                    */
                    var lstb1=document.getElementsByClassName( "yyunset_temporaire" );
                    var i=0;
                    for( i=0 ; i < lstb1.length ; i++ ){
                        lstb1[i].classList.remove( 'yyunset_temporaire' );
                    }
                } , 300 );
        }
    }
    /*
      =============================================================================================================
      on colorier_le_bouton
    */
    #colorier_le_bouton( a ){
        __gi1.class_list_avant=a.className;
        __gi1.element_a_reactiver=a;
        var a_une_erreur=false;
        var lst=document.getElementById( this.#nom_div_des_messages1 ).getElementsByTagName( 'div' );
        for( var i=0 ; i < lst.length ; i++ ){
            if(lst[i].className.indexOf( 'yyerreur' ) >= 0){
                a_une_erreur=true;
                break;
            }
        }
        if(a_une_erreur === true){
            a.className='yyerreur';
            a.style.zoom=1.3;
        }else{
            a.className='yysucces';
        }
    }
    /*
      =============================================================================================================
      on reactiver_les_boutons1
    */
    reactiver_les_boutons1(){
        var i=0;
        var refBody=document.getElementsByTagName( 'body' )[0];
        clearTimeout( this.#globale_timeout_reference_timer_serveur_lent );
        var lstb1=refBody.getElementsByTagName( 'button' );
        for( i=0 ; i < lstb1.length ; i++ ){
            if(!lstb1[i].onclick){
                if(lstb1[i].hasOwnProperty( 'className' ) && lstb1[i].className && lstb1[i].className.indexOf( 'noHide' ) >= 0){
                }else{
                    lstb1[i].style.visibility="";
                }
            }
        }
        var lstb1=refBody.getElementsByTagName( 'input' );
        for( i=0 ; i < lstb1.length ; i++ ){
            if(!lstb1[i].onclick){
                if(lstb1[i].hasOwnProperty( 'className' ) && lstb1[i].className && lstb1[i].className.indexOf( 'noHide' ) >= 0){
                }else{
                    if(lstb1[i].type === 'submit'){
                        lstb1[i].style.visibility="";
                    }
                }
            }
        }
        var lsta1=refBody.getElementsByTagName( 'a' );
        for( i=0 ; i < lsta1.length ; i++ ){
            if(lsta1[i].hasOwnProperty( 'className' ) && lsta1[i].className && lsta1[i].className.indexOf( 'noHide' ) >= 0){
            }else{
                lsta1[i].classList.remove( "yyunset_temporaire" );
                if(__gi1.reference_bouton_attendre === lsta1[i]){
                    this.#colorier_le_bouton( lsta1[i] );
                }
            }
        }
        try{
            var elem=document.getElementById( 'sloserver1' );
            elem.remove();
        }catch(e){}
        var lstb1=document.getElementsByClassName( "yyunset_temporaire" );
        for( i=0 ; i < lstb1.length ; i++ ){
            lstb1[i].classList.remove( 'yyunset_temporaire' );
        }
    }
    /*
      =============================================================================================================
      l'affichage de la boite doit être progressif
    */
    #mise_a_jour_affichage_serveur_lent1(){
        try{
            var elem=document.getElementById( 'sloserver1' );
            if(elem){
                var opa=parseInt( elem.style.opacity * 100 , 10 );
                if(opa < 100){
                    var newOpa=opa / 100 + 0.1;
                    if(newOpa > 1){
                        newOpa=1;
                    }
                    document.getElementById( 'sloserver1' ).style.opacity=newOpa;
                    if(newOpa < 1){
                        setTimeout( this.#mise_a_jour_affichage_serveur_lent1.bind( this ) , 50 );
                    }
                }
            }
        }catch(e){}
    }
    /*
      =============================================================================================================
    */
    #affichage_boite_serveur_lent1(){
        var divId=document.createElement( 'div' );
        divId.id='sloserver1';
        divId.style.top='55px';
        divId.style.left='0px';
        divId.style.position='fixed';
        divId.style.padding='8px';
        divId.style.zIndex=10000;
        divId.style.textAlign='center';
        divId.style.fontSize='1.5em';
        divId.style.width='99.99%';
        divId.style.borderRadius='3px';
        divId.className='yyerreur';
        divId.style.opacity=0.0;
        divId.innerHTML='désolé, le serveur et/ou la connexion sont lents<br /> veuillez patienter';
        document.getElementsByTagName( 'body' )[0].appendChild( divId );
        setTimeout( this.#mise_a_jour_affichage_serveur_lent1.bind( this ) , 50 );
    }
    /*
      =============================================================================================================
      quand on clique sur un bouton, on affiche la boite 1.5 secondes plus tard
      =============================================================================================================
    */
    click_sur_bouton1( e ){
        try{
            e.target.style.visibility="hidden";
        }catch(e1){}
        this.#globale_timeout_reference_timer_serveur_lent=setTimeout( this.#affichage_boite_serveur_lent1.bind( this ) , this.#globale_timeout_serveur_lent );
    }
    /*
      =============================================================================================================
      quand on clique sur un lien, on affiche la boite 1.5 secondes plus tard
      =============================================================================================================
    */
    click_sur_lien1( e ){
        /* console.log('click_sur_lien1'); */
        if(e.target.target && e.target.target.toLowerCase() === '_blank'){
        }else{
            try{
                e.target.classList.add( "yyunset_temporaire" );
            }catch(e1){}
            this.#globale_timeout_reference_timer_serveur_lent=setTimeout( this.#affichage_boite_serveur_lent1.bind( this ) , this.#globale_timeout_serveur_lent );
        }
    }
    /*
      =============================================================================================================
    */
    ajoute_de_quoi_faire_disparaitre_les_boutons_et_les_liens(){
        /*
          ça pourra servir un jour !
          this.calcul_la_largeur_des_ascenseurs();
        */
        let i=0;
        const bod=document.getElementsByTagName( 'body' )[0];
        let lstb1=bod.getElementsByTagName( 'button' );
        for( i=lstb1.length - 1 ; i >= 0 ; i-- ){
            if(!lstb1[i].onclick){
                if(lstb1[i].className && lstb1[i].className.indexOf( 'noHide' ) >= 0){
                }else{
                    lstb1[i].addEventListener( "click" , this.click_sur_bouton1.bind( this ) , false );
                }
            }
        }
        lstb1=bod.getElementsByTagName( 'input' );
        for( i=lstb1.length - 1 ; i >= 0 ; i-- ){
            if(!lstb1[i].onclick){
                if(lstb1[i].className && lstb1[i].className.indexOf( 'noHide' ) >= 0){
                }else{
                    if(lstb1[i].type === 'submit'){
                        lstb1[i].addEventListener( "click" , this.click_sur_bouton1.bind( this ) , false );
                    }
                }
            }
        }
        lstb1=bod.getElementsByTagName( 'a' );
        for( i=lstb1.length - 1 ; i >= 0 ; i-- ){
            if(lstb1[i].href){
                try{
                    if(lstb1[i].className && lstb1[i].className.indexOf( 'noHide' ) >= 0){
                    }else{
                        if(lstb1[i].href.indexOf( 'javascript' ) === 0){
                            lstb1[i].addEventListener( "click" , this.action_quand_click_sur_lien_javascript , false );
                        }else{
                            lstb1[i].addEventListener( "click" , this.click_sur_lien1.bind( this ) , false );
                        }
                    }
                }catch(e){
                    /* pour les liens dans le svg */
                }
            }
        }
        /*
          =====================================================================================================
          Mettre le bouton retour à la liste dans la barre des messages si elle est affichée
          =====================================================================================================
        */
        lstb1=document.getElementById( this.#nom_div_des_messages1 );
        if(lstb1.style.visibility === 'visible'){
            /* à priori, un message est affiché */
            try{
                /*
                  
                  si il y a un bouton __retour_a_la_liste, on l'ajoute à la zone message
                */
                if(document.getElementById( '__retour_a_la_liste' )){
                    var a=document.createElement( 'a' );
                    a.className="__clone";
                    a.style.float='inline-end';
                    a.href=document.getElementById( '__retour_a_la_liste' ).href;
                    a.innerHTML='&nbsp;⬱&nbsp;';
                    lstb1.insertBefore( a , lstb1.firstChild );
                }
            }catch(e){}
        }
    }
    /*
      =============================================================================================================
    */
    calcul_la_largeur_des_ascenseurs(){
        var body=document.getElementsByTagName( 'body' )[0];
        var div=document.createElement( "div" );
        div.style.width='100px';
        div.style.height='100px';
        div.style.overflow='auto';
        div.style.opacity=0.01;
        body.appendChild( div );
        var bag=document.createElement( "div" );
        var att1='width:101px;height:101px;overflow:auto;';
        bag.style.width='101px';
        bag.style.height='101px';
        bag.style.overflow='auto';
        div.appendChild( bag );
        div.scrollTop=100;
        this.#largeur_des_ascenseurs=div.scrollTop - 1;
        div.removeChild( bag );
        body.removeChild( div );
    }
    /*
      =============================================================================================================
    */
    convertit_source_javascript_en_rev( sourceDuJavascript ){
        var parseur_javascript=window.acorn.Parser;
        try{
            var tableau_des_commentaires_js=[];
            var obj=parseur_javascript.parse( sourceDuJavascript , {"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : false ,"onComment" : tableau_des_commentaires_js} );
            if(obj === ''){
                t='';
            }else if(obj.hasOwnProperty( 'body' ) && Array.isArray( obj.body ) && obj.body.length === 0){
                t='';
            }else{
                /*
                  il faut retirer les commentaires si ce sont des CDATA ou des <source_javascript_rev> 
                  car javascriptdanshtml les ajoute.
                */
                var commentaires_a_remplacer=['<![CDATA[',']]>','<source_javascript_rev>','</source_javascript_rev>'];
                for( var nn=0 ; nn < commentaires_a_remplacer.length ; nn++ ){
                    for( var indc=tableau_des_commentaires_js.length - 1 ; indc >= 0 ; indc-- ){
                        if(tableau_des_commentaires_js[indc].value.trim() === commentaires_a_remplacer[nn]){
                            tableau_des_commentaires_js.splice( indc , 1 );
                        }
                    }
                }
                for( var indc=tableau_des_commentaires_js.length - 1 ; indc >= 0 ; indc-- ){
                    if(tableau_des_commentaires_js[indc].value.trim() === '' && tableau_des_commentaires_js[indc].type === 'Line'){
                        tableau_des_commentaires_js.splice( indc , 1 );
                    }
                }
                /* on transforme le ast du js en rev */
                var obj1=__m_astjs_vers_rev1.traite_ast( obj.body , tableau_des_commentaires_js , {} );
                if(obj1.__xst === __xsu){
                    return({"__xst" : __xsu ,"__xva" : obj1.__xva});
                }else{
                    __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur convertit_source_javascript_en_rev 3433'} );
                }
            }
        }catch(e){
            console.error( 'e=' , e );
            if(e.pos){
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2() ,"plage" : [e.pos,e.pos]} );
            }else{
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} );
            }
        }
        return({"__xst" : __xsu ,"__xva" : obj1.__xva});
    }
    /*
      =============================================================================================================
    */
    bouton_transform_textarea_js_en_rev_avec_acorn3( nom_de_la_text_area_js , nom_de_la_text_area_rev , sauvegarder_en_stockage_local=false ){
        this.raz_des_messages();
        var a=document.getElementById( nom_de_la_text_area_js );
        if(sauvegarder_en_stockage_local === true){
            localStorage.setItem( 'fta_indexhtml_javascript_dernier_fichier_charge' , a.value );
        }
        /*
          https://github.com/acornjs/acorn
        */
        var parseur_javascript=window.acorn.Parser;
        try{
            var tabComment=[];
            /* on transforme le javascript en ast */
            var obj=parseur_javascript.parse( a.value , {"ecmaVersion" : 'latest' ,"sourceType" : 'module' ,"ranges" : false ,"onComment" : tabComment} );
            /* on transforme le ast en rev */
            var obj=__m_astjs_vers_rev1.traite_ast( obj.body , tabComment , {} );
            if(obj.__xst === __xsu){
                document.getElementById( nom_de_la_text_area_rev ).value=obj.__xva;
                var tableau1=__m_rev1.txt_en_tableau( obj.__xva );
                var matriceFonction=__m_rev1.tb_vers_matrice( tableau1.__xva , true , false , '' );
                if(matriceFonction.__xst === __xsu){
                    /*
                      var startMicro = performance.now();
                    */
                    var obj2=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
                    if(obj2.__xst === __xsu){
                        document.getElementById( nom_de_la_text_area_rev ).value=obj2.__xva;
                    }
                }else{
                    __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur rev'} );
                }
            }else{
                this.remplir_et_afficher_les_messages1( nom_de_la_text_area_js );
            }
        }catch(e){
            /* console.error('e=',e); */
            debugger;
            if(e.pos){
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2( e ) + '"' + e.message + '"' ,"plage" : [e.pos,e.pos]} );
            }else{
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2( e ) + '"' + e.message + '"'} );
            }
        }
        this.remplir_et_afficher_les_messages1( nom_de_la_text_area_js );
    }
    /*
      =============================================================================================================
      convertir le contenu d'une textearea rev et le mettre le résultat js dans une textarea
      =============================================================================================================
    */
    convertir_textearea_rev_vers_textarea_js2( chp_rev_source , chp_genere_source , id_source , id_cible ){
        this.raz_des_messages();
        var a=document.getElementById( chp_rev_source );
        var startMicro=performance.now();
        var obj=__m_rev_vers_js1.c_rev_vers_js( a.value , {} );
        var endMicro=performance.now();
        /* console.log('%c\n\n=============\nconvertion de rev en js ='+(parseInt((endMicro - startMicro) * 1000,10) / 1000) + ' ms','background:lightblue;'); */
        if(obj.__xst === __xsu){
            document.getElementById( chp_genere_source ).value=obj.__xva;
            if(id_source !== null && id_cible !== null){
                var parametres_sauvegarde={"matrice" : obj.matriceFonction ,"chp_provenance_rev" : 'source' ,"chx_source_rev" : id_source ,"id_cible" : id_cible};
                sauvegarder_format_rev_en_dbb( parametres_sauvegarde );
            }
        }else{
            document.getElementById( chp_genere_source ).value='erreur de conversion';
        }
        this.remplir_et_afficher_les_messages1( chp_rev_source );
    }
    /*
      =============================================================================================================
      convertir le contenu d'une textearea rev et le mettre le résultat php dans une textarea
      =============================================================================================================
    */
    convertir_textearea_rev_vers_textarea_php2( nom_zone_source_rev , nom_zone_genere_php , id_source , id_cible ){
        this.raz_des_messages();
        var a=document.getElementById( nom_zone_source_rev );
        var startMicro=performance.now();
        var obj=__m_rev_vers_php1.c_rev_vers_php( a.value , {} );
        var endMicro=performance.now();
        var tm=parseInt( (endMicro - startMicro) * 1000 , 10 ) / 1000;
        console.log( '%c\n\n=============\nconvertion de rev en php en ' + tm + ' ms' , 'background:lightblue;' );
        if(obj.__xst === __xsu){
            document.getElementById( nom_zone_genere_php ).value=obj.__xva;
            if(id_source !== null && id_cible !== null){
                var parametres_sauvegarde={"matrice" : obj.matriceFonction ,"chp_provenance_rev" : 'source' ,"chx_source_rev" : id_source ,"id_cible" : id_cible};
                sauvegarder_format_rev_en_dbb( parametres_sauvegarde );
            }
        }else{
            document.getElementById( nom_zone_genere_php ).value='erreur de conversion';
        }
        this.remplir_et_afficher_les_messages1( nom_zone_source_rev );
    }
    /*
      =============================================================================================================
      convertir le contenu d'une textearea rev php et le mettre le résultat php dans une textarea
      =============================================================================================================
    */
    convertir_textearea_rev_vers_textarea_php( nom_zone_source_rev , nom_zone_genere_php , bouton_interface=false ){
        this.raz_des_messages();
        var a=document.getElementById( nom_zone_source_rev );
        var startMicro=performance.now();
        var tableau1=__m_rev1.txt_en_tableau( a.value );
        var endMicro=performance.now();
        /* console.log('\n\n=============\nmise en tableau endMicro=',(parseInt((endMicro - startMicro) * 1000,10) / 1000) + ' ms'); */
        var matriceFonction=__m_rev1.tb_vers_matrice( tableau1.__xva , true , false , '' );
        if(matriceFonction.__xst === __xsu){
            var objPhp=__m_rev_vers_php1.c_tab_vers_php( matriceFonction.__xva , {} );
            debugger;
            /* avrif */
            if(objPhp.__xst === __xsu){
                document.getElementById( nom_zone_genere_php ).value=objPhp.__xva;
                if(bouton_interface === true){
                    /* pour firefox ! */
                    return;
                }
                return({"__xst" : __xsu ,"__xva" : matriceFonction.__xva});
            }
        }
        this.remplir_et_afficher_les_messages1( nom_zone_source_rev );
        if(bouton_interface === true){
            /* pour firefox ! */
            return;
        }
        return({"__xst" : __xsu});
    }
    /*
      =============================================================================================================
      convertir le contenu d'une textearea php et le mettre le résultat rev dans une textarea
      =============================================================================================================
    */
    convertir_text_area_php_en_rev_avec_php_parseur_js( nom_de_la_text_area_php , nom_de_la_text_area_rev , options_traitement , sauvegarder_en_stockage_local ){
        var options_traitement=JSON.parse( options_traitement.replace( /\'/g , '"' ) );
        document.getElementById( nom_de_la_text_area_rev ).value='Veuillez patienter !';
        this.raz_des_messages();
        var a=document.getElementById( nom_de_la_text_area_php );
        if(sauvegarder_en_stockage_local !== false){
            localStorage.setItem( "fta_indexhtml_php_dernier_fichier_charge" , a.value );
        }
        var lines=a.value.split( /\r|\r\n|\n/ );
        var count=lines.length;
        try{
            /* ✍ {parser:{extractDoc: true,php7: true,},ast:{withPositions: true}} */
            /* var startMicro=performance.now(); */
            var parseur=window.PhpParser.Engine( {"parser" : {"extractDoc" : true} ,"ast" : {"withPositions" : true}} );
            /* on retire les sources compris entre  sql_inclure_deb et sql_inclure_fin */
            let regex=/\/\*sql_inclure_deb[\s\S]*?sql_inclure_fin\*\//g;
            let php_moins_commentaires_sql=a.value.replace( regex , '' );
            var ast_de_php=parseur.parseCode( php_moins_commentaires_sql );
            var obj=__m_astphpparseur_vers_rev1.traite_ast( ast_de_php , options_traitement );
            if(obj.__xst === __xsu){
                document.getElementById( nom_de_la_text_area_rev ).value=obj.__xva;
                if(obj.__xva.substr( 0 , 4 ) !== 'php('){
                    var tableau1=__m_rev1.txt_en_tableau( 'php(' + obj.__xva + ')' );
                }else{
                    var tableau1=__m_rev1.txt_en_tableau( obj.__xva );
                }
                var matriceFonction=__m_rev1.tb_vers_matrice( tableau1.__xva , true , false , '' );
                if(matriceFonction.__xst === __xsu){
                    var obj2=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
                    if(obj2.__xst === __xsu){
                        document.getElementById( nom_de_la_text_area_rev ).value=obj2.__xva;
                    }else{
                        this.remplir_et_afficher_les_messages1( nom_de_la_text_area_rev );
                    }
                }else{
                    this.remplir_et_afficher_les_messages1( nom_de_la_text_area_rev );
                }
            }else{
                this.remplir_et_afficher_les_messages1( nom_de_la_text_area_php );
            }
            /*
              var endMicro=performance.now();
              console.log(endMicro - startMicro); 
            */
        }catch(e){
            /* console.error(e); */
            debugger;
            if(e.lineNumber){
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2( e ) + 'erreur dans le source php : <br />' + e.message ,"ligne" : e.lineNumber} );
            }else{
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2( e ) + 'erreur dans le source php : <br />' + e.message} );
            }
            this.remplir_et_afficher_les_messages1( nom_de_la_text_area_php );
        }
        this.remplir_et_afficher_les_messages1( nom_de_la_text_area_php );
    }
    /*
      =============================================================================================================
    */
    convertir_textearea_rev_vers_textarea_html( nom_de_la_textarea_rev , nom_de_la_textarea_html ){
        __gi1.raz_des_messages();
        var a=document.getElementById( nom_de_la_textarea_rev );
        var tableau1=__m_rev1.txt_en_tableau( a.value );
        var obj1=__m_rev1.tb_vers_matrice( tableau1.__xva , false , true , '' );
        if(obj1.__xst === __xsu){
            var obj2=__module_html1.tabToHtml1( obj1.__xva , 0 , false , 0 );
            if(obj2.__xst === __xsu){
                document.getElementById( nom_de_la_textarea_html ).value=obj2.__xva;
                __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : 'html produit'} );
            }else{
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur de reconstruction du html'} );
            }
        }else{
            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'erreur pour le rev'} );
        }
        __gi1.remplir_et_afficher_les_messages1( nom_de_la_textarea_rev );
    }
    /*
      =============================================================================================================
    */
    convertir_text_area_html_en_rev( nom_de_la_textarea , options ){
        try{
            var options_json=JSON.parse( options.replace( /\'/g , '"' ) );
            options_json['zone_source']=nom_de_la_textarea;
        }catch(e){
            console.log( e );
            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : '0050 convertit-html-en-rev.js erreur dans les paramètres option'} );
            __gi1.remplir_et_afficher_les_messages1( 'txtar2' );
            return;
        }
        if(options_json.hasOwnProperty( 'zone_html_rev' )){
            document.getElementById( options_json.zone_html_rev ).value='';
        }
        if(options_json.hasOwnProperty( 'zone_html_resultat' )){
            document.getElementById( options_json.zone_html_resultat ).value='';
        }
        __gi1.raz_des_messages();
        var a=document.getElementById( nom_de_la_textarea );
        localStorage.setItem( 'fta_traitehtml_dernier_fichier_charge' , a.value );
        var lines=a.value.split( /\r\n|\r|\n/ );
        var count=lines.length;
        var obj=__module_html1.TransformHtmlEnRev( a.value , 0 , options_json );
        if(obj.__xst == true){
            if(obj.hasOwnProperty( 'traitements_javascript_integres_en_cours' )
                   && obj.traitements_javascript_integres_en_cours === true
            ){
            }else{
                var tableau1=__m_rev1.txt_en_tableau( obj.__xva );
                var matriceFonction=__m_rev1.tb_vers_matrice( tableau1.__xva , true , false , '' );
                if(matriceFonction.__xst === __xsu){
                    var obj2=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
                    if(obj2.__xst === __xsu){
                        if(options_json.hasOwnProperty( 'zone_html_rev' )){
                            document.getElementById( options_json.zone_html_rev ).value=obj2.__xva;
                        }
                    }else{
                        if(options_json.hasOwnProperty( 'zone_html_rev' )){
                            document.getElementById( options_json.zone_html_rev ).value=obj.__xva;
                        }
                    }
                }else{
                    if(options_json.hasOwnProperty( 'zone_html_rev' )){
                        document.getElementById( options_json.zone_html_rev ).value=obj.__xva;
                    }
                }
                if(options_json.hasOwnProperty( 'zone_html_rev' )){
                    __gi1.remplir_et_afficher_les_messages1( options_json.zone_html_rev );
                }else{
                    __gi1.remplir_et_afficher_les_messages1( nom_de_la_textarea );
                }
            }
        }else{
            if(options_json.hasOwnProperty( 'zone_source' )){
                __gi1.remplir_et_afficher_les_messages1( options_json.zone_source );
            }else{
                __gi1.remplir_et_afficher_les_messages1( nom_de_la_textarea );
            }
        }
        return;
    }
    /*
      =============================================================================================================
    */
    traitement_apres_recuperation_ast_de_php2_ok( par ){
        /* console.log(par); */
        var options=par.__entree.call.opt;
        var nom_de_la_text_area_rev='';
        var nom_de_la_text_area_php='';
        if(options.hasOwnProperty( 'nom_de_la_text_area_rev' )){
            nom_de_la_text_area_rev=options.nom_de_la_text_area_rev;
        }
        if(options.hasOwnProperty( 'nom_de_la_text_area_php' )){
            nom_de_la_text_area_php=options.nom_de_la_text_area_php;
        }
        try{
            var json_de_ast=JSON.parse( par.__xva );
            var obj=__m_astphpnikic_vers_rev1.traite_ast_nikic( json_de_ast , options );
            if(obj.__xst === __xsu){
                /* console.log(obj); */
                if(nom_de_la_text_area_rev !== ''){
                    document.getElementById( options.nom_de_la_text_area_rev ).value=obj.__xva;
                    if(obj.__xva.substr( 0 , 4 ) !== 'php('){
                        var tableau1=__m_rev1.txt_en_tableau( 'php(' + obj.__xva + ')' );
                    }else{
                        var tableau1=__m_rev1.txt_en_tableau( obj.__xva );
                    }
                    var matriceFonction=__m_rev1.tb_vers_matrice( tableau1.__xva , true , false , '' );
                    if(matriceFonction.__xst === __xsu){
                        var obj2=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
                        if(obj2.__xst === __xsu){
                            document.getElementById( options.nom_de_la_text_area_rev ).value=obj2.__xva;
                        }else{
                            this.remplir_et_afficher_les_messages1( options.nom_de_la_text_area_rev );
                        }
                    }else{
                        this.remplir_et_afficher_les_messages1( options.nom_de_la_text_area_rev );
                    }
                }
            }else{
                debugger;
                console.log( obj );
            }
        }catch(e){
            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2( e ) + '<br />' + e.message} );
        }
        this.remplir_et_afficher_les_messages1( nom_de_la_text_area_php );
    }
    /*
      =============================================================================================================
    */
    traitement_apres_recuperation_ast_de_php2_ko( reponse_ajax , json_de_reponse=null ){
        if(json_de_reponse !== null){
            if(json_de_reponse.hasOwnProperty( '__xst' )){
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'Retour serveur, __xst="' + JSON.stringify( json_de_reponse.__xst ) + '"'} );
            }else{
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'pas de "__xst" dans le Retour serveur'} );
            }
            if(json_de_reponse.hasOwnProperty( '__xms' )){
                for(var i in json_de_reponse.__xms){
                    if(json_de_reponse.__xms[i].indexOf( ' on line ' ) >= 0){
                        var num_ligne=parseInt( json_de_reponse.__xms[i].substr( json_de_reponse.__xms[i].indexOf( ' on line ' ) + 9 ) , 10 );
                        __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : json_de_reponse.__xms[i] ,"ligne" : num_ligne} );
                    }else{
                        __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : json_de_reponse.__xms[i]} );
                    }
                }
                if(json_de_reponse.hasOwnProperty( '__entree' )
                       && json_de_reponse.__entree.hasOwnProperty( 'call' )
                       && json_de_reponse.__entree.call.hasOwnProperty( 'opt' )
                ){
                    var options=json_de_reponse.__entree.call.opt;
                    if(options.hasOwnProperty( 'nom_de_la_text_area_php' )){
                        this.remplir_et_afficher_les_messages1( options.nom_de_la_text_area_php );
                    }else{
                        this.remplir_et_afficher_les_messages1( '' );
                    }
                }else{
                    this.remplir_et_afficher_les_messages1( '' );
                }
            }else{
                debugger;
                this.remplir_et_afficher_les_messages1( '' );
            }
        }else{
            /* on retire les caractéristiques graphiques sur les messages au standard php */
            if(reponse_ajax !== ''){
                reponse_ajax=reponse_ajax.replace( "<font size='1'>" , '<font>' );
                reponse_ajax=reponse_ajax.replace( "font-size: x-large;" , '' );
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : reponse_ajax} );
            }
            this.remplir_et_afficher_les_messages1( '' );
        }
    }
    /*
      =============================================================================================================
    */
    transform_rev_de_textarea_en_sql2( nom_de_la_textarea_rev , nom_de_la_textarea_sql ){
        this.raz_des_messages();
        var tableau1=__m_rev1.txt_en_tableau( document.getElementById( nom_de_la_textarea_rev ).value );
        var obj1=__m_rev1.tb_vers_matrice( tableau1.__xva , false , true , '' );
        if(obj1.__xst === __xsu){
            var obj2=__m_rev_vers_sql1.c_tab_vers_js( obj1.__xva , {} );
            if(obj2.__xst === __xsu){
                obj2.__xva=obj2.__xva.replace( /\/\* ==========DEBUT DEFINITION=========== \*\//g , '' );
                document.getElementById( nom_de_la_textarea_sql ).value=obj2.__xva;
                __gi1.remplir_et_afficher_les_messages1( nom_de_la_textarea_sql );
                return;
            }
        }
        __gi1.remplir_et_afficher_les_messages1( nom_de_la_textarea_rev );
    }
    /*
      =============================================================================================================
    */
    transform_sql_de_textarea_en_rev2( nom_de_la_textarea_sql , nom_de_la_textarea_rev ){
        this.raz_des_messages();
        var texte=document.getElementById( nom_de_la_textarea_sql ).value;
        localStorage.setItem( 'fta_traiteSql_dernier_fichier_charge' , texte );
        try{
            texte=texte.replace( /\/\*\*\//g , '' );
            var ast=window.sqliteParser( texte , {} );
            var obj=__m_astsqliteparseur_vers_rev1.traite_ast_de_sqliteparseur( ast );
            if(obj.__xst === __xsu){
                document.getElementById( nom_de_la_textarea_rev ).value=obj.__xva;
                this.remplir_et_afficher_les_messages1( nom_de_la_textarea_rev );
                var tableau1=__m_rev1.txt_en_tableau( obj.__xva );
                var obj1=__m_rev1.tb_vers_matrice( tableau1.__xva , false , true , '' );
                if(obj1.__xst === __xsu){
                    var obj2=__m_rev_vers_sql1.c_tab_vers_js( obj1.__xva , {} );
                    if(obj2.__xst === __xsu){
                        __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : 'sql => rev ok et rev => sql  OK'} );
                        this.remplir_et_afficher_les_messages1( '' );
                        obj2.__xva=obj2.__xva.replace( /\/\* ==========DEBUT DEFINITION=========== \*\//g , '' );
                        document.getElementById( 'txtar3' ).value=obj2.__xva;
                    }else{
                        __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} );
                        this.remplir_et_afficher_les_messages1( '' );
                        return;
                    }
                }else{
                    __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} );
                    this.remplir_et_afficher_les_messages1( nom_de_la_textarea_rev );
                    return;
                }
            }else{
                __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2()} );
                this.remplir_et_afficher_les_messages1( nom_de_la_textarea_sql );
            }
        }catch(e){
            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : __m_rev1.nl2( e ) + 'erreur de reconstruction du sql<br />' + e.message} );
            this.remplir_et_afficher_les_messages1( nom_de_la_textarea_sql );
        }
    }
    /*
      =============================================================================================================
    */
    bouton_convertir_text_area_php_en_rev_avec_nikic2( nom_de_la_text_area_php , nom_de_la_text_area_rev , options_traitement , mettre_en_local_storage ){
        var options_traitement=JSON.parse( options_traitement.replace( /\'/g , '"' ) );
        options_traitement.nom_de_la_text_area_php=nom_de_la_text_area_php;
        options_traitement.nom_de_la_text_area_rev=nom_de_la_text_area_rev;
        document.getElementById( nom_de_la_text_area_rev ).value='Veuillez patienter !';
        this.raz_des_messages();
        var a=document.getElementById( nom_de_la_text_area_php );
        if(mettre_en_local_storage){
            localStorage.setItem( "fta_indexhtml_php_dernier_fichier_charge" , a.value );
        }
        __m_astphpnikic_vers_rev1.recupere_ast_de_php_du_serveur( a.value , options_traitement , this.traitement_apres_recuperation_ast_de_php2_ok.bind( this ) , this.traitement_apres_recuperation_ast_de_php2_ko.bind( this ) );
    }
    /*
      =============================================================================================================
    */
    lire_un_rev_et_le_transformer_en_tableau( nom_de_la_textarea , autoriser_constante_dans_la_racine=false ){
        this.raz_des_messages();
        console.log( '\n=========================\ndébut de transforme' );
        document.getElementById( 'resultat1' ).innerHTML='';
        var a=document.getElementById( nom_de_la_textarea );
        localStorage.setItem( "fta_indexhtml_dernier_fichier_charge" , a.value );
        var lines=a.value.split( /\r|\r\n|\n/ );
        var count=lines.length;
        a.setAttribute( 'rows' , count + 1 );
        var beginMicro=performance.now();
        var startMicro=performance.now();
        var tableau1=__m_rev1.txt_en_tableau( a.value );
        var endMicro=performance.now();
        console.log( 'mise en tableau endMicro=' , (parseInt( (endMicro - startMicro) * 1000 , 10 ) / 1000) + ' ms' );
        /* ✍  console.log(a.value.substr(4,1),a.value.length) */
        var startMicro=performance.now();
        var matriceFonction1=__m_rev1.tb_vers_matrice( tableau1.__xva , true , autoriser_constante_dans_la_racine , '' );
        var endMicro=performance.now();
        console.log( 'analyse syntaxique endMicro=' , (parseInt( (endMicro - startMicro) * 1000 , 10 ) / 1000) + ' ms' );
        var tempsTraitement=(parseInt( (endMicro - beginMicro) * 1000 , 10 ) / 1000) + ' ms';
        console.log( matriceFonction1 );
        /* ✍  console.log(JSON.stringify(matriceFonction1.value)); */
        document.getElementById( 'resultat1' ).innerHTML='';
        if(matriceFonction1.__xst === __xsu){
            var parent=document.getElementById( 'resultat1' );
            var startMicro=performance.now();
            var fonctionReecriteAvecRetour1=__m_rev1.matrice_vers_source_rev1( matriceFonction1.__xva , 0 , true , 1 );
            var resultat_compacte_ok='';
            var diResultatsCompactes=document.createElement( 'div' );
            if(fonctionReecriteAvecRetour1.__xst === __xsu){
                var compacteOriginal=__m_rev1.matrice_vers_source_rev1( matriceFonction1.__xva , 0 , false , 1 );
                var tableau2=__m_rev1.txt_en_tableau( fonctionReecriteAvecRetour1.__xva );
                var matriceDeLaFonctionReecrite=__m_rev1.tb_vers_matrice( tableau2.__xva , true , autoriser_constante_dans_la_racine , '' );
                var compacteReecrit=__m_rev1.matrice_vers_source_rev1( matriceDeLaFonctionReecrite.__xva , 0 , false , 1 );
                if(compacteOriginal.__xst === __xsu && compacteReecrit.__xst === __xsu){
                    if(compacteOriginal.__xva == compacteReecrit.__xva){
                        diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<hr /><b style="color:green;">👍 sources compactés Egaux</b><br />';
                        resultat_compacte_ok=__m_rev1.entitees_html( compacteOriginal.__xva );
                        __m_rev1.empiler_erreur( {"__xst" : __xsu ,"__xme" : '👍 sources compactés Egaux : ' + tempsTraitement} );
                    }else{
                        diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<hr /><b style="color:red;">💥sources compactés différents</b>';
                        __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : '💥sources compactés différents'} );
                        diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<br />o=' + compacteOriginal.__xva;
                        diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<br />r=' + compacteReecrit.__xva;
                    }
                }else{
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<hr /><b style="color:red;">compacteOriginal=' + JSON.stringify( compacteOriginal ) + '</b>';
                    diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML + '<br /><b style="color:red;">compacteReecrit=' + JSON.stringify( compacteReecrit ) + '</b>';
                }
            }
            var endMicro=performance.now();
            console.log( 'tests compactes=' , (parseInt( (endMicro - startMicro) * 1000 , 10 ) / 1000) + ' ms' );
            document.getElementById( 'resultat1' ).appendChild( diResultatsCompactes );
            if(resultat_compacte_ok !== ''){
                var di_texte_compacte=document.createElement( 'div' );
                di_texte_compacte.className='yyconteneur_de_texte1';
                di_texte_compacte.innerHTML='<textarea rows="3" cols="30" style="overflow:scroll;" autocorrect="off" autocapitalize="off" spellcheck="false">' + resultat_compacte_ok + '</textarea>';
                document.getElementById( 'resultat1' ).appendChild( di_texte_compacte );
            }
            /*  */
            var fonctionReecriteAvecEtColoration1=__m_rev1.matrice_vers_source_rev1( matriceFonction1.__xva , 0 , true , 1 );
            var difonctionReecriteAvecRetour1=document.createElement( 'div' );
            difonctionReecriteAvecRetour1.className='yyconteneur_de_texte1';
            difonctionReecriteAvecRetour1.style.fontSize='0.9em';
            if(fonctionReecriteAvecEtColoration1.__xst === __xsu){
                difonctionReecriteAvecRetour1.innerHTML='<textarea class="txtar1" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false">' + __m_rev1.entitees_html( fonctionReecriteAvecEtColoration1.__xva ) + '</textarea>';
            }else{
                difonctionReecriteAvecRetour1.innerHTML='<textarea class="txtar1" rows="10" autocorrect="off" autocapitalize="off" spellcheck="false">' + __m_rev1.entitees_html( fonctionReecriteAvecRetour1.__xme ) + '</textarea>';
            }
            document.getElementById( 'resultat1' ).appendChild( difonctionReecriteAvecRetour1 );
            /*  */
            var t0=document.createElement( 'div' );
            t0.style.overflowX='scroll';
            var t1=document.createElement( 'table' );
            this.construit_tableau_html_de_le_matrice_rev( t1 , matriceFonction1 );
            t0.appendChild( t1 );
            document.getElementById( 'resultat1' ).appendChild( t0 );
            var t0=document.createElement( 'div' );
            t0.style.overflowX='scroll';
            var t2=document.createElement( 'table' );
            this.construit_un_html_du_tableau_des_caracteres( t2 , a.value , tableau1 );
            t0.appendChild( t2 );
            document.getElementById( 'resultat1' ).appendChild( t0 );
        }else{
            var t2=document.createElement( 'table' );
            this.construit_un_html_du_tableau_des_caracteres( t2 , a.value , tableau1 );
            document.getElementById( 'resultat1' ).appendChild( t2 );
        }
        this.remplir_et_afficher_les_messages1( nom_de_la_textarea );
    }
    /*
      =============================================================================================================
    */
    remplir_une_textarea_avec_un_source_de_test_html( nom_de_la_textarea ){
        var t=`<!DOCTYPE html>
<html lang="fr">
    <head>
        <title>Hello</title>
    </head>
    <body style="color:red;">
        <p>&lt;standars & poor's 2 tabulations entre les flèches =&gt;		&lt;=</p>
        <div>
            <a biza-rre="" href="www.example.com" style="color:red;" onclick="alert('1');alert(&quot;2&quot;)" class="">test</a>
            <a href="www.example.com" style="" class="">lien</a>
        </div>
        <!-- commentaire html : si vous devez mettre du javascript dans du html alors mettez le dans du CDATA -->
<script>
//<![CDATA[
//<source_javascript_rev>
/* commentaire javascript : si vous devez mettre du javascript dans du html alors mettez le dans du CDATA */
function monAlerte(a){
    alert(a);
}
monAlerte(0);
//</source_javascript_rev>
//]]>
</script>

    </body>
</html>`;
        document.getElementById( nom_de_la_textarea ).value=t;
    }
    /*
      =============================================================================================================
    */
    remplir_une_textarea_avex_un_source_de_test_js( nom_de_la_text_area_js ){
        var t=`var test=a===2;
(function toto(){
})();
var test0=a===2,test1=a==2;

a.b("c").d += '<e f="g">' + h.i[i] + "</e>";

for (var i = 0; i < b; i++) {
  a.b("c").d += '<e>' + h.i[i] + "</e>";
}
t = " ".repeat(NBESPACESSOURCEPRODUIT * i);
t += " ".repeat(NBESPACESSOURCEPRODUIT * i);
/*
  =====================================================================================================================
*/


function tagada() {
  for (var i = 0; i < __m_rev1.globale_messages.erreurs.length; i++) {
    document.getElementById("__m_rev1.globale_messages").innerHTML += '<div class="yyerreur">' + __m_rev1.globale_messages.erreurs[i] + "</div>";
  }
  var numLignePrecedente = -1;
  for (var i = 0; i < __m_rev1.globale_messages.ids.length; i++) {
    var id = __m_rev1.globale_messages.ids[i];
  }
}

`;
        document.getElementById( nom_de_la_text_area_js ).value=t;
    }
    /*
      =============================================================================================================
    */
    remplir_une_textarea_avex_un_source_de_test_php( nom_de_la_text_area_php ){
        var t=`<?php
$a=realpath(dirname(dirname(dirname(__FILE__))));
require($a.'/phplib/vendor/autoload.php');
/*
https://github.com/nikic/php-parser
*/
use PhpParser\\Error;
use PhpParser\\NodeDumper;
use PhpParser\\ParserFactory;

function toto(&$data){
    $parser = (new ParserFactory())->createForNewestSupportedVersion();
    try {
        $ast = $parser->parse($data[__entree]['texteSource']);
        $data[__xva]=json_encode($ast);
        $data[__xst]=__xsu;
    } catch (Error $error) {
       $data[__xms][]=$error->getMessage();
       return;
    }
}
/* si vous devez intégrer du javascript dans du html dans du php, mettez la partie javascript dans des CDATA */
$i=0;
while($i<5){
  if(1===1){
    for($i=0;$i<10;$i++){
      ?>hello<?php echo ' world';?> and others
<script type="text/javascript">
//<![CDATA[
  for(var i=0;i<10;i++){
      console.log('on est dans du javascript dans du html dans du php :-]');
  }
//]]>  
</script>
<?php
    }
  }
}
?>
<script type="text/javascript">
//<![CDATA[
  var b=2;
//]]>  
</script>
<script type="text/javascript">
//<![CDATA[
  var c=2;
//]]>  
</script>
    `;
        document.getElementById( nom_de_la_text_area_php ).value=t;
    }
    /*
      =============================================================================================================
    */
    remplir_une_textarea_avex_un_source_de_test_rev( nom_de_la_text_area_rev ){
        this.raz_des_messages();
        /*
          "àà" <- dans l'excellent notepad++ de windows, ces deux a avec un accent grave 
          n'ont pas le même aspect car ils ont un encodage différent.
          J'aimerais bien que les navigateurs fassent la même chose.
        */
        var t=`#( début aaaa  debut),
a(
  #(test , 👍,𤭢,àà),
  b(
    xx(
      y(
        #(dedans
          commentaire bloc
        ),
        t,
        v),
      #(aa),
      xx(
        #(dedans
          commentaire bloc
        )),
      #( bb),
      5,
      #(cc
      )
    ),
    #(comment 1),
    y(
      ' dd&nbsp;',
      #( bla
blu),
      ee,
      2,
      #( @ )
    ),
    #( comment 2 ),
    a(b())
  ),
  #(Iñtërnâtiônàà̀lizætiøn ☃ 💩 ❤ 😁 👍),
  f(g),
  #(👍😁💥💪👎☀🌞🟥🟩"àà")
)
a( p(/ " \\' \\" \\n \\r \\\\r \\\\n \\\\\\\\ /g) , p(" \\\\ \\" \\\\\\" \\n \\r '") , p(' \\\\ \\' \\n \\r "  ') ),
#(
p('\\\\\\' \\' \\r \\n ')


        a( p(/ " \\' \\" \\n \\r \\\\r \\\\n \\\\\\\\ /g) , p(" \\\\ \\" \\n \\r '") , p(' \\\\ \\n \\r "  ') ),

appelf(nomf(f),p(/\\\\\\\\n/g),p('\\\\n'),p('\\\\r'))
      affecte(sql , "\\r\\n \\" \\\\\\\\
      select * from toto
      "),

      affecte(sql , '\\n \\r \\\\r \\\\n 
      select * from toto
      '),

\
)`;
        document.getElementById( nom_de_la_text_area_rev ).value=t;
        /*
          var lines=t.split( /\r|\r\n|\n/ );
          var count=lines.length;
        */
        document.getElementById( nom_de_la_text_area_rev ).setAttribute( 'rows' , 30 );
    }
    /*
      =============================================================================================================
    */
    charger_source_de_test_sql( nom_de_la_textarea ){
        var t=`
delete FROM ma_belle_table where (x = 1 and y=2) or z=3;

UPDATE ma_belle_table SET champ1 = NULL , c2=1 , c3=(3+5) where ((x = 1 and y=2) or z=3);

INSERT INTO ma_belle_table(a,b,c) values( 1 , '2' , null ),(4,5,6),(1+2,3,4);

SELECT "T0".\`chi_id_dossier\` , \`chp_nom_dossier\` , \`chx_cible_dossier\` , T1.chp_dossier_cible , * , a+2,
concat( '=>' , \`chi_id_dossier\` , '<=') , count(*) , 5
FROM \`tbl_dossiers\` T0, 
      tata T2
      LEFT JOIN tbl_cibles   T1 ON T1.chi_id_cible  = T0.\`chx_cible_dossier\`
WHERE \`T0\`.\`chi_id_dossier\` = 1 and t2.id=t0.chi_id_dossier
ORDER BY chp_nom_dossier DESC , chx_cible_dossier ASC
LIMIT roro OFFSET 3;

BEGIN TRANSACTION;

    CREATE TABLE tbl_cibles (
    
        /**/ chi_id_cible INTEGER PRIMARY KEY ,
         chp_nom_cible STRING,
         chp_commentaire_cible STRING,
         chp_dossier_cible CHARACTER(3) NOT NULL DEFAULT  'xxx' 
    );
    
    CREATE  UNIQUE INDEX  idx_dossier_cible ON tbl_cibles( chp_dossier_cible ) ;
    
    CREATE TABLE tbl_dossiers (
    
        /**/ chi_id_dossier INTEGER PRIMARY KEY ,
         chp_nom_dossier CHARACTER(256) NOT NULL DEFAULT  '' ,
         chx_cible_dossier INTEGER REFERENCES 'tbl_cibles'('chi_id_cible') 
    );
    
    CREATE  UNIQUE INDEX  idx_cible_et_nom ON tbl_dossiers( chx_cible_dossier , chp_nom_dossier ) ;
    
COMMIT;

  `;
        document.getElementById( nom_de_la_textarea ).value=t;
    }
    /*
      =============================================================================================================
      function mouseWheelOnMenu
      =============================================================================================================
    */
    mouseWheelOnMenu( event ){
        event.preventDefault();
        var elem=event.target;
        var continuer=true;
        while(continuer){
            if(elem.nodeName === 'DIV'){
                if(elem.className.indexOf( 'menuScroller' ) >= 0){
                    continuer=false;
                    break;
                }
            }else if(elem.nodeName === 'BODY'){
                continuer=false;
                elem=null;
                break;
            }
            elem=elem.parentNode;
        }
        if(elem !== null){
            var scrollDelta=20;
            if(event.deltaY > 0){
                var current=parseInt( elem.scrollLeft , 10 );
                elem.scrollTo( current + scrollDelta , 0 );
            }else{
                var current=parseInt( elem.scrollLeft , 10 );
                elem.scrollTo( current - scrollDelta , 0 );
            }
        }
        return false;
    }
    /*
      =============================================================================================================
    */
    ajouter_un_commentaire_vide_et_reformater( nom_de_la_textarea ){
        var a=document.getElementById( nom_de_la_textarea );
        a.focus();
        if(a.selectionStart === a.selectionEnd){
            var nouveau_source=a.value.substr( 0 , a.selectionStart ) + '#()' + a.value.substr( a.selectionStart );
            a.value=nouveau_source;
            this.formatter_le_source_rev( nom_de_la_textarea );
        }
    }
    /*
      =============================================================================================================
    */
    formatter_le_source_rev( nom_de_la_textarea ){
        var a=document.getElementById( nom_de_la_textarea );
        /* var t0 = performance.now(); */
        var tableau1=__m_rev1.txt_en_tableau( a.value );
        /* var t1 = performance.now(); */
        /* console.log( "L'appel de txt_en_tableau a demandé " + (t1 - t0) + " millisecondes."); */
        /* ici, on ne quitte pas si il y a une erreur de niveau */
        var matriceFonction=__m_rev1.tb_vers_matrice( tableau1.__xva ,  /* niv */ false , false , '' );
        if(matriceFonction.__xst === __xsu){
            /*
              var startMicro = performance.now();
            */
            var obj2=__m_rev1.matrice_vers_source_rev1( matriceFonction.__xva , 0 , true , 1 );
            if(obj2.__xst === __xsu){
                a.value=obj2.__xva;
            }
            /*
              var endMicro = performance.now();
              var temps=parseInt((endMicro - startMicro) * 1000,10) / 1000;
              console.log(' temps = '+temps +'ms pour matriceFonction.length='+matriceFonction.length);
            */
        }else{
            this.remplir_et_afficher_les_messages1( nom_de_la_textarea );
        }
    }
    /*
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      fonction qui produit un tableau html de  la
      liste des caractères du source du programme
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
    */
    construit_un_html_du_tableau_des_caracteres( t2 , texteSource , objTableau ){
        var numeroLigne=0;
        var debut=0;
        var i=0;
        var j=0;
        var l01=0;
        var tmps='';
        var out=[];
        t2.setAttribute( 'class' , 'tableau2' );
        if(objTableau === null){
            /* On construit le tableau à partir du texte source */
            var outo={};
            outo=__m_rev1.txt_en_tableau( texteSource );
            out=outo.__xva;
        }else{
            out=objTableau.__xva;
        }
        /*
          première case du tableau = numéro de ligne
        */
        var tr1={};
        var td1={};
        tr1=document.createElement( 'tr' );
        td1=document.createElement( 'td' );
        td1.innerHTML=numeroLigne;
        tr1.appendChild( td1 );
        /* boucle principale */
        l01=out.length;
        for( i=0 ; i < l01 ; i++ ){
            var td1={};
            td1=document.createElement( 'td' );
            td1.innerHTML=out[i][0].replace( '\n' , '\\n' );
            tmps=out[i][0].codePointAt( 0 );
            td1.title='&amp;#' + tmps + '; (' + out[i][1] + ')';
            tr1.appendChild( td1 );
            /*
              =============================================================================================
              Si on a un retour chariot, on écrit les 
              cases contenant les positions des caractères
              =============================================================================================
            */
            if(out[i][0] == '\n'){
                t2.appendChild( tr1 );
                /*
                  =====================================================================================
                  indice dans tableau = première ligne des chiffres
                  =====================================================================================
                */
                var tr1={};
                var td1={};
                tr1=document.createElement( 'tr' );
                td1=document.createElement( 'td' );
                td1.setAttribute( 'class' , 'td2' );
                td1.innerHTML='&nbsp;';
                tr1.appendChild( td1 );
                for( j=debut ; j < i ; j++ ){
                    var td1={};
                    td1=document.createElement( 'td' );
                    if(out[j][1] == 1){
                        td1.setAttribute( 'class' , 'td2' );
                    }else{
                        td1.setAttribute( 'class' , 'td4' );
                    }
                    td1.innerHTML=j;
                    tr1.appendChild( td1 );
                }
                /*
                  =====================================================================================
                  position du backslash
                  =====================================================================================
                */
                var td1={};
                td1=document.createElement( 'td' );
                td1.setAttribute( 'class' , 'td2' );
                td1.innerHTML=j;
                tr1.appendChild( td1 );
                t2.appendChild( tr1 );
                /*
                  =====================================================================================
                  position dans la chaine = deuxième ligne des chiffres
                  car certains caractères utf8 sont codées sur 2 positions
                  =====================================================================================
                */
                var tr1={};
                var td1={};
                tr1=document.createElement( 'tr' );
                td1=document.createElement( 'td' );
                td1.setAttribute( 'class' , 'td2' );
                td1.innerHTML='&nbsp;';
                tr1.appendChild( td1 );
                for( j=debut ; j < i ; j++ ){
                    var td1={};
                    td1=document.createElement( 'td' );
                    if(out[j][1] == 1){
                        td1.setAttribute( 'class' , 'td2' );
                    }else{
                        td1.setAttribute( 'class' , 'td4' );
                    }
                    td1.innerHTML=out[j][2];
                    tr1.appendChild( td1 );
                }
                /*
                  =====================================================================================
                  position du backslash
                  =====================================================================================
                */
                var td1={};
                td1=document.createElement( 'td' );
                td1.setAttribute( 'class' , 'td2' );
                td1.innerHTML=out[j][2];
                tr1.appendChild( td1 );
                t2.appendChild( tr1 );
                /*
                  =====================================================================================
                  fin des lignes contenant les positions
                  =====================================================================================
                */
                debut=i + 1;
                numeroLigne=numeroLigne + 1;
                var tr1={};
                var td1={};
                tr1=document.createElement( 'tr' );
                td1=document.createElement( 'td' );
                td1.innerHTML=numeroLigne;
                tr1.appendChild( td1 );
                t2.appendChild( tr1 );
            }
        }
        /*
          =====================================================================================================
          FIN Si on a un retour chariot, on écrit les 
          cases contenant les positions des caractères
          =====================================================================================================
        */
        t2.appendChild( tr1 );
        /*
          =====================================================================================================
          indice dans tableau = première ligne des chiffres
          =====================================================================================================
        */
        var tr1={};
        var td1={};
        tr1=document.createElement( 'tr' );
        td1=document.createElement( 'td' );
        td1.setAttribute( 'class' , 'td2' );
        td1.innerHTML='&nbsp;';
        tr1.appendChild( td1 );
        for( j=debut ; j < i ; j++ ){
            var td1={};
            td1=document.createElement( 'td' );
            if(out[j][1] == 1){
                td1.setAttribute( 'class' , 'td2' );
            }else{
                td1.setAttribute( 'class' , 'td4' );
            }
            td1.innerHTML=j;
            tr1.appendChild( td1 );
        }
        /* finchoix suite du source */
        t2.appendChild( tr1 );
        /*
          =====================================================================================================
          pas de position du backslash
          =====================================================================================================
          
          
          
          =====================================================================================================
          position dans la chaine = deuxième ligne des chiffres
          =====================================================================================================
        */
        var tr1={};
        var td1={};
        tr1=document.createElement( 'tr' );
        td1=document.createElement( 'td' );
        td1.setAttribute( 'class' , 'td2' );
        td1.innerHTML='&nbsp;';
        tr1.appendChild( td1 );
        for( j=debut ; j < i ; j++ ){
            var td1={};
            td1=document.createElement( 'td' );
            if(out[j][1] == 1){
                td1.setAttribute( 'class' , 'td2' );
            }else{
                td1.setAttribute( 'class' , 'td4' );
            }
            td1.innerHTML=out[j][2];
            tr1.appendChild( td1 );
        }
        /*
          finchoix suite du source 
          et enfin, on ajoute la dernière ligne 
        */
        t2.appendChild( tr1 );
    }
    /*
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      fonction qui produit un tableau html de la
      forme matricielle du programme
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
    */
    construit_tableau_html_de_le_matrice_rev( t1 , matriceFonction ){
        /*  */
        var i=0;
        var j=0;
        var l01=0;
        var temp='';
        var tr1={};
        var td1={};
        var r1=new RegExp( ' ' , 'g' );
        var r2=new RegExp( '\n' , 'g' );
        var r3=new RegExp( '&' , 'g' );
        var r4=new RegExp( '<' , 'g' );
        var r5=new RegExp( '>' , 'g' );
        var r6=new RegExp( "\\\\'" , 'g' );
        var r7=new RegExp( '\r' , 'g' );
        var largeurTable1EnPx='1000';
        var largeurColonne1EnPx='400';
        t1.className='yytableauMatrice1';
        tr1=document.createElement( 'tr' );
        /*
          =====================================================================================================
          entête du tableau
          =====================================================================================================
        */
        l01=this.#global_enteteTableau.length;
        for( i=0 ; i < l01 ; i++ ){
            var td1={};
            td1=document.createElement( 'th' );
            td1.innerHTML=i + this.#global_enteteTableau[i][0];
            /*  */
            td1.setAttribute( 'title' , this.#global_enteteTableau[i][1] + '(' + i + ')' );
            tr1.appendChild( td1 );
        }
        t1.appendChild( tr1 );
        /*
          =====================================================================================================
          éléments du tableau
          =====================================================================================================
        */
        l01=matriceFonction.__xva.length;
        for( i=0 ; i < l01 ; i++ ){
            var tr1={};
            tr1=document.createElement( 'tr' );
            for( j=0 ; j < matriceFonction.__xva[i].length ; j++ ){
                var td1={};
                td1=document.createElement( 'td' );
                if(j == 1 || j == 13){
                    /* Pour la valeur ou les commentaires */
                    temp=String( matriceFonction.__xva[i][j] );
                    temp=temp.replace( r1 , '░' );
                    temp=temp.replace( r2 , '¶' );
                    temp=temp.replace( r3 , '&amp;' );
                    temp=temp.replace( r4 , '&lt;' );
                    temp=temp.replace( r5 , '&gt;' );
                    temp=temp.replace( r7 , 'r' );
                    if(matriceFonction.__xva[i][4] === 3){
                        temp=temp.replace( r6 , "'" );
                    }
                    td1.innerHTML=temp;
                    td1.style.whiteSpace='pre-wrap';
                    td1.style.verticalAlign='baseline';
                    td1.style.maxWidth=largeurColonne1EnPx + 'px';
                    td1.style.overflowWrap='break-word';
                }else if(j == 4){
                    td1.innerHTML=matriceFonction.__xva[i][j];
                    if(matriceFonction.__xva[i][j] === 1){
                    }else if(matriceFonction.__xva[i][j] === 2){
                        td1.style.background='lightgrey';
                    }
                }else{
                    td1.innerHTML=String( matriceFonction.__xva[i][j] );
                }
                td1.setAttribute( 'title' , this.#global_enteteTableau[j][1] + '(' + j + ')' );
                tr1.appendChild( td1 );
            }
            t1.appendChild( tr1 );
        }
    }
    /*
      =============================================================================================================
    */
    vers_le_haut_de_la_page( destination , duree ){
        Math.easeInOutQuad=function( t , b , c , d ){
            t/=d / 2;
            if(t < 1){
                return((c / 2) * t * t + b);
            }
            /* un point virgule est-il en trop ? */
            t--;
            return(((-c) / 2) * (t * (t - 2) - 1) + b);
        };
        var element=document.scrollingElement;
        var positionDeDepart=element && element.scrollTop || window.pageYOffset;
        var change=destination - positionDeDepart;
        var increment=20;
        var tempsCourant=0;
        var animerLeDecalage=function(){
            tempsCourant+=increment;
            var val=Math.easeInOutQuad( tempsCourant , positionDeDepart , change , duree );
            window.scrollTo( 0 , val );
            if(tempsCourant < duree){
                window.setTimeout( animerLeDecalage , increment );
            }
        };
        animerLeDecalage();
    }
    /*
      =============================================================================================================
      =============================================================================================================
    */
    deplace_la_zone_de_message(){
        var i=0;
        var haut=0;
        var bod=document.getElementsByTagName( 'body' )[0];
        var paddingTopBody=0;
        var bodyComputed=getComputedStyle( bod );
        var elem={};
        for(elem in bodyComputed){
            if('paddingTop' === elem){
                paddingTopBody=parseInt( bodyComputed[elem] , 10 );
            }
        }
        var contenuPrincipal=document.getElementById( 'contenuPrincipal' );
        var lesDivs=contenuPrincipal.getElementsByTagName( 'div' );
        for( i=0 ; i < lesDivs.length ; i++ ){
            if(lesDivs[i].className === 'menuScroller'){
                var menuUtilisateurCalcule=getComputedStyle( lesDivs[i] );
                var hauteurMenuUtilisateur=parseInt( menuUtilisateurCalcule['height'] , 10 );
                lesDivs[i].style.top=paddingTopBody + 'px';
                lesDivs[i].style.position='fixed';
                lesDivs[i].style.width='100vw';
                lesDivs[i].addEventListener( 'wheel' , this.mouseWheelOnMenu , false );
                paddingTopBody+=hauteurMenuUtilisateur;
            }
        }
        document.getElementById( this.#nom_div_des_messages1 ).style.top=(paddingTopBody + 2) + 'px';
        bod.style.paddingTop=paddingTopBody + 'px';
        /*
          ajustement de la position gauche des menus du haut, 
          c'est utile quand il y a beaucoup de menus
          en haut et qu'on est sur un petit appareil
        */
        var hrefActuel=window.location.href;
        if(hrefActuel.indexOf( '#' ) >= 1){
            hrefActuel=hrefActuel.substr( 0 , hrefActuel.indexOf( '#' ) );
        }
        if(hrefActuel.lastIndexOf( '/' ) >= 1 && hrefActuel.substr( hrefActuel.lastIndexOf( '/' ) + 1 ) !== ''){
            hrefActuel=hrefActuel.substr( hrefActuel.lastIndexOf( '/' ) + 1 );
            if(hrefActuel.indexOf( '?' ) >= 0){
                hrefActuel=hrefActuel.substr( 0 , hrefActuel.indexOf( '?' ) );
            }
            var lienActuel=null;
            var menuPrincipal=document.getElementById( 'menuPrincipal' );
            if(menuPrincipal){
                var listeMenu=menuPrincipal.getElementsByTagName( 'a' );
                for( i=0 ; i < listeMenu.length ; i++ ){
                    if(listeMenu[i].href && listeMenu[i].href.indexOf( hrefActuel ) >= 0){
                        lienActuel=listeMenu[i];
                        break;
                    }
                }
                if(lienActuel !== null){
                    for( i=0 ; i < listeMenu.length ; i++ ){
                        if(listeMenu[i] === lienActuel){
                            listeMenu[i].classList.add( 'yymenusel1' );
                        }else{
                            listeMenu[i].classList.remove( 'yymenusel1' );
                        }
                    }
                    var positionDuLien=lienActuel.getBoundingClientRect();
                    var boiteDesLiens=menuPrincipal.getBoundingClientRect();
                    var positionDroiteDuLienDansLaBoite=parseInt( (positionDuLien.left - boiteDesLiens.left) + positionDuLien.width , 10 );
                    var largeurBoiteLiens=parseInt( boiteDesLiens.width , 10 );
                    if(positionDroiteDuLienDansLaBoite > largeurBoiteLiens){
                        var calcul=parseInt( boiteDesLiens.width - positionDuLien.width - 60 , 10 );
                        if(parseInt( positionDuLien.x , 10 ) > calcul){
                            var nouveauScroll=positionDuLien.x - boiteDesLiens.width - positionDuLien.width - 60;
                            menuPrincipal.scrollLeft=nouveauScroll;
                        }
                    }
                }
                menuPrincipal.addEventListener( 'wheel' , this.mouseWheelOnMenu , false );
            }
        }
    }
    /*
      =============================================================================================================
      =============================================================================================================
    */
    parentheses1( nomDeLaTextAreaContenantLeSource ){
        var i=0;
        var zoneSource=document.getElementById( nomDeLaTextAreaContenantLeSource );
        var position_debut=zoneSource.selectionStart;
        var position_fin=zoneSource.selectionEnd;
        if(position_debut < 0){
            __m_rev1.empiler_erreur( {"__xst" : __xer ,"__xme" : 'veuillez sélectionner une parenthèse dans la zone de texte'} );
            this.remplir_et_afficher_les_messages1( nomDeLaTextAreaContenantLeSource );
            return;
        }
        var texte=zoneSource.value;
        if(position_fin === position_debut && texte.substr( position_debut - 1 , 1 ) == '('){
            /*
              
              on s'est placé juste après une parenthèse ouvrante
            */
            if(texte.substr( position_debut , 1 ) == ')'){
                /*
                  
                  on est entre 2 parenthèses ouvrante et fermante consécutives,
                */
                if(position_debut - 2 > 0){
                    for( i=position_debut - 2 ; i >= 1 ; i-- ){
                        if(texte.substr( i , 1 ) === '('){
                            texte=texte.substr( i );
                            var arr=__m_rev1.rev_parenthe1( texte , '(' );
                            if(arr.__xst === __xsu){
                                zoneSource.focus();
                                zoneSource.selectionStart=i + 1;
                                position_debut=i + 1;
                                zoneSource.selectionEnd=(position_debut + arr.posFerPar) - 1;
                                return;
                            }
                        }
                    }
                    zoneSource.focus();
                }else{
                    zoneSource.focus();
                }
            }else{
                texte=texte.substr( position_debut - 1 );
                console.log( 'texte="' , texte + '"' );
                var arr=__m_rev1.rev_parenthe1( texte , '(' );
                if(arr.__xst === __xsu){
                    zoneSource.focus();
                    zoneSource.selectionStart=position_debut;
                    zoneSource.selectionEnd=(position_debut + arr.posFerPar) - 1;
                    return;
                }
            }
        }else if(position_fin === position_debut && texte.substr( position_debut , 1 ) == ')'){
            /*
              on s'est placé juste avant une parenthèse fermante
            */
            texte=texte.substr( 0 , position_debut + 1 );
            var arr=__m_rev1.rev_parenthe1( texte , ')' );
            if(arr.__xst === __xsu){
                zoneSource.focus();
                zoneSource.selectionStart=arr.posOuvPar + 1;
                zoneSource.selectionEnd=position_debut;
                return;
            }
        }else{
            if(position_fin === position_debut){
                /*
                  on est placé quelquepart, on recherche la parenthèse ouvrante précédente
                */
                for( i=position_debut - 2 ; i >= 1 ; i-- ){
                    if(texte.substr( i , 1 ) === '('){
                        texte=texte.substr( i );
                        var arr=__m_rev1.rev_parenthe1( texte , '(' );
                        if(arr.__xst === __xsu){
                            zoneSource.focus();
                            zoneSource.selectionStart=i + 1;
                            position_debut=i + 1;
                            zoneSource.selectionEnd=(position_debut + arr.posFerPar) - 1;
                            return;
                        }
                    }
                }
                zoneSource.focus();
            }else if(position_fin !== position_debut){
                /*
                  c'est une sélection de plage entre 2 parenthèses
                */
                if(texte.substr( position_debut - 1 , 1 ) == '(' && texte.substr( position_fin , 1 ) == ')'){
                    /*
                      la plage est contenue dans 2 parenthèses, on essaie de remonter d'un niveau
                      en allant chercher le parenthèse ouvrante précédente
                    */
                    var tableau1=__m_rev1.txt_en_tableau( texte );
                    var matriceFonction=__m_rev1.tb_vers_matrice( tableau1.__xva , false , true , '' );
                    if(matriceFonction.__xst === __xsu){
                        var l01=matriceFonction.__xva.length;
                        var fait=false;
                        var repereDansTableau=-1;
                        for( i=0 ; i < tableau1.__xva.length ; i++ ){
                            if(tableau1.__xva[i][2] === position_debut){
                                repereDansTableau=i;
                                break;
                            }
                        }
                        if(repereDansTableau >= 0){
                            for( i=0 ; i < l01 ; i++ ){
                                if(matriceFonction.__xva[i][11] === repereDansTableau - 1){
                                    if(matriceFonction.__xva[i][7] > 0){
                                        var positionParentheseDuParent=matriceFonction.__xva[matriceFonction.__xva[i][7]][11];
                                        texte=texte.substr( positionParentheseDuParent );
                                        var arr=__m_rev1.rev_parenthe1( texte , '(' );
                                        if(arr.__xst === __xsu){
                                            zoneSource.focus();
                                            position_debut=tableau1.__xva[positionParentheseDuParent][2] + 1;
                                            position_fin=positionParentheseDuParent + arr.posFerPar;
                                            zoneSource.selectionStart=position_debut;
                                            zoneSource.selectionEnd=position_fin;
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                        if(fait === false){
                            zoneSource.focus();
                            return;
                        }
                    }
                }else{
                    /*
                      on est placé quelquepart, on recherche la parenthèse ouvrante précédente
                    */
                    for( i=position_debut - 2 ; i >= 1 ; i-- ){
                        if(texte.substr( i , 1 ) === '('){
                            texte=texte.substr( i );
                            var arr=__m_rev1.rev_parenthe1( texte , '(' );
                            if(arr.__xst === __xsu){
                                zoneSource.focus();
                                zoneSource.selectionStart=i + 1;
                                position_debut=i + 1;
                                zoneSource.selectionEnd=(position_debut + arr.posFerPar) - 1;
                                return;
                            }
                        }
                    }
                    zoneSource.focus();
                }
            }
        }
    }
    /*
      
      =============================================================================================================
    */
    selectionner_ligne_de_text_area1( tarea , numero_de_ligne_qui_commence_par_1 ){
        var lineNum=numero_de_ligne_qui_commence_par_1 <= 0 ? ( 1 ) : ( numero_de_ligne_qui_commence_par_1 );
        lineNum=lineNum - 1;
        var numeroLigne=0;
        var startPos=0;
        var endPos=0;
        var contenu=tarea.value;
        var l01=contenu.length;
        var i=0;
        for( i=0 ; i < l01 ; i++ ){
            if(contenu.substr( i , 1 ) === '\n'){
                numeroLigne++;
                if(numeroLigne === lineNum){
                    startPos=i + 1;
                    break;
                }
            }
        }
        var endPos=startPos;
        for( i=startPos ; i < l01 ; i++ ){
            endPos=i;
            if(contenu.substr( i , 1 ) === '\n'){
                break;
            }
        }
        if(i === l01){
            /* c'est la dernière ligne */
            endPos=l01;
        }
        if( typeof tarea.selectionStart !== 'undefined'){
            tarea.select();
            tarea.selectionStart=startPos;
            tarea.selectionEnd=endPos;
            var debut=startPos;
            var fin=endPos;
            tarea.select();
            tarea.selectionStart=debut;
            tarea.selectionEnd=fin;
            var texteDebut=contenu.substr( 0 , debut );
            var texteFin=contenu.substr( debut );
            tarea.value=texteDebut;
            tarea.scrollTo( 0 , 9999999 );
            var nouveauScroll=tarea.scrollTop;
            tarea.value=texteDebut + texteFin;
            if(nouveauScroll > 50){
                tarea.scrollTo( 0 , nouveauScroll + 50 );
            }else{
                tarea.scrollTo( 0 , 0 );
            }
            tarea.selectionStart=debut;
            tarea.selectionEnd=fin;
            return true;
        }
        if(document.selection && document.selection.createRange){
            tarea.focus();
            tarea.select();
            var range=document.selection.createRange();
            range.collapse( true );
            range.moveEnd( 'character' , endPos );
            range.moveStart( 'character' , startPos );
            range.select();
            return true;
        }
        return false;
    }
    /*
      =============================================================================================================
    */
    allerAlaLigne( i , nomTextAreaSource ){
        this.masquer_les_messages1( '' );
        this.selectionner_ligne_de_text_area1( document.getElementById( nomTextAreaSource ) , i );
    }
    /*
      =============================================================================================================
      on fixer_les_dimentions
      fixer les dimentions des éléments de l'interface ( taille des boutons, textes ... )
      =============================================================================================================
    */
    fixer_les_dimentions( type_d_element ){
        /*
          =====================================================================================================
          la première feuille de style [0] contient les éléments :root
        */
        var ss=document.styleSheets[0];
        var i=ss.cssRules.length - 1;
        for( i=ss.cssRules.length - 1 ; i >= 0 ; i-- ){
            if(ss.cssRules[i]['selectorText'] && ss.cssRules[i].selectorText.indexOf( ':root' ) >= 0){
                var a=ss.cssRules[i].cssText.split( '{' );
                try{
                    var b=a[1].split( '}' );
                    var c=b[0].split( ';' );
                    var t={};
                    var j=0;
                    for( j=0 ; j < c.length ; j++ ){
                        var d=c[j].split( ':' );
                        if(d.length === 2){
                            if('dimension_du_texte' === type_d_element && d[0].trim() === '--yyvtrt'){
                                if(d[1].trim().indexOf( '18' ) >= 0){
                                    t[d[0].trim()]='12px';
                                }else if(d[1].trim().indexOf( '12' ) >= 0){
                                    t[d[0].trim()]='14px';
                                }else if(d[1].trim().indexOf( '14' ) >= 0){
                                    t[d[0].trim()]='16px';
                                }else{
                                    t[d[0].trim()]='18px';
                                }
                            }else if('dimension_du_padding' === type_d_element && d[0].trim() === '--yyvtrp'){
                                if(d[1].trim().indexOf( '2' ) >= 0){
                                    t[d[0].trim()]='4px';
                                }else if(d[1].trim().indexOf( '4' ) >= 0){
                                    t[d[0].trim()]='6px';
                                }else{
                                    t[d[0].trim()]='2px';
                                }
                            }else if('dimension_du_border' === type_d_element && d[0].trim() === '--yyvtrb'){
                                if(d[1].trim().indexOf( '1' ) >= 0){
                                    t[d[0].trim()]='2px';
                                }else if(d[1].trim().indexOf( '2' ) >= 0){
                                    t[d[0].trim()]='3px';
                                }else if(d[1].trim().indexOf( '3' ) >= 0){
                                    t[d[0].trim()]='4px';
                                }else if(d[1].trim().indexOf( '4' ) >= 0){
                                    t[d[0].trim()]='5px';
                                }else{
                                    t[d[0].trim()]='1px';
                                }
                            }else if('dimension_du_margin' === type_d_element && d[0].trim() === '--yyvtrm'){
                                if(d[1].trim().indexOf( '1' ) >= 0){
                                    t[d[0].trim()]='2px';
                                }else if(d[1].trim().indexOf( '2' ) >= 0){
                                    t[d[0].trim()]='3px';
                                }else if(d[1].trim().indexOf( '3' ) >= 0){
                                    t[d[0].trim()]='4px';
                                }else if(d[1].trim().indexOf( '4' ) >= 0){
                                    t[d[0].trim()]='5px';
                                }else{
                                    t[d[0].trim()]='1px';
                                }
                            }else{
                                t[d[0].trim()]=d[1].trim();
                            }
                        }
                    }
                    /* cookie avec une date d'expiration de 30 jours */
                    var date_expiration_cookie=new Date( Date.now() + 86400000 * 30 );
                    date_expiration_cookie=date_expiration_cookie.toUTCString();
                    /*
                      =============================================================================
                      On met le résultat dans un cookie pour mettre à jour root à chaque chargement de la page
                    */
                    var cookieString=APP_KEY + '_biscuit' + '=' + encodeURIComponent( JSON.stringify( t ) ) + '; path=/; secure; expires=' + date_expiration_cookie + '; samesite=strict';
                    document.cookie=cookieString;
                    /* et on recharge la page */
                    window.location=window.location;
                    return;
                }catch(e){
                    console.log( 'raaah' , e );
                }
            }
        }
    }
    /*
      =============================================================================================================
      on afficher_ou_masquer_les_messages1
      =============================================================================================================
    */
    masquer_ou_afficher_les_messages1(){
        try{
            var zon=document.getElementById( this.#nom_div_des_messages1 );
            if(zon.style.visibility === 'hidden'){
                zon.style.visibility='visible';
            }else{
                zon.style.visibility='hidden';
            }
        }catch(e){}
    }
    /*
      =============================================================================================================
      on afficher_ou_masquer_les_messages1
      =============================================================================================================
    */
    masquer_les_messages1(){
        try{
            document.getElementById( this.#nom_div_des_messages1 ).style.visibility='hidden';
        }catch(e){}
    }
    /*
      
      =============================================================================================================
    */
    selectionner_une_plage1( debut , fin , nomDeZoneSource ){
        this.masquer_les_messages1( '' );
        var zoneSource=document.getElementById( nomDeZoneSource );
        zoneSource.focus();
        zoneSource.selectionStart=debut;
        zoneSource.selectionEnd=fin;
        var texteDebut=zoneSource.value.substr( 0 , debut );
        var texteFin=zoneSource.value.substr( debut );
        zoneSource.value=texteDebut;
        zoneSource.scrollTo( 0 , 9999999 );
        var nouveauScroll=zoneSource.scrollTop;
        zoneSource.value=texteDebut + texteFin;
        zoneSource.scrollTo( 0 , nouveauScroll );
        zoneSource.selectionStart=debut;
        zoneSource.selectionEnd=fin;
        if(this.#global_tableau_des_textareas.hasOwnProperty( nomDeZoneSource )){
            this.#global_tableau_des_textareas[nomDeZoneSource].mon_decallage_haut=nouveauScroll;
        }
    }
    /*
      =============================================================================================================
      vérifie qu'un html est structurellement correct ( pour intégration dans un rev php )
    */
    isHTML( str ){
        var i=0;
        var j=0;
        var c0='';
        var cp1='';
        var cm1='';
        var dansTag=false;
        var dansInner=true;
        var dansNomPropriete=false;
        var dansValeurPropriete=false;
        var dansNomTag=false;
        var caractereDebutProp='';
        var nomTag='';
        var dansBaliseFermante=false;
        var tabTags=[];
        var presDe='';
        var dansCdata=false;
        var dansTextArea=false;
        var l01=str.length;
        var niveau=0;
        var i=0;
        for( i=0 ; i < l01 ; i++ ){
            c0=str.substr( i , 1 );
            if(i < l01 - 1){
                cp1=str.substr( i + 1 , 1 );
            }else{
                cp1='';
            }
            if(i > 0 && l01 > 0){
                cm1=str.substr( i - 1 , 1 );
            }else{
                cm1='';
            }
            if(dansCdata === true){
                /*
                  =====================================================================================
                  premier cas spécial : cdata
                  =====================================================================================
                */
                var j=i;
                for( j=i ; j < l01 ; j++ ){
                    if(str.substr( j , 3 ) === ']]' + '>'){
                        i=j + 2;
                        break;
                    }
                }
                dansCdata=false;
                nomTag='';
                dansInner=true;
                dansTag=false;
                continue;
            }else if(dansTextArea === true){
                /*
                  =====================================================================================
                  deuxième cas spécial : textarea
                  =====================================================================================
                */
                var j=i;
                for( j=i ; j < l01 ; j++ ){
                    if(str.substr( j , 11 ).toLowerCase() === '</' + 'textarea>'){
                        i=j - 1;
                        break;
                    }
                }
                dansTextArea=false;
                nomTag='';
                dansInner=true;
                dansTag=false;
                continue;
            }else if(dansTag){
                if(dansNomPropriete){
                    if(c0 === ' ' || c0 === '\r' || c0 === '\n' || c0 === '\t'){
                        /* si on a un propriété du type async dans  <script async src="..."></script> */
                        dansNomPropriete=false;
                        /*#
                          if(i > 50){
                              presDe=str.substr(i - 50,i + 10);
                          }else{
                              presDe=str.substr(0,i + 10);
                          }
                          return({"__xst" : __xer ,"id" : i ,"__xme" : 'Erreur 1785 pres de "' + presDe + '"'});
                        */
                    }else if(c0 === '='){
                        if(cp1 === "'" || cp1 === '"'){
                            dansValeurPropriete=true;
                            dansNomPropriete=false;
                            caractereDebutProp=cp1;
                            i++;
                        }else{
                            if(i > 50){
                                presDe=str.substr( i - 50 , i + 10 );
                            }else{
                                presDe=str.substr( 0 , i + 10 );
                            }
                            return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' pres de "' + presDe + '"'});
                        }
                    }else{
                    }
                }else if(dansValeurPropriete){
                    if(c0 === caractereDebutProp){
                        if(cm1 === '\\'){
                        }else{
                            dansValeurPropriete=false;
                        }
                    }else{
                    }
                }else if(dansNomTag){
                    if(c0 === ' ' || c0 === '\r' || c0 === '\n' || c0 === '\t'){
                        if(dansCdata === true){
                            var j=i;
                            for( j=i ; j < l01 ; j++ ){
                                if(str.substr( j , 3 ) === ']]' + '>'){
                                    i=j + 2;
                                    break;
                                }
                            }
                            dansNomTag=false;
                            dansTag=false;
                            dansInner=true;
                            nomTag='';
                            continue;
                        }else{
                            if(nomTag.toLowerCase() === 'textarea'){
                                dansTextArea=true;
                            }
                            tabTags.push( nomTag );
                            dansNomTag=false;
                        }
                    }else if(c0 === '>'){
                        if(dansBaliseFermante){
                            dansNomTag=false;
                            dansInner=true;
                            dansTag=false;
                            if(nomTag === tabTags[tabTags.length - 1]){
                                /*
                                  on a bien une balise fermante correspondant à la palise ouvrante précédente
                                */
                                tabTags.pop();
                            }else{
                                return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'les balises html ne sont pas équilibrées'});
                            }
                            nomTag='';
                            dansBaliseFermante=false;
                            niveau--;
                        }else{
                            if(nomTag === ''){
                                if(i > 50){
                                    presDe=str.substr( i - 50 , i + 10 );
                                }else{
                                    presDe=str.substr( 0 , i + 10 );
                                }
                                return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'pres de "' + presDe + '"'});
                            }
                            if(nomTag.toLowerCase() === 'textarea'){
                                dansTextArea=true;
                            }
                            tabTags.push( nomTag );
                            dansNomTag=false;
                            dansInner=true;
                            dansTag=false;
                            nomTag='';
                        }
                    }else if(c0 === '=' || c0 === '"' || c0 === '\''){
                        if(i > 50){
                            presDe=str.substr( i - 50 , i + 10 );
                        }else{
                            presDe=str.substr( 0 , i + 10 );
                        }
                        return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'pres de "' + presDe + '"'});
                    }else{
                        nomTag+=c0;
                        if(nomTag === '![C' + 'DATA['){
                            dansCdata=true;
                        }
                    }
                }else{
                    if(nomTag === ''){
                        if(c0 === ' ' || c0 === '\r' || c0 === '\n' || c0 === '\t'){
                            if(i > 50){
                                presDe=str.substr( i - 50 , i + 10 );
                            }else{
                                presDe=str.substr( 0 , i + 10 );
                            }
                            return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + ' pres de "' + presDe + '"'});
                        }else{
                            dansNomTag=true;
                            nomTag+=c0;
                        }
                    }else{
                        /*
                          le tag a été fait, maintenant, c'est les propriétés 
                          ou la fin des propriétés ou un / pour une balise auto fermante ( <br /> )
                        */
                        if(c0 === ' ' || c0 === '\r' || c0 === '\n' || c0 === '\t'){
                        }else if(c0 === '/'){
                            if(cp1 === '>'){
                                nomTag='';
                                if(tabTags.length === 0){
                                    if(i > 50){
                                        presDe=str.substr( i - 50 , i + 10 );
                                    }else{
                                        presDe=str.substr( 0 , i + 10 );
                                    }
                                    return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'pres de "' + presDe + '"'});
                                }
                                tabTags.pop();
                                niveau--;
                                dansTag=false;
                                dansInner=true;
                                i++;
                            }
                        }else if(c0 === '>'){
                            if(nomTag === ''){
                                if(i > 50){
                                    presDe=str.substr( i - 50 , i + 10 );
                                }else{
                                    presDe=str.substr( 0 , i + 10 );
                                }
                                return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'pres de "' + presDe + '"'});
                            }
                            dansTag=false;
                            dansInner=true;
                            if(tabTags.length === 0){
                                if(i > 50){
                                    presDe=str.substr( i - 50 , i + 10 );
                                }else{
                                    presDe=str.substr( 0 , i + 10 );
                                }
                                return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'pres de "' + presDe + '"'});
                            }
                            /*
                              pas de pop ici, dans <a b="c">d</a>, on est sur le > avant le d
                            */
                            nomTag='';
                        }else{
                            if(c0 === '=' || c0 === '"' || c0 === '\''){
                                if(i > 50){
                                    presDe=str.substr( i - 50 , i + 10 );
                                }else{
                                    presDe=str.substr( 0 , i + 10 );
                                }
                                return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'pres de "' + presDe + '"'});
                            }else{
                                dansNomPropriete=true;
                            }
                        }
                    }
                }
            }else if(dansInner){
                if(c0 === '<'){
                    if(cp1 === '/'){
                        if(tabTags.length === 0){
                            if(i > 50){
                                presDe=str.substr( i - 50 , i + 10 );
                            }else{
                                presDe=str.substr( 0 , i + 10 );
                            }
                            return({"__xst" : __xer ,"id" : i ,"__xme" : __m_rev1.nl2() + 'pres de "' + presDe + '"'});
                        }
                        dansBaliseFermante=true;
                        i++;
                        dansInner=false;
                        dansTag=true;
                    }else{
                        if(cp1 === '!' && i < l01 - 4 && str.substr( i + 2 , 1 ) === '-' && str.substr( i + 3 , 1 ) === '-'){
                            /*
                              on est dans un commentaire
                            */
                            var fin_de_commentaire_trouve=-1;
                            for( j=i + 4 ; j <= l01 - 3 && fin_de_commentaire_trouve === -1 ; j++ ){
                                if(str.substr( j , 3 ) === '-->'){
                                    fin_de_commentaire_trouve=j;
                                }
                            }
                            if(fin_de_commentaire_trouve > 0){
                                i=fin_de_commentaire_trouve + 2;
                                dansTag=false;
                            }else{
                                niveau+=1;
                                dansInner=false;
                                dansTag=true;
                            }
                        }else{
                            niveau+=1;
                            dansInner=false;
                            dansTag=true;
                        }
                    }
                }else if(c0 === '>'){
                    if(niveau === 0){
                        if(i > 50){
                            presDe=str.substr( i - 50 , i + 10 );
                        }else{
                            presDe=str.substr( 0 , i + 10 );
                        }
                        return({"__xst" : __xer ,"id" : i ,"__xme" : 'Erreur 1935 pres de "' + presDe + '"'});
                    }
                }else{
                }
            }else{
                if(c0 === '<'){
                }else if(c0 === '>'){
                    debugger;
                    niveau-=1;
                    if(niveau < 0){
                        if(i > 50){
                            presDe=str.substr( i - 50 , i + 10 );
                        }else{
                            presDe=str.substr( 0 , i + 10 );
                        }
                        return({"__xst" : __xer ,"id" : i ,"__xme" : 'Erreur 1952 pres de "' + presDe + '"'});
                    }
                }
            }
        }
        if(tabTags.length > 0){
            if(i > 50){
                presDe=str.substr( i - 50 , i + 10 );
            }else{
                presDe=str.substr( 0 , i + 10 );
            }
            return({"__xst" : __xer ,"id" : i ,"__xme" : 'Erreur 1964 pres de "' + presDe + '"'});
        }
        if(dansTag){
            if(i > 50){
                presDe=str.substr( i - 50 , i + 10 );
            }else{
                presDe=str.substr( 0 , i + 10 );
            }
            return({"__xst" : __xer ,"id" : i ,"__xme" : 'Erreur 1972 pres de "' + presDe + '"'});
        }
        return({"__xst" : __xsu});
    }
    /*
      =============================================================================================================
    */
    #ne_rien_faire1( par ){
        /*
          on ne fait rien mais on le fait bien ici
          console.log('#ne_rien_faire1 par=',par);
        */
    }
    #global_tableau_des_textareas={};
    /*
      =============================================================================================================
    */
    #mouse_up_sur_editeur1( e ){
        var zoneSource=document.getElementById( e.target.id );
        this.#div_des_positions_du_curseur.innerHTML=zoneSource.selectionStart;
        var ttt=zoneSource.getBoundingClientRect();
        this.#div_des_positions_du_curseur.style.top=((parseInt( ttt.bottom , 10 ) + document.documentElement.scrollTop) - 12) + 'px';
        this.#div_des_positions_du_curseur.style.left=(parseInt( ttt.left , 10 ) + document.documentElement.scrollLeft) + 'px';
        /* this.#div_des_positions_du_curseur.style.left=document.documentElement.scrollLeft + 'px'; */
        return false;
    }
    /*
      =============================================================================================================
    */
    #analyse_scroll_editeur1( e ){
        return false;
    }
    /*
      =============================================================================================================
    */
    #keydown_sur_editeur1( e ){
        this.#global_tableau_des_textareas[e.target.id].mon_decallage_haut=e.target.scrollTop;
    }
    /*
      =============================================================================================================
    */
    #analyse_key_up_editeur1( e ){
        var i=0;
        var j=0;
        var c='';
        var a_inserer='';
        var tabtext=[];
        var elem=this.#global_tableau_des_textareas[e.target.id];
        var zoneSource=document.getElementById( e.target.id );
        this.#div_des_positions_du_curseur.innerHTML=zoneSource.selectionStart;
        var ttt=zoneSource.getBoundingClientRect();
        this.#div_des_positions_du_curseur.style.top=((parseInt( ttt.bottom , 10 ) + document.documentElement.scrollTop) - 10) + 'px';
        this.#div_des_positions_du_curseur.style.left=document.documentElement.scrollLeft + 'px';
        if(e.keyCode === 36){
            /* touche home : on décale le scroll au début et toute la page aussi */
            zoneSource.scrollTo( {"left" : 0} );
            window.scrollTo( {"left" : 0} );
        }else if(e.keyCode == 13){
            /* retour chariot */
            var scroll_initial=zoneSource.scrollTop;
            var startPos=zoneSource.selectionStart;
            var endPos=zoneSource.selectionEnd;
            var contenu=new String( zoneSource.value );
            if(startPos > 2){
                var ligne_precedente='';
                for( i=startPos - 2 ; i >= 0 ; i-- ){
                    c=contenu.substr( i , 1 );
                    if(c === '\n' || c === '\r'){
                        break;
                    }
                    ligne_precedente=c + ligne_precedente;
                }
                j=0;
                for( i=0 ; i < ligne_precedente.length ; i++ ){
                    j=i;
                    if(ligne_precedente.substr( i , 1 ) !== ' '){
                        break;
                    }
                    if(i === ligne_precedente.length - 1){
                        j++;
                    }
                }
                if(elem.mode && elem.mode === 'rev'){
                    if(contenu.substr( startPos - 2 , 1 ) === '('){
                        /* 1833 hugues à vérifier */
                        a_inserer=' '.repeat( j + NBESPACESREV );
                    }else{
                        a_inserer=' '.repeat( j );
                    }
                }else{
                    if(contenu.substr( startPos - 2 , 1 ) === '{'){
                        a_inserer=' '.repeat( j + NBESPACESSOURCEPRODUIT );
                    }else{
                        a_inserer=' '.repeat( j );
                    }
                }
                var nouveau_contenu=contenu.substring( 0 , startPos ) + a_inserer + contenu.substring( endPos );
                /* un point virgule est-il en trop ? */
                zoneSource.value=nouveau_contenu;
                zoneSource.selectionStart=startPos + a_inserer.length;
                zoneSource.selectionEnd=startPos + a_inserer.length;
            }
        }else if(e.keyCode == 86 && e.ctrlKey == true){
            /*
              pour une raison que je ne comprends pas, 
              Google Chrome fait bouger le scroll vertical d'une textarea
              quand on sélectionne une ligne y compris le retour à la ligne de fin
              et qu'on la copie sur elle même ... dans certains cas
              
            */
            if(zoneSource.scrollTop !== this.#global_tableau_des_textareas[e.target.id].mon_decallage_haut){
                zoneSource.scrollTop=this.#global_tableau_des_textareas[e.target.id].mon_decallage_haut;
            }
        }
    }
    /*
      =============================================================================================================
    */
    #initialiser_editeur_pour_une_textarea1( obj ){
        var id_de_la_text_area='';
        var mode='';
        if(obj.hasOwnProperty( 'nom' )){
            id_de_la_text_area=obj.nom;
            mode=obj.mode;
        }else{
            id_de_la_text_area=obj;
        }
        this.#global_tableau_des_textareas[id_de_la_text_area]={"mode" : mode ,"mon_decallage_haut" : 0};
        document.getElementById( id_de_la_text_area ).addEventListener( 'mouseup' , this.#mouse_up_sur_editeur1.bind( this ) );
        document.getElementById( id_de_la_text_area ).addEventListener( 'keydown' , this.#keydown_sur_editeur1.bind( this ) );
        document.getElementById( id_de_la_text_area ).addEventListener( 'keyup' , this.#analyse_key_up_editeur1.bind( this ) );
        /*
          document.getElementById(id_de_la_text_area).addEventListener("scroll",this.#analyse_scroll_editeur1.bind(this));
        */
    }
    /*
      =============================================================================================================
    */
    inserer_source1( nomFonction , id_de_la_textarea ){
        var i=0;
        var j=0;
        var k=0;
        var toAdd='';
        var espaces='';
        var zoneSource=document.getElementById( id_de_la_textarea );
        if(nomFonction === 'choix' || nomFonction === 'boucle' || nomFonction === 'appelf' || nomFonction === 'affecte'){
            if(zoneSource.selectionStart !== zoneSource.selectionEnd){
                alert( 'la sélection ne doit pas contenir un caractère' );
                return;
            }
            var position_selection=zoneSource.selectionStart;
            var texte_debut=zoneSource.value.substr( 0 , zoneSource.selectionStart );
            var texte_fin=zoneSource.value.substr( zoneSource.selectionStart );
            j=0;
            for( i=texte_debut.length - 1 ; i >= 0 ; i-- ){
                j++;
                if(texte_debut.substr( i , 1 ) === '\n'){
                    break;
                }
            }
            j--;
            if(j > 0){
                espaces=' '.repeat( j );
            }
            var de1=' '.repeat( NBESPACESREV );
            if(nomFonction === 'choix'){
                toAdd='choix(';
                toAdd+='\n' + espaces + de1 + 'si(';
                toAdd+='\n' + espaces + de1 + de1 + 'condition(';
                toAdd+='\n' + espaces + de1 + de1 + de1 + 'non(';
                toAdd+='\n' + espaces + de1 + de1 + de1 + de1 + '( egal(vrai , vrai) ),';
                toAdd+='\n' + espaces + de1 + de1 + de1 + de1 + 'et( egal( vrai , vrai ) )';
                toAdd+='\n' + espaces + de1 + de1 + de1 + ')';
                toAdd+='\n' + espaces + de1 + de1 + '),';
                toAdd+='\n' + espaces + de1 + de1 + 'alors(';
                toAdd+='\n' + espaces + de1 + de1 + de1 + 'affecte( a , 1 )';
                toAdd+='\n' + espaces + de1 + de1 + ')';
                toAdd+='\n' + espaces + de1 + '),';
                toAdd+='\n' + espaces + de1 + 'sinonsi(';
                toAdd+='\n' + espaces + de1 + de1 + 'condition( (true) ),';
                toAdd+='\n' + espaces + de1 + de1 + 'alors(';
                toAdd+='\n' + espaces + de1 + de1 + de1 + 'affecte(a , 1)';
                toAdd+='\n' + espaces + de1 + de1 + ')';
                toAdd+='\n' + espaces + de1 + '),';
                toAdd+='\n' + espaces + de1 + 'sinon(';
                toAdd+='\n' + espaces + de1 + de1 + 'alors(';
                toAdd+='\n' + espaces + de1 + de1 + de1 + 'affecte(a , 1)';
                toAdd+='\n' + espaces + de1 + de1 + ')';
                toAdd+='\n' + espaces + de1 + de1 + '#(finsinon)';
                toAdd+='\n' + espaces + de1 + '),';
                toAdd+='\n' + espaces + '),';
                toAdd+='\n' + espaces + '#(finchoix suite du source)';
            }else if(nomFonction === 'boucle'){
                toAdd='boucle(';
                toAdd+='\n' + espaces + de1 + 'initialisation(affecte(i , 0)),';
                toAdd+='\n' + espaces + de1 + 'condition(inf(i , tab.length)),';
                toAdd+='\n' + espaces + de1 + 'increment(affecte(i , i+1)),';
                toAdd+='\n' + espaces + de1 + 'faire(';
                toAdd+='\n' + espaces + de1 + de1 + 'affecte(a , 1)';
                toAdd+='\n' + espaces + de1 + ')';
                toAdd+='\n' + espaces + '),';
                toAdd+='\n' + espaces + '#(fin boucle, suite du source)';
            }else if(nomFonction === 'appelf'){
                toAdd='appelf(';
                toAdd+='\n' + espaces + de1 + 'r(variableDeRetour),';
                toAdd+='\n' + espaces + de1 + 'element(nomElement),';
                toAdd+='\n' + espaces + de1 + 'nomf(nomFonction),';
                toAdd+='\n' + espaces + de1 + 'p(parametre1),';
                toAdd+='\n' + espaces + de1 + 'p(parametre2)';
                toAdd+='\n' + espaces + '),';
                toAdd+='\n' + espaces + '#(fin appelf),';
            }else if(nomFonction === 'affecte'){
                toAdd='affecte(nomVariable , valeurVariable),';
            }
            zoneSource.value=texte_debut + toAdd + texte_fin;
            zoneSource.selectionStart=position_selection;
            zoneSource.selectionEnd=position_selection;
            zoneSource.focus();
            return;
        }
    }
    /*
      =============================================================================================================
      function lancer_un_travail_en_arriere_plan
      =============================================================================================================
    */
    lancer_un_travail_en_arriere_plan( parametre ){
        if(!window.Worker){
            return;
        }
        if(this.#programme_en_arriere_plan === null){
            try{
                this.#programme_en_arriere_plan=new Worker( "./js/module_travail_en_arriere_plan0.js" );
            }catch(e){
                console.log( 'e=' , e );
                return;
            }
            this.#programme_en_arriere_plan.onmessage=function( message_recu_du_worker ){
                console.log( "dans le script principal, message_recu_du_worker" , message_recu_du_worker );
                this.traite_message_recupere_du_worker( message_recu_du_worker );
            }.bind( this );
        }
        var json_param=JSON.parse( parametre );
        if("replacer_des_chaines1" === json_param.nom_du_travail_en_arriere_plan){
            var liste_des_id_des_sources='';
            var ob={};
            for(ob in json_param.liste_des_taches){
                liste_des_id_des_sources+=',' + json_param.liste_des_taches[ob].id_source;
            }
            if(liste_des_id_des_sources != ''){
                liste_des_id_des_sources=liste_des_id_des_sources.substr( 1 );
                var remplacer_par=prompt( 'remplacer "' + json_param.chaine_a_remplacer + '" dans les sources(' + liste_des_id_des_sources + ') par :' , json_param.chaine_a_remplacer );
                if(remplacer_par !== null){
                    json_param.remplacer_par=remplacer_par;
                    console.log( json_param );
                    console.log( 'on envoie le message' );
                    try{
                        this.#programme_en_arriere_plan.postMessage( {"type_de_message" : 'déclencher_un_travail' ,"parametres" : json_param} );
                    }catch(e){
                        console.log( 'e=' , e );
                    }
                    console.log( 'le message est envoyé sans erreur' );
                }
            }
        }else if("supprimer_un_commentaire1" === json_param.nom_du_travail_en_arriere_plan){
            this.#programme_en_arriere_plan.postMessage( {"type_de_message" : 'déclencher_un_travail' ,"parametres" : json_param} );
        }else{
            console.error( '%c module_interface1 87 le travail "' + json_param.nom_du_travail_en_arriere_plan + '" n\'est pas dans la liste ' , 'background:yellow;' );
        }
    }
    /*
      =============================================================================================================
    */
    traite_message_recupere_du_worker( message_recu_du_worker ){
        if(message_recu_du_worker.data.hasOwnProperty( 'type_de_message' )){
            if(message_recu_du_worker.data.type_de_message === "recuperer_les_travaux_en_session"){
                if(message_recu_du_worker.data.tableau_des_travaux.length > 0){
                    this.#programme_en_arriere_plan.postMessage( {"type_de_message" : 'integrer_les_travaux_en_session' ,"tableau_des_travaux" : message_recu_du_worker.data.tableau_des_travaux} );
                }else{
                    console.log( 'pas de travaux à intégrer' );
                }
            }
        }else if(message_recu_du_worker.data.hasOwnProperty( 'donnees_recues_du_message' )){
            console.log( '%cconfirmation de la réception d\'un message=' , 'background:lightpink;' , message_recu_du_worker.data );
        }else{
            console.log( 'traitement non prévu' );
        }
    }
    /*
      =============================================================================================================
    */
    #charger_le_module_des_taches_en_arrière_plan( par ){
        if(!window.Worker){
            return;
        }
        setTimeout( function(){
                if(this.#programme_en_arriere_plan === null){
                    /* console.log('on charge le worker 1111'); */
                    this.#programme_en_arriere_plan=new Worker( "./js/module_travail_en_arriere_plan0.js" );
                }
                this.#programme_en_arriere_plan.onmessage=function( message_recu_du_worker ){
                    console.log( "dans le module interface , message_recu_du_worker" , message_recu_du_worker.data );
                    this.traite_message_recupere_du_worker( message_recu_du_worker );
                }.bind( this );
                this.#programme_en_arriere_plan.postMessage( {"type_de_message" : 'recuperer_les_travaux_en_session' ,"parametres" : {}} );
                /* console.log('pas d\'erreur !'); */
            }.bind( this ) , 1500 );
    }
    /*
      =============================================================================================================
    */
    #traite_tableau_de_la_base( par ){
        setTimeout( function(){
                __m_rev_vers_sql1.traite_le_tableau_de_la_base_sqlite_v3( par );
            }.bind( this ) , 250 );
    }
    /*
      =============================================================================================================
    */
    executerCesActionsPourLaPageLocale2( par ){
        for( var i=0 ; i < par.length ; i++ ){
            switch (par[i].nomDeLaFonctionAappeler){
                case 'initialisation_page_rev' : initialisation_page_rev( par[i].parametre );
                    break;
                case '#charger_le_module_des_taches_en_arrière_plan' :
                    /* if(APP_KEY !== 'fta'){ */
                    this.#charger_le_module_des_taches_en_arrière_plan( par[i].parametre );
                    /* } */
                    break;
                    
                case '#ne_rien_faire1' : this.#ne_rien_faire1( par[i].parametre );
                    break;
                case 'initialiserEditeurPourUneTextArea' : this.#initialiser_editeur_pour_une_textarea1( par[i].parametre );
                    break;
                case 'traite_le_tableau_de_la_base_sqlite_v2' : this.#traite_tableau_de_la_base( par[i].parametre );
                    break;
                case 'comparer_deux_tableaux_de_bases_sqlite' : comparer_deux_tableaux_de_bases_sqlite( par[i].parametre );
                    break;
                default:
                    console.log( 'fonction non prévue dans interface0.js: ' + par[i].nomDeLaFonctionAappeler );
                    break;
                    
            }
        }
    }
}
export{interface1 as interface1};