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
    #propriete_pour_deplacement_x='pageX';
    #propriete_pour_deplacement_y='pageY';


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
    this.#souris_haut(e.touches[0])
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
            this.#souris_init_objet.elem_bouge.setAttribute( 'transform' , 'translate('+calculx+','+calculy+')');
            this.#souris_init_objet.elem_bouge.setAttribute( 'decallage_x' , calculx );
            this.#souris_init_objet.elem_bouge.setAttribute( 'decallage_y' , calculy );
            
            return;
         
        }else if(this.#souris_element_a_deplacer==='table'){
         
            this.#svg_souris_delta_x=(e[this.#propriete_pour_deplacement_x]-this.#souris_init_objet.x)*this.#_dssvg.zoom1;
            this.#svg_souris_delta_y=(e[this.#propriete_pour_deplacement_y]-this.#souris_init_objet.y)*this.#_dssvg.zoom1;
            var calculx=this.#svg_souris_delta_x+this.#souris_init_objet.param_bouge.x;
            var calculy=this.#svg_souris_delta_y+this.#souris_init_objet.param_bouge.y;
            this.#souris_init_objet.elem_bouge.setAttribute( 'transform'  , 'translate('+calculx+','+calculy+')');
            this.#souris_init_objet.elem_bouge.setAttribute( 'decallage_x' , calculx );
            this.#souris_init_objet.elem_bouge.setAttribute( 'decallage_y' , calculy );

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
    function souris_haut
    */
    #souris_haut(e){
        if(this.#souris_element_a_deplacer==='table'){
            /* si on a bougé une table, il faut remettre les positions des liens dans les svg_tableaux_des_references_amont_aval */
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
   function souris_bas
   */
   #souris_bas(e){
    
//       console.log('souris_bas e=',e);
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
           if(tar.getAttribute('type_element')){
            
               if(tar.getAttribute('type_element') && tar.getAttribute('type_element')==='rectangle_de_base'){

                   var valeur_translate=tar.parentNode.getAttribute('transform').replace(/translate\(/g,'').replace(/\)/g,'').split(',');
                   this.#souris_init_objet.elem_bouge=tar.parentNode;
                   this.#souris_init_objet.param_bouge={x:parseFloat(valeur_translate[0]) , y:parseFloat(valeur_translate[1]) };
                   this.#souris_element_a_deplacer='rectangle_de_base';
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
       /*
       pour chaque référence de base
       */
       
       for(var i in this.#arbre){
        
           var tab=JSON.parse(JSON.stringify(this.#arbre[i].arbre_svg));
           
           /* 
           il faut trouver le premier élément non null du tableau
           
           */
           for(var j=0;j<tab.length;j++){
            if(tab[j]!==null){

              str+=this.#recursuf_arbre_svg(tab,-1,j);
              break;
            }
           }
           
           
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
         largeur_de_la_boite=parseInt(b.width,10)+2*this.#taille_bordure;
        }
        a.remove();
        return(largeur_de_la_boite);
     }
       #liste_des_meta_base=['nom_long_de_la_base','nom_court_de_la_base','nom_bref_de_la_base','environnement_de_la_base'];
       #liste_des_meta_table=['nom_long_de_la_table','nom_court_de_la_table','nom_bref_de_la_table'];
       #liste_des_meta_champ=['nom_long_du_champ','nom_court_du_champ','nom_bref_du_champ'];
        /*
        ========================================================================================================
        on parcours l'arbre svg pour reconstruire le rev
        function sauvegarder_la_base
        */
        sauvegarder_la_base(id_bdd_de_la_base){
            clearMessages('zone_global_messages');
            var lst=document.getElementsByTagName('g');
            var racine_du_svg=null;

            for(var i=0;i<lst.length;i++){
                if( lst[i].getAttribute('chi_id_basedd') && lst[i].getAttribute('chi_id_basedd') == id_bdd_de_la_base){
                    racine_du_svg=lst[i];
                    break;
                }
            }
            if(racine_du_svg===null){
               
               logerreur({status : false , message:'0370 il y a eu un problème lors de la récupération de l\'arbre svg'});
               displayMessages('zone_global_messages');
               return;
            }
            var t='';
            /*
              ce sont les rectangles qui contiennent les informations sur la base
            */
            lst=racine_du_svg.getElementsByTagName('rect');
            console.log(lst);
            for(var i=0;i<lst.length;i++){
                 
                if( lst[i].getAttribute('type_element') && lst[i].getAttribute('type_element') == 'rectangle_de_base'){
                    console.log(lst[i].getAttribute('type_element'))
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
                            console.log('obj_matrice_meta_de_la_base=' , obj_matrice_meta_de_la_base.value );

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
                    t+='\ncreate_table(';
                    t+='\n meta(';
                    var nom_de_la_table=lst[i].getAttribute('nom_de_la_table');
                    
                    var texte_des_meta_table='';      
                    var meta_rev_de_la_table=lst[i].getAttribute('meta_rev_de_la_table');
                    if(donnees_rev_meta_de_la_base && meta_rev_de_la_table!=='' ){
                        var obj_matrice_meta_de_la_table=functionToArray(meta_rev_de_la_table , true, false , '');
                        
                            if(obj_matrice_meta_de_la_table.status===true){
                                console.log('obj_matrice_meta_de_la_table=' , obj_matrice_meta_de_la_table.value );

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
                    
                    var json_meta_de_la_table=JSON.parse(lst[i].getAttribute('meta_de_la_table'));
                    console.log('json_meta_de_la_table=' , json_meta_de_la_table );
                    t+='\n   (position_x_y_sur_svg ,\''+lst[i].parentNode.getAttribute('decallage_x')+','+lst[i].parentNode.getAttribute('decallage_y')+'\')';
                    t+='\n ),';
                    t+='\n n(\''+nom_de_la_table.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\'),';
                    t+='\n fields(';
                    
                    var lst2=lst[i].parentNode.getElementsByTagName('rect');
                    console.log('lst2=' , lst2 );
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
                                           if(obj_matrice_du_champ.value[k][1]==='n'  ){
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
                           t+='\n   meta('+texte_des_meta_champ+'\n   ),';
                           t+='\n   n(\''+nom_du_champ.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'')+'\')';
                           t+=texte_type_et_contraintes;
                           t+='\n  )';
                        }else if( lst2[j].getAttribute('type_element') && lst2[j].getAttribute('type_element') == 'rectangle_d_index'){
                            
                            /**
                            t+='\nadd_index_in_table(';
                            var nom_de_la_table=lst2[j].getAttribute('nom_de_la_table');
                            t+='\n n('+nom_de_la_table+'),';
                            
                            var donnees_rev_de_l_index=lst2[j].getAttribute('donnees_rev_de_l_index');
                            var obj_matrice_du_champ=functionToArray(donnees_rev_de_l_index , true, false , '');
                            if(obj_matrice_du_champ.status===true){
                             
                             for(k=1;k<obj_matrice_du_champ.value.length;k++){
                                 if(obj_matrice_du_champ.value[k][7] === 0 ){
                                     if(obj_matrice_du_champ.value[k][2]==='f'){
                                         if(obj_matrice_du_champ.value[k][1]==='n' || obj_matrice_du_champ.value[k][1]==='meta' ){
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
                            
                            */
                         
                        }
                     
                    }
                    
                    
                    t+='\n ),';
                    t+='\n)';
                }else if( lst[i].getAttribute('type_element') && lst[i].getAttribute('type_element') == 'rectangle_d_index'){
                 
                            t+='\nadd_index(';
                            var nom_de_la_table= lst[i].getAttribute('nom_de_la_table');
                            t+='\n n('+nom_de_la_table+'),';
                            
                            var donnees_rev_de_l_index= lst[i].getAttribute('donnees_rev_de_l_index');
                            var obj_matrice_du_champ=functionToArray(donnees_rev_de_l_index , true, false , '');
                            if(obj_matrice_du_champ.status===true){
                             
                             for(k=1;k<obj_matrice_du_champ.value.length;k++){
                                 if(obj_matrice_du_champ.value[k][7] === 0 ){
                                     if(obj_matrice_du_champ.value[k][2]==='f'){
                                         if(obj_matrice_du_champ.value[k][1]==='n' || obj_matrice_du_champ.value[k][1]==='meta' ){
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
                    console.log(donnees); // Les données JSON analysées par l'appel `donnees.json()`
                    if(donnees.status==='OK'){
                    }
                }
            );
            
            
            
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
                          logerreur({status : false , message:'0803 le champ chp_rev_travail_basedd est [vide module_svg[charger_les_bases_en_asynchrone]]'});
                          displayMessages('zone_global_messages');
                          return;
                       
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
                   const hauteur_de_boite=CSS_TAILLE_REFERENCE_TEXTE+2*CSS_TAILLE_REFERENCE_PADDING+2*this.#taille_bordure;
                   const hauteur_de_boite_affichage=hauteur_de_boite+1*this.#taille_bordure;
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
                   var max_x=0;
                   var max_y=0;
                   var position_min_haut=999999;
                   var position_haut_de_la_table=0;
                   var position_min_gauche=999999;
                   var position_max_bas=0;
                   var hauteur_de_la_table=0;
                   var indice_du_champ=0;
                   
                   var position_gauche_de_la_table=0;
                   var position_max_droite=0;
                   var largeur_de_la_table=0;
                   var tableau_des_references_croisees=[];
                   var id_svg_base_en_cours=0;
                   var id_svg_rectangle_base_en_cours=0;
                   var id_svg_table_en_cours=0;
                   var id_svg_champ_en_cours=0;
                   /* 
                     =============================
                     debut de pour chaque base 
                     =============================
                   */                
                   
                   for(var id_bdd_de_la_base in this.#arbre){
                    
//                       console.log('indice de la base id_bdd_de_la_base=',id_bdd_de_la_base);
                       largeur_de_la_boite=1;
                       this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base]=[];

                       var tab=this.#arbre[id_bdd_de_la_base]['matrice'];
//                       console.log('tab=',tab);

                       id_svg_base_en_cours=indice_courant;
                       this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                           type:'g'   ,
                           id:id_svg_base_en_cours,
                           id_parent:-1, 
                           proprietes:{
                               type_element : 'conteneur_de_base',
                               chi_id_basedd : id_bdd_de_la_base ,
                               id:indice_courant,
                               id_svg_base_en_cours : id_svg_base_en_cours,
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
                           id_parent:id_svg_base_en_cours, 
                           proprietes:{
                               type_element : 'rectangle_de_base',
                               chi_id_basedd : id_bdd_de_la_base ,
                               id:indice_courant,
                               id_svg_base_en_cours : id_svg_base_en_cours,
                               x:0,y:0,width:120,height:120,style:"stroke:red;stroke-width:"+this.#taille_bordure+";fill:yellow;fill-opacity:0.2;" 
                           }
                       };
                       indice_courant++;
                       var id_conteneur_texte_base=indice_courant;
                       this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                           type:'g'   ,
                           id:indice_courant,
                           id_parent:id_svg_base_en_cours, 
                           proprietes:{
                               type_element : 'conteneur_du_texte_de_la_base',
                               id:indice_courant,
                               id_svg_base_en_cours : id_svg_base_en_cours,
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
                               id_svg_base_en_cours : id_svg_base_en_cours,
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
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_base_en_cours].proprietes.decallage_x=tt[0];
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_base_en_cours].proprietes.decallage_y=tt[1];
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_base_en_cours].proprietes.transform='translate('+tt[0]+','+tt[1]+')';
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_base_en_cours].proprietes.decallage_x=tt[0];
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_base_en_cours].proprietes.decallage_y=tt[1];


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
                                             '__meta_position_x_y_sur_svg' : '',
                                           };
                                           var position_de_la_table=[0,0];
                                        
                                           /*
                                             ======================
                                             recherche des meta
                                             ======================
                                           */
                                           var meta_rev_de_la_table='';
                                           for(var j=id_tab_table_en_cours+1;j<l01 && tab[j][3]>tab[id_tab_table_en_cours][3];j++){
                                            
                                               if(tab[j][7]===id_tab_table_en_cours && 'meta'===tab[j][1] ){
                                                
                                                  var obj=a2F1(tab,j,false,j+1,false);
                                                  if(obj.status===true){
                                                   meta_rev_de_la_table=obj.value;
                                                   
                                                  }else{
                                                      logerreur({status : true , message : '0883 le meta de la table "'+nom_de_la_table+'"' });
                                                      displayMessages('zone_global_messages');
                                                      return;
                                                  }
                                                
                                                   for(var l=j+1;l<l01 && tab[l][3]>tab[j][3] ;l++){
                                                    
                                                       if(tab[l][7]===j && tab[l][1]=='' && tab[l][8]===2){
                                                       
                                                           /* fonction sans nom dans les meta*/
//                                                           console.log(' meta table' , tab[l+1][1] , tab[l+2][1] );
                                                           meta_de_la_table['__meta_'+tab[l+1][1]]=tab[l+2][1];
                                                        
                                                       }
                                                   }                                    
                                               }
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
                                           this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
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
                                           this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                            type:'rect','data-type':'table',id:indice_courant ,id_parent:id_svg_conteneur_table , 
                                            proprietes:{
                                             id                     : indice_courant,
                                             type_element           : 'rectangle_de_table',
                                             id_svg_base_en_cours   : id_svg_base_en_cours,
                                             id_svg_table_en_cours  : id_svg_table_en_cours,
                                             nom_de_la_table        : nom_de_la_table ,
                                             x:0,y:0,width:20,height:50,style:"stroke:blue;stroke-width:"+this.#taille_bordure+";fill:yellow;fill-opacity:1;" , 'data-id':'cadre_table_'+numero_table,
                                             'meta_de_la_table'     : JSON.stringify(meta_de_la_table),
                                             id_svg_conteneur_table : id_svg_conteneur_table ,
                                             meta_rev_de_la_table   : meta_rev_de_la_table,
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
                                                                   this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                                                       type:'g'   ,id:indice_courant ,id_parent:id_svg_conteneur_table , 
                                                                       proprietes:{
                                                                           id:indice_courant,
                                                                           type_element : 'conteneur_de_nom_de_table',
                                                                           id_svg_base_en_cours : id_svg_base_en_cours,
                                                                           id_svg_table_en_cours : id_svg_table_en_cours,
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
                                                                   this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
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
                                                                           style:"stroke:white;stroke-width:"+this.#taille_bordure+";fill:red;fill-opacity:1;" 
                                                                       }
                                                                   };
                                                                   indice_courant++;
                                                                   liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                                   hauteur_de_la_table+=hauteur_de_boite_affichage;
                                                                   
                                                                   
                                                                    /*
                                                                      texte du nom de la table
                                                                    */
                                                                   this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                                                       type:'text',id:indice_courant ,id_parent:indice_courant-2     , 
                                                                       contenu:'<tspan style="cursor:move;" id_a_deplacer="'+id_svg_table_en_cours+'" reference_de_le_base="'+id_bdd_de_la_base+'">🟥</tspan>'+nom_de_la_table ,
                                                                       proprietes:{
                                                                           id:indice_courant,
                                                                           type_element : 'texte_de_nom_de_table',
                                                                           id_svg_base_en_cours : id_svg_base_en_cours,
                                                                           id_svg_table_en_cours : id_svg_table_en_cours,
                                                                           id_svg_champ_en_cours : id_svg_champ_en_cours,
                                                                           nom_de_la_table       : nom_de_la_table ,
                                                                           x:this.#taille_bordure,
                                                                           y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-this.#taille_bordure,
                                                                           style:"fill:white;cursor:context-menu;" , 
                                                                       }
                                                                   };
                                                                   indice_courant++;
                                                                   largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_la_table+'🟥'); // ↔ 🟥
                                                                   
                                                                   numero_de_boite++;
                                                                   

                                                               }
                                                               
                                                               nom_du_champ=tab[m+1][1];
                                                               
                                                               
                                                               /*
                                                                 création de la boite du champ
                                                               */
                                                               
                                                               largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_du_champ);
                                                               
                                                               id_svg_champ_en_cours=indice_courant;
                                                               /*
                                                                 conteneur du nom du champ
                                                               */
                                                               this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                                                   type:'g'   ,id:indice_courant ,id_parent:id_svg_conteneur_table , 
                                                                   proprietes:{
                                                                       id:indice_courant,
                                                                       type_element          : 'conteneur_de_champ'  ,
                                                                       id_svg_base_en_cours  : id_svg_base_en_cours  ,
                                                                       id_svg_table_en_cours : id_svg_table_en_cours ,
                                                                       id_svg_champ_en_cours : id_svg_champ_en_cours ,
                                                                       nom_de_la_table       : nom_de_la_table       ,
                                                                       nom_du_champ          : nom_du_champ          ,
                                                                       decallage_x           : this.#taille_bordure,
                                                                       decallage_y           : ((hauteur_de_boite_affichage)*(numero_de_boite)+this.#taille_bordure),
                                                                       transform:'translate('+(this.#taille_bordure)+','+((hauteur_de_boite_affichage)*(numero_de_boite)+this.#taille_bordure)+')',
                                                                       'data-id':'conteneur_champ_'+j_dans_tab       ,
                                                                   }
                                                               };
                                                               indice_courant++;
                                                               
                                                               var obj1=a2F1(tab,l,false,l+1,false);
                                                               if(obj1.status===true){
//                                                                   console.log('obj1.value=',obj1.value);
                                                                   var donnees_rev_du_champ=obj1.value;
                                                               }else{
                                                                   logerreur({status : true , message : '0849 problème sur les données du champ "'+nom_du_champ+'"' });
                                                                   displayMessages('zone_global_messages');
                                                                   return;
                                                               }
                                                               
                                                               /*
                                                                 rectangle du nom du champ
                                                               */
                                                               this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                                                   type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                                                                   proprietes:{
                                                                       id:indice_courant,
                                                                       type_element : 'rectangle_de_champ',
                                                                       id_svg_base_en_cours : id_svg_base_en_cours,
                                                                       id_svg_table_en_cours : id_svg_table_en_cours,
                                                                       id_svg_champ_en_cours : id_svg_champ_en_cours,
                                                                       nom_de_la_table       : nom_de_la_table ,
                                                                       nom_du_champ          : nom_du_champ          ,
                                                                       x:0,y:0,width:18,height:hauteur_de_boite,style:"stroke:gold;stroke-width:"+this.#taille_bordure+";fill:pink;fill-opacity:0.2;" , 
                                                                       donnees_rev_du_champ  : donnees_rev_du_champ  ,
                                                                       
                                                                   }
                                                               };
                                                               indice_courant++;
                                                               indice_du_champ=indice_courant-1;
                                                               this.#arbre[id_bdd_de_la_base].arbre_svg[indice_du_champ].proprietes['__id_svg_champ']=indice_du_champ;
                                                               
                                                               
                                                               liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_du_champ);
                                                               hauteur_de_la_table+=hauteur_de_boite_affichage;
                                                               
                                                               /*
                                                                 texte du nom du champ
                                                               */
                                                               this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
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
                                                                       x:this.#taille_bordure,
                                                                       y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-this.#taille_bordure,style:"fill:navy;" , 
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
                                                                id:indice_courant,
                                                                type_element : 'conteneur_d_index',
                                                                id_svg_base_en_cours : id_svg_base_en_cours,
                                                                id_svg_table_en_cours : id_svg_table_en_cours,
                                                                nom_de_la_table       : nom_de_la_table ,
                                                                decallage_x           : this.#taille_bordure,
                                                                decallage_y           : ((hauteur_de_boite_affichage)*(numero_de_boite)+this.#taille_bordure),
                                                                transform:'translate('+this.#taille_bordure+','+((hauteur_de_boite_affichage)*(numero_de_boite)+this.#taille_bordure)+')'}
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
                                                                   id:indice_courant,
                                                                   type_element : 'rectangle_d_index',
                                                                   id_svg_base_en_cours : id_svg_base_en_cours,
                                                                   id_svg_table_en_cours : id_svg_table_en_cours,
                                                                   nom_de_la_table       : nom_de_la_table ,
                                                                   nom_de_l_index    : nom_de_l_index ,
                                                                   donnees_rev_de_l_index : donnees_rev_de_l_index,
                                                                   x:0,y:0,width:18,height:hauteur_de_boite,style:"stroke:green;stroke-width:"+this.#taille_bordure+";fill:green;fill-opacity:0.2;" 
                                                               }
                                                           };
                                                           indice_courant++;
                                                           liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                           this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                                                               type:'text',id:indice_courant ,id_parent:indice_courant-2     , contenu:nom_de_l_index ,
                                                               proprietes:{
                                                                   id:indice_courant                             ,
                                                                   type_element : 'texte_d_index',
                                                                   id_svg_base_en_cours : id_svg_base_en_cours   ,
                                                                   id_svg_table_en_cours : id_svg_table_en_cours ,
                                                                   nom_de_la_table       : nom_de_la_table ,
                                                                   x:this.#taille_bordure,y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-this.#taille_bordure,style:"fill:green;" 
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
                           
                           this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.x=position_min_gauche;
                           this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.y=position_min_haut;
                           this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.height=position_max_bas+2*CSS_TAILLE_REFERENCE_MARGIN-position_min_haut; // 
                           this.#arbre[id_bdd_de_la_base].arbre_svg[id_svg_rectangle_base_en_cours].proprietes.width=position_max_droite+2*CSS_TAILLE_REFERENCE_MARGIN-position_min_gauche; // 
                           this.#arbre[id_bdd_de_la_base].arbre_svg[id_conteneur_texte_base].proprietes.transform='translate('+position_min_gauche+','+position_min_haut+')';

                           
                       }
                       /*
                       */
                       var offset_base=[];
                       var offset_table_mere=[];
                       var offset_champ_pere=[];
                       var largeur_table_mere=0;
                       var offset_table_fille=[];
                       var offset_champ_fils=[];
                       this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base]=[];
                       var id_table_mere=0;
