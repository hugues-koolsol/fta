"use strict";
var rangeErreurSelectionne=false;
function jumpToRange(debut,fin){
    var zoneSource = dogid('txtar1');
    zoneSource.select();
    zoneSource.selectionStart=debut;
    zoneSource.selectionEnd=fin;
    var texteDebut = zoneSource.value.substr(0,debut);
    var texteFin = zoneSource.value.substr(debut);
    zoneSource.value=texteDebut;
    zoneSource.scrollTo(0,9999999);
    var nouveauScroll=zoneSource.scrollTop;
    zoneSource.value=texteDebut+texteFin;
    if(nouveauScroll > 50){
        zoneSource.scrollTo(0,(nouveauScroll+50));
    }else{
        zoneSource.scrollTo(0,0);
    }
    zoneSource.selectionStart=debut;
    zoneSource.selectionEnd=fin;
}

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



var tabComment=[];
function transformHtmlEnRev(){
    console.log('=========================\ndébut de transforme');
    document.getElementById('txtar2').value='';
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
        var obj1 = functionToArray2(obj.value,false,true); //functionToArray(obj.value,true);
        if(obj.status === true){
            asthtml_logerreur({status:true,message:'pas d\'erreur pour le rev'});
        }else{
            asthtml_logerreur({status:false,message:'erreur pour le rev'});
        }
    }
    displayMessages('zone_global_messages');
    rangeErreurSelectionne=false;
}
function chargerSourceDeTest(){
    var t=`<head>
<title>Hello</title>
</head>
<body style="color:red;">
  <div>
    <a biza-rre href="www.example.com" style="color:red;" onclick="alert('1')" class>test</a>
 <a href="www.example.com" style="" class>&lt;standars & poor's</a>

  </div>
</body>`;
    dogid('txtar1').value=t;
}
function chargerLeDernierSourceHTML(){
    var fta_traitehtml_dernier_fichier_charge = localStorage.getItem('fta_traitehtml_dernier_fichier_charge');
    if(fta_traitehtml_dernier_fichier_charge !== null){
        dogid('txtar1').value=fta_traitehtml_dernier_fichier_charge;
    }
}
