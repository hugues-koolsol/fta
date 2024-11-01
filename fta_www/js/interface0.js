"use strict";
//var global_programme_en_arriere_plan=null;
/*
  
  =====================================================================================================================
  si il y a des web workers qui ne sont pas terminés, il faut les relancer
  =====================================================================================================================
*/
/*
function recuperer_les_travaux_en_arriere_plan_de_la_session(){
    if(NOMBRE_DE_TRAVAUX_EN_ARRIERE_PLAN > 0){
        var r= new XMLHttpRequest();
        r.open("POST",'za_ajax.php?recuperer_les_travaux_en_arriere_plan_de_la_session',true);
        r.timeout=6000;
        r.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        r.onreadystatechange=function(){
            if((r.readyState != 4) || (r.status != 200)){
                if(r.status == 404){
                    console.log('404 : Verifiez l\'url de l\'appel AJAX ',r.responseURL);
                }else if(r.status == 500){
                    if(global_messages['e500logged'] == false){
                        try{
                            console.log('r=',r);
                        }catch(e){
                        }
                    }
                }
                return;
            }
            try{
                var jsonRet = JSON.parse(r.responseText);
                if(jsonRet.status == 'OK'){
                    console.log('il y a des travaux en arrière plan',jsonRet.valeur);
                    var tableau_des_travaux = [];
                    var i={};
                    for(i in jsonRet.valeur){
                        console.log(jsonRet.valeur[i]);
                        tableau_des_travaux.push(jsonRet.valeur[i]);
                    }
                    if( !(window.Worker)){
                        return;
                    }
                    if(global_programme_en_arriere_plan === null){
                        global_programme_en_arriere_plan= new Worker("./js/module_travail_en_arriere_plan0.js");
                    }
                    global_programme_en_arriere_plan.postMessage({'type_de_message':'integrer_les_travaux_en_session','tableau_des_travaux':tableau_des_travaux});
                    return;
                }else{
                    return;
                }
            }catch(e){
                console.log('r=',r);
                return;
            }
        };
        r.onerror=function(e){
            console.error('e=',e);
            return;
        };
        r.ontimeout=function(e){
            console.error('e=',e);
            return;
        };
        var ajax_param={'call':{'lib':'php','file':'session','funct':'recuperer_les_travaux_en_arriere_plan_de_la_session'}};
        try{
            r.send(('ajax_param=' + encodeURIComponent(JSON.stringify(ajax_param))));
        }catch(e){
            console.error('e=',e);
            return({status:false});
        }
    }
    return({status:true});
}
*/



/*
  =====================================================================================================================
*/
var __gi1=null;
var __module_html1=null;
var __module_svg1=null;
var __module_requete_sql1=null;
/*
document.addEventListener("DOMContentLoaded", function(event) { 
    
});
*/
/*
  =====================================================================================================================
*/
window.addEventListener('load',function(){
 
    import('./module_interface1.js').then(function(Module){
        
        __gi1= new Module.interface1('__gi1' , 'zone_global_messages');
//        console.log('__gi1 est initialisé')
        __gi1.deplace_la_zone_de_message();
        fonctionDeLaPageAppeleeQuandToutEstCharge();
        setTimeout(
         function(){__gi1.ajoute_de_quoi_faire_disparaitre_les_boutons_et_les_liens();},
         500
        );
    });
     
    var liste_des_scripts = document.getElementsByTagName('script');
    var i=0;
    for(i=0;i < liste_des_scripts.length;i++){
        var element=liste_des_scripts[i];
        if((element.type) && (element.type === 'module')){
            if((element.src) && (element.src.indexOf("js/module_html.js") >= 0)){
                import('./module_html.js').then(function(Module){
                    __module_html1= new Module.traitements_sur_html('__module_html1');
                });
            }
        }
    }
    
});