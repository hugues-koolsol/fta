
/*
  =================================================================================
  classe permettant de gérer les éléments d'interface de cet ensemble de programmes
  =================================================================================
*/
class interface1{
 
    #nom_de_la_variable='';
    constructor(nom_de_la_variable){
        this.#nom_de_la_variable=nom_de_la_variable;
    }
    get nom_de_la_variable(){
        return this.#nom_de_la_variable
    }
    /*
     ajuste la taille d'une textarea
    */
    agrandir_ou_reduire_la_text_area(nom_de_la_textarea){
        try{
            if(document.getElementById(nom_de_la_textarea)){
                if(document.getElementById(nom_de_la_textarea).rows<=10){
                    document.getElementById(nom_de_la_textarea).rows=100;
                    document.getElementById(nom_de_la_textarea).style.height='100em';
                    document.getElementById(nom_de_la_textarea).focus();
                }else{
                    document.getElementById(nom_de_la_textarea).rows=5;
                    document.getElementById(nom_de_la_textarea).style.height='5em';
                    document.getElementById(nom_de_la_textarea).focus();
                 
                }
            }
        }catch(e){}
    }
 
    /*
      =====================================================================================================================
      fixer les dimentions des éléments de l'interface ( taille des boutons, textes ... )
      =====================================================================================================================
    */
    convertir_textearea_rev_vers_textarea_js(chp_rev_source,chp_genere_source){
     
        clearMessages('zone_global_messages');
        var a = document.getElementById(chp_rev_source);
        var startMicro=performance.now();
        
        var tableau1 = iterateCharacters2(a.value);
        global_messages.data.tableau=tableau1;
        var endMicro = performance.now();
        var startMicro = performance.now();
        var matriceFonction = functionToArray2(tableau1.out,true,false,''); 
        global_messages.data.matrice=matriceFonction;
        if(matriceFonction.status===true){
         
            var objJs=parseJavascript0(matriceFonction.value,1,0);
            
            if(objJs.status===true){
             
             dogid(chp_genere_source).value=objJs.value;
             
            }else{

              displayMessages('zone_global_messages' , chp_rev_source);
             
             
            }
            
         
         
         
        }
        
        displayMessages('zone_global_messages' , chp_rev_source);
        
     
     
    }
    /*
      =====================================================================================================================
      fixer les dimentions des éléments de l'interface ( taille des boutons, textes ... )
      =====================================================================================================================
    */
    fixer_les_dimentions(type_d_element){
     
        var ss = document.styleSheets[0];
        for( var i=ss.cssRules.length-1;i>=0;i--){

             if(ss.cssRules[i]['selectorText'] && ss.cssRules[i].selectorText.indexOf(':root')>=0){
                 var a=ss.cssRules[i].cssText.split('{');
                 try{
                      var b=a[1].split('}');
                      var c=b[0].split(';');
                      var t={};
                      for(var j=0;j<c.length;j++){
                           var d=c[j].split(':');
                           if(d.length===2){
                                if('dimension_du_texte'===type_d_element && d[0].trim()==='--yyvtrt' ){
                                     if(d[1].trim().indexOf('18')>=0){
                                         t[d[0].trim()]='12px';
                                     }else if(d[1].trim().indexOf('12')>=0){
                                         t[d[0].trim()]='14px';
                                     }else if(d[1].trim().indexOf('14')>=0){
                                         t[d[0].trim()]='16px';
                                     }else{
                                         t[d[0].trim()]='18px';                
                                     }
                                }else if('dimension_du_bouton'===type_d_element && d[0].trim()==='--yyvtrp' ){
                                     if(d[1].trim().indexOf('2')>=0){
                                         t[d[0].trim()]='4px';
                                     }else if(d[1].trim().indexOf('4')>=0){
                                         t[d[0].trim()]='6px';
                                     }else{
                                         t[d[0].trim()]='2px';                
                                     }
                                }else{
                                 t[d[0].trim()]=d[1].trim();
                                }
                           }
                      }
                      var date = new Date();
                      var dateString = date.toGMTString();
                      var cookieString = APP_KEY+'_biscuit'+'='+encodeURIComponent(JSON.stringify(t));// + dateString;
                      document.cookie = cookieString;
                      window.location=window.location;
                      return;

                 }catch(e){
                  console.log('raaah',e);
                 }
             }
        }
    } 
}

export{interface1};