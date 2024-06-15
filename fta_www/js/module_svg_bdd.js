
/*
voir getSvgTree afficheArbre0 looptree
*/
class module_svg_bdd{
 
    #nom_de_la_variable='';
    #div_svg=null;
    #svg_dessin=null;
    #taille_bordure=0;
    #id_text_area_contenant_les_id_des_bases='';
    
    #globalDernierePositionSouris={sx:null,sy:null};
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
   
   
    /*
    ====================================================================================================================
    function constructor
    */
    constructor(nom_de_la_variable , nom_de_la_div_contenant_le_svg, taille_bordure , id_text_area_contenant_les_id_des_bases,id_bases_init){
     
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
        

        this.#svg_dessin.setAttribute('viewBox','0 0 '+this.#largeur_du_svg+' '+this.#hauteur_du_svg);
        this.#svg_dessin.style.width=this.#largeur_du_svg+'px';
        this.#svg_dessin.style.height=this.#hauteur_du_svg+'px';
        
        this.#_dssvg.viewBoxInit=[0,0,this.#largeur_du_svg,this.#hauteur_du_svg];
        
        this.#div_svg.addEventListener('wheel', this.zoom_avec_roulette.bind(this) ,{capture:false,passive:true} );
        
        
        window.addEventListener( 'mousedown' , this.#sourie_bas.bind(this)  , false );
        window.addEventListener( 'mouseup'   , this.#sourie_haut.bind(this) , false );
        window.addEventListener( 'mousemove' , this.#sourie_bouge.bind(this) , false );
        
        this.#charger_les_bases_initiales_en_asynchrone();
     
    }
    #propriete_pour_deplacement_x='pageX';
    #propriete_pour_deplacement_y='pageY';
    /*
    ====================================================================================================================
    function sourie_bouge
    */
    #sourie_bouge(e){
        if(this.#souris_element_a_deplacer==='svg'){
         
         
         var calculx=(this.#souris_init_objet.x-e[this.#propriete_pour_deplacement_x])/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.x;
         var calculy=(this.#souris_init_objet.y-e[this.#propriete_pour_deplacement_y])/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.y;
         
         this.#souris_init_objet.elem_bouge.setAttribute('viewBox',calculx+','+calculy+','+this.#souris_init_objet.elem_bouge.viewBox.baseVal.width+','+this.#souris_init_objet.elem_bouge.viewBox.baseVal.height);
         return;
         
        }else if(this.#souris_element_a_deplacer==='base_de_donnee'){
         
         var calculx=(e[this.#propriete_pour_deplacement_x]-this.#souris_init_objet.x)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.x;
         var calculy=(e[this.#propriete_pour_deplacement_y]-this.#souris_init_objet.y)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.y;
         this.#souris_init_objet.elem_bouge.setAttribute( 'transform' , 'translate('+calculx+','+calculy+')');
         return;
         
        }else if(this.#souris_element_a_deplacer==='table'){
         
         e.preventDefault(); /* permer de ne pas sélectionner les textes */
         this.#svg_souris_delta_x=(e[this.#propriete_pour_deplacement_x]-this.#souris_init_objet.x)/this.#_dssvg.zoom1;
         this.#svg_souris_delta_y=(e[this.#propriete_pour_deplacement_y]-this.#souris_init_objet.y)/this.#_dssvg.zoom1;
         var calculx=this.#svg_souris_delta_x+this.#souris_init_objet.param_bouge.x;
         var calculy=this.#svg_souris_delta_y+this.#souris_init_objet.param_bouge.y;
         this.#souris_init_objet.elem_bouge.setAttribute( 'transform' , 'translate('+calculx+','+calculy+')');

         /* 
           déplacement des liens de la table en cours de mouvement 
         */
         for(var i=0;i<this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.reference_de_le_base].length;i++){
             var elem=this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.reference_de_le_base][i];
             if(elem.id_table_fille===this.#souris_init_objet.id_a_deplacer){

                 var ref_elem=document.getElementById(elem.id_du_path);
                 var nouveau_chemin=' M '+(elem.p1[0]+this.#svg_souris_delta_x   )+' '+(elem.p1[1]+this.#svg_souris_delta_y);
                 nouveau_chemin   +=' C '+(elem.p1[0]+this.#svg_souris_delta_x-30)+' '+(elem.p1[1]+this.#svg_souris_delta_y);
                 nouveau_chemin   +=' '+(elem.p2[0]+30)+' '+(elem.p2[1]);
                 nouveau_chemin   +=' '+(elem.p2[0])+' '+(elem.p2[1]);
                 
                 ref_elem.setAttribute('d' , nouveau_chemin );
             }
             if(elem.id_table_mere===this.#souris_init_objet.id_a_deplacer){
                 var ref_elem=document.getElementById(elem.id_du_path);
                 var nouveau_chemin='M '+(elem.p1[0])+' '+(elem.p1[1]);
                 nouveau_chemin+=' C '+(elem.p1[0]-30)+' '+(elem.p1[1]);
                 nouveau_chemin+=' '+(elem.p2[0]+this.#svg_souris_delta_x+30)+' '+(elem.p2[1]+this.#svg_souris_delta_y);
                 nouveau_chemin+=' '+(elem.p2[0]+this.#svg_souris_delta_x   )+' '+(elem.p2[1]+this.#svg_souris_delta_y);
                 ref_elem.setAttribute('d' , nouveau_chemin );
             }
         }
         
         return;
        }
    }
   
    /*
    ====================================================================================================================
    function sourie_haut
    */
    #sourie_haut(e){
        if(this.#souris_element_a_deplacer==='table'){
            for(var i=0;i<this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.reference_de_le_base].length;i++){
             
                var elem=this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.reference_de_le_base][i];
                if(elem.id_table_fille===this.#souris_init_objet.id_a_deplacer){
                   var ref_elem=document.getElementById(elem.id_du_path);
                   
                   this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.reference_de_le_base][i].p1=[elem.p1[0]+this.#svg_souris_delta_x , elem.p1[1]+this.#svg_souris_delta_y ];
                 
                 
                }
                if(elem.id_table_mere===this.#souris_init_objet.id_a_deplacer){
                   this.#svg_tableaux_des_references_amont_aval[this.#souris_init_objet.reference_de_le_base][i].p2=[elem.p2[0]+this.#svg_souris_delta_x , elem.p2[1]+this.#svg_souris_delta_y ];
                }
            }

        }
     
     
        this.#souris_element_a_deplacer='';
        this.#souris_init_objet.elem_bouge=null;
        this.#souris_init_objet.param_bouge={};
        this.#div_svg.style.userSelect='';
    }
   
   /*
   ====================================================================================================================
   function sourie_bas
   */
   #sourie_bas(e){
    
//       console.log('sourie_bas e=',e);
       this.#souris_init_objet.x=e[this.#propriete_pour_deplacement_x];
       this.#souris_init_objet.y=e[this.#propriete_pour_deplacement_y];
       this.#souris_element_a_deplacer='';
       
       var tar=e.target;
       if(tar.tagName.toLowerCase()==='svg'){
        
         /* si on bouge toute la zone svg, il faut modifier le viewbox */
         
        this.#souris_init_objet.elem_bouge=tar;
        this.#souris_init_objet.param_bouge={x:tar.viewBox.baseVal.x , y:tar.viewBox.baseVal.y };

        this.#souris_element_a_deplacer='svg';

        this.#div_svg.style.userSelect='none';
        
       }else{
        
           /* sinon, on recherche l'élément parent de type g pour modifier le translate si c'est une table ou une base */
           if(tar.getAttribute('data-type')){
            
               if(tar.getAttribute('data-type')==='base_de_donnee'){

                   var valeur_translate=tar.parentNode.getAttribute('transform').replace(/translate\(/g,'').replace(/\)/g,'').split(',');
                   this.#souris_init_objet.elem_bouge=tar.parentNode;
                   this.#souris_init_objet.param_bouge={x:parseFloat(valeur_translate[0]) , y:parseFloat(valeur_translate[1]) };
                   this.#souris_element_a_deplacer=tar.getAttribute('data-type');
                   this.#div_svg.style.userSelect='none';
                 
               }
            
           }else{
            
               

               if(tar.tagName.toLowerCase()==='tspan' && tar.getAttribute('id_a_deplacer') ){

                   var par=document.getElementById(tar.getAttribute('id_a_deplacer'));
                   var valeur_translate=par.getAttribute('transform').replace(/translate\(/g,'').replace(/\)/g,'').split(',');
                   this.#souris_init_objet.id_a_deplacer=parseInt(tar.getAttribute('id_a_deplacer'),10);
                   this.#souris_init_objet.elem_bouge=par;
                   this.#souris_init_objet.param_bouge={x:parseFloat(valeur_translate[0]) , y:parseFloat(valeur_translate[1]) };
                   this.#souris_init_objet.reference_de_le_base=tar.getAttribute('reference_de_le_base');

                   this.#souris_element_a_deplacer='table';
                   this.#div_svg.style.userSelect='none';
                   return
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
   #recursuf_arbre_svg(tab , id_parent , commencer_a){
    
     var str='';
     var l01=tab.length;
     
     for(var i=commencer_a;i<l01;i++){
      
      if(tab[i].id_parent===id_parent){
      
          var le_typa=tab[i].type;
          if(le_typa==='g'){
           
              str+='<g';
              
              for(var j in tab[i].proprietes){
               
                  str+=' '+j+'="'+tab[i].proprietes[j]+'"';
                  
              }
              
              str+='>';
              str+=this.#recursuf_arbre_svg(tab,i,i+1);
              str+='</g>';
           
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
     return str;
    
   }
   /*
   ========================================================================================================
   function dessiner_le_svg
   */
   #dessiner_le_svg(){
       var str='';
       for(var i in this.#arbre){
        
           var tab=JSON.parse(JSON.stringify(this.#arbre[i].arbre_svg));
           str+=this.#recursuf_arbre_svg(tab,-1,0);
       }
       this.#svg_dessin.innerHTML=str;
    
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
       largeur_de_la_boite=parseInt(b.width,10)+2*CSS_TAILLE_REFERENCE_BORDER;
      }
      a.remove();
      return(largeur_de_la_boite);
   }
  
   
   
        /*
        ========================================================================================================
        function charger_les_bases
        */
      #charger_les_bases_en_asynchrone(les_id_des_bases){
       
       async function postData(url = "", donnees ) {
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
       
       postData('za_ajax.php?recuperer_zone_travail_pour_les_bases', ajax_param).then(
           (donnees) => {
   //            console.log(donnees); // Les données JSON analysées par l'appel `donnees.json()`
               if(donnees.status==='OK'){
                   var nouvel_arbre={};
                   for(var i in donnees.valeurs){
                      
                      this.#arbre[donnees.valeurs[i]['T0.chi_id_basedd']]={
                        'chp_rev_travail_basedd':donnees.valeurs[i]['T0.chp_rev_travail_basedd'],
                        'arbre_svg':[] // {type:'racine_svg',id:-2,id_parent:-2,donnees:{}}
                      };

                      var obj1=functionToArray(donnees.valeurs[i]['T0.chp_rev_travail_basedd'],true,false,'');
                      if(obj1.status===true){
                          this.#arbre[donnees.valeurs[i]['T0.chi_id_basedd']]['matrice']=obj1.value;
                          
                          
                      }else{
                          logerreur({status : false , message:'0126'});
                          displayMessages('zone_global_messages');
                          return;
                      }
                   }

//                   console.log( CSS_TAILLE_REFERENCE_TEXTE , CSS_TAILLE_REFERENCE_PADDING , CSS_TAILLE_REFERENCE_BORDER );
                   const hauteur_de_boite=CSS_TAILLE_REFERENCE_TEXTE+2*CSS_TAILLE_REFERENCE_PADDING+2*CSS_TAILLE_REFERENCE_BORDER;
                   const hauteur_de_boite_affichage=hauteur_de_boite+1*CSS_TAILLE_REFERENCE_BORDER;
                   var indice_courant=0;
                   var tableau_des_elements=[];
                   var numero_table=0;
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
                   var indice_cadre_base=0;
                   var max_x=0;
                   var max_y=0;
                   var position_haut_de_la_table=0;
                   var position_max_bas=0;
                   var hauteur_de_la_table=0;
                   var indice_du_champ=0;
                   
                   var position_gauche_de_la_table=0;
                   var position_max_droite=0;
                   var largeur_de_la_table=0;
                   var tableau_des_references_croisees=[];
                   var id_svg_base_en_cours=0;
                   var id_svg_table_en_cours=0;
                   var id_svg_champ_en_cours=0;
                   /* 
                     =============================
                     debut de pour chaque base 
                     =============================
                   */                
                   
                   for(var id_de_la_base in this.#arbre){
                    
//                       console.log('indice de la base id_de_la_base=',id_de_la_base);
                       
                       this.#svg_tableaux_des_references_amont_aval[id_de_la_base]=[];

                       id_svg_base_en_cours=indice_courant;
                       var tab=this.#arbre[id_de_la_base]['matrice'];
//                       console.log('tab=',tab);
                       this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                           type:'g'   ,
                           id:id_svg_base_en_cours,
                           id_parent:-1, 
                           proprietes:{
                               type_element : 'conteneur_de_base',
                               id:indice_courant,
                               id_svg_base_en_cours : id_svg_base_en_cours,
                               transform:'translate(0,0)',
                               decallage_x:0,
                               decallage_y:0,
                               'data-id':'conteneur_base_'+id_de_la_base
                           }
                       };
                       indice_courant++;
                       this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                           type:'rect',
                           id:indice_courant ,
                           id_parent:id_svg_base_en_cours, 
                           proprietes:{
                            type_element : 'rectangle_de_base',
                            id:indice_courant,
                            id_svg_base_en_cours : id_svg_base_en_cours,
                            'data-type':'base_de_donnee',x:0,y:0,width:120,height:120,style:"stroke:red;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:yellow;fill-opacity:0.2;" , 'data-id':'cadre_base_'+id_de_la_base}
                       };
                       indice_courant++;

                       indice_cadre_base=indice_courant-1;
                       tableau_des_references_croisees=[];

                       var l01=tab.length;
                       /*
                         ======================================
                         recherche des meta de la base i
                         ======================================
                       */
                       for(var j_dans_tab=1;j_dans_tab<l01;j_dans_tab++){
                        
                           if( tab[tab[tab[j_dans_tab][7]][7]][1]==='meta' && tab[j_dans_tab][3]===2 && tab[tab[j_dans_tab][7]][1]===''  ){
                               /*
                                on commence par les propriétés de la base
                               */
                               if(tab[j_dans_tab][1]==='position_x_y_sur_svg' ){

                                   var tt=tab[j_dans_tab+1][1].split(',')
                                   tt[0]=parseInt(tt[0]);
                                   tt[1]=parseInt(tt[1]);
                                   if(CSS_TAILLE_REFERENCE_BORDER%2!==0){
                                       /* si la taille de la bordure est impaire */
                                       tt[0]+=0.5;
                                       tt[1]+=0.5;
                                   }
                                   this.#arbre[id_de_la_base].arbre_svg[0].proprietes.decallage_x=tt[0];
                                   this.#arbre[id_de_la_base].arbre_svg[0].proprietes.decallage_y=tt[1];
                                   this.#arbre[id_de_la_base].arbre_svg[0].proprietes.transform='translate('+tt[0]+','+tt[1]+')';
                                   this.#arbre[id_de_la_base].arbre_svg[0].proprietes.decallage_x=tt[0];
                                   this.#arbre[id_de_la_base].arbre_svg[0].proprietes.decallage_y=tt[1];

                               }else if(tab[j_dans_tab][1]==='hauteur_sur_svg' ){
                                
                                   this.#arbre[id_de_la_base].arbre_svg[1].proprietes.height=tab[j_dans_tab+1][1]; // indice_cadre_base

                               }else if(tab[j_dans_tab][1]==='largeur_sur_svg' ){
                                
                                   this.#arbre[id_de_la_base].arbre_svg[1].proprietes.width=tab[j_dans_tab+1][1];
                                   
                               }else{
                                   try{
                                       /* c'est un champ meta autres que ceux destines aux dimensions */
                                       if(tab[j_dans_tab][9]===1){
                                         this.#arbre[id_de_la_base].arbre_svg[1].proprietes[tab[j_dans_tab][1]]=tab[j_dans_tab+1][1];
                                       }
                                   }catch(e){
                                   }
                               }
                           }
                       }
                       

                       /*
                         =====================================
                         debut de recherche des create_table
                         =====================================
                       */
                       numero_table=1
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
                                    
                                       if('n'===tab[i][1]){
                                        
                                        
                                           nom_de_la_table=tab[i+1][1];
                                           id_svg_table_en_cours=indice_courant;
                                           
                                           var meta_de_la_table={
                                             '__meta_nom_long_de_la_table' : '',
                                             '__meta_nom_court_de_la_table' : '',
                                             '__meta_nom_bref_de_la_table' : '',
                                             '__meta_position_x_y_sur_svg' : '',
                                           };
                                           var position_de_la_table=[0,0];
                                        
                                           /*
                                             ======================
                                             recherche des meta
                                             ======================
                                           */
                                           for(var j=id_tab_table_en_cours+1;j<l01 && tab[j][3]>tab[id_tab_table_en_cours][3];j++){ // i
                                            
                                               if(tab[j][7]===id_tab_table_en_cours && 'meta'===tab[j][1] ){
                                                
                                                   for(var l=j+1;l<l01 && tab[l][3]>tab[j][3] ;l++){
                                                    
                                                       if(tab[l][7]===j && tab[l][1]=='' && tab[l][8]===2){
                                                       
                                                           /* fonction sans nom dans les meta*/
//                                                           console.log(' meta table' , tab[l+1][1] , tab[l+2][1] );
                                                           meta_de_la_table['__meta_'+tab[l+1][1]]=tab[l+2][1];
                                                        
                                                       }
                                                   }                                    
                                               }
                                           }
                                           
                                           /*
                                             ======================
                                             si les meta ne sont pas définis, on les complète
                                             ======================
                                           */
                                           if(meta_de_la_table['__meta_nom_long_de_la_table']===''){
                                            meta_de_la_table['__meta_nom_long_de_la_table']=nom_de_la_table;
                                           }
                                           
                                           if(meta_de_la_table['__meta_nom_court_de_la_table']===''){
                                            meta_de_la_table['__meta_nom_court_de_la_table']=nom_de_la_table;
                                           }
                                           if(meta_de_la_table['__meta_nom_bref_de_la_table']===''){
                                            meta_de_la_table['__meta_nom_bref_de_la_table']=nom_de_la_table;
                                           }
                                           
                                           if(meta_de_la_table['__meta_position_x_y_sur_svg']===''){
                                               meta_de_la_table['__meta_position_x_y_sur_svg']=position_xy_table[0]+','+position_xy_table[1];
                                               position_de_la_table=meta_de_la_table['__meta_position_x_y_sur_svg'].split(',');
                                           }else{
                                               position_de_la_table=meta_de_la_table['__meta_position_x_y_sur_svg'].split(',');
                                               position_xy_table[0]=parseFloat(position_de_la_table[0]);
                                               position_xy_table[1]=parseFloat(position_de_la_table[1]);
                                           }
                                           
                                        
                                           /*
                                             conteneur de la table
                                           */
                                           
                                           id_svg_conteneur_table=indice_courant;
                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                               type:'g'   ,id:indice_courant ,id_parent:id_svg_base_en_cours , 
                                               proprietes:{
                                                   id:indice_courant,
                                                   type_element : 'conteneur_de_table',
                                                   id_svg_base_en_cours : id_svg_base_en_cours,
                                                   id_svg_table_en_cours : id_svg_table_en_cours,
                                                   nom_de_la_table       : nom_de_la_table ,
                                                   decallage_x           : position_de_la_table[0],
                                                   decallage_y           : position_de_la_table[1],
                                                   transform:'translate('+(position_de_la_table[0])+','+(position_de_la_table[1])+')',
                                                   'data-id':'conteneur_table_'+id_svg_table_en_cours,
                                               }
                                           };
                                           indice_courant++;
                                           
                                           position_gauche_de_la_table = parseFloat(position_de_la_table[0]);
                                           position_haut_de_la_table   = parseFloat(position_de_la_table[1]);
                                        
                                        
                                           liste_de_indices_des_elements_a_ajuster_en_largeur=[indice_courant];
                                           
                                           /*
                                             rectangle de la table
                                           */
                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                            type:'rect','data-type':'table',id:indice_courant ,id_parent:id_svg_conteneur_table , 
                                            proprietes:{
                                             id                     : indice_courant,
                                             type_element           : 'rectangle_de_table',
                                             id_svg_base_en_cours   : id_svg_base_en_cours,
                                             id_svg_table_en_cours  : id_svg_table_en_cours,
                                             nom_de_la_table        : nom_de_la_table ,
                                             x:0,y:0,width:20,height:50,style:"stroke:blue;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:yellow;fill-opacity:1;" , 'data-id':'cadre_table_'+numero_table,
                                             'meta_de_la_table'     : JSON.stringify(meta_de_la_table),
                                             id_svg_conteneur_table : id_svg_conteneur_table ,
                                            }
                                           };
                                           indice_courant++;
                                           numero_table++;
                                       }
                                   }
                               }
                               
                               
//                               console.log('hauteur_de_boite=' , hauteur_de_boite );
                               /*
                                 ================
                                 ajout des champs
                                 ================
                               */
                                    
                               /* on met les champs de la table  */
                               var numero_de_boite=0;
                               
                               for(var k=id_tab_table_en_cours+1;k<l01 && tab[k][3]>tab[id_tab_table_en_cours][3];k++){
                                 
                                   if(tab[k][7]===id_tab_table_en_cours && tab[k][1]==='fields'){
                                    
                                       for(var l=k+1;l<l01 && tab[l][3]>tab[k][3] ;l++){
                                           if(tab[l][7]===k){
                                            
                                               if(tab[l][1]=='field'){
                                               
                                                   for(var m=l+1;m<l01 && tab[m][3]>tab[l][3];m++){
                                                       if(tab[m][7]===l){
                                                        
                                                           if(tab[m][1]==='n'){

                                                               /*
                                                                 on recherche le nom du champ pour créer le conteneur et le cadre
                                                               */
                                                               
                                                               if(numero_de_boite===0){
                                                                   /* 
                                                                    si c'est le premier champ, on crée un cadre qui contient le nom de la table
                                                                    conteneur du nom de la table
                                                                   */
                                                                   id_svg_champ_en_cours=indice_courant;
                                                                   this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                                       type:'g'   ,id:indice_courant ,id_parent:id_svg_conteneur_table , 
                                                                       proprietes:{
                                                                           id:indice_courant,
                                                                           type_element : 'conteneur_de_nom_de_table',
                                                                           id_svg_base_en_cours : id_svg_base_en_cours,
                                                                           id_svg_table_en_cours : id_svg_table_en_cours,
                                                                           id_svg_champ_en_cours : id_svg_champ_en_cours,
                                                                           nom_de_la_table       : nom_de_la_table ,
                                                                           decallage_x           : CSS_TAILLE_REFERENCE_BORDER,
                                                                           decallage_y           : CSS_TAILLE_REFERENCE_BORDER,
                                                                           transform:'translate('+CSS_TAILLE_REFERENCE_BORDER+','+CSS_TAILLE_REFERENCE_BORDER+')' ,
                                                                       }
                                                                   };
                                                                   indice_courant++;

                                                                   /*
                                                                     rectangle du nom de la table
                                                                     
                                                                   */
                                                                   this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                                       type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                                                                       proprietes:{
                                                                           id:indice_courant,
                                                                           type_element : 'rectangle_de_nom_de_table',
                                                                           id_svg_base_en_cours : id_svg_base_en_cours,
                                                                           id_svg_table_en_cours : id_svg_table_en_cours,
                                                                           id_svg_champ_en_cours : id_svg_champ_en_cours,
                                                                           nom_de_la_table       : nom_de_la_table ,
                                                                           x:0,
                                                                           y:0,
                                                                           width:18,
                                                                           height:hauteur_de_boite,
                                                                           style:"stroke:white;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:red;fill-opacity:1;" 
                                                                       }
                                                                   };
                                                                   indice_courant++;
                                                                   liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                                   hauteur_de_la_table+=hauteur_de_boite_affichage;
                                                                   
                                                                   
                                                                    /*
                                                                      texte du nom de la table
                                                                    */
                                                                   this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                                       type:'text',id:indice_courant ,id_parent:indice_courant-2     , 
                                                                       contenu:'<tspan style="cursor:move;" id_a_deplacer="'+id_svg_table_en_cours+'" reference_de_le_base="'+id_de_la_base+'">🟥</tspan>'+nom_de_la_table ,
                                                                       proprietes:{
                                                                           id:indice_courant,
                                                                           type_element : 'texte_de_nom_de_table',
                                                                           id_svg_base_en_cours : id_svg_base_en_cours,
                                                                           id_svg_table_en_cours : id_svg_table_en_cours,
                                                                           id_svg_champ_en_cours : id_svg_champ_en_cours,
                                                                           nom_de_la_table       : nom_de_la_table ,
                                                                           x:CSS_TAILLE_REFERENCE_BORDER,
                                                                           y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-CSS_TAILLE_REFERENCE_BORDER,
                                                                           style:"fill:white;" , 
                                                                       }
                                                                   };
                                                                   indice_courant++;
                                                                   largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_la_table+'🟥'); // ↔ 🟥
                                                                   
                                                                   numero_de_boite++;
                                                                   

                                                               }
                                                               
                                                               nom_du_champ=tab[m+1][1];

                                                               var meta_du_champ={
                                                                 '__meta_nom_long_du_champ' : '',
                                                                 '__meta_nom_court_du_champ' : '',
                                                                 '__meta_nom_bref_du_champ' : '',
                                                               };
                                                               
                                                               /*
                                                                 on va chercher les meta de ce champ
                                                               */
                                                               for(var o=l+1;o<l01 && tab[o][3]>tab[l][3];o++){
                                                                   if(tab[o][7]===l){
                                                                    
                                                                       if(tab[o][1]==='meta'){ // m
                                                                           
                                                                           for(var n=o+1;n<l01 && tab[n][3]>tab[o][3];n++){
                                                                               if(tab[n][7]===o){
                                                                                    
                                                                                   if(tab[n][1]==='' && tab[n][2] ==='f' && tab[n][8] === 2){
//                                                                                      console.log('meta du champ' , tab[n+1][1] + ' ' + tab[n+2][1]);
                                                                                      meta_du_champ['__meta_'+tab[n+1][1]]=tab[n+2][1];
                                                                                      
                                                                                    
                                                                                   }
                                                                               }
                                                                           }
                                                                       }
                                                                   }
                                                               }
                                                               if(meta_du_champ['__meta_nom_long_du_champ']===''){
                                                                meta_du_champ['__meta_nom_long_du_champ']=nom_du_champ;
                                                               }
                                                               if(meta_du_champ['__meta_nom_court_du_champ']===''){
                                                                meta_du_champ['__meta_nom_court_du_champ']=nom_du_champ;
                                                               }
                                                               if(meta_du_champ['__meta_nom_bref_du_champ']===''){
                                                                meta_du_champ['__meta_nom_bref_du_champ']=nom_du_champ;
                                                               }
                                                               
                                                               
                                                               
                                                               /*
                                                                 création de la boite du champ
                                                               */
                                                               
                                                               largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_du_champ);
                                                               
                                                               id_svg_champ_en_cours=indice_courant;
                                                               /*
                                                                 conteneur du nom du champ
                                                               */
                                                               this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                                   type:'g'   ,id:indice_courant ,id_parent:id_svg_conteneur_table , 
                                                                   proprietes:{
                                                                       id:indice_courant,
                                                                       type_element          : 'conteneur_de_champ'  ,
                                                                       id_svg_base_en_cours  : id_svg_base_en_cours  ,
                                                                       id_svg_table_en_cours : id_svg_table_en_cours ,
                                                                       id_svg_champ_en_cours : id_svg_champ_en_cours ,
                                                                       nom_de_la_table       : nom_de_la_table       ,
                                                                       nom_du_champ          : nom_du_champ          ,
                                                                       decallage_x           : CSS_TAILLE_REFERENCE_BORDER,
                                                                       decallage_y           : ((hauteur_de_boite_affichage)*(numero_de_boite)+CSS_TAILLE_REFERENCE_BORDER),
                                                                       transform:'translate('+CSS_TAILLE_REFERENCE_BORDER+','+((hauteur_de_boite_affichage)*(numero_de_boite)+CSS_TAILLE_REFERENCE_BORDER)+')',
                                                                       'data-id':'conteneur_champ_'+j_dans_tab
                                                                   }
                                                               };
                                                               indice_courant++;
                                                               
                                                               
                                                               /*
                                                                 rectangle du nom du champ
                                                               */
                                                               this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                                   type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                                                                   proprietes:{
                                                                       id:indice_courant,
                                                                       type_element : 'rectangle_de_champ',
                                                                       id_svg_base_en_cours : id_svg_base_en_cours,
                                                                       id_svg_table_en_cours : id_svg_table_en_cours,
                                                                       id_svg_champ_en_cours : id_svg_champ_en_cours,
                                                                       nom_de_la_table       : nom_de_la_table ,
                                                                       nom_du_champ          : nom_du_champ          ,
                                                                       x:0,y:0,width:18,height:hauteur_de_boite,style:"stroke:gold;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:pink;fill-opacity:0.2;" , 
                                                                       'meta_du_champ' : JSON.stringify(meta_du_champ),
                                                                   }
                                                               };
                                                               indice_courant++;
                                                               indice_du_champ=indice_courant-1;
                                                               this.#arbre[id_de_la_base].arbre_svg[indice_du_champ].proprietes['__id_svg_champ']=indice_du_champ;
                                                               
                                                               
                                                               liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_du_champ);
                                                               hauteur_de_la_table+=hauteur_de_boite_affichage;
                                                               
                                                               /*
                                                                 texte du nom du champ
                                                               */
                                                               this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                                   type:'text',id:indice_courant ,id_parent:indice_courant-2     , 
                                                                   contenu:nom_du_champ ,
                                                                   proprietes:{
                                                                       id:indice_courant,
                                                                       type_element : 'texte_de_champ',
                                                                       id_svg_base_en_cours : id_svg_base_en_cours,
                                                                       id_svg_table_en_cours : id_svg_table_en_cours,
                                                                       id_svg_champ_en_cours : id_svg_champ_en_cours,
                                                                       nom_de_la_table       : nom_de_la_table ,
                                                                       nom_du_champ          : nom_du_champ          ,
                                                                       x:CSS_TAILLE_REFERENCE_BORDER,
                                                                       y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-CSS_TAILLE_REFERENCE_BORDER,style:"fill:navy;" , 
                                                                   }
                                                               };
                                                               indice_courant++;
                                                               
                                                               numero_de_boite++;
                                                           }
                                                       }
                                                   }
                                                   /*
                                                     on va chercher les références croisées de ce champ
                                                   */
                                                   for(var o=l+1;o<l01 && tab[o][3]>tab[l][3];o++){
                                                       if(tab[o][7]===l){
                                                        
                                                           if('references'===tab[o][1] && tab[o][8]===2 ){
                                                            tableau_des_references_croisees.push({
                                                             id:indice_courant,
                                                             id_svg_base_en_cours : id_svg_base_en_cours,
                                                             id_fable_fille : id_svg_table_en_cours,
                                                             id_svg_champ_en_cours : id_svg_champ_en_cours,
                                                             'nom_table_fille'    : nom_de_la_table         ,
                                                             'id_du_champ_fils'   : indice_du_champ         ,
                                                             'nom_du_champ_fils'  : nom_du_champ            ,
                                                             'nom_table_mère'     : tab[o+1][1]             ,
                                                             'nom_du_champ_père'  : tab[o+2][1]             ,
                                                            });
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

                                           if(tab[j][7]===i && tab[j][1]==='n' && tab[j+1][1]===nom_de_la_table ){
                                               for(var k=i+1;k<l01 && tab[k][3]> tab[i][3];k++){
                                                   if(tab[k][7]===i){
                                                    
                                                       if('index_name'===tab[k][1]){
                                                        
                                                          nom_de_l_index=tab[k+1][1];
                                                          id_svg_champ_en_cours=indice_courant;
                                                          var champs_de_l_index='';

                                                          for(var l=i+1;l<l01 && tab[l][3]> tab[i][3];l++){
                                                              if(tab[l][7]===i){
                                                                  if('fields'===tab[l][1]){
                                                                   var obj1=a2F1(tab,l,false,l+1,false);
                                                                   if(obj1.status===true){
//                                                                       console.log('obj1=',obj1);
                                                                       champs_de_l_index=obj1.value;
                                                                   }else{
                                                                       logerreur({status : true , message : '0849 problème sur l\index "'+nom_de_l_index+'"' });
                                                                       displayMessages('zone_global_messages');
                                                                   }
                                                                    
                                                                  }
                                                              }
                                                          }
                                                                   
                                                        
                                                           
                                                        
//                                                          console.log('nom_de_la_table=',nom_de_la_table,'index',tab[k+1][1]);

                                                          
                                                           /*
                                                             création de la boite de l'index
                                                           */
                                                           
                                                           largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_l_index);
                                                           
                                                           
                                                           /*
                                                             conteneur du nom de l'index
                                                           */
                                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                            type:'g'   ,id:indice_courant ,id_parent:id_svg_conteneur_table , 
                                                            proprietes:{
                                                                id:indice_courant,
                                                                type_element : 'conteneur_d_index',
                                                                id_svg_base_en_cours : id_svg_base_en_cours,
                                                                id_svg_table_en_cours : id_svg_table_en_cours,
                                                                nom_de_la_table       : nom_de_la_table ,
                                                                decallage_x           : CSS_TAILLE_REFERENCE_BORDER,
                                                                decallage_y           : ((hauteur_de_boite_affichage)*(numero_de_boite)+CSS_TAILLE_REFERENCE_BORDER),
                                                                transform:'translate('+CSS_TAILLE_REFERENCE_BORDER+','+((hauteur_de_boite_affichage)*(numero_de_boite)+CSS_TAILLE_REFERENCE_BORDER)+')'}
                                                           };
                                                           indice_courant++;
                                                           
                                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                               type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                                                               proprietes:{
                                                                   id:indice_courant,
                                                                   type_element : 'rectangle_d_index',
                                                                   id_svg_base_en_cours : id_svg_base_en_cours,
                                                                   id_svg_table_en_cours : id_svg_table_en_cours,
                                                                   nom_de_la_table       : nom_de_la_table ,
                                                                   champs_de_l_index : champs_de_l_index,
                                                                   x:0,y:0,width:18,height:hauteur_de_boite,style:"stroke:green;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:green;fill-opacity:0.2;" 
                                                               }
                                                           };
                                                           indice_courant++;
                                                           liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                                                               type:'text',id:indice_courant ,id_parent:indice_courant-2     , contenu:nom_de_l_index ,
                                                               proprietes:{
                                                                   id:indice_courant                             ,
                                                                   type_element : 'texte_d_index',
                                                                   id_svg_base_en_cours : id_svg_base_en_cours   ,
                                                                   id_svg_table_en_cours : id_svg_table_en_cours ,
                                                                   nom_de_la_table       : nom_de_la_table ,
                                                                   x:CSS_TAILLE_REFERENCE_BORDER,y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-CSS_TAILLE_REFERENCE_BORDER,style:"fill:green;" 
                                                               }
                                                           };
                                                           indice_courant++;
                                                           

                                                           liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                           hauteur_de_la_table+=hauteur_de_boite_affichage;
                                                           
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
                               position_xy_table[0]+=largeur_de_la_boite+2*CSS_TAILLE_REFERENCE_MARGIN+4*CSS_TAILLE_REFERENCE_BORDER;
                               position_xy_table[1]+=20;
                               
                               for(var k=0;k<liste_de_indices_des_elements_a_ajuster_en_largeur.length;k++){
                                   /*
                                     le premier indice est le conteneur de la table
                                   */
                                   if(k===0){
                                       
                                       largeur_de_la_table=largeur_de_la_boite+2*CSS_TAILLE_REFERENCE_BORDER;
                                       this.#arbre[id_de_la_base].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_table;
                                       this.#arbre[id_de_la_base].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.height=hauteur_de_la_table+CSS_TAILLE_REFERENCE_BORDER;
                                       
                                       
                                       if( position_max_bas<position_haut_de_la_table+hauteur_de_la_table+CSS_TAILLE_REFERENCE_BORDER){
                                           position_max_bas=position_haut_de_la_table+hauteur_de_la_table+CSS_TAILLE_REFERENCE_BORDER;
                                       }
                                       
                                       if( position_max_droite<position_gauche_de_la_table+largeur_de_la_table){
                                           position_max_droite=position_gauche_de_la_table+largeur_de_la_table;
                                       }
                                       
                                       
                                       
                                   }else{
                                       this.#arbre[id_de_la_base].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_boite;
                                   }
                               }
                               
                               /* 
                                 fin de boucle sur j_dans_tab
                               */    
                           }
                           /*
                             finalement on ajuste la largeur de la boite contenant la base
                           */
                           this.#arbre[id_de_la_base].arbre_svg[indice_cadre_base].proprietes.height=position_max_bas+2*CSS_TAILLE_REFERENCE_MARGIN; // 
                           this.#arbre[id_de_la_base].arbre_svg[indice_cadre_base].proprietes.width=position_max_droite+2*CSS_TAILLE_REFERENCE_MARGIN; // 
                           
                       }
                       /*
                       */
                       var offset_base=[];
                       var offset_table_mere=[];
                       var offset_champ_pere=[];
                       var largeur_table_mere=0;
                       var offset_table_fille=[];
                       var offset_champ_fils=[];
                       this.#svg_tableaux_des_references_amont_aval[id_de_la_base]=[];
                       var id_table_mere=0;
                       console.log('tableau_des_references_croisees=',tableau_des_references_croisees);
                       for( var i=0;i<tableau_des_references_croisees.length;i++){
                           id_table_mere=0;

                           for( var j=0;j<this.#arbre[id_de_la_base].arbre_svg.length;j++){
                            
                            
                            
                               if(
                                   this.#arbre[id_de_la_base].arbre_svg[j].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_mère
                                && this.#arbre[id_de_la_base].arbre_svg[j].proprietes.type_element==='conteneur_de_table'
                                
                               ){
                                   offset_table_mere=[
                                     parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.decallage_x),
                                     parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.decallage_y)
                                   ];
                                   id_table_mere=this.#arbre[id_de_la_base].arbre_svg[j].proprietes.id_svg_table_en_cours;
                                   if(i===0){
                                       console.log('offset_table_mere',offset_table_mere);
                                   }
                               }

                               if(
                                   this.#arbre[id_de_la_base].arbre_svg[j].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_mère
                                && this.#arbre[id_de_la_base].arbre_svg[j].proprietes.type_element==='rectangle_de_table'
                                
                               ){
                                   largeur_table_mere=parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.width);
                                   
                                   if(i===0){
                                       console.log('largeur_table_mere',largeur_table_mere);
                                   }
                               }

                               if(
                                   this.#arbre[id_de_la_base].arbre_svg[j].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_mère
                                && this.#arbre[id_de_la_base].arbre_svg[j].proprietes.nom_du_champ===tableau_des_references_croisees[i].nom_du_champ_père
                                && this.#arbre[id_de_la_base].arbre_svg[j].proprietes.type_element==='conteneur_de_champ'
                               ){
                                   offset_champ_pere=[
                                       parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.decallage_x),
                                       parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.decallage_y)
                                   ]
                                       ; //translate(20,10)
                                   if(i===0){
                                       console.log('offset_champ_pere' , offset_champ_pere);
                                   }
                               }

                               if(
                                   this.#arbre[id_de_la_base].arbre_svg[j].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_fille
                                && this.#arbre[id_de_la_base].arbre_svg[j].proprietes.type_element==='conteneur_de_table'
                                
                               ){
                                   offset_table_fille=[
                                       parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.decallage_x),
                                       parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.decallage_y)
                                   ]
                                   if(i===0){
//                                       id_table_fille=this.#arbre[id_de_la_base].arbre_svg[j].proprietes.id_svg_table_en_cours

                                       console.log('offset_table_fille' ,offset_table_fille);
                                   }
                               }

                               if(
                                   this.#arbre[id_de_la_base].arbre_svg[j].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_fille
                                && this.#arbre[id_de_la_base].arbre_svg[j].proprietes.nom_du_champ===tableau_des_references_croisees[i].nom_du_champ_fils
                                && this.#arbre[id_de_la_base].arbre_svg[j].proprietes.type_element==='conteneur_de_champ'
                               ){
                                   offset_champ_fils=[
                                       parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.decallage_x),
                                       parseFloat(this.#arbre[id_de_la_base].arbre_svg[j].proprietes.decallage_y)
                                   ]
                                       ; //translate(20,10)
                                   if(i===0){
                                       console.log('offset_champ_fils' , offset_champ_fils);
                                   }
                               }
                           }

                           this.#svg_tableaux_des_references_amont_aval[id_de_la_base].push({
                               id_table_mere  : id_table_mere   ,
                               id_table_fille : tableau_des_references_croisees[i].id_fable_fille  ,
                               id_du_path     : indice_courant,
                               p1             : [(offset_table_fille[0]+offset_champ_fils[0])                    , (offset_table_fille[1]+offset_champ_fils[1]+2*CSS_TAILLE_REFERENCE_BORDER) ],
                               p2             : [(offset_table_mere[0] +offset_champ_pere[0]+largeur_table_mere) , (offset_table_mere[1] +offset_champ_pere[1]+2*CSS_TAILLE_REFERENCE_BORDER) ],
                               reference_de_le_base : id_de_la_base,
                           });
                           
                           var d='M '+(offset_table_fille[0]+offset_champ_fils[0])+' '+(offset_table_fille[1]+offset_champ_fils[1]+2*CSS_TAILLE_REFERENCE_BORDER)
                           d+=' C '+(offset_table_fille[0]+offset_champ_fils[0]-30)+' '+(offset_table_fille[1]+offset_champ_fils[1]+2*CSS_TAILLE_REFERENCE_BORDER)
                           d+=  ' '+(offset_table_mere[0]+offset_champ_pere[0]+30+largeur_table_mere)+' '+(offset_table_mere[1]+offset_champ_pere[1]+2*CSS_TAILLE_REFERENCE_BORDER)
                           d+=  ' '+(offset_table_mere[0]+offset_champ_pere[0]+largeur_table_mere)+' '+(offset_table_mere[1]+offset_champ_pere[1]+2*CSS_TAILLE_REFERENCE_BORDER)

                           this.#arbre[id_de_la_base].arbre_svg[indice_courant]={
                               type:'path',id:indice_courant ,id_parent:id_svg_base_en_cours , 
                               proprietes:{
                                   id                   : indice_courant ,
                                   d                    : d ,
                                   type_element         : 'reference_croisée'  ,
                                   id_svg_base_en_cours : id_svg_base_en_cours ,
                                   style                : 'stroke:aqua;stroke-width:'+(CSS_TAILLE_REFERENCE_BORDER*3)+';fill:transparent;stroke-linejoin:round;stroke-linecap:round;',
                               }
                           };
                           indice_courant++;
                               
                               
                               /*
                               <path data-idarbre1="1" d=" M -63 -9 C 53 -6 132 71 176 31 " stroke="rgb(0, 0, 0)" stroke-width="1" fill="transparent" stroke-linejoin="round" stroke-linecap="round" transform=""></path>
                               */
                           
                           
                       }
                   }
                   /*
                     =============================
                     fin de pour chaque base
                     =============================
                   */
                   console.log(this.#svg_tableaux_des_references_amont_aval);



   //                console.log('this.#arbre=',this.#arbre)
                   
                   this.#dessiner_le_svg();
                   logerreur({status : true , message : '0140 les bases ont bien été chargées' });
                   displayMessages('zone_global_messages');

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
   zoom_avec_roulette(e){
    if(e.deltaY<0){
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
  
   var viewboxTab=this.#svg_dessin.getAttribute('viewBox').trim().replace(/ /g,',').replace(/,,/g,',').replace(/,,/g,',').replace(/,,/g,',').split(',').map(Number);

   if(this.#_dssvg.zoom1==256 && n==2){
    // rien
   }else if(this.#_dssvg.zoom1==0.03125 && n==0.5){ // 0.03125 // 0.0625
    // rien
   }else{
    this.#_dssvg.zoom1=this.#_dssvg.zoom1*n;
    if(this.#globalDernierePositionSouris.sx===null){
     this.#_dssvg.viewBoxInit=[viewboxTab[0]/n,viewboxTab[1]/n,viewboxTab[2]/n,viewboxTab[3]/n];
    }else{
     // le centre est en this.#globalDernierePositionSouris.sx mais il faudra modifier pour que le dernier click reste au même endroit
     var w=viewboxTab[2]/n;
     var h=viewboxTab[3]/n;
     var x=this.#globalDernierePositionSouris.sx-w/2;
     var y=this.#globalDernierePositionSouris.sy-w/2;
    }
    this.setAttributeViewBox();  
    this.#rayonPoint=this.#_dssvg.parametres.rayonReference/this.#_dssvg.zoom1;
    this.#strkWiTexteSousPoignees=this.#rayonPoint/20;
    this.#fontSiTexteSousPoignees=this.#rayonPoint;
    this.resize1();
//    afficheArbre0({prendreTout:false});
   }
//   divlag1.innerHTML='Z='+this.#_dssvg.zoom1;
  }
 }
   
   
 //========================================================================================================
 setAttributeViewBox(){
  this.#svg_dessin.setAttribute('viewBox',this.#_dssvg.viewBoxInit.join(' '));
  if(this.#_dssvg.zoom1<1){
   this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M 0 0 l 100 100 l 0 -100 l -100 100 Z" fill="yellow" fill-opacity=".04"/%3E%3C/svg%3E\')';
   this.#div_svg.style.backgroundSize=(100*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionX=-(this.#_dssvg.viewBoxInit[0]*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionY=-(this.#_dssvg.viewBoxInit[1]*this.#_dssvg.zoom1)+'px';
  }else if(this.#_dssvg.zoom1<64){
   this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"%3E%3Cpath d="M 0 0 l 10 10 l 0 -10 l -10 10 Z" fill="black" fill-opacity=".04"/%3E%3C/svg%3E\')';
   this.#div_svg.style.backgroundSize=(10*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionX=-(this.#_dssvg.viewBoxInit[0]*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionY=-(this.#_dssvg.viewBoxInit[1]*this.#_dssvg.zoom1)+'px';
  }else{
   this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Cpath d="M 0 0 l 1 1 l 0 -1 l -1 1 Z" fill="red" fill-opacity=".04"/%3E%3C/svg%3E\')';
   this.#div_svg.style.backgroundSize=(1*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionX=-(this.#_dssvg.viewBoxInit[0]*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionY=-(this.#_dssvg.viewBoxInit[1]*this.#_dssvg.zoom1)+'px';
  }
 }
   
 /*
 ========================================================================================================
 function resize1(){
 */
 resize1(){
//  getSizes();

/*  
  divtpe.style.top=(margns.t)+'px';
  divtpe.style.left=(wi_of_the_menulft+margns.l)+'px';
  divtpe.style.border=wi_of_the_brds1+'px red solid';
  divtpe.style.width=(xscreen-wi_of_the_menulft-margns.l-margns.r)+'px';
  divtpe.style.height=he_of_the_menutpe+'px';

  divlft.style.top=(margns.t)+'px';
  divlft.style.left=(margns.l)+'px';
  divlft.style.border=wi_of_the_brds1+'px red solid';
  divlft.style.width=(wi_of_the_menulft)+'px';
  divlft.style.height=(yscreen-margns.t-margns.b)+'px';
*/  
/*
  this.#div_svg.style.top=(margns.t+he_of_the_menutpe+decal.t)+'px';
  this.#div_svg.style.left=(margns.l+wi_of_the_menulft+decal.l)+'px';
  this.#div_svg.style.border=wi_of_the_brds2+'px red solid';
  this.#div_svg.style.width=(xscreen-margns.l-wi_of_the_menulft-decal.l-margns.r)+'px';
  this.#div_svg.style.height=(yscreen-margns.t-he_of_the_menutpe-decal.t-margns.b)+'px';
  decalageX=margns.l+wi_of_the_menulft+decal.l+wi_of_the_brds2;
  decalageY=margns.t+he_of_the_menutpe+decal.t+wi_of_the_brds2;
  refZnDessin.style.top=0; //(margns.t+he_of_the_menutpe+decal.t+wi_of_the_brds2)+'px';
  refZnDessin.style.left=0; //(margns.l+wi_of_the_menulft+decal.l+wi_of_the_brds2)+'px';
  
  var largeurDessin=(xscreen-margns.l-wi_of_the_menulft-decal.l-margns.r-2*wi_of_the_brds2);
  refZnDessin.style.width=largeurDessin+'px';
  var hauteurDessin=(yscreen-margns.t-he_of_the_menutpe-decal.t-margns.b-2*wi_of_the_brds2);
  refZnDessin.style.height=hauteurDessin+'px';
*/  
  
  if(false && this.#_dssvg.viewBoxInit===null){
   this.#_dssvg.viewBoxInit=[-2,-2,this.#largeur_du_svg/this.#_dssvg.zoom1,this.#hauteur_du_svg/this.#_dssvg.zoom1];
  }else{
   this.#_dssvg.viewBoxInit=[this.#_dssvg.viewBoxInit[0],this.#_dssvg.viewBoxInit[1],this.#largeur_du_svg/this.#_dssvg.zoom1,this.#hauteur_du_svg/this.#_dssvg.zoom1];
  }
//  refZnDessin.setAttribute('viewBox',_dssvg.viewBoxInit.join(' '));
  this.setAttributeViewBox();  

/*
  divlag1.style.top=(margns.t+he_of_the_menutpe)+'px';
  divlag1.style.left=(margns.l+wi_of_the_menulft+decal.l)+'px';
  divlag1.style.border=wi_of_the_brds2+'px pink solid';
  divlag1.style.width=(xscreen-margns.l-wi_of_the_menulft-decal.l-margns.r)+'px';
  divlag1.style.height=(decal.t)+'px';
  
//  divlag2.style.top=(margns.t+he_of_the_menutpe+decal.t+yscreen-margns.t-he_of_the_menutpe-decal.t-margns.b)+'px';
  divlag2.style.bottom=0;
  divlag2.style.minHeight=(margns.b)+'px';
  divlag2.style.left='0px';
  divlag2.style.width=(xscreen-margns.l-margns.r)+'px';
  divlag2.style.height='fit-content';
  
  if(popUpIsDisplayed1!==''){
   resizePopup({from:popUpIsDisplayed1});
  }
*/  

  
 } 
   
   
}
export {module_svg_bdd}