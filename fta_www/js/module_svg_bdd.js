class module_svg_bdd{
 
   #nom_de_la_variable='';
   #div_svg=null;
   #svg_dessin=null;
   #taille_bordure=0;
   #id_text_area_contenant_les_donnees='';
   
   #globalDernierePositionSouris={sx:null,sy:null};
   #_dssvg={zoom1:1,viewBoxInit:[],parametres:{rayonReference:16}};
   #rayonPoint=this.#_dssvg.parametres.rayonReference/this.#_dssvg.zoom1;

   #strkWiTexteSousPoignees=this.#rayonPoint/20;
   #fontSiTexteSousPoignees=this.#rayonPoint;
   
   #hauteur_du_svg=0;
   #largeur_du_svg=0;
   
   #arbre=null;
   
   
   constructor(nom_de_la_variable , nom_de_la_div_contenant_le_svg, taille_bordure , id_text_area_contenant_les_donnees){
    this.#nom_de_la_variable=nom_de_la_variable;
    this.#div_svg=document.getElementById(nom_de_la_div_contenant_le_svg);
    this.#taille_bordure=taille_bordure;
    this.#id_text_area_contenant_les_donnees = id_text_area_contenant_les_donnees;
    
    this.#div_svg.style.maxWidth='80vw';
    this.#div_svg.style.width='80vw';
    
    this.#div_svg.style.maxHeight='80vh';
    this.#div_svg.style.height='80vh';
    
    var e=this.#div_svg.getElementsByTagName('svg');
    console.log('e=',e);
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
    
    var texte_rev=document.getElementById(this.#id_text_area_contenant_les_donnees).value;
    
    var obj=functionToArray(texte_rev,true,false,''); // quitterSiErreurNiveau,autoriserConstanteDansLaRacine,rechercheParentheseCorrespondante){
    if(obj.status===true){
     this.#arbre=obj.value;
//     console.log('this.#arbre=' , this.#arbre );
    }else{
     document.getElementById('message_dans_le_svg').style.fill='red';
     document.getElementById('message_dans_le_svg').innerHTML='Il y a eu un problème de lecture des données !';
     return;
    }
    // équivalent de getSvgTree et afficheArbre0
    
    var l01=this.#arbre.length;
    for( var i=0;i<l01;i++){
     if(this.#arbre[i][2]=='f' && this.#arbre[i][1]==='create_table'){
      for(var j=i+1;j<l01 && this.#arbre[j][3]>this.#arbre[i][3] ; j++){
       if(this.#arbre[j][7]===i){
        
         if(this.#arbre[j][1]==='n'){
          console.log(this.#arbre[j+1][1]);
         }else if(this.#arbre[j][1]==='fields'){
        
       }
      }
     }
    }
    
    
    
    this.#div_svg.addEventListener('wheel', this.zoomWheelSvg.bind(this) ,{capture:false,passive:true} );  

    
    
//    alert(1);
   }
   
   
 //========================================================================================================
 zoomWheelSvg(e){
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