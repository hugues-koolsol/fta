/*
var startMicro=performance.now();
var endMicro=performance.now();  console.log('temps=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');
*/
/*
var chaine = '  antislash \\ quot \' antislash*3+quot \\\' ';
var t=chaine.replace(/[^\\]'/g,"\\'");
alert('{'+chaine +'}\n{'+ t+'}');
*/
/*
var aa='"\'';
alert('<'+aa+'>')
var bb=aa.replace(/"/,'\\"')
var c='';
var me='c="<'+bb+'>"';
eval(me);
alert(c);
*/
/*
var aaa="\\'\"\\[]";
var bbb=aaa.replace(/\\/g,"&#92;").replace(/'/g,'&apos;').replace(/"/g,"&quot;").replace(/\[/g,"crochetOuvrant");
alert(bbb);
*/
/*=====================================================================================================================*/

function chargerSourceDeTest(){
 var t=`#( début aaaa  debut),
a(
  #(test , 👍),
  b(
    xx(
      y(
        #(dedans
          commentaire bloc
        ),
        t,
        v),
      #(aa),
      xx(
        #(dedans
          commentaire bloc
        )),
      #( bb),
      5,
      #(cc
      )
    ),
    #(comment 1),
    y(
      ' dd&nbsp;',
      #( bla
blu),
      ee,
      2,
      #( @ )
    ),
    #( comment 2 ),
    a(b())
  ),
  #(Iñtërnâtiônàà̀lizætiøn ☃ 💩 ❤ 😁 👍),
  ​f(​g​)​,
  #(👍😁💥💪👎☀🌞🟥🟩"àà")
)
a( p(/ " \\' \\" \\n \\r \\\\r \\\\n \\\\\\\\ /g) , p(" \\\\ \\" \\\\\\" \\n \\r '") , p(' \\\\ \\' \\n \\r "  ') ),
#(
p('\\\\\\' \\' \\r \\n ')


        a( p(/ " \\' \\" \\n \\r \\\\r \\\\n \\\\\\\\ /g) , p(" \\\\ \\" \\n \\r '") , p(' \\\\ \\n \\r "  ') ),

appelf(nomf(f),p(/\\\\\\\\n/g),p('\\\\n'),p('\\\\r'))
      affecte(sql , "\\r\\n \\" \\\\\\\\
      select * from toto
      "),

      affecte(sql , '\\n \\r \\\\r \\\\n 
      select * from toto
      '),

\
)
`;

 dogid('txtar1').value=t;
 var lines = t.split(/\r|\r\n|\n/);
 var count = lines.length;
 dogid('txtar1').setAttribute('rows',count+1);
 transformLeRev();
 
}
/*=====================================================================================================================*/


