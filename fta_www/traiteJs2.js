'use strict';
var
 a=1,
 b=2;
 console.log(a,b);

//=================================================================================================
function ExploseBlocEnTableau(tab1,indin,source){
 var tab2=[];
 var niveauAccolade=0;
 var niveauParenthese=0;
 var niveauCrochet=0;
 var typeElement='';
 var i=0;
 var j=0;
 var l01=source.length;
 var dansConstante=false;
 var typeConstante='';
 var dansCommentaireLigne=false;
 var dansCommentaireBloc=false;
 var dansVariable=false;
 var c0='';
 var c0m1=''; // caractère précédent
 var finConstante=false;
 var debutPrecedent=0;
 var chaine1='';
 var ind=-1;
 
 
 for(i=0;i<l01;i++){
  c0=source.substr(i,1);
  if(i>1){
   c0m1=source.substr(i-1,1);
  }
  
  if(dansConstante===true){
   finConstante=false;
   if(      c0=="'" && typeConstante=="'" && c0m1!=='\\' ){
    finConstante=true;
   }else if(c0=='"' && typeConstante=='"' && c0m1!=='\\' ){
    finConstante=true;
   }else if(c0=='`' && typeConstante=='`' && c0m1!=='\\' ){
    finConstante=true;
   }
   if(finConstante===true){
    dansConstante=false;
    chaine1+=c0;
    ind++;
    //         0   1              2                3             4 5           6
    tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
    chaine1='';
   }else{
    chaine1+=c0;
   }

  }else if(dansCommentaireLigne===true){
   if(c0=='\r' || c0=='\n'){
    dansCommentaireLigne=false;
   }    
  }else if(dansCommentaireBloc===true){
   
   if(c0m1=='*' && c0=='/' ){
    debutPrecedent=i+1;
    dansCommentaireBloc=false;
   }
   
  }else{
   if(c0=="'" || c0=='"' || c0=='`' ){
    chaine1+=c0;
    dansConstante=true;
    typeConstante=c0;

   }else if(c0=='/'){
    if(c0m1=='/'){
     dansCommentaireLigne=true;
    }else{
     chaine1+=c0;;
    }

   }else if(c0=='*'){
    if(c0m1=='/'){
     dansCommentaireBloc=true;
    }

   }else if(c0=='('){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'debutFonction',chaine1]);
     chaine1='';

    }
    dansVariable=false;
    niveauParenthese++;
   }else if(c0==')'){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    niveauParenthese--;
    dansVariable=false;

   }else if(c0=='['){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    niveauCrochet++;
   }else if(c0==']'){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    niveauCrochet--;

   }else if(c0=='{'){
    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }

    chaine1='';
    niveauAccolade++;
    dansVariable=false;

   }else if(c0=='}'){

    if(chaine1!=''){
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     chaine1='';
    }
    niveauAccolade--;
    dansVariable=false;

   }else if(c0=='=' || c0==',' || c0==';'){
    if(chaine1!=''){
     ind++;
     if(dansVariable===true && c0=='=' && tab2[tab2.length-1][6]==',' ){
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'debutVariable',chaine1]);
     }else if(c0==';'){
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
      dansVariable=false;
     }else{
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     }

     chaine1='';
     ind++;
     tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,c0]);
    }
   }else if(c0==' ' || c0=='\r'  || c0=='\n'  || c0=='\t' ){
    if(chaine1!=''){
     ind++;
     //         0   1              2                3             4 5
     if(chaine1=='var'){
      dansVariable=true;
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,'debutVariable',chaine1]);
     }else{
      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);
     }
     chaine1='';
    }
   }else{
    chaine1+=c0;
   }
  }
 }
 return {'status':true,'value':tab2};
//                 0   1              2                3             4 5           6
//      tab2.push([ind,niveauAccolade,niveauParenthese,niveauCrochet,0,typeElement,chaine1]);

 
}

//=================================================================================================
function analyseBloc(tab1,indin){
 
 // analyse un bloc de fonctions
 
/*
=====================================================================================
On ne traite pas les sources if et for qui n'encadrent pas le code dans de {}

L'exemple suivant est valide d'un point de vue js mais est complètement pourri !

var a=1;
function b(){
 return 1;
}

if(a == b(function(){var c=(1+2);})
/ * un espace volontaire est ajouté en début et fin de ce commentaire entre les / et les *  * /
)
 a=2 ,console.log('aa=',a); // virgule ou retour à la ligne
 
=====================================================================================
 
 
*/
 
 
 var t='';
 
 
 var source=tab1[indin][1];
 var obj1=ExploseBlocEnTableau(tab1,indin,source);
 if(obj1.status===true){
  console.log(' 0   1              2                3             4 5    6');
  console.log('[ind,niveauAccolade,niveauParenthese,niveauCrochet,0,type,chaine1]');
  console.log(obj1.value);
 }
 
 
 
 
 return {'status':true,'value':t};
}

