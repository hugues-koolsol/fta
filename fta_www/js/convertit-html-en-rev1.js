"use strict";
var rangeErreurSelectionne=false;
/*
  =================================================================================== 
*/
function asthtml_logerreur(o){
    logerreur(o);
    if(rangeErreurSelectionne === false){
        if((o.hasOwnProperty('element')) && (o.element.hasOwnProperty('range'))){
            rangeErreurSelectionne=true;
            global_messages['ranges'].push(o.element.range);
        }
    }
    return o;
}
/*
  =================================================================================== 
*/
var tabComment=[];
function transformHtmlEnRev(){
    console.log('=========================\ndébut de transforme');
    document.getElementById('txtar2').value='';
    dogid('txtar3').value='';
    document.getElementById('resultat1').innerHTML='';
    clearMessages('zone_global_messages');
    var a = document.getElementById('txtar1');
    localStorage.setItem('fta_traitehtml_dernier_fichier_charge',a.value);
    var lines = mySplit(a.value , '\\r|\\r\\n|\\n');
    var count=lines.length;
    a.setAttribute('rows',(count+1));
    var obj = TransformHtmlEnRev(a.value,0);
    if(obj.status == true){
        document.getElementById('resultat1').innerHTML='<pre style="font-size:0.8em;">'+obj.value.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</pre>';
        document.getElementById('txtar2').value=obj.value;
        var obj1 = functionToArray2(obj.value,false,true,false);
        if(obj1.status === true){
            asthtml_logerreur({status:true,message:'pas d\'erreur pour le rev'});
//            debugger;
            var obj2=tabToHtml1(obj1.value,0,false,0);
            if(obj2.status===true){
             dogid('txtar3').value=obj2.value;
             asthtml_logerreur({status:true,message:'html produit'});
            }else{
             asthtml_logerreur({status:false,message:'erreur de reconstruction du html'});
            }
        }else{
            asthtml_logerreur({status:false,message:'erreur pour le rev'});
        }
    }
    displayMessages('zone_global_messages');
    rangeErreurSelectionne=false;
}
/*
  =================================================================================== 
*/
function chargerSourceDeTestHtml(){
    var t=`<html lang="fr"><head>
<title>Hello</title>
</head>
<body style="color:red;">
<p>
&lt;standars & poor's 2 tabulations entre les flèches =>		<=
</p>
  <div>
    <a biza-rre href="www.example.com" style="color:red;" onclick="alert('1');alert(&quot;2&quot;)" class>test</a>
 <a href="www.example.com" style="" class>lien</a>

  </div>
<script>
function monAlerte(a){
  alert(a);
}
monAlerte(0)
</script>  
</body></head>`;
    dogid('txtar1').value=t;
}
/*
  =================================================================================== 
*/
function chargerLeDernierSourceHTML(){
    var fta_traitehtml_dernier_fichier_charge = localStorage.getItem('fta_traitehtml_dernier_fichier_charge');
    if(fta_traitehtml_dernier_fichier_charge !== null){
        dogid('txtar1').value=fta_traitehtml_dernier_fichier_charge;
    }
}