//                       console.log('tableau_des_references_croisees=',tableau_des_references_croisees);
                       for( var i=0;i<tableau_des_references_croisees.length;i++){
                           id_table_mere=0;

                           for( var j=0;j<this.#arbre[id_bdd_de_la_base].arbre_svg.length-id_svg_base_en_cours;j++){
                            
                               var indice_svg=j+id_svg_base_en_cours;
                               try{   
                                   if(
                                       this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_mère
                                    && this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.type_element==='conteneur_de_table'
                                    
                                   ){
                                       offset_table_mere=[
                                         parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.decallage_x),
                                         parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.decallage_y)
                                       ];
                                       id_table_mere=this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.id_svg_table_en_cours;
                                       if(i===0){
//                                           console.log('offset_table_mere',offset_table_mere);
                                       }
                                   }
                               }catch(e){
                                debugger
                               }

                               if(
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_mère
                                && this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.type_element==='rectangle_de_table'
                                
                               ){
                                   largeur_table_mere=parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.width);
                                   
                               }

                               if(
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_mère
                                && this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.nom_du_champ===tableau_des_references_croisees[i].nom_du_champ_père
                                && this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.type_element==='conteneur_de_champ'
                               ){
                                   offset_champ_pere=[
                                       parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.decallage_x),
                                       parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.decallage_y)
                                   ];
                               }

                               if(
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_fille
                                && this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.type_element==='conteneur_de_table'
                                
                               ){
                                   offset_table_fille=[
                                       parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.decallage_x),
                                       parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.decallage_y)
                                   ];
                               }

                               if(
                                   this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.nom_de_la_table===tableau_des_references_croisees[i].nom_table_fille
                                && this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.nom_du_champ===tableau_des_references_croisees[i].nom_du_champ_fils
                                && this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.type_element==='conteneur_de_champ'
                               ){
                                   offset_champ_fils=[
                                       parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.decallage_x),
                                       parseFloat(this.#arbre[id_bdd_de_la_base].arbre_svg[indice_svg].proprietes.decallage_y)
                                   ];
                               }
                           }
                           var p1=[(offset_table_fille[0]+offset_champ_fils[0])                    , offset_table_fille[1]+offset_champ_fils[1]+parseInt(hauteur_de_boite/2,10) ];
                           var p2=[(offset_table_mere[0] +offset_champ_pere[0]+largeur_table_mere) , offset_table_mere[1] +offset_champ_pere[1]+parseInt(hauteur_de_boite/2,10) ];

                           this.#svg_tableaux_des_references_amont_aval[id_bdd_de_la_base].push({
                               id_table_mere  : id_table_mere   ,
                               id_table_fille : tableau_des_references_croisees[i].id_fable_fille  ,
                               id_du_path     : indice_courant,
                               p1             : p1,
                               p2             : p2,
                               reference_de_le_base : id_bdd_de_la_base,
                           });
                           
                           var d='M '+p1[0]+' '+p1[1]   +   ' C '+(p1[0]-30)+' '+p1[1]  +    ' '+(p2[0]+30)+' '+p2[1]   +     ' '+p2[0]+' '+p2[1]    ;
                           this.#arbre[id_bdd_de_la_base].arbre_svg[indice_courant]={
                               type:'path',id:indice_courant ,id_parent:id_svg_base_en_cours , 
                               proprietes:{
                                   id                   : indice_courant ,
                                   d                    : d ,
                                   type_element         : 'reference_croisée'  ,
                                   id_svg_base_en_cours : id_svg_base_en_cours ,
                                   style                : 'stroke:aqua;stroke-width:'+(this.#taille_bordure*3)+';fill:transparent;stroke-linejoin:round;stroke-linecap:round;',
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
  if(this.#_dssvg.zoom1<1){
   this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M 0 0 l 100 100 l 0 -100 l -100 100 Z" fill="pink" fill-opacity=".1"/%3E%3C/svg%3E\')';
   this.#div_svg.style.backgroundSize=(100*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionX=(-(this.#_dssvg.viewBoxInit[0]*this.#_dssvg.zoom1))+'px';
   this.#div_svg.style.backgroundPositionY=(-(this.#_dssvg.viewBoxInit[1]*this.#_dssvg.zoom1))+'px';
  }else if(this.#_dssvg.zoom1<64){
   this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"%3E%3Cpath d="M 0 0 l 10 10 l 0 -10 l -10 10 Z" fill="black" fill-opacity=".04"/%3E%3C/svg%3E\')';
   this.#div_svg.style.backgroundSize=(10*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionX=(-(this.#_dssvg.viewBoxInit[0]*this.#_dssvg.zoom1))+'px';
   this.#div_svg.style.backgroundPositionY=(-(this.#_dssvg.viewBoxInit[1]*this.#_dssvg.zoom1))+'px';
  }else{
   this.#div_svg.style.background='url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Cpath d="M 0 0 l 1 1 l 0 -1 l -1 1 Z" fill="red" fill-opacity=".04"/%3E%3C/svg%3E\')';
   this.#div_svg.style.backgroundSize=(1*this.#_dssvg.zoom1)+'px';
   this.#div_svg.style.backgroundPositionX=(-(this.#_dssvg.viewBoxInit[0]*this.#_dssvg.zoom1))+'px';
   this.#div_svg.style.backgroundPositionY=(-(this.#_dssvg.viewBoxInit[1]*this.#_dssvg.zoom1))+'px';
  }
 }
   
   
   
}
export {module_svg_bdd}