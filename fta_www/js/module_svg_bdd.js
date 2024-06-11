
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
    
    this.#div_svg.style.maxHeight='80vh';
    this.#div_svg.style.height='80vh';
    
    var e=this.#div_svg.getElementsByTagName('svg');
//    console.log('e=',e);
    for(var i=0;i<e.length;i++){
     this.#svg_dessin=e[i];
     break;
    }
//    console.log('this.#svg_dessin=' , this.#svg_dessin );
    
    var taillereelle=this.#div_svg.getBoundingClientRect();
    
//    console.log('taillereelle=' , taillereelle );
    
    var hauteur_de_la_div=parseInt(taillereelle.height,10);
    var largeur_de_la_div=parseInt(taillereelle.width,10);
    
    this.#div_svg.style.height=hauteur_de_la_div+'px';
    this.#div_svg.style.width=largeur_de_la_div+'px';

    /*
     le viewbox du svg est la taille de la div -2*bordure
    */

    this.#hauteur_du_svg=parseInt(hauteur_de_la_div-2*this.#taille_bordure,10);
    this.#largeur_du_svg=parseInt(largeur_de_la_div-2*this.#taille_bordure,10);
    

    this.#svg_dessin.setAttribute('viewBox','0 0 '+this.#largeur_du_svg+' '+this.#hauteur_du_svg);
    this.#svg_dessin.style.width=this.#largeur_du_svg+'px';
    this.#svg_dessin.style.height=this.#hauteur_du_svg+'px';
    
    this.#_dssvg.viewBoxInit=[0,0,this.#largeur_du_svg,this.#hauteur_du_svg];
    
    this.#div_svg.addEventListener('wheel', this.zoom_avec_roulette.bind(this) ,{capture:false,passive:true} );  
    this.#charger_les_bases_initiales_en_asynchrone();

    
    
//    alert(1);
   }
   
   /*
   ========================================================================================================
   function recursuf_arbre_svg
   */
   #recursuf_arbre_svg(tab , id_parent , commencer_a){
    
/*

this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:-1,id_parent:-2,indice:indice_courant,indice_parent:-1 , proprietes:{transform:'translate(10,10)'}};
this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:0 ,id_parent:-1,indice:indice_courant,indice_parent:0  , proprietes:{x:1,y:1,width:120,height:120,style;"stroke:yellow;stroke-opacity:1;stroke-width:1;fill:red;"}};

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
              
              str+=' />';
           
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

                var indice_courant=0;
                var tableau_des_elements=[];
                var numero_table=0;
                var position_xy_table=[10,10];
                var position_xy_champ=[10,10];
                var indice_table_en_cours=0;
                
                for(var i in this.#arbre){
                    console.log('i=',i);
                    this.#arbre[i].toto='tata';
                    var tab=this.#arbre[i]['matrice'];
//                    console.log('tab=',tab);
                    this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:-1,id_parent:-2, proprietes:{transform:'translate(0,0)','data-id':'conteneur_base_'+i}};
                    this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:0 ,id_parent:-1, proprietes:{x:0,y:0,width:120,height:120,style:"stroke:red;stroke-opacity:1;stroke-width:1;fill:yellow;fill-opacity:0.2;" , 'data-id':'cadre_base_'+i}};
                    //cadre_svg='<rect id="cadre_bdd_'+i+'" data-type="cadre_bdd" x="0" , y="0" width="10" height="10"></rect>';
                    var l01=tab.length;
                    for(var j=0;j<l01;j++){
                     
//                        debugger
                        if(tab[j][3]===2 && tab[tab[j][7]][1]==='' && tab[tab[tab[j][7]][7]][1]==='meta' ){
                            /*
                             on commence par les propriétés de la base
                            */
                            if(tab[j][1]==='position_x_y_sur_svg' ){

                                this.#arbre[i].arbre_svg[0].proprietes.transform='translate('+tab[j+1][1]+')';

                            }else if(tab[j][1]==='hauteur_sur_svg' ){
                             
                                this.#arbre[i].arbre_svg[1].proprietes.height=tab[j+1][1];

                            }else if(tab[j][1]==='largeur_sur_svg' ){
                             
                                this.#arbre[i].arbre_svg[1].proprietes.width=tab[j+1][1];
                                
                            }else{
                                try{
//                                    debugger
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
                                numero_table++;
                                tableau_des_elements=[{type:'create_table',id:numero_table}];
                                position_xy_champ=[0,0];

                            }else if('add_index'===tab[j][1]){
                                tableau_des_elements=[];
                            }else if('fields'===tab[j][1]){

                                tableau_des_elements.push({type:'fields'});
                              
                              
                            }else if('n'===tab[j][1]){
                             if(tableau_des_elements.length>0 && tableau_des_elements[tableau_des_elements.length-1].type==='create_table'){

                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:indice_courant ,id_parent:-1               , proprietes:{transform:'translate('+(position_xy_table[0])+','+(position_xy_table[1])+')','data-id':'conteneur_table_'+tableau_des_elements[tableau_des_elements.length-1].id}};
                                 indice_table_en_cours=indice_courant;
                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:indice_courant ,id_parent:indice_courant-1 , proprietes:{x:0,y:0,width:20,height:50,style:"stroke:blue;stroke-opacity:1;stroke-width:1;fill:yellow;fill-opacity:0.2;" , 'data-id':'cadre_table_'+tableau_des_elements[tableau_des_elements.length-1].id}};
                                 position_xy_table[0]+=30;
                                 position_xy_table[1]+=30;

                             }else if(tableau_des_elements.length>0 && tableau_des_elements[tableau_des_elements.length-1].type==='fields'){
                                 if(position_xy_champ[1]===0){
                                     this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:indice_courant ,id_parent:indice_table_en_cours , proprietes:{transform:'translate('+position_xy_champ[0]+','+position_xy_champ[1]+')','data-id':'conteneur_champ_'+j}};
                                     this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:indice_courant ,id_parent:indice_courant-1      , proprietes:{x:1,y:1,width:18,height:6,style:"stroke:hotpink;stroke-opacity:1;stroke-width:1;fill:pink;fill-opacity:0.2;" , 'data-id':'cadre_champ_'+j}};
                                     position_xy_champ[0]+=0;
                                     position_xy_champ[1]+=7;
                                 }


                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'g'   ,id:indice_courant ,id_parent:indice_table_en_cours , proprietes:{transform:'translate('+position_xy_champ[0]+','+position_xy_champ[1]+')','data-id':'conteneur_champ_'+j}};
                                 this.#arbre[i].arbre_svg[indice_courant++]={type:'rect',id:indice_courant ,id_parent:indice_courant-1      , proprietes:{x:1,y:1,width:18,height:6,style:"stroke:green;stroke-opacity:1;stroke-width:1;fill:pink;fill-opacity:0.2;" , 'data-id':'cadre_champ_'+j}};
                                 position_xy_champ[0]+=0;
                                 position_xy_champ[1]+=7;
                              
                              
                             }
                             
                            }
                            /*
                            
                            */
                        }
                    }
                }
                console.log('this.#arbre=',this.#arbre)
                
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