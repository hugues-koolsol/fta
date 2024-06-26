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

    #_dssvg={zoom1:1,viewBoxInit:[],parametres:{rayonReference:16}};
    #rayonPoint=this.#_dssvg.parametres.rayonReference/this.#_dssvg.zoom1;

    #strkWiTexteSousPoignees=this.#rayonPoint/20;
    #fontSiTexteSousPoignees=this.#rayonPoint;
    
    #hauteur_du_svg=0;
    #largeur_du_svg=0;
    
    #arbre={}; // chaque entrée de arbre est une bdd
    
    #souris_element_a_deplacer='';
    #souris_init_objet={x:0,y:0,elem_bouge:null,param_bouge:{}};
    
    #svg_tableaux_des_references_amont_aval={};
    #svg_souris_delta_x=0;
    #svg_souris_delta_y=0;
    
    #propriete_pour_deplacement_x='pageX';
    #propriete_pour_deplacement_y='pageY';
    #debut_de_click=0;
    #position_min_gauche_de_reference=999999;
    #id_svg_de_la_base_en_cours=0;
    #id_bdd_de_la_base_en_cours=0;
   
    #hauteur_de_boite=CSS_TAILLE_REFERENCE_TEXTE+2*CSS_TAILLE_REFERENCE_PADDING+2*this.#taille_bordure;
    #hauteur_de_boite_affichage=this.#hauteur_de_boite+3*this.#taille_bordure;
    
    #liste_des_meta_base=['nom_long_de_la_base','nom_court_de_la_base','nom_bref_de_la_base','environnement_de_la_base'];
    #liste_des_meta_table=['nom_long_de_la_table','nom_court_de_la_table','nom_bref_de_la_table'];
    #liste_des_meta_champ=['nom_long_du_champ','nom_court_du_champ','nom_bref_du_champ'];
    
    
    /*
    ====================================================================================================================
    function constructor
    */
    constructor(nom_de_la_variable , nom_de_la_div_contenant_le_svg, taille_bordure , id_text_area_contenant_les_id_des_bases){
     
        clearMessages('zone_global_messages');
        
        this.#nom_de_la_variable=nom_de_la_variable;
        this.#div_svg=document.getElementById(nom_de_la_div_contenant_le_svg);
        this.#taille_bordure=taille_bordure;
        this.#id_text_area_contenant_les_id_des_bases = id_text_area_contenant_les_id_des_bases;
        
        this.#div_svg.style.maxWidth='90vw';
        this.#div_svg.style.width='90vw';
        
        this.#div_svg.style.maxHeight='70vh';
        this.#div_svg.style.height='70vh';
        
        var e=this.#div_svg.getElementsByTagName('svg');

        for(var i=0;i<e.length;i++){
         this.#svg_dessin=e[i];
         break;
        }

        
        var taillereelle=this.#div_svg.getBoundingClientRect();
        
        var hauteur_de_la_div=taillereelle.height;
        var largeur_de_la_div=taillereelle.width;
        
        this.#div_svg.style.height=hauteur_de_la_div+'px';
        this.#div_svg.style.width=largeur_de_la_div+'px';

        /*
         le viewbox du svg est la taille de la div -2*bordure
        */

        this.#hauteur_du_svg=hauteur_de_la_div-2*this.#taille_bordure;
        this.#largeur_du_svg=largeur_de_la_div-2*this.#taille_bordure;
        
        this.#hauteur_de_boite=CSS_TAILLE_REFERENCE_TEXTE+2*CSS_TAILLE_REFERENCE_PADDING+2*this.#taille_bordure;
        this.#hauteur_de_boite_affichage=this.#hauteur_de_boite+1*this.#taille_bordure;
        

        this.#svg_dessin.setAttribute('viewBox','0 0 '+this.#largeur_du_svg+' '+this.#hauteur_du_svg);
        this.#svg_dessin.style.width=this.#largeur_du_svg+'px';
        this.#svg_dessin.style.height=this.#hauteur_du_svg+'px';
        
        this.#_dssvg.viewBoxInit=[0,0,this.#largeur_du_svg,this.#hauteur_du_svg];
        
        this.#div_svg.addEventListener('wheel', this.zoom_avec_roulette.bind(this) ,false );
        
        
        window.addEventListener( 'mousedown' , this.#souris_bas.bind(this)   , false );
        window.addEventListener( 'mouseup'   , this.#souris_haut.bind(this)  , false );
        window.addEventListener( 'mousemove' , this.#souris_bouge.bind(this) , false );
        
        this.#svg_dessin.addEventListener( 'touchstart' , this.#doigt_bas.bind(this)   , false );
        window.addEventListener( 'touchend'  , this.#doigt_haut.bind(this)  , false );
        window.addEventListener( 'touchmove' , this.#doigt_bouge.bind(this) , false );
        
        this.#charger_les_bases_initiales_en_asynchrone();
     
    }
    /*
    ====================================================================================================================
    function svg_ajuster_la_largeur_des_boites_de_la_table
    */
    #svg_ajuster_la_largeur_des_boites_de_la_table(tableau){
     var id_svg_conteneur_table=tableau[0];
     var id_bdd=tableau[1];// this.#id_bdd_de_la_base_en_cours
     
     
     var id_svg_de_la_base_en_cours=this.#svg_dessin.getElementById(id_svg_conteneur_table).getAttribute('id_svg_de_la_base_en_cours');
     var lst_references=this.#svg_dessin.getElementById(id_svg_de_la_base_en_cours).getElementsByTagName('path');
     
     
     var hauteur_de_la_table=0;
     var largeur_max=0;
     var groupe_table=this.#svg_dessin.getElementById(id_svg_conteneur_table);
     try{
      var lst=groupe_table.getElementsByTagName('text');
     }catch(e){
      debugger
     }
     
     for(var i=0;i<lst.length;i++){
         var bb=lst[i].getBBox();
         if(largeur_max<bb.width){
             largeur_max=bb.width;
         }
         hauteur_de_la_table+=this.#hauteur_de_boite_affichage;
     }
     
     
     largeur_max+=2*this.#taille_bordure;
     if(largeur_max<40){
      largeur_max=40;
     }
     var position_haut=this.#taille_bordure;
     var lst=this.#svg_dessin.getElementById(id_svg_conteneur_table).getElementsByTagName('*');

     /* nom de la table */
     for(var i=0;i<lst.length;i++){
      if(lst[i].getAttribute('type_element')){
       if( lst[i].getAttribute('type_element')=== 'conteneur_de_nom_de_table'  ){
        lst[i].decallage_x=this.#taille_bordure;
        lst[i].decallage_y=position_haut;
        lst[i].setAttribute('transform' , 'translate('+this.#taille_bordure+','+position_haut+')');
        position_haut+=this.#hauteur_de_boite_affichage;
       }else if( lst[i].getAttribute('type_element')=== 'rectangle_de_nom_de_table'  ){
        lst[i].setAttribute('width',largeur_max);
        
       }
      }
     }

     /* champs */
     
     for(var i=0;i<lst.length;i++){
         if(lst[i].getAttribute('type_element')){
             if( lst[i].getAttribute('type_element')=== 'conteneur_de_champ'  ){
              lst[i].decallage_x=this.#taille_bordure;
              lst[i].decallage_y=position_haut;
              lst[i].setAttribute('transform' , 'translate('+this.#taille_bordure+','+position_haut+')');
              

              for(var j=0;j<lst_references.length;j++){
                   if(lst_references[j].getAttribute('type_element') && ( lst_references[j].getAttribute('type_element')=== 'reference_croisée'  ) ){
                        if(parseInt(lst_references[j].getAttribute('id_svg_table_mere'),10)===id_svg_conteneur_table && lst_references[j].getAttribute('id_svg_champ_pere') === lst[i].getAttribute('id') ){

                             /*
                              si ce champ a des enfants, il faut mettre à jour les liens qui pointent sur ce champ
                             */

                             var ancien_chemin=lst_references[j].getAttribute('d');

                             var tab_chemin=ancien_chemin.split(' ');
                             tab_chemin[6]=parseInt(groupe_table.getAttribute('decallage_x'),10)+this.#taille_bordure+largeur_max+30;
                             tab_chemin[7]=parseInt(groupe_table.getAttribute('decallage_y'),10)+position_haut+this.#hauteur_de_boite_affichage/2;

                             tab_chemin[8]=parseInt(groupe_table.getAttribute('decallage_x'),10)+this.#taille_bordure+largeur_max;
                             tab_chemin[9]=parseInt(groupe_table.getAttribute('decallage_y'),10)+position_haut+this.#hauteur_de_boite_affichage/2;
                             // 0 1    2     3     4   5      6   7      8   9
                             // M 125 -78    C    95 -78     -4 -55     -0 -55
                             var nouveau_chemin=tab_chemin.join(' ');
                             lst_references[j].setAttribute('d' , nouveau_chemin );
                             this.#arbre[id_bdd].arbre_svg[lst_references[j].id].proprietes.d=nouveau_chemin;
                             
                             for(var k=0;k<this.#svg_tableaux_des_references_amont_aval[id_bdd].length;k++){
                                 if(this.#svg_tableaux_des_references_amont_aval[id_bdd][k].id_svg_table_mere===id_svg_conteneur_table){
                                     
                                     this.#svg_tableaux_des_references_amont_aval[id_bdd][k].p2[0]=tab_chemin[8];
                                     this.#svg_tableaux_des_references_amont_aval[id_bdd][k].p2[1]=tab_chemin[9];
                                 }
                             }
                             
                             
                             
                        }else if(parseInt(lst_references[j].getAttribute('id_svg_table_fille'),10)===id_svg_conteneur_table && lst_references[j].getAttribute('id_svg_champ_fils') === lst[i].getAttribute('id') ){

                             /*
                               ce champ a un parent, il faut mettre à jour le lien
                             */
                             var ancien_chemin=lst_references[j].getAttribute('d');

                             var tab_chemin=ancien_chemin.split(' ');
                             tab_chemin[1]=parseInt(groupe_table.getAttribute('decallage_x'),10);
                             tab_chemin[2]=parseInt(groupe_table.getAttribute('decallage_y'),10)+position_haut+this.#hauteur_de_boite_affichage/2;
                             tab_chemin[4]=parseInt(groupe_table.getAttribute('decallage_x'),10)-30;
                             tab_chemin[5]=parseInt(groupe_table.getAttribute('decallage_y'),10)+position_haut+this.#hauteur_de_boite_affichage/2;
                             // 0 1    2     3     4   5      6   7      8   9
                             // M 125 -78    C    95 -78     -4 -55     -0 -55
                             var nouveau_chemin=tab_chemin.join(' ');
                             lst_references[j].setAttribute('d' , nouveau_chemin );
                             this.#arbre[id_bdd].arbre_svg[lst_references[j].id].proprietes.d=nouveau_chemin;
                             
                             for(var k=0;k<this.#svg_tableaux_des_references_amont_aval[id_bdd].length;k++){
                                 if(this.#svg_tableaux_des_references_amont_aval[id_bdd][k].id_svg_table_fille===id_svg_conteneur_table && this.#svg_tableaux_des_references_amont_aval[id_bdd][k].id_svg_champ_fils === parseInt(lst[i].getAttribute('id') , 10) ){
                                     
                                     this.#svg_tableaux_des_references_amont_aval[id_bdd][k].p1[0]=tab_chemin[1];
                                     this.#svg_tableaux_des_references_amont_aval[id_bdd][k].p1[1]=tab_chemin[2];
                                 }
                             }
                             
                             
                        }
                   }
              }

              position_haut+=this.#hauteur_de_boite_affichage;
              
             }else if( lst[i].getAttribute('type_element')=== 'rectangle_de_champ'  ){
                 lst[i].setAttribute('width',largeur_max);
             }
         }
     }

     /* indexes */
     for(var i=0;i<lst.length;i++){
      if(lst[i].getAttribute('type_element')){
       if( lst[i].getAttribute('type_element')=== 'conteneur_d_index'  ){
        lst[i].decallage_x=this.#taille_bordure;
        lst[i].decallage_y=position_haut;
        lst[i].setAttribute('transform' , 'translate('+this.#taille_bordure+','+position_haut+')');
        position_haut+=this.#hauteur_de_boite_affichage;
       }else if( lst[i].getAttribute('type_element')=== 'rectangle_d_index'  ){
        lst[i].setAttribute('width',largeur_max);
        
       }
      }
     }
     /* rectangle de table */
     for(var i=0;i<lst.length;i++){
      if(lst[i].getAttribute('type_element')){
       if( lst[i].getAttribute('type_element')=== 'rectangle_de_table'  ){
        lst[i].setAttribute('width',largeur_max+2*this.#taille_bordure);
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
        
        var t='<h1>Ajouter une table</h1>';
        t+='<input id="nouveau_nom" type="text" value="tbl_" />';
        t+='<a href="javascript:'+this.#nom_de_la_variable+'.ajouter_une_table_provenant_de_modale(&quot;nouveau_nom&quot;)">enregistrer</a>';
        document.getElementById('__contenu_modale').innerHTML=t;
        global_modale1.showModal();
    }
    
    /*
    ====================================================================================================================
    function changer_le_nom_de_table
    */
    changer_le_nom_de_table( id_element_svg , id_svg_conteneur_table){
        var nouveau_nom=document.getElementById('nouveau_nom').value;
        var ancien_nom=document.getElementById('ancien_nom').value;
        var id_svg_conteneur_table=parseInt(id_svg_conteneur_table,10);
        /* à faire, vérifier les noms des autres tables */
        if(nouveau_nom!==ancien_nom){
            /* changement du visuel */
            var id_element_svg=parseInt(id_element_svg,10);
            var element_svg=document.getElementById(id_element_svg);
            for(var j=0;j<element_svg.childNodes.length;j++){
                if(element_svg.childNodes[j].nodeName.toLowerCase()==='#text'){
                    element_svg.childNodes[j].data=nouveau_nom;
                    
                    /* mise à jour de l'arbre */
//                    debugger
                    this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_element_svg].contenu='<tspan style="cursor:move;" id_svg_conteneur_table="'+id_svg_conteneur_table+'" id_bdd_de_la_base_en_cours="'+this.#id_bdd_de_la_base_en_cours+'"  id_svg_de_la_base_en_cours="'+this.#id_svg_de_la_base_en_cours+'">🟥</tspan>'+nouveau_nom;
                    break;
                }
            }
            /*
              changement des champs nom_de_la_table pour les éléments dans la base courante
            */
            var lst=document.getElementById(this.#id_svg_de_la_base_en_cours).getElementsByTagName('*');
            for(var i=0;i<lst.length;i++){
                if(lst[i].getAttribute('nom_de_la_table') && lst[i].getAttribute('nom_de_la_table')===ancien_nom){

                    lst[i].setAttribute('nom_de_la_table',nouveau_nom);
                    
                    if(this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes && this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_la_table){
                     
                        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_la_table=nouveau_nom;
                     
                    }
                }
                if(lst[i].getAttribute('nom_de_la_table_pour_l_index') && lst[i].getAttribute('nom_de_la_table_pour_l_index')===ancien_nom){

                    lst[i].setAttribute('nom_de_la_table_pour_l_index',nouveau_nom);
                    
                    if(this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes && this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_la_table_pour_l_index){
                     
                        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_de_la_table_pour_l_index=nouveau_nom;
                     
                    }
                }
                
                if(lst[i].getAttribute('donnees_rev_du_champ') && lst[i].getAttribute('donnees_rev_du_champ').indexOf(ancien_nom)>=0){
                 var a_remplacer=new RegExp(ancien_nom, 'g'); 

                 lst[i].setAttribute('donnees_rev_du_champ' , lst[i].getAttribute('donnees_rev_du_champ').replace(a_remplacer,nouveau_nom));
                }
            }

            for(var i=0;i<this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours].length;i++){
                var elem=this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i];
                if(elem.nom_de_la_table_mere===ancien_nom){
                  this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i].nom_de_la_table_mere=nouveau_nom;
                }
                if(elem.nom_table_fille===ancien_nom){
                  this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i].nom_table_fille=nouveau_nom;
                }
                
            }
            
            
            this.#svg_ajuster_largeur_de_table(id_svg_conteneur_table);
            
            global_modale1.close();
            
            this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
            
            
        }
    }
    /*
    ====================================================================================================================
    function ajouter_une_table_provenant_de_modale
    */
    ajouter_une_table_provenant_de_modale(nom_champ_nouveau_nom){
     var nom_de_la_table=document.getElementById(nom_champ_nouveau_nom).value;
     var j=0;
     var i=0;
     
     var max_id=-1;
     var lst=this.#svg_dessin.getElementsByTagName('*');
     for(i=0;i<lst.length;i++){
         if(lst[i].id && isNumeric(lst[i].id)){
             j=parseInt(lst[i].id,10);
             if(j>max_id){
                max_id=j;
             }
         }
     }
     max_id++;
     var indice_courant=max_id;
     var id_svg_conteneur_table=indice_courant;
     var a=this.#ajouter_table_a_svg(nom_de_la_table , indice_courant , [0,0] , '');
     var id_svg_conteneur_table=a.id_svg_conteneur_table;
     indice_courant+=2;
     var a=this.#ajouter_nom_de_table_au_svg(nom_de_la_table , indice_courant ,id_svg_conteneur_table , 0  );
     global_modale1.close();
     
     this.#dessiner_le_svg();
     this.#svg_ajuster_la_largeur_des_boites_de_la_table([id_svg_conteneur_table, this.#id_bdd_de_la_base_en_cours]);
     this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
     
     
     
    }
    /*
    ====================================================================================================================
    function ajouter_un_champ_de_modale
    */
    ajouter_un_champ_de_modale(id_svg_conteneur_table,nom_de_la_table){
        var nom_du_champ=document.getElementById('nom_du_champ').value;
        var type_du_champ=document.getElementById('type_du_champ').value;
        var longueur_du_champ=document.getElementById('longueur_du_champ').value;
        var j=0;
        var i=0;
        document.getElementById('zone_message_ajouter_un_champ').innerHTML=''

        if(type_du_champ===''){
         document.getElementById('zone_message_ajouter_un_champ').innerHTML='Vous devez choisir un type';
         return;
        }
        var type_final='';
        if(type_du_champ=='chi'){
            if(longueur_du_champ===''){
                type_final='type(INTEGER),primary_key()'
            }else{
                type_final='type(INTEGER('+longueur_du_champ+')),primary_key()';
            }
            
        }else if(type_du_champ=='chx' ){
            var table_mère=document.getElementById('table_mère').value;
            var champ_père=document.getElementById('champ_père').value;
            /*
              à faire : vérifier l'existance de la table mère et du champ père
            */
            if(longueur_du_champ===''){
                type_final='type(INTEGER),references(\''+table_mère.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\',\''+champ_père.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
            }else{
                type_final='type(INTEGER('+longueur_du_champ+')),references(\''+table_mère.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\',\''+champ_père.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
            }
            
        }else if( type_du_champ=='che' || type_du_champ=='chu' ){
            if(longueur_du_champ===''){
                type_final='type(INTEGER)'
            }else{
                type_final='type(INTEGER('+longueur_du_champ+'))';
            }
        }else if(type_du_champ=='chn'){
            type_final='type(FLOAT)'
        }else if(type_du_champ=='cht' || type_du_champ=='chm'){
            type_final='type(TEXT)'
        }else if(type_du_champ=='chp'){
            if(longueur_du_champ===''){
                document.getElementById('zone_message_ajouter_un_champ').innerHTML='Vous devez renseigner la longueur';
                return;
            }else{
                type_final='type(VARCHAR('+longueur_du_champ+'))';
            }
        }else if(type_du_champ=='chp'){
            if(longueur_du_champ===''){
                document.getElementById('zone_message_ajouter_un_champ').innerHTML='Vous devez renseigner la longueur';
                return;
            }else{
                type_final='type(VARCHAR('+longueur_du_champ+'))';
            }
        }else if(type_du_champ=='cho'){
            if(longueur_du_champ===''){
                document.getElementById('zone_message_ajouter_un_champ').innerHTML='Vous devez renseigner la longueur';
                return;
            }else{
                type_final='type(CHAR('+longueur_du_champ+'))';
            }
        }else if(type_du_champ=='chd'){
            type_final='type(CHAR(23))';
        }else if(type_du_champ=='cha'){
            type_final='type(CHAR(10))';
        }else if(type_du_champ=='chh'){
            type_final='type(CHAR(8))';
        }else if(type_du_champ=='chb'){
            type_final='type(BLOB)';
        }
        
        var max_id=-1;
        var lst=this.#svg_dessin.getElementsByTagName('*');
        for(i=0;i<lst.length;i++){
            if(lst[i].id && isNumeric(lst[i].id)){
                j=parseInt(lst[i].id,10);
                if(j>max_id){
                   max_id=j;
                }
            }
        }
        max_id++;
        var indice_courant=max_id;
        
        var numero_de_boite=0; 
        var lst=this.#svg_dessin.getElementById(id_svg_conteneur_table).getElementsByTagName('*');
        for(i=0;i<lst.length;i++){
            if(lst[i].getAttribute('type_element')){
                if(
                    lst[i].getAttribute('type_element')==='conteneur_de_champ' 
                 || lst[i].getAttribute('type_element')==='conteneur_de_nom_de_table' 
                 || 'conteneur_d_index' === lst[i].getAttribute('type_element')
                ){
                   numero_de_boite++;
                }
            }
        }
        var a=this.#ajouter_champ_a_arbre(nom_du_champ,indice_courant,id_svg_conteneur_table,nom_de_la_table,this.#id_bdd_de_la_base_en_cours,numero_de_boite,'n(\''+nom_du_champ+'\'),'+type_final);
        
        
        global_modale1.close();
        
        this.#dessiner_le_svg();
        this.#svg_ajuster_la_largeur_des_boites_de_la_table([id_svg_conteneur_table, this.#id_bdd_de_la_base_en_cours]);
        this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);

     
    }
    
    /*
    ====================================================================================================================
    function changer_le_nom_de_champ_de_modale
    */
    changer_le_nom_de_champ_de_modale( id_svg_text , id_svg_conteneur_table ){
        var nouveau_nom=document.getElementById('nouveau_nom').value;
        var ancien_nom=document.getElementById('ancien_nom').value;
        /* à faire, vérifier les noms des autres tables */
        if(nouveau_nom!==ancien_nom){
            /* changement du visuel */
            var id_zone_element_svg=parseInt(id_svg_text,10);
            var element_svg=document.getElementById(id_zone_element_svg);
            for(var j=0;j<element_svg.childNodes.length;j++){
                if(element_svg.childNodes[j].nodeName.toLowerCase()==='#text'){
                    element_svg.childNodes[j].data=nouveau_nom;
                    
                    /* mise à jour de l'arbre */
//                    debugger
                    this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[id_zone_element_svg].contenu=nouveau_nom;
                    break;
                }
            }
            /*
              changement des champs nom_du_champ pour les éléments dans la base courante
            */
            var lst=document.getElementById(this.#id_svg_de_la_base_en_cours).getElementsByTagName('*');
            for(var i=0;i<lst.length;i++){
                if(lst[i].getAttribute('nom_du_champ') && lst[i].getAttribute('nom_du_champ')===ancien_nom){

                    lst[i].setAttribute('nom_du_champ',nouveau_nom);
                    
                    if(this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes && this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_du_champ){
                     
                        this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[lst[i].id].proprietes.nom_du_champ=nouveau_nom;
                     
                    }
                }
                if(lst[i].getAttribute('donnees_rev_du_champ') && lst[i].getAttribute('donnees_rev_du_champ').indexOf(ancien_nom)>=0){
                 /* à faire passer par le rev */
                 var a_remplacer=new RegExp(ancien_nom, 'g'); 

                 lst[i].setAttribute('donnees_rev_du_champ' , lst[i].getAttribute('donnees_rev_du_champ').replace(a_remplacer,nouveau_nom));
                }
                
                if(lst[i].getAttribute('type_element') && 'rectangle_d_index' === lst[i].getAttribute('type_element')){

                  if(lst[i].getAttribute('donnees_rev_de_l_index') && lst[i].getAttribute('donnees_rev_de_l_index').indexOf(ancien_nom)>=0){
                   /* à faire passer par le rev */
                    var a_remplacer=new RegExp(ancien_nom, 'g'); 


                    lst[i].setAttribute('donnees_rev_de_l_index' , lst[i].getAttribute('donnees_rev_de_l_index').replace(a_remplacer,nouveau_nom));
                  }
                }
            }

            for(var i=0;i<this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours].length;i++){
                var elem=this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i];
                if(elem.nom_du_champ_pere===ancien_nom){
                  this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i].nom_du_champ_pere=nouveau_nom;
                }
                if(elem.nom_du_champ_fils===ancien_nom){
                  this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][i].nom_du_champ_fils=nouveau_nom;
                }
                
            }
            
            
            this.#svg_ajuster_largeur_de_table(id_svg_conteneur_table);
            
            global_modale1.close();
            
            this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
            
            
        }
    }
    
    
    /*
    ====================================================================================================================
    function modale_modifier_le_champ
    */
    #modale_modifier_le_champ(element_g){
        var nom_du_champ='';
        var id_element_svg=0;
        var id_svg_de_la_base_en_cours=0;
        var id_svg_conteneur_table=0;
        var nom_de_la_table='';
        /* on ne peut pas chercher un tagnale #text */
        var lst=element_g.getElementsByTagName('text'); 
        for(var i=0;i<lst.length && id_element_svg===0;i++){
            if(lst[i].nodeName.toLowerCase()==='text' && 'texte_de_champ'===lst[i].getAttribute('type_element')){
                for(var j=0;j<lst[i].childNodes.length;j++){
                    if(lst[i].childNodes[j].nodeName.toLowerCase()==='#text'){
                        nom_du_champ=lst[i].childNodes[j].data;
                        id_element_svg=parseInt(lst[i].id,0);
                        id_svg_de_la_base_en_cours=parseInt(lst[i].getAttribute('id_svg_de_la_base_en_cours'),0);
                        id_svg_conteneur_table=parseInt(lst[i].getAttribute('id_svg_conteneur_table'),0);
                        nom_de_la_table=lst[i].getAttribute('nom_de_la_table');
                        
                        break
                    }
                }
            }
        }
        if(id_element_svg===0){
         return;
        }
        var type_du_champ='';
        var longueur_du_champ='';
        var table_mere='';
        var champ_pere='';
        var primary_key=false;
        var auto_increment=false;
        var not_null=false;
        debugger
        var lst=element_g.getElementsByTagName('rect'); 
        for(var i=0;i<lst.length ;i++){
            if(lst[i].nodeName.toLowerCase()==='rect' && 'rectangle_de_champ'===lst[i].getAttribute('type_element')){
                if(lst[i].getAttribute('donnees_rev_du_champ') && lst[i].getAttribute('donnees_rev_du_champ')!==''){

                    var obj_matrice_du_champ=functionToArray(lst[i].getAttribute('donnees_rev_du_champ') , true, false , '');
                    if(obj_matrice_du_champ.status===true){
                     
                        for(var k=1;k<obj_matrice_du_champ.value.length;k++){
                            if(obj_matrice_du_champ.value[k][7] === 0 ){
                                if(obj_matrice_du_champ.value[k][2]==='f'){
                                 
                                    if(obj_matrice_du_champ.value[k][1]==='type'){
                                         if(obj_matrice_du_champ.value[k][8]===1){
                                             type_du_champ=obj_matrice_du_champ.value[k+1][1];
                                         }else if(obj_matrice_du_champ.value[k][8]===2){
                                             type_du_champ=obj_matrice_du_champ.value[k+1][1];
                                             longueur_du_champ=obj_matrice_du_champ.value[k+2][1];
                                         }
                                    }else if(obj_matrice_du_champ.value[k][1]==='references'){
                                        table_mere=obj_matrice_du_champ.value[k+1][1];
                                        champ_pere=obj_matrice_du_champ.value[k+2][1];
                                    }else if(obj_matrice_du_champ.value[k][1]==='primary_key'){
                                        primary_key=true;
                                    }else if(obj_matrice_du_champ.value[k][1]==='auto_increment'){
                                        auto_increment=true;
                                    }else if(obj_matrice_du_champ.value[k][1]==='not_null'){
                                        not_null=true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        var t='<h1>modification du champ</h1>';

        t+='<hr />';
        t+='<h2>changer le nom</h2>';
        t+='<input id="nouveau_nom" type="text" value="'+nom_du_champ+'" />';
        t+='<input id="ancien_nom" type="hidden" value="'+nom_du_champ+'" />';
        t+='<a href="javascript:'+this.#nom_de_la_variable+'.changer_le_nom_de_champ_de_modale('+id_element_svg+','+id_svg_conteneur_table+')">modifier</a>';
        t+='<hr />';
        
        t+='<select id="type_du_champ">';
        t+='<option value="chi" '+(type_du_champ==='chi'?' selected':'')+'>index entier (chi) integer[n]</option>';
        t+='<option value="chx" '+(type_du_champ==='chx'?' selected':'')+'>référence croisée (chx) integer[n]</option>';
        t+='<option value="che" '+(type_du_champ==='che'?' selected':'')+'>entier (che) integer[n]</option>';
        t+='<option value="chn" '+(type_du_champ==='chn'?' selected':'')+'>numérique (chn) float</option>';
        t+='<option value="chu" '+(type_du_champ==='chu'?' selected':'')+'>choix unique (chu) integer(n)</option>';
        t+='<option value="chm" '+(type_du_champ==='chm'?' selected':'')+'>choix multiple (chm) text</option>';
        t+='<option value="cht" '+(type_du_champ==='cht'?' selected':'')+'>texte (cht) text</option>';
        t+='<option value="chp" '+(type_du_champ==='chp'?' selected':'')+'>phrase (chp) varchar(n)</option>';
        t+='<option value="cho" '+(type_du_champ==='cho'?' selected':'')+'>mot (cho) character(n)</option>';
        t+='<option value="chd" '+(type_du_champ==='chd'?' selected':'')+'>date heure (chd) text(23) YYYY-MM-DD HH:MM:SS.SSS</option>';
        t+='<option value="cha" '+(type_du_champ==='cha'?' selected':'')+'>date character(10)</option>';
        t+='<option value="chh" '+(type_du_champ==='chh'?' selected':'')+'>heure character(8)</option>';
        t+='<option value="chb" '+(type_du_champ==='chb'?' selected':'')+'>blob (chb) blob</option>';
        t+='</select>';
        t+='<br />';
        t+='nom : ';
        t+='<input id="nom_du_champ" type="text" value="'+nom_du_champ+'" />';
        t+='<br />';
        t+='longueur  : ';
        t+='<input id="longueur_du_champ" type="number" value="'+longueur_du_champ+'" min="1" max="1000" />';
        t+='<br />';
        t+='table mère pour chx  : ';
        t+='<input id="table_mère" type="text" value="'+table_mere+'" />';
        t+='<br />';
        t+='champ père pour chx  : ';
        t+='<input id="champ_père" type="text" value="'+champ_pere+'" />';
        t+='<br />';
        t+='<a href="javascript:'+this.#nom_de_la_variable+'.modifier_un_champ_de_modale('+element_g.getAttribute('id_svg_conteneur_table')+',&quot;'+nom_de_la_table+'&quot;)">modifier</a>';
        
        
        
        document.getElementById('__contenu_modale').innerHTML=t;
        global_modale1.showModal();
        
    }
    /*
    ====================================================================================================================
    function modale_modifier_la_table
    */
    #modale_modifier_la_table(element_g){

        var nom_de_la_table='';
        var id_svg_du_texte=0;
        /* on ne peut pas chercher un tagnale #text */
        var lst=element_g.getElementsByTagName('text'); 
        for(var i=0;i<lst.length && id_svg_du_texte===0;i++){
            if(lst[i].nodeName.toLowerCase()==='text' && 'texte_de_nom_de_table'===lst[i].getAttribute('type_element')){
                for(var j=0;j<lst[i].childNodes.length;j++){
                    if(lst[i].childNodes[j].nodeName.toLowerCase()==='#text'){
                        nom_de_la_table=lst[i].childNodes[j].data;
                        id_svg_du_texte=lst[i].id
                        break
                    }
                }
            }
        }
        if(id_svg_du_texte===0){
         return;
        }
        var t='<h1>modification de la table</h1>';
        t+='<hr />';

        t+='<h2>changer le nom</h2>';
        t+='<input id="nouveau_nom" type="text" value="'+nom_de_la_table+'" />';
        t+='<input id="ancien_nom" type="hidden" value="'+nom_de_la_table+'" />';
        t+='<a href="javascript:'+this.#nom_de_la_variable+'.changer_le_nom_de_table('+id_svg_du_texte+','+element_g.getAttribute('id_svg_conteneur_table')+')">modifier</a>';
        t+='<hr />';

        t+='<h2>Supprimer</h2>';
        t+='<a class="yydanger" href="javascript:'+this.#nom_de_la_variable+'.supprimer_la_table_de_modale(&quot;'+element_g.getAttribute('id_svg_conteneur_table')+'&quot;,&quot;'+nom_de_la_table+'&quot;)">supprimer</a>';

        t+='<hr />';
        t+='<h2>ajouter un champ</h2>';
        t+='<div class="yydanger" id="zone_message_ajouter_un_champ"></div>';
        t+='type : ';
        t+='<select id="type_du_champ">';
        t+='<option value="">choisissez un type</option>';
        t+='<option value="chi">index entier (chi) integer[n]</option>';
        t+='<option value="chx">référence croisée (chx) integer[n]</option>';
        t+='<option value="che">entier (che) integer[n]</option>';
        t+='<option value="chn">numérique (chn) float</option>';
        t+='<option value="chu">choix unique (chu) integer(n)</option>';
        t+='<option value="chm">choix multiple (chm) text</option>';
        t+='<option value="cht">texte (cht) text</option>';
        t+='<option value="chp">phrase (chp) varchar(n)</option>';
        t+='<option value="cho">mot (cho) character(n)</option>';
        t+='<option value="chd">date heure (chd) text(23) YYYY-MM-DD HH:MM:SS.SSS</option>';
        t+='<option value="cha">date character(10)</option>';
        t+='<option value="chh">heure character(8)</option>';
        t+='<option value="chb">blob (chb) blob</option>';
        t+='</select>';
        t+='<br />';
        t+='nom : ';
        t+='<input id="nom_du_champ" type="text" value="chi_" />';
        t+='<br />';
        t+='longueur  : ';
        t+='<input id="longueur_du_champ" type="number" value="" min="1" max="1000" />';
        t+='<br />';
        t+='table mère pour chx  : ';
        t+='<input id="table_mère" type="text" value="" />';
        t+='<br />';
        t+='champ père pour chx  : ';
        t+='<input id="champ_père" type="text" value="" />';
        t+='<br />';
        t+='<a href="javascript:'+this.#nom_de_la_variable+'.ajouter_un_champ_de_modale('+element_g.getAttribute('id_svg_conteneur_table')+',&quot;'+nom_de_la_table+'&quot;)">ajouter</a>';
        
        document.getElementById('__contenu_modale').innerHTML=t;
        global_modale1.showModal();
    }
    /*
    ====================================================================================================================
    function svg_ajuster_la_largeur_de_la_base
    */
    #svg_ajuster_la_largeur_de_la_base(id_svg_de_la_base_en_cours){
     
       var indiceRectangle=parseInt(id_svg_de_la_base_en_cours,10)+1;
       var element_rectangle=document.getElementById(indiceRectangle);
       
       /*
       on fait disparaître le rectangle de la base pour obtenir la taille du groupe
       */
       try{
           element_rectangle.style.display='none';
       }catch(e){
           debugger;
       }
       
       
       var temp=document.getElementById(id_svg_de_la_base_en_cours).getBBox();
       var groupe_apres_modifications={x:temp.x,y:temp.y,width:temp.width,height:temp.height};
       
       
       element_rectangle.setAttribute('x'      , groupe_apres_modifications.x-1*this.#taille_bordure);
       element_rectangle.setAttribute('y'      , groupe_apres_modifications.y-1*this.#taille_bordure);
       element_rectangle.setAttribute('width'  , groupe_apres_modifications.width+2*this.#taille_bordure);
       element_rectangle.setAttribute('height' , groupe_apres_modifications.height+2*this.#taille_bordure);


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
     var gparent=document.getElementById(indice_svg_table_en_cours);

     
     var lst=gparent.getElementsByTagName('rect');
     /* on masque tous les rectangles */
     for(var i=0;i<lst.length;i++){
      if(lst[i].getAttribute('type_element')){
       if(  lst[i].getAttribute('type_element')==='rectangle_de_table' 
         || lst[i].getAttribute('type_element')==='rectangle_de_nom_de_table' 
         || lst[i].getAttribute('type_element')==='rectangle_d_index' 
         || lst[i].getAttribute('type_element')==='rectangle_de_champ' 
       ){
        lst[i].style.display='none';
       }
      }
     }
     /* on les réaffiche tous */
     var temp=gparent.getBBox();
     var largeur=parseInt(temp.width,10)+1+this.#taille_bordure;
     if(largeur<40){
      largeur=40;
     }

     for(var i=0;i<lst.length;i++){
      if(lst[i].getAttribute('type_element')){
       if(  lst[i].getAttribute('type_element')==='rectangle_de_table' ){
        lst[i].setAttribute('width' , largeur+2*this.#taille_bordure);
       }else if(  
            lst[i].getAttribute('type_element')==='rectangle_de_nom_de_table' 
         || lst[i].getAttribute('type_element')==='rectangle_d_index' 
         || lst[i].getAttribute('type_element')==='rectangle_de_champ' 
       ){
        lst[i].setAttribute('width' , largeur);
       }
       lst[i].style.display='';
       
      }
     }
     this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
     
    }
    
    
    /*
    ====================================================================================================================
    function supprimer_recursivement_les_elements_de_l_arbre
    */
    #supprimer_recursivement_les_elements_de_l_arbre( id_bdd , id_parent ){
     
     for(var i in this.#arbre[id_bdd].arbre_svg ){
      if(this.#arbre[id_bdd].arbre_svg[i]!==null && this.#arbre[id_bdd].arbre_svg[i].id_parent===id_parent){
       this.#supprimer_recursivement_les_elements_de_l_arbre(id_bdd,this.#arbre[id_bdd].arbre_svg[i].id);
      }
     }
     this.#arbre[id_bdd].arbre_svg[id_parent]=null;
     
    }
    
    /*
    ====================================================================================================================
    function supprimer_la_table_de_modale
    */
    supprimer_la_table_de_modale( id_svg_conteneur_table,nom_de_la_table){

     id_svg_conteneur_table=parseInt(id_svg_conteneur_table,10);
     /*
     suppression des références éventuelles sur cette table
     on recherche toutes les références à cette table
     */
     var liste_des_id_svg_champs=[];
     for(var i in this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg){
       
      if(this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i] !==null &&
         this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes && 
         this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes.donnees_rev_du_champ && 
         this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes.donnees_rev_du_champ.indexOf('references')>=0
      ){
        /*
          On repère tous les champs qui font référence à cette table         
        */
        
        var obj=functionToArray(this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].proprietes.donnees_rev_du_champ,true,false,'');
        if(obj.status===true){
         for(var j=0;j<obj.value.length;j++){
          if(obj.value[j][7]===0 && obj.value[j][1]==='references' && obj.value[j][2]==='f'){
           if(obj.value[j+1][1]===nom_de_la_table){

            var id_svg_champ_a_supprimer=this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[i].id_parent;
            /* on stock l'id du champ et on supprime le champ de l'arbre */
            liste_des_id_svg_champs.push(id_svg_champ_a_supprimer);
            this.#supprimer_recursivement_les_elements_de_l_arbre(this.#id_bdd_de_la_base_en_cours , id_svg_champ_a_supprimer );

           }
          }
         }
        }else{
         return;
        }
        
      }
         
     }
     for(var i=0;i<liste_des_id_svg_champs.length;i++){
         for(var j in this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg){
             if( 
                 this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j] !==null &&
                 this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j].type==='path' &&
                 (
                     this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j].proprietes.id_svg_champ_fils === liste_des_id_svg_champs[i] || 
                     this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j].proprietes.id_svg_champ_pere === liste_des_id_svg_champs[i] 
                 )
             ){
              this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[j]=null;
              
             }
         }
     }
     /*
       on supprime la table
     */
     this.#supprimer_recursivement_les_elements_de_l_arbre(  this.#id_bdd_de_la_base_en_cours , id_svg_conteneur_table );
     /*
     il faut supprimer les liens de svg_tableaux_des_references_amont_aval
     */
     
     for(var i=0;i<liste_des_id_svg_champs.length;i++){
         for(var j in this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours]){
             if(
                this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j] !== null && 
                liste_des_id_svg_champs[i]===this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j].id_svg_champ_fils
             ){
                 this.#svg_tableaux_des_references_amont_aval[this.#id_bdd_de_la_base_en_cours][j]=null;
                 
             }
         }
     }
     
     global_modale1.close();
     this.#dessiner_le_svg();
     this.#svg_ajuster_la_largeur_de_la_base(this.#id_svg_de_la_base_en_cours);
     
    }
    
   /*
   ====================================================================================================================
   function doigt_bouge
   */
   #doigt_bouge(e){
    this.#souris_bouge(e.touches[0])
   }

   /*
   ====================================================================================================================
   function doigt_haut
   */
   #doigt_haut(e){
    console.log('ici e=',e.changedTouches);
    this.#souris_haut(e.changedTouches[0])
   }

   /*
   ====================================================================================================================
   function doigt_bas
   */
   #doigt_bas(e){
    console.log(e);
    this.#souris_bas(e.touches[0])
   }

    /*
    ====================================================================================================================
    function souris_bouge
    */
    #souris_bouge(e){
     
        try{
         /* permer de ne pas sélectionner les textes , ne fonctionne pas sur les mobiles */
         e.preventDefault(); 
        }catch(er){
        }
        if(this.#souris_element_a_deplacer==='svg'){
         
            var calculx=(this.#souris_init_objet.x-e[this.#propriete_pour_deplacement_x])*this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.x;
            var calculy=(this.#souris_init_objet.y-e[this.#propriete_pour_deplacement_y])*this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.y;
            
            this.#souris_init_objet.elem_bouge.setAttribute('viewBox',calculx+','+calculy+','+this.#souris_init_objet.elem_bouge.viewBox.baseVal.width+','+this.#souris_init_objet.elem_bouge.viewBox.baseVal.height);
            return;
         
        }else if(this.#souris_element_a_deplacer==='rectangle_de_base'){
         
            var calculx=(e[this.#propriete_pour_deplacement_x]-this.#souris_init_objet.x)*this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.x;
            var calculy=(e[this.#propriete_pour_deplacement_y]-this.#souris_init_objet.y)*this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.y;
            calculx=parseInt(calculx,10);
            calculy=parseInt(calculy,10);
            if(this.#taille_bordure%2!==0){
             calculx+=0.5;
             calculy+=0.5;
            }
            this.#souris_init_objet.elem_bouge.setAttribute( 'transform' , 'translate('+calculx+','+calculy+')');
            this.#souris_init_objet.elem_bouge.setAttribute( 'decallage_x' , calculx );
            this.#souris_init_objet.elem_bouge.setAttribute( 'decallage_y' , calculy );
            
            /* mise à jour de l'arbre */
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[this.#souris_init_objet.id_svg_conteneur_base].proprietes.transform='translate('+calculx+','+calculy+')';
            return;
         
        }else if(this.#souris_element_a_deplacer==='table'){
         
            this.#svg_souris_delta_x=(e[this.#propriete_pour_deplacement_x]-this.#souris_init_objet.x)*this.#_dssvg.zoom1;
            this.#svg_souris_delta_y=(e[this.#propriete_pour_deplacement_y]-this.#souris_init_objet.y)*this.#_dssvg.zoom1;
            var calculx=parseInt(this.#svg_souris_delta_x+this.#souris_init_objet.param_bouge.x,10);
            var calculy=parseInt(this.#svg_souris_delta_y+this.#souris_init_objet.param_bouge.y,10);
            this.#souris_init_objet.elem_bouge.setAttribute( 'transform'  , 'translate('+calculx+','+calculy+')');
            this.#souris_init_objet.elem_bouge.setAttribute( 'decallage_x' , calculx );
            this.#souris_init_objet.elem_bouge.setAttribute( 'decallage_y' , calculy );
            
            
            /* mise à jour de l'arbre */
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[this.#souris_init_objet.id_svg_conteneur_table].proprietes.decallage_x=calculx;
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[this.#souris_init_objet.id_svg_conteneur_table].proprietes.decallage_y=calculy;
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[this.#souris_init_objet.id_svg_conteneur_table].proprietes.transform='translate('+calculx+','+calculy+')';
            

            /* 
              déplacement des liens de la table en cours de mouvement 
            */

            if(this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours]){
            
                for(var i=0;i<this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours].length;i++){
                    var elem=this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours][i];
                    if(elem){
                        if(elem.id_svg_table_fille===this.#souris_init_objet.id_svg_conteneur_table && elem.id_svg_table_mere===this.#souris_init_objet.id_svg_conteneur_table ){
                         /*
                           lien sur moi même
                         */
                                var ref_elem=document.getElementById(elem.id_du_path);
                                var nouveau_chemin='M '+(elem.p1[0]+this.#svg_souris_delta_x   )+' '+(elem.p1[1]+this.#svg_souris_delta_y);
                                nouveau_chemin   +=' C '+(elem.p1[0]+this.#svg_souris_delta_x-30)+' '+(elem.p1[1]+this.#svg_souris_delta_y);
                                nouveau_chemin+=' '+(elem.p2[0]+this.#svg_souris_delta_x+30)+' '+(elem.p2[1]+this.#svg_souris_delta_y);
                                nouveau_chemin+=' '+(elem.p2[0]+this.#svg_souris_delta_x   )+' '+(elem.p2[1]+this.#svg_souris_delta_y);
                                
                                ref_elem.setAttribute('d' , nouveau_chemin );
                        }else{
                            if(elem.id_svg_table_fille===this.#souris_init_objet.id_svg_conteneur_table){

                                var ref_elem=document.getElementById(elem.id_du_path);
                                var nouveau_chemin='M '+(elem.p1[0]+this.#svg_souris_delta_x   )+' '+(elem.p1[1]+this.#svg_souris_delta_y);
                                nouveau_chemin   +=' C '+(elem.p1[0]+this.#svg_souris_delta_x-30)+' '+(elem.p1[1]+this.#svg_souris_delta_y);
                                nouveau_chemin   +=' '+(elem.p2[0]+30)+' '+(elem.p2[1]);
                                nouveau_chemin   +=' '+(elem.p2[0])+' '+(elem.p2[1]);
                                
                                ref_elem.setAttribute('d' , nouveau_chemin );
                            }
                            if(elem.id_svg_table_mere===this.#souris_init_objet.id_svg_conteneur_table){
                                var ref_elem=document.getElementById(elem.id_du_path);
                                var nouveau_chemin='M '+(elem.p1[0])+' '+(elem.p1[1]);
                                nouveau_chemin+=' C '+(elem.p1[0]-30)+' '+(elem.p1[1]);
                                nouveau_chemin+=' '+(elem.p2[0]+this.#svg_souris_delta_x+30)+' '+(elem.p2[1]+this.#svg_souris_delta_y);
                                nouveau_chemin+=' '+(elem.p2[0]+this.#svg_souris_delta_x   )+' '+(elem.p2[1]+this.#svg_souris_delta_y);
                                ref_elem.setAttribute('d' , nouveau_chemin );
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
    function souris_haut
    */
    #souris_haut(e){
        
     
        if(this.#souris_element_a_deplacer==='table'){
            /* si on a bougé une table, il faut remettre les positions des liens dans les svg_tableaux_des_references_amont_aval */

            if(this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours] && this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours].length>0){
                for(var i=0;i<this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours].length;i++){
                 
                    var elem=this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours][i];
                    if(elem){
                        if(elem.id_svg_table_fille===this.#souris_init_objet.id_svg_conteneur_table){
                         
                            var ref_elem=document.getElementById(elem.id_du_path);
                            var tab=ref_elem.getAttribute('d').split(' ');
                            this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours][i].p1=[parseInt(tab[1],10) , parseInt(tab[2],10) ];
                            
                        }
                        if(elem.id_svg_table_mere===this.#souris_init_objet.id_svg_conteneur_table){
                         
                            var ref_elem=document.getElementById(elem.id_du_path);
                            var tab=ref_elem.getAttribute('d').split(' ');
                            this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.id_bdd_de_la_base_en_cours][i].p2=[parseInt(tab[8],10) , parseInt(tab[9],10) ];
                            
                        }
                    }
                }
            }
            
            this.#svg_ajuster_la_largeur_de_la_base(this.#souris_init_objet.id_svg_de_la_base_en_cours)
            


        }else{
         
            var ecart_de_temps=new Date(Date.now()).getTime()-this.#debut_de_click;
            console.log('ecart_de_temps=' , ecart_de_temps );
            if(ecart_de_temps>200 && ecart_de_temps<1500){

//                console.log('ici e=',e.target.nodeName + ' ' +e.target.getAttribute('type_element'));
                if(e.target.nodeName.toLowerCase()==='text'){
                    if(e.target.getAttribute('type_element')==="texte_de_nom_de_table"){
                        this.#modale_modifier_la_table(e.target.parentNode);
                    }else if(e.target.getAttribute('type_element')==="texte_de_champ"){
                        this.#modale_modifier_le_champ(e.target.parentNode);
                     
                    }
                }else if(e.target.nodeName.toLowerCase()==='rect'){
                    if(e.target.getAttribute('type_element')==="rectangle_de_nom_de_table"){
                        this.#modale_modifier_la_table(e.target.parentNode);
                    }else if(e.target.getAttribute('type_element')==="rectangle_de_champ"){
                        this.#modale_modifier_le_champ(e.target.parentNode);
                    }
                }
            }
        }
        /*
        maj de this.#id_bdd_de_la_base_en_cours avec id_bdd_de_la_base_en_cours de g
        */
//        debugger
        var element=e.target;
        var nom_tag=element.nodeName.toLowerCase();
        var parent=null;
        if(nom_tag!=='html'){
            parent=element;
            
            while(nom_tag!=='html'){
             if(nom_tag==='g'){
              if(element.getAttribute('id_bdd_de_la_base_en_cours')){
               this.#id_bdd_de_la_base_en_cours=element.getAttribute('id_bdd_de_la_base_en_cours');
              }
             }
             element=element.parentNode;
             nom_tag=element.nodeName.toLowerCase(); 
             
            }
        }
//        console.log('this.#id_bdd_de_la_base_en_cours=' , this.#id_bdd_de_la_base_en_cours );
        
        
     
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
    
//       console.log('souris_bas e=',e);
       this.#souris_init_objet={x:e[this.#propriete_pour_deplacement_x], y:e[this.#propriete_pour_deplacement_y]};
       this.#souris_element_a_deplacer='';
       this.#debut_de_click=new Date(Date.now()).getTime();
//       console.log('this.#debut_de_click=' , this.#debut_de_click );
       var tar=e.target;
       /*
         que clique-t-on ?
       */
       if(tar.tagName.toLowerCase()==='svg'){
        
         /* 
           si on bouge toute la zone svg, il faut modifier le viewbox 
         */
         
        this.#souris_init_objet.elem_bouge=tar;
        this.#souris_init_objet.param_bouge={x:tar.viewBox.baseVal.x , y:tar.viewBox.baseVal.y };

        this.#souris_element_a_deplacer='svg';

        this.#div_svg.style.userSelect='none';
        
       }else{
        
           /* sinon, on recherche l'élément parent de type g pour modifier le translate si c'est une table ou une base */
           if(tar.getAttribute('type_element')){
            
               if(tar.getAttribute('type_element')==='rectangle_de_base'){

                   var valeur_translate=tar.parentNode.getAttribute('transform').replace(/translate\(/g,'').replace(/\)/g,'').split(',');
                   this.#souris_init_objet.id_svg_conteneur_base=tar.parentNode.id;
                   this.#souris_init_objet.elem_bouge=tar.parentNode;
                   this.#souris_init_objet.param_bouge={x:parseFloat(valeur_translate[0]) , y:parseFloat(valeur_translate[1]) };
                   this.#souris_element_a_deplacer='rectangle_de_base';
                   this.#div_svg.style.userSelect='none';
                 
                   this.#id_svg_de_la_base_en_cours=parseInt(tar.getAttribute('id_svg_de_la_base_en_cours'),10);
                   this.#id_bdd_de_la_base_en_cours=parseInt(tar.getAttribute('id_bdd_de_la_base_en_cours'),10);
               }else if(tar.getAttribute('type_element')==='rectangle_de_nom_de_table'){
                   this.#id_svg_de_la_base_en_cours=parseInt(tar.getAttribute('id_svg_de_la_base_en_cours'),10);
                   this.#id_bdd_de_la_base_en_cours=parseInt(tar.getAttribute('id_bdd_de_la_base_en_cours'),10);
               }
               return;
            
           }else{
            
               

               if(tar.tagName.toLowerCase()==='tspan' && tar.getAttribute('id_svg_conteneur_table') ){

                   var par=document.getElementById(tar.getAttribute('id_svg_conteneur_table'));
                   var valeur_translate=par.getAttribute('transform').replace(/translate\(/g,'').replace(/\)/g,'').split(',');
                   this.#souris_init_objet.id_svg_conteneur_table=parseInt(tar.getAttribute('id_svg_conteneur_table'),10);
                   this.#souris_init_objet.elem_bouge=par;
                   this.#souris_init_objet.param_bouge={x:parseFloat(valeur_translate[0]) , y:parseFloat(valeur_translate[1]) };
                   this.#souris_init_objet.id_bdd_de_la_base_en_cours=tar.getAttribute('id_bdd_de_la_base_en_cours');
                   this.#souris_init_objet.id_svg_de_la_base_en_cours=tar.getAttribute('id_svg_de_la_base_en_cours');

                   this.#souris_element_a_deplacer='table';
                   this.#div_svg.style.userSelect='none';
                   
                   this.#id_svg_de_la_base_en_cours=parseInt(tar.getAttribute('id_svg_de_la_base_en_cours'),10);
                   this.#id_bdd_de_la_base_en_cours=parseInt(tar.getAttribute('id_bdd_de_la_base_en_cours'),10);
                   if(isNaN(this.#id_svg_de_la_base_en_cours)){
                    debugger;
                    
                   }

                   
                   return
               }else{
                /* on remonte la chaine pour voir si on est dans le svg */
                var a=e.target;
                while(a.tagName.toLowerCase()!=='html'){
                 if(a.tagName.toLowerCase==='g' && a.getAttribute('type_element') && a.getAttribute('type_element')==="conteneur_de_base"){
                   this.#id_svg_de_la_base_en_cours=parseInt(a.getAttribute('id_svg_de_la_base_en_cours'),10);
                   this.#id_bdd_de_la_base_en_cours=parseInt(a.getAttribute('id_bdd_de_la_base_en_cours'),10);
                   if(isNaN(this.#id_svg_de_la_base_en_cours)){
                    debugger;
                   }
                   
                   console.log('pas svg de base')
                   debugger
                   return;
                 }
                 a=a.parentNode;
                }
//                console.log('pas svg de base')
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
   #recursuf_arbre_svg(tab , id_parent , commencer_a , avec_index, element_parent ,position){
    
     var str='';
     var l01=tab.length;
     var temp='';
     var ne_pas_prendre=false;
     
     for(var i=commencer_a;i<l01;i++){
      if(tab[i]===null){
       continue
      }
      if(tab[i].id_parent===id_parent){
      
          var le_typa=tab[i].type;
          if(le_typa==='g'){
              if(avec_index===true ){
                  if(tab[i].proprietes.type_element==='conteneur_d_index'){
                      var  g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                      for(var j in tab[i].proprietes){
                          g.setAttribute(j, tab[i].proprietes[j]);
                          
                      }

                      g.setAttribute('transform','translate('+tab[i].proprietes['decallage_x']+','+position+')');
                      g.setAttribute('translate_y',position);
                      element_parent.appendChild(g);
                      this.#recursuf_arbre_svg(tab,i,i+1,avec_index,g,position);
                  }
              }else{
                 ne_pas_prendre=false;              
                 temp='<g';
                 for(var j in tab[i].proprietes){
                  
                     temp+=' '+j+'="'+tab[i].proprietes[j]+'"';
                     if(avec_index===false && j==='type_element' && tab[i].proprietes[j]==='conteneur_d_index' ){
                       ne_pas_prendre=true;
                     }
                     
                 }
                 
                 if(!ne_pas_prendre){
                   temp+='>';
                   temp+=this.#recursuf_arbre_svg(tab,i,i+1,avec_index,position);
                   temp+='</g>';
                   str+=temp;
                 }
              }
          }else{
              if(avec_index===true){
                 var  e = document.createElementNS("http://www.w3.org/2000/svg", le_typa);
                 for(var j in tab[i].proprietes){
                     e.setAttribute(j, tab[i].proprietes[j]);
                 }
                 if(tab[i].hasOwnProperty('contenu')){
                      e.innerHTML=tab[i].contenu;
                 }
                 element_parent.appendChild(e);
               
              }else{
                  str+='<'+le_typa;
                  
                  for(var j in tab[i].proprietes){
                      if(typeof tab[i].proprietes[j] === 'string'){
                          str+=' '+j+'="'+tab[i].proprietes[j].replace(/"/g,'&quot;')+'"';
                      }else{
                          str+=' '+j+'="'+tab[i].proprietes[j]+'"';
                      }
                      
                  }
                  if(tab[i].hasOwnProperty('contenu')){
                      str+='>'+tab[i].contenu+'</'+le_typa+'>';
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
   */
   #dessiner_le_svg(){
       var str='';
       /*
       pour chaque référence de base
       */
       var tableau_svg=[];
       
       for(var i in this.#arbre){
        
           var tab=JSON.parse(JSON.stringify(this.#arbre[i].arbre_svg));
           
           /* 
           il faut trouver le premier élément non null du tableau
           puis on dessine l'arbre sans les index car on a pu
           ajouter des champs après avoir mis les index
           
           */
           for(var j=0;j<tab.length;j++){
            if(tab[j]!==null){

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
       
       for(var i in this.#arbre){
           var tab=JSON.parse(JSON.stringify(this.#arbre[i].arbre_svg));
           /* 
             insertion des index dans le svg 
           */
           for(var j=0;j<tab.length;j++){
               if(tab[j]!==null){
                   if(tab[j].proprietes.type_element && tab[j].proprietes.type_element === 'conteneur_d_index' ){

                       var conteneur_de_table=this.#svg_dessin.getElementById(tab[j].id_parent);
                       var nombre_elements=conteneur_de_table.childNodes.length;
                       var position=(nombre_elements-1)*this.#hauteur_de_boite_affichage+this.#taille_bordure;
                       this.#recursuf_arbre_svg(tab,tab[j].id_parent,j,true,conteneur_de_table, position);
                   }
               }
           }
           
           /* 
             ajustement de la largeur et de la hauteur des tables 
           */
           for(var j=0;j<tab.length;j++){
               if(tab[j]!==null){
                   if(tab[j].proprietes.type_element && tab[j].proprietes.type_element === 'conteneur_de_table' ){
                       this.#svg_ajuster_la_largeur_des_boites_de_la_table([tab[j].id , tab[j].proprietes.id_bdd_de_la_base_en_cours]);
                   }
               }
           }
       }
       
       for(var i in tableau_svg){
         this.#svg_ajuster_la_largeur_de_la_base(tableau_svg[i]);
       }

    
   }
   
     /*
     ========================================================================================================
     function ajuster_largeur_de_boite
     */
     #ajuster_largeur_de_boite(largeur_de_la_boite,texte){

                                       
        var a=document.createElementNS("http://www.w3.org/2000/svg",'text');
        a.innerHTML=texte;
        a.setAttribute('x',10);
        a.setAttribute('y',20);
        this.#svg_dessin.appendChild(a);
        var b=a.getBBox();
        if(largeur_de_la_boite<(b.width+2)){
         largeur_de_la_boite=parseInt(b.width,10)+2*this.#taille_bordure;
        }
        a.remove();
        return(largeur_de_la_boite);
     }
        /*
        ========================================================================================================
        on parcours l'arbre svg pour reconstruire le rev
        function sauvegarder_la_base
        */
        sauvegarder_la_base(id_bdd_de_la_base){
            this.#id_bdd_de_la_base_en_cours=parseInt(id_bdd_de_la_base,10);
            clearMessages('zone_global_messages');
            var lst=document.getElementsByTagName('g');
            var racine_du_svg=null;

            for(var i=0;i<lst.length;i++){
                if( lst[i].getAttribute('id_bdd_de_la_base_en_cours') && lst[i].getAttribute('id_bdd_de_la_base_en_cours') == id_bdd_de_la_base){
                    racine_du_svg=lst[i];
                    break;
                }
            }
            if(racine_du_svg===null){
               
               logerreur({status : false , message:'0370 il y a eu un problème lors de la récupération de l\'arbre svg'});
               displayMessages('zone_global_messages');
               return;
            }
            this.#id_svg_de_la_base_en_cours=parseInt(racine_du_svg.getAttribute('id_svg_de_la_base_en_cours'),10);
            var t='';
            /*
              ce sont les rectangles qui contiennent les informations sur la base
            */
            lst=racine_du_svg.getElementsByTagName('rect');

            for(var i=0;i<lst.length;i++){
                 
                if( lst[i].getAttribute('type_element') && lst[i].getAttribute('type_element') == 'rectangle_de_base'){
//                    console.log(lst[i].getAttribute('type_element'))
                    t+='\nmeta(';

                    t+='\n   #(';
                    t+='\n     ============================';
                    t+='\n     données générales de la base';
                    t+='\n     ============================';
                    t+='\n   ),';

                    
                    var donnees_rev_meta_de_la_base=lst[i].getAttribute('donnees_rev_meta_de_la_base');
                    
                    if(donnees_rev_meta_de_la_base && donnees_rev_meta_de_la_base !==''){
                        var obj_matrice_meta_de_la_base=functionToArray(donnees_rev_meta_de_la_base , true, false , '');
                        if(obj_matrice_meta_de_la_base.status===true){
//                            console.log('obj_matrice_meta_de_la_base=' , obj_matrice_meta_de_la_base.value );

                            for(k=1;k<obj_matrice_meta_de_la_base.value.length;k++){
                                if(obj_matrice_meta_de_la_base.value[k][7] === 0 ){
                                    if(obj_matrice_meta_de_la_base.value[k][2]==='f' && obj_matrice_meta_de_la_base.value[k][1]==='' && obj_matrice_meta_de_la_base.value[k][8]===2){
                                        for(var l=k+1 ; k<obj_matrice_meta_de_la_base.value.length;k++){
                                           if(this.#liste_des_meta_base.includes(obj_matrice_meta_de_la_base.value[k][1])){
                                              t+='\n   ('+obj_matrice_meta_de_la_base.value[k][1]+' , '+maConstante(obj_matrice_meta_de_la_base.value[k+1])+'),';
                                           }
                                        }
                                    }
                                }
                            }

                         
                        }else{
                            logerreur({status : false , message:'0370 il y a eu un problème lors de la récupération des meta de la base'});
                            displayMessages('zone_global_messages');
                            return;
                        }
                    }

                    
                    for(var j=0;j<this.#liste_des_meta_base.length;j++){
                        if(lst[i].getAttribute('meta_'+this.#liste_des_meta_base[j]+'')){
//                         t+='\n   ('+this.#liste_des_meta_base[j]+' , "'+lst[i].getAttribute('meta_'+this.#liste_des_meta_base[j]).replace(/\\\'/g,'\'')+'"),'
                        }
                    }
                    t+='\n   (position_x_y_sur_svg ,\''+lst[i].parentNode.getAttribute('decallage_x')+','+lst[i].parentNode.getAttribute('decallage_y')+'\')';
                    t+='\n   (hauteur_sur_svg , '+lst[i].height.baseVal.value+'),';
                    t+='\n   (largeur_sur_svg , '+lst[i].width.baseVal.value+'),';

                    t+='\n),';
                    
                    
                    t+='\n#(';
                    t+='\n  ================';
                    t+='\n  liste des tables';
                    t+='\n  ================';
                    t+='\n),';
                }else if( lst[i].getAttribute('type_element') && lst[i].getAttribute('type_element') == 'rectangle_de_table'){
                    var nom_de_la_table=lst[i].getAttribute('nom_de_la_table');
                    t+='\n#(=================================================================)';
                    t+='\ncreate_table(';
                    t+='\n nom_de_la_table(\''+nom_de_la_table.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'),';
                    t+='\n meta(';
                    
                    var texte_des_meta_table='';      
                    var meta_rev_de_la_table=lst[i].getAttribute('meta_rev_de_la_table');
                    if(donnees_rev_meta_de_la_base && meta_rev_de_la_table!=='' ){
                        var obj_matrice_meta_de_la_table=functionToArray(meta_rev_de_la_table , true, false , '');
                        
                            if(obj_matrice_meta_de_la_table.status===true){
//                                console.log('obj_matrice_meta_de_la_table=' , obj_matrice_meta_de_la_table.value );

                                for(k=1;k<obj_matrice_meta_de_la_table.value.length;k++){
                                    if(obj_matrice_meta_de_la_table.value[k][7] === 0 ){
                                        if(obj_matrice_meta_de_la_table.value[k][2]==='f' && obj_matrice_meta_de_la_table.value[k][1]==='' && obj_matrice_meta_de_la_table.value[k][8]===2){
                                            for(var l=k+1 ; k<obj_matrice_meta_de_la_table.value.length;k++){
                                               if(this.#liste_des_meta_table.includes(obj_matrice_meta_de_la_table.value[k][1])){
                                                  texte_des_meta_table+='\n   ('+obj_matrice_meta_de_la_table.value[k][1]+' , '+maConstante(obj_matrice_meta_de_la_table.value[k+1])+'),';
                                               }
                                            }
                                        }
                                    }
                                }
                            }else{
                                logerreur({status : false , message:'0370 il y a eu un problème lors de la récupération des meta de la base'});
                                displayMessages('zone_global_messages');
                                return;
                            }
                        
                    }
                     

                    for(var j=0;j<this.#liste_des_meta_table.length;j++){
                        if(texte_des_meta_table.indexOf(this.#liste_des_meta_table[j])<0){
                            texte_des_meta_table+='\n   ('+this.#liste_des_meta_table[j]+' , \'à faire '+nom_de_la_table.replace(/\\/,'\\\\').replace(/\'/,'\\\'')+'\'),';
                        }
                    }
                    t+=texte_des_meta_table;
                    t+='\n   (position_x_y_sur_svg ,\''+lst[i].parentNode.getAttribute('decallage_x')+','+lst[i].parentNode.getAttribute('decallage_y')+'\')';
                    t+='\n ),';
                    t+='\n fields(';
                    
                    var lst2=lst[i].parentNode.getElementsByTagName('rect');
//                    console.log('lst2=' , lst2 );
                    for(var j=0;j<lst2.length;j++){
                        if( lst2[j].getAttribute('type_element') && lst2[j].getAttribute('type_element') == 'rectangle_de_champ'){
                           var nom_du_champ=lst2[j].getAttribute('nom_du_champ');
                           
                           var texte_des_meta_champ='';
                           var texte_type_et_contraintes='';
                           var donnees_rev_du_champ=lst2[j].getAttribute('donnees_rev_du_champ');
                           
                           var obj_matrice_du_champ=functionToArray(donnees_rev_du_champ , true, false , '');
                           if(obj_matrice_du_champ.status===true){
                            
                               for(var k=1;k<obj_matrice_du_champ.value.length;k++){
                                   if(obj_matrice_du_champ.value[k][7] === 0 ){
                                       if(obj_matrice_du_champ.value[k][2]==='f'){
                                           if(obj_matrice_du_champ.value[k][1]==='nom_du_champ'  ){
                                            /* on a déjà écrit le champ */
                                           }else if( obj_matrice_du_champ.value[k][1]==='meta' ){
                                            
                                               for(l=k+1;l<obj_matrice_du_champ.value.length;l++){
                                                   if(obj_matrice_du_champ.value[l][7] === k ){
                                                       if(obj_matrice_du_champ.value[l][2]==='f' && obj_matrice_du_champ.value[l][1]==='' && obj_matrice_du_champ.value[l][8]===2){
                                                           for(var l=l+1 ; l<obj_matrice_du_champ.value.length;l++){
                                                              if(this.#liste_des_meta_champ.includes(obj_matrice_du_champ.value[l][1])){
                                                                 texte_des_meta_champ+='\n    ('+obj_matrice_du_champ.value[l][1]+' , '+maConstante(obj_matrice_du_champ.value[l+1])+'),';
                                                              }
                                                           }
                                                       }
                                                   }
                                               }
                                               
                                               for(var l=0;l<this.#liste_des_meta_table.length;l++){
                                                   if(texte_des_meta_champ.indexOf(this.#liste_des_meta_champ[l])<0){
                                                       texte_des_meta_champ+='\n    ('+this.#liste_des_meta_champ[l]+' , \'à faire '+nom_du_champ.replace(/\\/,'\\\\').replace(/\'/,'\\\'')+'\'),';
                                                   }
                                               }
                                            
                                            
                                           }else{ 
                                               if(obj_matrice_du_champ.value[k][8]===0){
                                                    texte_type_et_contraintes+='\n   '+obj_matrice_du_champ.value[k][1]+'(),';
                                               }else{
                                                   var obj1=a2F1(obj_matrice_du_champ.value , k , false , k+1 , false);
                                                   if(obj1.status===true){
                                                       texte_type_et_contraintes+='\n   '+obj_matrice_du_champ.value[k][1]+'('+obj1.value+'),';
                                                   }else{
                                                       logerreur({status : false , message:'0465 il y a eu un problème sur le champ '+nom_du_champ+''});
                                                       displayMessages('zone_global_messages');
                                                       return;
                                                   }
                                               }
                                           }
                                       }
                                   }
                               }
                               if(texte_des_meta_champ===''){
                                   for(var k=0;k<this.#liste_des_meta_table.length;k++){
                                       texte_des_meta_champ+='\n    ('+this.#liste_des_meta_champ[k]+' , \'à faire '+nom_du_champ.replace(/\\/,'\\\\').replace(/\'/,'\\\'')+'\'),';
                                   }
                               }
                            
                           }else{
                               logerreur({status : false , message:'0465 il y a eu un problème sur le champ '+nom_du_champ+''});
                               displayMessages('zone_global_messages');
                               return;
                           }

                           t+='\n  field(,';
                           t+='\n   nom_du_champ(\''+nom_du_champ.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
                           t+=texte_type_et_contraintes;
                           t+='\n   meta('+texte_des_meta_champ+'\n   ),';
                           t+='\n  )';
                         
                        }
                     
                    }
                    
                    
                    t+='\n ),';
                    t+='\n)';
                }else if( lst[i].getAttribute('type_element') && lst[i].getAttribute('type_element') == 'rectangle_d_index'){
                 
                            t+='\nadd_index(';
                            var nom_de_la_table_pour_l_index= lst[i].getAttribute('nom_de_la_table_pour_l_index');
                            t+='\n nom_de_la_table_pour_l_index('+nom_de_la_table_pour_l_index+'),';
                            
                            var donnees_rev_de_l_index= lst[i].getAttribute('donnees_rev_de_l_index');
                            var obj_matrice_du_champ=functionToArray(donnees_rev_de_l_index , true, false , '');
                            if(obj_matrice_du_champ.status===true){
                             
                             for(k=1;k<obj_matrice_du_champ.value.length;k++){
                                 if(obj_matrice_du_champ.value[k][7] === 0 ){
                                     if(obj_matrice_du_champ.value[k][2]==='f'){
                                         if(obj_matrice_du_champ.value[k][1]==='nom_de_la_table_pour_l_index' || obj_matrice_du_champ.value[k][1]==='meta' ){
                                         }else{ 
                                             if(obj_matrice_du_champ.value[k][8]===0){
                                                  t+='\n   '+obj_matrice_du_champ.value[k][1]+'(),';
                                             }else{
                                                 var obj1=a2F1(obj_matrice_du_champ.value , k , false , k+1 , false);
                                                 if(obj1.status===true){
                                                     t+='\n   '+obj_matrice_du_champ.value[k][1]+'('+obj1.value+'),';
                                                 }else{
                                                     logerreur({status : false , message:'0465 il y a eu un problème sur le champ '+nom_du_champ+''});
                                                     displayMessages('zone_global_messages');
                                                     return;
                                                 }
                                             }
                                         }
                                     }
                                 }
                             }
                             
                            }else{
                                logerreur({status : false , message:'0465 il y a eu un problème sur le champ '+nom_du_champ+''});
                                displayMessages('zone_global_messages');
                                return;
                            }
                            
                            
                            t+='\n)';
                 
                }
            }
//            console.log('t=',t);
            

            async function envoyer_le_rev_de_le_base_en_post(url = "", donnees ) {
                // Les options par défaut sont indiquées par *
                var response = await fetch(url, {
                    /* *GET, POST, PUT, DELETE, etc. */
                    method: "POST", 
                    /* no-cors, *cors, same-origin */
                    
                    mode: "cors",   
                    /* default, no-cache, reload, force-cache, only-if-cached */
                    cache: "no-cache", 
                    /* include, *same-origin, omit */
                    credentials: "same-origin", 
                    /* "Content-Type": "application/json"   'Content-Type': 'application/x-www-form-urlencoded'  */
                    headers: {
            //          "Content-Type": "application/json",
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //        body: JSON.stringify({ajax_param:donnees}), // le type utilisé pour le corps doit correspondre à l'en-tête "Content-Type"
                    body: 'ajax_param='+encodeURIComponent(JSON.stringify(donnees))
                });
                return response.json(); // convertit la réponse JSON reçue en objet JavaScript natif
            }
            
            var ajax_param={
                call:{
                 'lib'                       : 'core'   ,
                 'file'                      : 'bdd'  ,
                 'funct'                     : 'envoyer_le_rev_de_le_base_en_post' ,
                },
                source_rev_de_la_base        : t,
                id_bdd_de_la_base            : id_bdd_de_la_base ,
            }
            
            envoyer_le_rev_de_le_base_en_post('za_ajax.php?envoyer_le_rev_de_le_base_en_post', ajax_param).then(
                function(donnees){
//                    console.log(donnees); // Les données JSON analysées par l'appel `donnees.json()`
                    if(donnees.status==='OK'){
                    }
                }
            );
            
            
            
        }
        
        /*
        ========================================================================================================
        function ajouter_table_a_svg
        */
        
        #ajouter_table_a_svg(nom_de_la_table ,indice_courant , position_de_la_table , meta_rev_de_la_table ){
         
            /*
              conteneur de la table
            */
            var id_svg_conteneur_table=indice_courant;

            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={
                type:'g'   ,id:indice_courant ,id_parent:this.#id_svg_de_la_base_en_cours , 
                proprietes:{
                    id                         : indice_courant,
                    type_element               : 'conteneur_de_table',
                    id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                    id_bdd_de_la_base_en_cours : this.#id_bdd_de_la_base_en_cours,
                    id_svg_conteneur_table     : id_svg_conteneur_table,
                    nom_de_la_table            : nom_de_la_table ,
                    decallage_x                : position_de_la_table[0],
                    decallage_y                : position_de_la_table[1],
                    transform:'translate('+(position_de_la_table[0])+','+(position_de_la_table[1])+')',
                }
            };
            indice_courant++;
            /*
              rectangle de la table
            */
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={
             type:'rect','data-type':'table',id:indice_courant ,id_parent:id_svg_conteneur_table , 
             proprietes:{
              id                     : indice_courant,
              type_element           : 'rectangle_de_table',
              id_svg_de_la_base_en_cours   : this.#id_svg_de_la_base_en_cours,
              id_svg_conteneur_table  : id_svg_conteneur_table,
              nom_de_la_table        : nom_de_la_table ,
              x:0,y:0,width:20,height:50,style:"stroke:blue;stroke-width:"+this.#taille_bordure+";fill:yellow;fill-opacity:1;" ,
              meta_rev_de_la_table   : meta_rev_de_la_table,
             }
            };
         
         
            return {indice_svg_rectangle:indice_courant,id_svg_conteneur_table:id_svg_conteneur_table};
        }
        
        /*
        ========================================================================================================
        function ajouter_nom_de_table_au_svg
        */
        #ajouter_nom_de_table_au_svg(nom_de_la_table , indice_courant , id_svg_conteneur_table , largeur_de_la_boite  ){
            var id_svg_champ_en_cours=indice_courant;
            var id_svg_rectangle_du_nom_de_la_table=0;
         
            
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={
                type:'g'   ,id:indice_courant ,id_parent:id_svg_conteneur_table , 
                proprietes:{
                    id:indice_courant,
                    type_element : 'conteneur_de_nom_de_table',
                    id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                    id_bdd_de_la_base_en_cours : this.#id_bdd_de_la_base_en_cours,
                    id_svg_conteneur_table : id_svg_conteneur_table,
                    id_svg_champ_en_cours : id_svg_champ_en_cours,
                    nom_de_la_table       : nom_de_la_table ,
                    decallage_x           : this.#taille_bordure,
                    decallage_y           : this.#taille_bordure,
                    transform:'translate('+this.#taille_bordure+','+this.#taille_bordure+')' ,
                }
            };
            indice_courant++;

            /*
              rectangle du nom de la table
              
            */
            id_svg_rectangle_du_nom_de_la_table=indice_courant;
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={
                type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                proprietes:{
                    id:indice_courant,
                    type_element : 'rectangle_de_nom_de_table',
                    id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                    id_bdd_de_la_base_en_cours : this.#id_bdd_de_la_base_en_cours,
                    id_svg_conteneur_table : id_svg_conteneur_table,
                    id_svg_champ_en_cours : id_svg_champ_en_cours,
                    nom_de_la_table       : nom_de_la_table ,
                    x:0,
                    y:0,
                    width:18,
                    height:this.#hauteur_de_boite,
                    style:"stroke:white;stroke-width:"+this.#taille_bordure+";fill:red;fill-opacity:1;" 
                }
            };
            indice_courant++;


            
             /*
               texte du nom de la table
             */
            this.#arbre[this.#id_bdd_de_la_base_en_cours].arbre_svg[indice_courant]={
                type:'text',id:indice_courant ,id_parent:indice_courant-2     , 
                contenu:'<tspan style="cursor:move;" id_svg_conteneur_table="'+id_svg_conteneur_table+'" id_bdd_de_la_base_en_cours="'+this.#id_bdd_de_la_base_en_cours+'" id_svg_de_la_base_en_cours="'+this.#id_svg_de_la_base_en_cours+'">🟥</tspan>'+nom_de_la_table ,
                proprietes:{
                    id:indice_courant,
                    type_element : 'texte_de_nom_de_table',
                    id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                    id_bdd_de_la_base_en_cours : this.#id_bdd_de_la_base_en_cours,
                    id_svg_conteneur_table : id_svg_conteneur_table,
                    id_svg_champ_en_cours : id_svg_champ_en_cours,
                    nom_de_la_table       : nom_de_la_table ,
                    x:this.#taille_bordure,
                    y:this.#hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-this.#taille_bordure,
                    style:"fill:white;cursor:context-menu;" , 
                }
            };
            indice_courant++;
            largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_la_table+'🟥'); // ↔ 🟥
         
            return {largeur_de_la_boite:largeur_de_la_boite , id_svg_rectangle_du_nom_de_la_table:id_svg_rectangle_du_nom_de_la_table};
            
         
        }
    /*
      ===============================================================================================================================================
      function ajouter_champ_a_arbre
    */    
    #ajouter_champ_a_arbre(nom_du_champ,indice_courant,id_svg_conteneur_table,nom_de_la_table,id_bdd_de_la_base,numero_de_boite,donnees_rev_du_champ){
     
        var id_svg_table_mere=-1;
        var id_svg_champ_pere=-1;
        var nom_de_la_table_mere='';
        var nom_du_champ_pere='';
        var a_des_references=false;
        
        var id_svg_champ_en_cours=indice_courant;
        /*
          création de la boite du champ
        */
        
        
        /*
          conteneur du nom du champ
        */

        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
            type:'g'   ,id:indice_courant ,id_parent:id_svg_conteneur_table , 
            proprietes:{
                id:indice_courant,
                type_element               : 'conteneur_de_champ'  ,
                id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours  ,
                id_svg_conteneur_table     : id_svg_conteneur_table ,
                id_svg_champ_en_cours      : id_svg_champ_en_cours ,
                nom_de_la_table            : nom_de_la_table       ,
                nom_du_champ               : nom_du_champ          ,
                decallage_x                : this.#taille_bordure,
                decallage_y                : 0,// ((this.#hauteur_de_boite_affichage)*(numero_de_boite)+this.#taille_bordure),
                transform                  : 'translate(0,0)', //+(this.#taille_bordure)+','+((this.#hauteur_de_boite_affichage)*(numero_de_boite)+this.#taille_bordure)+')',
            }
        };
        indice_courant++;
        
        /*
          rectangle du nom du champ
        */
        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
            type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
            proprietes:{
                id:indice_courant,
                type_element : 'rectangle_de_champ',
                id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                id_svg_conteneur_table : id_svg_conteneur_table,
                id_svg_champ_en_cours : id_svg_champ_en_cours,
                nom_de_la_table       : nom_de_la_table ,
                nom_du_champ          : nom_du_champ          ,
                x:0,y:0,width:18,height:this.#hauteur_de_boite,style:"stroke:gold;stroke-width:"+this.#taille_bordure+";fill:pink;fill-opacity:0.2;" , 
                donnees_rev_du_champ  : donnees_rev_du_champ  ,
                
            }
        };
        indice_courant++;
        var indice_du_champ=indice_courant-1;
        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_du_champ].proprietes['__id_svg_champ']=indice_du_champ;
        
        
        
        /*
          texte du nom du champ
        */
        this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
            type:'text',id:indice_courant ,id_parent:indice_courant-2     , 
            contenu:nom_du_champ ,
            proprietes:{
                id:indice_courant,
                type_element : 'texte_de_champ',
                id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                id_svg_conteneur_table : id_svg_conteneur_table,
                id_svg_champ_en_cours : id_svg_champ_en_cours,
                nom_de_la_table       : nom_de_la_table ,
                nom_du_champ          : nom_du_champ          ,
                x:this.#taille_bordure,
                y:this.#hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-this.#taille_bordure,style:"fill:navy;" , 
            }
        };
        indice_courant++;
        if(donnees_rev_du_champ!==''){
            /*
              on va chercher les références croisées de ce champ
            */
            
            var obj=functionToArray(donnees_rev_du_champ,true,false,'');
            
            if(obj.status===true){
                var tab=obj.value;
                for(var o=1;o<tab.length;o++){
                    if(tab[o][7]===0){
                     
                        if('references'===tab[o][1] && tab[o][8]===2 ){
                           a_des_references=true;
                           
                           for(var i in this.#arbre[id_bdd_de_la_base].arbre_svg){
                            var elem=this.#arbre[id_bdd_de_la_base].arbre_svg[i];
                            if(elem.proprietes.type_element==='conteneur_de_table' && elem.proprietes.nom_de_la_table===tab[o+1][1]){
                             id_svg_table_mere=parseInt(elem.proprietes.id,10);
                            }
                            if(elem.proprietes.type_element==='conteneur_de_champ' && elem.proprietes.id_svg_conteneur_table===id_svg_table_mere && elem.proprietes.nom_du_champ === tab[o+2][1] ){
                             id_svg_champ_pere=parseInt(elem.proprietes.id,10);
                            }
                            if(id_svg_champ_pere>=0 && id_svg_table_mere>=0){
                             break;
                            }
                           }
                           nom_de_la_table_mere=tab[o+1][1];
                           nom_du_champ_pere=tab[o+1][1];
                        }
                    }
                }
            }else{
             logerreur({status : false , message:'1747'});
            }
            
        }
        if(a_des_references===true){
            if(id_svg_table_mere>=0 && id_svg_champ_pere>=0){
                var p1=[50,50];
                var p2=[0,0];
                this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base].push({
                    id_bdd_de_la_base_en_cours : this.#id_bdd_de_la_base_en_cours,
                    id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                    id_svg_table_mere     : id_svg_table_mere       ,
                    id_svg_champ_pere     : id_svg_champ_pere       ,
                    id_svg_table_fille    : id_svg_conteneur_table  ,
                    id_svg_champ_fils     : id_svg_champ_en_cours   ,
                    nom_table_fille       : nom_de_la_table         ,
                    nom_du_champ_fils     : nom_du_champ            ,
                    nom_de_la_table_mere  : nom_de_la_table_mere    ,
                    nom_du_champ_pere     : nom_du_champ_pere       ,
                    id_du_path            : indice_courant          ,
                    p1                    : p1                      ,
                    p2                    : p2                      ,
                });
                /*
                 <path d=" M -63 -9 C 53 -6 132 71 176 31 " stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform=""></path>
                */
                
                var d='M '+p1[0]+' '+p1[1]   +   ' C '+(p1[0]-30)+' '+p1[1]  +    ' '+(p2[0]+30)+' '+p2[1]   +     ' '+p2[0]+' '+p2[1]    ;
                this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                    type:'path',id:indice_courant ,id_parent:this.#id_svg_de_la_base_en_cours , 
                    proprietes:{
                        id                   : indice_courant ,
                        d                    : d ,
                        type_element         : 'reference_croisée'    ,
                        id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours ,
                        id_svg_table_mere    : id_svg_table_mere      ,
                        id_svg_champ_pere    : id_svg_champ_pere      ,
                        id_svg_table_fille   : id_svg_conteneur_table ,
                        id_svg_champ_fils    : id_svg_champ_en_cours  ,
                        style                : 'stroke:hotpink;stroke-width:'+(this.#taille_bordure*3)+';fill:transparent;stroke-linejoin:round;stroke-linecap:round;',
                    }
                };
                indice_courant++;
            }
        }
        

        
        return {indice_du_champ:indice_du_champ, id_svg_champ_en_cours:id_svg_champ_en_cours,indice_courant:indice_courant};
    }   
    /*
      ========================================================================================================
      function charger_les_bases
    */
    #charger_les_bases_en_asynchrone(les_id_des_bases){
     
        async function recuperer_les_donnees_de_le_base_en_post(url = "", donnees ) {
            // Les options par défaut sont indiquées par *
            const response = await fetch(url, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors",   // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
        //          "Content-Type": "application/json",
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //        body: JSON.stringify({ajax_param:donnees}), // le type utilisé pour le corps doit correspondre à l'en-tête "Content-Type"
                body: 'ajax_param='+encodeURIComponent(JSON.stringify(donnees))
            });
            return response.json(); // convertit la réponse JSON reçue en objet JavaScript natif
        }
        
        var ajax_param={
            call:{
             'lib'                       : 'core'   ,
             'file'                      : 'bdd'  ,
             'funct'                     : 'recuperer_zone_travail_pour_les_bases' ,
            },
            les_id_des_bases:les_id_des_bases,
        }
       
       recuperer_les_donnees_de_le_base_en_post('za_ajax.php?recuperer_zone_travail_pour_les_bases', ajax_param).then(
           (donnees) => {
   //            console.log(donnees); // Les données JSON analysées par l'appel `donnees.json()`
               if(donnees.status==='OK'){
                   var nouvel_arbre={};
                   for(var i in donnees.valeurs){
                      
                      this.#arbre[donnees.valeurs[i]['T0.chi_id_basedd']]={
                        'chp_rev_travail_basedd':donnees.valeurs[i]['T0.chp_rev_travail_basedd'],
                        'arbre_svg':[], // {type:'racine_svg',id:-2,id_parent:-2,donnees:{}}
                        'chp_nom_basedd' : donnees.valeurs[i]['T0.chp_nom_basedd']
                      };

                      if(donnees.valeurs[i]['T0.chp_rev_travail_basedd']==='' || donnees.valeurs[i]['T0.chp_rev_travail_basedd']===null){
                          logerreur({status : false , message:'0803 le champ chp_rev_travail_basedd est vide [module_svg[charger_les_bases_en_asynchrone]]'});
//                          displayMessages('zone_global_messages');
//                          return;
                       
                      }
                      var obj1=functionToArray(donnees.valeurs[i]['T0.chp_rev_travail_basedd'],true,false,'');
                      if(obj1.status===true){
                          this.#arbre[donnees.valeurs[i]['T0.chi_id_basedd']]['matrice']=obj1.value;
                          
                          
                      }else{
                          logerreur({status : false , message:'0126'});
                          displayMessages('zone_global_messages');
                          return;
                      }
                   }
                   

//                   console.log( CSS_TAILLE_REFERENCE_TEXTE , CSS_TAILLE_REFERENCE_PADDING , this.#taille_bordure );
                   
                   
                   var indice_courant=0;
                   var tableau_des_elements=[];

                   var decallage_droite_table=10;
                   var position_xy_table=[decallage_droite_table,10];
                   var id_svg_conteneur_table=0;
                   var id_tab_table_en_cours=0;
                   var largeur_de_la_boite=1;
                   var nom_de_la_table='';
                   var nom_du_champ='';
                   var id_tab_champ_en_cours=0;
                   var nom_de_l_index='';
                   var liste_de_indices_des_elements_a_ajuster_en_largeur=[];
                   var max_x=0;
                   var max_y=0;
                   var position_min_haut=this.#position_min_gauche_de_reference;
                   var position_haut_de_la_table=0;
                   var position_min_gauche=this.#position_min_gauche_de_reference;
                   var position_max_bas=0;
                   var hauteur_de_la_table=0;
                   var indice_du_champ=0;
                   
                   var position_gauche_de_la_table=0;
                   var position_max_droite=0;
                   var largeur_de_la_table=0;
                   var tableau_des_references_croisees=[];
                   var id_svg_rectangle_base_en_cours=0;
                   var id_svg_conteneur_table=0;
                   var id_svg_champ_en_cours=0;
                   /* 
                     =============================
                     debut de pour chaque base 
                     =============================
                   */                
                   
                   for(var id_bdd_de_la_base in this.#arbre){
                       this.#id_bdd_de_la_base_en_cours=id_bdd_de_la_base;
                    
//                       console.log('indice de la base id_bdd_de_la_base=',id_bdd_de_la_base);
                       largeur_de_la_boite=1;
                       this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base]=[];

                       var tab=this.#arbre[id_bdd_de_la_base]['matrice'];
//                       console.log('tab=',tab);

                       this.#id_svg_de_la_base_en_cours=indice_courant;
                       this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                           type:'g'   ,
                           id:this.#id_svg_de_la_base_en_cours,
                           id_parent:-1, 
                           proprietes:{
                               type_element : 'conteneur_de_base',
                               id_bdd_de_la_base_en_cours : id_bdd_de_la_base ,
                               id:indice_courant,
                               id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                               transform:'translate(0,0)',
                               decallage_x:0,
                               decallage_y:0,
                           }
                       };
                       indice_courant++;
                       id_svg_rectangle_base_en_cours=indice_courant;
                       this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                           type:'rect',
                           id:indice_courant ,
                           id_parent:this.#id_svg_de_la_base_en_cours, 
                           proprietes:{
                               type_element : 'rectangle_de_base',
                               id_bdd_de_la_base_en_cours : id_bdd_de_la_base ,
                               id:indice_courant,
                               id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                               x:0,y:0,width:120,height:120,style:"stroke:red;stroke-width:"+this.#taille_bordure+";fill:yellow;fill-opacity:0.2;" 
                           }
                       };
                       indice_courant++;
                       var id_conteneur_texte_base=indice_courant;
                       this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                           type:'g'   ,
                           id:indice_courant,
                           id_parent:this.#id_svg_de_la_base_en_cours, 
                           proprietes:{
                               type_element : 'conteneur_du_texte_de_la_base',
                               id:indice_courant,
                               id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                               transform:'translate(0,0)',
                           }
                       };
                       indice_courant++;
                       
                       this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                           type:'text',id:indice_courant ,id_parent:indice_courant-1     , 
                           contenu:'('+id_bdd_de_la_base + ') ' + this.#arbre[id_bdd_de_la_base]['chp_nom_basedd'] + ' <a style="fill:green;" href="javascript:'+this.#nom_de_la_variable+'.sauvegarder_la_base(&quot;'+id_bdd_de_la_base+'&quot;)">sauvegarder</a>',
                           proprietes:{
                               id:indice_courant,
                               type_element : 'texte_id_bdd_de_la_base',
                               id_svg_de_la_base_en_cours : this.#id_svg_de_la_base_en_cours,
                               x:this.#taille_bordure,
                               y:this.#taille_bordure+CSS_TAILLE_REFERENCE_TEXTE,
                               style:"fill:blue;" , 
                           }
                       };
                       indice_courant++;
                       
                       

                       tableau_des_references_croisees=[];

                       var l01=tab.length;
                       /*
                         ======================================
                         recherche des meta de la base i
                         ======================================
                       */
                       for(var j_dans_tab=1;j_dans_tab<l01;j_dans_tab++){

                        
                           if( tab[j_dans_tab][3]===0 && tab[j_dans_tab][1]==='meta' && tab[j_dans_tab][2]==='f'  ){

                              var obj1=a2F1(tab,j_dans_tab,false,j_dans_tab+1,false);
                              if(obj1.status===true){
//                                  console.log('obj1.value=',obj1.value);
                                  var donnees_rev_meta_de_la_base=obj1.value;
                              }else{
                                  logerreur({status : true , message : '0760 problème sur les données de la base "'+this.#arbre[id_bdd_de_la_base]['chp_nom_basedd']+'"' });
                                  displayMessages('zone_global_messages');
                              }
                              this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes['donnees_rev_meta_de_la_base']=donnees_rev_meta_de_la_base;

                           }
                           if( tab[tab[tab[j_dans_tab][7]][7]][1]==='meta' && tab[j_dans_tab][3]===2 && tab[tab[j_dans_tab][7]][1]===''  ){
                            
                            
                            
                               /*
                                on commence par les propriétés de la base
                               */
                               if(tab[j_dans_tab][1]==='position_x_y_sur_svg' ){

                                   var tt=tab[j_dans_tab+1][1].split(',')
                                   tt[0]=parseInt(tt[0]);
                                   tt[1]=parseInt(tt[1]);
                                   if(this.#taille_bordure%2!==0){
                                       /* si la taille de la bordure est impaire */
                                       tt[0]+=0.5;
                                       tt[1]+=0.5;
                                   }
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[this.#id_svg_de_la_base_en_cours].proprietes.decallage_x=tt[0];
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[this.#id_svg_de_la_base_en_cours].proprietes.decallage_y=tt[1];
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[this.#id_svg_de_la_base_en_cours].proprietes.transform='translate('+tt[0]+','+tt[1]+')';
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[this.#id_svg_de_la_base_en_cours].proprietes.decallage_x=tt[0];
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[this.#id_svg_de_la_base_en_cours].proprietes.decallage_y=tt[1];


                               }else if(tab[j_dans_tab][1]==='hauteur_sur_svg' ){
                                
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.height=tab[j_dans_tab+1][1];

                               }else if(tab[j_dans_tab][1]==='largeur_sur_svg' ){
                                
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.width=tab[j_dans_tab+1][1];
                                   
                               }
                           }
                       }


                       /*
                         =====================================
                         debut de recherche des create_table
                         =====================================
                       */
                       
                       position_xy_table=[decallage_droite_table,10];
                       for(var j_dans_tab=1;j_dans_tab<l01;j_dans_tab++){
                        
                           if(tab[j_dans_tab][7]===0 && tab[j_dans_tab][1]==='create_table'){
                               id_tab_table_en_cours=j_dans_tab;
                               hauteur_de_la_table=0;
                               /*
                                 =======================================================================
                                 début rechercher le nom de la table pour créer le conteneur et la boite
                                 =======================================================================
                               */
                               for(var i=id_tab_table_en_cours+1;i<l01 && tab[i][3]>tab[id_tab_table_en_cours][3];i++){
                                
                                   if(tab[i][7]===id_tab_table_en_cours){
                                    
                                       if('nom_de_la_table'===tab[i][1]){
                                        
                                        
                                           nom_de_la_table=tab[i+1][1];
                                           id_svg_conteneur_table=indice_courant;
                                           
                                           var position_de_la_table=[0,0];
                                        
                                           /*
                                             ======================
                                             recherche des meta
                                             ======================
                                           */
                                           var meta_rev_de_la_table='';
                                           var continuer=true;
                                           for(var j=id_tab_table_en_cours+1;j<l01 && tab[j][3]>tab[id_tab_table_en_cours][3] && continuer===true ;j++){
                                            
                                               if(tab[j][7]===id_tab_table_en_cours && 'meta'===tab[j][1] ){
                                                
                                                  var obj=a2F1(tab,j,false,j+1,false);
                                                  if(obj.status===true){
                                                   meta_rev_de_la_table=obj.value;
                                                   
                                                  }else{
                                                      logerreur({status : true , message : '0883 le meta de la table "'+nom_de_la_table+'"' });
                                                      displayMessages('zone_global_messages');
                                                      return;
                                                  }
                                                
                                                   for(var l=j+1;l<l01 && tab[l][3]>tab[j][3]  && continuer===true ;l++){
                                                    
                                                       if(tab[l][7]===j && tab[l][1]=='' && tab[l][8]===2){
                                                       


                                                           if(tab[l+1][1]==='position_x_y_sur_svg'){
                                                            
                                                               position_de_la_table=tab[l+2][1].split(',');
                                                               continuer=false;
                                                               break;
                                                           }
                                                       }
                                                   }                                    
                                               }
                                           }
                                           
                                        
                                           
                                           var a=this.#ajouter_table_a_svg(nom_de_la_table , indice_courant , position_de_la_table , meta_rev_de_la_table);
                                           indice_courant+=2;
                                           id_svg_conteneur_table=a.id_svg_conteneur_table;
                                           liste_de_indices_des_elements_a_ajuster_en_largeur=[a.indice_svg_rectangle];
                                           
                                           position_gauche_de_la_table = parseFloat(position_de_la_table[0]);
                                           position_haut_de_la_table   = parseFloat(position_de_la_table[1]);
                                        
                                           id_svg_champ_en_cours=indice_courant;
                                           
                                           
                                           var a=this.#ajouter_nom_de_table_au_svg(nom_de_la_table , indice_courant ,id_svg_conteneur_table , largeur_de_la_boite  );
                                           indice_courant+=3;
                                           largeur_de_la_boite=a.largeur_de_la_boite;
                                           liste_de_indices_des_elements_a_ajuster_en_largeur.push(a.id_svg_rectangle_du_nom_de_la_table);
                                           hauteur_de_la_table+=this.#hauteur_de_boite_affichage;
                                        
                                        
                                           
                                           
                                       }
                                   }
                               }
                               
                               
                               /*
                                 ================
                                 ajout des champs
                                 ================
                               */
                                    
                               /* on met les champs de la table  */
                               var numero_de_boite=1;
                               
                               for(var k=id_tab_table_en_cours+1;k<l01 && tab[k][3]>tab[id_tab_table_en_cours][3];k++){
                                 
                                   if(tab[k][7]===id_tab_table_en_cours && tab[k][1]==='fields'){
                                    
                                       for(var l=k+1;l<l01 && tab[l][3]>tab[k][3] ;l++){
                                           if(tab[l][7]===k){
                                            
                                               if(tab[l][1]=='field'){
                                                
                                                
                                               
                                                   for(var m=l+1;m<l01 && tab[m][3]>tab[l][3];m++){
                                                       if(tab[m][7]===l){
                                                        
                                                           if(tab[m][1]==='nom_du_champ'){

                                                               /*
                                                                 on recherche le nom du champ pour créer le conteneur et le cadre
                                                               */
                                                               
                                                               
                                                               nom_du_champ=tab[m+1][1];
                                                               var obj1=a2F1(tab,l,false,l+1,false);
                                                               if(obj1.status===true){
//                                                                   console.log('obj1.value=',obj1.value);
                                                                   var donnees_rev_du_champ=obj1.value;
                                                                   
                                                                   
                                                               }else{
                                                                   logerreur({status : true , message : '0849 problème sur les données du champ "'+nom_du_champ+'"' });
                                                                   displayMessages('zone_global_messages');
                                                                   return;
                                                               }
                                                                   
                                                               
                                                               

                                                               var a=this.#ajouter_champ_a_arbre(nom_du_champ,indice_courant,id_svg_conteneur_table,nom_de_la_table,id_bdd_de_la_base,numero_de_boite,donnees_rev_du_champ);
                                                               id_svg_champ_en_cours=a.id_svg_champ_en_cours;
                                                               indice_du_champ=a.indice_du_champ;
                                                               liste_de_indices_des_elements_a_ajuster_en_largeur.push(a.indice_du_champ);
                                                               indice_courant=a.indice_courant

                                                               
                                                               hauteur_de_la_table+=this.#hauteur_de_boite_affichage;


                                                               
                                                               numero_de_boite++;
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
                               for(var i=1;i<l01;i++){
                                   if(tab[i][7]===0 && tab[i][1]==='add_index'){
                                       for(var j=i+1;j<l01;j++){

                                           if(tab[j][7]===i && tab[j][1]==='nom_de_la_table_pour_l_index' && tab[j+1][1]===nom_de_la_table ){
                                               for(var k=i+1;k<l01 && tab[k][3]> tab[i][3];k++){
                                                   if(tab[k][7]===i){
                                                    
                                                       if('index_name'===tab[k][1]){
                                                        
                                                          nom_de_l_index=tab[k+1][1];
                                                          id_svg_champ_en_cours=indice_courant;
                                                                   
                                                        
                                                           
                                                        
//                                                          console.log('nom_de_la_table=',nom_de_la_table,'index',tab[k+1][1]);

                                                          
                                                           /*
                                                             création de la boite de l'index
                                                           */
                                                           
                                                           largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_l_index);
                                                           
                                                           
                                                           /*
                                                             conteneur du nom de l'index
                                                           */
                                                           this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                                            type:'g'   ,id:indice_courant ,id_parent:id_svg_conteneur_table , 
                                                            proprietes:{
                                                                id                           : indice_courant,
                                                                type_element                 : 'conteneur_d_index',
                                                                id_svg_de_la_base_en_cours   : this.#id_svg_de_la_base_en_cours,
                                                                id_svg_conteneur_table       : id_svg_conteneur_table,
                                                                nom_de_la_table_pour_l_index : nom_de_la_table ,
                                                                decallage_x                  : this.#taille_bordure,
                                                                decallage_y                  : ((this.#hauteur_de_boite_affichage)*(numero_de_boite)+this.#taille_bordure),
                                                                transform                    : 'translate('+this.#taille_bordure+','+((this.#hauteur_de_boite_affichage)*(numero_de_boite)+this.#taille_bordure)+')'}
                                                           };
                                                           indice_courant++;
                                                           
                                                           
                                                          var donnees_rev_de_l_index='';


                                                          var obj1=a2F1(tab,i,false,i+1,false);
                                                          if(obj1.status===true){
                                                           
//                                                              console.log('obj1.value=',obj1.value);
                                                              donnees_rev_de_l_index=obj1.value;

                                                          }else{
                                                           
                                                              logerreur({status : true , message : '0849 problème sur les données de l\'index "'+nom_de_l_index+'"' });
                                                              displayMessages('zone_global_messages');
                                                              
                                                          }
                                                          

                                                           
                                                           this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                                               type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                                                               proprietes:{
                                                                   id                           : indice_courant,
                                                                   type_element                 : 'rectangle_d_index',
                                                                   id_svg_de_la_base_en_cours   : this.#id_svg_de_la_base_en_cours,
                                                                   id_svg_conteneur_table       : id_svg_conteneur_table,
                                                                   nom_de_la_table_pour_l_index : nom_de_la_table ,
                                                                   nom_de_l_index               : nom_de_l_index ,
                                                                   donnees_rev_de_l_index       : donnees_rev_de_l_index,
                                                                   x:0,y:0,width:18,height:this.#hauteur_de_boite,style:"stroke:green;stroke-width:"+this.#taille_bordure+";fill:green;fill-opacity:0.2;" 
                                                               }
                                                           };
                                                           indice_courant++;
                                                           liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                           this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                                               type:'text',id:indice_courant ,id_parent:indice_courant-2     , contenu:nom_de_l_index ,
                                                               proprietes:{
                                                                   id                           : indice_courant  ,
                                                                   type_element                 : 'texte_d_index' ,
                                                                   id_svg_de_la_base_en_cours   : this.#id_svg_de_la_base_en_cours ,
                                                                   id_svg_conteneur_table       : id_svg_conteneur_table ,
                                                                   nom_de_la_table_pour_l_index : nom_de_la_table ,
                                                                   x:this.#taille_bordure,y:this.#hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-this.#taille_bordure,style:"fill:green;" 
                                                               }
                                                           };
                                                           indice_courant++;
                                                           

                                                           liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                           hauteur_de_la_table+=this.#hauteur_de_boite_affichage;
                                                           
                                                           numero_de_boite++;
                                                          
                                                       }
                                                   }
                                               }
                                           }
                                       }
                                   }
                               }

                               /*
                                 ajustement de la taille des tables
                               */
                               position_xy_table[0]+=largeur_de_la_boite+2*CSS_TAILLE_REFERENCE_MARGIN+4*this.#taille_bordure;
                               position_xy_table[1]+=20;
                               
                               for(var k=0;k<liste_de_indices_des_elements_a_ajuster_en_largeur.length;k++){
                                   /*
                                     le premier indice est le conteneur de la table
                                   */
                                   if(k===0){
                                       
                                       largeur_de_la_table=largeur_de_la_boite+2*this.#taille_bordure;
                                       this.#arbre[id_bdd_de_la_base].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_table;
                                       this.#arbre[id_bdd_de_la_base].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.height=hauteur_de_la_table+this.#taille_bordure;
                                       
                                       if(position_min_gauche>position_gauche_de_la_table-2*this.#taille_bordure){
                                        position_min_gauche=position_gauche_de_la_table-2*this.#taille_bordure;
                                       }
                                       if(position_min_haut>position_haut_de_la_table-2*this.#taille_bordure){
                                        position_min_haut=position_haut_de_la_table-2*this.#taille_bordure;
                                       }
                                       
                                       
                                       if( position_max_bas<position_haut_de_la_table+hauteur_de_la_table+this.#taille_bordure){
                                           position_max_bas=position_haut_de_la_table+hauteur_de_la_table+this.#taille_bordure;
                                       }
                                       
                                       if( position_max_droite<position_gauche_de_la_table+largeur_de_la_table){
                                           position_max_droite=position_gauche_de_la_table+largeur_de_la_table;
                                       }
                                       
                                       
                                       
                                   }else{
                                       this.#arbre[id_bdd_de_la_base].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_boite;
                                   }
                               }
                               
                               /* 
                                 fin de boucle sur j_dans_tab
                               */    
                           }
                           /*
                             finalement on ajuste la largeur de la boite contenant la base
                           */
                           if(position_min_gauche===this.#position_min_gauche_de_reference){
                           }else{
                             this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.x=position_min_gauche;
                             this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.y=position_min_haut;
                             if(position_max_bas+2*CSS_TAILLE_REFERENCE_MARGIN-position_min_haut<100){
                              this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.height=100;
                             }else{
                              this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.height=position_max_bas+2*CSS_TAILLE_REFERENCE_MARGIN-position_min_haut;
                             }
                             if(position_max_droite+2*CSS_TAILLE_REFERENCE_MARGIN-position_min_gauche<200){
                               this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.width=200;
                             }else{
                               this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.width=position_max_droite+2*CSS_TAILLE_REFERENCE_MARGIN-position_min_gauche;
                             }
                             this.#arbre[id_bdd_de_la_base].arbre_svg[id_conteneur_texte_base].proprietes.transform='translate('+position_min_gauche+','+position_min_haut+')';
                           }
                       }
                   }
                   /*
                     =============================
                     fin de pour chaque base
                     on peut afficher le svg
                     =============================
                   */

   //                console.log('this.#arbre=',this.#arbre)
                   
                   this.#dessiner_le_svg();

               }else{
                   logerreur({status : false  , message:'0132' });
                   displayMessages('zone_global_messages');
               }
           
           }
       );

    
   }
   /*
   ========================================================================================================
   function charger_les_bases_initiales
   */
   #charger_les_bases_initiales_en_asynchrone(){

    this.#arbre={};
    var les_id_des_bases=document.getElementById(this.#id_text_area_contenant_les_id_des_bases).value;
    
    var obj1=this.#charger_les_bases_en_asynchrone(les_id_des_bases);
    
    
    
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
//       console.log(e);
       if(e.ctrlKey===true){
         /*
         le controle zoom du navigateur ne doit pas zoomer le svg
         */
         return;
       }
       /*
         pour éviter de faire un défilement de page 
       */
       e.preventDefault();
       if(e.deltaY>0){
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
     
     var vb=this.#svg_dessin.getAttribute('viewBox');
     if(vb!=null){
     
      if(this.#_dssvg.zoom1==256 && n==2){
       // rien
      }else if(this.#_dssvg.zoom1==0.03125 && n==0.5){ // 0.03125 // 0.0625
       // rien
      }else{
          this.#_dssvg.zoom1=this.#_dssvg.zoom1*n;
          if(n===2){
              this.#_dssvg.viewBoxInit[2]*=2;
              this.#_dssvg.viewBoxInit[3]*=2;
          }else{
              this.#_dssvg.viewBoxInit[2]/=2;
              this.#_dssvg.viewBoxInit[3]/=2;
          }
          this.setAttributeViewBox();  
          this.#rayonPoint=this.#_dssvg.parametres.rayonReference/this.#_dssvg.zoom1;
          this.#strkWiTexteSousPoignees=this.#rayonPoint/20;
          this.#fontSiTexteSousPoignees=this.#rayonPoint;
      }
     }
    }
   
   
    //========================================================================================================
    setAttributeViewBox(){
        this.#svg_dessin.setAttribute('viewBox',this.#_dssvg.viewBoxInit.join(' '));
        /*
         this.#_dssvg.zoom1=0.5 => zoom*2 on voit en grand
        */
        if(this.#_dssvg.zoom1>=2){
            /* si tout est affiché en petit, on met un fond roze avec des tailles de carrés de 100 px */
            this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M 0 0 l 100 100 l 0 -100 l -100 100 Z" fill="pink" fill-opacity=".30"/%3E%3C/svg%3E\')';
            this.#div_svg.style.backgroundSize=(100/this.#_dssvg.zoom1)+'px';
            this.#div_svg.style.backgroundPositionX=(-(this.#_dssvg.viewBoxInit[0]*this.#_dssvg.zoom1))+'px';
            this.#div_svg.style.backgroundPositionY=(-(this.#_dssvg.viewBoxInit[1]*this.#_dssvg.zoom1))+'px';
        }else if(true || this.#_dssvg.zoom1>0.125){ //0.5 0.25 0.125){
            /* si tout est affiché en grand, on met un gris roze avec des tailles de carrés de 100 px */

            this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"%3E%3Cpath d="M 0 0 l 10 10 l 0 -10 l -10 10 Z" fill="black" fill-opacity=".04"/%3E%3C/svg%3E\')';
            this.#div_svg.style.backgroundSize=(10/this.#_dssvg.zoom1)+'px';
            this.#div_svg.style.backgroundPositionX=(-(this.#_dssvg.viewBoxInit[0]*this.#_dssvg.zoom1))+'px';
            this.#div_svg.style.backgroundPositionY=(-(this.#_dssvg.viewBoxInit[1]*this.#_dssvg.zoom1))+'px';
        }
      
    }
   
}
export {module_svg_bdd}