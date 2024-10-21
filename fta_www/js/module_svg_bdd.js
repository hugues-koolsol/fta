/*  
  voir getSvgTree afficheArbre0 looptree
*/
class module_svg_bdd{
    /*
      permet d'utiliser le nom de la variable dans des href="nom_de_la_variable.methode()"  
    */
    #nom_de_la_variable='';
    /*
      référence de l'élément html "div" contenant le svg
    */
    #div_svg=null;
    /*
      référence de l'élément html "svg"
    */
    #svg_dessin=null;
    /*
      taille de la bordure des boites
    */
    #taille_bordure=0;
    #id_text_area_contenant_les_id_des_bases='';
    /*
      sert pour le zoom
    */
    #_dssvg={zoom1:1,'viewBoxInit':[],'parametres':{rayonReference:16}};
    #id_svg_de_la_base_en_cours=0;
    #id_bdd_de_la_base_en_cours=0;
    /* arbre des bases : #arbre{id_de_la_base:{arbre_svg:{id:id,id_parent:id_parent,type_element:type_element,proprietes:{x:y}}}} */    
    #arbre={};
    
    #rayonPoint = (this.#_dssvg.parametres.rayonReference / this.#_dssvg.zoom1);
    #strkWiTexteSousPoignees = (this.#rayonPoint / 20);
    #fontSiTexteSousPoignees=this.#rayonPoint;
    #hauteur_du_svg=0;
    #largeur_du_svg=0;
    #souris_element_a_deplacer='';
    #souris_init_objet={x:0,y:0,elem_bouge:null,'param_bouge':{}};
    #svg_tableaux_des_references_amont_aval={};
    #svg_souris_delta_x=0;
    #svg_souris_delta_y=0;
    #propriete_pour_deplacement_x='pageX';
    #propriete_pour_deplacement_y='pageY';
    #debut_de_click=0;
    #position_min_gauche_de_reference=999999;
    #hauteur_de_boite = (CSS_TAILLE_REFERENCE_TEXTE + (2 * CSS_TAILLE_REFERENCE_PADDING) + (2 * this.#taille_bordure));
    #hauteur_de_boite_affichage = (this.#hauteur_de_boite + (3 * this.#taille_bordure));
    #liste_des_meta_base = [
        'nom_long_de_la_base',
        'nom_court_de_la_base',
        'nom_bref_de_la_base',
        'environnement_de_la_base',
        'default_charset',
        'collate'
    ];
    #liste_des_meta_table = ['nom_long_de_la_table','nom_court_de_la_table','nom_bref_de_la_table','default_charset','collate'];
    #liste_des_meta_champ = [
        'nom_long_du_champ',
        'nom_court_du_champ',
        'nom_bref_du_champ',
        'typologie',
        'default_charset',
        'collate'
    ];
    /*
      
      ====================================================================================================================
      function constructor
    */
    constructor(nom_de_la_variable,nom_de_la_div_contenant_le_svg,taille_bordure,id_text_area_contenant_les_id_des_bases){
        clearMessages('zone_global_messages');
        this.#nom_de_la_variable=nom_de_la_variable;
        /*
          si on utilise ce module en dehors d'un dessin svg par exemple pour comparer des tableaux des tables/champs
          la div svg est nulle
        */
        if(nom_de_la_div_contenant_le_svg!==null){
            this.#div_svg=document.getElementById(nom_de_la_div_contenant_le_svg);
            this.#taille_bordure=taille_bordure;
            this.#id_text_area_contenant_les_id_des_bases=id_text_area_contenant_les_id_des_bases;
            this.#div_svg.style.maxWidth='90vw';
            this.#div_svg.style.width='90vw';
            this.#div_svg.style.maxHeight='70vh';
            this.#div_svg.style.height='70vh';
            var e = this.#div_svg.getElementsByTagName('svg');
            var i=0;
            for(i=0;i < e.length;i++){
                this.#svg_dessin=e[i];
                break;
            }
            var taillereelle = this.#div_svg.getBoundingClientRect();
            var hauteur_de_la_div=taillereelle.height;
            var largeur_de_la_div=taillereelle.width;
            this.#div_svg.style.height=(hauteur_de_la_div + 'px');
            this.#div_svg.style.width=(largeur_de_la_div + 'px');
            /*
              
              le viewbox du svg est la taille de la div -2*bordure
            */
            this.#hauteur_du_svg=(hauteur_de_la_div - (2 * this.#taille_bordure));
            this.#largeur_du_svg=(largeur_de_la_div - (2 * this.#taille_bordure));
            this.#hauteur_de_boite=(CSS_TAILLE_REFERENCE_TEXTE + (2 * CSS_TAILLE_REFERENCE_PADDING) + (2 * this.#taille_bordure));
            this.#hauteur_de_boite_affichage=(this.#hauteur_de_boite + (1 * this.#taille_bordure));
            this.#svg_dessin.setAttribute('viewBox',('0 0 ' + this.#largeur_du_svg + ' ' + this.#hauteur_du_svg));
            this.#svg_dessin.style.width=(this.#largeur_du_svg + 'px');
            this.#svg_dessin.style.height=(this.#hauteur_du_svg + 'px');
            this.#_dssvg.viewBoxInit=[0,0,this.#largeur_du_svg,this.#hauteur_du_svg];
            this.#div_svg.addEventListener('wheel',this.zoom_avec_roulette.bind(this),false);
            window.addEventListener('mousedown',this.#souris_bas.bind(this),false);
            window.addEventListener('mouseup',this.#souris_haut.bind(this),false);
            window.addEventListener('mousemove',this.#souris_bouge.bind(this),false);
            this.#svg_dessin.addEventListener('touchstart',this.#doigt_bas.bind(this),false);
            window.addEventListener('touchend',this.#doigt_haut.bind(this),false);
            window.addEventListener('touchmove',this.#doigt_bouge.bind(this),false);
            this.#charger_les_bases_initiales_en_asynchrone();
            
        }
    }
    /*
      ========================================================================================================
      function recupérer_un_fetch
    */
    async #recupérer_un_fetch(url,donnees){
//            var r=null;
            var en_entree={
                'signal':AbortSignal.timeout(2000),
                'method':"POST",
                'mode':"cors",
                'cache':"no-cache",
                'credentials':"same-origin",
                'headers':{'Content-Type':'application/x-www-form-urlencoded'},
                'redirect':"follow",
                'referrerPolicy':"no-referrer",
                'body':('ajax_param=' + encodeURIComponent(JSON.stringify(donnees)))
            };
            try{

                var response= await fetch( url, en_entree);
                
                var t=await response.text();
                try{
                    var le_json=JSON.parse(t);
                    return le_json;
                }catch(e){
                    logerreur({status:false,message:'erreur sur convertion json, texte non json='+t});
                    logerreur({status:false,message:'url='+url});
                    logerreur({status:false,message:JSON.stringify(en_entree)});
                    logerreur({status:false,message:JSON.stringify(donnees)});
                    return({status:'KO' , message:'le retour n\'est pas en json'});
                }

            }catch(e){

                debugger
                console.log('e=',e);
                return({status:'KO' , message:e.message});
                
            }
            
    }
    /*
      ====================================================================================================================
      function #message_succes_et_fermer_modale
    */
    #message_succes_modale(donnees){
        document.getElementById('__message_modale').innerHTML='<div class="yysucces">OK</div>'
    }
    /*
      ====================================================================================================================
      function #message_succes_et_fermer_modale
    */
    #message_succes_et_fermer_modale(donnees){
        document.getElementById('__message_modale').innerHTML='<div class="yysucces">OK</div>'
        setTimeout(
         function(){
          __gi1.global_modale2.close();
          document.getElementById('__message_modale').innerHTML='';
         },
         500
        );
    }
    /*
      ====================================================================================================================
      function #message_erreur_modale
    */
    #message_erreur_modale(donnees){
        var t='';
        t+='<div class="yyerreur">KO</div>';
        if(donnees.messages){
            for(var i in donnees.messages){
                t+='<div class="yyerreur">'+donnees.messages[i]+'</div>';
            }
        }
        document.getElementById('__message_modale').innerHTML=t;
    }
    /*
      ====================================================================================================================
      function svg_ajuster_la_largeur_des_boites_de_la_table
    */
    #svg_ajuster_la_largeur_des_boites_de_la_table(tableau){
        var id_svg_conteneur_table=tableau[0];
        var id_bdd=tableau[1];
        try{
            var id_svg_de_la_base_en_cours = this.#svg_dessin.getElementById(id_svg_conteneur_table).getAttribute('id_svg_de_la_base_en_cours');
        }catch(e){
            debugger;
        }
        var liste_des_paths = this.#svg_dessin.getElementById(id_svg_de_la_base_en_cours).getElementsByTagName('path');
        var hauteur_de_la_table=0;
        var largeur_max=0;
        var groupe_table = this.#svg_dessin.getElementById(id_svg_conteneur_table);
        try{
            var lst = groupe_table.getElementsByTagName('text');
        }catch(e){
            debugger;
        }
        var i=0;
        for(i=0;i < lst.length;i++){
            var bb = lst[i].getBBox();
            if(largeur_max < bb.width){
                largeur_max=Math.ceil(bb.width);
            }
            hauteur_de_la_table+=this.#hauteur_de_boite_affichage;
        }
        largeur_max+=(2 * this.#taille_bordure);
        if(largeur_max < 40){
            largeur_max=40;
        }
        var position_haut=this.#taille_bordure;
        var lst = this.#svg_dessin.getElementById(id_svg_conteneur_table).getElementsByTagName('*');
        /* nom de la table */
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].getAttribute('type_element')){
                if(lst[i].getAttribute('type_element') === 'conteneur_de_nom_de_table'){
                    lst[i].decallage_x=this.#taille_bordure;
                    lst[i].decallage_y=position_haut;
                    lst[i].setAttribute('transform',('translate(' + this.#taille_bordure + ',' + position_haut + ')'));
                    position_haut+=this.#hauteur_de_boite_affichage;
                }else if(lst[i].getAttribute('type_element') === 'rectangle_de_nom_de_table'){
                    lst[i].setAttribute('width',largeur_max);
                }
            }
        }
        /* champs */
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].getAttribute('type_element')){
                if(lst[i].getAttribute('type_element') === 'conteneur_de_champ'){
                    var nom_du_champ = lst[i].getAttribute('nom_du_champ');
                    lst[i].decallage_x=this.#taille_bordure;
                    lst[i].decallage_y=position_haut;
                    lst[i].setAttribute('transform',('translate(' + this.#taille_bordure + ',' + position_haut + ')'));
                    var j=0;
                    for(j=0;j < liste_des_paths.length;j++){
                        if((liste_des_paths[j].getAttribute('type_element')) && (liste_des_paths[j].getAttribute('type_element') === 'reference_croisée')){
                            /*
                              
                              
                            */
                            if((parseInt(liste_des_paths[j].getAttribute('id_svg_parent_table'),10) === id_svg_conteneur_table) && (liste_des_paths[j].getAttribute('id_svg_parent_champ') === lst[i].getAttribute('id'))){
                                /*
                                  
                                  si ce champ a des enfants, il faut mettre à jour les liens qui pointent sur ce champ
                                */
                                var ancien_chemin = liste_des_paths[j].getAttribute('d');
                                var tab_chemin = ancien_chemin.split(' ');
                                tab_chemin[6]=parseInt((parseInt(groupe_table.getAttribute('decallage_x'),10) + this.#taille_bordure + largeur_max + 30),10);
                                tab_chemin[7]=parseInt((parseInt(groupe_table.getAttribute('decallage_y'),10) + position_haut + (this.#hauteur_de_boite_affichage / 2)),10);
                                tab_chemin[8]=parseInt((parseInt(groupe_table.getAttribute('decallage_x'),10) + this.#taille_bordure + largeur_max),10);
                                tab_chemin[9]=parseInt((parseInt(groupe_table.getAttribute('decallage_y'),10) + position_haut + (this.#hauteur_de_boite_affichage / 2)),10);
                                var nouveau_chemin = tab_chemin.join(' ');
                                liste_des_paths[j].setAttribute('d',nouveau_chemin);
                                this.#arbre[id_bdd].arbre_svg[liste_des_paths[j].id].proprietes.d=nouveau_chemin;
                                var k={};
                                for(k in this.#svg_tableaux_des_references_amont_aval[id_bdd]){
                                    if((this.#svg_tableaux_des_references_amont_aval[id_bdd][k]) && (this.#svg_tableaux_des_references_amont_aval[id_bdd][k].id_svg_parent_table === id_svg_conteneur_table) && (parseInt(lst[i].getAttribute('id'),10) === this.#svg_tableaux_des_references_amont_aval[id_bdd][k].id_svg_parent_champ)){
                                        /*
                                          
                                          mise à jour de p222222
                                        */
                                        this.#svg_tableaux_des_references_amont_aval[id_bdd][k].p2[0]=parseInt(tab_chemin[8],10);
                                        this.#svg_tableaux_des_references_amont_aval[id_bdd][k].p2[1]=parseInt(tab_chemin[9],10);
                                    }
                                }
                            }else if((parseInt(liste_des_paths[j].getAttribute('id_svg_enfant_table'),10) === id_svg_conteneur_table) && (liste_des_paths[j].getAttribute('id_svg_enfant_champ') === lst[i].getAttribute('id'))){
                                /*
                                  
                                  ce champ a un parent, il faut mettre à jour le lien
                                */
                                var ancien_chemin = liste_des_paths[j].getAttribute('d');
                                var tab_chemin = ancien_chemin.split(' ');
                                
                                tab_chemin[1]=parseInt(groupe_table.getAttribute('decallage_x'),10);
                                tab_chemin[2]=parseInt((parseInt(groupe_table.getAttribute('decallage_y'),10) + position_haut + (this.#hauteur_de_boite_affichage / 2)),10);
                                tab_chemin[4]=(parseInt(groupe_table.getAttribute('decallage_x'),10) - 30);
                                tab_chemin[5]=parseInt((parseInt(groupe_table.getAttribute('decallage_y'),10) + position_haut + (this.#hauteur_de_boite_affichage / 2)),10);
                                var nouveau_chemin = tab_chemin.join(' ');
                                liste_des_paths[j].setAttribute('d',nouveau_chemin);
                                this.#arbre[id_bdd].arbre_svg[liste_des_paths[j].id].proprietes.d=nouveau_chemin;
                                var k={};
                                for(k in this.#svg_tableaux_des_references_amont_aval[id_bdd]){
                                    if(k === 2){
                                        console.log(this.#svg_tableaux_des_references_amont_aval[id_bdd][k]);
                                    }
                                    if((this.#svg_tableaux_des_references_amont_aval[id_bdd][k]) && (this.#svg_tableaux_des_references_amont_aval[id_bdd][k].id_svg_enfant_table === id_svg_conteneur_table) && (this.#svg_tableaux_des_references_amont_aval[id_bdd][k].id_svg_enfant_champ === parseInt(lst[i].getAttribute('id'),10))){
                                        /*
                                          
                                          mise à jour de p1111
                                        */
                                        this.#svg_tableaux_des_references_amont_aval[id_bdd][k].p1[0]=parseInt(tab_chemin[1],10);
                                        this.#svg_tableaux_des_references_amont_aval[id_bdd][k].p1[1]=parseInt(tab_chemin[2],10);
                                    }
                                }
                            }
                        }
                    }
                    position_haut+=this.#hauteur_de_boite_affichage;
                }else if(lst[i].getAttribute('type_element') === 'rectangle_de_champ'){
                    lst[i].setAttribute('width',largeur_max);
                }
            }
        }
        /* indexes */
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].getAttribute('type_element')){
                if(lst[i].getAttribute('type_element') === 'conteneur_d_index'){
                    lst[i].decallage_x=this.#taille_bordure;
                    lst[i].decallage_y=position_haut;
                    lst[i].setAttribute('transform',('translate(' + this.#taille_bordure + ',' + position_haut + ')'));
                    position_haut+=this.#hauteur_de_boite_affichage;
                }else if(lst[i].getAttribute('type_element') === 'rectangle_d_index'){
                    lst[i].setAttribute('width',largeur_max);
                }
            }
        }
        /* rectangle de table */
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].getAttribute('type_element')){
                if(lst[i].getAttribute('type_element') === 'rectangle_de_table'){
                    lst[i].setAttribute('width',(largeur_max + (2 * this.#taille_bordure)));
                    lst[i].setAttribute('height',position_haut);
                }
            }
        }
    }
    /*
      
      ====================================================================================================================
      function modale_ajouter_une_table
    */
    modale_ajouter_une_table(){
        document.getElementById('__contenu_modale').innerHTML=t;
        __gi1.global_modale2.showModal();
    }
    /*
      
      ====================================================================================================================
      function changer_le_nom_de_table
    */
    changer_le_nom_de_table(id_element_svg,id_svg_conteneur_table){
        var nouveau_nom = document.getElementById('nouveau_nom').value;
        var ancien_nom = document.getElementById('ancien_nom').value;
        var id_svg_conteneur_table = parseInt(id_svg_conteneur_table,10);
        /* à faire, vérifier les noms des autres tables */
        if(nouveau_nom !== ancien_nom){
            /* changement du visuel */
            var id_element_svg = parseInt(id_element_svg,10);
            var element_svg = document.getElementById(id_element_svg);
            var j=0;
            for(j=0;j < element_svg.childNodes.length;j++){
                if(element_svg.childNodes[j].nodeName.toLowerCase() === '#text'){
                    element_svg.childNodes[j].data=nouveau_nom;
                    /* mise à jour de l'arbre */
                    this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_element_svg].contenu=('<tspan style="cursor:move;" id_svg_conteneur_table="' + id_svg_conteneur_table + '" id_bdd_de_la_base_en_cours="' + this.#id_bdd_de_la_base_en_cours + '"  id_svg_de_la_base_en_cours="' + this.#id_svg_de_la_base_en_cours + '">🟥</tspan>' + nouveau_nom);
                    break;
                }
            }
            /*
              
              changement des champs nom_de_la_table pour les éléments dans la base courante
            */
            var lst = document.getElementById(this.#id_svg_de_la_base_en_cours).getElementsByTagName('*');
            var i=0;
            for(i=0;i < lst.length;i++){
                if((lst[i].getAttribute('nom_de_la_table')) && (lst[i].getAttribute('nom_de_la_table') === ancien_nom)){
                    lst[i].setAttribute('nom_de_la_table',nouveau_nom);
                    if((this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes) && (this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_la_table)){
                        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_la_table=nouveau_nom;
                    }
                }
                if((lst[i].getAttribute('nom_de_la_table_pour_l_index')) && (lst[i].getAttribute('nom_de_la_table_pour_l_index') === ancien_nom)){
                    lst[i].setAttribute('nom_de_la_table_pour_l_index',nouveau_nom);
                    if((this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes) && (this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_la_table_pour_l_index)){
                        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_la_table_pour_l_index=nouveau_nom;
                    }
                }
                if((lst[i].getAttribute('donnees_rev_du_champ')) && (lst[i].getAttribute('donnees_rev_du_champ').indexOf(ancien_nom) >= 0)){
                    var a_remplacer= new RegExp(ancien_nom,'g');
                    lst[i].setAttribute('donnees_rev_du_champ',lst[i].getAttribute('donnees_rev_du_champ').replace(a_remplacer,nouveau_nom));
                }
            }
            var i=0;
            for(i=0;i < this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours].length;i++){
                var elem=this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i];
                if(elem.nom_parent_table === ancien_nom){
                    this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i].nom_parent_table=nouveau_nom;
                }
                if(elem.nom_enfant_table === ancien_nom){
                    this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i].nom_enfant_table=nouveau_nom;
                }
            }
            this.#svg_ajuster_largeur_de_table(id_svg_conteneur_table);
            __gi1.global_modale2.close();
        }
    }
    /*
      ====================================================================================================================
      function recuperer_prochain_id_svg
    */
    #recuperer_prochain_id_svg(){
        var i=0;
        var j=0;
        var max_id=-1;
        var lst = this.#svg_dessin.getElementsByTagName('*');
        for(i=0;i < lst.length;i++){
            if((lst[i].id) && (isNumeric(lst[i].id))){
                j=parseInt(lst[i].id,10);
                if(j > max_id){
                    max_id=j;
                }
            }
        }
        max_id++;
        return max_id;
    }
    /*
      
      ====================================================================================================================
      function ajouter_une_table_provenant_de_modale
    */
    ajouter_une_table_provenant_de_modale(nom_champ_nouveau_nom){
        var nom_de_la_table = document.getElementById(nom_champ_nouveau_nom).value;
        var j=0;
        var i=0;
        var indice_courant=this.#recuperer_prochain_id_svg();
        var id_svg_conteneur_table=indice_courant;
        var a = this.#ajouter_table_a_svg(nom_de_la_table,indice_courant,[0,0],('(table , ' + nom_de_la_table + '),(nom_long_de_la_table , \'à faire ' + nom_de_la_table + '\'),(nom_court_de_la_table , \'à faire ' + nom_de_la_table + '\'),(nom_bref_de_la_table  , \'à faire ' + nom_de_la_table + '\'),(transform_table_sur_svg , transform(translate(0 , 0)))'));
        var id_svg_conteneur_table=a.id_svg_conteneur_table;
        indice_courant+=2;
        var a = this.#ajouter_nom_de_table_au_svg(nom_de_la_table,indice_courant,id_svg_conteneur_table,0);
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
//        this.#svg_ajuster_la_largeur_des_boites_de_la_table([id_svg_conteneur_table,this.#id_bdd_de_la_base_en_cours]);
//        this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
    }
    /*
      
      ====================================================================================================================
      function ajouter_un_champ_de_modale
    */
    ajouter_un_champ_de_modale(id_svg_conteneur_table,nom_de_la_table){
        var nom_du_champ            = document.getElementById('nom_du_champ').value;
        var typologie               = document.getElementById('typologie').value;
        var type                    = document.getElementById('type').value;
        var primaire                = document.getElementById('primaire').checked;
        var non_nulle               = document.getElementById('non_nulle').checked;
        var auto_increment          = document.getElementById('auto_increment').checked;
        var a_une_valeur_par_defaut = document.getElementById('a_une_valeur_par_defaut').checked;
        var la_valeur_par_defaut_est_caractere= document.getElementById('la_valeur_par_defaut_est_caractere').checked;
        var j=0;
        var i=0;
        document.getElementById('zone_message_ajouter_un_champ').innerHTML='';
        if((type === '') || (typologie === '' || nom_du_champ==='' )){
            document.getElementById('zone_message_ajouter_un_champ').innerHTML='Vous devez choisir un type et une typologie et renseigner le nom du champ';
            return;
        }
        
        if(document.getElementById('table_mère').value!=='' || document.getElementById('champ_père').value!=='' ){
            if(document.getElementById('table_mère').value==='' || document.getElementById('champ_père').value===''){
               document.getElementById('zone_message_ajouter_un_champ').innerHTML='erreur sur la table ou le champ parent';
               return;
            }
            /*
            la référence croisée existe-t-elle dans le svg
            */
            var trouve=false;
            var elems2=document.getElementById(this.#id_svg_de_la_base_en_cours).getElementsByTagName('rect');
            for(var j=0;j<elems2.length && trouve===false ;j++){
                if(
                     elems2[j].getAttribute('type_element') 
                  && elems2[j].getAttribute('type_element')==="rectangle_de_champ" 
                  && elems2[j].getAttribute('nom_de_la_table')
                  && elems2[j].getAttribute('nom_de_la_table')===document.getElementById('table_mère').value
                  && elems2[j].getAttribute('nom_du_champ')
                  && elems2[j].getAttribute('nom_du_champ')===document.getElementById('champ_père').value){
                      trouve=true;
                      
                  
                }
            }
            if(trouve===false){
               document.getElementById('zone_message_ajouter_un_champ').innerHTML='table mère ou champ père non trouvé';
               return;
            }
        }
        
        var indice_courant=this.#recuperer_prochain_id_svg();
        var rev = 'nom_du_champ(\'' + nom_du_champ + '\'),';
        rev +='type(' + type.toUpperCase() + ')';
        rev +=((primaire)?',primary_key()':'') ;
        rev +=((non_nulle)?',non_nulle()':'');
        rev +=((auto_increment)?',auto_increment()':'');
        if(a_une_valeur_par_defaut===true){
            if(la_valeur_par_defaut_est_caractere===true){
                rev +=',valeur_par_defaut(\''+document.getElementById('valeur_par_defaut').value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
            }else{
                if(isNumeric(document.getElementById('valeur_par_defaut').value)){
                    rev +=',valeur_par_defaut('+document.getElementById('valeur_par_defaut').value+')';
                }else{
                    var la_valeur=document.getElementById('valeur_par_defaut').value;
                    if(   la_valeur.toLowerCase()==='true' 
                       || la_valeur.toLowerCase()==='false' 
                       || la_valeur.toLowerCase()==='null'
                       || la_valeur.toUpperCase()==='CURRENT_TIMESTAMP'
                       || la_valeur.toUpperCase()==='CURRENT_TIME'
                       || la_valeur.toUpperCase()==='CURRENT_DATE'
                    ){
                        rev +=',valeur_par_defaut('+document.getElementById('valeur_par_defaut').value+')';
                    }else{
                        document.getElementById('zone_message_ajouter_un_champ').innerHTML='problème sur la valeur par défaut';
                        return;
                    }
                }
            }
        }
        
        rev +=',meta(';
        rev +='(\'champ\' , \'' + nom_du_champ.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
        rev +='typologie(' + typologie + ')';
        rev +=((primaire)?',primary_key()':'') ;
        rev +=((non_nulle)?',non_nulle()':'');
        rev +=((auto_increment)?',auto_increment()':'');
        rev +=',(\'nom_long_du_champ\' , \'' + document.getElementById('meta_ajouter__nom_long_du_champ').value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
        rev +=',(\'nom_court_du_champ\' , \'' + document.getElementById('meta_ajouter__nom_court_du_champ').value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
        rev +=',(\'nom_bref_du_champ\' , \'' + document.getElementById('meta_ajouter__nom_bref_du_champ').value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')';
        rev +=')';
        
        var a = this.#ajouter_champ_a_arbre(nom_du_champ,indice_courant,id_svg_conteneur_table,nom_de_la_table,this.#id_bdd_de_la_base_en_cours,rev);
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
//        this.#svg_ajuster_la_largeur_des_boites_de_la_table([id_svg_conteneur_table,this.#id_bdd_de_la_base_en_cours]);
//        this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
    }
    /*
      
      ====================================================================================================================
      function changer_le_nom_d_index_de_modale
    */
    changer_le_nom_d_index_de_modale(id_svg_text,id_svg_conteneur_table,id_svg_rectangle_de_l_index,id_svg_conteneur_d_index){
        var nouveau_nom = document.getElementById('nouveau_nom').value;
        var ancien_nom = document.getElementById('ancien_nom').value;
        /* à faire, vérifier les noms des autres tables */
        if(nouveau_nom !== ancien_nom){
            /* changement du visuel */
            var id_zone_element_svg = parseInt(id_svg_text,10);
            var element_svg = document.getElementById(id_zone_element_svg);
            var j=0;
            for(j=0;j < element_svg.childNodes.length;j++){
                if(element_svg.childNodes[j].nodeName.toLowerCase() === '#text'){
                    element_svg.childNodes[j].data=nouveau_nom;
                    /* mise à jour de l'arbre */
                    this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_zone_element_svg].contenu=nouveau_nom;
                    break;
                }
            }
            var lst = document.getElementById(id_svg_conteneur_table).getElementsByTagName('*');
            var i=0;
            for(i=0;i < lst.length;i++){
                if('rectangle_d_index'===lst[i].getAttribute('type_element') && parseInt(lst[i].id,10) === id_svg_rectangle_de_l_index){
                 lst[i].setAttribute('nom_de_l_index', nouveau_nom )
                 /* à faire : passer par le rev */
                 var a_remplacer= new RegExp(ancien_nom,'g');
                 lst[i].setAttribute('donnees_rev_de_l_index',lst[i].getAttribute('donnees_rev_de_l_index').replace(a_remplacer,nouveau_nom));
                 this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_l_index=nouveau_nom;
                }
            }
        }
        this.#svg_ajuster_largeur_de_table(id_svg_conteneur_table);
        __gi1.global_modale2.close();
    }
    /*
      
      ====================================================================================================================
      function changer_le_nom_de_champ_de_modale
    */
    changer_le_nom_de_champ_de_modale(id_svg_text,id_svg_conteneur_table){
        var nouveau_nom = document.getElementById('nouveau_nom').value;
        var ancien_nom = document.getElementById('ancien_nom').value;
        /* à faire, vérifier les noms des autres tables */
        if(nouveau_nom !== ancien_nom){
            /* changement du visuel */
            var id_zone_element_svg = parseInt(id_svg_text,10);
            var element_svg = document.getElementById(id_zone_element_svg);
            var j=0;
            for(j=0;j < element_svg.childNodes.length;j++){
                if(element_svg.childNodes[j].nodeName.toLowerCase() === '#text'){
                    element_svg.childNodes[j].data=nouveau_nom;
                    /* mise à jour de l'arbre */
                    this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_zone_element_svg].contenu=nouveau_nom;
                    break;
                }
            }
            /*
              
              changement des champs nom_du_champ pour les éléments dans la base courante
            */
            var lst = document.getElementById(id_svg_conteneur_table).getElementsByTagName('*');
            var i=0;
            for(i=0;i < lst.length;i++){
                if((lst[i].getAttribute('nom_du_champ')) && (lst[i].getAttribute('nom_du_champ') === ancien_nom)){
                    lst[i].setAttribute('nom_du_champ',nouveau_nom);
                    if((this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes) && (this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_du_champ)){
                        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_du_champ=nouveau_nom;
                    }
                }
                if((lst[i].getAttribute('donnees_rev_du_champ')) && (lst[i].getAttribute('donnees_rev_du_champ').indexOf(ancien_nom) >= 0)){
                    /* à faire : passer par le rev */
                    var a_remplacer= new RegExp(ancien_nom,'g');
                    lst[i].setAttribute('donnees_rev_du_champ',lst[i].getAttribute('donnees_rev_du_champ').replace(a_remplacer,nouveau_nom));
                }
                if((lst[i].getAttribute('type_element')) && ('rectangle_d_index' === lst[i].getAttribute('type_element'))){
                    if((lst[i].getAttribute('donnees_rev_de_l_index')) && (lst[i].getAttribute('donnees_rev_de_l_index').indexOf(ancien_nom) >= 0)){
                        /* à faire passer par le rev */
                        var a_remplacer= new RegExp(ancien_nom,'g');
                        lst[i].setAttribute('donnees_rev_de_l_index',lst[i].getAttribute('donnees_rev_de_l_index').replace(a_remplacer,nouveau_nom));
                    }
                }
            }
            var i=0;
            for(i=0;i < this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours].length;i++){
                var elem=this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i];
                if(elem.nom_parent_champ === ancien_nom){
                    this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i].nom_parent_champ=nouveau_nom;
                }
                if(elem.nom_enfant_champ === ancien_nom){
                    this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i].nom_enfant_champ=nouveau_nom;
                }
            }
            this.#svg_ajuster_largeur_de_table(id_svg_conteneur_table);
            __gi1.global_modale2.close();
        }
    }
    /*
      
      ====================================================================================================================
      function modifier_un_index_de_modale
    */
    modifier_un_index_de_modale(id_svg_rectangle_de_l_index,nom_de_l_index,nom_de_la_table){
        id_svg_rectangle_de_l_index=parseInt(id_svg_rectangle_de_l_index,10);
        var liste_meta_index={index:nom_de_l_index,message:''};
        var meta = ('(index , \'' + nom_de_l_index + '\')');
        var t = ('index_name(\'' + nom_de_l_index.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),nom_de_la_table_pour_l_index(\'' + nom_de_la_table.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')');
        var lst = document.getElementById('__contenu_modale').getElementsByTagName('*');
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].id === ''){
                continue;
            }else if((lst[i].id) && (lst[i].id === 'unique') && (lst[i].checked === true)){
                t+=',unique()';
            }else if((lst[i].id) && (lst[i].id === 'liste_des_champ_de_l_index')){
                t+=(',fields(' + lst[i].value + ')');
            }else if((lst[i].id) && (lst[i].id.substr(0,15) === 'meta_modifier__') && (lst[i].value !== '')){
                meta+=(',(' + lst[i].id.substr(15) + ',\'' + lst[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')');
            }
        }
        t+=(',meta(' + meta + ')');
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_svg_rectangle_de_l_index].proprietes['donnees_rev_de_l_index']=t;
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
    }
    /*
      ====================================================================================================================
      function supprimer_un_index_dans_rev_de_modale
    */
    supprimer_un_index_dans_rev_de_modale(id_svg_rectangle_de_l_index,nom_de_l_index,nom_de_la_table){
        var id_de_l_index = parseInt(document.getElementById(id_svg_rectangle_de_l_index).parentNode.id,10);
        this.#supprimer_recursivement_les_elements_de_l_arbre(this.#id_bdd_de_la_base_en_cours,id_de_l_index);
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
    }
    
    
    /*
      ====================================================================================================================
      function supprimer_un_index_dans_base_de_modale
    */
    supprimer_un_index_dans_base_de_modale(id_svg_rectangle_de_l_index,nom_de_l_index,nom_de_la_table){
        var source_sql='DROP INDEX '+nom_de_l_index;

        async function supprimer_en_bdd_l_index(url="",donnees,that){
            return that.#recupérer_un_fetch(url,donnees);
        }
        var ajax_param={'call':{'lib':'core','file':'bdd','funct':'supprimer_en_bdd_l_index'},source_sql:source_sql,id_bdd_de_la_base:this.#id_bdd_de_la_base_en_cours};
        supprimer_en_bdd_l_index('za_ajax.php?supprimer_en_bdd_l_index',ajax_param,this).then((donnees) => {
            if(donnees.status === 'OK'){
                console.log('OK');
            }else{
                console.log('KO donnees=',donnees);
            }
        });

    }
    
    /*
      ====================================================================================================================
      function ajouter_un_index_dans_base_de_modale
    */
    ajouter_un_index_dans_base_de_modale(id_svg_rectangle_de_l_index,nom_de_l_index,nom_de_la_table){
//        console.log(id_svg_rectangle_de_l_index,nom_de_l_index,nom_de_la_table , document.getElementById(id_svg_rectangle_de_l_index));
        var rev_texte='add_index('+document.getElementById(id_svg_rectangle_de_l_index).getAttribute('donnees_rev_de_l_index')+')';
        var obj1=rev_texte_vers_matrice(rev_texte);
        if(obj1.status===true){
            var obj2=tabToSql1(obj1.value,0,0);
            if(obj2.status===true){
//                console.log('obj2.value=' , obj2.value );
                var source_sql=obj2.value;
                
                async function ajouter_en_bdd_l_index(url="",donnees,that){
                    return that.#recupérer_un_fetch(url,donnees);
                }
                var ajax_param={'call':{'lib':'core','file':'bdd','funct':'ajouter_en_bdd_l_index'},source_sql:source_sql,id_bdd_de_la_base:this.#id_bdd_de_la_base_en_cours};
                ajouter_en_bdd_l_index('za_ajax.php?ajouter_en_bdd_l_index',ajax_param,this).then((donnees) => {
                    if(donnees.status === 'OK'){
                        console.log('OK');
                    }else{
                        console.error('KO donnees=',donnees);
                    }
                });
                
                
                
            }
        }
    }
    
    
    /*
      ====================================================================================================================
      function ajouter_en_bdd_le_champ_de_modale
    */
    ajouter_en_bdd_le_champ_de_modale(id_svg_text,id_svg_conteneur_table,nom_du_champ,id_svg_rectangle_du_champ , nom_de_la_table){
     
        var definition_du_champ='';    
        var a=document.getElementById(id_svg_rectangle_du_champ);        
        if((a.getAttribute('type_element')) && (a.getAttribute('type_element') == 'rectangle_de_champ')){
            var nom_du_champ = a.getAttribute('nom_du_champ');
            definition_du_champ+='sql(field(' + a.getAttribute('donnees_rev_du_champ') + '))';
            
//            console.log(definition_du_champ);

            var obj1=rev_texte_vers_matrice(definition_du_champ);
            if(obj1.status===true){

                var obj2=tabToSql1(obj1.value,0,0);
                if(obj2.status===true){
//                    console.log(obj2.value);

                    async function ajouter_en_bdd_le_champ(url="",donnees,that){
                        return that.#recupérer_un_fetch(url,donnees);
                     
                    }
                    var source_sql='ALTER TABLE `'+nom_de_la_table+'` ADD COLUMN '+ obj2.value+';';
                    

                    var ajax_param={'call':{'lib':'core','file':'bdd','funct':'ajouter_en_bdd_le_champ'},source_sql:source_sql,id_bdd_de_la_base:this.#id_bdd_de_la_base_en_cours};
                    ajouter_en_bdd_le_champ('za_ajax.php?ajouter_en_bdd_le_champ',ajax_param,this).then((donnees) => {
                        if(donnees.status === 'OK'){
                            this.#message_succes_et_fermer_modale(donnees);
                        }else{
                            this.#message_erreur_modale(donnees);
                            console.error('KO donnees=' , donnees);
                        }
                    });

                }else{
                    debugger
                }
            }else{
                debugger
            }
        }
    }
    /*
      ====================================================================================================================
      function supprimer_le_champ_de_modale
    */
    supprimer_le_champ_de_modale(id_svg_text,id_svg_conteneur_table,nom_du_champ,id_svg_rectangle_du_champ){
        id_svg_rectangle_du_champ=parseInt(id_svg_rectangle_du_champ,10);
        var elt_parent = document.getElementById(id_svg_text).parentNode;
        var id_parent = parseInt(elt_parent.id,10);
        var nom_de_la_table = elt_parent.getAttribute('nom_de_la_table');
        this.#supprimer_recursivement_les_elements_de_l_arbre(this.#id_bdd_de_la_base_en_cours,id_parent);
        /*
          Il faut supprimer les indexes 
        */
        var i={};
        for(i in this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg){
            var elt=this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i];
            if(elt === null){
                continue;
            }
            if((elt.proprietes) && (elt.proprietes.type_element === 'rectangle_d_index') && (elt.proprietes.nom_de_la_table_pour_l_index === nom_de_la_table) && (elt.proprietes.donnees_rev_de_l_index) && (elt.proprietes.donnees_rev_de_l_index.indexOf(nom_du_champ) >= 0)){
                /*
                  
                  il faut supprimer le champ de cet index puis supprimer l'index s'il n'y a plus de champ
                */
                var obj = functionToArray(elt.proprietes.donnees_rev_de_l_index,true,false,'');
                if(obj.status === true){
                    var j=0;
                    for(j=0;j < obj.value.length;j++){
                        if((obj.value[j][1] === 'fields') && (obj.value[j][3] === 0) && (obj.value[j][2] === 'f')){
                            var k = (j + 1);
                            for(k=(j + 1);k < obj.value.length;k++){
                                if((obj.value[k][1] === nom_du_champ) && (obj.value[k][2] === 'c')){
                                    /*
                                      
                                      ce champ est dans l'index, si c'est le seul champ, on supprime l'index,
                                      sinon on le retire du champ
                                    */
                                    if(obj.value[obj.value[k][7]][8] === 1){
                                        /*
                                          
                                          c'est le seul champ de l'index, on supprime l'index
                                        */
                                        this.#supprimer_recursivement_les_elements_de_l_arbre(this.#id_bdd_de_la_base_en_cours,elt.id_parent);
                                    }else{
                                        var nouvelle_matrice = supprimer_un_element_de_la_matrice(obj.value,k,0);
                                        var obj = a2F1(nouvelle_matrice,0,false,1,false);
                                        if(obj.status === true){
                                            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes.donnees_rev_de_l_index=obj.value;
                                        }else{
                                            debugger;
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }else{
                    debugger;
                    return;
                }
            }
        }
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
    }
    /*
      
      ====================================================================================================================
      function modifier_un_champ_de_modale
    */
    modifier_un_champ_de_modale(id_svg_rectangle_du_champ,nom_du_champ,nom_de_la_table){
        id_svg_rectangle_du_champ=parseInt(id_svg_rectangle_du_champ,10);
        var liste_meta_champ={nom_du_champ:nom_du_champ,'nom_long_du_champ':('à faire ' + nom_du_champ + ''),'nom_court_du_champ':('à faire ' + nom_du_champ + ''),'nom_bref_du_champ':('à faire ' + nom_du_champ + ''),typologie:'ch?',default_charset:'',collate:''};
        var t='';
        var champ_pere='';
        var table_mere='';
        var meta = ('(champ , \'' + nom_du_champ + '\')');
        document.getElementById('zone_message_modifier_un_champ').className='';
        document.getElementById('zone_message_modifier_un_champ').innerHTML='';
        
        t+=('nom_du_champ(\'' + nom_du_champ + '\')');
        var lst = document.getElementById('__contenu_modale').getElementsByTagName('*');
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].id === ''){
                continue;
            }else if((lst[i].id) && (lst[i].id === 'type_du_champ') && (lst[i].value !== '')){
                t+=(',type(\'' + lst[i].value + '\')');
            }else if((lst[i].id) && (lst[i].id === 'primary_key') && (lst[i].checked === true)){
                t+=',primary_key()';
            }else if((lst[i].id) && (lst[i].id === 'non_nulle') && (lst[i].checked === true)){
                t+=',non_nulle()';
            }else if((lst[i].id) && (lst[i].id === 'auto_increment') && (lst[i].checked === true)){
                t+=',auto_increment()';
            }else if((lst[i].id) && (lst[i].id === 'a_une_valeur_par_defaut') && (lst[i].checked === true)){
                meta+=(',(a_une_valeur_par_defaut,1)');
             
                if(document.getElementById('la_valeur_par_defaut_est_caractere').checked===true){
                    t+=',valeur_par_defaut(\''+document.getElementById('valeur_par_defaut').value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
                    meta+=(',(la_valeur_par_defaut_est_caractere,1)');
                    meta+=',(valeur_par_defaut,\''+document.getElementById('valeur_par_defaut').value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
                }else{
                    meta+=(',(la_valeur_par_defaut_est_caractere,0)');
                    meta+=',(valeur_par_defaut,'+document.getElementById('valeur_par_defaut').value+')';
                    if(isNumeric(document.getElementById('valeur_par_defaut').value)){
                        t +=',valeur_par_defaut('+document.getElementById('valeur_par_defaut').value+')';
                    }else{
                        var la_valeur=document.getElementById('valeur_par_defaut').value;
                        if(   la_valeur.toLowerCase()==='true' 
                           || la_valeur.toLowerCase()==='false' 
                           || la_valeur.toLowerCase()==='null'
                           || la_valeur.toUpperCase()==='CURRENT_TIMESTAMP'
                           || la_valeur.toUpperCase()==='CURRENT_TIME'
                           || la_valeur.toUpperCase()==='CURRENT_DATE'
                        ){
                            t +=',valeur_par_defaut('+document.getElementById('valeur_par_defaut').value+')';
                        }else{
                            document.getElementById('zone_message_modifier_un_champ').className='yydanger';
                            document.getElementById('zone_message_modifier_un_champ').innerHTML='problème sur la valeur par défaut';
                            return;
                        }
                    }
                }
            }else if((lst[i].id) && (lst[i].id === 'table_mère')){
                if(lst[i].value !== ''){
                    if(document.getElementById('champ_père').value !== ''){
                        t+=(',references(' + document.getElementById('table_mère').value + ',' + document.getElementById('champ_père').value + ')');
                        var reference_amont_aval=-1;
                        var id_du_path=-1;
                        var j={};
                        for(j in this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours]){
                            if((this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j]) && (this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j].id_svg_enfant_champ === (id_svg_rectangle_du_champ - 1))){
                                reference_amont_aval=j;
                                id_du_path=this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j].id_du_path;
                                break;
                            }
                        }
                        /*
                          recherche des liens croisés
                        */
                        var id_svg_parent_champ=0;
                        var id_svg_enfant_table=0;
                        var id_svg_parent_table=0;
                        var max_id_svg=-1;
                        var lst2 = this.#svg_dessin.getElementsByTagName('*');
                        for(j=0;j < lst2.length;j++){
                            if((lst2[j].id) && (isNumeric(lst2[j].id))){
                                var k = parseInt(lst2[j].id,10);
                                if(k > max_id_svg){
                                    max_id_svg=k;
                                }
                            }
                            if((lst2[j].getAttribute('type_element')) && (lst2[j].getAttribute('type_element') === 'rectangle_de_champ') && (lst2[j].getAttribute('id_svg_de_la_base_en_cours') == this.#id_svg_de_la_base_en_cours)){
                                if((lst2[j].getAttribute('nom_du_champ') === document.getElementById('champ_père').value) && (lst2[j].getAttribute('nom_de_la_table') === document.getElementById('table_mère').value)){
                                    id_svg_parent_champ=(parseInt(lst2[j].id,10) - 1);
                                }
                            }
                            if((lst2[j].getAttribute('type_element')) && (lst2[j].getAttribute('type_element') === 'rectangle_de_nom_de_table') && (lst2[j].getAttribute('id_svg_de_la_base_en_cours') == this.#id_svg_de_la_base_en_cours)){
                                if(lst2[j].getAttribute('nom_de_la_table') === nom_de_la_table){
                                    id_svg_enfant_table=parseInt(lst2[j].getAttribute('id_svg_conteneur_table'),10);
                                }
                            }
                            if((lst2[j].getAttribute('type_element')) && (lst2[j].getAttribute('type_element') === 'rectangle_de_nom_de_table') && (lst2[j].getAttribute('id_svg_de_la_base_en_cours') == this.#id_svg_de_la_base_en_cours)){
                                if(lst2[j].getAttribute('nom_de_la_table') === document.getElementById('table_mère').value){
                                    id_svg_parent_table=parseInt(lst2[j].getAttribute('id_svg_conteneur_table'),10);
                                }
                            }
                        }
                        max_id_svg++;
                        if((id_svg_parent_champ === 0) || (id_svg_parent_table === 0) || (id_svg_enfant_table === 0)){
                            return;
                        }
                        if(reference_amont_aval === -1){
                            /* ce lien n'existe pas */
                            this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours].push({id_bdd_de_la_base_en_cours:this.#id_bdd_de_la_base_en_cours,id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,'nom_parent_table':document.getElementById('table_mère').value,nom_enfant_champ:nom_du_champ,'nom_parent_champ':document.getElementById('champ_père').value,nom_enfant_table:nom_de_la_table,'id_svg_enfant_champ':(id_svg_rectangle_du_champ - 1),id_du_path:max_id_svg,id_svg_parent_champ:id_svg_parent_champ,id_svg_enfant_table:id_svg_enfant_table,id_svg_parent_table:id_svg_parent_table,'p1':[],'p2':[]});
                            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[max_id_svg]={type:'path',id:max_id_svg,id_parent:this.#id_svg_de_la_base_en_cours,'proprietes':{id:max_id_svg,d:'M 0 0 C 10 10 20 20 30 30',type_element:'reference_croisée',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_svg_parent_table:id_svg_parent_table,id_svg_parent_champ:id_svg_parent_champ,id_svg_enfant_table:id_svg_enfant_table,'id_svg_enfant_champ':(id_svg_rectangle_du_champ - 1),'style':('stroke:hotpink;stroke-width:' + (this.#taille_bordure * 3) + ';fill:transparent;stroke-linejoin:round;stroke-linecap:round;')}};
                        }else{
                            this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][reference_amont_aval]={id_bdd_de_la_base_en_cours:this.#id_bdd_de_la_base_en_cours,'id_svg_enfant_champ':(id_svg_rectangle_du_champ - 1),id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,'nom_parent_table':document.getElementById('table_mère').value,nom_enfant_champ:nom_du_champ,'nom_parent_champ':document.getElementById('champ_père').value,nom_enfant_table:nom_de_la_table,'id_svg_enfant_champ':(id_svg_rectangle_du_champ - 1),id_du_path:id_du_path,id_svg_parent_champ:id_svg_parent_champ,id_svg_enfant_table:id_svg_enfant_table,id_svg_parent_table:id_svg_parent_table,p1:this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][reference_amont_aval].p1,p2:this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][reference_amont_aval].p2};
                            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_du_path].proprietes['id_svg_parent_champ']=id_svg_parent_champ;
                            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_du_path].proprietes['id_svg_parent_table']=id_svg_parent_table;
                        }
                    }
                }else{
                    /* on a peut être supprimé un lien */
                    var j={};
                    for(j in this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours]){
                        if((this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j] !== null) && (this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j].id_svg_enfant_champ === (id_svg_rectangle_du_champ - 1))){
                            var id_du_path=this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j].id_du_path;
                            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_du_path]=null;
                            this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j]=null;
                            break;
                        }
                    }
                }
            }else if((lst[i].id) && (lst[i].id.substr(0,15) === 'meta_modifier__') && (lst[i].value !== '')){
                meta+=(',(' + lst[i].id.substr(15) + ',\'' + lst[i].value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')');
            }
        }
        t+=(',meta(' + meta + ')');
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_svg_rectangle_du_champ].proprietes['donnees_rev_du_champ']=t;
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
    }
    /*
      
      ====================================================================================================================
      function modale_modifier_l_index
    */
    #modale_modifier_l_index(conteneur_d_index){
        var id_svg_conteneur_d_index=conteneur_d_index.id
        var nom_de_l_index='';
        var id_element_svg=0;
        var id_svg_de_la_base_en_cours=0;
        var id_svg_conteneur_table=0;
        var nom_de_la_table='';
        var i=0;
        var j=0;
        var k=0;
        var l=0;
        /* on ne peut pas chercher un tagname #text */
        var lst = conteneur_d_index.getElementsByTagName('text');
        var i=0;
        for(i=0;(i < lst.length) && (id_element_svg === 0);i++){
            if((lst[i].nodeName.toLowerCase() === 'text') && ('texte_d_index' === lst[i].getAttribute('type_element'))){
                var j=0;
                for(j=0;j < lst[i].childNodes.length;j++){
                    if(lst[i].childNodes[j].nodeName.toLowerCase() === '#text'){
                        nom_de_l_index=lst[i].childNodes[j].data;
                        id_element_svg=parseInt(lst[i].id,0);
                        id_svg_de_la_base_en_cours=parseInt(lst[i].getAttribute('id_svg_de_la_base_en_cours'),0);
                        id_svg_conteneur_table=parseInt(lst[i].getAttribute('id_svg_conteneur_table'),0);
                        nom_de_la_table=lst[i].getAttribute('nom_de_la_table_pour_l_index');
                        break;
                    }
                }
            }
        }
        if(id_element_svg === 0){
            return;
        }
        var liste_des_champ_de_l_index='';
        var unique=false;
        var liste_meta_index={index:nom_de_l_index,message:''};
        var id_svg_rectangle_de_l_index=0;
        var lst = conteneur_d_index.getElementsByTagName('rect');
        for(i=0;i < lst.length;i++){
            if((lst[i].nodeName.toLowerCase() === 'rect') && ('rectangle_d_index' === lst[i].getAttribute('type_element'))){
                id_svg_rectangle_de_l_index=lst[i].getAttribute('id');
                if((lst[i].getAttribute('donnees_rev_de_l_index')) && (lst[i].getAttribute('donnees_rev_de_l_index') !== '')){
                    var obj_matrice_de_l_index = functionToArray(lst[i].getAttribute('donnees_rev_de_l_index'),true,false,'');
                    if(obj_matrice_de_l_index.status === true){
                        for(k=1;k < obj_matrice_de_l_index.value.length;k++){
                            if(obj_matrice_de_l_index.value[k][7] === 0){
                                if(obj_matrice_de_l_index.value[k][2] === 'f'){
                                    if(obj_matrice_de_l_index.value[k][1] === 'unique'){
                                        unique=true;
                                    }else if(obj_matrice_de_l_index.value[k][1] === 'fields'){
                                        if(obj_matrice_de_l_index.value[k][8] === 1){
                                            liste_des_champ_de_l_index=obj_matrice_de_l_index.value[(k + 1)][1];
                                        }else{
                                            liste_des_champ_de_l_index='';
                                            for(l=(k + 1);(l < obj_matrice_de_l_index.value.length) && (obj_matrice_de_l_index.value[l][3] > obj_matrice_de_l_index.value[k][3]);l++){
                                                if(obj_matrice_de_l_index.value[l][2] === 'c'){
                                                    liste_des_champ_de_l_index+=(',' + obj_matrice_de_l_index.value[l][1]);
                                                }
                                            }
                                            if(liste_des_champ_de_l_index !== ''){
                                                liste_des_champ_de_l_index=liste_des_champ_de_l_index.substr(1);
                                            }
                                        }
                                    }else if(obj_matrice_de_l_index.value[k][1] === 'meta'){
                                        
                                        for(l=(k + 1);l < obj_matrice_de_l_index.value.length;l++){
                                            if((obj_matrice_de_l_index.value[l][3] === (obj_matrice_de_l_index.value[k][3] + 1)) && (obj_matrice_de_l_index.value[l][8] === 2)){
                                                if(liste_meta_index.hasOwnProperty(obj_matrice_de_l_index.value[(l + 1)][1])){
                                                    liste_meta_index[obj_matrice_de_l_index.value[(l + 1)][1]]=obj_matrice_de_l_index.value[(l + 2)][1];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var t='<h1>modification de l\'index</h1>';
        t+='<hr />';
        t+='<h2>dans le rev</h2>';
        t+='<h3>changer le nom</h3>';
        t+=('<input id="nouveau_nom" type="text" value="' + nom_de_l_index + '" />');
        t+=('<input id="ancien_nom" type="hidden" value="' + nom_de_l_index + '" />');
        t+=('<a href="javascript:' + this.#nom_de_la_variable + '.changer_le_nom_d_index_de_modale(' + id_element_svg + ',' + id_svg_conteneur_table + ','+id_svg_rectangle_de_l_index+','+id_svg_conteneur_d_index+')">modifier</a>');
        t+='<hr />';
        t+='<h3>changer les champs</h3>';
        t+=('<br />liste des champ  : <input id="liste_des_champ_de_l_index" style="width:95%;" value="' + liste_des_champ_de_l_index + '" />');
        t+=('<br />unique  : <input type="checkbox" id="unique" ' + ((unique === true)?'checked':'') + ' />');
        t+='<br /><b>meta</b>';
        var cle={};
        for(cle in liste_meta_index){
            if(cle === 'index'){
            }else{
                t+=('<br />' + cle.replace(/_/g,' ') + ' : ');
                t+=('<input type="text" id="meta_modifier__' + cle + '" value="' + liste_meta_index[cle].replace(/"/g,'&quot;') + '" />');
            }
        }
        t+='<br />';
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.modifier_un_index_de_modale(' + id_svg_rectangle_de_l_index + ',&quot;' + nom_de_l_index + '&quot;,&quot;' + nom_de_la_table + '&quot;)">modifier</a>');
        t+='<hr />';
        t+='<h3>supprimer l\'index</h3>';
        t+=('<a class="yydanger" href="javascript:' + this.#nom_de_la_variable + '.supprimer_un_index_dans_rev_de_modale(' + id_svg_rectangle_de_l_index + ',&quot;' + nom_de_l_index + '&quot;,&quot;' + nom_de_la_table + '&quot;)">supprimer</a>');

        t+='<hr />';
        t+='<h2>dans la base physique</h2>';

        t+='<h3>ajouter l\'index</h3>';
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.ajouter_un_index_dans_base_de_modale(' + id_svg_rectangle_de_l_index + ',&quot;' + nom_de_l_index + '&quot;,&quot;' + nom_de_la_table + '&quot;)">ajouter</a>');

        t+='<h3>supprimer l\'index</h3>';
        t+=('<a class="yydanger" href="javascript:' + this.#nom_de_la_variable + '.supprimer_un_index_dans_base_de_modale(' + id_svg_rectangle_de_l_index + ',&quot;' + nom_de_l_index + '&quot;,&quot;' + nom_de_la_table + '&quot;)">supprimer</a>');


        document.getElementById('__contenu_modale').innerHTML=t;
        __gi1.global_modale2.showModal();
    }
    /*
      
      ====================================================================================================================
      function modale_modifier_le_champ
    */
    #modale_modifier_le_champ(conteneur_de_champ){
        var nom_du_champ='';
        var id_element_texte_du_nom_de_champ_svg=0;
        var id_svg_conteneur_table=0;
        var nom_de_la_table='';
        var i=0;
        var j=0;
        var k=0;
        var l=0;
        /* on ne peut pas chercher un tagname #text */
        var lst = conteneur_de_champ.getElementsByTagName('text');
        var i=0;
        for(i=0;(i < lst.length) && (id_element_texte_du_nom_de_champ_svg === 0);i++){
            if((lst[i].nodeName.toLowerCase() === 'text') && ('texte_de_champ' === lst[i].getAttribute('type_element'))){
                var j=0;
                for(j=0;j < lst[i].childNodes.length;j++){
                    if(lst[i].childNodes[j].nodeName.toLowerCase() === '#text'){
                        nom_du_champ=lst[i].childNodes[j].data;
                        
                        id_element_texte_du_nom_de_champ_svg=parseInt(lst[i].id,0);

                        id_svg_conteneur_table=parseInt(lst[i].getAttribute('id_svg_conteneur_table'),0);
                        nom_de_la_table=lst[i].getAttribute('nom_de_la_table');
                        break;
                    }
                }
            }
        }
        if(id_element_texte_du_nom_de_champ_svg === 0){
            return;
        }
        var typologie='';
        var type_du_champ='';
        var longueur_du_champ='';
        var table_mere='';
        var champ_pere='';
        var primary_key=false;
        var auto_increment=false;
        var non_nulle=false;
        var a_une_valeur_par_defaut='';
        var la_valeur_par_defaut_est_caractere=false;
        var valeur_par_defaut='';
        var liste_meta_champ={nom_du_champ:nom_du_champ,'nom_long_du_champ':('à faire ' + nom_du_champ + ''),'nom_court_du_champ':('à faire ' + nom_du_champ + ''),'nom_bref_du_champ':('à faire ' + nom_du_champ + ''),typologie:'ch?',default_charset:'',collate:''};
        var id_svg_rectangle_du_champ=0;
        var lst = conteneur_de_champ.getElementsByTagName('rect');
        for(i=0;i < lst.length;i++){
            if((lst[i].nodeName.toLowerCase() === 'rect') && ('rectangle_de_champ' === lst[i].getAttribute('type_element'))){
                id_svg_rectangle_du_champ=lst[i].getAttribute('id');
                if((lst[i].getAttribute('donnees_rev_du_champ')) && (lst[i].getAttribute('donnees_rev_du_champ') !== '')){
                    var obj_matrice_du_champ = functionToArray(lst[i].getAttribute('donnees_rev_du_champ'),true,false,'');
                    if(obj_matrice_du_champ.status === true){
                        for(k=1;k < obj_matrice_du_champ.value.length;k++){
                            if(obj_matrice_du_champ.value[k][7] === 0){
                                if(obj_matrice_du_champ.value[k][2] === 'f'){
                                    if(obj_matrice_du_champ.value[k][1] === 'type'){
                                        if(obj_matrice_du_champ.value[k][10] === 1){
                                            type_du_champ=obj_matrice_du_champ.value[(k + 1)][1];
                                        }else if(obj_matrice_du_champ.value[k][10] === 2){
                                            type_du_champ=(obj_matrice_du_champ.value[(k + 1)][1] + '(' + obj_matrice_du_champ.value[(k + 2)][1] + ')');
                                        }
                                    }else if(obj_matrice_du_champ.value[k][1] === 'references'){
                                        table_mere=obj_matrice_du_champ.value[(k + 1)][1];
                                        champ_pere=obj_matrice_du_champ.value[(k + 2)][1];
                                    }else if(obj_matrice_du_champ.value[k][1] === 'primary_key'){
                                        primary_key=true;
                                    }else if(obj_matrice_du_champ.value[k][1] === 'auto_increment'){
                                        auto_increment=true;
                                    }else if(obj_matrice_du_champ.value[k][1] === 'non_nulle'){
                                        non_nulle=true;
                                    }else if(obj_matrice_du_champ.value[k][1] === 'valeur_par_defaut'){
                                        a_une_valeur_par_defaut=true;
                                        if(obj_matrice_du_champ.value[k][8]===1 && obj_matrice_du_champ.value[k+1][2]==='c'){
                                            if(obj_matrice_du_champ.value[k+1][4]!==0){
                                                /*
                                                  si la valeur par défaut n'est pas une constante non quotée
                                                */
                                                la_valeur_par_defaut_est_caractere=true;
                                            }
                                            valeur_par_defaut=obj_matrice_du_champ.value[k+1][1];
                                        }

                                    }else if(obj_matrice_du_champ.value[k][1] === 'meta'){
                                        for(l=(k + 1);l < obj_matrice_du_champ.value.length;l++){
                                            if((obj_matrice_du_champ.value[l][3] === (obj_matrice_du_champ.value[k][3] + 1)) && (obj_matrice_du_champ.value[l][8] === 2)){
                                                if(liste_meta_champ[obj_matrice_du_champ.value[(l + 1)][1]]){
                                                    liste_meta_champ[obj_matrice_du_champ.value[(l + 1)][1]]=obj_matrice_du_champ.value[(l + 2)][1];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var t='<h1>modification du champ</h1>';
        t+=('<div class="" id="zone_message_modifier_un_champ"></div>');
        t+='<hr />';
        t+='<h2>dans ce graphique</h2>';
        t+='<hr />';
        /*
          ============================================================================================================
        */
        t+='<h3>changer le nom</h3>';
        t+=('<input id="nouveau_nom" type="text" value="' + nom_du_champ + '" />');
        t+=('<input id="ancien_nom" type="hidden" value="' + nom_du_champ + '" />');
        t+=('<a href="javascript:' + this.#nom_de_la_variable + '.changer_le_nom_de_champ_de_modale(' + id_element_texte_du_nom_de_champ_svg + ',' + id_svg_conteneur_table + ')">modifier</a>');
        t+='<hr />';
        /*
          ============================================================================================================
        */
        t+='<h2>changer le type</h2>';
        
        t+=('<br />type  : <input id="type_du_champ" value="' + type_du_champ + '" />');
        t+=('<br />table mère : <input id="table_mère" type="text" value="' + table_mere + '" />');
        t+=('<br />champ père : <input id="champ_père" type="text" value="' + champ_pere + '" />');
        t+=('<br />clé primaire  : <input type="checkbox" id="primary_key" ' + ((primary_key === true)?'checked':'') + ' />');
        t+=('<br />non nulle  : <input type="checkbox" id="non_nulle" ' + ((non_nulle === true)?'checked':'') + ' />');
        t+=('<br />auto increment  : <input type="checkbox" id="auto_increment" ' + ((auto_increment === true)?'checked':'') + ' />');
        t+=('<br />a une valeur par défaut <input id="a_une_valeur_par_defaut" type="checkbox"  '+(a_une_valeur_par_defaut?'checked="true"':'')+'/>');
        t+=(' , type caractère <input id="la_valeur_par_defaut_est_caractere" type="checkbox" '+(la_valeur_par_defaut_est_caractere?'checked="true"':'')+' />');
        t+=(' , valeur : <input id="valeur_par_defaut" type="text" value="'+valeur_par_defaut.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\')+'" /> ');
        t+='"CURRENT_TIMESTAMP","CURRENT_TIME","CURRENT_DATE"';
        t+='<br /><b>meta</b>';
        var cle={};
        for(cle in liste_meta_champ){
            if(cle === 'nom_du_champ'){
            }else{
                t+=('<br />' + cle.replace(/_/g,' ') + ' : ');
                if(cle === 'typologie'){
                    t+=('<select id="meta_modifier__' + cle + '">');
                    t+=('<option value="chi" ' + ((liste_meta_champ[cle] === 'chi')?' selected':'') + '>index entier (chi) integer[n]</option>');
                    t+=('<option value="chx" ' + ((liste_meta_champ[cle] === 'chx')?' selected':'') + '>référence croisée (chx) integer[n]</option>');
                    t+=('<option value="che" ' + ((liste_meta_champ[cle] === 'che')?' selected':'') + '>entier (che) integer[n]</option>');
                    t+=('<option value="chn" ' + ((liste_meta_champ[cle] === 'chn')?' selected':'') + '>numérique (chn) float</option>');
                    t+=('<option value="chu" ' + ((liste_meta_champ[cle] === 'chu')?' selected':'') + '>choix unique (chu) integer(n)</option>');
                    t+=('<option value="chm" ' + ((liste_meta_champ[cle] === 'chm')?' selected':'') + '>choix multiple (chm) text</option>');
                    t+=('<option value="cht" ' + ((liste_meta_champ[cle] === 'cht')?' selected':'') + '>texte (cht) text</option>');
                    t+=('<option value="chp" ' + ((liste_meta_champ[cle] === 'chp')?' selected':'') + '>phrase (chp) varchar(n)</option>');
                    t+=('<option value="cho" ' + ((liste_meta_champ[cle] === 'cho')?' selected':'') + '>mot (cho) character(n)</option>');
                    t+=('<option value="chd" ' + ((liste_meta_champ[cle] === 'chd')?' selected':'') + '>date heure (chd) text(23) YYYY-MM-DD HH:MM:SS.SSS</option>');
                    t+=('<option value="cha" ' + ((liste_meta_champ[cle] === 'cha')?' selected':'') + '>date character(10)</option>');
                    t+=('<option value="chh" ' + ((liste_meta_champ[cle] === 'chh')?' selected':'') + '>heure character(8)</option>');
                    t+=('<option value="chb" ' + ((liste_meta_champ[cle] === 'chb')?' selected':'') + '>blob (chb) blob</option>');
                    t+='</select>';
                }else{
                    t+=('<input type="text" id="meta_modifier__' + cle + '" value="' + liste_meta_champ[cle].replace(/\\\'/g,'\'').replace(/\\\\/g,'\\').replace(/"/g,'&quot;') + '" />');
                }
            }
        }
        t+='<br />';
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.modifier_un_champ_de_modale(' + id_svg_rectangle_du_champ + ',&quot;' + nom_du_champ + '&quot;,&quot;' + nom_de_la_table + '&quot;)">modifier</a>');
        /*
          ============================================================================================================
        */
        t+='<hr />';
        t+='<h3>supprimer</h3>';
        t+=('<a class="yydanger" href="javascript:' + this.#nom_de_la_variable + '.supprimer_le_champ_de_modale(' + id_element_texte_du_nom_de_champ_svg + ',' + id_svg_conteneur_table + ',&quot;' + nom_du_champ + '&quot;,' + id_svg_rectangle_du_champ + ')">supprimer</a>');
        t+='<hr />';
        t+='<h2>dans la base de donnée</h2>';
        t+='<hr />';
        t+='<h3>ajouter</h3>';
        t+=('<a class="yydanger" href="javascript:' + this.#nom_de_la_variable + '.ajouter_en_bdd_le_champ_de_modale(' + id_element_texte_du_nom_de_champ_svg + ',' + id_svg_conteneur_table + ',&quot;' + nom_du_champ + '&quot;,' + id_svg_rectangle_du_champ + ',&quot;'+nom_de_la_table+'&quot;)">ajouter en bdd</a>');
        t+=('<span class="yyerreur">Ne pas oublier de réécrire la base après un ajout d\'un champ en base de donnée</span>');
        
        t+='<hr />';
        t+='<h3>supprimer</h3>';
        t+=('<span>Veuillez passer par l\'écran table pour supprimer un champ dans la base physique</span>');
        t+='<hr />';
        document.getElementById('__contenu_modale').innerHTML=t;
        __gi1.global_modale2.showModal();
    }
    
    /*
      ==============================================================================================================
      function afficher_resultat_comparaison_base_physique_et_base_virtuelle
    */
    afficher_resultat_comparaison_base_physique_et_base_virtuelle(par){
        __gi1.global_modale2.close();
        
        var differences_entre_les_tables=false;
        var differences_entre_les_champs=false;
        var differences_entre_les_indexe=false;

        console.log(par['donnees']);
        var tables={}; 
        for(var a1 in par['donnees']['tableau1']){

         tables[a1]={ 'presente_dans_tableau_1' : true ,  'presente_dans_tableau_2' : false  };
        }
        
        for(var a2 in par['donnees']['tableau2']){
         if(tables.hasOwnProperty(a2)){
          tables[a2].presente_dans_tableau_2=true;
          
         }else{
          tables[a2]={ 'presente_dans_tableau_1' : false ,  'presente_dans_tableau_2' : true  };
          logerreur({status:false,message:' la table '  + a2 + ' est absente du tableau1 '});
          differences_entre_les_tables=true;
          
         }
        }
        for(var a0 in tables){
         if(tables[a0].presente_dans_tableau_2===false){
          logerreur({status:false,message:' la table '  + a0 + ' est absente du tableau2'});
          differences_entre_les_tables=true;
         }
        }
        if(differences_entre_les_tables===true){
          logerreur({status:false,message:' des tables ne sont pas les mêmes'});
        }else{
          logerreur({status:true,message:' il y a les mêmes tables dans les deux tableaux'});
        }
//        console.log('tables=',tables)
        
        if(differences_entre_les_tables===false){
            for(var a0 in tables){
                /*
                les champs sont-t-ils vraiment les mêmes
                */
                for(var i in par['donnees']['tableau2'][a0].liste_des_champs){
                    if(!(par['donnees']['tableau1'][a0].liste_des_champs.hasOwnProperty(i))){
                        differences_entre_les_champs=true;
                        par['donnees']['tableau2'][a0].liste_des_champs[i].absent_de_l_autre_tableau=true;
                    }
                }
                for(var i in par['donnees']['tableau1'][a0].liste_des_champs){
                    if(!(par['donnees']['tableau2'][a0].liste_des_champs.hasOwnProperty(i))){
                        differences_entre_les_champs=true;
                        par['donnees']['tableau1'][a0].liste_des_champs[i].absent_de_l_autre_tableau=true;
                    }
                }
                
                
                for(var i in par['donnees']['tableau2'][a0].liste_des_indexes){
                    if(!(par['donnees']['tableau1'][a0].liste_des_indexes.hasOwnProperty(i))){
                        differences_entre_les_indexe=true;
                        par['donnees']['tableau2'][a0].liste_des_indexes[i].absent_de_l_autre_tableau=true;
                    }
                }
                for(var i in par['donnees']['tableau1'][a0].liste_des_indexes){
                    if(!(par['donnees']['tableau2'][a0].liste_des_indexes.hasOwnProperty(i))){
                        differences_entre_les_indexe=true;
                        par['donnees']['tableau1'][a0].liste_des_indexes[i].absent_de_l_autre_tableau=true;
                    }
                }
                
                
            }
        }

        /*
          analyse des indexes
        */ 

        var tables_indexes={};
        for(var a0 in tables){
            tables_indexes[a0]={indexes:null};
            if(tables[a0].presente_dans_tableau_1===true && tables[a0].presente_dans_tableau_2===true ){
                var indexes={};
                for(var ind_index in par['donnees']['tableau1'][a0]['liste_des_indexes']){
                    indexes[ind_index]={
                        'table':a0,
                        'present_dans_tableau_1' : true , 
                        tableau1 : par['donnees']['tableau1'][a0]['liste_des_indexes'][ind_index] ,  
                        'present_dans_tableau_2' : false , 
                        tableau2 : null
                    };
//                    console.log(par['donnees']['tableau1'][a0]['liste_des_indexes'][ind_index]);
                    var champs_de_l_index='';
                    for( var champ_de_l_index in par['donnees']['tableau1'][a0]['liste_des_indexes'][ind_index]['champs']){
                        champs_de_l_index+=','+champ_de_l_index;
                    }
                    if(champs_de_l_index!==''){
                        champs_de_l_index=champs_de_l_index.substr(1);
                    }
                    indexes[ind_index]['tableau1'].champs_de_l_index=champs_de_l_index;
                } 
                

                for(var ind_index in par['donnees']['tableau2'][a0]['liste_des_indexes']){
                    if(indexes.hasOwnProperty(ind_index)){
                        indexes[ind_index].present_dans_tableau_2=true;
                        indexes[ind_index].tableau2=par['donnees']['tableau2'][a0]['liste_des_indexes'][ind_index];

                        var champs_de_l_index='';
                        for( var champ_de_l_index in par['donnees']['tableau2'][a0]['liste_des_indexes'][ind_index]['champs']){
                            champs_de_l_index+=','+champ_de_l_index;
                        }
                        if(champs_de_l_index!==''){
                            champs_de_l_index=champs_de_l_index.substr(1);
                        }
                        indexes[ind_index]['tableau2'].champs_de_l_index=champs_de_l_index;
                        
                        if(
                               indexes[ind_index].tableau2['name']              !==  indexes[ind_index].tableau1['name']
                            || indexes[ind_index].tableau2['unique']            !==  indexes[ind_index].tableau1['unique']
                            || indexes[ind_index].tableau2['champs_de_l_index'] !==  indexes[ind_index].tableau1['champs_de_l_index']
                        ){
                            par['donnees']['tableau2'][a0]['liste_des_indexes'][ind_index]['different']=true;
                            differences_entre_les_indexe=true;
                        }
                    }else{
                        indexes[ind_index]={ 
                            'table'                   : a0    ,
                            'present_dans_tableau_1' : false ,  
                            tableau1                  : null  ,  
                            'present_dans_tableau_2' : true  ,
                            tableau2                  : par['donnees']['tableau2'][a0]['liste_des_indexes'][ind_index] ,
                        };
                        
                        var champs_de_l_index='';
                        for( var champ_de_l_index in par['donnees']['tableau2'][a0]['liste_des_indexes'][ind_index]['champs']){
                            champs_de_l_index+=','+champ_de_l_index;
                        }
                        if(champs_de_l_index!==''){
                            champs_de_l_index=champs_de_l_index.substr(1);
                        }
                        indexes[ind_index]['tableau2'].champs_de_l_index=champs_de_l_index;
                        
                        
                        par['donnees']['tableau2'][a0]['liste_des_indexes'][ind_index]['different']=true;
                        differences_entre_les_indexe=true;
                    }
                }
                tables_indexes[a0].indexes=JSON.parse(JSON.stringify(indexes));
            }
        }
        
        console.log('tables_indexes=' , tables_indexes );
        
        /*
          analyse des champs des tables
        */ 

        var tables_champs={};
        for(var a0 in tables){
            tables_champs[a0]={champs:null};
            if(tables[a0].presente_dans_tableau_1===true && tables[a0].presente_dans_tableau_2===true ){
                //debugger
                var champs={};
                for(var ind_champ in par['donnees']['tableau1'][a0]['liste_des_champs']){
                    champs[ind_champ]={'table':a0,'presente_dans_tableau_1' : true , champs1 : par['donnees']['tableau1'][a0]['liste_des_champs'][ind_champ] ,  'presente_dans_tableau_2' : false , champs2 : null};
                } 
                for(var ind_champ in par['donnees']['tableau2'][a0]['liste_des_champs']){
                    if(champs.hasOwnProperty(ind_champ)){
                        champs[ind_champ].presente_dans_tableau_2=true;
                        champs[ind_champ].champs2=par['donnees']['tableau2'][a0]['liste_des_champs'][ind_champ];
                        if(
                               champs[ind_champ].champs2['type'].toLowerCase() !==  champs[ind_champ].champs1['type'].toLowerCase()
                            || champs[ind_champ].champs2['dflt_value']         !==  champs[ind_champ].champs1['dflt_value']
                            || champs[ind_champ].champs2['auto_increment']     !==  champs[ind_champ].champs1['auto_increment']
                            || champs[ind_champ].champs2['notnull']            !==  champs[ind_champ].champs1['notnull']
                            || champs[ind_champ].champs2['pk']                 !==  champs[ind_champ].champs1['pk']
                        ){
                            par['donnees']['tableau2'][a0]['liste_des_champs'][ind_champ]['different']=true;
                            differences_entre_les_champs=true;
                        }
                    }else{
                        champs[ind_champ]={ 'table':a0,'presente_dans_tableau_1' : false ,  'presente_dans_tableau_2' : true  };
                        par['donnees']['tableau2'][a0]['liste_des_champs'][ind_champ]['different']=true;
                        differences_entre_les_champs=true;
                    }
                }
                if(differences_entre_les_champs===true){
                    for( var champ in champs){
                        if(champs[champ].presente_dans_tableau_1===true && champs[champ].presente_dans_tableau_2===true ){
                            for( var typechamp in champs[champ]['champs1'] ){
                                if(typeof champs[champ].champs1[typechamp]==='object'){
                                }else{
                                    if(champs[champ].champs1[typechamp]===champs[champ].champs2[typechamp]){
                                    }else{
                                        if('cid'===typechamp){
                                        }else if(typechamp==='auto_increment'){
                                            logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' , le type '+typechamp +' on a une différence mais ce n\'est peut-être pas une erreur ! ' });
                                        }else{
                                            logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' , le type '+typechamp +' on a une différence' });
                                        }
                                    }
                                }
                            }
                            /*
                            auto_increment: false
                            cid: 0
                            cle_etrangere: {}
                            dflt_value: null
                            name: "chi_id_groupe"
                            notnull: 0
                            pk: 1
                            type: "INTEGER"
                            */
                         
                        }else{
                            if(champs[champ].presente_dans_tableau_1===true && champs[champ].presente_dans_tableau_2===false){
                                logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' est dans la base physique mais pas dans la base du champ généré ' });
                            }else{
                                logerreur({status:false,message:' pour la table '  + a0 + ' , le champ '+champ + ' est dans la base du champ généré mais pas dans la base physique  ' });
                            }
                        }
                    }
                }
//                console.log('pour "'+a0+'" champs=',champs);
                tables_champs[a0].champs=JSON.parse(JSON.stringify(champs));
            }
        }
        
        
        var t='<table>';
        t+='<tr><th>Tables</th><th>dans la base physique</th><th>dans champ genere</th><th>action ou id</th></tr>';
        for(var nom_de_la_table in tables){
            t+='<tr>';
            t+='<td>'+nom_de_la_table+'</td>';
            t+='<td>'+(tables[nom_de_la_table].presente_dans_tableau_1?'<span class="yysucces">oui</span>':'non')+'</td>';
            t+='<td>'+(tables[nom_de_la_table].presente_dans_tableau_2?'<span class="yysucces">oui</span>':'non')+'</td>';
            t+='</tr>';
        }
        t+='</table>';
        
        
//        console.log('differences_entre_les_champs=' , differences_entre_les_champs , 'tables_champs=' , tables_champs );
        t+='<table>';
        
        t+='<tr>';
        t+='<td colspan="4">';
        t+=(differences_entre_les_tables?'<div class="yydanger">Il y a une différence entre les tables</div>':'<div class="yysucces">Pas de différence entre les tables</div>');
        t+=(differences_entre_les_champs?'<div class="yydanger">Il y a une différence entre les champs</div>':'<div class="yysucces">Pas de différence entre les champs</div>');
        t+=(differences_entre_les_indexe?'<div class="yydanger">Il y a une différence entre les indexes</div>':'<div class="yysucces">Pas de différence entre les indexes</div>');
        
        t+='</td>';
        t+='</tr>';
        t+='<tr>';
        
        t+='<tr>';
        t+='<th>Base physique</th>';
        t+='<th>Base du champ genere</th>';
        t+='</tr>';
        t+='<tr>';
        
        var references=['tableau1','tableau2'];
//        debugger
        for( var ref in references){
          t+='<td style="vertical-align: baseline;">'
          t+='<table>'
          for( var nom_de_la_table in par['donnees'][references[ref]]){
              t+='<tr>'
              t+='<th>'+nom_de_la_table+'</th>'
              t+='<th>type</th>'
              t+='<th>nn</th>'
              t+='<th>pk</th>'
              t+='<th>dft</th>'
              t+='</tr>'
//              var position=0;
              for( var nom_du_champ in par['donnees'][references[ref]][nom_de_la_table].liste_des_champs){
                  t+='<tr>';
                  var la_class_quoi='';
                  if(par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ].hasOwnProperty('different') && par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ].different===true){
                   la_class_quoi='yyavertissement';
                  }
                  if(par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ].hasOwnProperty('absent_de_l_autre_tableau') && par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ].absent_de_l_autre_tableau===true){
                   la_class_quoi='yyavertissement';
                  }

                  t+='<td class="'+la_class_quoi+'">'+par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ].name+'</td>';
                  t+='<td class="'+la_class_quoi+'">'+par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ].type+'</td>';
                  
                  var proprietes_a_tester=['name' , 'type' , 'notnull' , 'dflt_value' , 'pk' ];
                  for( var ind_prop in proprietes_a_tester){
                      if(references[ref]==='tableau1'){
                          if(par['donnees']['tableau2'][nom_de_la_table].liste_des_champs[nom_du_champ]){
                              if(par['donnees']['tableau2'][nom_de_la_table].liste_des_champs[nom_du_champ][proprietes_a_tester[ind_prop]]!==par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ][proprietes_a_tester[ind_prop]]){
                                  t+='<td class="yydanger">'+par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ][proprietes_a_tester[ind_prop]]+'</td>';
                              }else{
                                  t+='<td class="'+la_class_quoi+'">'+par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ][proprietes_a_tester[ind_prop]]+'</td>';
                              }
                          }else{
                              t+='<td class="yydanger">'+par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ][proprietes_a_tester[ind_prop]]+'</td>';
                          }
                      }else{
                          t+='<td class="'+la_class_quoi+'">'+par['donnees'][references[ref]][nom_de_la_table].liste_des_champs[nom_du_champ][proprietes_a_tester[ind_prop]]+'</td>';
                      }
                  }
                   
                  t+='</tr>';
//                  position++;
              }
              /*
                affichage des indexes
              */
              try{
                  if(references[ref]==='tableau1'){
                      if(tables_indexes.hasOwnProperty(nom_de_la_table)){
                          for( var nom_de_l_index in tables_indexes[nom_de_la_table].indexes){
                              t+='<tr>';
                              if(tables_indexes[nom_de_la_table].indexes[nom_de_l_index].present_dans_tableau_1===false){
                                  t+='<td><b class="yydanger">'+nom_de_l_index+' absent</b></td>';
                              }else{
                                  t+='<td><b>'+nom_de_l_index+'</b></td>';
                                  if(  tables_indexes[nom_de_la_table].indexes[nom_de_l_index].present_dans_tableau_2===true 
                                    && tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]].unique === tables_indexes[nom_de_la_table].indexes[nom_de_l_index]['tableau2'].unique 
                                  ){
                                      t+='<td>unique '+tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]].unique+'</td>';
                                  }else{
                                      t+='<td class="yydanger">unique '+tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]].unique+'</td>';
                                  }

                                  if(  tables_indexes[nom_de_la_table].indexes[nom_de_l_index].present_dans_tableau_2===true 
                                    && tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]].champs_de_l_index === tables_indexes[nom_de_la_table].indexes[nom_de_l_index]['tableau2'].champs_de_l_index 
                                  ){
                                      t+='<td colspan="5">'+tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]]['champs_de_l_index']+'</td>';
                                  }else{
                                      t+='<td colspan="5" class="yydanger">'+tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]]['champs_de_l_index']+'</td>';
                                  }

                              }
                              t+='</tr>';
                          }
                      }
                  }else if(references[ref]==='tableau2'){
                      if(tables_indexes.hasOwnProperty(nom_de_la_table)){
                          for( var nom_de_l_index in tables_indexes[nom_de_la_table].indexes){
                              t+='<tr>';
                              t+='<td>';
                              if(tables_indexes[nom_de_la_table].indexes[nom_de_l_index].present_dans_tableau_2===false){
                                  t+='<b class="yydanger">'+nom_de_l_index+' absent</b>';
                              }else{
                                  t+='<b>'+nom_de_l_index+'</b>';
                                  
                                  if(  tables_indexes[nom_de_la_table].indexes[nom_de_l_index].present_dans_tableau_1===true 
                                    && tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]].unique === tables_indexes[nom_de_la_table].indexes[nom_de_l_index]['tableau1'].unique 
                                  ){
                                      t+='<td>unique '+tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]].unique+'</td>';
                                  }else{
                                      t+='<td class="yydanger">unique '+tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]].unique+'</td>';
                                  }
                                  if(  tables_indexes[nom_de_la_table].indexes[nom_de_l_index].present_dans_tableau_1===true 
                                    && tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]].champs_de_l_index === tables_indexes[nom_de_la_table].indexes[nom_de_l_index]['tableau1'].champs_de_l_index 
                                  ){
                                      t+='<td colspan="5">'+tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]]['champs_de_l_index']+'</td>';
                                  }else{
                                      t+='<td colspan="5" class="yydanger">'+tables_indexes[nom_de_la_table].indexes[nom_de_l_index][references[ref]]['champs_de_l_index']+'</td>';
                                  }
                              }
                              t+='</td>';
                              t+='</tr>';
                          }
                      }
                  }
              }catch(err){
                  console.error('err=',err);
                  debugger
              }
          }
          t+='</table>'
          t+='</td>';
        }
        
        t+='</tr></table>'
        
        document.getElementById('__contenu_modale').innerHTML=t;
        __gi1.global_modale2.showModal();        
        
    }
    /*
      ==========================================================================================================================
      function comparer_la_base_physique_et_la_base_virtuelle
    */
    comparer_la_base_physique_et_la_base_virtuelle(id_bdd_de_la_base_en_cours){
     
        var obj1=this.#creer_rev_de_la_base_a_partir_de_svg(id_bdd_de_la_base_en_cours);
        if(obj1.status===true){

            var obj2 = rev_texte_vers_matrice(obj1.value);
            if(obj2.status === true){
                var obj3=tabToSql1(obj2.value,0,0);
                if(obj3.status===true){
                 
                             
                    async function recuperer_les_tableaux_des_bases(url="",donnees,that){

                        return that.#recupérer_un_fetch(url,donnees);

                    }
                    var ajax_param={
                        /* enveloppe d'appels */
                        'call':{'lib':'core','file':'bdd','funct':'recuperer_les_tableaux_des_bases'},
                        /* paramètres */
                        source_base_sql        : obj3.value ,
                        id_bdd_de_la_base      : id_bdd_de_la_base_en_cours,
                    };
                    recuperer_les_tableaux_des_bases('za_ajax.php?recuperer_les_tableaux_des_bases',ajax_param,this).then((donnees) => {

                        if(donnees.status === 'OK'){
                            
                            this.afficher_resultat_comparaison_base_physique_et_base_virtuelle({'donnees':donnees.value,id_bdd_de_la_base_en_cours:id_bdd_de_la_base_en_cours});
                         
                        }else{
                         console.error('donnees=' , donnees);
                        }
                    }).catch((err) => {
                        /* en cas de timeout par esemple */
                        debugger;
                        console.error(err);
                    });                      
                 
                }else{
                 debugger
                }
                
            }else{
            }
         
        }else{
        }
     
    }
    /*
      ====================================================================================================================
      function reecrire_la_base_a_partir_du_shema
      ATTACH DATABASE 'db2.sqlite' as 'Y';
      INSERT INTO X.TABLE SELECT * FROM Y.TABLE;
    */
    creer_la_base_a_partir_du_shema(id_bdd){
        this.#id_bdd_de_la_base_en_cours=parseInt(id_bdd,10);
        clearMessages('zone_global_messages');
        var obj=this.#creer_rev_de_la_base_a_partir_de_svg(this.#id_bdd_de_la_base_en_cours);
        if(obj.status===true){
            var texte_rev=obj.value;
            var obj2 = rev_texte_vers_matrice(texte_rev);
            if(obj2.status===true){
                var obj3=tabToSql1(obj2.value,0,0);
                if(obj3.status===true){
                  var source_sql_de_la_base=obj3.value
                }else{
                    displayMessages('zone_global_messages');
                    alert('Problème sur reecrire_la_base 1739 ');
                    return;
                }
             
            }else{
                displayMessages('zone_global_messages');
                alert('Problème sur reecrire_la_base 1739 ');
                return;
            }

         
        }else{
            displayMessages('zone_global_messages');
            alert('Problème sur reecrire_la_base 1746 ');
            return;
        }
        
        async function creer_la_base_a_partir_du_shema_sur_disque(url="",donnees,that){
         
            return that.#recupérer_un_fetch(url,donnees);
         
        }
        
        var ajax_param={
            'call':{'lib':'core','file':'bdd','funct':'creer_la_base_a_partir_du_shema_sur_disque'},
            id_bdd_de_la_base     : this.#id_bdd_de_la_base_en_cours,
            source_sql_de_la_base : source_sql_de_la_base  ,
        };
        

        creer_la_base_a_partir_du_shema_sur_disque('za_ajax.php?creer_la_base_a_partir_du_shema_sur_disque',ajax_param,this).then((donnees) => {
            if(donnees.status === 'OK'){
                console.log('OK');
            }else{
                console.error('KO donnees=' , donnees);
            }
        });
        
        
        
    }
    
    
    /*
      ====================================================================================================================
      function reecrire_la_base_a_partir_du_shema
      ATTACH DATABASE 'db2.sqlite' as 'Y';
      INSERT INTO X.TABLE SELECT * FROM Y.TABLE;
    */
    reecrire_la_base_a_partir_du_shema(id_bdd){
     
        var liste_des_tables=[];
        
        this.#id_bdd_de_la_base_en_cours=parseInt(id_bdd,10);
        clearMessages('zone_global_messages');
        var obj=this.#creer_rev_de_la_base_a_partir_de_svg(this.#id_bdd_de_la_base_en_cours);
        if(obj.status===true){
            var texte_rev=obj.value;
            var obj2 = rev_texte_vers_matrice(texte_rev);
            if(obj2.status===true){
                var obj3=tabToSql1(obj2.value,0,0);
                if(obj3.status===true){
                  var source_sql_de_la_base=obj3.value
                  var tab=obj2.value
                  var l01=tab.length;
                  for(var i=1;i < l01;i++){
                      if((tab[i][7] === 0) && (tab[i][1] === 'create_table')){
                          for(var j=i+1;j<l01 && tab[j][3]>tab[i][3] ; j++){
                              if(tab[j][1]==="nom_de_la_table" && tab[j][2]==='f'){
                                  if(tab[j][8]===1){
                                      liste_des_tables.push(tab[j+1][1]);
                                  }else{
                                      displayMessages('zone_global_messages');
                                      alert('Problème sur reecrire_la_base 1739 ');
                                      return;
                                  }
                              }
                          }
                      }
                  }
                  
                  
                  
                }else{
                    displayMessages('zone_global_messages');
                    alert('Problème sur reecrire_la_base 1739 ');
                    return;
                }
             
            }else{
                displayMessages('zone_global_messages');
                alert('Problème sur reecrire_la_base 1739 ');
                return;
            }

         
        }else{
            displayMessages('zone_global_messages');
            alert('Problème sur reecrire_la_base 1746 ');
            return;
        }
        
        async function reecrire_la_base_a_partir_du_shema_sur_disque(url="",donnees,that){
            return that.#recupérer_un_fetch(url,donnees);

        }
        
        var ajax_param={
            'call':{'lib':'core','file':'bdd','funct':'reecrire_la_base_a_partir_du_shema_sur_disque'},
            id_bdd_de_la_base     : this.#id_bdd_de_la_base_en_cours,
            source_sql_de_la_base : source_sql_de_la_base  ,
            liste_des_tables      : liste_des_tables       ,
        };
        

        reecrire_la_base_a_partir_du_shema_sur_disque('za_ajax.php?reecrire_la_base_a_partir_du_shema_sur_disque',ajax_param,this).then((donnees) => {
            if(donnees.status === 'OK'){
                this.#message_succes_et_fermer_modale(donnees);
            }else{
                this.#message_erreur_modale(donnees);
                console.error('KO donnees=' , donnees);
            }
        });

     
    }
    /*
      ====================================================================================================================
      function modale_modifier_la_base
    */
    #modale_modifier_la_base(element_g){
        var t='<h1>modification de la base</h1>';
        t+='<hr /><h2>données générales</h2>';
        var liste_meta_base={'transform_base_sur_svg':{txt:'transform(translate(0,0))','complement':''},'default_charset':{txt:'','complement':'utf8mb4'},'collate':{txt:'','complement':'utf8mb4_unicode_ci'}};
        var id_svg_rectangle_de_la_base=0;
        var lst = element_g.parentNode.getElementsByTagName('rect');
        var i=0;
        for(i=0;i < lst.length;i++){
            if((lst[i].nodeName.toLowerCase() === 'rect') && ('rectangle_de_base' === lst[i].getAttribute('type_element'))){
                id_svg_rectangle_de_la_base=lst[i].getAttribute('id');
                if((lst[i].getAttribute('donnees_rev_meta_de_la_base')) && (lst[i].getAttribute('donnees_rev_meta_de_la_base') !== '')){
                    var obj_matrice_de_la_table = functionToArray(lst[i].getAttribute('donnees_rev_meta_de_la_base'),true,false,'');
                    if(obj_matrice_de_la_table.status === true){
                        var l=1;
                        for(l=1;l < obj_matrice_de_la_table.value.length;l++){
                            if((obj_matrice_de_la_table.value[l][3] === 0) && (obj_matrice_de_la_table.value[l][8] === 2)){
                                if(liste_meta_base[obj_matrice_de_la_table.value[(l + 1)][1]]){
                                    if(obj_matrice_de_la_table.value[(l + 1)][1] === 'transform_base_sur_svg'){
                                        var txt = a2F1(obj_matrice_de_la_table.value,(l + 2),false,(l + 3),false);
                                        liste_meta_base[obj_matrice_de_la_table.value[(l + 1)][1]].txt=('transform(' + txt.value + ')');
                                    }else{
                                        liste_meta_base[obj_matrice_de_la_table.value[(l + 1)][1]].txt=obj_matrice_de_la_table.value[(l + 2)][1];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var cle={};
        for(cle in liste_meta_base){
            if('transform_base_sur_svg' === cle){
                t+=('<input type="hidden" id="meta__' + cle + '" value="' + liste_meta_base[cle].txt.replace(/"/g,'&quot;') + '" />' + liste_meta_base[cle].complement);
            }else{
                t+=('<br />' + cle.replace(/_/g,' ') + ' : ' + '<input type="text" id="meta__' + cle + '" value="' + liste_meta_base[cle].txt.replace(/"/g,'&quot;') + '" />' + liste_meta_base[cle].complement);
            }
        }
        t+=('<br /><a href="javascript:' + this.#nom_de_la_variable + '.modifier_la_base_de_modale(' + id_svg_rectangle_de_la_base + ')">modifier</a>');
        t+='<hr /><h2>Ajouter une table</h2>';
        t+='<input id="nouveau_nom" type="text" value="tbl_" />';
        t+=('<a href="javascript:' + this.#nom_de_la_variable + '.ajouter_une_table_provenant_de_modale(&quot;nouveau_nom&quot;)">enregistrer</a>');
        t+='<hr /><h2>comparer la base physique et la base virtuelle</h2>';
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.comparer_la_base_physique_et_la_base_virtuelle('+this.#id_bdd_de_la_base_en_cours+')">comparer</a>');
        t+='<hr /><h2>réécrire la base physique à partir de ce schéma</h2>';
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.reecrire_la_base_a_partir_du_shema('+this.#id_bdd_de_la_base_en_cours+')">réecrire</a>');
        t+='<hr /><h2>créer la base physique à partir de ce schéma</h2>';
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.creer_la_base_a_partir_du_shema('+this.#id_bdd_de_la_base_en_cours+')">créer</a>');
        
        
        document.getElementById('__contenu_modale').innerHTML=t;
        __gi1.global_modale2.showModal();
    }
    
    /*
      ====================================================================================================================
      function modifier_une_table_en_bdd
    */
    #modifier_une_table_en_bdd(nom_de_la_table,txt_ordre_original,txt_ordre_modifie,liste_ordre_modifie,mode_supression_de_champ,en_base_et_sur_schema){
     
        /*
          cette fonction est utilisée à la fois
          - pour réordonner les champs
          - pour supprimer un champ car même si un "ALTER TABLE t1 DROP COLUMN c1" fonctionne dans sqlite3.exe, il ne fonctionne pas via php !
          Dans ce dernier cas, si en_base_et_sur_schema = true, on supprime aussi sur schema
        */

        var lst = document.getElementsByTagName('g');
        var racine_du_svg=null;
        var id_svg_conteneur_table=0;
        var i=0;
        for(i=0;i < lst.length;i++){
            if((lst[i].getAttribute('id_bdd_de_la_base_en_cours')) && (parseInt(lst[i].getAttribute('id_bdd_de_la_base_en_cours'),10) === parseInt(this.#id_bdd_de_la_base_en_cours , 10) )){
                racine_du_svg=lst[i];
                break;
            }
        }
        if(racine_du_svg === null){
            return;
        }
        var t0='';
        var tab_des_champs = [];
        var tab_des_index_rev = [];
        var tab_des_index_sql = [];
        lst=racine_du_svg.getElementsByTagName('rect');
        var nom_table_temporaire='___temporaire___';
        var i=0;
        for(i=0;i < lst.length;i++){
            if((lst[i].getAttribute('type_element')) && (lst[i].getAttribute('type_element') == 'rectangle_de_table')){

                var nom_de_la_table_extraction = lst[i].getAttribute('nom_de_la_table');
                if(nom_de_la_table_extraction === nom_de_la_table){
                    id_svg_conteneur_table=parseInt(lst[i].getAttribute('id_svg_conteneur_table'),10);
                    t0='\ncreate_table(';
                    t0+=('\n nom_de_la_table(\'' + nom_table_temporaire + '\'),');
                    t0+=('\nmeta(' + lst[i].getAttribute('meta_rev_de_la_table') + '\n),');
                    t0+='\n fields(';
                    var lst2 = lst[i].parentNode.getElementsByTagName('rect');
                    var j=0;
                    for(j=0;j < lst2.length;j++){
                        if((lst2[j].getAttribute('type_element')) && (lst2[j].getAttribute('type_element') == 'rectangle_de_champ')){
                            var nom_du_champ = lst2[j].getAttribute('nom_du_champ');
                            tab_des_champs.push([nom_du_champ,('field(' + lst2[j].getAttribute('donnees_rev_du_champ') + ')')]);
                        }
                    }
                }
            }else if((lst[i].getAttribute('type_element')) && (lst[i].getAttribute('type_element') == 'rectangle_d_index')){
                if(lst[i].getAttribute('donnees_rev_de_l_index').indexOf(('nom_de_la_table_pour_l_index(\'' + nom_de_la_table)) >= 0){
                    tab_des_index_rev.push(('add_index(' + lst[i].getAttribute('donnees_rev_de_l_index') + ')'));
                }
            }
        }
        var nouveauTableau = [];
        var i=0;
        for(i=0;i < liste_ordre_modifie.length;i++){
            var j=0;
            for(j=0;j < tab_des_champs.length;j++){
                if(tab_des_champs[j][0] === liste_ordre_modifie[i]){
                    nouveauTableau.push(tab_des_champs[j][1]);
                }
            }
        }
        var nouveau_rev = (((t0 + nouveauTableau.join(','))) + '))');
//        console.log( 'nouveau_rev=' , nouveau_rev );
        var chaine_create_table='';
        var obj1 = rev_texte_vers_matrice(nouveau_rev);
        if(obj1.status === true){
            var obj2 = tabToSql1(obj1.value,0,0);
            if(obj2.status === true){
                chaine_create_table=obj2.value;
            }else{
                return;
            }
        }else{
            return;
        }
        var i=0;
        for(i=0;i < tab_des_index_rev.length;i++){
            var obj1 = rev_texte_vers_matrice(tab_des_index_rev[i]);
            if(obj1.status === true){
                var obj2 = tabToSql1(obj1.value,0,0);
                if(obj2.status === true){
                    tab_des_index_sql.push(obj2.value);
                }else{
                    return;
                }
            }else{
                return;
            }
        }
        /*
          
          CREATE  UNIQUE INDEX  idx_nom_basedd ON `tbl_bdds` 
          -- meta((index,'idx_nom_basedd'),(message,'à faire idx_nom_basedd'))  
          ( `chp_nom_basedd` , `chx_cible_id_basedd` ) ;
          console.log('tab_des_index_sql=' , tab_des_index_sql );
          debugger;
        */
        async function ordonner_les_champs_de_table(url="",donnees,that){
            return that.#recupérer_un_fetch(url,donnees);
        }
        var ajax_param={
            /* enveloppe d'appels */
            'call':{'lib':'core','file':'bdd','funct':'ordonner_les_champs_de_table'},
            /* paramètres */
            nom_de_la_table          : nom_de_la_table,
            ordre_original           : txt_ordre_original,
            ordre_modifie            : txt_ordre_modifie,
            id_bdd_de_la_base        : this.#id_bdd_de_la_base_en_cours,
            chaine_create_table      : chaine_create_table,
            nom_table_temporaire     : nom_table_temporaire,
            tab_des_index_sql        : tab_des_index_sql,
            nouveau_rev              : nouveau_rev,
            id_svg_conteneur_table   : id_svg_conteneur_table,
            mode_supression_de_champ : mode_supression_de_champ,
            en_base_et_sur_schema    : en_base_et_sur_schema,
        };
        ordonner_les_champs_de_table('za_ajax.php?ordonner_les_champs_de_table',ajax_param,this).then((donnees) => {
            if(donnees.status === 'OK'){
                //console.log( this.#arbre );
                // mode_supression_de_champ,en_base_et_sur_schema
                if(donnees.input.mode_supression_de_champ===true && en_base_et_sur_schema===false){
                }else{
                   var obj=this.#reordonner_les_champs_de_la_table_dans_le_svg(donnees.input.id_bdd_de_la_base , donnees.input.nom_de_la_table , donnees.input.ordre_modifie , donnees.input.id_svg_conteneur_table , donnees.input.nouveau_rev);
                   if(obj.status===true){
                      console.log('réordonner OK')
                   }else{
                      console.log('réordonner KO')
                   }
                }
                __gi1.global_modale2.close();
                this.#dessiner_le_svg();
            }
        }).catch((err) => {
            /* en cas de timeout par esemple */
            debugger;
            console.error(err);
        });     
    }
    /*
      ====================================================================================================================
      function reordonner_les_champs_de_la_table_dans_le_svg
    */
    #reordonner_les_champs_de_la_table_dans_le_svg(id_bdd_de_la_base , nom_de_la_table , ordre_modifie , id_svg_conteneur_table , nouveau_rev ){
        /* 
          supprimer récursivement tous les éléments de la table
        */
        this.#supprimer_recursivement_les_elements_de_l_arbre(id_bdd_de_la_base,id_svg_conteneur_table);
        var obj1 = rev_texte_vers_matrice(nouveau_rev);
        if(obj1.status===true){
           var indice_courant=this.#recuperer_prochain_id_svg();//max_id;
           this.#ajouter_table_et_index_a_arbre(obj1.value,1, indice_courant , id_bdd_de_la_base , nom_de_la_table);
           this.#modifier_les_references_des_liens(id_bdd_de_la_base);
         
        }
        return{status:true};
    }
    /*
      ====================================================================================================================
      function supprimer_un_champ_de_la_table
    */
    supprimer_un_champ_de_la_table(nom_de_la_table,nom_du_champ,en_base_et_sur_schema){

        if(!confirm('Certain ?')){
            return;
        }
        var liste_ordre_modifie = [];        
        var txt_ordre_modifie='';
        var lst = document.getElementById('ordre_original').getElementsByTagName('div');
        var i=0;
        var lst = document.getElementById('ordre_modifie').getElementsByTagName('div');
        for(i=0;i < lst.length;i++){
            if(lst[i].innerHTML!==nom_du_champ){
                txt_ordre_modifie+=(',' + lst[i].innerHTML);
                liste_ordre_modifie.push(lst[i].innerHTML);
            }
        }
        if(txt_ordre_modifie === ''){
            return;
        }
        txt_ordre_modifie=txt_ordre_modifie.substr(1);

        
        this.#modifier_une_table_en_bdd(nom_de_la_table,txt_ordre_modifie,txt_ordre_modifie,liste_ordre_modifie,true,en_base_et_sur_schema);
    }
    /*
      ====================================================================================================================
      function ordonner_les_champs
    */
    ordonner_les_champs(nom_de_la_table){
        var liste_ordre_modifie = [];
        var txt_ordre_original='';
        var txt_ordre_modifie='';
        var lst = document.getElementById('ordre_original').getElementsByTagName('div');
        var i=0;
        for(i=0;i < lst.length;i++){
            txt_ordre_original+=(',' + lst[i].innerHTML);
        }
        var lst = document.getElementById('ordre_modifie').getElementsByTagName('div');
        for(i=0;i < lst.length;i++){
            txt_ordre_modifie+=(',' + lst[i].innerHTML);
            liste_ordre_modifie.push(lst[i].innerHTML);
        }
        if(txt_ordre_modifie === txt_ordre_original){
            return;
        }
        if(txt_ordre_modifie === ''){
            return;
        }
        txt_ordre_modifie=txt_ordre_modifie.substr(1);
        txt_ordre_original=txt_ordre_original.substr(1);

        this.#modifier_une_table_en_bdd(nom_de_la_table,txt_ordre_original,txt_ordre_modifie,liste_ordre_modifie,false,true);
        

    }
    /*
      ===================================================================================================================
      function ajouter_l_index_dans_modale
    */
    ajouter_l_index_dans_modale(nom_de_la_table,id_svg_conteneur_table){
     var i=0;
     var j=0;
     var liste_des_champs_de_l_index=document.getElementById('liste_des_champs_de_l_index').value;
     if(liste_des_champs_de_l_index===''){
      return;
     }
     var nom_de_l_index=document.getElementById('nom_de_l_index').value;
     if(nom_de_l_index===''){
      return;
     }
     var message_de_l_index=document.getElementById('message_de_l_index').value;
     var unique=document.getElementById('unique').checked;
     
     var max_id=-1;
     var lst = this.#svg_dessin.getElementsByTagName('*');
     for(i=0;i < lst.length;i++){
         if((lst[i].id) && (isNumeric(lst[i].id))){
             j=parseInt(lst[i].id,10);
             if(j > max_id){
                 max_id=j;
             }
         }
     }
     max_id++;
     var donnees_rev_de_l_index='#(),index_name(\''+nom_de_l_index+'\'),nom_de_la_table_pour_l_index(\''+nom_de_la_table+'\'),fields('+liste_des_champs_de_l_index+')';
     if(unique===true){
       donnees_rev_de_l_index+=',unique()';
     }
     donnees_rev_de_l_index+=',meta(#(),(index,\''+nom_de_l_index+'\'),(message,\''+message_de_l_index.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'))';
     
     var a =this.#ajouter_index_a_table(this.#id_bdd_de_la_base_en_cours,max_id,nom_de_l_index,id_svg_conteneur_table,nom_de_la_table,donnees_rev_de_l_index);

     __gi1.global_modale2.close();
     this.#dessiner_le_svg();
     
     
    }
    /*
      
      ====================================================================================================================
      function raz_liste_des_champs_de_l_index
    */
    raz_liste_des_champs_de_l_index(){
        document.getElementById('liste_des_champs_de_l_index').value='';
    }
    /*
      
      ====================================================================================================================
      function ajouter_un_champ_a_l_index_dans_modale
    */
    ajouter_un_champ_a_l_index_dans_modale(nom_du_champ){
     var contenu_actuel=document.getElementById('liste_des_champs_de_l_index').value;
     if(contenu_actuel===''){
      document.getElementById('liste_des_champs_de_l_index').value=nom_du_champ;
     }else{
      document.getElementById('liste_des_champs_de_l_index').value=document.getElementById('liste_des_champs_de_l_index').value+','+nom_du_champ
     }
    }
    /*
      
      ====================================================================================================================
      function modale_gerer_la_table
    */
    #modale_gerer_la_table(element_g_conteneur_de_nom_de_table){
        var nom_de_la_table='';
        var id_svg_du_texte=0;
        var element_g_conteneur_de_table=element_g_conteneur_de_nom_de_table.parentNode;
        /* on ne peut pas chercher un tagname #text */
        var liste_des_champs = [];
        var lst = element_g_conteneur_de_table.getElementsByTagName('text');
        var i=0;
        for(i=0;i < lst.length;i++){
            if((lst[i].nodeName.toLowerCase() === 'text') && ('texte_de_nom_de_table' === lst[i].getAttribute('type_element'))){
                var j=0;
                for(j=0;j < lst[i].childNodes.length;j++){
                    if(lst[i].childNodes[j].nodeName.toLowerCase() === '#text'){
                        nom_de_la_table=lst[i].childNodes[j].data;
                        id_svg_du_texte=lst[i].id;
                    }
                }
            }else if('texte_de_champ' === lst[i].getAttribute('type_element')){
                var j=0;
                for(j=0;j < lst[i].childNodes.length;j++){
                    if(lst[i].childNodes[j].nodeName.toLowerCase() === '#text'){
                        liste_des_champs.push(lst[i].childNodes[j].data);
                    }
                }
            }
        }
        if(id_svg_du_texte === 0){
            return;
        }
        var t='<h1>gestion de la table</h1>';
        t+='<hr />';
        t+='<h2>dans ce graphique</h2>';
        t+='<h3>changer le nom</h3>';
        t+=('<input id="nouveau_nom" type="text" value="' + nom_de_la_table + '" />');
        t+=('<input id="ancien_nom" type="hidden" value="' + nom_de_la_table + '" />');
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.changer_le_nom_de_table(' + id_svg_du_texte + ',' + element_g_conteneur_de_nom_de_table.getAttribute('id_svg_conteneur_table') + ')">modifier</a>');
        t+='<hr />';
        t+='<h3>modifier ses propriétés</h3>';
        var liste_meta_table={'nom_long_de_la_table':{'txt':('à faire ' + nom_de_la_table + ''),'complement':''},'nom_court_de_la_table':{'txt':('à faire ' + nom_de_la_table + ''),'complement':''},'nom_bref_de_la_table':{'txt':('à faire ' + nom_de_la_table + ''),'complement':''},'transform_table_sur_svg':{txt:'transform(translate(0,0))','complement':''},'default_charset':{txt:'','complement':'utf8mb4'},'collate':{txt:'','complement':'utf8mb4_unicode_ci'}};
        var id_svg_rectangle_de_la_table=0;
        var lst = element_g_conteneur_de_nom_de_table.parentNode.getElementsByTagName('rect');
        for(i=0;i < lst.length;i++){
            if((lst[i].nodeName.toLowerCase() === 'rect') && ('rectangle_de_table' === lst[i].getAttribute('type_element'))){
                id_svg_rectangle_de_la_table=lst[i].getAttribute('id');
                if((lst[i].getAttribute('meta_rev_de_la_table')) && (lst[i].getAttribute('meta_rev_de_la_table') !== '')){
                    var obj_matrice_de_la_table = functionToArray(lst[i].getAttribute('meta_rev_de_la_table'),true,false,'');
                    if(obj_matrice_de_la_table.status === true){
                        var l=1;
                        for(l=1;l < obj_matrice_de_la_table.value.length;l++){
                            if((obj_matrice_de_la_table.value[l][3] === 0) && (obj_matrice_de_la_table.value[l][8] === 2)){
                                if(liste_meta_table[obj_matrice_de_la_table.value[(l + 1)][1]]){
                                    if(obj_matrice_de_la_table.value[(l + 1)][1] === 'transform_table_sur_svg'){
                                        var txt = a2F1(obj_matrice_de_la_table.value,(l + 2),false,(l + 3),false);
                                        liste_meta_table[obj_matrice_de_la_table.value[(l + 1)][1]].txt=('transform(' + txt.value + ')');
                                    }else{
                                        liste_meta_table[obj_matrice_de_la_table.value[(l + 1)][1]].txt=obj_matrice_de_la_table.value[(l + 2)][1];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var cle={};
        for(cle in liste_meta_table){
            if('transform_table_sur_svg' === cle){
                t+=('<input type="hidden" id="meta_modifier__' + cle + '" value="' + liste_meta_table[cle].txt.replace(/"/g,'&quot;') + '" />' + liste_meta_table[cle].complement);
            }else{

                t+='<br />';
                t+=''+cle.replace(/_/g,' ');
                t+=' : ';
                t+='<input type="text" id="meta_modifier__' + cle + '" value="' + liste_meta_table[cle].txt.replace(/\\\'/g,'\'').replace(/\\\\/g,'\\').replace(/"/g,'&quot;') + '" />' + liste_meta_table[cle].complement;
            }
        }
        t+=('<br /><a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.modifier_la_table_de_modale(' + id_svg_rectangle_de_la_table + ',&quot;' + nom_de_la_table + '&quot;)">modifier</a>');
        /*
        
        */
        t+='<hr />';
        t+='<h3>ajouter un champ</h3>';
        t+='<div class="yydanger" id="zone_message_ajouter_un_champ"></div>';
        t+='typologie : ';
        t+='<select id="typologie">';
        t+='<option value="">choisissez une typologie</option>';
        t+='<option value="chi">index entier (chi) integer[n]</option>';
        t+='<option value="chp">phrase (chp) varchar(n)</option>';
        t+='<option value="chx">référence croisée (chx) integer[n]</option>';
        t+='<option value="che">entier (che) integer[n]</option>';
        t+='<option value="chn">numérique (chn) float</option>';
        t+='<option value="chu">choix unique (chu) integer(n)</option>';
        t+='<option value="chm">choix multiple (chm) text</option>';
        t+='<option value="cht">texte (cht) text</option>';
        t+='<option value="cho">mot (cho) character(n)</option>';
        t+='<option value="chd">date heure (chd) text(23) YYYY-MM-DD HH:MM:SS.SSS</option>';
        t+='<option value="cha">date character(10)</option>';
        t+='<option value="chh">heure character(8)</option>';
        t+='<option value="chb">blob (chb) blob</option>';
        t+='<option value="ch?">inconnue (ch?)</option>';
        t+='</select>';
        t+='<br />';
        t+='nom : ';
        t+='<input id="nom_du_champ" type="text" value="chi_" />';
        t+='<br />type  : <input id="type" type="text" value="" />';
        t+='<br />table mère pour chx  : <input id="table_mère" type="text" value="" />';
        t+='<br />champ père pour chx  : <input id="champ_père" type="text" value="" />';
        t+='<br />index primaire <input id="primaire" type="checkbox" /> ';
        t+='<br />non nulle <input id="non_nulle" type="checkbox" /> ';
        t+='<br />auto increment <input id="auto_increment" type="checkbox" /> ';
        t+='<br />a une valeur par défaut <input id="a_une_valeur_par_defaut" type="checkbox" /> , type caractère <input id="la_valeur_par_defaut_est_caractere" type="checkbox" /> , valeur : <input id="valeur_par_defaut" type="text" value="" /> ';
        
        t+='<br />nom long du champ : <input type="text" id="meta_ajouter__nom_long_du_champ" value="à faire ...">';
        t+='<br />nom court du champ : <input type="text" id="meta_ajouter__nom_court_du_champ" value="à faire ...">';
        t+='<br />nom bref du champ : <input type="text" id="meta_ajouter__nom_bref_du_champ" value="à faire ...">';
        
        
        
        t+=('<br /><a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.ajouter_un_champ_de_modale(' + element_g_conteneur_de_nom_de_table.getAttribute('id_svg_conteneur_table') + ',&quot;' + nom_de_la_table + '&quot;)">ajouter</a>');
        /*
        
        */
        
        
        
        t+='<hr />';
        t+='<h3>ajouter un index</h3>';
        t+='nom : <input id="nom_de_l_index" type="text" value="idx_" />';
        t+='<br />';
        t+='liste des champs : <input id="liste_des_champs_de_l_index" type="text" value="" disabled style="width:90%;"/>';
        t+='<br />';
        t+='<a class="yyavertissement" href="javascript:' + this.#nom_de_la_variable + '.raz_liste_des_champs_de_l_index()">raz</a>'
        for(i=0;i < liste_des_champs.length;i++){
         t+='<a href="javascript:' + this.#nom_de_la_variable + '.ajouter_un_champ_a_l_index_dans_modale(&quot;' + liste_des_champs[i] + '&quot;)">'+liste_des_champs[i]+'</a>'
        }
        t+='<br />message des l\'index : <input id="message_de_l_index" type="text" value="" />';
        t+='<br />unique  : <input type="checkbox" id="unique" />';
        t+='<br /><a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.ajouter_l_index_dans_modale(&quot;' + nom_de_la_table + '&quot;,' + element_g_conteneur_de_nom_de_table.getAttribute('id_svg_conteneur_table') + ')">ajouter</a>'
        /*
        
        */

        /*
        
        */
        t+='<hr />';
        t+='<h3>Supprimer la table </h3>';
        t+=('<a class="yydanger" href="javascript:' + this.#nom_de_la_variable + '.supprimer_la_table_de_modale(&quot;' + element_g_conteneur_de_nom_de_table.getAttribute('id_svg_conteneur_table') + '&quot;,&quot;' + nom_de_la_table + '&quot;)">supprimer</a>');

        t+='<hr />';
        t+='<h2>dans la bdd</h2>';
        t+='<hr />';
        t+='<h3>ordonner les champs dans la bdd</h3>';
        t+='<table><tr><th>original</th><th>modifié(d&amp;d)</th><th>action</th></tr>';
        t+='<tr><td>';
        t+='<div id="ordre_original">';
        for(i=0;i < liste_des_champs.length;i++){
            t+=('<div style="padding:' + CSS_TAILLE_REFERENCE_PADDING + 'px;">' + liste_des_champs[i] + '</div>');
        }
        t+='</div></td><td>';
        t+='<div id="ordre_modifie" style="cursor:n-resize;">';
        for(i=0;i < liste_des_champs.length;i++){
            t+=('<div style="padding:' + CSS_TAILLE_REFERENCE_PADDING + 'px;">' + liste_des_champs[i] + '</div>');
        }
        t+='</div></td><td>';
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.ordonner_les_champs(&quot;' + nom_de_la_table + '&quot;)">ordonner</a>');
        t+='</td></tr></table>';
        /*
        
        */
        t+='<hr />';
        t+='<h3>supprimer un champ dans la bdd</h3>';
        t+='<table><tr><th>original</th><th>action</th></tr>';
        t+='<tr><td>';
        t+='<div id="champ">';
        for(i=0;i < liste_des_champs.length;i++){
            t+=('<div style="padding:' + CSS_TAILLE_REFERENCE_PADDING + 'px;">' + liste_des_champs[i] + '</div>');
        }
        t+='</div></td>';
        t+='<td>';
        t+='<div id="action_supprimer_dans_bdd" >';
        for(i=0;i < liste_des_champs.length;i++){
            t+=('<div style="padding:' + CSS_TAILLE_REFERENCE_PADDING + 'px;"><a class="yydanger" href="javascript:' + this.#nom_de_la_variable + '.supprimer_un_champ_de_la_table(&quot;' + nom_de_la_table + '&quot;,&quot;' + liste_des_champs[i] + '&quot;,true)">supprimer en base et sur le schéma</a></div>');
        }
        t+='</div>';
        t+='</td>';
        t+='<td>';
        t+='<div id="action_supprimer_dans_bdd" >';
        for(i=0;i < liste_des_champs.length;i++){
            t+=('<div style="padding:' + CSS_TAILLE_REFERENCE_PADDING + 'px;"><a class="yydanger" href="javascript:' + this.#nom_de_la_variable + '.supprimer_un_champ_de_la_table(&quot;' + nom_de_la_table + '&quot;,&quot;' + liste_des_champs[i] + '&quot;,false)">supprimer en base uniquement</a></div>');
        }
        t+='</div>';
        t+='</td>';
        t+='</tr></table>';
        
        t+='<hr />';
        t+='<h3>Créer la table dans la bdd</h3>';
        t+=('<a class="yyinfo" href="javascript:' + this.#nom_de_la_variable + '.ajouter_la_table_en_base_de_modale(' + id_svg_rectangle_de_la_table + ',&quot;' + nom_de_la_table + '&quot;)">ajouter la table dans la base</a>');
        
        
        t+='<h3>supprimer la table dans la bdd</h3>';
        t+=('<a class="yydanger" href="javascript:' + this.#nom_de_la_variable + '.supprimer_la_table_en_base_de_modale(' + id_svg_rectangle_de_la_table + ',&quot;' + nom_de_la_table + '&quot;)">supprimer la table dans la base</a>');
        
        
        document.getElementById('__contenu_modale').innerHTML=t;
        
        new Sortable(ordre_modifie,{animation:150,ghostClass:'blue-background-class'});
        __gi1.global_modale2.showModal();
    }
    /*
      
      ====================================================================================================================
      function svg_ajuster_la_largeur_de_la_base
    */
    #svg_ajuster_la_largeur_de_la_base(id_svg_de_la_base_en_cours){
       
       var id_bdd_de_la_base_en_cours=parseInt(document.getElementById(id_svg_de_la_base_en_cours).getAttribute('id_bdd_de_la_base_en_cours'),10);
/*       
       for( var i in this.#arbre[id_bdd_de_la_base_en_cours].arbre_svg){
        var el=this.#arbre[id_bdd_de_la_base_en_cours].arbre_svg[i];
        if(el.proprietes.type_element==="conteneur_de_table"){
         this.#svg_ajuster_largeur_de_table(el.id);

        }
        
       }
*/     
        var indiceRectangle = (parseInt(id_svg_de_la_base_en_cours,10) + 1);
        var element_rectangle = document.getElementById(indiceRectangle);
        /*
          
          on fait disparaître le rectangle de la base pour obtenir la taille du groupe
        */
        try{
            element_rectangle.style.display='none';
        }catch(e){
            debugger;
        }
        var temp = document.getElementById(id_svg_de_la_base_en_cours).getBBox();
        var groupe_apres_modifications={x:temp.x,y:temp.y,width:temp.width,height:temp.height};
        element_rectangle.setAttribute('x',Math.floor((groupe_apres_modifications.x - (1 * this.#taille_bordure))));
        element_rectangle.setAttribute('y',Math.floor((groupe_apres_modifications.y - (1 * this.#taille_bordure))));
        element_rectangle.setAttribute('width',Math.ceil((groupe_apres_modifications.width + (2 * this.#taille_bordure))));
        var hauteur_du_carre_de_la_base=Math.ceil((groupe_apres_modifications.height + (2 * this.#taille_bordure)));
        if(hauteur_du_carre_de_la_base<2*this.#hauteur_de_boite){
         hauteur_du_carre_de_la_base=2*this.#hauteur_de_boite;
        }
        element_rectangle.setAttribute('height',hauteur_du_carre_de_la_base);
        /*
          
          on fait réaparaître le rectangle de la base
        */
        element_rectangle.style.display='';
    }
    /*
      
      ====================================================================================================================
      function svg_ajuster_largeur_de_table
    */
    #svg_ajuster_largeur_de_table(indice_svg_table_en_cours){
        
        var gparent = document.getElementById(indice_svg_table_en_cours);
        var lst = gparent.getElementsByTagName('rect');
        /* on masque tous les rectangles */
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].getAttribute('type_element')){
                if((lst[i].getAttribute('type_element') === 'rectangle_de_table') || (lst[i].getAttribute('type_element') === 'rectangle_de_nom_de_table') || (lst[i].getAttribute('type_element') === 'rectangle_d_index') || (lst[i].getAttribute('type_element') === 'rectangle_de_champ')){
                    lst[i].style.display='none';
                }
            }
        }
        /* on les réaffiche tous */
        var temp = gparent.getBBox();
        var largeur = (parseInt(temp.width,10) + 1 + this.#taille_bordure);
        if(largeur < 40){
            largeur=40;
        }
        var position_gauche_de_la_table=0;
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].getAttribute('type_element')){
                if(lst[i].getAttribute('type_element') === 'rectangle_de_table'){
                    lst[i].setAttribute('width',(largeur + (2 * this.#taille_bordure)));
                    position_gauche_de_la_table=parseInt(lst[i].parentElement.getAttribute('decallage_x'),10);
                }else if((lst[i].getAttribute('type_element') === 'rectangle_de_nom_de_table') || (lst[i].getAttribute('type_element') === 'rectangle_d_index') || (lst[i].getAttribute('type_element') === 'rectangle_de_champ')){
                    lst[i].setAttribute('width',largeur);
                }
                lst[i].style.display='';
            }
        }
        /*
          
          mise à jour de la position des liens aval
        */
        var lst = this.#svg_dessin.getElementById(this.#id_svg_de_la_base_en_cours).getElementsByTagName('path');
        var i=0;
        for(i=0;i < lst.length;i++){
            if(lst[i].getAttribute('type_element')){
                if((lst[i].getAttribute('type_element') === 'reference_croisée') && (lst[i].getAttribute('id_svg_parent_table') == indice_svg_table_en_cours)){
                    var d = lst[i].getAttribute('d');
                    var ancien_chemin = lst[i].getAttribute('d');
//                    debugger
                    var tab_chemin = ancien_chemin.split(' ');
                    tab_chemin[6]=(position_gauche_de_la_table + largeur + 30);
                    tab_chemin[8]=(position_gauche_de_la_table + largeur + (2 * this.#taille_bordure));
                    var nouveau_chemin = tab_chemin.join(' ');
                    lst[i].setAttribute('d',nouveau_chemin);
                    this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.d=nouveau_chemin;
                }
            }
        }
        var j={};
        for(j in this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours]){
            if((this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j] !== null) && (indice_svg_table_en_cours === this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j].id_svg_parent_table)){
                this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j].p2[0]=(position_gauche_de_la_table + largeur + (2 * this.#taille_bordure));
            }
        }
        this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
    }
    /*
      
      ====================================================================================================================
      function supprimer_recursivement_les_elements_de_l_arbre
    */
    #supprimer_recursivement_les_elements_de_l_arbre(id_bdd,id_parent){
        var i={};
        for(i in this.#arbre[id_bdd].arbre_svg){
            if((this.#arbre[id_bdd].arbre_svg[i] !== null) && (this.#arbre[id_bdd].arbre_svg[i].id_parent === id_parent)){
                this.#supprimer_recursivement_les_elements_de_l_arbre(id_bdd,this.#arbre[id_bdd].arbre_svg[i].id);
            }
        }
        if((this.#arbre[id_bdd].arbre_svg[id_parent].proprietes) && (this.#arbre[id_bdd].arbre_svg[id_parent].proprietes.type_element) && (this.#arbre[id_bdd].arbre_svg[id_parent].proprietes.type_element === "rectangle_de_champ") && (this.#arbre[id_bdd].arbre_svg[id_parent].proprietes.donnees_rev_du_champ) && (this.#arbre[id_bdd].arbre_svg[id_parent].proprietes.donnees_rev_du_champ.indexOf('references('))){
            /*
              si on supprime un champ qui a des parents, il faut supprimer dens l'arbre le path correspondant
            */
            var id_svg_champ_en_cours=this.#arbre[id_bdd].arbre_svg[id_parent].proprietes.id_svg_champ_en_cours;
            var id_svg_conteneur_table=this.#arbre[id_bdd].arbre_svg[id_parent].proprietes.id_svg_conteneur_table;
            var j={};
            for(j in this.#svg_tableaux_des_references_amont_aval[id_bdd]){
                if((this.#svg_tableaux_des_references_amont_aval[id_bdd][j]) && (id_svg_conteneur_table === this.#svg_tableaux_des_references_amont_aval[id_bdd][j].id_svg_enfant_table) && (id_svg_champ_en_cours === this.#svg_tableaux_des_references_amont_aval[id_bdd][j].id_svg_enfant_champ)){
                    var id_du_path=this.#svg_tableaux_des_references_amont_aval[id_bdd][j].id_du_path;
                    this.#arbre[id_bdd].arbre_svg[id_du_path]=null;
                    this.#svg_tableaux_des_references_amont_aval[id_bdd][j]=null;
                }
            }
            /*
              si on supprime un champ qui a des enfants, in faut supprimer ses enfants
            */
            var j={};
            for(j in this.#svg_tableaux_des_references_amont_aval[id_bdd]){
                if((this.#svg_tableaux_des_references_amont_aval[id_bdd][j]) && (id_svg_conteneur_table === this.#svg_tableaux_des_references_amont_aval[id_bdd][j].id_svg_parent_table) && (id_svg_champ_en_cours === this.#svg_tableaux_des_references_amont_aval[id_bdd][j].id_svg_parent_champ)){
                    this.#supprimer_recursivement_les_elements_de_l_arbre(id_bdd,this.#svg_tableaux_des_references_amont_aval[id_bdd][j].id_svg_enfant_champ);
                }
            }
        }
        this.#arbre[id_bdd].arbre_svg[id_parent]=null;
    }
    /*
      
      ====================================================================================================================
      function modifier_la_base_de_modale
    */
    modifier_la_base_de_modale(id_svg_rectangle_de_la_base){
        var la_modale = document.getElementById('__contenu_modale');
        var liste_meta_base={'transform_base_sur_svg':{txt:'transform(translate(0,0))','complement':''},'default_charset':{txt:'','complement':'utf8mb4'},'collate':{txt:'','complement':'utf8mb4_unicode_ci'}};
        var t='';
        var i={};
        for(i in liste_meta_base){
            if((document.getElementById(('meta__' + i)).value === '') && (liste_meta_base[i].txt === '')){
                /* il y a des valeurs qui ne sont pas obligatoires */
            }else{
                if(t !== ''){
                    t+=',';
                }
                if(i === 'transform_base_sur_svg'){
                    t+=('(' + i + ' , ' + document.getElementById(('meta__' + i)).value + ')');
                }else{
                    t+=('(' + i + ' , \'' + document.getElementById(('meta__' + i)).value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')');
                }
            }
        }
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_svg_rectangle_de_la_base].proprietes.donnees_rev_meta_de_la_base=t;
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
    }
    /*
      
      ====================================================================================================================
      function modifier_la_table_de_modale
    */
    modifier_la_table_de_modale(id_svg_rectangle_de_la_table,nom_de_la_table){
        var la_modale = document.getElementById('__contenu_modale');
        var liste_meta_table={'nom_long_de_la_table':('à faire ' + nom_de_la_table + ''),'nom_court_de_la_table':('à faire ' + nom_de_la_table + ''),'nom_bref_de_la_table':('à faire ' + nom_de_la_table + ''),transform_table_sur_svg:'transform(translate(0,0))',default_charset:'',collate:''};
        var t = ('(table , ' + nom_de_la_table + ')');
        var i={};
        for(i in liste_meta_table){
            if((document.getElementById(('meta_modifier__' + i)).value === '') && (liste_meta_table[i] === '')){
                /* il y a des valeurs qui ne sont pas obligatoires */
            }else{
                if(i === 'transform_table_sur_svg'){
                    t+=(',(' + i + ' , ' + document.getElementById(('meta_modifier__' + i)).value + ')');
                }else{
                    t+=(',(' + i + ' , \'' + document.getElementById(('meta_modifier__' + i)).value.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\')');
                }
            }
        }
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_svg_rectangle_de_la_table].proprietes.meta_rev_de_la_table=t;
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
    }
    
    
    /*
      ====================================================================================================================
      function creer_definition_table_en_rev
    */
    #creer_definition_table_en_rev(element_svg_rectangle_de_table){
     
       var nom_de_la_table = element_svg_rectangle_de_table.getAttribute('nom_de_la_table');
       var definition_de_table='';
       definition_de_table+='\n#(=================================================================)';
       definition_de_table+='\ncreate_table(';
       definition_de_table+=('\n nom_de_la_table(\'' + nom_de_la_table.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),');
       definition_de_table+=('\nmeta(' + element_svg_rectangle_de_table.getAttribute('meta_rev_de_la_table') + '\n),');
       definition_de_table+='\n fields(';
       var lst2 = element_svg_rectangle_de_table.parentNode.getElementsByTagName('rect');
       var j=0;
       for(j=0;j < lst2.length;j++){
           if((lst2[j].getAttribute('type_element')) && (lst2[j].getAttribute('type_element') == 'rectangle_de_champ')){
               var nom_du_champ = lst2[j].getAttribute('nom_du_champ');
               definition_de_table+=('\n  field(' + lst2[j].getAttribute('donnees_rev_du_champ') + ')');
           }
       }
       definition_de_table+='\n ),';
       definition_de_table+='\n)';
       return definition_de_table;
    }    

    /*
      ====================================================================================================================
      function supprimer_la_table_en_base_de_modale
    */
    supprimer_la_table_en_base_de_modale(id_svg_rectangle_de_la_table,nom_de_la_table){
     
        var source_sql='DROP table '+nom_de_la_table;
     
        async function supprimer_table_dans_base(url="",donnees,that){
            return that.#recupérer_un_fetch(url,donnees);
        }
        var ajax_param={'call':{'lib':'core','file':'bdd','funct':'supprimer_table_dans_base'},source_sql:source_sql,id_bdd_de_la_base:this.#id_bdd_de_la_base_en_cours};
        supprimer_table_dans_base('za_ajax.php?supprimer_table_dans_base',ajax_param,this).then((donnees) => {
            if(donnees.status === 'OK'){
                this.#message_succes_modale(donnees);
            }else{
                this.#message_erreur_modale(donnees);
                console.error('KO donnees=' , donnees);
            }
        });
     
     
    }
    /*
      ====================================================================================================================
      function ajouter_la_table_en_base_de_modale
    */
    ajouter_la_table_en_base_de_modale(id_svg_rectangle_de_la_table,nom_de_la_table){
        var t=this.#creer_definition_table_en_rev(document.getElementById(id_svg_rectangle_de_la_table));
//        console.log(t);
        var obj1=rev_texte_vers_matrice(t);
        if(obj1.status===true){
            var obj2=tabToSql0(obj1.value,0,0,{tableau_tables_champs:[]});
            if(obj2.status===true){
//                console.log(obj2.value);
                
                
                async function creer_table_dans_base(url="",donnees,that){
                    return that.#recupérer_un_fetch(url,donnees);
                }
                var ajax_param={'call':{'lib':'core','file':'bdd','funct':'creer_table_dans_base'},source_sql:obj2.value,id_bdd_de_la_base:this.#id_bdd_de_la_base_en_cours};
                creer_table_dans_base('za_ajax.php?creer_table_dans_base',ajax_param,this).then((donnees) => {

                    if(donnees.status === 'OK'){
                        this.#message_succes_modale(donnees);
                    }else{
                        this.#message_erreur_modale(donnees);
                        console.error('KO donnees=' , donnees);
                    }
                    
                });
                
                
                
            }else{
                debugger
            }
        }else{
            debugger
        }
    }
    
    /*
      
      ====================================================================================================================
      function supprimer_la_table_de_modale
    */
    supprimer_la_table_de_modale(id_svg_conteneur_table,nom_de_la_table){
        if(!confirm('certain ?')){
            return;
        }
        id_svg_conteneur_table=parseInt(id_svg_conteneur_table,10);
        /*
          
          suppression des références éventuelles sur cette table
          on recherche toutes les références à cette table
        */
        var liste_des_id_svg_champs = [];
        var i={};
        for(i in this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg){
            if((this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i] !== null) && (this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes) && (this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes.donnees_rev_du_champ) && (this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes.donnees_rev_du_champ.indexOf('references') >= 0)){
                /*
                  
                  On repère tous les champs qui font référence à cette table         
                */
                var obj = functionToArray(this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes.donnees_rev_du_champ,true,false,'');
                if(obj.status === true){
                    var j=0;
                    for(j=0;j < obj.value.length;j++){
                        if((obj.value[j][7] === 0) && (obj.value[j][1] === 'references') && (obj.value[j][2] === 'f')){
                            if(obj.value[(j + 1)][1] === nom_de_la_table){
                                var id_svg_champ_a_supprimer=this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].id_parent;
                                /* on stock l'id du champ et on supprime le champ de l'arbre */
                                liste_des_id_svg_champs.push(id_svg_champ_a_supprimer);
                                this.#supprimer_recursivement_les_elements_de_l_arbre(this.#id_bdd_de_la_base_en_cours,id_svg_champ_a_supprimer);
                            }
                        }
                    }
                }else{
                    return;
                }
            }
        }
        var i=0;
        for(i=0;i < liste_des_id_svg_champs.length;i++){
            var j={};
            for(j in this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg){
                if((this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j] !== null) && (this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j].type === 'path') && ((this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j].proprietes.id_svg_enfant_champ === liste_des_id_svg_champs[i]) || (this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j].proprietes.id_svg_parent_champ === liste_des_id_svg_champs[i]))){
                    this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j]=null;
                }
            }
        }
        /*
          
          on supprime la table
        */
        this.#supprimer_recursivement_les_elements_de_l_arbre(this.#id_bdd_de_la_base_en_cours,id_svg_conteneur_table);
        /*
          
          il faut supprimer les liens de svg_tableaux_des_references_amont_aval
        */
        var i=0;
        for(i=0;i < liste_des_id_svg_champs.length;i++){
            var j={};
            for(j in this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours]){
                if((this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j] !== null) && (liste_des_id_svg_champs[i] === this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j].id_svg_enfant_champ)){
                    this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j]=null;
                }
            }
        }
        __gi1.global_modale2.close();
        this.#dessiner_le_svg();
        this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
    }
    /*
      
      ====================================================================================================================
      function doigt_bouge
    */
    #doigt_bouge(e){
        this.#souris_bouge(e.touches[0]);
    }
    /*
      
      ====================================================================================================================
      function doigt_haut
    */
    #doigt_haut(e){
        console.log('ici e=',e.changedTouches);
        this.#souris_haut(e.changedTouches[0]);
    }
    /*
      
      ====================================================================================================================
      function doigt_bas
    */
    #doigt_bas(e){
        console.log(e);
        this.#souris_bas(e.touches[0]);
    }
    /*
      
      ====================================================================================================================
      function souris_bouge
    */
    #souris_bouge(e){
        this.#souris_init_objet.x_final=e[this.#propriete_pour_deplacement_x];
        this.#souris_init_objet.y_final=e[this.#propriete_pour_deplacement_y];
        try{
            /* permer de ne pas sélectionner les textes , ne fonctionne pas sur les mobiles */
            e.preventDefault();
        }catch(er){
        }
        if(this.#souris_element_a_deplacer === 'svg'){
            var calculx = ((((this.#souris_init_objet.x - e[this.#propriete_pour_deplacement_x])) * this.#_dssvg.zoom1) + this.#souris_init_objet.param_bouge.x);
            var calculy = ((((this.#souris_init_objet.y - e[this.#propriete_pour_deplacement_y])) * this.#_dssvg.zoom1) + this.#souris_init_objet.param_bouge.y);
            this.#souris_init_objet.elem_bouge.setAttribute('viewBox',(calculx + ',' + calculy + ',' + this.#souris_init_objet.elem_bouge.viewBox.baseVal.width + ',' + this.#souris_init_objet.elem_bouge.viewBox.baseVal.height));
            return;
        }else if(this.#souris_element_a_deplacer === 'base'){
            var calculx = ((((e[this.#propriete_pour_deplacement_x] - this.#souris_init_objet.x)) * this.#_dssvg.zoom1) + this.#souris_init_objet.param_bouge.x);
            var calculy = ((((e[this.#propriete_pour_deplacement_y] - this.#souris_init_objet.y)) * this.#_dssvg.zoom1) + this.#souris_init_objet.param_bouge.y);
            calculx=parseInt(calculx,10);
            calculy=parseInt(calculy,10);
            if((this.#taille_bordure % 2) !== 0){
                calculx+=0.5;
                calculy+=0.5;
            }
            this.#souris_init_objet.elem_bouge.setAttribute('transform',('translate(' + calculx + ',' + calculy + ')'));
            this.#souris_init_objet.elem_bouge.setAttribute('decallage_x',calculx);
            this.#souris_init_objet.elem_bouge.setAttribute('decallage_y',calculy);
            /* mise à jour de l'arbre */
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[this.#souris_init_objet.id_svg_conteneur_base].proprietes.transform=('translate(' + calculx + ',' + calculy + ')');
            return;
        }else if(this.#souris_element_a_deplacer === 'table'){
            this.#svg_souris_delta_x=(((e[this.#propriete_pour_deplacement_x] - this.#souris_init_objet.x)) * this.#_dssvg.zoom1);
            this.#svg_souris_delta_y=(((e[this.#propriete_pour_deplacement_y] - this.#souris_init_objet.y)) * this.#_dssvg.zoom1);
            var calculx = parseInt((this.#svg_souris_delta_x + this.#souris_init_objet.param_bouge.x),10);
            var calculy = parseInt((this.#svg_souris_delta_y + this.#souris_init_objet.param_bouge.y),10);
            this.#souris_init_objet.elem_bouge.setAttribute('transform',('translate(' + calculx + ',' + calculy + ')'));
            this.#souris_init_objet.elem_bouge.setAttribute('decallage_x',calculx);
            this.#souris_init_objet.elem_bouge.setAttribute('decallage_y',calculy);
            /* mise à jour de l'arbre */
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[this.#souris_init_objet.id_svg_conteneur_table].proprietes.decallage_x=calculx;
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[this.#souris_init_objet.id_svg_conteneur_table].proprietes.decallage_y=calculy;
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[this.#souris_init_objet.id_svg_conteneur_table].proprietes.transform=('translate(' + calculx + ',' + calculy + ')');
            /*
              
              déplacement des liens de la table en cours de mouvement 
            */
            if(this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours]){
                var i=0;
                for(i=0;i < this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours].length;i++){
                    var elem=this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours][i];
                    if(elem){
                        if((elem.id_svg_enfant_table === this.#souris_init_objet.id_svg_conteneur_table) && (elem.id_svg_parent_table === this.#souris_init_objet.id_svg_conteneur_table)){
                            /*
                              
                              lien sur moi même
                            */
                            var ref_elem = document.getElementById(elem.id_du_path);
                            var nouveau_chemin = ('M ' + ((elem.p1[0] + this.#svg_souris_delta_x)) + ' ' + ((elem.p1[1] + this.#svg_souris_delta_y)));
                            nouveau_chemin+=(' C ' + ((((elem.p1[0] + this.#svg_souris_delta_x)) - 30)) + ' ' + ((elem.p1[1] + this.#svg_souris_delta_y)));
                            nouveau_chemin+=(' ' + ((elem.p2[0] + this.#svg_souris_delta_x + 30)) + ' ' + ((elem.p2[1] + this.#svg_souris_delta_y)));
                            nouveau_chemin+=(' ' + ((elem.p2[0] + this.#svg_souris_delta_x)) + ' ' + ((elem.p2[1] + this.#svg_souris_delta_y)));
                            ref_elem.setAttribute('d',nouveau_chemin);
                        }else{
                            if(elem.id_svg_enfant_table === this.#souris_init_objet.id_svg_conteneur_table){
                                var ref_elem = document.getElementById(elem.id_du_path);
                                var nouveau_chemin = ('M ' + ((elem.p1[0] + this.#svg_souris_delta_x)) + ' ' + ((elem.p1[1] + this.#svg_souris_delta_y)));
                                nouveau_chemin+=(' C ' + ((((elem.p1[0] + this.#svg_souris_delta_x)) - 30)) + ' ' + ((elem.p1[1] + this.#svg_souris_delta_y)));
                                nouveau_chemin+=(' ' + ((elem.p2[0] + 30)) + ' ' + elem.p2[1]);
                                nouveau_chemin+=(' ' + elem.p2[0] + ' ' + elem.p2[1]);
                                ref_elem.setAttribute('d',nouveau_chemin);
                            }
                            if(elem.id_svg_parent_table === this.#souris_init_objet.id_svg_conteneur_table){
                                var ref_elem = document.getElementById(elem.id_du_path);
                                var nouveau_chemin = ('M ' + elem.p1[0] + ' ' + elem.p1[1]);
                                nouveau_chemin+=(' C ' + ((elem.p1[0] - 30)) + ' ' + elem.p1[1]);
                                nouveau_chemin+=(' ' + ((elem.p2[0] + this.#svg_souris_delta_x + 30)) + ' ' + ((elem.p2[1] + this.#svg_souris_delta_y)));
                                nouveau_chemin+=(' ' + ((elem.p2[0] + this.#svg_souris_delta_x)) + ' ' + ((elem.p2[1] + this.#svg_souris_delta_y)));
                                ref_elem.setAttribute('d',nouveau_chemin);
                            }
                        }
                    }
                }
            }
            return;
        }
    }
    /*
      
      ====================================================================================================================
      function maj_meta
    */
    #maj_meta(type_element,id_bdd,id_svg_element,nom_propriete){
        if(type_element === 'base'){
            var id_svg_rectangle = (id_svg_element + 1);
            var texte_rev = document.getElementById(id_svg_rectangle).getAttribute(nom_propriete);
            var obj1 = rev_texte_vers_matrice(texte_rev);
            var nouveau_rev='';
            if(obj1.status === true){
                var i=0;
                for(i=0;i < obj1.value.length;i++){
                    if((obj1.value[i][3] === 1) && (obj1.value[i][1] === 'transform_base_sur_svg')){
                        var tab = supprimer_un_element_de_la_matrice(obj1.value,(i - 1),0);
                        var obj2 = a2F1(tab,0,false,1,false);
                        if(obj2.status === true){
                            if(obj2.value !== ''){
                                obj2.value+=',';
                            }
                            obj2.value+=('(transform_base_sur_svg , transform(translate(' + document.getElementById(id_svg_element).getAttribute('decallage_x') + ',' + document.getElementById(id_svg_element).getAttribute('decallage_y') + ')) )');
                            document.getElementById(id_svg_rectangle).setAttribute(nom_propriete,obj2.value);
                        }else{
                            debugger;
                        }
                    }
                }
            }else{
                debugger;
            }
        }else if(type_element === 'table'){
            var id_svg_rectangle = (id_svg_element + 1);
            var texte_rev = document.getElementById(id_svg_rectangle).getAttribute(nom_propriete);
            var obj1 = rev_texte_vers_matrice(texte_rev);
            var nouveau_rev='';
            if(obj1.status === true){
                var i=0;
                for(i=0;i < obj1.value.length;i++){
                    if((obj1.value[i][3] === 1) && (obj1.value[i][1] === 'transform_table_sur_svg')){
                        var tab = supprimer_un_element_de_la_matrice(obj1.value,(i - 1),0);
                        var obj2 = a2F1(tab,0,false,1,false);
                        if(obj2.status === true){
                            if(obj2.value !== ''){
                                obj2.value+=',';
                            }
                            obj2.value+=('(transform_table_sur_svg , transform(translate(' + document.getElementById(id_svg_element).getAttribute('decallage_x') + ',' + document.getElementById(id_svg_element).getAttribute('decallage_y') + ')) )');
                            document.getElementById(id_svg_rectangle).setAttribute(nom_propriete,obj2.value);
                        }else{
                            debugger;
                        }
                    }
                }
            }else{
                debugger;
            }
        }
    }
    /*
      
      ====================================================================================================================
      function souris_haut
    */
    #souris_haut(e){
        var ecart_de_temps = ( new Date(Date.now()).getTime() - this.#debut_de_click);
        if(this.#souris_element_a_deplacer === 'base'){
            if(ecart_de_temps > 200){
//                console.log('ecart_de_temps=',ecart_de_temps,this.#souris_init_objet.x_final,this.#souris_init_objet.x);
                if((ecart_de_temps < 1500) && (this.#souris_init_objet.x_final === this.#souris_init_objet.x) && (this.#souris_init_objet.y_final === this.#souris_init_objet.y)){
                    this.#modale_modifier_la_base(e.target.parentNode);
                }else{
                    this.#maj_meta('base',this.#id_bdd_de_la_base_en_cours,this.#id_svg_de_la_base_en_cours,'donnees_rev_meta_de_la_base');
                }
            }
        }else if(this.#souris_element_a_deplacer === 'table'){
            /* si on a bougé une table, il faut remettre les positions des liens dans les svg_tableaux_des_references_amont_aval */
            if((this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours]) && (this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours].length > 0)){
                var i=0;
                for(i=0;i < this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours].length;i++){
                    var elem=this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours][i];
                    if(elem){
                        if(elem.id_svg_enfant_table === this.#souris_init_objet.id_svg_conteneur_table){
                            var ref_elem = document.getElementById(elem.id_du_path);
                            var tab = ref_elem.getAttribute('d').split(' ');
                            this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours][i].p1=[parseInt(tab[1],10),parseInt(tab[2],10)];
                        }
                        if(elem.id_svg_parent_table === this.#souris_init_objet.id_svg_conteneur_table){
                            var ref_elem = document.getElementById(elem.id_du_path);
                            var tab = ref_elem.getAttribute('d').split(' ');
                            this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours][i].p2=[parseInt(tab[8],10),parseInt(tab[9],10)];
                        }
                    }
                }
            }
            this.#svg_ajuster_la_largeur_de_la_base(this.#souris_init_objet.id_svg_de_la_base_en_cours);
            if(ecart_de_temps > 200){
                this.#maj_meta('table',this.#id_bdd_de_la_base_en_cours,this.#souris_init_objet.id_svg_conteneur_table,'meta_rev_de_la_table');
            }
        }else{
            if((ecart_de_temps > 200) && (ecart_de_temps < 1500)){
                if(e.target.nodeName.toLowerCase() === 'text'){
                    if(e.target.getAttribute('type_element') === "texte_de_nom_de_table"){
                        this.#modale_gerer_la_table(e.target.parentNode);
                    }else if(e.target.getAttribute('type_element') === "texte_de_champ"){
                        this.#modale_modifier_le_champ(e.target.parentNode);
                    }else if(e.target.getAttribute('type_element') === "texte_d_index"){
                        this.#modale_modifier_l_index(e.target.parentNode);
                    }
                }else if(e.target.nodeName.toLowerCase() === 'rect'){
                    if(e.target.getAttribute('type_element') === "rectangle_de_nom_de_table"){
                        this.#modale_gerer_la_table(e.target.parentNode);
                    }else if(e.target.getAttribute('type_element') === "rectangle_de_champ"){
                        this.#modale_modifier_le_champ(e.target.parentNode);
                    }else if(e.target.getAttribute('type_element') === "rectangle_d_index"){
                        this.#modale_modifier_l_index(e.target.parentNode);
                    }
                }
            }
        }
        /*
          
          maj de this.#id_bdd_de_la_base_en_cours avec id_bdd_de_la_base_en_cours de g
        */
        var element=e.target;
        var nom_tag = element.nodeName.toLowerCase();
        var parent=null;
        if(nom_tag !== 'html'){
            parent=element;
            while(nom_tag !== 'html'){
                if(nom_tag === 'g'){
                    if(element.getAttribute('id_bdd_de_la_base_en_cours')){
                        this.#id_bdd_de_la_base_en_cours=element.getAttribute('id_bdd_de_la_base_en_cours');
                    }
                }
                element=element.parentNode;
                nom_tag=element.nodeName.toLowerCase();
            }
        }
        this.#souris_element_a_deplacer='';
        this.#souris_init_objet.elem_bouge=null;
        this.#souris_init_objet.param_bouge={};
        this.#div_svg.style.userSelect='';
    }
    /*
      
      ====================================================================================================================
      function souris_bas
    */
    #souris_bas(e){
        this.#souris_init_objet={x:e[this.#propriete_pour_deplacement_x],y:e[this.#propriete_pour_deplacement_y],x_final:e[this.#propriete_pour_deplacement_x],y_final:e[this.#propriete_pour_deplacement_y]};
        this.#souris_element_a_deplacer='';
        this.#debut_de_click= new Date(Date.now()).getTime();
        var tar=e.target;
        /*
          
          que clique-t-on ?
        */
        if(tar.tagName.toLowerCase() === 'svg'){
            /*
              
              si on bouge toute la zone svg, il faut modifier le viewbox 
            */
            this.#souris_init_objet.elem_bouge=tar;
            this.#souris_init_objet.param_bouge={x:tar.viewBox.baseVal.x,y:tar.viewBox.baseVal.y};
            this.#souris_element_a_deplacer='svg';
            this.#div_svg.style.userSelect='none';
        }else{
            /* sinon, on recherche l'élément parent de type g pour modifier le translate si c'est une table ou une base */
            if(tar.getAttribute('type_element')){
                if(tar.getAttribute('type_element') === 'rectangle_de_base'){
                    var valeur_translate = tar.parentNode.getAttribute('transform').replace(/translate\(/g,'').replace(/\)/g,'').split(',');
                    this.#souris_init_objet.id_svg_conteneur_base=tar.parentNode.id;
                    this.#souris_init_objet.elem_bouge=tar.parentNode;
                    this.#souris_init_objet.param_bouge={'x':parseFloat(valeur_translate[0]),'y':parseFloat(valeur_translate[1])};
                    this.#souris_element_a_deplacer='base';
                    this.#div_svg.style.userSelect='none';
                    this.#id_svg_de_la_base_en_cours=parseInt(tar.getAttribute('id_svg_de_la_base_en_cours'),10);
                    this.#id_bdd_de_la_base_en_cours=parseInt(tar.getAttribute('id_bdd_de_la_base_en_cours'),10);
                }else if(tar.getAttribute('type_element') === 'rectangle_de_nom_de_table'){
                    this.#id_svg_de_la_base_en_cours=parseInt(tar.getAttribute('id_svg_de_la_base_en_cours'),10);
                    this.#id_bdd_de_la_base_en_cours=parseInt(tar.getAttribute('id_bdd_de_la_base_en_cours'),10);
                }
                return;
            }else{
                if((tar.tagName.toLowerCase() === 'tspan') && (tar.getAttribute('id_svg_conteneur_table'))){
                    var par = document.getElementById(tar.getAttribute('id_svg_conteneur_table'));
                    var valeur_translate = par.getAttribute('transform').replace(/translate\(/g,'').replace(/\)/g,'').split(',');
                    this.#souris_init_objet.id_svg_conteneur_table=parseInt(tar.getAttribute('id_svg_conteneur_table'),10);
                    this.#souris_init_objet.elem_bouge=par;
                    this.#souris_init_objet.param_bouge={'x':parseFloat(valeur_translate[0]),'y':parseFloat(valeur_translate[1])};
                    this.#souris_init_objet.id_bdd_de_la_base_en_cours=tar.getAttribute('id_bdd_de_la_base_en_cours');
                    this.#souris_init_objet.id_svg_de_la_base_en_cours=tar.getAttribute('id_svg_de_la_base_en_cours');
                    this.#souris_element_a_deplacer='table';
                    this.#div_svg.style.userSelect='none';
                    this.#id_svg_de_la_base_en_cours=parseInt(tar.getAttribute('id_svg_de_la_base_en_cours'),10);
                    this.#id_bdd_de_la_base_en_cours=parseInt(tar.getAttribute('id_bdd_de_la_base_en_cours'),10);
                    if(isNaN(this.#id_svg_de_la_base_en_cours)){
                        debugger;
                    }
                    return;
                }else{
                    /* on remonte la chaine pour voir si on est dans le svg */
                    var a=e.target;
                    while(a.tagName.toLowerCase() !== 'html'){
                        if((a.tagName.toLowerCase === 'g') && (a.getAttribute('type_element')) && (a.getAttribute('type_element') === "conteneur_de_base")){
                            this.#id_svg_de_la_base_en_cours=parseInt(a.getAttribute('id_svg_de_la_base_en_cours'),10);
                            this.#id_bdd_de_la_base_en_cours=parseInt(a.getAttribute('id_bdd_de_la_base_en_cours'),10);
                            if(isNaN(this.#id_svg_de_la_base_en_cours)){
                                debugger;
                            }
                            console.log('pas svg de base');
                            debugger;
                            return;
                        }
                        a=a.parentNode;
                    }
                }
            }
        }
    }
    /*
      
      ========================================================================================================
      affichage de l'arbre svg en récursif
      le tableau tab contient 
      { "type":"g"    , "id":-1  ,  "id_parent":-2  ,  "proprietes": {...} },
      { "type":"rect" , "id": 0  ,  "id_parent":-1  ,  "proprietes": {...} },
      { "type":"g"    , "id": 3  ,  "id_parent":-1  ,  "proprietes": {...} },
      { "type":"rect" , "id": 4  ,  "id_parent": 3  ,  "proprietes": {...} ,"data-type":"table" }   
      
      
      function recursuf_arbre_svg
    */
    #recursuf_arbre_svg(tab,id_parent,commencer_a,avec_index,element_parent,position){
        var str='';
        var l01=tab.length;
        var temp='';
        var ne_pas_prendre=false;
        var i=commencer_a;
        for(i=commencer_a;i < l01;i++){
            if(tab[i] === null){
                continue;
            }
            if(tab[i].id_parent === id_parent){
                var le_typa=tab[i].type;
                if(le_typa === 'g'){
                    if(avec_index === true){
                        if(tab[i].proprietes.type_element === 'conteneur_d_index'){
                            var g = document.createElementNS("http://www.w3.org/2000/svg","g");
                            var j={};
                            for(j in tab[i].proprietes){
                                g.setAttribute(j,tab[i].proprietes[j]);
                            }
                            g.setAttribute('transform',('translate(' + tab[i].proprietes['decallage_x'] + ',' + position + ')'));
                            g.setAttribute('translate_y',position);
                            element_parent.appendChild(g);
                            this.#recursuf_arbre_svg(tab,i,(i + 1),avec_index,g,position);
                        }
                    }else{
                        ne_pas_prendre=false;
                        temp='<g';
                        var j={};
                        for(j in tab[i].proprietes){
                            temp+=(' ' + j + '="' + tab[i].proprietes[j] + '"');
                            if((avec_index === false) && (j === 'type_element') && (tab[i].proprietes[j] === 'conteneur_d_index')){
                                ne_pas_prendre=true;
                            }
                        }
                        if( !(ne_pas_prendre)){
                            temp+='>';
                            temp+=this.#recursuf_arbre_svg(tab,i,(i + 1),avec_index,position);
                            temp+='</g>';
                            str+=temp;
                        }
                    }
                }else{
                    if(avec_index === true){
                        var e = document.createElementNS("http://www.w3.org/2000/svg",le_typa);
                        var j={};
                        for(j in tab[i].proprietes){
                            e.setAttribute(j,tab[i].proprietes[j]);
                        }
                        if(tab[i].hasOwnProperty('contenu')){
                            e.innerHTML=tab[i].contenu;
                        }
                        element_parent.appendChild(e);
                    }else{
                        str+=('<' + le_typa);
                        var j={};
                        for(j in tab[i].proprietes){
                            if(typeof tab[i].proprietes[j] === 'string'){
                                str+=(' ' + j + '="' + tab[i].proprietes[j].replace(/"/g,'&quot;') + '"');
                            }else{
                                str+=(' ' + j + '="' + tab[i].proprietes[j] + '"');
                            }
                        }
                        if(tab[i].hasOwnProperty('contenu')){
                            str+=('>' + tab[i].contenu + '</' + le_typa + '>');
                        }else{
                            str+=' />';
                        }
                    }
                }
            }
        }
        return str;
    }
    /*
      
      ========================================================================================================
      function dessiner_le_svg
      pour les champs d'indexes <circle cx="-1" cy="10" r="2" stroke="rgb(0, 0, 0)" stroke-width="1" fill="yellowgreen" transform=""></circle>
    */
    #dessiner_le_svg(){
        var str='';
        /*
          
          pour chaque référence de base
        */
        var tableau_svg = [];
        var i={};
        for(i in this.#arbre){
            var tab = JSON.parse(JSON.stringify(this.#arbre[i].arbre_svg));
            /*
              
              il faut trouver le premier élément non null du tableau
              puis on dessine l'arbre sans les index car on a pu
              ajouter des champs après avoir mis les index
              
            */
            var j=0;
            for(j=0;j < tab.length;j++){
                if(tab[j] !== null){
                    str+=this.#recursuf_arbre_svg(tab,-1,j,false);
                    tableau_svg.push(j);
                    break;
                }
            }
        }
        /*
          
          insertion du svg 
        */
        this.#svg_dessin.innerHTML=str;
        
        var liste_des_tables_deja_faites=[];
        
        var i={};
        for(i in this.#arbre){
            var tab = JSON.parse(JSON.stringify(this.#arbre[i].arbre_svg));
            /*
              
              insertion des index dans le svg 
            */
            var j=0;
            for(j=0;j < tab.length;j++){
                if(tab[j] !== null){
                    if((tab[j].proprietes.type_element) && (tab[j].proprietes.type_element === 'conteneur_d_index')){
                        var deja_fait=false;
                        for(var nb1=0;nb1<liste_des_tables_deja_faites.length;nb1++){
                         if(liste_des_tables_deja_faites[nb1]===tab[j].id_parent){
                          deja_fait=true;
                          break;
                         }
                        }
                        if(deja_fait===false){
                         var conteneur_de_table = this.#svg_dessin.getElementById(tab[j].id_parent);
                         var nombre_elements=conteneur_de_table.childNodes.length;
                         var position = ((((nombre_elements - 1)) * this.#hauteur_de_boite_affichage) + this.#taille_bordure);
                         this.#recursuf_arbre_svg(tab,tab[j].id_parent,j,true,conteneur_de_table,position);
                         liste_des_tables_deja_faites.push(tab[j].id_parent);
                        }
                    }
                }
            }
            /*
              
              ajustement de la largeur et de la hauteur des tables 
            */
            var j=0;
            for(j=0;j < tab.length;j++){
                if(tab[j] !== null){
                    if((tab[j].proprietes.type_element) && (tab[j].proprietes.type_element === 'conteneur_de_table')){
                        this.#svg_ajuster_la_largeur_des_boites_de_la_table([tab[j].id,tab[j].proprietes.id_bdd_de_la_base_en_cours]);
                    }
                }
            }
        }
        var i={};
        for(i in tableau_svg){
            this.#svg_ajuster_la_largeur_de_la_base(tableau_svg[i]);
        }
    }
    /*
      
      ========================================================================================================
      function ajuster_largeur_de_boite
    */
    #ajuster_largeur_de_boite(largeur_de_la_boite,texte){
        var a = document.createElementNS("http://www.w3.org/2000/svg",'text');
        a.innerHTML=texte;
        a.setAttribute('x',10);
        a.setAttribute('y',20);
        this.#svg_dessin.appendChild(a);
        var b = a.getBBox();
        if(largeur_de_la_boite < (b.width + 2)){
            largeur_de_la_boite=(parseInt(b.width,10) + (2 * this.#taille_bordure));
        }
        a.remove();
        return largeur_de_la_boite;
    }
    
    /*
      ========================================================================================================
      on parcours l'arbre svg pour reconstruire le rev
      function creer_rev_de_la_base_a_partir_de_svg
    */
    #creer_rev_de_la_base_a_partir_de_svg(id_bdd_de_la_base){
        var t='';
        var lst = document.getElementsByTagName('g');
        var racine_du_svg=null;
        var i=0;
        for(i=0;i < lst.length;i++){
            if((lst[i].getAttribute('id_bdd_de_la_base_en_cours')) && (parseInt(lst[i].getAttribute('id_bdd_de_la_base_en_cours'),10) === id_bdd_de_la_base)){
                racine_du_svg=lst[i];
                break;
            }
        }
        if(racine_du_svg === null){
            
            return logerreur({status:false,message:'2670 il y a eu un problème lors de la récupération de l\'arbre svg'});
        }
        this.#id_svg_de_la_base_en_cours=parseInt(racine_du_svg.getAttribute('id_svg_de_la_base_en_cours'),10);
        /*
          
          ce sont les rectangles qui contiennent les informations sur la base
        */
        lst=racine_du_svg.getElementsByTagName('rect');
        var i=0;
        for(i=0;i < lst.length;i++){
            if((lst[i].getAttribute('type_element')) && (lst[i].getAttribute('type_element') == 'rectangle_de_base')){
                t+=('\nmeta(' + lst[i].getAttribute('donnees_rev_meta_de_la_base') + '\n),');
                t+='\n#(';
                t+='\n  ================';
                t+='\n  liste des tables';
                t+='\n  ================';
                t+='\n),';
            }else if((lst[i].getAttribute('type_element')) && (lst[i].getAttribute('type_element') == 'rectangle_de_table')){
             

                t+=this.#creer_definition_table_en_rev(lst[i]);
             
            }else if((lst[i].getAttribute('type_element')) && (lst[i].getAttribute('type_element') == 'rectangle_d_index')){
                t+=('\nadd_index(' + lst[i].getAttribute('donnees_rev_de_l_index') + ')');
            }
        }
        return {status:true, value:t};        
    }
    
    /*
      ========================================================================================================
      function sauvegarder_la_base
    */
    sauvegarder_la_base(id_bdd_de_la_base){
        var t='';
        this.#id_bdd_de_la_base_en_cours=parseInt(id_bdd_de_la_base,10);
        clearMessages('zone_global_messages');
        var obj=this.#creer_rev_de_la_base_a_partir_de_svg(this.#id_bdd_de_la_base_en_cours);
        if(obj.status===true){
            t=obj.value;
        }else{
            displayMessages('zone_global_messages');
            alert('Problème sur la sauvegarde de la base ');
            return;
        }

        async function envoyer_le_rev_de_le_base_en_post(url="",donnees,that){
            return that.#recupérer_un_fetch(url,donnees);
        }
        var ajax_param={'call':{'lib':'core','file':'bdd','funct':'envoyer_le_rev_de_le_base_en_post'},source_rev_de_la_base:t,id_bdd_de_la_base:this.#id_bdd_de_la_base_en_cours};
        envoyer_le_rev_de_le_base_en_post('za_ajax.php?envoyer_le_rev_de_le_base_en_post',ajax_param,this).then((donnees) => {
            if(donnees.status === 'OK'){
               logerreur({status:true,message:' Le schema de la base est sauvegardé'});
            }else{
               console.log(donnees);
               if(donnees.hasOwnProperty('messages')){
                   if(typeof donnees.messages === 'object' && !Array.isArray(donnees.messages) && donnees.messages !== null ){
                       for(var i in donnees.messages){
                           logerreur({status:false,message:donnees.messages[i]});
                       }
                   }
               }
               logerreur({status:false,message:' il y a eu un problème lors de la sauvegarde de la base'});
            }
            displayMessages('zone_global_messages');
        });
    }
    /*
      
      ========================================================================================================
      function ajouter_table_a_svg
    */
    #ajouter_table_a_svg(nom_de_la_table,indice_courant,position_de_la_table,meta_rev_de_la_table){
        /*
          
          conteneur de la table
        */
        var id_svg_conteneur_table=indice_courant;
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={type:'g',id:indice_courant,id_parent:this.#id_svg_de_la_base_en_cours,'proprietes':{id:indice_courant,type_element:'conteneur_de_table',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_bdd_de_la_base_en_cours:this.#id_bdd_de_la_base_en_cours,id_svg_conteneur_table:id_svg_conteneur_table,nom_de_la_table:nom_de_la_table,decallage_x:position_de_la_table[0],decallage_y:position_de_la_table[1],'transform':('translate(' + position_de_la_table[0] + ',' + position_de_la_table[1] + ')')}};
        indice_courant++;
        /*
          
          rectangle de la table
        */
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={type:'rect','data-type':'table',id:indice_courant,id_parent:id_svg_conteneur_table,'proprietes':{id:indice_courant,type_element:'rectangle_de_table',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_svg_conteneur_table:id_svg_conteneur_table,nom_de_la_table:nom_de_la_table,x:0,y:0,width:20,height:50,'style':("stroke:blue;stroke-width:" + this.#taille_bordure + ";fill:yellow;fill-opacity:1;"),meta_rev_de_la_table:meta_rev_de_la_table}};
        return({indice_svg_rectangle:indice_courant,id_svg_conteneur_table:id_svg_conteneur_table});
    }
    /*
      
      ========================================================================================================
      function ajouter_nom_de_table_au_svg
    */
    #ajouter_nom_de_table_au_svg(nom_de_la_table,indice_courant,id_svg_conteneur_table,largeur_de_la_boite){
        var id_svg_champ_en_cours=indice_courant;
        var id_svg_rectangle_du_nom_de_la_table=0;
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={
         /* */
         type:'g',id:indice_courant,id_parent:id_svg_conteneur_table,
         'proprietes':{
            /* */
            id:indice_courant,type_element:'conteneur_de_nom_de_table',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_bdd_de_la_base_en_cours:this.#id_bdd_de_la_base_en_cours,id_svg_conteneur_table:id_svg_conteneur_table,id_svg_champ_en_cours:id_svg_champ_en_cours,nom_de_la_table:nom_de_la_table,decallage_x:this.#taille_bordure,decallage_y:this.#taille_bordure,'transform':('translate(' + this.#taille_bordure + ',' + this.#taille_bordure + ')')}};
        indice_courant++;
        /*
          
          rectangle du nom de la table
          
        */
        id_svg_rectangle_du_nom_de_la_table=indice_courant;
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={type:'rect',id:indice_courant,'id_parent':(indice_courant - 1),'proprietes':{id:indice_courant,type_element:'rectangle_de_nom_de_table',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_bdd_de_la_base_en_cours:this.#id_bdd_de_la_base_en_cours,id_svg_conteneur_table:id_svg_conteneur_table,id_svg_champ_en_cours:id_svg_champ_en_cours,nom_de_la_table:nom_de_la_table,x:0,y:0,width:18,height:this.#hauteur_de_boite,'style':("stroke:white;stroke-width:" + this.#taille_bordure + ";fill:red;fill-opacity:1;")}};
        indice_courant++;
        /*
          
          texte du nom de la table
        */
        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={type:'text',id:indice_courant,'id_parent':(indice_courant - 2),'contenu':('<tspan style="cursor:move;" id_svg_conteneur_table="' + id_svg_conteneur_table + '" id_bdd_de_la_base_en_cours="' + this.#id_bdd_de_la_base_en_cours + '" id_svg_de_la_base_en_cours="' + this.#id_svg_de_la_base_en_cours + '">🟥</tspan>' + nom_de_la_table),'proprietes':{id:indice_courant,type_element:'texte_de_nom_de_table',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_bdd_de_la_base_en_cours:this.#id_bdd_de_la_base_en_cours,id_svg_conteneur_table:id_svg_conteneur_table,id_svg_champ_en_cours:id_svg_champ_en_cours,nom_de_la_table:nom_de_la_table,x:this.#taille_bordure,'y':(this.#hauteur_de_boite - (0.3 * CSS_TAILLE_REFERENCE_TEXTE) - this.#taille_bordure),style:"fill:white;cursor:context-menu;"}};
        indice_courant++;
        largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,(nom_de_la_table + '🟥'));
        return({largeur_de_la_boite:largeur_de_la_boite,id_svg_rectangle_du_nom_de_la_table:id_svg_rectangle_du_nom_de_la_table});
    }
    /*
      
      ===============================================================================================================================================
      function ajouter_champ_a_arbre
    */
    #ajouter_champ_a_arbre(nom_du_champ,indice_courant,id_svg_conteneur_table,nom_de_la_table,id_bdd_de_la_base,donnees_rev_du_champ){
        var id_svg_parent_table=-1;
        var id_svg_parent_champ=-1;
        var nom_parent_table='';
        var nom_parent_champ='';
        var a_des_references=false;
        var id_svg_champ_en_cours=indice_courant;
        /*
          
          création de la boite du champ
          
          conteneur du nom du champ svg_tableaux_des_references_amont_aval
        */
        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={type:'g',id:indice_courant,id_parent:id_svg_conteneur_table,'proprietes':{id:indice_courant,type_element:'conteneur_de_champ',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_svg_conteneur_table:id_svg_conteneur_table,id_svg_champ_en_cours:id_svg_champ_en_cours,nom_de_la_table:nom_de_la_table,nom_du_champ:nom_du_champ,decallage_x:this.#taille_bordure,decallage_y:0,transform:'translate(0,0)'}};
        indice_courant++;
        /*
          
          rectangle du nom du champ
        */
        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={type:'rect',id:indice_courant,'id_parent':(indice_courant - 1),'proprietes':{id:indice_courant,type_element:'rectangle_de_champ',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_svg_conteneur_table:id_svg_conteneur_table,id_svg_champ_en_cours:id_svg_champ_en_cours,nom_de_la_table:nom_de_la_table,nom_du_champ:nom_du_champ,x:0,y:0,width:18,height:this.#hauteur_de_boite,'style':("stroke:gold;stroke-width:" + this.#taille_bordure + ";fill:pink;fill-opacity:0.2;"),donnees_rev_du_champ:donnees_rev_du_champ}};
        indice_courant++;
        var indice_du_champ = (indice_courant - 1);
        var objrev={status:false};
        var tabrev = [];
        var couleur_nom_de_champ='navy';
        var non_nulle=false;
        if(donnees_rev_du_champ !== ''){
            objrev=functionToArray(donnees_rev_du_champ,true,false,'');
            if(objrev.status === true){
                tabrev=objrev.value;
            }else{
                logerreur({status:false,message:'2653'});
            }
            var o=1;
            for(o=1;o < tabrev.length;o++){
                if((tabrev[o][7] === 0) && (tabrev[o][1] === 'primary_key') && (tabrev[o][2] === 'f')){
                    couleur_nom_de_champ='red';
                }
                if((tabrev[o][7] === 0) && (tabrev[o][1] === 'non_nulle') && (tabrev[o][2] === 'f')){
                    non_nulle=true;
                }
            }
        }
        /*
          
          texte du nom du champ
        */
        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={type:'text',id:indice_courant,'id_parent':(indice_courant - 2),contenu:nom_du_champ,'proprietes':{id:indice_courant,type_element:'texte_de_champ',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_svg_conteneur_table:id_svg_conteneur_table,id_svg_champ_en_cours:id_svg_champ_en_cours,nom_de_la_table:nom_de_la_table,nom_du_champ:nom_du_champ,x:this.#taille_bordure,'y':(this.#hauteur_de_boite - (0.3 * CSS_TAILLE_REFERENCE_TEXTE) - this.#taille_bordure),'style':("fill:" + couleur_nom_de_champ + ";")}};
        indice_courant++;
        if(donnees_rev_du_champ !== ''){
            /*
              
              on va chercher les références croisées de ce champ
            */
            var o=1;
            for(o=1;o < tabrev.length;o++){
                if(tabrev[o][7] === 0){
                    if(('references' === tabrev[o][1]) && (tabrev[o][8] === 2)){
                        a_des_references=true;
                        var i={};
                        for(i in this.#arbre[id_bdd_de_la_base].arbre_svg){
                            var elem=this.#arbre[id_bdd_de_la_base].arbre_svg[i];
                            if(elem===null){
                                continue;
                            }
                            if(elem.proprietes && elem.proprietes.type_element && (elem.proprietes.type_element === 'conteneur_de_table') && (elem.proprietes.nom_de_la_table === tabrev[(o + 1)][1])){
                                id_svg_parent_table=parseInt(elem.proprietes.id,10);
                            }
                            if((elem.proprietes.type_element === 'conteneur_de_champ') && (elem.proprietes.id_svg_conteneur_table === id_svg_parent_table) && (elem.proprietes.nom_du_champ === tabrev[(o + 2)][1])){
                                id_svg_parent_champ=parseInt(elem.proprietes.id,10);
                            }
                            if((id_svg_parent_champ >= 0) && (id_svg_parent_table >= 0)){
                                break;
                            }
                        }
                        nom_parent_table=tabrev[(o + 1)][1];
                        nom_parent_champ=tabrev[(o + 2)][1];
                    }
                }
            }
        }
        if(a_des_references === true){
            /*
              
              attention , si id_svg_parent_table ==0 id_svg_parent_champ===0
              il faudra les mettre à jour après avoir chargé toutes les tables
              ajouter_champ_a_arbre
            */
            var p1 = [50,50];
            var p2 = [0,0];
            this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base].push({id_bdd_de_la_base_en_cours:this.#id_bdd_de_la_base_en_cours,id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,id_svg_parent_table:id_svg_parent_table,id_svg_parent_champ:id_svg_parent_champ,id_svg_enfant_table:id_svg_conteneur_table,id_svg_enfant_champ:id_svg_champ_en_cours,nom_enfant_table:nom_de_la_table,nom_enfant_champ:nom_du_champ,nom_parent_table:nom_parent_table,nom_parent_champ:nom_parent_champ,id_du_path:indice_courant,p1:p1,p2:p2});
            /*
              
              <path d=" M -63 -9 C 53 -6 132 71 176 31 " stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform=""></path>
            */
            var d = ('M ' + parseInt(p1[0],10) + ' ' + parseInt(p1[1],10) + ' C ' + parseInt((p1[0] - 30),10) + ' ' + parseInt(p1[1],10) + ' ' + parseInt((p2[0] + 30),10) + ' ' + parseInt(p2[1],10) + ' ' + parseInt(p2[0],10) + ' ' + parseInt(p2[1],10));
            
            var couleur_du_lien='hotpink';
            if(non_nulle===false){
             couleur_du_lien='pink';
            }
            /*
            le parent d'un lien appartient à la base et non pas à id_svg_champ_en_cours
            */
            this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={type:'path',id:indice_courant,id_parent:this.#id_svg_de_la_base_en_cours,'proprietes':{
                    id:indice_courant,
                    d:d,
                    type_element:'reference_croisée',
                    id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,
                    id_svg_parent_table:id_svg_parent_table,
                    id_svg_parent_champ:id_svg_parent_champ,
                    id_svg_enfant_table:id_svg_conteneur_table,
                    id_svg_enfant_champ:id_svg_champ_en_cours,
                    nom_parent_table:nom_parent_table,
                    nom_parent_champ:nom_parent_champ,
                    /*
                      
                      nom_enfant_table           : nom_de_la_table         ,
                      nom_enfant_champ           : nom_du_champ            ,
                      nom_parent_table           : nom_parent_table        ,
                      nom_parent_champ           : nom_parent_champ        ,
                    */
                    'style':('stroke:'+couleur_du_lien+';stroke-width:' + (this.#taille_bordure * 3) + ';fill:transparent;stroke-opacity:0.7;stroke-linejoin:round;stroke-linecap:round;')
                }};
            indice_courant++;
        }
        return({indice_du_champ:indice_du_champ,id_svg_champ_en_cours:id_svg_champ_en_cours,indice_courant:indice_courant});
    }

    /*
      ========================================================================================================
      function ajouter_index_a_table
    */
    #ajouter_index_a_table(id_bdd_de_la_base,indice_courant,nom_de_l_index,id_svg_conteneur_table,nom_de_la_table,donnees_rev_de_l_index){

        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
         type:'g',
         id:indice_courant,
         id_parent:id_svg_conteneur_table,
         'proprietes':{
          id:indice_courant,
          type_element:'conteneur_d_index',
          id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,
          id_svg_conteneur_table:id_svg_conteneur_table,
          nom_de_la_table_pour_l_index:nom_de_la_table,
          decallage_x:0, //this.#taille_bordure,
          decallage_y:0,
          'transform':'translate(0,0)',
         }
        };
        indice_courant++;
        
        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
          type:'rect',
          id:indice_courant,
          'id_parent':(indice_courant - 1),
          'proprietes':{
           id:indice_courant,
           type_element:'rectangle_d_index',
           id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,
           id_svg_conteneur_table:id_svg_conteneur_table,
           nom_de_la_table_pour_l_index:nom_de_la_table,
           nom_de_l_index:nom_de_l_index,
           donnees_rev_de_l_index:donnees_rev_de_l_index,
           x:0,
           y:0,
           width:18,
           height:this.#hauteur_de_boite,
           'style':("stroke:green;stroke-width:" + this.#taille_bordure + ";fill:green;fill-opacity:0.2;")
          }
        };
        indice_courant++;
        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
         type:'text',
         id:indice_courant,
         id_parent:(indice_courant - 2),
         contenu:nom_de_l_index,
         proprietes:{
          id:indice_courant,
          type_element:'texte_d_index',
          id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,
          id_svg_conteneur_table:id_svg_conteneur_table,
          nom_de_la_table_pour_l_index:nom_de_la_table,
          x:this.#taille_bordure,
          'y':(this.#hauteur_de_boite - (0.3 * CSS_TAILLE_REFERENCE_TEXTE) - this.#taille_bordure),
          style:"fill:green;"
         }
        };
        indice_courant++;
        
        
        
        return {indice_courant:indice_courant};
    }
    
    /*
      ========================================================================================================
      function ajouter_table_et_index_a_arbre
    */
    #ajouter_table_et_index_a_arbre( tab , id_tab_table_en_cours , indice_courant , id_bdd_de_la_base , nom_de_la_table_a_utiliser=null ){
     
        var l01=tab.length;
        var id_svg_champ_en_cours=0;
        var nom_de_la_table='';
        var id_svg_conteneur_table=0;
        var position_gauche_de_la_table=0;
        var position_haut_de_la_table=0;
        var largeur_de_la_boite=1;
        var nom_du_champ='';
        var indice_du_champ=0;
        var nom_de_l_index='';
        var i=0;
        var k=0;
        var l=0;
        var indice_matr=id_tab_table_en_cours;
        /*
          =======================================================================
          début rechercher le nom de la table pour créer le conteneur et la boite
          =======================================================================
        */
        for(i=(id_tab_table_en_cours + 1);(i < l01) && (tab[i][3] > tab[id_tab_table_en_cours][3]);i++){
            if(tab[i][7] === id_tab_table_en_cours){
                if('nom_de_la_table' === tab[i][1]){
                    if(nom_de_la_table_a_utiliser!==null){
                        nom_de_la_table=nom_de_la_table_a_utiliser;
                    }else{
                        nom_de_la_table=tab[(i + 1)][1];
                    }
                    id_svg_conteneur_table=indice_courant;
                    var position_de_la_table = [0,0];
                    /*
                      
                      ======================
                      recherche des meta
                      ======================
                    */
                    var meta_de_la_table='';
                    var tt = [0,0];
                    for(l=(indice_matr + 1);(l < l01) && (tab[l][3] > tab[indice_matr][3]);l++){
                        if((tab[l][1] === 'meta') && (tab[l][2] === 'f')){
                            for(k=(l + 1);(k < l01) && (tab[k][3] > tab[l][3]);k++){
                                if(tab[k][1] === 'transform_table_sur_svg'){
                                    for(i=(k + 1);(i < l01) && (tab[i][3] >= tab[k][3]);i++){
                                        if((tab[i][1] === 'transform') && (tab[i][2] === 'f')){
                                            for(j=(i + 1);(j < l01) && (tab[j][3] > tab[i][3]);i++){
                                                if((tab[j][1] === 'translate') && (tab[j][2] === 'f')){
                                                    if(tab[j][8] === 2){
                                                        tt[0]=parseInt(tab[(j + 1)][1]);
                                                        if(isNaN(tt[0])){
                                                            tt[0]=0;
                                                        }
                                                        tt[1]=parseInt(tab[(j + 2)][1]);
                                                        if(isNaN(tt[1])){
                                                            tt[1]=0;
                                                        }
                                                        tab[(j + 1)][1]=tt[0];
                                                        tab[(j + 2)][1]=tt[1];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            var obj1 = a2F1(tab,l,false,(l + 1),false);
                            if(obj1.status === true){
                                meta_de_la_table=obj1.value;
                            }else{
                                debugger;
                            }
                            break;
                        }
                    }
                    if(meta_de_la_table === ''){
                        meta_de_la_table=('(table , \'' + nom_de_la_table.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),');
                        meta_de_la_table+=('(nom_long_de_la_table , \'à faire ' + nom_de_la_table.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),');
                        meta_de_la_table+=('(nom_court_de_la_table , \'à faire ' + nom_de_la_table.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),');
                        meta_de_la_table+=('(nom_bref_de_la_table , \'à faire ' + nom_de_la_table.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'') + '\'),');
                        meta_de_la_table+=(',(transform_table_sur_svg,translate(' + tt[0] + ',' + tt[1] + '))');
                    }
                    if(meta_de_la_table.indexOf('transform_table_sur_svg') < 0){
                        meta_de_la_table+=('(transform_table_sur_svg,translate(' + tt[0] + ',' + tt[1] + '))');
                    }
                    var a = this.#ajouter_table_a_svg(nom_de_la_table,indice_courant,tt,meta_de_la_table);
                    indice_courant+=2;
                    id_svg_conteneur_table=a.id_svg_conteneur_table;
                    position_gauche_de_la_table=parseFloat(tt[0]);
                    position_haut_de_la_table=parseFloat(tt[1]);
                    id_svg_champ_en_cours=indice_courant;
                    var a = this.#ajouter_nom_de_table_au_svg(nom_de_la_table,indice_courant,id_svg_conteneur_table,largeur_de_la_boite);
                    indice_courant+=3;
                    largeur_de_la_boite=a.largeur_de_la_boite;
                }
            }
        }
        /*
          
          ================
          ajout des champs
          ================
        */
        /* on met les champs de la table  */
        var k = (id_tab_table_en_cours + 1);
        for(k=(id_tab_table_en_cours + 1);(k < l01) && (tab[k][3] > tab[id_tab_table_en_cours][3]);k++){
            if((tab[k][7] === id_tab_table_en_cours) && (tab[k][1] === 'fields')){
                
                for(l=(k + 1);(l < l01) && (tab[l][3] > tab[k][3]);l++){
                    if(tab[l][7] === k){
                        if(tab[l][1] == 'field'){
                            var m = (l + 1);
                            for(m=(l + 1);(m < l01) && (tab[m][3] > tab[l][3]);m++){
                                if(tab[m][7] === l){
                                    if(tab[m][1] === 'nom_du_champ'){
                                        /*
                                          
                                          on recherche le nom du champ pour créer le conteneur et le cadre
                                        */
                                        nom_du_champ=tab[(m + 1)][1];
                                        var obj1 = a2F1(tab,l,false,(l + 1),false);
                                        if(obj1.status === true){
                                            var donnees_rev_du_champ=obj1.value;
                                        }else{
                                            logerreur({status:true,'message':('0849 problème sur les données du champ "' + nom_du_champ + '"')});
                                            displayMessages('zone_global_messages');
                                            return;
                                        }
                                        var a = this.#ajouter_champ_a_arbre(nom_du_champ,indice_courant,id_svg_conteneur_table,nom_de_la_table,id_bdd_de_la_base,donnees_rev_du_champ);
                                        id_svg_champ_en_cours=a.id_svg_champ_en_cours;
                                        indice_du_champ=a.indice_du_champ;
                                        indice_courant=a.indice_courant;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        /*
          
          fin du create table
          on a un nom de table : nom_de_la_table
          on recherche les index qui pointent sur la table en cours
        */
        
        for(i=1;i < l01;i++){
            if((tab[i][7] === 0) && (tab[i][1] === 'add_index')){
                var j = (i + 1);
                for(j=(i + 1);j < l01;j++){
                    if((tab[j][7] === i) && (tab[j][1] === 'nom_de_la_table_pour_l_index') && (tab[(j + 1)][1] === nom_de_la_table)){
                        var k = (i + 1);
                        for(k=(i + 1);(k < l01) && (tab[k][3] > tab[i][3]);k++){
                            if(tab[k][7] === i){
                                if('index_name' === tab[k][1]){
                                    nom_de_l_index=tab[(k + 1)][1];
                                    id_svg_champ_en_cours=indice_courant;
                                    /*
                                      
                                      création de la boite de l'index
                                    */
                                    largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_l_index);
                                    /*
                                      
                                      conteneur du nom de l'index
                                    */
                                    var donnees_rev_de_l_index='';
                                    var obj1 = a2F1(tab,i,false,(i + 1),false);
                                    if(obj1.status === true){
                                        donnees_rev_de_l_index=obj1.value;
                                    }else{
                                        logerreur({status:true,'message':('0849 problème sur les données de l\'index "' + nom_de_l_index + '"')});
                                        displayMessages('zone_global_messages');
                                    }
                                    
                                    var a =this.#ajouter_index_a_table(id_bdd_de_la_base,indice_courant,nom_de_l_index,id_svg_conteneur_table,nom_de_la_table,donnees_rev_de_l_index);
                                    indice_courant=a.indice_courant;
                                }
                            }
                        }
                    }
                }
            }
        }
        return( {status:true , indice_courant:indice_courant , id_svg_conteneur_table:id_svg_conteneur_table});
    }
    
    /*
      ========================================================================================================
      function modifier_les_references_des_liens
    */
    #modifier_les_references_des_liens(id_bdd_de_la_base){
        /*
          
          il faut mettre à jour les tableaux pour lesquels id_svg_parent_table et id_svg_parent_champ sont à zéro
          
          this.#svg_tableaux_des_references_amont_aval
          this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg_courant]={type:'path',
          
          car une table mère peut être déclarée après une table fille
          parent_nom_table:nom_parent_table,
          parent_nom_champ:nom_parent_champ,
          
        */
        var i={};
        for(i in this.#arbre[id_bdd_de_la_base].arbre_svg){
            if(this.#arbre[id_bdd_de_la_base].arbre_svg[i] && (this.#arbre[id_bdd_de_la_base].arbre_svg[i].proprietes.type_element === "reference_croisée") && (this.#arbre[id_bdd_de_la_base].arbre_svg[i].proprietes.id_svg_parent_champ === -1)){
                var j={};
                for(j in this.#arbre[id_bdd_de_la_base].arbre_svg){
                    if((this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.type_element === "rectangle_de_champ") && (this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.nom_de_la_table === this.#arbre[id_bdd_de_la_base].arbre_svg[i].proprietes.nom_parent_table) && (this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.nom_du_champ === this.#arbre[id_bdd_de_la_base].arbre_svg[i].proprietes.nom_parent_champ)){
                        this.#arbre[id_bdd_de_la_base].arbre_svg[i].proprietes.id_svg_parent_champ=this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.id_svg_champ_en_cours;
                        this.#arbre[id_bdd_de_la_base].arbre_svg[i].proprietes.id_svg_parent_table=this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.id_svg_conteneur_table;
                        var k={};
                        for(k in this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base]){
                            if((this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base][k].nom_parent_champ === this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.nom_du_champ) && (this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base][k].nom_parent_table === this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.nom_de_la_table)){
                                this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base][k].id_svg_parent_champ=this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.id_svg_champ_en_cours;
                                this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base][k].id_svg_parent_table=this.#arbre[id_bdd_de_la_base].arbre_svg[j].proprietes.id_svg_conteneur_table;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    
    /*
      ========================================================================================================
      function charger_les_bases
    */
    #charger_les_bases_en_asynchrone(les_id_des_bases){
        async function recuperer_les_donnees_de_le_base_en_post(url="",donnees,that){
         
            return that.#recupérer_un_fetch(url,donnees);
            
        }
        var ajax_param={'call':{'lib':'core','file':'bdd','funct':'recuperer_zone_travail_pour_les_bases'},les_id_des_bases:les_id_des_bases};
        recuperer_les_donnees_de_le_base_en_post('za_ajax.php?recuperer_zone_travail_pour_les_bases',ajax_param,this).then((donnees) => {
            if(donnees.status !== 'OK'){
                console.log('donnees=',donnees)
                logerreur({status:false,message:donnees.message});
                logerreur({status:false,message:'0132 erreur de récupération des données de la base'});
                displayMessages('zone_global_messages');
            }else{
                var nouvel_arbre={};
                var i={};

                for(i in donnees.valeurs){
                    this.#arbre[donnees.valeurs[i]['T0.chi_id_basedd']]={'chp_rev_travail_basedd':donnees.valeurs[i]['T0.chp_rev_travail_basedd'],'arbre_svg':[],'chp_nom_basedd':donnees.valeurs[i]['T0.chp_nom_basedd']};
                    if((donnees.valeurs[i]['T0.chp_rev_travail_basedd'] === '') || (donnees.valeurs[i]['T0.chp_rev_travail_basedd'] === null)){
                        logerreur({status:false,message:'0803 le champ chp_rev_travail_basedd est vide [module_svg[charger_les_bases_en_asynchrone]]'});
                    }
                    if(donnees.valeurs[i]['T0.chp_rev_travail_basedd']===null || donnees.valeurs[i]['T0.chp_rev_travail_basedd']===''){
                    }else{
                        var obj1 = functionToArray(donnees.valeurs[i]['T0.chp_rev_travail_basedd'],true,false,'');
                        if(obj1.status === true){
                            this.#arbre[donnees.valeurs[i]['T0.chi_id_basedd']]['matrice']=obj1.value;
                        }else{
                            logerreur({status:false,message:'0126'});
                            displayMessages('zone_global_messages');
                            return;
                        }
                    }
                }
                var indice_svg_courant=0;
                var tableau_des_elements = [];
                var decallage_droite_table=10;
                var position_xy_table = [decallage_droite_table,10];
                var id_svg_conteneur_table=0;
                var id_tab_table_en_cours=0;
                var id_tab_champ_en_cours=0;
                var max_x=0;
                var max_y=0;
                var position_max_droite=0;
                var largeur_de_la_table=0;
                var tableau_des_references_croisees = [];
                var id_svg_rectangle_base_en_cours=0;
                var i=0;
                var j=0;
                var k=0;
                var l=0;
                var indice_matr=0;
                /*
                  svg_tableaux_des_references_amont_aval  
                  =============================
                  debut de pour chaque base 
                  =============================
                */
                var id_bdd_de_la_base={};
                for(id_bdd_de_la_base in this.#arbre){
                    this.#id_bdd_de_la_base_en_cours=id_bdd_de_la_base;
//                    largeur_de_la_boite=1;
                    this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base]=[];
                    this.#id_svg_de_la_base_en_cours=indice_svg_courant;
                    this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg_courant]={type:'g',id:this.#id_svg_de_la_base_en_cours,id_parent:-1,'proprietes':{type_element:'conteneur_de_base',id_bdd_de_la_base_en_cours:id_bdd_de_la_base,id:indice_svg_courant,id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,transform:'translate(0,0)',decallage_x:0,decallage_y:0}};
                    indice_svg_courant++;
                    id_svg_rectangle_base_en_cours=indice_svg_courant;
                    this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg_courant]={type:'rect',id:indice_svg_courant,id_parent:this.#id_svg_de_la_base_en_cours,'proprietes':{type_element:'rectangle_de_base',id_bdd_de_la_base_en_cours:id_bdd_de_la_base,id:indice_svg_courant,id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,x:0,y:0,width:120,height:120,'style':("stroke:red;stroke-width:" + this.#taille_bordure + ";fill:yellow;fill-opacity:0.2;")}};
                    indice_svg_courant++;
                    var id_conteneur_texte_base=indice_svg_courant;
                    this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg_courant]={type:'g',id:indice_svg_courant,id_parent:this.#id_svg_de_la_base_en_cours,'proprietes':{type_element:'conteneur_du_texte_de_la_base',id:indice_svg_courant,id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,transform:'translate(0,0)'}};
                    indice_svg_courant++;
                    this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg_courant]={type:'text',id:indice_svg_courant,'id_parent':(indice_svg_courant - 1),'contenu':('(' + id_bdd_de_la_base + ') ' + this.#arbre[id_bdd_de_la_base]['chp_nom_basedd'] + ' <a style="fill:green;" href="javascript:' + this.#nom_de_la_variable + '.sauvegarder_la_base(' + id_bdd_de_la_base + ')">sauvegarder</a>'),'proprietes':{id:indice_svg_courant,type_element:'texte_id_bdd_de_la_base',id_svg_de_la_base_en_cours:this.#id_svg_de_la_base_en_cours,x:this.#taille_bordure,'y':(this.#taille_bordure + CSS_TAILLE_REFERENCE_TEXTE),style:"fill:blue;"}};
                    indice_svg_courant++;
                    tableau_des_references_croisees=[];
                    var tab=[];
                    if(this.#arbre[id_bdd_de_la_base].hasOwnProperty('matrice')){
                        
                        tab = this.#arbre[id_bdd_de_la_base]['matrice'];
                    }
                    var l01=tab.length;
                    /*
                      
                      ======================================
                      recherche des meta de la base i
                      ======================================
                    */
                    var meta_de_la_base='';
                    var tt = [0,0];
                    for(indice_matr=1;indice_matr < l01;indice_matr++){
                        if((tab[indice_matr][3] === 0) && (tab[indice_matr][1] === 'meta') && (tab[indice_matr][2] === 'f')){
                            for(k=(indice_matr + 1);(k < l01) && (tab[k][3] > tab[indice_matr][3]);k++){
                                if(tab[k][1] === 'transform_base_sur_svg'){
                                    for(i=(k + 1);(i < l01) && (tab[i][3] >= tab[k][3]);i++){
                                        if((tab[i][1] === 'transform') && (tab[i][2] === 'f')){
                                            for(j=(i + 1);(j < l01) && (tab[j][3] > tab[i][3]);i++){
                                                if((tab[j][1] === 'translate') && (tab[j][2] === 'f')){
                                                    if(tab[j][8] === 2){
                                                        tt[0]=parseInt(tab[(j + 1)][1]);
                                                        if(isNaN(tt[0])){
                                                            tt[0]=0;
                                                        }
                                                        tt[1]=parseInt(tab[(j + 2)][1]);
                                                        if(isNaN(tt[1])){
                                                            tt[1]=0;
                                                        }
                                                        if((this.#taille_bordure % 2) !== 0){
                                                            tt[0]+=0.5;
                                                            tt[1]+=0.5;
                                                        }
                                                        tab[(j + 1)][1]=tt[0];
                                                        tab[(j + 2)][1]=tt[1];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            var obj1 = a2F1(tab,indice_matr,false,(indice_matr + 1),false);
                            if(obj1.status === true){
                                meta_de_la_base=obj1.value;
                            }else{
                                debugger;
                            }
                        }
                    }
                    if(meta_de_la_base === ''){
                        meta_de_la_base=('(transform_base_sur_svg,translate(' + tt[0] + ',' + tt[1] + '))');
                    }
                    if(meta_de_la_base.indexOf('transform_base_sur_svg') < 0){
                        meta_de_la_base+=('(transform_base_sur_svg,translate(' + tt[0] + ',' + tt[1] + '))');
                    }
                    this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes['donnees_rev_meta_de_la_base']=meta_de_la_base;
                    this.#arbre[id_bdd_de_la_base].arbre_svg[this.#id_svg_de_la_base_en_cours].proprietes.decallage_x=tt[0];
                    this.#arbre[id_bdd_de_la_base].arbre_svg[this.#id_svg_de_la_base_en_cours].proprietes.decallage_y=tt[1];
                    this.#arbre[id_bdd_de_la_base].arbre_svg[this.#id_svg_de_la_base_en_cours].proprietes.transform=('translate(' + tt[0] + ',' + tt[1] + ')');
                    /*
                      
                      =====================================
                      debut de recherche des create_table
                      =====================================
                    */
                    position_xy_table=[decallage_droite_table,10];
                    
                    for(indice_matr=1;indice_matr < l01;indice_matr++){
                        if((tab[indice_matr][7] === 0) && (tab[indice_matr][1] === 'create_table')){
                            
                            id_tab_table_en_cours=indice_matr;
                            
                            var obj=this.#ajouter_table_et_index_a_arbre(tab,id_tab_table_en_cours, indice_svg_courant , id_bdd_de_la_base , null );
                            if(obj.status===true){
                                indice_svg_courant        =obj.indice_courant;
                                id_svg_conteneur_table=obj.id_svg_conteneur_table;
                            }else{
                                debugger;
                            }
                            

                        }
                    }
                    this.#modifier_les_references_des_liens(id_bdd_de_la_base);
                }
                /*
                  
                  =============================
                  fin de pour chaque base
                  on peut afficher le svg
                  =============================
                */
                this.#dessiner_le_svg();
                
            }
        });
    }
    /*
      
      ========================================================================================================
      function charger_les_bases_initiales
    */
    #charger_les_bases_initiales_en_asynchrone(){
        this.#arbre={};
        var les_id_des_bases = document.getElementById(this.#id_text_area_contenant_les_id_des_bases).value;
        var obj1 = this.#charger_les_bases_en_asynchrone(les_id_des_bases);
    }
    /*
      
      ========================================================================================================
    */
    zoomMoins(){
        this.zoomPlusMoins(2);
    }
    /*
      
      ========================================================================================================
    */
    zoomPlus(){
        this.zoomPlusMoins(0.5);
    }
    /*
      
      ========================================================================================================
    */
    zoom_avec_roulette(e){
        if(e.ctrlKey === true){
            /*
              
              le controle zoom du navigateur ne doit pas zoomer le svg
            */
            return;
        }
        /*
          
          pour éviter de faire un défilement de page 
        */
        e.preventDefault();
        if(e.deltaY > 0){
            this.zoomPlusMoins(2);
        }else{
            this.zoomPlusMoins(0.5);
        }
    }
    /*
      
      ========================================================================================================
      function zoomPlusMoins
    */
    zoomPlusMoins(n){
        var vb = this.#svg_dessin.getAttribute('viewBox');
        if(vb != null){
            if((this.#_dssvg.zoom1 == 256) && (n == 2)){
            }else if((this.#_dssvg.zoom1 == 0.03125) && (n == 0.5)){
            }else{
                this.#_dssvg.zoom1=(this.#_dssvg.zoom1 * n);
                if(n === 2){
                    this.#_dssvg.viewBoxInit[2]*=2;
                    this.#_dssvg.viewBoxInit[3]*=2;
                }else{
                    this.#_dssvg.viewBoxInit[2]/=2;
                    this.#_dssvg.viewBoxInit[3]/=2;
                }
                this.setAttributeViewBox();
                this.#rayonPoint=(this.#_dssvg.parametres.rayonReference / this.#_dssvg.zoom1);
                this.#strkWiTexteSousPoignees=(this.#rayonPoint / 20);
                this.#fontSiTexteSousPoignees=this.#rayonPoint;
            }
        }
    }
    /* function setAttributeViewBox */
    setAttributeViewBox(){
        this.#svg_dessin.setAttribute('viewBox',this.#_dssvg.viewBoxInit.join(' '));
        /*
          
          this.#_dssvg.zoom1=0.5 => zoom*2 on voit en grand
        */
        if(this.#_dssvg.zoom1 >= 2){
            /* si tout est affiché en petit, on met un fond roze avec des tailles de carrés de 100 px */
            this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M 0 0 l 100 100 l 0 -100 l -100 100 Z" fill="pink" fill-opacity=".30"/%3E%3C/svg%3E\')';
            this.#div_svg.style.backgroundSize=((100 / this.#_dssvg.zoom1) + 'px');
            this.#div_svg.style.backgroundPositionX=((-(this.#_dssvg.viewBoxInit[0] * this.#_dssvg.zoom1)) + 'px');
            this.#div_svg.style.backgroundPositionY=((-(this.#_dssvg.viewBoxInit[1] * this.#_dssvg.zoom1)) + 'px');
        }else if((true) || (this.#_dssvg.zoom1 > 0.125)){
            /* si tout est affiché en grand, on met un gris roze avec des tailles de carrés de 100 px */
            this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"%3E%3Cpath d="M 0 0 l 10 10 l 0 -10 l -10 10 Z" fill="black" fill-opacity=".04"/%3E%3C/svg%3E\')';
            this.#div_svg.style.backgroundSize=((10 / this.#_dssvg.zoom1) + 'px');
            this.#div_svg.style.backgroundPositionX=((-(this.#_dssvg.viewBoxInit[0] * this.#_dssvg.zoom1)) + 'px');
            this.#div_svg.style.backgroundPositionY=((-(this.#_dssvg.viewBoxInit[1] * this.#_dssvg.zoom1)) + 'px');
        }
    }
}
export{module_svg_bdd};