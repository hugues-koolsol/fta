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
//var __ht1=null;
var tabComment=[];
function transform_text_area_Html_en_rev(nom_de_la_textarea){
 
    console.log('=========================\ndébut de transforme');
    document.getElementById('txtar2').value='';
    dogid('txtar3').value='';
//    document.getElementById('resultat1').innerHTML='';
    clearMessages('zone_global_messages');
    var a = document.getElementById(nom_de_la_textarea);
    localStorage.setItem('fta_traitehtml_dernier_fichier_charge',a.value);
    var lines = a.value.split(/\r\n|\r|\n/);
    var count=lines.length;
    a.setAttribute('rows',(count+1));
    var startMicro=performance.now();
    var obj=__module_html1.TransformHtmlEnRev(a.value,0);

    if(obj.status == true){
        var endMicro=performance.now();  console.log('mise en tableau endMicro=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');       
//                document.getElementById('resultat1').innerHTML='<pre style="font-size:0.8em;">'+obj.value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</pre>';
        document.getElementById('txtar2').value=obj.value;
        var obj1 = functionToArray2(obj.value,false,true,'');
        if(obj1.status === true){
            asthtml_logerreur({status:true,message:'pas d\'erreur pour le rev '+parseInt(((endMicro-startMicro)*1000),10)/1000+' ms' });
            
            var obj2=__module_html1.tabToHtml1(obj1.value,0,false,0);
            if(obj2.status===true){
             dogid('txtar3').value=obj2.value;
             asthtml_logerreur({status:true,message:'html produit'});
            }else{
             asthtml_logerreur({status:false,message:'erreur de reconstruction du html'});
            }
        }else{
            asthtml_logerreur({status:false,message:'erreur pour le rev'});
        }
        displayMessages('zone_global_messages', 'txtar2');
    }else{
        displayMessages('zone_global_messages', 'txtar1');
    }
    rangeErreurSelectionne=false;
    
    return;
    
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
