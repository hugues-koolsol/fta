"use strict";
/*
  =================================================================================== 
*/
function asthtml_logerreur(o){
    logerreur(o);
    if(global_messages['ranges'].length<=3){
        if((o.hasOwnProperty('element')) && (o.element.hasOwnProperty('range'))){
            global_messages['ranges'].push(o.element.range);
        }
    }
    return o;
}
/*
  =================================================================================== 
*/
function transform_text_area_rev_en_html(nom_de_la_textarea_rev,nom_de_la_textarea_html){

    __gi1.raz_des_messages();
    var a = document.getElementById(nom_de_la_textarea_rev);
    
    
    var obj1 = functionToArray2(a.value,false,true,'');
    if(obj1.__xst === true){
        
        var obj2=__module_html1.tabToHtml1(obj1.__xva,0,false,0);
        if(obj2.__xst===true){
            document.getElementById(nom_de_la_textarea_html).value=obj2.__xva;
            asthtml_logerreur({__xst:true,__xme:'html produit'});
        }else{
            asthtml_logerreur({__xst:false,__xme:'erreur de reconstruction du html'});
        }
    }else{
        asthtml_logerreur({__xst:false,__xme:'erreur pour le rev'});
    }
    __gi1.remplir_et_afficher_les_messages1('zone_global_messages', nom_de_la_textarea_rev);
    
}
/*
  =================================================================================== 
*/
//var __ht1=null;
var tabComment=[];
function transform_text_area_Html_en_rev(nom_de_la_textarea,options){
 
    try{
        var options_json=JSON.parse(options.replace(/\'/g,'"'));
        options_json['zone_source']=nom_de_la_textarea;
    }catch(e){
        console.log(e);
        asthtml_logerreur({__xst:false,__xme:'0050 convertit-html-en-rev.js erreur dans les paramètres option'});
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages', 'txtar2');
        return;
    }
 
//    console.log('=========================\ndébut de transforme');
    document.getElementById('txtar2').value='';
    document.getElementById('txtar3').value='';
//    document.getElementById('resultat1').innerHTML='';
    __gi1.raz_des_messages();
    var a = document.getElementById(nom_de_la_textarea);
    localStorage.setItem('fta_traitehtml_dernier_fichier_charge',a.value);
    var lines = a.value.split(/\r\n|\r|\n/);
    var count=lines.length;
    a.setAttribute('rows',(count+1));
    var startMicro=performance.now();
    var obj=__module_html1.TransformHtmlEnRev(a.value,0,options_json);

    if(obj.__xst == true){
        if(obj.hasOwnProperty('traitements_javascript_integres_en_cours') && obj.traitements_javascript_integres_en_cours===true){
            asthtml_logerreur({__xst:true,__xme:'conversion html OK, conversion scripts inclus en cours, soyez patient!' });
        }else{
            var endMicro=performance.now();  console.log('mise en tableau endMicro=',parseInt(((endMicro-startMicro)*1000),10)/1000+' ms');       
    //                document.getElementById('resultat1').innerHTML='<pre style="font-size:0.8em;">'+obj.value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</pre>';


            var tableau1 = iterateCharacters2(obj.__xva);
            var matriceFonction = functionToArray2(tableau1.out,true,false,'');
            if(matriceFonction.__xst === true){
                var obj2 = arrayToFunct1(matriceFonction.__xva,true,false);
                if(obj2.__xst === true){
                    document.getElementById('txtar2').value=obj2.__xva;
                }else{
                    document.getElementById('txtar2').value=obj.__xva;
                }
            }else{
                document.getElementById('txtar2').value=obj.__xva;
            }


            var obj1 = functionToArray2(obj.__xva,false,true,'');
            if(obj1.__xst === true){
                asthtml_logerreur({__xst:true,__xme:'pas d\'erreur pour le rev '+parseInt(((endMicro-startMicro)*1000),10)/1000+' ms' });
                
                var obj2=__module_html1.tabToHtml1(obj1.__xva,0,false,0);
                if(obj2.__xst===true){
                 document.getElementById('txtar3').value=obj2.__xva;
                 asthtml_logerreur({__xst:true,__xme:'html produit'});
                }else{
                 asthtml_logerreur({__xst:false,__xme:'erreur de reconstruction du html'});
                }
            }else{
                asthtml_logerreur({__xst:false,__xme:'erreur pour le rev'});
            }
            __gi1.remplir_et_afficher_les_messages1('zone_global_messages', 'txtar2');
        }
    }else{
        __gi1.remplir_et_afficher_les_messages1('zone_global_messages', 'txtar1');
    }
    
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
    document.getElementById('txtar1').value=t;
}
/*
  =================================================================================== 
*/
function chargerLeDernierSourceHTML(){
    var fta_traitehtml_dernier_fichier_charge = localStorage.getItem('fta_traitehtml_dernier_fichier_charge');
    if(fta_traitehtml_dernier_fichier_charge !== null){
        document.getElementById('txtar1').value=fta_traitehtml_dernier_fichier_charge;
    }
}
