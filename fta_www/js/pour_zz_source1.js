"use strict";


function convertir_rev_en_html(nom_zone_source,nom_zone_genere){
 var a=dogid(nom_zone_source);
 
 var tableau1 = iterateCharacters2(a.value);
 global_messages.data.tableau=tableau1;
 var endMicro = performance.now();
 console.log('\n\n=============\nmise en tableau endMicro=',parseInt((endMicro-startMicro)*(1000),10)/(1000)+' ms');
 var startMicro = performance.now();
 var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
 if(matriceFonction.status===true){
  var objHtml=tabToHtml1(matriceFonction.value,0,false,0);
  if(objHtml.status===true){
   dogid(nom_zone_genere).value=objHtml.value
  }else{
  }
 }else{
 }
 
}