//=================================================================================================
function analyseRacine(source){
 // analyse un source à partir de la facine pour le séparer en blocs de fonctions
 var tab1=[];
 var niveau=0;
 var i=0;
 var j=0;
 var l01=source.length;
 var dansConstante=false;
 var typeConstante='';
 var dansCommentaireLigne=false;
 var dansCommentaireBloc=false;
 var c0='';
 var c0m1=''; // caractère précédent
 var finConstante=false;
 var debutPrecedent=0;
 var chaine1='';
 var chaineTotale='';

 
 tab1.push(['racine','']);

 
 for(i=0;i<l01;i++){
  c0=source.substr(i,1);
  if(i>1){
   c0m1=source.substr(i-1,1);
  }
  
  if(dansConstante===true){
   finConstante=false;
   if(      c0=="'" && typeConstante=="'" && c0m1!=='\\' ){
    finConstante=true;
   }else if(c0=='"' && typeConstante=='"' && c0m1!=='\\' ){
    finConstante=true;
   }else if(c0=='`' && typeConstante=='`' && c0m1!=='\\' ){
    finConstante=true;
   }
   if(finConstante===true){
    dansConstante=false;
   }else{
    chaine1='';
   }
   chaineTotale+=c0;

  }else if(dansCommentaireLigne===true){
   if(c0=='\r' || c0=='\n'){
    dansCommentaireLigne=false;
   }    
   chaineTotale+=c0;
  }else if(dansCommentaireBloc===true){
   chaineTotale+=c0;
   
   if(niveau==0 && c0m1=='*' && c0=='/' ){
    tab1[tab1.length-1][1]=source.substr(debutPrecedent,i-debutPrecedent+1);
    chaineTotale='';
    debutPrecedent=i+1;
    dansCommentaireBloc=false;
   }
   
  }else{
   if(c0=="'" || c0=='"' || c0=='`' ){
    chaineTotale+=c0;
    chaine1='';
    dansConstante=true;
    typeConstante=c0;

   }else if(c0=='/'){
    chaineTotale+=c0;
    if(c0m1=='/'){
     dansCommentaireLigne=true;
    }else{
     chaine1='';
    }

   }else if(c0=='*'){
    chaineTotale+=c0;
    if(c0m1=='/'){
     dansCommentaireBloc=true;
     if(niveau==0){
      tab1.push(['commentaireBlocRacine','']);
      debutPrecedent=i-2;
     }
    }else{
     chaine1='';
    }

   }else if(c0=='{'){

    chaineTotale+=c0;
    chaine1+=c0;
    niveau++;

   }else if(c0=='}'){

    chaineTotale+=c0;
    chaine1+=c0;
    niveau--;
    if(niveau==0 && tab1[tab1.length-1][0]=='fonction'){
     tab1[tab1.length-1][1]=source.substr(debutPrecedent,i-debutPrecedent+1);
     debutPrecedent=i;
     chaineTotale='';
    }

   }else if(c0==' ' || c0=='\r'  || c0=='\n'  || c0=='\t'  || c0=='('  || c0==')'  || c0=='['  || c0==']'  || c0==';' ){
    
    //tout ce qui peut précéder une définition de fonction au niveau de la racine
    if(c0==' '){
     if(niveau==0 && chaine1=='function'){
      tab1[tab1.length-1][1]=source.substr(debutPrecedent,i-8);
      chaineTotale='';
      debutPrecedent=i-8;
      
      tab1.push(['fonction','']);
     }
    }
    chaineTotale+=c0;
    chaine1='';
   }else{
    chaine1+=c0;
   }
  }
 }
 if(chaineTotale!==''){
   tab1[tab1.length-1][1]=source.substr(debutPrecedent);;
 }

 return{'status':true,'value':tab1};

}
//=================================================================================================
//=================================================================================================
//=================================================================================================
function monParse(source){
 var t='';
 var i=0;
 // 1°) séparation entre racine et fonctions à la racine
 var objTableauProgramme=analyseRacine(source);
 if(objTableauProgramme.status==true){
  console.log(objTableauProgramme.value);
 }else{
  return(logerreur({'status':false,'message':'erreur dans monParse '}));
 }
 for(var i=0;i<objTableauProgramme.value.length;i++){
  if(objTableauProgramme.value[i][0]!=='commentaireBlocRacine'){
   var objBloc1=analyseBloc(objTableauProgramme.value , i);
   if(objBloc1.status===true){
    t+=objBloc1.value;
   }
  }
 }
 
 
 
 return{'status':true,'value':t};
 
}
//=================================================================================================