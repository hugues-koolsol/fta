"use strict";
/*
  =====================================================================================================================
*/
let __module_html1=null;
let __module_svg1=null;
let __module_requete_sql1=null;
/*
  document.addEventListener("DOMContentLoaded",function(event){});
*/
/*
  =====================================================================================================================
*/
window.addEventListener('load',function(){

    import('./module_interface1.js').then(function(Module){
    
        __gi1=new Module.interface1('__gi1','zone_global_messages');
        __gi1.deplace_la_zone_de_message();
        fonctionDeLaPageAppeleeQuandToutEstCharge();
        setTimeout(function(){
        
            __gi1.ajoute_de_quoi_faire_disparaitre_les_boutons_et_les_liens();
        },500);
    });
    let liste_des_scripts = document.getElementsByTagName('script');
    let i=0;
    for( i=0 ; i < liste_des_scripts.length ; i++ ){
        var element=liste_des_scripts[i];
        if(element.type && element.type === 'module'){
            if(element.src && element.src.indexOf("js/module_html.js") >= 0){
                import('./module_html.js').then(function(Module){
                
                    __module_html1=new Module.traitements_sur_html('__module_html1');
                });
            }
        }
    }
});