
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
         var calculx=(e[this.#propriete_pour_deplacement_x]-this.#souris_init_objet.x)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.x;
         var calculy=(e[this.#propriete_pour_deplacement_y]-this.#souris_init_objet.y)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.y;
         this.#souris_init_objet.elem_bouge.setAttribute( 'transform' , 'translate('+calculx+','+calculy+')');
         return;
        }
    }
   
    /*
    ====================================================================================================================
    function sourie_haut
    */
    #sourie_haut(e){
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
    
       console.log(e);
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
            
               /* on remonte jusqu'à un datatype 'table' */
               
               if(tar.tagName.toLowerCase()==='tspan'){
                
                   var par=tar.parentNode;
                   var continuer=true;
       //            debugger
                   while(continuer){
                       if(par.tagName.toLowerCase()==='g'){
                           if(par.getAttribute('data-id')){
                               if(par.getAttribute('data-id').substr(0,16)=='conteneur_table_'){
                                
                                   var valeur_translate=par.getAttribute('transform').replace(/translate\(/g,'').replace(/\)/g,'').split(',');
                                   this.#souris_init_objet.elem_bouge=par;
                                   this.#souris_init_objet.param_bouge={x:parseFloat(valeur_translate[0]) , y:parseFloat(valeur_translate[1]) };
//                                   console.log('this.#souris_init_objet=' , JSON.stringify( this.#souris_init_objet ) );
                                   this.#souris_element_a_deplacer='table';
                                   this.#div_svg.style.userSelect='none';
                                   continuer=false;
                                   return;
                                   
                               }else{
                                   par=par.parentNode;
                               }
                           }else{
                               par=par.parentNode;
                           }
                       }else if(par.tagName.toLowerCase()==='svg'){
                           continuer=false;
                       }else{
                           par=par.parentNode;
                       }
                    
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
   #recursuf_arbre_svg(tab , id_parent , commencer_a){
    
     var str='';
     var l01=tab.length;
     
     for(var i=commencer_a;i<l01;i++){
      
      if(tab[i].id_parent===id_parent){
      
          if(tab[i].type==='g'){
           
              str+='<g';
              
              for(var j in tab[i].proprietes){
               
                  str+=' '+j+'="'+tab[i].proprietes[j]+'"';
                  
              }
              
              str+='>';
              str+=this.#recursuf_arbre_svg(tab,tab[i].id,i+1);
              str+='</g>';
           
          }else{
           
              str+='<'+tab[i].type;
              
              for(var j in tab[i].proprietes){
                  if(typeof tab[i].proprietes[j] === 'string'){
                      str+=' '+j+'="'+tab[i].proprietes[j].replace(/"/g,'&quot;')+'"';
                  }else{
                      str+=' '+j+'="'+tab[i].proprietes[j]+'"';
                  }
                  
              }
              if(tab[i].hasOwnProperty('contenu')){
                  str+='>'+tab[i].contenu+'</'+tab[i].type+'>';
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
        
           var tab=this.#arbre[i].arbre_svg;
           str+=this.#recursuf_arbre_svg(tab,-2,0);
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
           return response.json(); // transforme la réponse JSON reçue en objet JavaScript natif
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
//                      console.log(donnees.valeurs[i]['T0.chi_id_basedd']);
                      
                      
                      this.#arbre[donnees.valeurs[i]['T0.chi_id_basedd']]={
                        'chp_rev_travail_basedd':donnees.valeurs[i]['T0.chp_rev_travail_basedd'],
                        'arbre_svg':[] // {type:'racine_svg',id:-2,id_parent:-2,donnees:{}}
                      };
   //                   console.log('this.#arbre=',this.#arbre);
   //                   return;
                      var obj1=functionToArray(donnees.valeurs[i]['T0.chp_rev_travail_basedd'],true,false,'');
                      if(obj1.status===true){
                          this.#arbre[donnees.valeurs[i]['T0.chi_id_basedd']]['matrice']=obj1.value;
                          
                          
                      }else{
                          logerreur({status : false , message:'0126'});
                          displayMessages('zone_global_messages');
                          return;
                      }
                   }

   /*
       $o1.=' var CSS_TAILLE_REFERENCE_TEXTE='.$css_taille_reference_textes.';'.CRLF;
       $o1.=' var CSS_TAILLE_REFERENCE_BORDER='.$css_taille_reference_border.';'.CRLF;
       $o1.=' var CSS_TAILLE_REFERENCE_PADDING='.$css_taille_reference_padding.';'.CRLF;

   */
//                   console.log( CSS_TAILLE_REFERENCE_TEXTE , CSS_TAILLE_REFERENCE_PADDING , CSS_TAILLE_REFERENCE_BORDER );
                   const hauteur_de_boite=CSS_TAILLE_REFERENCE_TEXTE+2*CSS_TAILLE_REFERENCE_PADDING+2*CSS_TAILLE_REFERENCE_BORDER;
                   const hauteur_de_boite_affichage=hauteur_de_boite+1*CSS_TAILLE_REFERENCE_BORDER;
                   var indice_courant=0;
                   var tableau_des_elements=[];
                   var numero_table=0;
                   var decallage_droite_table=10;
                   var position_xy_table=[decallage_droite_table,10];
                   var indice_table_en_cours=0;
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
                   var id_table_en_cours=0;
                   /* 
                     =============================
                     debut de pour chaque base 
                     =============================
                   */                
                   for(var id_de_la_base in this.#arbre){
                    
//                       console.log('indice de la base id_de_la_base=',id_de_la_base);
                       
                       
                       
                       var tab=this.#arbre[id_de_la_base]['matrice'];
//                       console.log('tab=',tab);
                       this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={type:'g'   ,id:-1,id_parent:-2, proprietes:{transform:'translate(0,0)','data-id':'conteneur_base_'+id_de_la_base}};
                       this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                           type:'rect',id:0 ,id_parent:-1, 
                           proprietes:{'data-type':'base_de_donnee',x:0,y:0,width:120,height:120,style:"stroke:red;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:yellow;fill-opacity:0.2;" , 'data-id':'cadre_base_'+id_de_la_base}
                       };
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
                                   this.#arbre[id_de_la_base].arbre_svg[0].proprietes.transform='translate('+tt[0]+','+tt[1]+')';

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
                                        
                                           /*
                                            conteneur de la table
                                           */
                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                               type:'g'   ,id:indice_courant ,id_parent:-1 , 
                                               proprietes:{
                                                transform:'translate('+(position_xy_table[0])+','+(position_xy_table[1])+')',
                                                'data-id':'conteneur_table_'+numero_table}
                                           };
                                           position_gauche_de_la_table = position_xy_table[0];
                                           position_haut_de_la_table   = position_xy_table[1];
                                        
                                        
                                           indice_table_en_cours=indice_courant;
                                           liste_de_indices_des_elements_a_ajuster_en_largeur=[indice_table_en_cours];
                                           nom_de_la_table=tab[i+1][1];
                                           
                                           /*
                                            rectangle de la table
                                           */
                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                            type:'rect','data-type':'table',id:indice_courant ,id_parent:indice_courant-1 , 
                                            proprietes:{x:0,y:0,width:20,height:50,style:"stroke:blue;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:yellow;fill-opacity:1;" , 'data-id':'cadre_table_'+numero_table}
                                           };
                                           id_table_en_cours=indice_courant-1;
                                           numero_table++;
                                       }
                                   }
                               }
                               /*
                                 ======================
                                 ajout des meta
                                 ======================
                               */
                               for(var i=id_tab_table_en_cours+1;i<l01 && tab[i][3]>tab[id_tab_table_en_cours][3];i++){
                                
                                   if(tab[i][7]===id_tab_table_en_cours && 'meta'===tab[i][1] ){
                                    
                                       for(var l=i+1;l<l01 && tab[l][3]>tab[i][3] ;l++){
                                        
                                           if(tab[l][7]===i && tab[l][1]=='' && tab[l][8]===2){
                                           
                                               /* fonction sans nom dans les meta*/
                                               this.#arbre[id_de_la_base].arbre_svg[indice_table_en_cours].proprietes['__meta_'+tab[l+1][1]]=tab[l+2][1];
                                            
                                           }
                                       }                                    
                                   }
                               }
//                               console.log('hauteur_de_boite=' , hauteur_de_boite );
                               /*
                                 ================
                                 ajout des champs
                                 ================
                               */
                                    
                               /* on met les champs de la table indice_table_en_cours */
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
                                                                   this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                                       type:'g'   ,id:indice_courant ,id_parent:indice_table_en_cours , 
                                                                       proprietes:{transform:'translate('+CSS_TAILLE_REFERENCE_BORDER+','+CSS_TAILLE_REFERENCE_BORDER+')','data-id':'conteneur_nom_table_'+j_dans_tab}
                                                                   };

                                                                   /*
                                                                     rectangle du nom de la table
                                                                     
                                                                   */
                                                                   this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                                       type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                                                                       proprietes:{
                                                                           x:0,
                                                                           y:0,
                                                                           width:18,
                                                                           height:hauteur_de_boite,style:"stroke:white;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:red;fill-opacity:1;" , 'data-id':'cadre_champ_'+j_dans_tab
                                                                       }
                                                                   };
                                                                   liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                                   hauteur_de_la_table+=hauteur_de_boite_affichage;
                                                                   
                                                                   
                                                                    /*
                                                                      texte du nom de la table
                                                                    */
                                                                   this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                                       type:'text',id:indice_courant ,id_parent:indice_courant-2     , 
                                                                       contenu:'<tspan style="cursor:move;">🟥</tspan>'+nom_de_la_table ,
                                                                       proprietes:{x:CSS_TAILLE_REFERENCE_BORDER,y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-CSS_TAILLE_REFERENCE_BORDER,style:"fill:white;" , 'data-id':'texte_table_'+j_dans_tab}
                                                                   };
                                                                   largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_la_table+'🟥'); // ↔ 🟥
                                                                   
                                                                   numero_de_boite++;
                                                                   

                                                               }
                                                               
                                                               /*
                                                                 création de la boite du champ
                                                               */
                                                               
                                                               nom_du_champ=tab[m+1][1];
                                                               largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_du_champ);
                                                               
                                                               /*
                                                                 conteneur du nom du champ
                                                               */
                                                               this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                                   type:'g'   ,id:indice_courant ,id_parent:indice_table_en_cours , 
                                                                   proprietes:{transform:'translate('+CSS_TAILLE_REFERENCE_BORDER+','+((hauteur_de_boite_affichage)*(numero_de_boite)+CSS_TAILLE_REFERENCE_BORDER)+')','data-id':'conteneur_champ_'+j_dans_tab}
                                                               };
                                                               
                                                               
                                                               /*
                                                                 rectangle du nom du champ
                                                               */
                                                               this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                                   type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                                                                   proprietes:{x:0,y:0,width:18,height:hauteur_de_boite,style:"stroke:gold;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:pink;fill-opacity:0.2;" , 'data-id':'cadre_champ_'+j_dans_tab}
                                                               };
                                                               indice_du_champ=indice_courant-1;
                                                               this.#arbre[id_de_la_base].arbre_svg[indice_du_champ].proprietes['__id_svg_champ']=indice_du_champ;
                                                               
                                                               
                                                               liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_du_champ);
                                                               hauteur_de_la_table+=hauteur_de_boite_affichage;
                                                               
                                                               /*
                                                                 texte du nom du champ
                                                               */
                                                               this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                                   type:'text',id:indice_courant ,id_parent:indice_courant-2     , 
                                                                   contenu:nom_du_champ ,
                                                                   proprietes:{x:CSS_TAILLE_REFERENCE_BORDER,y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-CSS_TAILLE_REFERENCE_BORDER,style:"fill:navy;" , 'data-id':'texte_table_'+j_dans_tab}
                                                               };
                                                               
                                                               
                                                               numero_de_boite++;
                                                           }
                                                       }
                                                   }
                                                   /*
                                                   on va chercher les meta de ce champ et des références croisées
                                                   */
                                                   for(var m=l+1;m<l01 && tab[m][3]>tab[l][3];m++){
                                                       if(tab[m][7]===l){
                                                        
                                                           if(tab[m][1]==='meta'){
                                                               
                                                               for(var n=m+1;n<l01 && tab[n][3]>tab[m][3];n++){
                                                                   if(tab[n][7]===m){
                                                                        
                                                                       if(tab[n][1]==='' && tab[n][2] ==='f' && tab[n][8] === 2){
//                                                                          console.log(tab[n+1][1] + ' ' + tab[n+2][1])
                                                                          this.#arbre[id_de_la_base].arbre_svg[indice_du_champ].proprietes['__meta_'+tab[n+1][1]]=tab[n+2][1];
                                                                          
                                                                        
                                                                       }
                                                                   }
                                                               }
                                                           }
                                                           if('references'===tab[m][1] && tab[m][8]===2 ){
                                                            tableau_des_references_croisees.push({
                                                             'id_table_fille'     : id_table_en_cours     ,
                                                             'nom_table_fille'    : nom_de_la_table       ,
                                                             'id_du_champ_fils'   : indice_du_champ       ,
                                                             'nom_du_champ_fils'  : nom_du_champ          ,
                                                             'nom_table_mère'     : tab[m+1][1]           ,
                                                             'nom_du_champ_père'  : tab[m+2][1]           ,
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
                                                        
//                                                           console.log('nom_de_la_table=',nom_de_la_table,'index',tab[k+1][1]);
                                                           nom_de_l_index=tab[k+1][1];
                                                          
                                                           /*
                                                             création de la boite de l'index
                                                           */
                                                           
                                                           largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_l_index);
                                                           
                                                           
                                                           /*
                                                             conteneur du nom de l'index
                                                           */
                                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                            type:'g'   ,id:indice_courant ,id_parent:indice_table_en_cours , 
                                                            proprietes:{transform:'translate('+CSS_TAILLE_REFERENCE_BORDER+','+((hauteur_de_boite_affichage)*(numero_de_boite)+CSS_TAILLE_REFERENCE_BORDER)+')'}
                                                           };
                                                           
                                                           
                                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                               type:'rect',id:indice_courant ,id_parent:indice_courant-1      , 
                                                               proprietes:{x:0,y:0,width:18,height:hauteur_de_boite,style:"stroke:green;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:green;fill-opacity:0.2;" }
                                                           };
                                                           liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                                           this.#arbre[id_de_la_base].arbre_svg[indice_courant++]={
                                                               type:'text',id:indice_courant ,id_parent:indice_courant-2     , contenu:nom_de_l_index ,
                                                               proprietes:{x:CSS_TAILLE_REFERENCE_BORDER,y:hauteur_de_boite-0.3*CSS_TAILLE_REFERENCE_TEXTE-CSS_TAILLE_REFERENCE_BORDER,style:"fill:green;" }};
                                                           

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
                               ajustement de la taille de la base
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
                   }
                   /*
                     =============================
                     fin de pour chaque base
                     =============================
                   */
                   console.log('tableau_des_references_croisees=',tableau_des_references_croisees);



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