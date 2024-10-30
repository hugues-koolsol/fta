
/*
  
  =====================================================================================================================
  classe permettant de gérer les éléments d'interface de cet ensemble de programmes
  =====================================================================================================================
*/
class interface1{
    #nom_de_la_variable='';
    #nom_div_des_messages1='';
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
    
    /*
      ==============================================================================
      le seul argument est pour l'instant le nom de la variable qui est déclarée
    */
    constructor(nom_de_la_variable,nom_de_la_div_contenant_les_messages){
     
        this.#nom_de_la_variable=nom_de_la_variable;
        this.#nom_div_des_messages1=nom_de_la_div_contenant_les_messages;
        this.global_modale2=document.getElementById('modale1');
        this.global_modale2_contenu=document.getElementById('__contenu_modale');
        this.global_modale2_iframe=document.getElementById('iframe_modale_1');
        
        
        this.global_modale2.addEventListener('click',function(e){
            var dim = e.target.getBoundingClientRect();
            if((e.clientX < dim.left) || (e.clientX > dim.right) || (e.clientY < dim.top) || (e.clientY > dim.bottom)){
                document.getElementById('__message_modale').innerHTML='';
                e.target.close();
            }
        });
        
        
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
      ==============================================================================
      modale
    */
    fermerModale2(){
        document.getElementById('__message_modale').innerHTML='';
        this.global_modale2.close();
    }
    
    afficherModale2(parametres){
//        console.log(('parametres=' + parametres));
        var jsn1 = JSON.parse(parametres);
        if(jsn1.__fonction === 'recupérer_un_element_parent_en_bdd'){
            var paramatresModale={'__champs_texte_a_rapatrier':jsn1['__champs_texte_a_rapatrier'],'__nom_champ_dans_parent':jsn1['__nom_champ_dans_parent']};
            this.global_modale2_iframe.src=(jsn1['__url'] + '?__parametres_choix=' + encodeURIComponent(JSON.stringify(paramatresModale)));
            this.global_modale2.showModal();
        }
    }
    
    annuler_champ_modale(parametres){
        var jsn1 = JSON.parse(parametres);
        document.getElementById(jsn1['__nom_champ_dans_parent']).value='';
        try{
            if(jsn1.__champs_texte_a_rapatrier){
                var i={};
                for(i in jsn1.__champs_texte_a_rapatrier){
                    window.parent.document.getElementById(i).innerHTML=jsn1.__champs_texte_a_rapatrier[i].__libelle_si_vide;
                }
            }
        }catch(e){
            console.log(e);
        }
    }
    
    choisir_de_iframe2(parametres){
        var jsn1 = JSON.parse(parametres);
        window.parent.document.getElementById(jsn1['__nom_champ_rapatrie']).value=jsn1['__valeur_champ_id_rapatrie'];
        try{
            if(jsn1.__champs_texte_a_rapatrier){
                var i={};
                for(i in jsn1.__champs_texte_a_rapatrier){
                    window.parent.document.getElementById(i).innerHTML=(jsn1.__champs_texte_a_rapatrier[i].__libelle_avant + jsn1.__champs_texte_a_rapatrier[i].__valeur + jsn1.__champs_texte_a_rapatrier[i].__libelle_apres);
                }
            }
        }catch(e){
            console.log(e);
        }
        window.parent[this.#nom_de_la_variable].fermerModale2()
    }

    /*
      =====================================================================================================================
      function supprimer_ce_commentaire_et_recompiler
      =====================================================================================================================
    */
    supprimer_ce_commentaire_et_recompiler(id_source , id_rev){
        console.log( id_source + ' ' + id_rev );
        var param={
                'nom_du_travail_en_arriere_plan' : 'supprimer_un_commentaire1',
                'liste_des_taches' : [{'etat':'a_faire' , id_source:id_source, id_rev : id_rev }],
        }
        this.lancer_un_travail_en_arriere_plan(JSON.stringify(param));
    }
    /*
      =====================================================================================================================
      function lancer_un_travail_en_arriere_plan
      =====================================================================================================================
    */
    lancer_un_travail_en_arriere_plan(parametre){
        
        if( !(window.Worker)){
            return;
        }
        if(this.#programme_en_arriere_plan === null){
            try{
                this.#programme_en_arriere_plan= new Worker("./js/module_travail_en_arriere_plan0.js");
            }catch(e){
                console.log('e=',e);
                return;
            }
        }
        this.#programme_en_arriere_plan.onmessage=function(message_recu_du_worker){
            console.log("dans le script principal, message_recu_du_worker",message_recu_du_worker);
        };
        var json_param = JSON.parse(parametre);
        if("replacer_des_chaines1" === json_param.nom_du_travail_en_arriere_plan){
            var liste_des_id_des_sources='';
            for(var ob in json_param.liste_des_taches){
             liste_des_id_des_sources+=','+json_param.liste_des_taches[ob].id_source;
            }
            if(liste_des_id_des_sources!=''){
                liste_des_id_des_sources=liste_des_id_des_sources.substr(1);
                var remplacer_par = prompt(('remplacer "' + json_param.chaine_a_remplacer + '" dans les sources(' + liste_des_id_des_sources + ') par :'));
                if(remplacer_par !== null){
                    json_param.remplacer_par=remplacer_par;
                    console.log(json_param);
                    console.log('on envoie le message');
                    try{
                        this.#programme_en_arriere_plan.postMessage({'type_de_message':'déclencher_un_travail','parametres':json_param});
                    }catch(e){
                        console.log('e=',e);
                    }
                    console.log('le message est envoyé sans erreur');
                }
            }
            
        }else if("supprimer_un_commentaire1" === json_param.nom_du_travail_en_arriere_plan){
            this.#programme_en_arriere_plan.postMessage({'type_de_message':'déclencher_un_travail','parametres':json_param});
        }else{
            console.error('%c module_interface1 87 le travail "'+ json_param.nom_du_travail_en_arriere_plan+'" n\'est pas dans la liste ','background:yellow;')
        }
    }
    
    /*
      =============================================================================================================
      function reduire_la_text_area
      =============================================================================================================
    */
    reduire_la_text_area(nom_de_la_textarea){
        var a = document.getElementById(nom_de_la_textarea);
        var b = a.getBoundingClientRect();
        if(a){
            a.rows=5;
            a.style.height='5em';
            a.focus();
        }
    }
    /*
      =============================================================================================================
      function agrandir_la_text_area
      =============================================================================================================
    */
    agrandir_la_text_area(nom_de_la_textarea){
        var a = document.getElementById(nom_de_la_textarea);
        var b = a.getBoundingClientRect();
        if(a){
            var c=a.value.split('\n');
    //                    console.log(c.length);
            if(c.length<100){
                a.rows=c.length+1;
                /* 
                  le "line-height d'une textarea est fixé à 1.2 
                */
                a.style.height=(parseInt(((c.length+1)*1.2),10)+1)+'em';
            }else{
                a.rows=100;
                a.style.height='100em';
            }
            /*
              on met la zone en haut
            */
            var d = parseInt((((b.top - 80)) + window.pageYOffset),10);
            var lst=document.getElementsByClassName('menuScroller');
            
            if(lst.length>=2){
             d=d-(lst.length-1)*CSS_TAILLE_REFERENCE_HAUTEUR_MIN_DIV;
            }
            window.scrollTo(0,d);
            a.focus();

        }
    }
    
    /*
      =============================================================================================================
      ajuste la taille d'une textarea
      =============================================================================================================
    */
    agrandir_ou_reduire_la_text_area(nom_de_la_textarea){
        try{
            var a = document.getElementById(nom_de_la_textarea);
            var b = a.getBoundingClientRect();
            this.masquer_les_messages1('zone_global_messages');
            
            if(a){
                if(a.rows <= 10){
                    var c=a.value.split('\n');
//                    console.log(c.length);
                    if(c.length<100){
                        a.rows=c.length+1;
                        /* 
                          le "line-height d'une textarea est fixé à 1.2 
                        */
                        a.style.height=(parseInt(((c.length+1)*1.2),10)+1)+'em';
                    }else{
                        a.rows=100;
                        a.style.height='100em';
                    }
                    /*
                      on met la zone en haut
                    */
                    var d = parseInt((((b.top - 80)) + window.pageYOffset),10);
                    var lst=document.getElementsByClassName('menuScroller');
                    console.log(lst.length);
                    
                    console.log('d=',d);
                    if(lst.length>=2){
                     d=d-(lst.length-1)*CSS_TAILLE_REFERENCE_HAUTEUR_MIN_DIV;
                    }
                    window.scrollTo(0,d);
                    a.focus();
                }else{
                    a.rows=5;
                    a.style.height='5em';
                    a.focus();
                }
            }
        }catch(e){
            console.log('e=',e);
        }
    }
    
    /*
      
      =============================================================================================================
      function remplacer_la_selection_par
    */
    remplacer_la_selection_par(nom_de_la_textarea){
        var a = document.getElementById(nom_de_la_textarea);
        var x=a.selectionStart;
        var b = a.value.substr(a.selectionStart,(a.selectionEnd - a.selectionStart));
        if(b === ''){
            alert('veuillez sélectionner une chaine à remplacer');
            return;
        }
        var remplacer_par = window.prompt('remplacer par','??');
        if(remplacer_par){
            var r1= new RegExp(b,'g');
            var c = a.value.replace(r1,remplacer_par);
            a.value=c;
            this.agrandir_la_text_area(nom_de_la_textarea);
            a.focus();
            a.selectionStart=x;
        }
    }
    /*
      
      =============================================================================================================
      function aller_a_la_position
    */
    aller_a_la_position(nom_textarea){
        var resultat = window.prompt('aller à la position',1);
        if((resultat) && (isNumeric(resultat))){
            var a = dogid(nom_textarea);
            a.rows="100";
            a.focus();
            a.selectionStart=0;
            a.selectionEnd=resultat;
        }
    }
    /*
      
      =============================================================================================================
      function aller_a_la_ligne
    */
    aller_a_la_ligne(nom_textarea,ajouter=0){
        var i=0;
        var position_fin=0;
        var position_debut=0;
        var numero_de_ligne = window.prompt('aller à la ligne n°?',1);
        if((numero_de_ligne) && (isNumeric(numero_de_ligne))){
            numero_de_ligne=parseInt(numero_de_ligne,10)+ajouter;
            var a = dogid(nom_textarea);
            var lignes = a.value.split('\n');
            if(lignes.length > numero_de_ligne){
                lignes.splice(numero_de_ligne-1,(lignes.length - numero_de_ligne)+1);
                position_fin=0;
                for(i=(lignes.length - 1);i >= 0;i--){
                    position_fin+=(lignes[i].length + 1);
                }
                position_debut=position_fin-lignes[lignes.length-1].length-1;
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
    aller_au_caractere_de_la_textarea(id_textarea){
        var valeur = prompt('aller au caractère n° :');
        if(valeur !== null){
            var elem = document.getElementById(id_textarea);
            elem.focus();
            elem.selectionStart=parseInt(valeur,10);
            elem.selectionEnd=(parseInt(valeur,10) + 1);
        }
    }
    /*
      
      =============================================================================================================
      
      function definir_le_nombre_de_lignes_a_afficher_pour_une_liste
    */
    definir_le_nombre_de_lignes_a_afficher_pour_une_liste(nom_de_la_page,nombre_de_lignes){
        var r= new XMLHttpRequest();
        r.open("POST",'za_ajax.php?definir_le_nombre_de_lignes_a_afficher_pour_une_liste',true);
        r.timeout=6000;
        r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        r.onreadystatechange=function(){
            if((r.readyState != 4) || (r.status != 200)){
                if(r.status == 404){
                    console.log('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
                }else if(r.status == 500){
                    /*
                      
                      normalement, on ne devrait pas passer par ici car les erreurs 500 ont été capturées
                      au niveau du php za_ajax mais sait-on jamais
                    */
                    if(global_messages['e500logged'] == false){
                        try{
                            console.log('r=',r);
                        }catch(e){
                        }
                    }
                }
                return;
            }
            try{
                var jsonRet = JSON.parse(r.responseText);
                if(jsonRet.status == 'OK'){
                    window.location.reload(true);
                    return;
                }else{
                    console.log('loupé');
                    return;
                }
            }catch(e){
                console.log('r=',r);
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
            return;
        };
        var ajax_param={'call':{'lib':'php','file':'session','funct':'definir_le_nombre_de_lignes_a_afficher_pour_une_liste'},nom_de_la_page:nom_de_la_page,nombre_de_lignes:nombre_de_lignes};
        try{
            r.send(('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param))));
        }catch(e){
            console.error('e=',e);
            /* whatever(); */
            return({status:false});
        }
        return({'status':true});
    }
    /*
      
      =============================================================================================================
      affichage de la modale permettant de fixer_les_parametres_pour_une_liste
      function fixer_les_parametres_pour_une_liste
    */
    fixer_les_parametres_pour_une_liste(nom_de_la_page){
        this.global_modale2_iframe.style.visibility='none';
        var t='';
        t+='<h1>fixer les paramètres</h1>';
        var i=10;
        for(i=10;i <= 50;i+=10){
            t+=('<a href="javascript:' + this.#nom_de_la_variable + '.definir_le_nombre_de_lignes_a_afficher_pour_une_liste(&quot;' + nom_de_la_page + '&quot;,' + i + ')">afficher ' + i + ' lignes</a>');
        }
        this.global_modale2_contenu.innerHTML=t;
        this.global_modale2.showModal();
    }
    
    /*
      =====================================================================================================================
      on reactiver_les_boutons1
    */
    reactiver_les_boutons1(){
        var i=0;
        var refBody = document.getElementsByTagName('body')[0];
        clearTimeout(this.#globale_timeout_reference_timer_serveur_lent);
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
            if((lsta1[i].href) && (typeof lsta1[i].href === 'string') && ( !(lsta1[i].href.indexOf('javascript') >= 0))){
                if((lsta1[i].className) && (lsta1[i].className.indexOf('noHide') >= 0)){
                }else{
//                    lsta1[i].addEventListener("click",clickLink1,false);
                    lsta1[i].classList.remove("yyunset");
                }
            }
        }
        try{
            var elem = document.getElementById('sloserver1');
            elem.remove();
        }catch(e){
        }
        var lstb1 = document.getElementsByClassName("yyunset_temporaire");
        for(i=0;i < lstb1.length;i++){
            lstb1[i].classList.remove('yyunset_temporaire');
        }
    }
    
    /*
      =====================================================================================================================
      l'affichage de la boite doit être progressif
    */
    #mise_a_jour_affichage_serveur_lent1(){
        try{
            var elem = document.getElementById('sloserver1');
            if(elem){
                var opa = parseInt((elem.style.opacity * 100),10);
                if(opa < 100){
                    var newOpa = ((opa / 100) + 0.1);
                    if(newOpa > 1){
                        newOpa=1;
                    }
                    document.getElementById('sloserver1').style.opacity=newOpa;
                    if(newOpa<1){
                        setTimeout(this.#mise_a_jour_affichage_serveur_lent1.bind(this),50);
                    }
                }
            }
        }catch(e){
        }
    }
    
    /*
      =====================================================================================================================
    */
    #affichage_boite_serveur_lent1(){
        
        var divId = document.createElement('div');
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
        document.getElementsByTagName('body')[0].appendChild(divId);
        setTimeout(this.#mise_a_jour_affichage_serveur_lent1.bind(this),50);
    }
    
    /*
      =====================================================================================================================
      quand on clique sur un bouton, on affiche la boite 1.5 secondes plus tard
      =====================================================================================================================
    */
    click_sur_bouton1(e){
        try{
            e.target.style.visibility="hidden";
        }catch(e1){
        }
        this.#globale_timeout_reference_timer_serveur_lent=setTimeout(this.#affichage_boite_serveur_lent1.bind(this),this.#globale_timeout_serveur_lent);
    }
    /*
      =====================================================================================================================
      quand on clique sur un lien, on affiche la boite 1.5 secondes plus tard
      =====================================================================================================================
    */
    click_sur_lien1(e){
        console.log('click_sur_lien1');
        if((e.target.target) && (e.target.target.toLowerCase() === '_blank')){
        }else{
            try{
                e.target.classList.add("yyunset_temporaire");
            }catch(e1){
            }
            this.#globale_timeout_reference_timer_serveur_lent=setTimeout(this.#affichage_boite_serveur_lent1.bind(this),this.#globale_timeout_serveur_lent);
        }
    }
    /*
      =====================================================================================================================
      quand on clique sur un lien javascript, , le traitement devrait être immédiat,
      On le réaffiche 300 ms apres
      =====================================================================================================================
    */
    action_quand_click_sur_lien_javascript(e){
        console.log('ici');
        try{
            e.target.classList.add("yyunset_temporaire");
        }catch(e1){
        }
        setTimeout(function(){
            /*
             Normalement, l'affichage des messages supprime les yyunset_temporaire
             mais on ne sait jamais
            */
            var lstb1 = document.getElementsByClassName("yyunset_temporaire");
            var i=0;
            for(i=0;i < lstb1.length;i++){
                lstb1[i].classList.remove('yyunset_temporaire');
            }
        },300);
    }
    
    /*
      
      =============================================================================================================
    */
    ajoute_de_quoi_faire_disparaitre_les_boutons_et_les_liens(){
        this.calcul_la_largeur_des_ascenseurs();
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
                    lstb1[i].addEventListener("click",this.click_sur_bouton1.bind(this),false);
                }
            }
        }
        var lstb1 = bod.getElementsByTagName('input');
        for(i=0;i < lstb1.length;i++){
            if( !(lstb1[i].onclick)){
                if((lstb1[i].className) && (lstb1[i].className.indexOf('noHide') >= 0)){
                }else{
                    if(lstb1[i].type === 'submit'){
                        lstb1[i].addEventListener("click",this.click_sur_bouton1.bind(this),false);
                    }
                }
            }
        }
        var lsta1 = bod.getElementsByTagName('a');
        for(i=0;i < lsta1.length;i++){
            if((lsta1[i].href) && ( !(lsta1[i].href.indexOf('javascript') >= 0))){
                if((lsta1[i].className) && (lsta1[i].className.indexOf('noHide') >= 0)){
                }else{
                    lsta1[i].addEventListener("click",this.click_sur_lien1.bind(this),false);
                }
            }
        }
        var lsta1 = bod.getElementsByTagName('a');
        for(i=0;i < lsta1.length;i++){
            if((lsta1[i].href) && (lsta1[i].href.indexOf('javascript') >= 0)){
                if((lsta1[i].className) && (lsta1[i].className.indexOf('noHide') >= 0)){
                }else{
                    lsta1[i].addEventListener("click",this.action_quand_click_sur_lien_javascript,false);
                }
            }
        }
        /*
          
          getPageSize();
        */
        /*
          
          =====================================================================================================
          Mettre le bouton retour à la liste dans la barre des messages si elle est affichée
          =====================================================================================================
        */
        var ref = document.getElementById('zone_global_messages');
        if(ref.style.visibility === 'visible'){
            /*
              
              à priori, un message est affiché
            */
            try{
                /*
                  
                  si il y a un bouton __retour_a_la_liste, on l'ajoute à la zone message
                */
                if(document.getElementById('__retour_a_la_liste')){
                    var a = document.createElement('a');
                    a.className="__clone";
                    a.style.float='inline-end';
                    a.href=document.getElementById('__retour_a_la_liste').href;
                    a.innerHTML='&nbsp;⬱&nbsp;';
                    ref.insertBefore(a,ref.firstChild);
                }
            }catch(e){
            }
        }
    }
    /*
      
      =============================================================================================================
    */
    calcul_la_largeur_des_ascenseurs(){
        var body = document.getElementsByTagName('body')[0];
        var div = document.createElement("div");
        div.style.width='100px';
        div.style.height='100px';
        div.style.overflow='auto';
        div.style.opacity=0.01;
        body.appendChild(div);
        var bag = document.createElement("div");
        var att1='width:101px;height:101px;overflow:auto;';
        bag.style.width='101px';
        bag.style.height='101px';
        bag.style.overflow='auto';
        div.appendChild(bag);
        div.scrollTop=100;
        this.#largeur_des_ascenseurs=(div.scrollTop - 1);
        div.removeChild(bag);
        body.removeChild(div);
    }
    /*
      
      =============================================================================================================
      convertir le contenu d'une textearea rev et le mettre le résultat js dans une textarea
      =============================================================================================================
    */
    convertir_textearea_rev_vers_textarea_js(chp_rev_source,chp_genere_source){
        this.raz_des_messages();
        var a = document.getElementById(chp_rev_source);
        var startMicro = performance.now();
        var tableau1 = iterateCharacters2(a.value);
        global_messages.data.tableau=tableau1;
        var endMicro = performance.now();
        var startMicro = performance.now();
        var matriceFonction = functionToArray2(tableau1.out,true,false,'');
        global_messages.data.matrice=matriceFonction;
        if(matriceFonction.status === true){
            var objJs = parseJavascript0(matriceFonction.value,1,0);
            if(objJs.status === true){
                dogid(chp_genere_source).value=objJs.value;
            }else{
                this.remplir_et_afficher_les_messages1('zone_global_messages',chp_rev_source);
                return;
            }
        }
        this.remplir_et_afficher_les_messages1('zone_global_messages',chp_rev_source);
    }
    /*
      
      =============================================================================================================
      convertir le contenu d'une textearea rev et le mettre le résultat php dans une textarea
      =============================================================================================================
    */
    convertir_textearea_rev_vers_textarea_php(nom_zone_source_rev,nom_zone_genere_php,bouton_interface=false){
        this.raz_des_messages();
        var a = dogid(nom_zone_source_rev);
        var startMicro = performance.now();
        var tableau1 = iterateCharacters2(a.value);
        global_messages.data.tableau=tableau1;
        var endMicro = performance.now();
        console.log('\n\n=============\nmise en tableau endMicro=',((parseInt((((endMicro - startMicro)) * 1000),10) / 1000) + ' ms'));
        var startMicro = performance.now();
        var matriceFonction = functionToArray2(tableau1.out,true,false,'');
        if(matriceFonction.status === true){
            var objPhp = parsePhp0(matriceFonction.value,0,0);
            if(objPhp.status === true){
                dogid(nom_zone_genere_php).value=objPhp.value;
                if(bouton_interface===true){
                 /* pour firefox ! */
                 return ;
                }
                return({status:true,value:matriceFonction.value});
            }
        }
        this.remplir_et_afficher_les_messages1('zone_global_messages');
        if(bouton_interface===true){
         /* pour firefox ! */
         return;
        }
        return({status:true});
    }
    /* function mouseWheelOnMenu */
    mouseWheelOnMenu(event){
        event.preventDefault();
        var elem=event.target;
        var continuer=true;
        while(continuer){
            if(elem.nodeName === 'DIV'){
                if(elem.className.indexOf('menuScroller') >= 0){
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
                var current = parseInt(elem.scrollLeft,10);
                elem.scrollTo((current + scrollDelta),0);
            }else{
                var current = parseInt(elem.scrollLeft,10);
                elem.scrollTo((current - scrollDelta),0);
            }
        }
        return false;
    }
    /*
      
      =============================================================================================================
    */
    ajouter_un_commentaire_vide_et_reformater(nom_de_la_textarea){
        var a = document.getElementById(nom_de_la_textarea);
        a.focus();
        if(a.selectionStart === a.selectionEnd){
            var nouveau_source = (a.value.substr(0,a.selectionStart) + '#()' + a.value.substr(a.selectionStart));
            a.value=nouveau_source;
            this.formatter_le_source_rev(nom_de_la_textarea);
        }
    }
    /*
      
      =============================================================================================================
    */
    formatter_le_source_rev(nom_de_la_textarea){
        var a = document.getElementById(nom_de_la_textarea);
        var tableau1 = iterateCharacters2(a.value);
        var matriceFonction = functionToArray2(tableau1.out,true,false,'');
        if(matriceFonction.status === true){
            var obj2 = arrayToFunct1(matriceFonction.value,true,false);
            if(obj2.status === true){
                a.value=obj2.value;
            }
        }else{
            this.remplir_et_afficher_les_messages1('zone_global_messages',nom_de_la_textarea);
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
    construit_un_html_du_tableau_des_caracteres(t2,texteSource,objTableau){
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
              
              =============================================================================================
              Si on a un retour chariot, on écrit les 
              cases contenant les positions des caractères
              =============================================================================================
            */
            if(out[i][0] == '\n'){
                t2.appendChild(tr1);
                /*
                  
                  
                  
                  =====================================================================================
                  indice dans tableau = première ligne des chiffres
                  =====================================================================================
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
                  
                  
                  =====================================================================================
                  position du backslash
                  =====================================================================================
                */
                var td1={};
                td1=document.createElement('td');
                td1.setAttribute('class','td2');
                td1.innerHTML=j;
                tr1.appendChild(td1);
                t2.appendChild(tr1);
                /*
                  
                  
                  =====================================================================================
                  position dans la chaine = deuxième ligne des chiffres
                  car certains caractères utf8 sont codées sur 2 positions
                  =====================================================================================
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
                  
                  
                  =====================================================================================
                  position du backslash
                  =====================================================================================
                */
                var td1={};
                td1=document.createElement('td');
                td1.setAttribute('class','td2');
                td1.innerHTML=out[j][2];
                tr1.appendChild(td1);
                t2.appendChild(tr1);
                /*
                  
                  
                  
                  =====================================================================================
                  fin des lignes contenant les positions
                  =====================================================================================
                */
                debut=(i + 1);
                numeroLigne=(numeroLigne + 1);
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
          
          =====================================================================================================
          FIN Si on a un retour chariot, on écrit les 
          cases contenant les positions des caractères
          =====================================================================================================
        */
        /*dernière ligne de faire boucle*/
        /*
          
          dernière ligne des positions des caractères
        */
        t2.appendChild(tr1);
        /*
          
          
          
          =====================================================================================================
          indice dans tableau = première ligne des chiffres
          =====================================================================================================
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
          
          =====================================================================================================
          pas de position du backslash
          =====================================================================================================
        */
        /*
          
          =====================================================================================================
          position dans la chaine = deuxième ligne des chiffres
          =====================================================================================================
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
      
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
      fonction qui produit un tableau html de la
      forme matricielle du programme
      =============================================================================================================
      =============================================================================================================
      =============================================================================================================
    */
    construit_tableau_html_de_le_matrice_rev(t1,matriceFonction){
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
          
          =====================================================================================================
          entête du tableau
          =====================================================================================================
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
          
          
          
          =====================================================================================================
          éléments du tableau
          =====================================================================================================
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
                    td1.style.maxWidth=(largeurColonne1EnPx + 'px');
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
      
      =============================================================================================================
    */
    vers_le_haut_de_la_page(destination,duree){
        Math.easeInOutQuad=function(t,b,c,d){
            t/=(d / 2);
            if(t < 1){
                return((((c / 2) * t * t) + b));
            }
            /*un point virgule est-il en trop ?*/
            t--;
            return(((((-c) / 2) * (((t * ((t - 2))) - 1))) + b));
        };
        var element=document.scrollingElement;
        var positionDeDepart = ((element) && (element.scrollTop)) || (window.pageYOffset);
        var change = (destination - positionDeDepart);
        var increment=20;
        var tempsCourant=0;
        var animerLeDecalage = function(){
            tempsCourant+=increment;
            var val = Math.easeInOutQuad(tempsCourant,positionDeDepart,change,duree);
            window.scrollTo(0,val);
            if(tempsCourant < duree){
                window.setTimeout(animerLeDecalage,increment);
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
        var bod = document.getElementsByTagName('body')[0];
        var paddingTopBody=0;
        var bodyComputed = getComputedStyle(bod);
        var elem={};
        for(elem in bodyComputed){
            if('paddingTop' === elem){
                paddingTopBody=parseInt(bodyComputed[elem],10);
            }
        }
        var contenuPrincipal = dogid('contenuPrincipal');
        var lesDivs = contenuPrincipal.getElementsByTagName('div');
        for(i=0;i < lesDivs.length;i++){
            if(lesDivs[i].className === 'menuScroller'){
                var menuUtilisateurCalcule = getComputedStyle(lesDivs[i]);
                var hauteurMenuUtilisateur = parseInt(menuUtilisateurCalcule['height'],10);
                lesDivs[i].style.top=(paddingTopBody + 'px');
                lesDivs[i].style.position='fixed';
                lesDivs[i].style.width='100vw';
                lesDivs[i].style.backgroundImage='linear-gradient(to bottom, #B0BEC5, #607D8B)';
                lesDivs[i].addEventListener('wheel',this.mouseWheelOnMenu,false);
                paddingTopBody+=hauteurMenuUtilisateur;
            }
        }
        dogid('zone_global_messages').style.top=(((paddingTopBody + 2)) + 'px');
        bod.style.paddingTop=(paddingTopBody + 'px');
        /*
          
          ajustement de la position gauche des menus du haut, 
          c'est utile quand il y a beaucoup de menus
          en haut et qu'on est sur un petit appareil
        */
        var hrefActuel=window.location.href;
        if(hrefActuel.indexOf('#') >= 1){
            hrefActuel=hrefActuel.substr(0,hrefActuel.indexOf('#'));
        }
        if((hrefActuel.lastIndexOf('/') >= 1) && (hrefActuel.substr((hrefActuel.lastIndexOf('/') + 1)) !== '')){
            hrefActuel=hrefActuel.substr((hrefActuel.lastIndexOf('/') + 1));
            if(hrefActuel.indexOf('?') >= 0){
                hrefActuel=hrefActuel.substr(0,hrefActuel.indexOf('?'));
            }
            var lienActuel=null;
            var menuPrincipal = dogid('menuPrincipal');
            if(menuPrincipal){
                var listeMenu = menuPrincipal.getElementsByTagName('a');
                for(i=0;i < listeMenu.length;i++){
                    if((listeMenu[i].href) && (listeMenu[i].href.indexOf(hrefActuel) >= 0)){
                        lienActuel=listeMenu[i];
                        break;
                    }
                }
                if(lienActuel !== null){
                    for(i=0;i < listeMenu.length;i++){
                        if(listeMenu[i] === lienActuel){
                            listeMenu[i].classList.add('yymenusel1');
                        }else{
                            listeMenu[i].classList.remove('yymenusel1');
                        }
                    }
                    var positionDuLien = lienActuel.getBoundingClientRect();
                    var boiteDesLiens = menuPrincipal.getBoundingClientRect();
                    var positionDroiteDuLienDansLaBoite = parseInt((((positionDuLien.left - boiteDesLiens.left)) + positionDuLien.width),10);
                    var largeurBoiteLiens = parseInt(boiteDesLiens.width,10);
                    if(positionDroiteDuLienDansLaBoite > largeurBoiteLiens){
                        var calcul = parseInt((boiteDesLiens.width - positionDuLien.width - 60),10);
                        if(parseInt(positionDuLien.x,10) > calcul){
                            var nouveauScroll = (positionDuLien.x - boiteDesLiens.width - positionDuLien.width - 60);
                            menuPrincipal.scrollLeft=nouveauScroll;
                        }
                    }
                }
                menuPrincipal.addEventListener('wheel',this.mouseWheelOnMenu,false);
            }
        }
    }
    /*
      =============================================================================================================
      =============================================================================================================
    */
    parentheses1(nomDeLaTextAreaContenantLeSource){
        var i=0;
        if(global_editeur_derniere_valeur_selecStart < 0){
            logerreur({'status':false,'message':'veuillez sélectionner une parenthèse dans la zone de texte'});
            this.remplir_et_afficher_les_messages1('zone_global_messages',nomDeLaTextAreaContenantLeSource);
            return;
        }
        var zoneSource = document.getElementById(nomDeLaTextAreaContenantLeSource);
        var texte=zoneSource.value;
        if((global_editeur_derniere_valeur_selectEnd === global_editeur_derniere_valeur_selecStart) && (texte.substr((global_editeur_derniere_valeur_selecStart - 1),1) == '(')){
            /*
              
              on s'est placé juste après une parenthèse ouvrante
            */
            if(texte.substr(global_editeur_derniere_valeur_selecStart,1) == ')'){
                /*
                  
                  on est entre 2 parenthèses ouvrante et fermante consécutives,
                */
                if((global_editeur_derniere_valeur_selecStart - 2) > 0){
                    for(i=(global_editeur_derniere_valeur_selecStart - 2);i >= 1;i--){
                        if(texte.substr(i,1) === '('){
                            texte=texte.substr(i);
                            var arr = functionToArray(texte,false,false,'(');
                            if(arr.status === true){
                                zoneSource.focus();
                                zoneSource.selectionStart=(i + 1);
                                global_editeur_derniere_valeur_selecStart=(i + 1);
                                zoneSource.selectionEnd=(((global_editeur_derniere_valeur_selecStart + arr.posFerPar)) - 1);
                                initialisationEditeur();
                                return;
                            }
                        }
                    }
                    zoneSource.focus();
                }else{
                    zoneSource.focus();
                }
            }else{
                texte=texte.substr((global_editeur_derniere_valeur_selecStart - 1));
                console.log('texte="',(texte + '"'));
                var arr = functionToArray(texte,false,false,'(');
                if(arr.status === true){
                    zoneSource.focus();
                    zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
                    zoneSource.selectionEnd=(((global_editeur_derniere_valeur_selecStart + arr.posFerPar)) - 1);
                    initialisationEditeur();
                    return;
                }
            }
        }else if((global_editeur_derniere_valeur_selectEnd === global_editeur_derniere_valeur_selecStart) && (texte.substr(global_editeur_derniere_valeur_selecStart,1) == ')')){
            /*
              
              on s'est placé juste avant une parenthèse fermante
            */
            texte=texte.substr(0,(global_editeur_derniere_valeur_selecStart + 1));
            var arr = functionToArray(texte,false,false,')');
            if(arr.status === true){
                zoneSource.focus();
                zoneSource.selectionStart=(arr.posOuvPar + 1);
                zoneSource.selectionEnd=global_editeur_derniere_valeur_selecStart;
                initialisationEditeur();
                return;
            }
        }else{
            if(global_editeur_derniere_valeur_selectEnd === global_editeur_derniere_valeur_selecStart){
                /*
                  
                  on est placé quelquepart, on recherche la parenthèse ouvrante précédente
                */
                for(i=(global_editeur_derniere_valeur_selecStart - 2);i >= 1;i--){
                    if(texte.substr(i,1) === '('){
                        texte=texte.substr(i);
                        var arr = functionToArray(texte,false,false,'(');
                        if(arr.status === true){
                            zoneSource.focus();
                            zoneSource.selectionStart=(i + 1);
                            global_editeur_derniere_valeur_selecStart=(i + 1);
                            zoneSource.selectionEnd=(((global_editeur_derniere_valeur_selecStart + arr.posFerPar)) - 1);
                            initialisationEditeur();
                            return;
                        }
                    }
                }
                zoneSource.focus();
            }else if(global_editeur_derniere_valeur_selectEnd !== global_editeur_derniere_valeur_selecStart){
                /*
                  
                  c'est une sélection de plage entre 2 parenthèses
                */
                if((texte.substr((global_editeur_derniere_valeur_selecStart - 1),1) == '(') && (texte.substr(global_editeur_derniere_valeur_selectEnd,1) == ')')){
                    /*
                      
                      la plage est contenue dans 2 parenthèses, on essaie de remonter d'un niveau
                      en allant chercher le parenthèse ouvrante précédente
                    */
                    var tableau1 = iterateCharacters2(texte);
                    var matriceFonction = functionToArray2(tableau1.out,false,true,'');
                    if(matriceFonction.status === true){
                        var l01=matriceFonction.value.length;
                        var fait=false;
                        var repereDansTableau=-1;
                        for(i=0;i < tableau1.out.length;i++){
                            if(tableau1.out[i][2] === global_editeur_derniere_valeur_selecStart){
                                repereDansTableau=i;
                                break;
                            }
                        }
                        if(repereDansTableau >= 0){
                            for(i=0;i < l01;i++){
                                if(matriceFonction.value[i][11] === (repereDansTableau - 1)){
                                    if(matriceFonction.value[i][7] > 0){
                                        var positionParentheseDuParent=matriceFonction.value[matriceFonction.value[i][7]][11];
                                        texte=texte.substr(positionParentheseDuParent);
                                        var arr = functionToArray(texte,false,false,'(');
                                        if(arr.status === true){
                                            zoneSource.focus();
                                            global_editeur_derniere_valeur_selecStart=(tableau1.out[positionParentheseDuParent][2] + 1);
                                            global_editeur_derniere_valeur_selectEnd=(positionParentheseDuParent + arr.posFerPar);
                                            zoneSource.selectionStart=global_editeur_derniere_valeur_selecStart;
                                            zoneSource.selectionEnd=global_editeur_derniere_valeur_selectEnd;
                                            initialisationEditeur();
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
                    for(i=(global_editeur_derniere_valeur_selecStart - 2);i >= 1;i--){
                        if(texte.substr(i,1) === '('){
                            texte=texte.substr(i);
                            var arr = functionToArray(texte,false,false,'(');
                            if(arr.status === true){
                                zoneSource.focus();
                                zoneSource.selectionStart=(i + 1);
                                global_editeur_derniere_valeur_selecStart=(i + 1);
                                zoneSource.selectionEnd=(((global_editeur_derniere_valeur_selecStart + arr.posFerPar)) - 1);
                                initialisationEditeur();
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
      =====================================================================================================================
    */
    #ne_rien_faire1(par){
      /**
        on ne fait rien mais on le fait bien ici
        console.log('#ne_rien_faire1 par=',par);
      */
    }
    /*
      =====================================================================================================================
    */
    executerCesActionsPourLaPageLocale2(par){
        console.log('dans executerCesActionsPourLaPageLocale2 par=',par);
        var i=0;
        for(i=0;i < par.length;i++){

            switch (par[i].nomDeLaFonctionAappeler){
                case '#ne_rien_faire1':
                    this.#ne_rien_faire1(par[i].parametre);
                    break;
                    
                case 'initialiserEditeurPourUneTextArea':
                    initialiserEditeurPourUneTextArea(par[i].parametre);
                    break;
                    
                case 'traite_le_tableau_de_la_base_sqlite_v2':
                    traite_le_tableau_de_la_base_sqlite_v2(par[i].parametre);
                    break;
                    
                case 'comparer_deux_tableaux_de_bases_sqlite':
                    comparer_deux_tableaux_de_bases_sqlite(par[i].parametre);
                    break;
                    
                default:
                    console.log(('fonction non prévue dans interface0.js: ' + par[i].nomDeLaFonctionAappeler));
                    break;
                    
            }
        }
    }
    /*
      
      =====================================================================================================================
    */
    selectionner_ligne_de_text_area1(tarea,numero_de_ligne_qui_commence_par_1){
     
        var lineNum=((numero_de_ligne_qui_commence_par_1 <= 0)?1:numero_de_ligne_qui_commence_par_1);
        lineNum=(lineNum - 1);
        var numeroLigne=0;
        var startPos=0;
        var endPos=0;
        var contenu=tarea.value;
        var l01=contenu.length
        var i=0;
        for(i=0;i < l01;i++){
            if(contenu.substr(i,1) === '\n'){
                numeroLigne++;
                if(numeroLigne === lineNum){
                    startPos=(i + 1);
                    break;
                }
            }
        }
        var endPos=startPos;
        for(i=startPos;i < l01;i++){
            endPos=i;
            if(contenu.substr(i,1) === '\n'){
                break;
            }
        }
        if(i===l01){
            /* c'est la dernière ligne */
            endPos=l01;
        }
        
        if(typeof tarea.selectionStart !== 'undefined'){
            tarea.select();
            tarea.selectionStart=startPos;
            tarea.selectionEnd=endPos;
            var debut=startPos;
            var fin=endPos;
            tarea.select();
            tarea.selectionStart=debut;
            tarea.selectionEnd=fin;
            var texteDebut = contenu.substr(0,debut);
            var texteFin = contenu.substr(debut);
            tarea.value=texteDebut;
            tarea.scrollTo(0,9999999);
            var nouveauScroll=tarea.scrollTop;
            tarea.value=(texteDebut + texteFin);
            if(nouveauScroll > 50){
                tarea.scrollTo(0,(nouveauScroll + 50));
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
    allerAlaLigne(i,nomTextAreaSource){
        this.masquer_les_messages1('zone_global_messages');
        this.selectionner_ligne_de_text_area1(document.getElementById(nomTextAreaSource),i);
    }
    
    /*
      =============================================================================================================
      on fixer_les_dimentions
      fixer les dimentions des éléments de l'interface ( taille des boutons, textes ... )
      =============================================================================================================
    */
    fixer_les_dimentions(type_d_element){
        /*
          
          =====================================================================================================
          la première feuille de style [0] contient les éléments :root
        */
        var ss=document.styleSheets[0];
        var i = (ss.cssRules.length - 1);
        for(i=(ss.cssRules.length - 1);i >= 0;i--){
            if((ss.cssRules[i]['selectorText']) && (ss.cssRules[i].selectorText.indexOf(':root') >= 0)){
                var a = ss.cssRules[i].cssText.split('{');
                try{
                    var b = a[1].split('}');
                    var c = b[0].split(';');
                    var t={};
                    var j=0;
                    for(j=0;j < c.length;j++){
                        var d = c[j].split(':');
                        if(d.length === 2){
                            if(('dimension_du_texte' === type_d_element) && (d[0].trim() === '--yyvtrt')){
                                if(d[1].trim().indexOf('18') >= 0){
                                    t[d[0].trim()]='12px';
                                }else if(d[1].trim().indexOf('12') >= 0){
                                    t[d[0].trim()]='14px';
                                }else if(d[1].trim().indexOf('14') >= 0){
                                    t[d[0].trim()]='16px';
                                }else{
                                    t[d[0].trim()]='18px';
                                }
                            }else if(('dimension_du_padding' === type_d_element) && (d[0].trim() === '--yyvtrp')){
                                if(d[1].trim().indexOf('2') >= 0){
                                    t[d[0].trim()]='4px';
                                }else if(d[1].trim().indexOf('4') >= 0){
                                    t[d[0].trim()]='6px';
                                }else{
                                    t[d[0].trim()]='2px';
                                }
                            }else if(('dimension_du_border' === type_d_element) && (d[0].trim() === '--yyvtrb')){
                                if(d[1].trim().indexOf('1') >= 0){
                                    t[d[0].trim()]='2px';
                                }else if(d[1].trim().indexOf('2') >= 0){
                                    t[d[0].trim()]='3px';
                                }else if(d[1].trim().indexOf('3') >= 0){
                                    t[d[0].trim()]='4px';
                                }else if(d[1].trim().indexOf('4') >= 0){
                                    t[d[0].trim()]='5px';
                                }else{
                                    t[d[0].trim()]='1px';
                                }
                            }else if(('dimension_du_margin' === type_d_element) && (d[0].trim() === '--yyvtrm')){
                                if(d[1].trim().indexOf('1') >= 0){
                                    t[d[0].trim()]='2px';
                                }else if(d[1].trim().indexOf('2') >= 0){
                                    t[d[0].trim()]='3px';
                                }else if(d[1].trim().indexOf('3') >= 0){
                                    t[d[0].trim()]='4px';
                                }else if(d[1].trim().indexOf('4') >= 0){
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
                    var date_expiration_cookie= new Date((Date.now() + (86400000 * 30)));
                    date_expiration_cookie=date_expiration_cookie.toUTCString();
                    /*
                      
                      =============================================================================
                      On met le résultat dans un cookie pour mettre à jour root à chaque chargement de la page
                    */
                    var cookieString = (APP_KEY + '_biscuit' + '=' + encodeURIComponent(JSON.stringify(t)) + '; path=/; secure; expires=' + date_expiration_cookie + '; samesite=strict');
                    document.cookie=cookieString;
                    /* et on recharge la page */
                    window.location=window.location;
                    return;
                }catch(e){
                    console.log('raaah',e);
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
        var nomZone='zone_global_messages';
        var zon = document.getElementById(nomZone);
        if((zon.style.visibility === 'hidden')){
            zon.style.visibility='visible';
        }else{
            zon.style.visibility='hidden';
        }
    }
    /*
      =============================================================================================================
      on afficher_ou_masquer_les_messages1
      =============================================================================================================
    */
    masquer_les_messages1(nomZone){
        var zon = document.getElementById(nomZone);
        zon.style.visibility='hidden';
    }
    
    /*
      
      =====================================================================================================================
    */
    selectionner_une_plage1(debut,fin,nomDeZoneSource){
        this.masquer_les_messages1('zone_global_messages');
        var zoneSource = dogid(nomDeZoneSource);
        zoneSource.focus();
    //    zoneSource.select();
        zoneSource.selectionStart=debut;
        zoneSource.selectionEnd=fin;
        var texteDebut = zoneSource.value.substr(0,debut);
        var texteFin = zoneSource.value.substr(debut);
        zoneSource.value=texteDebut;
        zoneSource.scrollTo(0,9999999);
        var nouveauScroll=zoneSource.scrollTop;
        zoneSource.value=(texteDebut + texteFin);
        if(nouveauScroll > 50){
            zoneSource.scrollTo(0,(nouveauScroll + 50));
        }else{
            zoneSource.scrollTo(0,0);
        }
        zoneSource.selectionStart=debut;
        zoneSource.selectionEnd=fin;
    }
    /*
      =====================================================================================================================
      supprime les messages de la zone global_messages et masque la zone de texte qui contient les message
      remplace clearMessages
      =====================================================================================================================
    */
    raz_des_messages(){
        try{
            document.getElementById(this.#nom_div_des_messages1).innerHTML='';
            /* display a pu être mis à "none" ailleurs */
            document.getElementById(this.#nom_div_des_messages1).style.visibility='hidden';
        }catch(e){
        }
        global_messages={'errors':[],'warnings':[],'infos':[],'lines':[],'tabs':[],'ids':[],'ranges':[],'plages':[],'positions_caracteres':[],'calls':'','data':{'matrice':[],'tableau':[],'sourceGenere':''}};
    }
    /*
     ===================================================================================================
     on remplir_et_afficher_les_messages1
    */
    remplir_et_afficher_les_messages1(nomZone,nomDeLaTextAreaContenantLeTexteSource){
        this.reactiver_les_boutons1();
        var i=0;
        var affichagesPresents=false;
        var zon = document.getElementById(nomZone);
        var zone_message_est_vide=true;
        var numero_message=0;
        var temp='';
        if(zon.innerHTML !== ''){
            zone_message_est_vide=false;
        }
        var numLignePrecedente=-1;
        var nombre_de_boutons_affiches=0;
        while(global_messages.errors.length > 0){
            if((zone_message_est_vide) && (numero_message === 0)){
                zon.innerHTML+=('<div class="yyerreur">' + global_messages.errors[i] + '</div>');
                numero_message++;
            }else{
                zon.innerHTML+=('<div class="yyerreur">' + global_messages.errors[i] + '</div>');
            }
            global_messages.errors.splice(0,1);
            affichagesPresents=true;
        }
        while(global_messages.warnings.length > 0){
            if((zone_message_est_vide) && (numero_message === 0)){
                zon.innerHTML+=('<div class="yyavertissement">' + global_messages.warnings[i] + '</div>');
                numero_message++;
            }else{
                zon.innerHTML+=('<div class="yyavertissement">' + global_messages.warnings[i] + '</div>');
            }
            global_messages.warnings.splice(0,1);
            affichagesPresents=true;
        }
        while(global_messages.infos.length > 0){
            if((zone_message_est_vide) && (numero_message === 0)){
                zon.innerHTML+=('<div class="yysucces">' + global_messages.infos[i] + '</div>');
                numero_message++;
            }else{
                zon.innerHTML+=('<div class="yysucces">' + global_messages.infos[i] + '</div>');
            }
            global_messages.infos.splice(0,1);
            affichagesPresents=true;
        }
        while(global_messages.lines.length > 0){
            zon.innerHTML=('<a href="javascript:'+this.#nom_de_la_variable+'.allerAlaLigne(' + ((global_messages.lines[i])) + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" class="yyerreur" style="border:2px red outset;">sélectionner la ligne ' + ((global_messages.lines[i])) + '</a>&nbsp;' + zon.innerHTML);
            global_messages.lines.splice(0,1);
            affichagesPresents=true;
        }
        if((global_messages.data.matrice) && (global_messages.data.matrice.value)){
            for(i=0;(i < global_messages.ids.length) && (nombre_de_boutons_affiches <= 3);i++){
                var id=global_messages.ids[i];
                if((global_messages.data.matrice) && (id < global_messages.data.matrice.value.length)){
                    var ligneMatrice=global_messages.data.matrice.value[id];
                    var caractereDebut=ligneMatrice[5];
                    var numeroDeLigne=0;
                    var j=caractereDebut;
                    for(j=caractereDebut;j >= 0;j--){
                        if(global_messages.data.tableau.out[j][0] == '\n'){
                            numeroDeLigne=(numeroDeLigne + 1);
                        }
                    }
                }
                if(numeroDeLigne >= 0){
                    if(numeroDeLigne != numLignePrecedente){
                        zon.innerHTML=('<a href="javascript:'+this.#nom_de_la_variable+'.allerAlaLigne(' + ((numeroDeLigne + 1)) + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" class="yyerreur" style="border:2px red outset;">ligne ' + ((numeroDeLigne + 1)) + '</a>&nbsp;' + zon.innerHTML);
                        affichagesPresents=true;
                        numLignePrecedente=numeroDeLigne;
                        nombre_de_boutons_affiches++;
                    }
                }
            }
            global_messages.ids=[];
        }
        while(global_messages.ranges.length>0){
            zon.innerHTML=('&nbsp;<a href="javascript:'+this.#nom_de_la_variable+'.selectionner_une_plage1(' + global_messages.ranges[0][0] + ',' + global_messages.ranges[0][1] + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" class="yyerreur" style="border:2px red outset;">plage ' + global_messages.ranges[0][0] + ',' + global_messages.ranges[0][1] + '</a>' + zon.innerHTML);
            global_messages.ranges.splice(0,1);
            affichagesPresents=true;
        }
        while(global_messages.plages.length>0){
            zon.innerHTML=('&nbsp;<a href="javascript:'+this.#nom_de_la_variable+'.selectionner_une_plage1(' + global_messages.plages[0][0] + ',' + global_messages.plages[0][1] + ',\'' + nomDeLaTextAreaContenantLeTexteSource + '\')" class="yyerreur" style="border:2px red outset;">plage ' + global_messages.plages[0][0] + ',' + global_messages.plages[0][1] + '</a>' + zon.innerHTML);
            global_messages.plages.splice(0,1);
            affichagesPresents=true;
        }
        if(zon.innerHTML !== ''){
            zon.style.visibility='visible';
        }
    }    
    
}
export{interface1};