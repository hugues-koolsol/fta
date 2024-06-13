
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
//    console.log('e=',e);
    for(var i=0;i<e.length;i++){
     this.#svg_dessin=e[i];
     break;
    }
//    console.log('this.#svg_dessin=' , this.#svg_dessin );
    
    var taillereelle=this.#div_svg.getBoundingClientRect();
    
//    console.log('taillereelle=' , taillereelle );
    
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
    
/*    
    refZnDessin.addEventListenerBase( 'mousedown', this.mouseDownZoneDessin.bind(this) , {capture:false,passive:true} );
    refZnDessin.addEventListenerBase('mousemove', this.mouseMoveZoneDessin.bind(this)  , {capture:false,passive:true} );
    window.addEventListenerBase('mouseup'  , mouseUpFenetre   , {capture:false,passive:true} );
*/    
    
    this.#charger_les_bases_initiales_en_asynchrone();

    
    
//    alert(1);
   }
   
   #sourie_bouge(e){
    if(this.#souris_element_a_deplacer==='svg'){
     
     
     var calculx=(this.#souris_init_objet.x-e.screenX)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.x;
     var calculy=(this.#souris_init_objet.y-e.screenY)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.y;
     
     this.#souris_init_objet.elem_bouge.setAttribute('viewBox',calculx+','+calculy+','+this.#souris_init_objet.elem_bouge.viewBox.baseVal.width+','+this.#souris_init_objet.elem_bouge.viewBox.baseVal.height);
     return;
     
    }else if(this.#souris_element_a_deplacer==='base_de_donnee'){
     var calculx=(e.screenX-this.#souris_init_objet.x)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.x;
     var calculy=(e.screenY-this.#souris_init_objet.y)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.y;
     this.#souris_init_objet.elem_bouge.setAttribute( 'transform' , 'translate('+calculx+','+calculy+')');
     return;
    }else if(this.#souris_element_a_deplacer==='table'){
     e.preventDefault(); /* permer de ne pas sélectionner les textes */
     var calculx=(e.screenX-this.#souris_init_objet.x)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.x;
     var calculy=(e.screenY-this.#souris_init_objet.y)/this.#_dssvg.zoom1+this.#souris_init_objet.param_bouge.y;
     this.#souris_init_objet.elem_bouge.setAttribute( 'transform' , 'translate('+calculx+','+calculy+')');
     return;
    }
   }
   
   /*
   ========================================================================================================================================
   */
   #sourie_haut(e){
    this.#souris_element_a_deplacer='';
    this.#souris_init_objet.elem_bouge=null;
    this.#souris_init_objet.param_bouge={};
    this.#div_svg.style.userSelect='';
   }
   
   /*
   ========================================================================================================================================
   
   */
   #sourie_bas(e){
    
       this.#souris_init_objet.x=e.screenX;
       this.#souris_init_objet.y=e.screenY;
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
                                   this.#souris_element_a_deplacer='table';
                                   this.#div_svg.style.userSelect='none';
                                   continuer=false;
                                   
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
   function recursuf_arbre_svg
   */
   #recursuf_arbre_svg(tab , id_parent , commencer_a){
    
/*

this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:-1,id_parent:-2,indice:indice_courant,indice_parent:-1 , proprietes:{transform:'translate(10,10)'}};
this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:0 ,id_parent:-1,indice:indice_courant,indice_parent:0  , proprietes:{x:1,y:1,width:120,height:120,style;"stroke:yellow;stroke-width:'+CSS_TAILLE_REFERENCE_BORDER+';fill:red;"}};

*/     
    
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
               
                  str+=' '+j+'="'+tab[i].proprietes[j]+'"';
                  
              }
              if(tab[i].hasOwnProperty('contenu')){
//                  str+='>'+tab[i].contenu.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')+'</'+tab[i].type+'>';
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
   
   #ajuster_largeur_de_boite(largeur_de_la_boite,texte){

                                     
      var a=document.createElementNS("http://www.w3.org/2000/svg",'text');
      a.innerHTML=texte;
      a.setAttribute('x',10);
      a.setAttribute('y',20);
      this.#svg_dessin.appendChild(a);
      var b=a.getBBox();
      if(largeur_de_la_boite<(b.width+2)){
       largeur_de_la_boite=b.width+2;
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
            mode: "cors", // no-cors, *cors, same-origin
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
                   console.log(donnees.valeurs[i]['T0.chi_id_basedd']);
                   
                   
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
                const hauteur_de_boite=CSS_TAILLE_REFERENCE_TEXTE+2*CSS_TAILLE_REFERENCE_BORDER;
                var indice_courant=0;
                var tableau_des_elements=[];
                var numero_table=0;
                var decallage_droite_table=10;
                var position_xy_table=[decallage_droite_table,10];
                var position_xy_champ=[10,10];
                var indice_table_en_cours=0;
                var nombre_de_boites_dans_la_table=0;
                var largeur_de_la_boite=1;
                var nom_de_la_table='';
                var nom_du_champ='';
                var nom_de_l_index='';
                var liste_de_indices_des_elements_a_ajuster_en_largeur=[];
                var indice_cadre_base=0;
                var max_x=0;
                var max_y=0;
                var position_haut_de_la_table=0;
                var position_max_bas=0;
                var hauteur_de_la_table=0;
                
                var position_gauche_de_la_table=0;
                var position_max_droite=0;
                var largeur_de_la_table=0;
                
                for(var i in this.#arbre){
                    console.log('i=',i);
                    var tab=this.#arbre[i]['matrice'];
//                    console.log('tab=',tab);
                    this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:-1,id_parent:-2, proprietes:{transform:'translate(0,0)','data-id':'conteneur_base_'+i}};
                    this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:0 ,id_parent:-1, proprietes:{'data-type':'base_de_donnee',x:0,y:0,width:120,height:120,style:"stroke:red;stroke-width:'+CSS_TAILLE_REFERENCE_BORDER+';fill:yellow;fill-opacity:0.2;" , 'data-id':'cadre_base_'+i}};
                    indice_cadre_base=indice_courant-1;
                    //cadre_svg='<rect id="cadre_bdd_'+i+'" data-type="cadre_bdd" x="0" , y="0" width="10" height="10"></rect>';
                    var l01=tab.length;
                    for(var j=0;j<l01;j++){
                     
//                        debugger
                        if(tab[j][3]===2 && tab[tab[j][7]][1]==='' && tab[tab[tab[j][7]][7]][1]==='meta' ){
                            /*
                             on commence par les propriétés de la base
                            */
                            if(tab[j][1]==='position_x_y_sur_svg' ){

                                var tt=tab[j+1][1].split(',')
                                tt[0]=parseInt(tt[0]);
                                tt[1]=parseInt(tt[1]);
                                if(CSS_TAILLE_REFERENCE_BORDER%2!==0){
                                    /* si la taille de la bordure est impaire */
                                    tt[0]+=0.5;
                                    tt[1]+=0.5;
                                }
                                this.#arbre[i].arbre_svg[0].proprietes.transform='translate('+tt[0]+','+tt[1]+')';

                            }else if(tab[j][1]==='hauteur_sur_svg' ){
                             
                                this.#arbre[i].arbre_svg[1].proprietes.height=tab[j+1][1]; // indice_cadre_base

                            }else if(tab[j][1]==='largeur_sur_svg' ){
                             
                                this.#arbre[i].arbre_svg[1].proprietes.width=tab[j+1][1];
                                
                            }else{
                                try{
                                    /* c'est un champ meta autres que ceux destines aux dimensions */
                                    if(tab[j][9]===1){
                                      this.#arbre[i].arbre_svg[1].proprietes[tab[j][1]]=tab[j+1][1];
                                    }
                                }catch(e){
                                }
                            }
                        }else{
                         
/*
create_table(
   meta(
      #(données générales de la table tbl_cibles),
      (nom_long_de_la_table , 'Liste des probrammes cibles '),
      (nom_court_de_la_table , 'programmes cibles'),
      (nom_bref_de_la_table , 'Cibles'),
      (position_x_y_sur_svg , '0,0')
   ),
   n('tbl_cibles'),
   fields(
      #(),
      field(n(chi_id_cible) , type(INTEGER) , primary_key()),
      field(n(chp_nom_cible) , type(STRING)),
      field(n(chp_commentaire_cible) , type(STRING)),
      field(n(chp_dossier_cible) , type(CHARACTER , 3) , not_null() , default('xxx'))
   )
),
add_index(n('tbl_cibles') , unique() , index_name('idx_dossier_cible') , fields('chp_dossier_cible')),

*/                         
                         
                            if('create_table'===tab[j][1]){
                                if(indice_table_en_cours>0){
                                    if(nombre_de_boites_dans_la_table>0){
                                        
                                         /* ajuster la taille de la boite définie précédemment */
                                        
                                        hauteur_de_la_table=(hauteur_de_boite+CSS_TAILLE_REFERENCE_BORDER)*nombre_de_boites_dans_la_table+CSS_TAILLE_REFERENCE_BORDER;
                                        this.#arbre[i].arbre_svg[indice_table_en_cours].proprietes.height=hauteur_de_la_table;
                                        for(var k=0;k<liste_de_indices_des_elements_a_ajuster_en_largeur.length;k++){
                                            if(k===0){
                                                /* le premier élément est la boite contenant tous les champs */
                                                largeur_de_la_table=largeur_de_la_boite+2*CSS_TAILLE_REFERENCE_BORDER;
                                                this.#arbre[i].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_table;
                                                
                                                if( position_max_droite<position_gauche_de_la_table+largeur_de_la_table){
                                                    position_max_droite=position_gauche_de_la_table+largeur_de_la_table;
                                                }
                                                
                                                
                                            }else{
                                                this.#arbre[i].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_boite;
                                            }
                                        }
                                        
                                        if( position_max_bas<position_haut_de_la_table+hauteur_de_la_table){
                                            position_max_bas=position_haut_de_la_table+hauteur_de_la_table;
                                        }
                                        
                                        
                                        /* pour la table suivante */
                                        liste_de_indices_des_elements_a_ajuster_en_largeur=[];
                                        position_xy_table[0]+=largeur_de_la_boite+4*CSS_TAILLE_REFERENCE_BORDER+CSS_TAILLE_REFERENCE_MARGIN;
                                        position_xy_table[1]+=30;
                                        
                                        
                                    }
                                }
                                numero_table++;
                                tableau_des_elements=[{type:'create_table',id:numero_table}];
                                position_xy_champ=[0,0];
                                nombre_de_boites_dans_la_table=0;
                                largeur_de_la_boite=1;

                            }else if('add_index'===tab[j][1]){
                                
                                tableau_des_elements=[];
                                tableau_des_elements.push({type:'index'});
                            }else if('fields'===tab[j][1]){

                                tableau_des_elements.push({type:'fields'});
                              
                              
                            }else if('n'===tab[j][1]){
                             
                             /*
                              si on est dans un champ n()
                             */
                             
                             if(tableau_des_elements.length>0 && tableau_des_elements[tableau_des_elements.length-1].type==='create_table'){

                                 /*
                                  si c'est un nom de table
                                 */
                             
                                 
                                 this.#arbre[i].arbre_svg[indice_courant++]={
                                     type:'g'   ,id:indice_courant ,id_parent:-1 , 
                                     proprietes:{
                                      transform:'translate('+(position_xy_table[0])+','+(position_xy_table[1])+')',
                                      'data-id':'conteneur_table_'+tableau_des_elements[tableau_des_elements.length-1].id}
                                 };
                                 position_gauche_de_la_table = position_xy_table[0];
                                 position_haut_de_la_table   = position_xy_table[1];
                                 
                                 
                                 
                                 
                                 
                                 indice_table_en_cours=indice_courant;
                                 liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_table_en_cours);
                                 nom_de_la_table=tab[j+1][1];
                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'rect','data-type':'table',id:indice_courant ,id_parent:indice_courant-1 , proprietes:{x:0,y:0,width:20,height:50,style:"stroke:blue;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:yellow;fill-opacity:0.2;" , 'data-id':'cadre_table_'+tableau_des_elements[tableau_des_elements.length-1].id}};

                             }else if(tableau_des_elements.length>0 && tableau_des_elements[tableau_des_elements.length-1].type==='fields'){
                              
                                 /*
                                  si c'est un nom de champ
                                 */
                             
                                 if(position_xy_champ[1]===0){
                                     /*
                                      le nom de la table en première position
                                     */
                                     this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:indice_courant ,id_parent:indice_table_en_cours , proprietes:{transform:'translate('+position_xy_champ[0]+','+position_xy_champ[1]+')','data-id':'conteneur_nom_table_'+j}};

                                     if( position_max_bas<position_haut_de_la_table+position_xy_champ[1]){
                                         position_max_bas=position_haut_de_la_table+position_xy_champ[1];
//                                         console.log('sur nom de table '+nom_de_la_table+' position_max_bas=',position_max_bas);
                                     }
                                     
                                     this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:indice_courant ,id_parent:indice_courant-1      , proprietes:{x:CSS_TAILLE_REFERENCE_BORDER,y:CSS_TAILLE_REFERENCE_BORDER,width:18,height:hauteur_de_boite,style:"stroke:red;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:red;fill-opacity:0.2;" , 'data-id':'cadre_champ_'+j}};
                                     liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                     
                                     this.#arbre[i].arbre_svg[indice_courant++]={type:'text',id:indice_courant ,id_parent:indice_courant-2     , contenu:'<tspan style="cursor:move;">🟥</tspan>'+nom_de_la_table ,proprietes:{x:2*CSS_TAILLE_REFERENCE_BORDER,y:hauteur_de_boite-0.2*CSS_TAILLE_REFERENCE_TEXTE,style:"fill:navy;" , 'data-id':'texte_table_'+j}};
                                     largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_la_table+'🟥'); // ↔ 🟥
                                     
                                     position_xy_champ[0]+=0;
                                     position_xy_champ[1]+=hauteur_de_boite+CSS_TAILLE_REFERENCE_BORDER;
                                     nombre_de_boites_dans_la_table++;
                                 }
                                 nom_du_champ=tab[j+1][1];
                                 largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_du_champ);

                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:indice_courant ,id_parent:indice_table_en_cours , proprietes:{transform:'translate('+position_xy_champ[0]+','+position_xy_champ[1]+')','data-id':'conteneur_champ_'+j}};
                                 
                                 
                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:indice_courant ,id_parent:indice_courant-1      , proprietes:{x:CSS_TAILLE_REFERENCE_BORDER,y:CSS_TAILLE_REFERENCE_BORDER,width:18,height:hauteur_de_boite,style:"stroke:yellow;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:pink;fill-opacity:0.2;" , 'data-id':'cadre_champ_'+j}};
                                 liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'text',id:indice_courant ,id_parent:indice_courant-2     , contenu:nom_du_champ ,proprietes:{x:2*CSS_TAILLE_REFERENCE_BORDER,y:hauteur_de_boite-0.2*CSS_TAILLE_REFERENCE_TEXTE,style:"fill:navy;" , 'data-id':'texte_table_'+j}};
                                 
                                 position_xy_champ[0]+=0;
                                 position_xy_champ[1]+=hauteur_de_boite+CSS_TAILLE_REFERENCE_BORDER;
                                 nombre_de_boites_dans_la_table++;
                              
                             }
                            }else if('index_name'===tab[j][1]){
                              if(tableau_des_elements.length>0 && tableau_des_elements[tableau_des_elements.length-1].type==='index'){
                                 nom_de_l_index=tab[j+1][1];
                                 largeur_de_la_boite=this.#ajuster_largeur_de_boite(largeur_de_la_boite,nom_de_l_index);
                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:indice_courant ,id_parent:indice_table_en_cours , proprietes:{transform:'translate('+position_xy_champ[0]+','+position_xy_champ[1]+')','data-id':'conteneur_champ_'+j}};
                                 
                                 
                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:indice_courant ,id_parent:indice_courant-1      , proprietes:{x:CSS_TAILLE_REFERENCE_BORDER,y:CSS_TAILLE_REFERENCE_BORDER,width:18,height:hauteur_de_boite,style:"stroke:green;stroke-width:"+CSS_TAILLE_REFERENCE_BORDER+";fill:green;fill-opacity:0.2;" , 'data-id':'cadre_champ_'+j}};
                                 liste_de_indices_des_elements_a_ajuster_en_largeur.push(indice_courant-1);
                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'text',id:indice_courant ,id_parent:indice_courant-2     , contenu:nom_de_l_index ,proprietes:{x:2*CSS_TAILLE_REFERENCE_BORDER,y:hauteur_de_boite-0.2*CSS_TAILLE_REFERENCE_TEXTE,style:"fill:green;" , 'data-id':'texte_table_'+j}};

                                 position_xy_champ[0]+=0;
                                 position_xy_champ[1]+=hauteur_de_boite+CSS_TAILLE_REFERENCE_BORDER;
                                 nombre_de_boites_dans_la_table++;
                              
                              }
                              
                             
                            }
                            /*
                            
                            */
                        }
                    }
                    
                    if(indice_table_en_cours>0){
                     if(nombre_de_boites_dans_la_table>0){
                       /* ajuster la taille de la boite */
                      
                      hauteur_de_la_table=(hauteur_de_boite+CSS_TAILLE_REFERENCE_BORDER)*nombre_de_boites_dans_la_table+CSS_TAILLE_REFERENCE_BORDER;
                      this.#arbre[i].arbre_svg[indice_table_en_cours].proprietes.height=hauteur_de_la_table;
                      this.#arbre[i].arbre_svg[indice_table_en_cours].proprietes.width=largeur_de_la_boite;

                      for(var k=0;k<liste_de_indices_des_elements_a_ajuster_en_largeur.length;k++){
                          if(k===0){
                              //this.#arbre[i].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_boite+2*CSS_TAILLE_REFERENCE_BORDER;
                              
                              largeur_de_la_table=largeur_de_la_boite+2*CSS_TAILLE_REFERENCE_BORDER;
                              this.#arbre[i].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_table;
                              
                              if( position_max_droite<position_gauche_de_la_table+largeur_de_la_table){
                                  position_max_droite=position_gauche_de_la_table+largeur_de_la_table;
                              }
                              
                              
                              
                          }else{
                              this.#arbre[i].arbre_svg[liste_de_indices_des_elements_a_ajuster_en_largeur[k]].proprietes.width=largeur_de_la_boite;
                          }
                      }
                      liste_de_indices_des_elements_a_ajuster_en_largeur=[];
                      
                      
                      if( position_max_bas<position_haut_de_la_table+hauteur_de_la_table){
                          position_max_bas=position_haut_de_la_table+hauteur_de_la_table;
                      }
                      

                     }
                    }
                    
                    /* en dernier lieu on ajuste la hauteur de la boite contenant le shema de la base */
//                    console.log('position_max_bas=',position_max_bas);
                    this.#arbre[i].arbre_svg[indice_cadre_base].proprietes.height=position_max_bas+2*CSS_TAILLE_REFERENCE_MARGIN; // 
                    this.#arbre[i].arbre_svg[indice_cadre_base].proprietes.width=position_max_droite+2*CSS_TAILLE_REFERENCE_MARGIN; // 
                    

                    
                }
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