function transformLeRev(){
  //"àà"
  clearMessages('zone_global_messages');
  console.log('\n=========================\ndébut de transforme')
  document.getElementById('resultat1').innerHTML='';

  var a=document.getElementById('txtar1');
  localStorage.setItem("fta_indexhtml_dernier_fichier_charge", a.value);
  
  
  
  var lines = a.value.split(/\r|\r\n|\n/);
  var count = lines.length;
  a.setAttribute('rows',count+1);
  
  
  
  var beginMicro=performance.now();
  var startMicro=performance.now();
  var tableau1=iterateCharacters2(a.value);
  var endMicro=performance.now();  
  console.log('mise en tableau endMicro=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');
//  console.log(a.value.substr(4,1),a.value.length)
  
  var startMicro=performance.now();
  var matriceFonction1=functionToArray2(tableau1.out,true,false,'');
  var endMicro=performance.now();  
  console.log('analyse syntaxique endMicro=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');

  var tempsTraitement=parseInt(((endMicro-beginMicro)*1000),10)/1000+' ms'

  console.log(matriceFonction1);
//  console.log(JSON.stringify(matriceFonction1.value));
  

  document.getElementById('resultat1').innerHTML='';


  if(matriceFonction1.status===true){
  
  
    var parent=document.getElementById('resultat1');
    

    var startMicro=performance.now();
    var fonctionReecriteAvecRetour1=arrayToFunct1(matriceFonction1.value,true,false);
    var diResultatsCompactes=document.createElement('pre');
    
    if(fonctionReecriteAvecRetour1.status===true){
    
     var compacteOriginal=arrayToFunct1(matriceFonction1.value,false,false);
     
     
     var tableau2=iterateCharacters2(fonctionReecriteAvecRetour1.value);
     var matriceDeLaFonctionReecrite=functionToArray2(tableau2.out,true,false,'');
     var compacteReecrit=arrayToFunct1(matriceDeLaFonctionReecrite.value,false,false);
     
     if(compacteOriginal.status==true && compacteReecrit.status===true){
      if(compacteOriginal.value == compacteReecrit.value){
       diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:green;">👍 sources compactés Egaux</b><br />';
       diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<textarea rows="3" cols="30" style="overflow:scroll;">'+strToHtml(compacteOriginal.value)+'</textarea>';
       
        logerreur({'status':true,'message':'👍 sources compactés Egaux : ' + tempsTraitement});
       
       
      }else{
       diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">💥sources compactés différents</b>';
       logerreur({'status':false,'message':'💥sources compactés différents'});
       diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br />o='+compacteOriginal.value;
       diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br />r='+compacteReecrit.value;
      }
     
     }else{
      diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<hr /><b style="color:red;">compacteOriginal='+JSON.stringify(compacteOriginal)+'</b>';
      diResultatsCompactes.innerHTML=diResultatsCompactes.innerHTML+'<br /><b style="color:red;">compacteReecrit='+JSON.stringify(compacteReecrit)+'</b>';
     }
     
    }
    var endMicro=performance.now();  
    console.log('tests compactes=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');
    
    document.getElementById('resultat1').appendChild(diResultatsCompactes);
    
    
    
    var fonctionReecriteAvecEtColoration1=arrayToFunct1(matriceFonction1.value,true,true);
    var difonctionReecriteAvecRetour1=document.createElement('pre');
    difonctionReecriteAvecRetour1.style.fontSize='0.9em';
    if(fonctionReecriteAvecEtColoration1.status===true){
     difonctionReecriteAvecRetour1.innerHTML='<hr  />arrayToFunctNoComment2:<hr />'+fonctionReecriteAvecEtColoration1.value;
    }else{
     difonctionReecriteAvecRetour1.innerHTML='<hr />💥arrayToFunctNoComment2:'+fonctionReecriteAvecRetour1.message;
    }
    document.getElementById('resultat1').appendChild(difonctionReecriteAvecRetour1);
    
    
    var t0=document.createElement('div');
    t0.style.overflowX='scroll';
    var t1=document.createElement('table');
    ConstruitHtmlMatrice(t1,matriceFonction1);
    t0.appendChild(t1);
    document.getElementById('resultat1').appendChild(t0);
    

    var t0=document.createElement('div');
    t0.style.overflowX='scroll';
    var t2=document.createElement('table');
    ConstruitHtmlTableauCaracteres(t2,a.value,tableau1)
    t0.appendChild(t2);
    document.getElementById('resultat1').appendChild(t0);
    
    
    
  
  }else{
    var t2=document.createElement('table');
    ConstruitHtmlTableauCaracteres( t2 , a.value , tableau1 );
    document.getElementById('resultat1').appendChild(t2);
  }
  displayMessages('zone_global_messages','txtar1');

  
 
}
/*=====================================================================================================================*/
function chargerLeDernierSourceRev(){
 var fta_indexhtml_dernier_fichier_charge=localStorage.getItem("fta_indexhtml_dernier_fichier_charge");
// console.log('fta_indexhtml_dernier_fichier_charge=' , fta_indexhtml_dernier_fichier_charge );
 if(fta_indexhtml_dernier_fichier_charge!==null){
  dogid('txtar1').value=fta_indexhtml_dernier_fichier_charge;
  
  var lines = fta_indexhtml_dernier_fichier_charge.split(/\r|\r\n|\n/);
  var count = lines.length;
  dogid('txtar1').setAttribute('rows',count+1);
  
  
 }
}

chargerLeDernierSourceRev();